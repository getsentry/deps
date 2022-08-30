const deps = require('./deps.json');
const lib = require(`${__dirname}/../../lib`);

// For Rust we get GitHub links directly, no need to hit another API.
for ([org_repo, sources] of Object.entries(deps)) {
  let [org, repo] = org_repo.split('/');
  lib.record('rs', org, repo, sources)
}

lib.dump();
