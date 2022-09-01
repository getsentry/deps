import json
import sys

from collections import defaultdict

deps = defaultdict(list)
for path in open('eco/rb/deps-files'):
    path = path.strip()
    gemfile = open('repos/ours/' + path)
    for line in gemfile:
        line = line.strip()
        if not line.startswith('gem '):
            continue
        parts = line.split()
        name = parts[1].replace('"', '').replace("'", '').replace(',', '')
        deps[name].append(path)
json.dump(deps, open('eco/rb/deps.json', 'w+'), indent=2, sort_keys=True)
