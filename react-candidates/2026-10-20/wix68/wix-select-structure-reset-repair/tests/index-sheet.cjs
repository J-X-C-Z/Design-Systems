'use strict';
// Author-only helper subset: same cases as index-example.cjs SUITE=helper.
process.env.SUITE = 'helper';
process.env.REPORT_PATH ||= require('node:path').join(__dirname, '../qa/index-sheet.json');
require('./index-example.cjs');
