const deps = require('./deps.json');
const got = require('got');
const fs = require('fs');
const lib = require(`${__dirname}/../../lib`);

async function refresh(name) {
	name = name.toLowerCase();
  let encodedName = encodeURIComponent(name);
  let filepath = `${__dirname}/packagist/${encodedName}.json`
  if (fs.existsSync(filepath)) {
	  console.log(`have ${name}`);
  } else {
    let response;
    try {
      response = await got(`https://repo.packagist.org/p2/${encodedName}.json`);
    } catch (error) {
      if (error.response.statusCode === 404) {
        console.log(`404 ${name}`);
      } else {
        console.error(error);
        console.log(`fail ${name}`);
      }
      return;
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
      let url = pkg.packages[name][0].source.url || '';
      let ref = lib.dereference([url]);
      if (ref) {
        lib.record('php', ref.org, ref.repo, sources);
      }
    }
  }
  lib.dump();
})();
