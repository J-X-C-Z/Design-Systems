const fs=require('fs'),vm=require('vm'),assert=require('assert');
class Node{constructor(){this.value='all';this.options=[];this.events={};}append(n){this.options.push(n);}addEventListener(k,f){this.events[k]=f;}}
const nodes={},get=s=>nodes[s]??=new Node;get('#collection-search').value='';
const context={window:{},document:{querySelector:get,createElement:()=>new Node},URL,URLSearchParams,location:{search:'',pathname:'/web/reference-collections.html'},history:{replaceState(){}}};
vm.createContext(context);
for(const file of ['catalog-data.js','reference-collections-data.js','reference-collections.js'])vm.runInContext(fs.readFileSync(file,'utf8'),context);
let passed=0;function check(n){assert(get('#collection-status').textContent.startsWith(n+' 个参考条目'));passed++;}
check(31);get('#collection-provider').value='dashi';get('#collection-provider').events.change();check(12);
get('#collection-provider').value='watermelon';get('#collection-provider').events.change();check(19);
get('#collection-type').value='dashboard-example';get('#collection-type').events.change();check(12);
get('#collection-provider').value='all';get('#collection-type').value='all';get('#collection-search').value='does-not-exist';get('#collection-search').events.input();check(0);assert(get('#collection-empty').hidden===false);
const rows=context.window.REFERENCE_COLLECTIONS;assert(rows.length===31&&rows.every(x=>x.level===3&&x.source_revision));
assert(!get('#collection-grid').innerHTML.includes('<img'));passed++;
console.log(JSON.stringify({passed,scope:'Actual collection data/render/filter logic with DOM stub; no real browser layout'},null,2));
