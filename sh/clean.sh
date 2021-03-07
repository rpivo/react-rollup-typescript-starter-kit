rm -rf dist
mkdir dist
cp src/index.html dist/index.html
if [ ! -z "$(ls -A src/assets)" ]; then
  cp -r src/assets/* dist/
fi
