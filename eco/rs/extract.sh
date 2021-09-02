cd "$(dirname $0)"

echo > cargo-tree-output
while read line; do
  cargo tree --depth 1 --manifest-path "../../repos/ours/$line" --format '{p} {r}' --offline \
    >> cargo-tree-output
  break
done < deps-files

echo '{' > deps.json
grep 'github.com' cargo-tree-output \
  | grep -v 'getsentry' \
  | grep -v 'mitsuhiko' \
  | sed -e 's|.*https://github.com/\([^ ]*\).*|\1|' \
  | sed -e 's|\(.*\)\.git|\1|' \
  | sort \
  | uniq -c \
  | sort -rn \
  | sed -e 's| *\([0-9]*\) \(.*\)|  "\2": \1,|' \
  | sed '$ s/.$//' \
  >> deps.json
echo '}' >> deps.json

cd ../..
