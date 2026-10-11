const fs=require('fs'),vm=require('vm'),assert=require('assert');
class Node{
  constructor(){this.value='all';this.options=[];this.events={};this.images=[];}
  append(n){this.options.push(n);}addEventListener(k,f){this.events[k]=f;}
  set innerHTML(v){this.html=v;this.images=[...v.matchAll(/<img src="([^"]+)"/g)].map(m=>{
    const classes=new Set(),error={hidden:true},figure={classList:{add:x=>classes.add(x)},querySelector:()=>error};
    return {src:m[1],complete:false,naturalWidth:0,events:{},classes,error,closest:()=>figure,addEventListener(k,f){this.events[k]=f;}};
  });}
  get innerHTML(){return this.html||'';}querySelectorAll(s){return s==='img'?this.images:[];}
}
let passed=0;function check(fn){fn();passed++;}
function run(inline){
  const nodes={},get=s=>nodes[s]??=new Node;get('#collection-search').value='';
  let historyWrites=0;
  const context={window:{},document:{querySelector:s=>s==='#third-party-resources'?(inline?new Node:null):get(s),createElement:()=>new Node},URL,URLSearchParams,location:{search:'',pathname:'/web/reference-collections.html'},history:{replaceState(){historyWrites++;}}};
  vm.createContext(context);
  for(const file of ['catalog-data.js','reference-collections-data.js','reference-preview-data.js','reference-collections.js'])vm.runInContext(fs.readFileSync(file,'utf8'),context);
  const count=n=>check(()=>assert(get('#collection-status').textContent.startsWith(n+' 个参考条目')));
  count(31);check(()=>assert.equal(get('#collection-grid').images.length,28));
  check(()=>assert.equal((get('#collection-grid').innerHTML.match(/href="watermelon-samples\/gridline\/"/g)||[]).length,1));
  check(()=>assert(fs.existsSync('watermelon-samples/gridline/index.html')));
  check(()=>assert.equal((get('#collection-grid').innerHTML.match(/<strong>暂无准确展示图<\/strong>/g)||[]).length,3));
  check(()=>assert.equal((get('#collection-grid').innerHTML.match(/官方代表图（范围已注明）/g)||[]).length,3));
  check(()=>assert(get('#collection-grid').innerHTML.includes(inline?'<h3>':'<h2>')));
  check(()=>assert(get('#collection-grid').innerHTML.includes('其他配色')));
  check(()=>assert.equal(historyWrites,inline?0:1));
  const first=get('#collection-grid').images[0];first.events.error();
  check(()=>assert(first.classes.has('failed')&&first.error.hidden===false));
  get('#collection-provider').value='dashi';get('#collection-provider').events.change();count(12);
  get('#collection-provider').value='watermelon';get('#collection-provider').events.change();count(19);
  get('#collection-type').value='dashboard-example';get('#collection-type').events.change();count(12);
  get('#collection-provider').value='all';get('#collection-type').value='all';get('#collection-search').value='Agndex';get('#collection-search').events.input();count(1);
  get('#collection-search').value='does-not-exist';get('#collection-search').events.input();count(0);check(()=>assert(get('#collection-empty').hidden===false));
  get('#collection-search').value='';get('#collection-search').events.input();count(31);
  const rows=context.window.REFERENCE_COLLECTIONS,previews=context.window.REFERENCE_PREVIEWS;
  check(()=>assert(rows.length===31&&rows.every(x=>x.level===3&&x.source_revision&&previews[x.id])));
  check(()=>{for(const p of Object.values(previews)){if(p.image_url?.startsWith('references/'))assert(fs.existsSync(p.image_url));}});
}
run(false);run(true);
check(()=>assert(fs.readFileSync('reference-collections.css','utf8').includes('object-fit:contain')));
console.log(JSON.stringify({passed,scope:'Actual home/dedicated collection rendering, filters, source counts and image-error fallback with synthetic DOM; no network image-load or browser-layout assertion'},null,2));
