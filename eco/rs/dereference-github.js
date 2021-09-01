const deps = require('./deps.json');
const lib = require(`${__dirname}/../../lib`);

for ([org_repo, count] of Object.entries(deps)) {
  let [org, repo] = org_repo.split('/');
  let count = deps[org_repo];
  lib.record('rs', org, repo, count)
}

lib.dump();
