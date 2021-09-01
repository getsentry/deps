echo -n 'Checking for python3 ... '
python3 --version

cd eco/py
python3 -m venv --prompt="deps" venv
./venv/bin/pip install -U pip
./venv/bin/pip install requirements-parser==0.2.0
cd ../..
