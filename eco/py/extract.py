import json
import os
import requirements

from collections import defaultdict
from os.path import dirname, join, realpath

os.chdir(dirname(realpath(__file__)))

deps = defaultdict(list)
for line in open('deps-files'):
    line = line.strip()
    filepath = '../../repos/ours/' + line
    with open(filepath) as fp:
        for req in requirements.parse(fp):
            dep = req.name.lower()
            deps[dep].append(line)
json.dump(deps, open('deps.json', 'w+'))
