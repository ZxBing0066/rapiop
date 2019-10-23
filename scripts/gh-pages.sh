#! /bin/bash

set -e

cachepath=".gh-pages-cache"

giturl="git@github.com:rapiop/rapiop.github.io.git"

echo "enter folder"
cd examples/advance

echo "clean cache path"
if [ ! -a $cachepath ]; then
    echo "exist"
    rm -rf $cachepath
fi

echo "clone gh-pages"
mkdir $cachepath
git clone $giturl $cachepath

echo "build new examples"
npm run build

echo "cp files"
cp -Rf build/* $cachepath
cp -Rf public/* $cachepath

if [ "$1" != '-p' ]; then
    echo "only build"
else
    echo "push to gh-pages"
    cd $cachepath
    git add -A
    git commit -m "docs: auto update docs"
    git push
    cd ../
fi

echo "clean cache path"
rm -rf $cachepath
