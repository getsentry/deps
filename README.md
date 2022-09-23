# Sentry's Dependencies

This repo contains a pipeline for finding sponsorable dependencies in our key
repos ([these ones](https://open.sentry.io/structure/)). The purpose is to
inform the allocation of our annual open source funding budget.

&rarr; 💸 [**Fundable
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
1. `dereference-github` - iterate over `eco/*/deps.json` and write
   `github.json` (if there are bugs upstream you can get garbage in here; fix
upstream and rerun)
1. `get-github-details` - iterate over `github.json` and output additional info
   (funding links, stars) to `gh/{org}-{repo}.json`
1. `make-deps-csv` - iterate over `github.json`, pull details from
   `gh/{org}-{repo}.json`, and output `deps.csv`
1. `make-fundable-html` - iterate over `deps.csv`, pull details from
   `github.json` (I know, I know), and output `fundable.html`
1. Then copy/paste from Raw in the Sheet and manually clean it up into
   `submissions.csv`.
    1. lowercase URLs
    1. attempt to dereference any non-GHS/OC URLs (committers?)
    1. filter out otherwise ineligible projects/maintainers
    1. communicate with employees who proposed ineligible projects
    1. convert all OC urls to GHS if possible (dedupe)
1. Manually update `platforms.csv`.
1. Manually update `prev.csv`.
1. `collate` - fold `deps.csv`, `submissions.csv`, `platforms.csv`, and
   `prev.csv` together (using `github.json`, too) into `details.csv`.
