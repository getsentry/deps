const deps = require('./deps.json');
const lib = require('../../lib.js');

for ([org_repo, count] of Object.entries(deps)) {
  let [org, repo] = org_repo.split('/');
  let count = deps[org_repo];
  lib.record(org, repo, count)
}

lib.dump();
