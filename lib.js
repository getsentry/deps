const fs = require('fs');
const filepath = `${__dirname}/github.json`
const github = require(filepath);

function record(eco, org, repo, sources) {
  if (['getsentry', 'mitsuhiko'].includes(org)) {
    return;
  }
  if (github[eco] === undefined) {
    github[eco] = {};
  }
  if (github[eco][org] === undefined) {
    github[eco][org] = {};
  }
  github[eco][org][repo] = sources;
}

function dereference(urls) {
  let org, repo;
  let pat = /^https:\/\/github.com\/(?<org>[^\/]*)\/(?<repo>[^\/#]*)\/?$/
  for ([_, url] of Object.entries(urls)) {
    let m = url.match(pat);
    if (m) {
      if (m.groups.org !== 'sponsors') {
        return m.groups;
      }
    }
  }
}

function dump() {
  fs.writeFileSync(filepath, JSON.stringify(github, null, 2));
}

module.exports = {record, dereference, dump, github};
