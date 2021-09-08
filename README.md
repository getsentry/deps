# deps

This repo contains a pipeline for finding sponsorable dependencies for our key
ecosystems (Python, JavaScript, Rust) in our key repos ([these
ones](https://open.sentry.io/structure/)).

1. `bootstrap` - set up ecosystem runtimes
1. `clone` - clones repos in `repo-list` into `repos/`
1. `find-deps-files` - find dependency files across ecosystems, listings end up
   at `./eco/*/deps-files`
1. `extract-deps-from-files` - extracted deps (direct deps only) end up in
   `./eco/*/deps.json`, format is `{"dep": n}` where `dep` is an
ecosystem-specific identifier, and `n` is the number of mentions across all of
our dependency files
1. `get-github-details`
1. `make-deps-csv`
1. `linkate`
