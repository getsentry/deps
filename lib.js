const fs = require('fs');
const filepath = `${__dirname}/github.json`
const github = require(filepath);

function record(eco, org, repo, sources) {
  if (['getsentry', 'mitsuhiko', 'asottile'].includes(org)) {
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
      if (m.groups.org === 'sponsors') {
        // Don't match on GitHub Sponsors URLs at this point.
        continue
      }
      if (m.groups.repo.endsWith('.git')) {
        // I couldn't get negative lookahead to work in the regex. 🤷
        // Anyway GitHub redirects these, so let's as well.
        m.groups.repo = m.groups.repo.slice(0, -4);
      }
      return m.groups;
    }
  }
}

function dump() {
  fs.writeFileSync(filepath, JSON.stringify(github, null, 2));
}

module.exports = {record, dereference, dump, github};
