const fs=require('fs'),vm=require('vm'),assert=require('assert');
const path=__dirname+'/';const html=fs.readFileSync(path+'specimen.html','utf8');const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];
const fixture=fs.readFileSync(path+'specimen-data.json','utf8');const checks=[];
function test(name,f){try{f();checks.push({name,status:'passed'})}catch(e){checks.push({name,status:'failed',reason:e.message})}}
new vm.Script(scripts[1][1]);test('JavaScript syntax parses',()=>assert(scripts.length===2));
const cutoff=scripts[1][1].indexOf("\ndocument.querySelectorAll('[data-scene]')");
const ctx=vm.createContext({document:{querySelector:s=>s==='#fixture'?{textContent:fixture}:{}},window:{matchMedia:()=>({matches:false})}});
vm.runInContext(scripts[1][1].slice(0,cutoff),ctx);
const run=s=>vm.runInContext(s,ctx);
test('embedded fixture exactly matches standalone data',()=>assert.deepStrictEqual(JSON.parse(scripts[0][1]),JSON.parse(fixture)));
test('four stable IDs',()=>assert.strictEqual(run("DATA.sessions.map(x=>x.id).join(',')"),'01,02,03,04'));
test('total duration 175',()=>assert.strictEqual(run('DATA.sessions.reduce((a,x)=>a+x.minutes,0)'),175));
test('capacity fields sum to 240',()=>assert.strictEqual(run('DATA.sessions.reduce((a,x)=>a+x.capacity,0)'),240));
test('time sorting',()=>{run("state.sort='time'");assert.strictEqual(run("sorted(DATA.sessions).map(x=>x.id).join(',')"),'01,02,03,04')});
test('duration stable tie sorting',()=>{run("state.sort='minutes'");assert.strictEqual(run("sorted(DATA.sessions).map(x=>x.id).join(',')"),'03,02,01,04')});
test('capacity sorting',()=>{run("state.sort='capacity'");assert.strictEqual(run("sorted(DATA.sessions).map(x=>x.id).join(',')"),'03,01,04,02')});
for(const [q,expected] of [['网格','02'],['TYPE','03'],['01','01'],['  阅读  ',''],['<script>',''],['reading','01']])test('filter '+q,()=>{run('state.query='+JSON.stringify(q));assert.strictEqual(run("filtered().map(x=>x.id).join(',')"),expected)});
test('query does not execute as markup',()=>assert.strictEqual(run('esc("<script>&\\\"\\\'")'),'&lt;script&gt;&amp;&quot;&#39;'));
run("state.query='';state.sort='time'");

for(const profile of ['order','poster'])for(const scene of ['research','directory','data','poster']){
 run('state.profile='+JSON.stringify(profile));const markup=run(scene+'()');
 test(`template emits content ${profile} ${scene}`,()=>assert(markup.includes('01')&&markup.includes('04')&&markup.length>1000));
}
for(const metric of ['minutes','capacity']){run('state.metric='+JSON.stringify(metric));const m=run('chart()');test('chart values and shared scale '+metric,()=>{assert(m.includes(metric==='minutes'?'60':'80'));for(const s of JSON.parse(fixture).sessions)assert(m.includes(`>${s[metric]}<`))});}
run("state.query='zzz'");test('empty-result template has clear action',()=>assert(run('rows()').includes('id="clear-search"')));
test('sorting leaves source dataset unchanged',()=>assert.strictEqual(run("DATA.sessions.map(s=>s.id).join(',')"),'01,02,03,04'));
test('system/user reduce OR predicate',()=>{run('state.reduce=true');assert.strictEqual(run('reduce()'),true);run('state.reduce=false;systemMotion.matches=true');assert.strictEqual(run('reduce()'),true)});
test('motion timing references correct candidate duration',()=>{assert(scripts[1][1].includes('duration:320'));assert(scripts[1][1].includes('if(reduce())return'))});
test('no external script stylesheet or image resources',()=>assert(!/<(?:script|link|img)[^>]+(?:src|href)=["']https?:/i.test(html)));
test('no network calls in implementation',()=>assert(!/\b(fetch|XMLHttpRequest|WebSocket|sendBeacon)\s*\(/.test(scripts[1][1])));
test('media queries for reduced motion and mobile',()=>assert(html.includes('prefers-reduced-motion:reduce')&&html.includes('max-width:719px')&&html.includes('max-width:359px')));
test('native fallback exists',()=>assert(html.includes('<noscript>')&&html.includes('静态回退')));
console.log(JSON.stringify({method:'Pure JavaScript and template checks only, not a browser test',checks,passed:checks.filter(x=>x.status==='passed').length,failed:checks.filter(x=>x.status==='failed').length},null,2));
if(checks.some(x=>x.status==='failed'))process.exitCode=1;
