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
      // TODO FIX response = await got(`https://api.packagist.io/v2/package/${encodedName}`);
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
    // TODO UPDATE
    let pkg = await refresh(name);
    if (pkg) {
      let urls = pkg.collected?.metadata?.links || '';
      let ref = lib.dereference(urls);
      if (ref) {
        lib.record('js', ref.org, ref.repo, sources);
      }
    }
  }
  lib.dump();
})();
