const fs=require('fs'),vm=require('vm'),assert=require('assert');
const data=JSON.parse(fs.readFileSync('catalog.json','utf8'));
const KEY='design-atlas-reviews-v1',MIGRATION='original-poor-to-one-20261011';
const source=fs.readFileSync('reviews.js','utf8').replace(/\}\)\(\);\s*$/,
  'window.testReviews={parse,read,write,migrateOriginalTen,targets,payload};})();');
class Node {
  constructor(){this.value='all';this.dataset={};this.events={};this.options=[];this.textContent='';}
  querySelector(){return new Node;}querySelectorAll(){return [];}
  addEventListener(k,f){this.events[k]=f;}setAttribute(){}append(...nodes){this.options.push(...nodes);}
  appendChild(){}before(){}replaceChildren(...nodes){this.options=nodes;}focus(){}showModal(){this.open=true;}close(){this.open=false;}
}
function boot(raw,{failWrite=false}={}){
  const nodes=new Map(),get=s=>{if(!nodes.has(s))nodes.set(s,new Node);return nodes.get(s);};
  let stored=raw,writes=0;
  const storage={getItem:k=>k===KEY?stored:null,setItem(k,v){assert.equal(k,KEY);if(failWrite)throw Error('quota');stored=v;writes++;}};
  const context={console,window:{DESIGN_CATALOG:data,addEventListener(){}},document:{body:new Node,activeElement:new Node,querySelector:get,querySelectorAll:()=>[],createElement:()=>new Node},localStorage:storage,MutationObserver:class{observe(){}},addEventListener(){},confirm:()=>true,URL,Blob,setTimeout};
  vm.createContext(context);vm.runInContext(source,context);
  return {test:context.window.testReviews,get stored(){return stored;},get writes(){return writes;},nodes};
}
function record(id,rating,review){return {id,rating,review,version:'preserved-version',createdAt:'2026-10-01T00:00:00Z',updatedAt:'2026-10-02T00:00:00Z'};}
function payload(records,appliedMigrations=[]){return JSON.stringify({application:'design-systems-atlas-reviews',schemaVersion:1,records,appliedMigrations});}
let passed=0;function check(fn){fn();passed++;}
const fresh=boot(null),initial=JSON.parse(fresh.stored);
check(()=>assert.equal(initial.records.length,10));
check(()=>assert(initial.records.every(x=>x.rating===1&&x.id.startsWith('style:'))));
check(()=>assert.deepEqual(initial.appliedMigrations,[MIGRATION]));
check(()=>assert.equal(fresh.test.targets.length,32));
check(()=>{for(const x of fresh.test.targets){const p=x.url.split('#')[0];assert(fs.existsSync(p),`${x.id}: ${p}`);}});
const oldStyle=record('style:mimo',4,'保留原评语 <中文>'),other=record('style:batch02-01',5,'研究评分'),candidate=record('candidate:mimo',3,'候选评语');
const migrated=boot(payload([oldStyle,other,candidate]));const rows=Object.fromEntries(JSON.parse(migrated.stored).records.map(r=>[r.id,r]));
check(()=>assert.equal(rows['style:mimo'].rating,1));
check(()=>assert.equal(rows['style:mimo'].review,oldStyle.review));
check(()=>assert.equal(rows['style:mimo'].createdAt,oldStyle.createdAt));
check(()=>assert.equal(rows['style:mimo'].version,oldStyle.version));
check(()=>assert.deepEqual(rows['style:batch02-01'],other));
check(()=>assert.deepEqual(rows['candidate:mimo'],candidate));
const changed=JSON.parse(migrated.stored);changed.records.find(r=>r.id==='style:mimo').rating=5;
const reload=boot(JSON.stringify(changed));
check(()=>assert.equal(JSON.parse(reload.stored).records.find(r=>r.id==='style:mimo').rating,5));
check(()=>assert.equal(reload.writes,0));
const malformed='{broken',bad=boot(malformed);
check(()=>assert.equal(bad.stored,malformed));check(()=>assert.equal(bad.writes,0));
const denied=boot(null,{failWrite:true});check(()=>assert.equal(denied.stored,null));
check(()=>assert(denied.nodes.get('.reviews-entry p').textContent.includes('未保存')));
check(()=>assert.throws(()=>fresh.test.parse(payload([record('style:mimo',6,'bad')]))));
check(()=>assert.throws(()=>fresh.test.parse(payload([oldStyle,oldStyle]))));
check(()=>assert.throws(()=>fresh.test.parse(payload([record('unknown',1,'bad')]))));
console.log(JSON.stringify({passed,scope:'Actual review script in isolated VM and synthetic localStorage; no access to user reviews or real browser rendering'},null,2));
