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
      console.error(error.response.body);
    }
    fs.writeFileSync(filepath, response.body)
    console.log(`got  ${name}`);
  }
  return require(filepath);
}

function dereference(pkg) {
  let org, repo;
  let urls = pkg.info?.project_urls || {};
  let pat = /^https:\/\/github.com\/(?<org>[^\/]*)\/(?<repo>[^\/]*)\/?$/
  for ([_, url] of Object.entries(urls)) {
    let m = url.match(pat);
    if (m) {
      return m.groups;
    }
  }
}

(async function main() {
  let pkg;
  for ([name, count] of Object.entries(deps)) {
    pkg = await refresh(name);
    let ref = dereference(pkg);
    if (ref) {
      lib.record('py', ref.org, ref.repo, count);
    }
  }
  lib.dump();
})();
