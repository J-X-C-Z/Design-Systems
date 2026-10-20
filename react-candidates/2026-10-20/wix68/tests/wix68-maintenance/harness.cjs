'use strict';
// Author regression support. No saved inputs, generated runtime copies, or package installation.
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const CANDIDATE = path.resolve(process.env.CANDIDATE || path.join(__dirname, '../..'));
const D = process.env.LOCAL_DEPENDENCIES;
if (!D || !fs.existsSync(path.join(D, 'react/package.json'))) throw new Error('Set LOCAL_DEPENDENCIES to an existing React/ReactDOM/JSDOM node_modules directory.');
const OUT = path.resolve(process.env.REPORT_DIR || path.join(CANDIDATE, 'qa/wix68-maintenance'));
const runId = process.env.MAINTENANCE_RUN_ID || `standalone-${Date.now()}-${process.pid}`;
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const families = ['menu', 'composition', 'availability', 'structure', 'content'];
function metadata(entry) {
  let dir = path.dirname(entry);
  while (true) {
    const pkg = path.join(dir, 'package.json');
    if (fs.existsSync(pkg)) {
      const json = JSON.parse(fs.readFileSync(pkg, 'utf8'));
      if (json.name?.startsWith('@studio/wix-select-')) {
        const source = path.join(dir, 'src/index.tsx');
        return { package: pkg, packageName: json.name, packageVersion: json.version, packageSha256: sha(pkg), ...(fs.existsSync(source) ? { source, sourceSha256: sha(source) } : {}) };
      }
    }
    const parent = path.dirname(dir); if (parent === dir) return {}; dir = parent;
  }
}
const inputs = families.map((family, index) => {
  const explicit = process.env[`${family.toUpperCase()}_ENTRY`];
  const root = process.env.ENTRY_ROOT && path.resolve(process.env.ENTRY_ROOT);
  const choices = explicit ? [path.resolve(explicit)] : root ? [
    path.join(root, 'node_modules', '@studio', `wix-select-${family}`, 'dist/index.cjs'),
    path.join(root, '@studio', `wix-select-${family}`, 'dist/index.cjs'),
    path.join(root, `wix-select-${family}-reset-repair`, 'dist/index.cjs'),
    path.join(root, `${family}.cjs`),
  ] : [path.join(CANDIDATE, `wix-select-${family}-reset-repair`, 'dist/index.cjs')];
  const entry = choices.find(file => fs.existsSync(file));
  if (!entry) throw new Error(`No ${family} entry. Checked: ${choices.join(', ')}`);
  const resolved = fs.realpathSync(entry);
  return { family, ids: Array.from({ length: 4 }, (_, n) => 10 + index * 4 + n), entry: resolved, runtimeSha256: sha(resolved), ...metadata(resolved) };
});
function write(filename, report) {
  const bindings = inputs.map(input => ({ ...input, runtimeUnchanged: sha(input.entry) === input.runtimeSha256, ...(input.source ? { sourceUnchanged: sha(input.source) === input.sourceSha256 } : {}), ...(input.package ? { packageUnchanged: sha(input.package) === input.packageSha256 } : {}) }));
  const stable = bindings.every(input => input.runtimeUnchanged && input.sourceUnchanged !== false && input.packageUnchanged !== false);
  report.authorSelfTest = true; report.runId = runId; report.bindings = bindings; report.inputsStable = stable;
  report.runtime = { node: process.version, react: require(path.join(D, 'react/package.json')).version, jsdom: require(path.join(D, 'jsdom/package.json')).version };
  if (!stable) report.failed = (report.failed || 0) + 1;
  report.status = report.failed || report.errors?.length ? 'FAIL' : 'PASS';
  fs.mkdirSync(OUT, { recursive: true }); fs.writeFileSync(path.join(OUT, filename), JSON.stringify(report, null, 2) + '\n');
}
module.exports = { CANDIDATE, D, OUT, inputs, sha, runId, write };
