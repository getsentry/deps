import json
import os
import requirements

from collections import defaultdict
from os.path import dirname, join, realpath

os.chdir(dirname(realpath(__file__)))

deps = defaultdict(int)
for line in open('deps-files'):
    filepath = '../../' + line.strip()
    with open(filepath) as fp:
        for req in requirements.parse(fp):
            deps[req.name] += 1
json.dump(deps, open('deps.json', 'w+'))
