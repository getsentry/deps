const github = require('./github.json');
const fs = require('fs');

function record(org, repo, count) {
  if (github[org] === undefined) {
    github[org] = {}
  }
  github[org][repo] = count;
}

function dump() {
  fs.writeFileSync('github.json', JSON.stringify(github));
}

module.exports = {record, dump, github};
