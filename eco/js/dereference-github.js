const deps = require('./deps.json');
const got = require('got');
const fs = require('fs');
const lib = require(`${__dirname}/../../lib`);

async function refresh(name) {
	name = name.toLowerCase();
  let encodedName = encodeURIComponent(name);
  let filepath = `${__dirname}/npm/${encodedName}.json`
  if (fs.existsSync(filepath)) {
	  console.log(`have ${name}`);
  } else {
    let response;
    try {
      response = await got(`https://api.npms.io/v2/package/${encodedName}`);
    } catch (error) {
      console.error(error);
      console.log(`fail ${name}`);
      return;
    }
    fs.writeFileSync(filepath, response.body)
    console.log(`got  ${name}`);
  }
  return require(filepath);
}

function dereference(pkg) {
  let org, repo;
  let url = pkg.collected?.metadata?.links?.repository || '';
  let pat = /^https:\/\/github.com\/(?<org>[^\/]*)\/(?<repo>[^\/]*)\/?$/
  let m = url.match(pat);
  if (m) {
    return m.groups;
  }
}

(async function main() {
  let pkg;
  for ([name, count] of Object.entries(deps)) {
    pkg = await refresh(name);
    if (pkg) {
      let ref = dereference(pkg);
      if (ref) {
        lib.record('js', ref.org, ref.repo, count);
      }
    }
  }
  lib.dump();
})();
