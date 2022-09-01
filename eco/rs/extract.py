import json
import os
import sys
from subprocess import PIPE, Popen

from collections import defaultdict
from os.path import dirname, join, realpath

os.chdir(dirname(realpath(__file__)))

deps = defaultdict(list)
for filepath in open('deps-files'):
    loc = filepath.strip()

    cmd = [
        'cargo',
        'tree',
        '--depth', '1',
        '--manifest-path', f'../../repos/ours/{loc}',
        "--format", "'{p} {r}'",
    ]
    out, err = Popen(cmd, stdout=PIPE, stderr=sys.stderr).communicate()
    out = out.decode()

    for line in out.splitlines():
        line = line.strip()
        if not line:
            continue
        elif line[0] in '├└' and 'github' in line:
            dep = line.split('github.com/')[1].split("'")[0]
            if dep.split('/', 1)[0] in ['getsentry', 'mitsuhiko', 'jan-auer']:
                continue
            if '?' in dep:
                dep = dep.split('?')[0]
            if dep.endswith('.git'):
                dep = dep.split('.git')[0]
            deps[dep].append(loc)
        elif line[0] == '[':
            continue

json.dump(deps, open('deps.json', 'w+'), sort_keys=True, indent=2)

