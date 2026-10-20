'use strict';
// Static parse, selectors, declared geometry and opaque-color calculations only.
// This does not execute a browser or establish rendered/picker accessibility.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const dependencies = process.env.LOCAL_DEPENDENCIES;
if (!dependencies) throw Error('Set LOCAL_DEPENDENCIES to the existing local node_modules.');
const packageRoot = path.resolve(process.env.PACKAGE_ROOT || path.join(__dirname, '..'));
const cssPath = path.join(packageRoot, 'src/styles.css');
const css = fs.readFileSync(cssPath, 'utf8');
const checks = [];
function ok(value, message) {assert.ok(value, message); checks.push(message);}
const parsed = require(path.join(dependencies, 'esbuild')).transformSync(css, {loader: 'css', logLevel: 'silent'});
ok(parsed.code.length > 0 && parsed.warnings.length === 0, 'CSS parses without esbuild warnings');
ok(!/@import\b|url\s*\(/i.test(css), 'CSS makes no external font or resource request');
// Extract balanced rule blocks after esbuild has validated the CSS grammar.
// Braces in quoted strings/comments are skipped, so selector
// checking does not accidentally inspect declarations as if they were rules.
const rules = [];
function readBlocks(text, contexts = []) {
  let start = 0, depth = 0, opening = -1, quote = '', escaped = false, comment = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i], next = text[i + 1];
    if (comment) {if (char === '*' && next === '/') {comment = false; i++;} continue;}
    if (quote) {if (escaped) escaped = false; else if (char === '\\') escaped = true; else if (char === quote) quote = ''; continue;}
    if (char === '/' && next === '*') {comment = true; i++; continue;}
    if (char === '"' || char === "'") {quote = char; continue;}
    if (char === '{') {if (depth++ === 0) opening = i;}
    if (char === '}' && --depth === 0) {
      const selector = text.slice(start, opening).trim(), body = text.slice(opening + 1, i).trim();
      if (selector.startsWith('@')) {assert.match(selector, /^@media\b/, 'only scoped media wrappers are expected'); readBlocks(body, [...contexts, selector]);}
      else rules.push({selector, body, contexts, declarations: Object.fromEntries(body.split(';').map(value => value.trim()).filter(Boolean).map(value => {const colon = value.indexOf(':'); return [value.slice(0, colon).trim(), value.slice(colon + 1).trim()];}))});
      start = i + 1;
    }
  }
  assert.equal(depth, 0, 'balanced CSS rules');
}
readBlocks(parsed.code);
const normalized = value => value.replace(/\s+/g, '').replaceAll('"', '').replaceAll("'", '');
function rule(selector, context = null) {return rules.find(item => normalized(item.selector) === normalized(selector) && (context === null ? item.contexts.length === 0 : item.contexts.some(value => normalized(value) === normalized(context))));}
function declaration(selector, property) {const found = rule(selector); assert.ok(found, 'missing selector ' + selector); return found.declarations[property];}
function has(selector, property, expected) {ok(normalized(declaration(selector, property) || '') === normalized(expected), `${selector} declares ${property}: ${expected}`);}

const selectorParts=rules.flatMap(item=>item.selector.split(',').map(s=>s.trim()));
ok(selectorParts.length>70&&selectorParts.every(s=>/^\.wix-select-menu(?=[\s.:#\[>+~]|$)/.test(s)),'all rules scoped to exact shared root including portal');
ok(!selectorParts.some(s=>/(^|[ ,])(?:html|body|:root)(?=[\s.:#\[>+~]|$)/.test(s)),'no global document rules');
for(const id of ['10','11','12','13'])ok(rules.some(r=>r.selector.includes('data-component=select-'+id)||r.selector.includes('data-component="select-'+id+'"')),'variant '+id+' has structural geometry');
has('.wix-select-menu','max-width','22rem');has('.wix-select-menu','min-width','0');
has('.wix-select-menu .wix-sm-trigger','min-height','48px');has('.wix-select-menu .wix-sm-trigger','text-align','start');has('.wix-select-menu .wix-sm-trigger','touch-action','manipulation');has('.wix-select-menu .wix-sm-trigger','appearance','none');
has('.wix-select-menu .wix-sm-trigger:focus-visible','outline','3px solid var(--wix-sm-ink)');has('.wix-select-menu .wix-sm-trigger:focus-visible','outline-offset','3px');
has('.wix-select-menu .wix-sm-value','overflow-wrap','anywhere');has('.wix-select-menu .wix-sm-value','min-width','0');
has('.wix-select-menu.wix-sm-popup','position','fixed');has('.wix-select-menu.wix-sm-popup','z-index','1000');has('.wix-select-menu.wix-sm-popup','grid-template-rows','auto minmax(0,1fr) auto');has('.wix-select-menu.wix-sm-popup','isolation','isolate');
has('.wix-select-menu .wix-sm-listbox','overflow','auto');has('.wix-select-menu .wix-sm-listbox','overscroll-behavior','contain');has('.wix-select-menu .wix-sm-listbox','min-height','0');
has('.wix-select-menu .wix-sm-option','min-height','44px');has('.wix-select-menu .wix-sm-option','scroll-margin-block','4px');has('.wix-select-menu .wix-sm-option-label','overflow-wrap','anywhere');
has('.wix-select-menu .wix-sm-native','clip-path','inset(50%)!important');ok(!/display\s*:\s*none/.test(rule('.wix-select-menu .wix-sm-native').body),'form bridge clipped, never display none');
has('.wix-select-menu .wix-sm-scroll-up[hidden],.wix-select-menu .wix-sm-scroll-down[hidden]','display','none!important');
has('.wix-select-menu[data-component=select-10] .wix-sm-trigger','border-block-end-width','3px');has('.wix-select-menu[data-component=select-10] .wix-sm-group-label','border-block-end','1px dashed var(--wix-sm-edge)');
has('.wix-select-menu[data-component=select-11] .wix-sm-trigger','border','3px double var(--wix-sm-edge)');has('.wix-select-menu.wix-sm-popup[data-component=select-11]','border','3px double var(--wix-sm-edge)');
has('.wix-select-menu[data-component=select-12] .wix-sm-trigger','min-height','52px');has('.wix-select-menu[data-component=select-12] .wix-sm-icon','width','32px');has('.wix-select-menu[data-component=select-12] .wix-sm-icon','height','32px');
has('.wix-select-menu[data-component=select-13] .wix-sm-trigger','border-radius','3px 14px 3px 3px');has('.wix-select-menu[data-component=select-13]>.wix-sm-helper','border-inline-start','2px solid var(--wix-sm-mocha)');
for(const variant of ['10','11','12','13'])ok(rules.some(r=>r.selector.includes('select-'+variant)&&r.selector.includes(':dir(rtl)')),'explicit RTL geometry '+variant);
ok(rules.some(r=>r.contexts.some(c=>c.includes('prefers-reduced-motion'))&&r.body.includes('animation: none')),'system reduced motion disables animation');
ok(rules.some(r=>r.contexts.some(c=>c.includes('forced-colors'))),'forced colors rules present');
ok(css.includes('[data-motion=off]'),'explicit motion opt out');
function luminance(hex){const c=hex.replace('#','').match(/../g).map(h=>parseInt(h,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;}
function ratio(a,b){const x=luminance(a),y=luminance(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
for(const [foreground,background]of [['#30231e','#fffaf4'],['#6d5548','#fffaf4'],['#30231e','#f4ede3'],['#6d5548','#f4ede3'],['#30231e','#ecddcf'],['#30231e','#e8d3bf'],['#8c3528','#f8e9df']])ok(ratio(foreground,background)>=4.5,'opaque text pair '+foreground+' on '+background+' >=4.5');
const report={status:'PASS',checks,cssSha256:crypto.createHash('sha256').update(css).digest('hex'),realBrowser:false,limits:['Static parsed declarations and opaque-color arithmetic only; no rendered geometry, zoom, portal collision, native picker or AT claim.','Forced-colors and reduced-motion rules inspected, not browser executed.']};const output=process.env.REPORT_PATH||path.join(packageRoot,'qa/style.json');fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');console.log(checks.length+' custom popup CSS checks PASS; '+output);
