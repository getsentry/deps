# deps

This repo contains a pipeline for finding sponsorable dependencies for our key
ecosystems (Python, JavaScript, Rust) in our key repos ([these
ones](https://open.sentry.io/structure/)).

1. `bootstrap` - set up ecosystem runtimes
1. `clone` - clones repos in `repo-list` into `repos/`
1. `find-deps-files` - find dependency files across ecosystems, listings end up
   at `./eco/*/deps-files`
1. `extract-deps-from-files` - extracted deps (direct deps only) end up in
   `./eco/*/deps.json`, format is `{"dep": ["file1", "file2"]}` where `dep` is an
ecosystem-specific identifier, and `file*` are paths to package manifest files (relative to `./repos/ours`) in which the `dep` is mentioned
1. `dereference-github` - iterates over `eco/*/deps.json` and updates
   `github.json` (if there are bugs upstream you can get garbage in here;
remove and rerun)
1. `get-github-details` - iterates over `github.json` and outputs additional
   info (funding links, stars) to `gh/{org}-{repo}.json`
1. `make-deps-csv` - iterates over `github.json`, pulls details from
   `gh/{org}-{repo}.json`, and outputs `deps.csv`
1. `make-fundable-html` - iterates over `deps.csv`, pulls details from `github.json` (I
   know, I know), and outputs `fundable.html`
