'use strict';
process.env.NODE_ENV = process.env.TEST_REACT_MODE || 'production';
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto'), Module = require('node:module');
const dependencies = process.env.LOCAL_DEPENDENCIES;
if (!dependencies) throw Error('Existing LOCAL_DEPENDENCIES required. No installs.');
process.env.NODE_PATH = dependencies; Module.Module._initPaths();
const {JSDOM} = require(path.join(dependencies, 'jsdom'));
const window = new JSDOM('<!doctype html><html><body><main id="root"></main></body></html>', {pretendToBeVisual:true}).window;
Object.assign(global, {window, document:window.document, HTMLElement:window.HTMLElement, HTMLSelectElement:window.HTMLSelectElement, FormData:window.FormData});
Object.defineProperty(global, 'navigator', {value:window.navigator, configurable:true});
const React = require(path.join(dependencies, 'react'));
const {flushSync} = require(path.join(dependencies, 'react-dom'));
const runtimeErrors = [];
const root = require(path.join(dependencies, 'react-dom/client')).createRoot(document.getElementById('root'), {onUncaughtError:error => runtimeErrors.push(String(error.stack || error))});
const packageRoot = path.resolve(process.env.PACKAGE_ROOT || path.join(__dirname, '..'));
const style = document.createElement('style'); style.textContent = fs.readFileSync(path.join(packageRoot, 'src/styles.css'), 'utf8'); document.head.appendChild(style);
const entry = path.resolve(process.env.ENTRY || path.join(packageRoot, 'src/index.tsx'));
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
function load(file, aliases = {}) {
  if (!/\.[cm]?tsx?$/.test(file)) return require(file);
  const compiled = require(path.join(dependencies, 'esbuild')).buildSync({entryPoints:[file], bundle:true, format:'cjs', platform:'node', target:'es2020', external:['react','react-dom'], alias:{...aliases, '@studio/wix-native-multiple/styles.css':path.join(packageRoot,'src/styles.css')}, loader:{'.css':'empty'}, write:false, logLevel:'error'}).outputFiles[0].text;
  const m = new Module(file, module); m.filename = file; m.paths = Module.Module._nodeModulePaths(path.dirname(file)); m._compile(compiled,file); return m.exports;
}
const api = load(entry);
let serial = 0;
function render(element) {flushSync(() => root.render(React.createElement(React.Fragment,{key:++serial},element))); return document.getElementById('root');}
const tick = () => new Promise(resolve => setTimeout(resolve,0));
exports.env = {fs,path,crypto,dependencies,window,document:window.document,React,h:React.createElement,flushSync,root,render,tick,api,packageRoot,entry,sha,load,runtimeErrors};
