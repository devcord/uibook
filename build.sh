#!/usr/bin/env bash
#
# Build file for vue storybooks to build esm packages for npm
#
set -e

# Cleanup
rm -rf esm tmp

echo 'Compiling ESM modular build:'
# compile js and vue files
echo 'Compiling JavaScript files...'
node ./parser.js

NODE_ENV=esm babel tmp \
      --out-dir esm \

# compile sass
echo 'Compiling scss files...'
node-sass src \
  --importer ./node_modules/node-sass-package-importer/dist/cli.js \
  --output-style expanded \
  --output tmp \
  --quiet

# copy svg assets
# mkdir -p tmp/assets/svgs && cp -R src/assets/svgs tmp/assets

# compile postcss
echo 'Apply postcss transformations...'
./node_modules/.bin/postcss tmp/**/*.css --base tmp --dir esm

# Cleanup
rm -rf tmp
echo 'Done.'
echo ''
