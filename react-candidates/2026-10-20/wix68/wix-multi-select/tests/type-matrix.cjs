'use strict';
// Independent implementation/declaration lanes. No installs, builds, or package writes.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const dependencies = process.env.LOCAL_DEPENDENCIES && path.resolve(process.env.LOCAL_DEPENDENCIES);
if (!dependencies) throw Error('Set LOCAL_DEPENDENCIES to the existing local node_modules. No install is performed.');
const packageRoot = path.resolve(process.env.PACKAGE_ROOT || path.join(__dirname, '..'));
const fixture = path.join(__dirname, 'types.tsx');
const examplesRoot = path.resolve(process.env.EXAMPLES_ROOT || path.join(__dirname, '../examples'));
const exampleFiles = ['PacketDesk.tsx', 'palette-packet.ts', 'styles.d.ts'];
const sourceFiles = ['src/index.tsx', 'src/types.ts'];
const declarationFiles = ['src/index.d.ts', 'src/types.ts'];
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const required = ['package.json', 'src/styles.css', ...new Set([...sourceFiles, ...declarationFiles])];
for (const file of required) if (!fs.existsSync(path.join(packageRoot, file))) throw Error(`Missing tested package file: ${file}`);
const tracked = [...new Set([...required.map(file => path.join(packageRoot, file)), fixture, __filename, ...exampleFiles.map(file => path.join(examplesRoot, file))])];
const before = Object.fromEntries(tracked.map(file => [file, sha(file)]));
const fixtureText = fs.readFileSync(fixture, 'utf8');
const negativeCases = fixtureText.split(/\r?\n/).flatMap((line, index, lines) => {
  const match = line.match(/^\s*\/\/ @ts-expect-error (N\d+) (.+)$/);
  if (!match) return [];
  if (!lines[index + 1]?.trim() || lines[index + 1].trim().startsWith('//')) throw Error(`No immediate code for ${match[1]}.`);
  return [{ id: match[1], reason: match[2], directiveLine: index + 1, codeLine: index + 2 }];
});
if (negativeCases.length < 100) throw Error(`Only ${negativeCases.length} negative cases; at least 100 required.`);
if (new Set(negativeCases.map(item => item.id)).size !== negativeCases.length) throw Error('Negative case IDs must be unique.');
if ((fixtureText.match(/@ts-expect-error/g) || []).length !== negativeCases.length) throw Error('Every suppression must have a unique audited ID.');
const compiler = path.join(dependencies, 'typescript/bin/tsc');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'wix-multi-select-types-'));
const cases = [];
function run(cwd, config) {
  const result = spawnSync(process.execPath, [compiler, '-p', config, '--pretty', 'false', '--listFiles'], { cwd, encoding: 'utf8', maxBuffer: 24 * 1024 * 1024, env: { ...process.env, NODE_PATH: dependencies } });
  const output = `${result.stdout || ''}${result.stderr || ''}`;
  const loadedFiles = output.split(/\r?\n/).filter(file => path.isAbsolute(file) && fs.existsSync(file)).map(file => fs.realpathSync(file));
  const diagnostics = output.split(/\r?\n/).filter(line => line.trim() && !(path.isAbsolute(line) && fs.existsSync(line)));
  return { exitCode: result.status, signal: result.signal, output, loadedFiles, diagnostics, error: result.error?.message || null };
}
try {
  for (const surface of ['source', 'exports']) for (const resolution of ['NodeNext', 'Bundler']) {
    const cwd = path.join(temp, `${surface}-${resolution}`);
    fs.mkdirSync(path.join(cwd, 'node_modules', '@studio'), { recursive: true });
    for (const dep of ['react', 'react-dom', '@types', 'csstype']) {
      const target = path.join(dependencies, dep);
      if (fs.existsSync(target)) fs.symlinkSync(target, path.join(cwd, 'node_modules', dep), 'dir');
    }
    const stagedRoot = path.join(cwd, 'node_modules', '@studio', 'wix-multi-select');
    fs.mkdirSync(path.join(stagedRoot, 'src'), { recursive: true });
    const stagedFiles = ['package.json', ...(surface === 'source' ? sourceFiles : declarationFiles)];
    for (const file of stagedFiles) fs.copyFileSync(path.join(packageRoot, file), path.join(stagedRoot, file));
    fs.writeFileSync(path.join(cwd, 'package.json'), JSON.stringify({ private: true, type: 'module' }));
    const specifier = surface === 'source' ? './node_modules/@studio/wix-multi-select/src/index.js' : '@studio/wix-multi-select';
    const stagedFixture = fixtureText.replace("'../src/index.js'", JSON.stringify(specifier));
    if (stagedFixture === fixtureText) throw Error('Fixture public API import marker missing.');
    fs.writeFileSync(path.join(cwd, 'types.tsx'), stagedFixture);
    for (const file of exampleFiles) fs.copyFileSync(path.join(examplesRoot, file), path.join(cwd, file));
    const compilerOptions = {
      target: 'ES2022', module: resolution === 'NodeNext' ? 'NodeNext' : 'ESNext', moduleResolution: resolution,
      jsx: 'react-jsx', strict: true, exactOptionalPropertyTypes: true, noEmit: true, skipLibCheck: false,
      lib: ['ES2022', 'DOM', 'DOM.Iterable'], types: ['react', 'react-dom'],
      ...(surface === 'source' ? { paths: { '@studio/wix-multi-select': ['./node_modules/@studio/wix-multi-select/src/index.tsx'] } } : {}),
    };
    const config = { compilerOptions, files: ['types.tsx', ...exampleFiles] };
    fs.writeFileSync(path.join(cwd, 'tsconfig.json'), JSON.stringify(config));
    const result = run(cwd, 'tsconfig.json');
    const loadedSurface = result.loadedFiles.filter(file => file.startsWith(stagedRoot + path.sep)).map(file => path.relative(stagedRoot, file));
    const stagedBytesVerified = stagedFiles.every(file => sha(path.join(packageRoot, file)) === sha(path.join(stagedRoot, file))) &&
      exampleFiles.every(file => sha(path.join(examplesRoot, file)) === sha(path.join(cwd, file)));
    const rightSurface = surface === 'source'
      ? loadedSurface.includes('src/index.tsx') && !loadedSurface.includes('src/index.d.ts') && !fs.existsSync(path.join(stagedRoot, 'src/index.d.ts'))
      : loadedSurface.includes('src/index.d.ts') && !loadedSurface.includes('src/index.tsx') && !fs.existsSync(path.join(stagedRoot, 'src/index.tsx'));
    const exampleCompiled = exampleFiles.every(file => result.loadedFiles.includes(path.join(cwd, file)));
    // Each directive is stripped while preserving its line. Every rejection must
    // independently produce a diagnostic on its own immediate code line. A failed
    // compiler invocation, unrelated error, or unused directive earns no credit.
    const unsuppressed = stagedFixture.replace(/^[ \t]*\/\/ @ts-expect-error (N\d+) (.+)$/gm, '// Negative diagnostic audit: $1 $2');
    if (unsuppressed.includes('@ts-expect-error')) throw Error('An unaudited suppression survived.');
    fs.writeFileSync(path.join(cwd, 'types-unsuppressed.tsx'), unsuppressed);
    fs.writeFileSync(path.join(cwd, 'tsconfig-unsuppressed.json'), JSON.stringify({ ...config, files: ['types-unsuppressed.tsx', ...exampleFiles] }));
    const audit = run(cwd, 'tsconfig-unsuppressed.json');
    const negativeDiagnostics = [...audit.output.matchAll(/types-unsuppressed\.tsx\((\d+),(\d+)\): error (TS\d+): ([^\n]+)/g)]
      .map(match => ({ line: Number(match[1]), column: Number(match[2]), code: match[3], message: match[4] }));
    const negativeResults = negativeCases.map(item => ({ ...item, diagnosticCodes: negativeDiagnostics.filter(diagnostic => diagnostic.line === item.codeLine).map(diagnostic => diagnostic.code) }));
    const unprovenNegativeCases = negativeResults.filter(item => item.diagnosticCodes.length === 0);
    const expectedLines = new Set(negativeCases.map(item => item.codeLine));
    const unexpectedDiagnosticLines = negativeDiagnostics.filter(item => !expectedLines.has(item.line));
    const otherAuditErrors = audit.diagnostics.filter(line => /error TS\d+:/.test(line) && !/^types-unsuppressed\.tsx\(/.test(line));
    const negativeAuditVerified = audit.exitCode !== 0 && audit.exitCode !== null && !audit.error && !audit.signal &&
      !unprovenNegativeCases.length && !unexpectedDiagnosticLines.length && !otherAuditErrors.length;
    cases.push({ name: `${surface}:${resolution}`, status: result.exitCode === 0 && !result.error && !result.signal && rightSurface && stagedBytesVerified && exampleCompiled && negativeAuditVerified ? 'PASS' : 'FAIL', exitCode: result.exitCode,
      strict: true, exactOptionalPropertyTypes: true, noBaseUrl: !Object.hasOwn(compilerOptions, 'baseUrl'), negativeCases: negativeCases.length,
      isolatedSurfaceVerified: rightSurface, stagedBytesVerified, stagedFiles, loadedSurface, selectedFiles: loadedSurface.map(file => path.join(packageRoot, file)),
      loadedFiles: result.loadedFiles, exampleCompiled, exampleFiles, negativeAuditVerified, negativeAuditExitCode: audit.exitCode,
      negativeResults, negativeDiagnostics, unprovenNegativeCases, unexpectedDiagnosticLines, otherAuditErrors, diagnostics: result.diagnostics, processError: result.error });
  }
} finally { fs.rmSync(temp, { recursive: true, force: true }); }
const after = Object.fromEntries(tracked.map(file => [file, sha(file)]));
const drift = Object.keys(before).filter(file => before[file] !== after[file]);
const report = {
  suite: 'wix-multi-select strict implementation/public API and full-source PacketDesk example', packageRoot, examplesRoot, dependencies,
  evidenceKind: process.env.PACKAGE_ROOT ? 'supplied-package-root; archive provenance must be established by caller' : 'source-tree-preflight',
  versions: Object.fromEntries(['typescript', 'react', 'react-dom'].map(dep => [dep, require(path.join(dependencies, dep, 'package.json')).version])),
  filtered: false, caseFilter: null, negativeCasesPerLane: negativeCases.length, independentlyDiagnosedRejections: cases.reduce((sum, item) => sum + item.negativeResults.filter(test => test.diagnosticCodes.length).length, 0),
  cases, hashesBefore: before, hashesAfter: after, drift,
  scope: 'Static strict types only. All suppressions are stripped and audited by exact code line. Full PacketDesk plus helper and CSS module declaration compile in every isolated lane. Runtime duplicate, sparse, nonempty, event, DOM, and browser guarantees are outside static type proof. Temporary trees are removed.',
  passed: cases.length === 4 && !drift.length && cases.every(item => item.status === 'PASS'),
};
const reportPath = path.resolve(process.env.REPORT_PATH || path.join(os.tmpdir(), 'wix-multi-select-type-matrix-report.json'));
if (tracked.includes(reportPath)) throw Error('REPORT_PATH cannot overwrite an input.');
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ passed: report.passed, lanes: cases.length, negativeCasesPerLane: negativeCases.length, independentlyDiagnosedRejections: report.independentlyDiagnosedRejections, drift, reportPath }));
for (const item of cases.filter(item => item.status !== 'PASS')) console.error(JSON.stringify({ name: item.name, diagnostics: item.diagnostics, unprovenNegativeCases: item.unprovenNegativeCases, unexpectedDiagnosticLines: item.unexpectedDiagnosticLines, otherAuditErrors: item.otherAuditErrors, isolatedSurfaceVerified: item.isolatedSurfaceVerified, exampleCompiled: item.exampleCompiled }, null, 2));
if (!report.passed) process.exitCode = 1;
