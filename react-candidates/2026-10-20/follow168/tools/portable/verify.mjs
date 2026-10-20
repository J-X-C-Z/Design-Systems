import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';

// New portable runner. Not the archived 1259-input full-chain entrypoint.
const R=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
process.chdir(R);
const require=createRequire(import.meta.url), D=path.resolve('node_modules');
const {buildSync}=require('esbuild'), sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const W=path.join(R,'.portable');
assert(!fs.existsSync(W),'Generated .portable already exists; remove it before a new run.');
fs.mkdirSync(W);fs.mkdirSync('qa',{recursive:true});
const results={kind:'Fresh focused portable-checkout verification; not the archived full chain',node:process.version,dependencies:{},checks:[],browser:0,formalAccepted:0,fullNativeEquivalence:false};
for(const p of ['react','react-dom','esbuild','jsdom','typescript','@types/react','@types/react-dom'])results.dependencies[p]=JSON.parse(fs.readFileSync(path.join(D,p,'package.json'))).version;
const base={...process.env,LOCAL_DEPENDENCIES:D,LOCAL_TYPESCRIPT:path.join(D,'typescript/lib/tsc.js'),LOCAL_REACT_TYPES:path.join(D,'@types/react')};
const save=()=>fs.writeFileSync(W+'/result.json',JSON.stringify(results,null,2)+'\n');
function run(label,exe,args,extra={}){
 const start=Date.now();const p=spawnSync(exe,args,{cwd:R,env:{...base,...extra},encoding:'utf8',maxBuffer:16*1024*1024,timeout:300000});
 const stdout=p.stdout||'',stderr=p.stderr||'';
 const result={label,exitCode:p.status,signal:p.signal,durationMs:Date.now()-start,stdoutSha256:sha(stdout),stderrSha256:sha(stderr),lastOutput:stdout.trim().split('\n').at(-1)?.slice(-1000)||''};
 results.checks.push(result);save();console.log(label, p.status, result.lastOutput);
 if(p.status!==0){console.error(stderr.slice(-7000));throw Error(label+' failed: '+(p.error?.message||p.status));}
}
function node(label,rel,env={}){run(label,process.execPath,['--max-old-space-size=512',rel],env);}
try {
 const src=JSON.parse(fs.readFileSync('verification/frozen-source-members.json'));
 for(const f of src)assert.equal(sha(fs.readFileSync(f.path)),f.frozenSha256,f.path);
 results.exactFrozenSourceFiles=src.length;
 const ids=JSON.parse(fs.readFileSync('src/implemented-ids.json'));
 assert.equal(ids.length,168);assert.equal(new Set(ids).size,168);results.registry={candidates:168,canonical:849,remaining:681};
 node('unchanged production build','tools/build.mjs',{FOLLOW_BUILD_DIR:'.portable/build'});
 const pm=JSON.parse(fs.readFileSync('verification/frozen-package-members.json'));
 for(const f of pm.members)assert.equal(sha(fs.readFileSync('.portable/build/package/'+f.path)),f.sha256,'rebuilt package '+f.path);
 results.exactFrozenPackageMembers=pm.members.length;
 buildSync({entryPoints:['src/thirtyeighth-controls/index.jsx'],bundle:true,platform:'node',format:'cjs',external:['react','react-dom','react/jsx-runtime'],outfile:'qa/thirtyeighth-runtime.cjs'});
 buildSync({entryPoints:['.portable/build/package/index.js'],bundle:true,platform:'node',format:'cjs',external:['react','react-dom','react/jsx-runtime'],outfile:'qa/portable-package-runtime.cjs'});
 const suites=['thirtyeighth-source-identity','thirtyeighth-native-model','thirtyeighth-order-model','thirtyeighth-edge-model','thirtyeighth-availability-model','thirtyeighth-focus-form-model','thirtyeighth-cancel-owner-model','thirtyeighth-capture-owner','thirtyeighth-stale-key-default','thirtyeighth-event-redispatch','thirtyeighth-reset-dispatch','thirtyeighth-style-model','switch168-native-model','switch168-order-model'];
 for(const lane of ['source','package'])for(const suite of suites){
  const env=lane==='package'?{FOLLOW_NEXT_RUNTIME:R+'/qa/portable-package-runtime.cjs',FOLLOW_STYLE_CSS:R+'/.portable/build/package/styles.css'}:{};
  node(lane+' '+suite,'tests/'+suite+'.cjs',env);
 }
 node('source Studio new controls','tests/thirtyeighth-studio.cjs');
 run('authored-token static contrast, not rendered color','python3',['tests/thirtyeighth-contrast.py']);
 // Both source and real built package declarations; exact optional properties and no skipLibCheck.
 for(const lane of ['source','package']){
  const dir=W+'/types-'+lane;fs.mkdirSync(dir);
  for(const name of ['thirtyeighth-controls-types.tsx','thirtyeighth-example.tsx']){
   let text=fs.readFileSync('consumer/'+name,'utf8');
   if(lane==='source')text=text.replace("import '@follow-ui/react-seven/styles.css';\n",'').replaceAll("'@follow-ui/react-seven'","'../../src/index.js'");
   fs.writeFileSync(dir+'/'+name,text);
  }
  if(lane==='package'){
   fs.mkdirSync(dir+'/node_modules/@follow-ui',{recursive:true});
   fs.symlinkSync(path.relative(dir+'/node_modules/@follow-ui',W+'/build/package'),dir+'/node_modules/@follow-ui/react-seven','dir');
  }
  for(const [resolution,module] of [['bundler','esnext'],['NodeNext','NodeNext']])run(lane+' strict types '+resolution,process.execPath,[D+'/typescript/lib/tsc.js','--noEmit','--strict','--exactOptionalPropertyTypes','--moduleResolution',resolution,'--module',module,'--target','ES2022','--jsx','react-jsx',dir+'/thirtyeighth-controls-types.tsx',dir+'/thirtyeighth-example.tsx']);
 }
 // Cumulative examples are rebuilt from the package, not copied preview output.
 buildSync({entryPoints:['examples/follow-new/main.jsx'],outfile:W+'/preview/bundle.js',bundle:true,format:'iife',platform:'browser',minify:true,jsx:'automatic',alias:{'@follow-ui/react-seven/styles.css':W+'/build/package/styles.css','@follow-ui/react-seven':W+'/build/package/index.js'}});
 fs.copyFileSync('examples/follow-new/index.html',W+'/preview/index.html');
 const page={FOLLOW_PAGE_BUNDLE:W+'/preview/bundle.js',FOLLOW_PAGE_CSS:W+'/preview/bundle.css'};
 node('package Relay Workshop author page','tests/thirtyeighth-preview.cjs',page);
 node('package Specification Room terminal page','tests/thirtyeighth-specification-terminal.cjs',page);
 run('independent Specification Room page',process.execPath,['tests/thirtyeighth-specification-independent.cjs','portable',page.FOLLOW_PAGE_BUNDLE,page.FOLLOW_PAGE_CSS,W+'/specification-independent.json']);
 node('independent Relay Workshop page','qa/independent168/pages/audit-relay-workshop.cjs',{CANDIDATE:R,PAGE_JS:page.FOLLOW_PAGE_BUNDLE,PAGE_CSS:page.FOLLOW_PAGE_CSS,REVIEW_LANE:'portable',REPORT_PATH:W+'/relay-independent.json'});
 results.rebuiltPreview=Object.fromEntries(['index.html','bundle.js','bundle.css'].map(name=>{const b=fs.readFileSync(W+'/preview/'+name);return[name,{bytes:b.length,sha256:sha(b)}]}));
 results.status='passed_focused_scope';results.exclusions=['Archived 1259-input full-chain replay','Clean network dependency installation','All 177 historical test files as one aggregate suite','Real browser, trusted keyboard, layout, accessibility tree/AT','Full native parity: documented 28+4 observer boundaries remain','Switch19 readOnly state lacks aria-readonly in frozen168'];save();
 console.log('PASS focused portable scope; browser/formal acceptance remain 0.');
} catch(e){results.status='failed';results.error=e.message;save();throw e;}
