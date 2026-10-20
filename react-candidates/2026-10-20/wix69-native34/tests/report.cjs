'use strict';
const fs = require('node:fs'), path = require('node:path');
exports.writeReport = (file, data) => {
  fs.mkdirSync(path.dirname(file), {recursive:true});
  if (fs.existsSync(file)) {
    const old = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (old.status === 'FAIL' || old.passed === false) fs.copyFileSync(file, file.replace(/\.json$/, '') + '-failed-' + Date.now() + '.json');
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
};
