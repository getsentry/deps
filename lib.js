const fs = require('fs');
const filepath = `${__dirname}/github.json`
const github = require(filepath);

function record(eco, org, repo, count) {
  if (github[eco] === undefined) {
    github[eco] = {};
  }
  if (github[eco][org] === undefined) {
    github[eco][org] = {};
  }
  github[eco][org][repo] = count;
}

function dump() {
  fs.writeFileSync(filepath, JSON.stringify(github));
}

module.exports = {record, dump, github};
