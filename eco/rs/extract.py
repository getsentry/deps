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
    print(f'Processing {loc} ...')

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
            tmp = line.split(None, 1)[1][1:-1]  # rough parse
            dep = tmp.split('github.com/')[1].split()[0]
            deps[dep].append(loc)
        elif line[0] == '[':
            continue

json.dump(deps, open('deps.json', 'w+'))
