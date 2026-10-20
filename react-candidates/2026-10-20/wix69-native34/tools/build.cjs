'use strict';
const fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname, '..');
const dependencies = process.env.LOCAL_DEPENDENCIES;
if (!dependencies) throw Error('LOCAL_DEPENDENCIES must point at an existing toolchain. No install is performed.');
const esbuild = require(path.join(dependencies, 'esbuild'));
(async () => {
  for (const [format, file] of [['esm', 'index.js'], ['cjs', 'index.cjs']]) {
    const result = await esbuild.build({absWorkingDir: root, entryPoints: ['src/index.tsx'], outfile: 'dist/' + file,
      bundle: true, format, platform: 'neutral', target: 'es2020', external: ['react', 'react-dom'], metafile: true, logLevel: 'error'});
    fs.writeFileSync(path.join(root, 'qa', format + '-metafile.json'), JSON.stringify(result.metafile, null, 2) + '\n');
  }
  console.log('ESM and CJS built with React/React DOM external.');
})().catch(error => {console.error(error); process.exitCode = 1;});
