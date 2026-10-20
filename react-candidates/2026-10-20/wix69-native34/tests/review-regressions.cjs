'use strict';
// Review regressions are independent expectation tests, replayed against source and archive.
const assert=require('node:assert/strict'),{env:E}=require('./harness.cjs');
const {fs,path,window,document,React,h,flushSync,tick,api,entry,packageRoot,load,sha}=E;
const {createRoot}=require(path.join(E.dependencies,'react-dom/client'));
let assertions=0,serial=0;const tests=[],rows=[],runtimeErrors=[];
const eq=(a,b,message)=>{assertions++;assert.deepEqual(a,b,message);};
const ok=(a,message)=>{assertions++;assert.ok(a,message);};
const add=(name,run)=>tests.push({name,run});
const values=node=>Array.from(node.selectedOptions,o=>o.value);
const select=(node,wanted)=>{for(const o of node.options)o.selected=wanted.includes(o.value);};
const sourceOptions=[['vegetarian','Vegetarian Options'],['vegan','Strictly Vegan'],['gluten-free','Gluten-Free Diet'],['halal','Halal Certified'],['kosher','Kosher Selection'],['dairy-free','Dairy-Free Items']];
const knownOwner=owner=>sourceOptions.map(o=>o[0]).filter(v=>owner.includes(v));
function surface(kind){
 const host=document.createElement('div');document.body.append(host);
 const tree=kind==='document'?document:host.attachShadow({mode:kind==='shadow-closed'?'closed':'open'});
 const container=document.createElement('div');(kind==='document'?host:tree).append(container);
 const listeners=new Set(),calls={adds:0,removes:0,treeResets:0,documentResets:0,composed:[]};
 const rawAdd=tree.addEventListener,rawRemove=tree.removeEventListener;
 const observe=event=>{calls.treeResets++;calls.composed.push(event.composed);};
 rawAdd.call(tree,'reset',observe,true);
 const observeDocument=()=>calls.documentResets++;
 if(tree!==document)document.addEventListener('reset',observeDocument,true);
 tree.addEventListener=function(type,listener,options){if(type==='reset'&&(options===true||options?.capture)){listeners.add(listener);calls.adds++;}return rawAdd.call(this,type,listener,options);};
 tree.removeEventListener=function(type,listener,options){if(type==='reset'&&(options===true||options?.capture)){listeners.delete(listener);calls.removes++;}return rawRemove.call(this,type,listener,options);};
 const root=createRoot(container,{onUncaughtError:error=>runtimeErrors.push(String(error.stack||error))});
 return {kind,host,tree,container,root,listeners,calls,cleanup(){flushSync(()=>root.unmount());eq(listeners.size,0,'all mounted-tree reset observers cleaned up');tree.addEventListener=rawAdd;tree.removeEventListener=rawRemove;rawRemove.call(tree,'reset',observe,true);if(tree!==document)document.removeEventListener('reset',observeDocument,true);host.remove();}};
}
function pair(config){
 const s=surface(config.tree),id=++serial,lanes=['candidate','native'],nodes={},forms={},updates={},wrappers={},events={candidate:[],native:[]},resetFlags={candidate:[],native:[]},dispose=[];
 function Scenario({lane}){
  const [state,set]=React.useState({show:config.mode!=='mount',key:0,value:config.ownership==='controlled'?['vegan']:undefined,association:'a'});
  const formA=`review-${id}-${lane}-a`,formB=`review-${id}-${lane}-b`;
  function reset(event){if(event.target.id!==formA)return;if(config.canceled)event.preventDefault();if(config.site.endsWith('-stop'))event.stopPropagation();resetFlags[lane].push(event.defaultPrevented);
   if(config.mode==='existing'){if(config.ownership!=='uncontrolled')flushSync(()=>set(old=>({...old,value:config.owner})));}
   else{flushSync(()=>set(old=>({...old,show:true,key:old.key+1,value:config.ownership==='controlled'?config.owner:undefined})));if(config.ownership==='acquire')flushSync(()=>set(old=>({...old,value:config.owner})));}
  }
  updates[lane]={reset,set:patch=>set(old=>({...old,...patch})),force:()=>set(old=>({...old}))};
  const props={name:'selection',ref:node=>nodes[lane]=node,form:state.association==='b'?formB:undefined,onChange:event=>events[lane].push(values(event.currentTarget)),...(state.value===undefined?{defaultValue:['vegetarian']}:{value:state.value})};
  const field=state.show?(lane==='candidate'?h(api.Select34,{...props,key:state.key}):h('select',{...props,key:state.key,multiple:true},sourceOptions.map(([value,label])=>h('option',{key:value,value},label)))):null;
  return h('section',{ref:node=>wrappers[lane]=node},h('form',{id:formA,ref:node=>forms[lane+'a']=node,...(config.site==='react-bubble-stop'?{onReset:reset}:{})},field),h('form',{id:formB,ref:node=>forms[lane+'b']=node}));
 }
 flushSync(()=>s.root.render(h(React.StrictMode,null,...lanes.map(lane=>h(Scenario,{key:lane,lane})))));
 if(config.site==='native-target-stop')for(const lane of lanes){const listener=event=>updates[lane].reset(event);forms[lane+'a'].addEventListener('reset',listener);dispose.push(()=>forms[lane+'a'].removeEventListener('reset',listener));}
 const snapshot=(lane,node=nodes[lane])=>({values:values(node),options:Array.from(node.options,o=>({value:o.value,selected:o.selected,defaultSelected:o.defaultSelected})),formA:Array.from(new window.FormData(forms[lane+'a'])),formB:Array.from(new window.FormData(forms[lane+'b']))});
 return {...s,lanes,nodes,forms,updates,events,resetFlags,snapshot,reset(){for(const lane of lanes)forms[lane+'a'].reset();},update(patch){flushSync(()=>lanes.forEach(lane=>updates[lane].set(patch)));},compare(expected){eq(values(nodes.candidate),expected,'explicit candidate selection');const candidate=snapshot('candidate');flushSync(()=>updates.native.force());eq(values(nodes.native),expected,'independent native owner');eq(candidate,snapshot('native'),'candidate captured before oracle-only render');},cleanup(){for(const d of dispose)d();s.cleanup();}};
}
const ownerships=[{ownership:'uncontrolled',owner:[]},...['controlled','acquire'].flatMap(ownership=>[['vegan'],['halal','kosher'],[],['missing']].map(owner=>({ownership,owner})))];
for(const tree of ['document','shadow-open','shadow-closed'])for(const mode of ['existing','mount','replace'])for(const canceled of [false,true])for(const site of ['react-bubble-stop','native-target-stop'])for(const ownership of ownerships){
 const config={tree,mode,canceled,site,...ownership};
 add(`tree reset ${tree} ${mode} ${site} canceled=${canceled} ${ownership.ownership} owner=${JSON.stringify(ownership.owner)}`,async()=>{
  const f=pair(config);try{await tick();const old={...f.nodes};if(mode==='existing'&&ownership.ownership==='uncontrolled')for(const lane of f.lanes)select(f.nodes[lane],['halal']);
   f.reset();await tick();const expected=ownership.ownership==='uncontrolled'?(mode==='existing'&&canceled?['halal']:['vegetarian']):knownOwner(ownership.owner);
   if(ownership.ownership==='uncontrolled'){eq(values(f.nodes.candidate),expected);eq(f.snapshot('candidate'),f.snapshot('native'));}else f.compare(expected);
   for(const lane of f.lanes){eq(f.resetFlags[lane],[canceled]);eq(f.events[lane],[]);if(mode!=='existing')ok(f.nodes[lane]!==old[lane]);}
   eq(f.listeners.size,1,'observer bound on actual non-composed tree root');eq(f.calls.treeResets,2);eq(f.calls.composed,[false,false]);if(tree!=='document')eq(f.calls.documentResets,0,'shadow reset does not reach document');
  }finally{f.cleanup();}
 });
}
for(const tree of ['document','shadow-open','shadow-closed'])for(const canceled of [false,true])for(const mutation of ['latest-owner','release','unmount','reassociate','detach','replace-again']){
 add(`queued root lifecycle ${tree} canceled=${canceled} ${mutation}`,async()=>{
  const f=pair({tree,mode:'replace',canceled,site:'native-target-stop',ownership:'controlled',owner:['vegan']}),retained={},parents={};
  try{await tick();f.reset();for(const lane of f.lanes)retained[lane]=f.nodes[lane];
   if(mutation==='latest-owner')f.update({value:['kosher']});if(mutation==='release')f.update({value:undefined});if(mutation==='unmount')f.update({show:false});if(mutation==='reassociate')f.update({association:'b'});if(mutation==='replace-again')f.update({key:3,value:['dairy-free']});
   if(mutation==='detach')for(const lane of f.lanes){parents[lane]=retained[lane].parentNode;retained[lane].remove();}
   if(mutation!=='latest-owner')for(const lane of f.lanes)select(retained[lane],['halal']);await tick();
   if(mutation==='latest-owner')f.compare(['kosher']);else if(mutation==='replace-again'){for(const lane of f.lanes)eq(values(retained[lane]),['halal']);f.compare(['dairy-free']);}
   else{for(const lane of f.lanes)eq(values(retained[lane]),['halal'],'revoked queued work leaves retained node untouched');eq(f.snapshot('candidate',retained.candidate),f.snapshot('native',retained.native));if(mutation==='reassociate'){for(const lane of f.lanes)f.forms[lane+'b'].reset();await tick();f.compare(['vegan']);}}
   for(const lane of f.lanes)eq(f.events[lane],[]);eq(f.listeners.size,mutation==='unmount'?0:1);
  }finally{for(const lane of f.lanes)if(parents[lane])parents[lane].appendChild(retained[lane]);f.cleanup();}
 });
}
for(const tree of ['document','shadow-open','shadow-closed'])add(`StrictMode and queued unmount cleanup ${tree}`,async()=>{
 const f=pair({tree,mode:'existing',canceled:false,site:'react-bubble-stop',ownership:'controlled',owner:['vegan']});try{await tick();eq(f.listeners.size,1);if(process.env.NODE_ENV==='development'){ok(f.calls.adds>=2,'development double-effect setup actually observed');ok(f.calls.removes>=1,'development double-effect cleanup actually observed');}
 f.reset();const retained={...f.nodes};f.update({show:false});for(const lane of f.lanes)select(retained[lane],['halal']);await tick();for(const lane of f.lanes)eq(values(retained[lane]),['halal']);eq(f.listeners.size,0);
 }finally{f.cleanup();}
});

const {PaletteNativeSheet}=load(path.join(__dirname,'../examples/PaletteNativeSheet.tsx'),{'@studio/wix-native-multiple':entry});
function paletteFixture(colors){
 const s=surface('document');let update;
 function App(){const[state,set]=React.useState({colors,key:0});update=patch=>set(old=>({...old,...patch}));return h(PaletteNativeSheet,{key:state.key,colors:state.colors});}
 flushSync(()=>s.root.render(h(App)));
 const node=()=>s.container.querySelector('select'),form=()=>s.container.querySelector('form'),output=()=>s.container.querySelector('textarea').value;
 return {...s,node,form,output,update(patch){flushSync(()=>update(patch));},choose(wanted){flushSync(()=>{select(node(),wanted);node().dispatchEvent(new window.Event('change',{bubbles:true}));});},submit(){flushSync(()=>form().dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true})));},preview(){return Array.from(s.container.querySelectorAll('li'),li=>li.textContent);},data(){return new window.FormData(form()).getAll('swatches');}};
}
const initial=['#112233','#ABCDEF','#778899'];
const initialExport=':root {\n  --palette-swatch-1: #112233;\n  --palette-swatch-3: #778899;\n}\n';
const changes=[
 {name:'reorder',colors:['#778899','#ABCDEF','#112233'],selected:['swatch-1','swatch-3'],preview:['Swatch 1 · #778899','Swatch 3 · #112233'],css:':root {\n  --palette-swatch-1: #778899;\n  --palette-swatch-3: #112233;\n}\n'},
 {name:'replacement',colors:['#445566','#AABBCC','#DDEEFF'],selected:['swatch-1','swatch-3'],preview:['Swatch 1 · #445566','Swatch 3 · #DDEEFF'],css:':root {\n  --palette-swatch-1: #445566;\n  --palette-swatch-3: #DDEEFF;\n}\n'},
 {name:'shortening',colors:['#445566'],selected:['swatch-1'],preview:['Swatch 1 · #445566'],css:':root {\n  --palette-swatch-1: #445566;\n}\n'},
 {name:'empty',colors:[],selected:[],preview:[],css:''},
];
for(const change of changes)for(const inPlace of [false,true])add(`palette invalidation ${change.name} inPlace=${inPlace}`,async()=>{
 const mutable=[...initial],f=paletteFixture(mutable);try{await tick();f.choose(['swatch-3','swatch-1']);f.submit();eq(f.output(),initialExport);let next=change.colors;if(inPlace){mutable.splice(0,mutable.length,...change.colors);next=mutable;}f.update({colors:next});
 eq(f.output(),'','prepared output invalidated immediately in committed render');eq(values(f.node()),change.selected);eq(f.data(),change.selected);eq(f.preview(),change.preview);eq(f.form().checkValidity(),change.selected.length>0);f.submit();eq(f.output(),change.css,'export contains only current palette FormData');
 f.update({colors:[...initial]});eq(f.output(),'','restoring earlier content cannot resurrect previous prepared CSS');eq(values(f.node()),['swatch-1','swatch-3']);eq(f.preview(),['Swatch 1 · #112233','Swatch 3 · #778899']);f.submit();eq(f.output(),initialExport);
 }finally{f.cleanup();}
});
add('same normalized palette content preserves current valid export',async()=>{
 const f=paletteFixture([...initial]);try{await tick();f.choose(['swatch-1','swatch-3']);f.submit();f.update({colors:['#112233','#abcdef','#778899']});eq(f.output(),initialExport);eq(f.preview(),['Swatch 1 · #112233','Swatch 3 · #778899']);}finally{f.cleanup();}
});
add('uncommitted caller mutation cannot change export of currently visible palette',async()=>{
 const colors=[...initial],f=paletteFixture(colors);try{await tick();f.choose(['swatch-1','swatch-3']);colors[0]='#445566';f.submit();eq(f.output(),'','the submit-triggered rerender invalidates the old-palette export instead of mixing snapshots');eq(f.preview(),['Swatch 1 · #445566','Swatch 3 · #778899']);f.submit();eq(f.output(),':root {\n  --palette-swatch-1: #445566;\n  --palette-swatch-3: #778899;\n}\n');f.update({colors});eq(f.preview(),['Swatch 1 · #445566','Swatch 3 · #778899']);}finally{f.cleanup();}
});
for(const cancel of [false,true])for(const action of ['change-palette','key-remount','unmount'])add(`palette pending reset canceled=${cancel} action=${action}`,async()=>{
 const f=paletteFixture([...initial]);try{await tick();f.choose(['swatch-1','swatch-3']);f.submit();const oldNode=f.node();if(cancel)f.form().addEventListener('reset',event=>event.preventDefault());f.form().reset();
 if(action==='change-palette')f.update({colors:['#445566']});if(action==='key-remount')f.update({key:1,colors:['#445566']});if(action==='unmount')flushSync(()=>f.root.render(null));await tick();
 if(action==='unmount'){eq(f.container.querySelector('select'),null);eq(f.listeners.size,0);}else{eq(f.output(),'');eq(values(f.node()),[]);eq(f.preview(),[]);eq(f.data(),[]);if(action==='key-remount')ok(f.node()!==oldNode);}
 // Intentional example behavior: canceling native reset does not cancel its explicit React owner update.
 }finally{f.cleanup();}
});

(async()=>{
 const before=sha(entry),started=Date.now();for(const test of tests){const start=assertions;try{await test.run();ok(assertions>start);rows.push({name:test.name,status:'PASS',assertions:assertions-start});}catch(error){rows.push({name:test.name,status:'FAIL',assertions:assertions-start,error:String(error.stack||error)});}}
 const failures=rows.filter(r=>r.status==='FAIL');if(runtimeErrors.length)failures.push({name:'runtime-errors',errors:runtimeErrors});if(E.runtimeErrors.length)failures.push({name:'harness-errors',errors:E.runtimeErrors});if(sha(entry)!==before)failures.push({name:'entry-mutated'});
 const report={status:failures.length?'FAIL':'PASS',total:rows.length,assertions,failed:failures.length,filtered:false,completeMatrix:rows.length===tests.length,entry,entrySha256:before,testSha256:sha(__filename),packageRoot,nodeEnv:process.env.NODE_ENV,react:React.version,elapsedMs:Date.now()-started,realBrowser:false,trustedUserEvents:false,scope:'R1 document/open-ShadowRoot/closed-ShadowRoot native reset matrices; canceled/uncontrolled/current-owner/mount/acquisition/remount/reassociation/cleanup; R2 normalized palette updates and prepared-output invalidation. Paired native oracle receives independent rerender only after candidate snapshot. Production/development runs explicitly distinguished.',failures,cases:rows};
 const file=path.resolve(process.env.REPORT_PATH||path.join(__dirname,'../qa/review-regressions.json'));require('./report.cjs').writeReport(file,report);console.log(JSON.stringify({status:report.status,total:report.total,assertions,failed:failures.length,nodeEnv:process.env.NODE_ENV,report:file}));if(failures.length){console.error(JSON.stringify(failures.slice(0,8),null,2));process.exitCode=1;}flushSync(()=>E.root.unmount());window.close();
})().catch(error=>{console.error(error);process.exitCode=1;window.close();});
