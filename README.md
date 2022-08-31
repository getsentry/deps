# Sentry's Dependencies

This repo contains a pipeline for finding sponsorable dependencies for our key
ecosystems (Python, JavaScript, Rust) in our key repos ([these
ones](https://open.sentry.io/structure/)). The purpose is to inform the
allocation of our annual open source funding budget.

- 💸 [**Fundable
  Dependencies**](https://raw.githack.com/getsentry/deps/main/fundable.html)
&larr; Go check 'em out!


# Building

The code here is a gnarly mashup of scripts for `zsh`, `python3`, and `node`.
You'll also need [`gh`](https://cli.github.com/) ... and probably some other
stuff? `curl`, maybe? Good luck!

1. `bootstrap` - set up ecosystem runtimes
1. `clone` - clone repos in `repo-list` into `repos/`
1. `find-deps-files` - find dependency files across ecosystems, listings end up
   at `./eco/*/deps-files`
1. `extract-deps-from-files` - extracted deps (direct deps only) end up in
   `./eco/*/deps.json`, format is `{"dep": ["file1", "file2"]}` where `dep` is
an ecosystem-specific identifier, and `file*` are paths to package manifest
files (relative to `./repos/ours`) in which the `dep` is mentioned
1. `dereference-github` - iterate over `eco/*/deps.json` and update
   `github.json` (if there are bugs upstream you can get garbage in here; fix
upstream and rerun)
1. `get-github-details` - iterate over `github.json` and output additional info
   (funding links, stars) to `gh/{org}-{repo}.json`
1. `make-deps-csv` - iterate over `github.json`, pull details from
   `gh/{org}-{repo}.json`, and output `deps.csv`
1. `make-fundable-html` - iterate over `deps.csv`, pull details from
   `github.json` (I know, I know), and output `fundable.html`
