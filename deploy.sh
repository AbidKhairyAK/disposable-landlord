#!/bin/bash

#	USAGE:
#		deploy.sh BRANCH_NAME
#
#	EXAMPLE:
#		deploy.sh main

#	you need to configure /var/www/html directory on first-time deployment
#	if you want to use that directory.
#	https://askubuntu.com/a/749705/1073892

set -e

BRANCH_NAME=${1:-}
WORKDIR=$(pwd)

if [ -z "$BRANCH_NAME" ]; then
  echo "-> missing branch name argument"
  echo "-> usage: ./deploy.sh <branch>"
  exit 1
fi

echo "-> start deploying..."
cd $WORKDIR

echo "-> pull update from github..."
git fetch origin "$BRANCH_NAME"
git checkout "$BRANCH_NAME"
git reset --hard "origin/$BRANCH_NAME"
git clean -df

echo "-> installing dependencies..."
npm ci

echo "-> building app..."
npm run build-only

echo "-> new app deployed successfully!"
