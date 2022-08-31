const deps = require('./deps.json');
const got = require('got');
const fs = require('fs');
const lib = require(`${__dirname}/../../lib`);

async function refresh(name) {
	name = name.toLowerCase();
  let filepath = `${__dirname}/pi/${name}.json`
  if (fs.existsSync(filepath)) {
	  console.log(`have ${name}`);
  } else {
    let response;
    try {
      response = await got(`https://pypi.org/pypi/${name}/json`);
    } catch (error) {
      if (error.response.statusCode === 404) {
        console.log(`404 ${name}`);
      } else {
        console.error(error);
        console.log(`fail ${name}`);
      }
      return
    }
    fs.writeFileSync(filepath, JSON.stringify(JSON.parse(response.body), null, 2))
    console.log(`got  ${name}`);
  }
  return require(filepath);
}

(async function main() {
  for ([name, sources] of Object.entries(deps)) {
    let pkg = await refresh(name);
    if (pkg) {
      let urls = pkg.info?.project_urls || {};
      let ref = lib.dereference(urls);
      if (ref) {
        lib.record('py', ref.org, ref.repo, sources);
      }
    }
  }
  lib.dump();
})();
