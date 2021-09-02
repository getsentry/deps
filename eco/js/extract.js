const fs = require('fs')
const once = require('once')
const process = require('process')

process.chdir(__dirname)

deps = {}

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('deps-files')
});

lineReader.on('line', function (line) {
  var filepath = `../../${line}`;
  var pj = require(filepath);

  for (var key of ['dependencies', 'devDependencies', 'peerDependencies']) {
    if (pj[key]) {
      for (const [name, _] of Object.entries(pj[key])) {
        if (deps[name] === undefined) {
          deps[name] = 0;
        }
        deps[name] += 1;
      }
    }
  }
});

lineReader.once('close', () => {
  fs.writeFileSync('deps.json', JSON.stringify(deps))
});
