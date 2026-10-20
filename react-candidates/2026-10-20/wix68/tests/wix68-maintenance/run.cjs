'use strict';
// One portable launcher for candidate dist or five actual consumer-package entries.
const fs = require('node:fs'), path = require('node:path'), cp = require('node:child_process');
process.env.MAINTENANCE_RUN_ID ||= `author-${Date.now()}-${process.pid}`;
const H = require('./harness.cjs');
if (process.argv.includes('--list')) { console.log(JSON.stringify({ candidate: H.CANDIDATE, inputs: H.inputs }, null, 2)); process.exit(0); }
const jobs = [
  ['reset-join.cjs', [], 'reset-join.json'],
  ['extended-reset.cjs', [], 'extended-reset.json'],
  ['reset-native-parity.cjs', [], 'reset-native-parity.json'],
  ['reset-owners.cjs', [], 'reset-owners.json'],
  ['trigger-props.cjs', ['ssr'], 'trigger-ssr.json'],
  ['trigger-props.cjs', ['dom'], 'trigger-dom.json'],
  ['focus-queue.cjs', [], 'focus-queue.json'],
  ['descriptors.cjs', ['ssr'], 'descriptor-ssr.json'],
  ['descriptors.cjs', ['dom'], 'descriptor-dom.json'],
  ['descriptor-invalid.cjs', [], 'descriptor-invalid.json'],
  ['descriptor-update.cjs', [], 'descriptor-update.json'],
];
fs.mkdirSync(H.OUT, { recursive: true });
const results = [];
for (const [script, args, filename] of jobs) {
  const result = cp.spawnSync(process.execPath, [path.join(__dirname, script), ...args], { env: { ...process.env, LOCAL_DEPENDENCIES: H.D, REPORT_DIR: H.OUT, NODE_PATH: [H.D, process.env.NODE_PATH].filter(Boolean).join(path.delimiter) }, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 });
  fs.writeFileSync(path.join(H.OUT, filename.replace(/\.json$/, '.log')), (result.stdout || '') + (result.stderr || ''));
  const reportPath = path.join(H.OUT, filename);
  const report = fs.existsSync(reportPath) ? JSON.parse(fs.readFileSync(reportPath, 'utf8')) : {};
  const validRun = report.runId === H.runId;
  const pass = result.status === 0 && validRun && report.status === 'PASS' && report.inputsStable === true;
  results.push({ script, args, status: pass ? 'PASS' : 'FAIL', exitCode: result.status, validRun, cases: report.cases, checks: report.checks, failed: report.failed, report: reportPath, ...(validRun ? { reportSha256: H.sha(reportPath) } : {}) });
  console.log(JSON.stringify(results.at(-1)));
}
const failed = results.filter(result => result.status !== 'PASS').length;
H.write('summary.json', { failed, suites: results.length, results, scope: 'Author targeted self-test, generated at runtime from selected entries. React/JSDOM only; not independent review, full package verification, or trusted-browser acceptance.' });
process.exitCode = failed ? 1 : 0;
