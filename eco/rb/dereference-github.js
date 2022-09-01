const deps = require('./deps.json');
const got = require('got');
const fs = require('fs');
const lib = require(`${__dirname}/../../lib`);

async function refresh(name) {
	name = name.toLowerCase();
  let encodedName = encodeURIComponent(name);
  let filepath = `${__dirname}/rubygems/${encodedName}.json`
  if (fs.existsSync(filepath)) {
	  console.log(`have ${name}`);
  } else {
    let response;
    try {
      response = await got(`https://rubygems.org/api/v1/gems/${encodedName}.json`);
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
      let urls = []
      for ([key, value] of Object.entries(pkg)) {
        if (key.endsWith('_uri') && value) {
          urls.push(value);
        }
      }
      let ref = lib.dereference(urls);
      if (ref) {

        // Gross hack special case
        if (ref.org === 'jondot' && ref.repo === 'benchmark-ips') {
          // https://github.com/evanphx/benchmark-ips
          // https://github.com/jondot/benchmark-ipsa 🤷
          ref.repo = 'benchmark-ipsa';
        }

        lib.record('rb', ref.org, ref.repo, sources);
      }
    }
  }
  lib.dump();
})();
