import {JSDOM,VirtualConsole} from 'jsdom';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
const [suite,bundle]=process.argv.slice(2),require=createRequire(import.meta.url),vc=new VirtualConsole();
const dom=new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>',{url:'https://react.example.test/#follow/components',pretendToBeVisual:true,virtualConsole:vc});
const {window}=dom;const warnings=[];vc.on('jsdomError',e=>warnings.push(e.message));
for(const key of ['window','document','navigator','HTMLElement','HTMLInputElement','HTMLTextAreaElement','HTMLDialogElement','Element','Node','Event','CustomEvent','MouseEvent','KeyboardEvent','InputEvent','CompositionEvent','FormData','MutationObserver','getComputedStyle'])Object.defineProperty(globalThis,key,{configurable:true,writable:true,value:typeof window[key]==='function'&&key==='getComputedStyle'?window[key].bind(window):window[key]});
globalThis.requestAnimationFrame=window.requestAnimationFrame.bind(window);globalThis.cancelAnimationFrame=window.cancelAnimationFrame.bind(window);
globalThis.matchMedia=window.matchMedia=query=>({matches:false,media:query,onchange:null,addEventListener(){},removeEventListener(){},addListener(){},removeListener(){},dispatchEvent(){return true;}});
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
const React=await import('react'),{createRoot}=await import('react-dom/client'),{flushSync}=await import('react-dom');
const exports=await import(pathToFileURL(bundle));const api={...exports,__flushSync:flushSync};
try{const tests=require(`../tests/${suite}-tests.cjs`);const result=await tests.run(window,React,createRoot,assert,api,{flushSync});
assert.equal(window.document.querySelectorAll('[data-test-wrapper],dialog[open]').length,0,'suite cleans up mounted modal/test roots');
console.log(JSON.stringify({...result,react:React.version,jsdomWarnings:warnings}));}
finally{window.close();}
