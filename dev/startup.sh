#!/bin/sh
echo "Container started at: `date`"
set -e  # halt on error
set -x  # show commands
# setup node_modules dir as symlink so it stays inside the docker container for performance reasons
if [ ! -s node_modules ]; then
  rm -f node_modules
  ln -s /tmp/node_modules
fi
if [ ! -e package.json ]; then
  # create app if nothing exists
  echo "No package.json, creating app..."
  npx create-react-app newapp
  rm -rf /tmp/node_modules
  mv newapp/node_modules /tmp/
  mv newapp/package.json newapp/yarn.lock newapp/public newapp/src newapp/.gitignore .
  rm newapp/README.md
  rmdir newapp
  cp -p package.json dev/packages.installed
elif [ ! -e yarn.lock \
    -o ! -e dev/packages.installed \
    -o dev/packages.installed -nt package.json \
    -o dev/packages.installed -ot package.json \
  ]
then
  # refresh node_modules dir when needed
  echo "DEBUG: packages.installed out of sync, installing modules..."
  [ -e dev/packages.installed ] && ls -l dev/packages.installed
  [ -e package.json ] && ls -l package.json
  # END DEBUG
  yarn install # install dependencies
  cp -p package.json dev/packages.installed
fi
# Once everything is up to date, start up the app.
nodemon --exec yarn start
