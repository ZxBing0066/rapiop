const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');
const _ = require('lodash');

const examplesPath = '../examples';
const lsResult = childProcess.execSync('ls', { cwd: path.join(__dirname, examplesPath) });
let examples = lsResult
    .toString()
    .split('\n')
    .map(v => v.trim())
    .filter(v => v);

_.each(examples, example => {
    const examplePath = path.join(__dirname, examplesPath, example);
    const rapiopPath = path.join(examplePath, 'node_modules/@rapiop/rapiop');
    if (fs.existsSync(rapiopPath)) {
        childProcess.execSync(`rm -rf ${rapiopPath}`);
    }

    childProcess.execSync(`ln -s ${path.join(process.cwd())} ${rapiopPath}`);
});
