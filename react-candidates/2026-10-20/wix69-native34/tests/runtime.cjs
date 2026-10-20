'use strict';
const assert = require('node:assert/strict');
const {env:E} = require('./harness.cjs');
const {fs,path,window,document,React,h,flushSync,root,render,tick,api,packageRoot,entry,sha,load,runtimeErrors} = E;
const {Select34} = api;
const {renderToString} = require(path.join(E.dependencies,'react-dom/server'));
const tests = [], rows = [];
let assertions = 0;
const eq = (a,b,message) => {assertions++; assert.deepEqual(a,b,message);};
const ok = (a,message) => {assertions++; assert.ok(a,message);};
const throws = (fn,message) => {assertions++; assert.throws(fn,TypeError,message);};
const add = (name,run) => tests.push({name,run});
const selected = node => Array.from(node.selectedOptions, option => option.value);
const defaults = node => Array.from(node.options).filter(option => option.defaultSelected).map(option => option.value);
const change = (node, values) => {for(const option of node.options) option.selected=values.includes(option.value);node.dispatchEvent(new window.Event('change',{bubbles:true}));};
const flat = [{value:'a',label:'Alpha'},{value:'b',label:'Beta'},{value:'x',label:'Disabled exact match',disabled:true},{value:'',label:'Empty real value'},{value:'c',label:'Gamma'}];
const snapshots = node => ({selected:selected(node),defaults:defaults(node),options:Array.from(node.options,option=>({value:option.value,text:option.text,selected:option.selected,defaultSelected:option.defaultSelected,disabled:option.disabled}))});
let id = 0;

add('canonical source hash, literal defaults and primitive', async()=>{
 const identity=JSON.parse(fs.readFileSync(path.join(packageRoot,'reference/SOURCE-IDENTITY.json'),'utf8'));
 eq(identity.id,'select-34');eq(identity.source_file.sha256,'9f7dcb51fd037bc182b6314debd8cb864240deb6a03b2324f45d553728fb3aa1');eq(identity.source_file.git_blob,'d37eae67bad8a28c5e217767111feb83ae377196');
 for(const file of [identity.source_file,...identity.support_files]) {const f=path.join(packageRoot,file.reference_file);eq(sha(f),file.sha256);const b=fs.readFileSync(f);eq(E.crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${b.length}\0`),b])).digest('hex'),file.git_blob);}
 const source=fs.readFileSync(path.join(packageRoot,identity.source_file.reference_file),'utf8');
 const pairs=[...source.matchAll(/<option value="([^"]+)"[^>]*>\s*([^<]+?)\s*<\/option>/g)].map(m=>[m[1],m[2].trim()]);
 eq(pairs,[['vegetarian','Vegetarian Options'],['vegan','Strictly Vegan'],['gluten-free','Gluten-Free Diet'],['halal','Halal Certified'],['kosher','Kosher Selection'],['dairy-free','Dairy-Free Items']]);
 let ref;const host=render(h(Select34,{ref:node=>{ref=node;}}));await tick();const node=host.querySelector('select');
 ok(ref instanceof window.HTMLSelectElement);eq(ref,node);eq(node.multiple,true);eq(node.hidden,false);eq(node.getAttribute('aria-hidden'),null);eq(node.getAttribute('role'),null);eq(node.getAttribute('size'),null);eq(selected(node),[]);eq(defaults(node),[]);
 eq(Array.from(node.options,option=>[option.value,option.text]),pairs);eq(host.querySelector('label').textContent,'Dietary Preferences');eq(host.querySelector('label').htmlFor,node.id);eq(host.querySelector('p').textContent,'Hold Cmd/Ctrl to select multiple preferences.');
 eq(host.querySelectorAll('button,input,dialog,[role="listbox"],[role="combobox"],[role="dialog"],svg').length,0);eq(api.wixNativeMultipleIds,['select-34']);ok(Object.isFrozen(api.wixNativeMultipleIds));
});
add('accessible label/helper names, native ref and explicit size',async()=>{
 const host=render(h(Select34,{id:'native-a11y',label:null,helper:'Help',size:7,'aria-describedby':'external external',title:'Native title'}));const node=host.querySelector('select');
 eq(node.getAttribute('aria-label'),'Dietary Preferences');eq(node.size,7);eq(node.title,'Native title');eq(node.getAttribute('aria-describedby').split(' ').length,2);eq(host.querySelector('label'),null);
 render(h(Select34,{label:null,helper:null,'aria-labelledby':'name'}));const other=document.querySelector('select');eq(other.getAttribute('aria-label'),null);eq(other.getAttribute('aria-describedby'),null);eq(other.getAttribute('aria-labelledby'),'name');
});
add('native keys are not canceled or synthesized',async()=>{
 let changes=0,keys=[];const host=render(h(Select34,{options:flat,defaultValue:['a'],onChange:()=>changes++,onKeyDown:event=>keys.push([event.key,event.defaultPrevented])}));const node=host.querySelector('select');await tick();
 for(const [key,extra] of [['ArrowDown',{shiftKey:true}],['ArrowUp',{ctrlKey:true}],[' ',{metaKey:true}],['Home',{}],['End',{}],['Escape',{}],['Enter',{}]]){const event=new window.KeyboardEvent('keydown',{key,...extra,bubbles:true,cancelable:true});eq(node.dispatchEvent(event),true);eq(event.defaultPrevented,false);}
 eq(keys.length,7);eq(changes,0);eq(selected(node),['a']); // JSDOM does not implement native trusted keyboard selection.
});
add('native change event contract and uncontrolled order',async()=>{
 const seen=[];let node;render(h(Select34,{options:flat,name:'choices',defaultValue:['c','a'],ref:n=>node=n,onChange:event=>seen.push({target:event.target===node,current:event.currentTarget===node,value:event.currentTarget.value,values:selected(event.currentTarget),trusted:event.nativeEvent.isTrusted})}));await tick();
 eq(selected(node),['a','c']);change(node,['c','b']);eq(selected(node),['b','c']);eq(seen,[{target:true,current:true,value:'b',values:['b','c'],trusted:false}]);
});
for(const cancel of [false,true])for(const control of [false,true])add(`native change ${control?'controlled':'uncontrolled'} preventDefault=${cancel}`,async()=>{
 let node;render(h(Select34,{options:flat,...(control?{value:['a']}:{defaultValue:['a']}),ref:n=>node=n,onChange:event=>{if(cancel)event.preventDefault();}}));await tick();change(node,['b']);eq(selected(node),control?['a']:['b']);
});
for(const owner of [[],['b'],['c','a'],['x'],['absent'],[''],['x','absent','a']])add('owner/default native order '+JSON.stringify(owner),async()=>{
 for(const control of [false,true]){const host=render(h('form',null,h(Select34,{options:flat,name:'choices',...(control?{value:owner}:{defaultValue:owner})}),h('select',{multiple:true,name:'oracle',...(control?{value:owner,onChange:()=>{}}:{defaultValue:owner})},flat.map(o=>h('option',{key:o.value,value:o.value,disabled:o.disabled},o.label)))));await tick();const nodes=host.querySelectorAll('select');eq(snapshots(nodes[0]),snapshots(nodes[1]));const data=new window.FormData(host.querySelector('form'));eq(data.getAll('choices'),data.getAll('oracle'));eq(selected(nodes[0]),flat.filter(o=>owner.includes(o.value)).map(o=>o.value));}
});
for(const name of [undefined,'','preferences'])for(const disabled of [false,true])for(const required of [false,true])add(`form name=${String(name)} disabled=${disabled} required=${required}`,async()=>{
 const host=render(h('form',null,h(Select34,{name,disabled,required,options:flat,defaultValue:[]})));await tick();const form=host.querySelector('form'),node=host.querySelector('select');
 eq(node.willValidate,!disabled);eq(node.checkValidity(),disabled||!required);eq(Array.from(new window.FormData(form)),[]);change(node,['a','c']);eq(node.checkValidity(),true);eq(new window.FormData(form).getAll(name||''),name&&!disabled?['a','c']:[]);
});
for(const legend of [false,true])add('disabled fieldset with first legend exception='+legend,async()=>{
 const field=h(Select34,{name:'choice',required:true,defaultValue:['vegan']});const host=render(h('form',null,h('fieldset',{disabled:true},legend?h('legend',null,field):field)));const form=host.querySelector('form'),node=host.querySelector('select');await tick();eq(node.disabled,false);eq(node.matches(':disabled'),!legend);eq(node.willValidate,legend);eq(new window.FormData(form).getAll('choice'),legend?['vegan']:[]);eq(window.getComputedStyle(node).display,'block');eq(window.getComputedStyle(node).height,'128px');
});
add('required multiple empty-string option obeys bare native oracle',async()=>{
 const host=render(h('form',null,h(Select34,{options:flat,required:true,defaultValue:['']}),h('select',{multiple:true,required:true,defaultValue:['']},flat.map(o=>h('option',{key:o.value,value:o.value},o.label)))));const [a,b]=host.querySelectorAll('select');eq(a.checkValidity(),b.checkValidity());eq(selected(a),['']);
});
add('external form association and unnamed nonparticipation',async()=>{
 const host=render(h(React.Fragment,null,h('form',{id:'external-form'}),h(Select34,{name:'prefs',form:'external-form',defaultValue:['vegan','halal']})));const node=host.querySelector('select'),form=host.querySelector('form');await tick();eq(node.form,form);eq(new window.FormData(form).getAll('prefs'),['vegan','halal']);change(node,['kosher']);form.reset();await tick();eq(selected(node),['vegan','halal']);
});
add('controlled latent values and uncontrolled ignored new defaults/options',async()=>{
 let update;function App(){const [state,set]=React.useState({options:[{value:'a',label:'A'}],value:['later'],defaultValue:['later']});update=patch=>set(old=>({...old,...patch}));return h(React.Fragment,null,h(Select34,{options:state.options,value:state.value}),h(Select34,{options:state.options,defaultValue:state.defaultValue}));}
 const host=render(h(App));await tick();eq(Array.from(host.querySelectorAll('select'),selected),[[],[]]);flushSync(()=>update({options:[{value:'a',label:'A'},{value:'later',label:'Later'}],defaultValue:['a']}));eq(Array.from(host.querySelectorAll('select'),selected),[['later'],[]]);flushSync(()=>update({value:['absent']}));eq(Array.from(host.querySelectorAll('select'),selected),[[],[]]);
});
add('mutable descriptors and arrays become committed immutable snapshots',async()=>{
 const options=[{value:'a',label:'A'},{value:'b',label:'B'}],value=['a'];let rerender;function App(){const [,set]=React.useState(0);rerender=()=>set(n=>n+1);return h('form',null,h(Select34,{options,value}));}const host=render(h(App));await tick();const node=host.querySelector('select');options[0].label='Mutated';value[0]='b';host.querySelector('form').reset();await tick();eq(selected(node),['a']);eq(node.options[0].text,'A');ok(!Object.isFrozen(options));ok(!Object.isFrozen(value));ok(!Object.isFrozen(options[0]));flushSync(()=>rerender());eq(selected(node),['b']);eq(node.options[0].text,'Mutated');
});

const invalid = [
 ['both ownership props',{value:[],defaultValue:[]}],['scalar value',{value:'a'}],['null value',{value:null}],['numeric values',{value:[1]}],['duplicate value',{value:['a','a']}],['sparse value',{value:Array(2)}],['array-like values',{value:{0:'a',length:1}}],['Set values',{value:new Set(['a'])}],['default scalar',{defaultValue:'a'}],['default sparse',{defaultValue:Array(1)}],['default duplicate',{defaultValue:['a','a']}],
 ['nonarray options',{options:{}}],['null options',{options:null}],['sparse options',{options:Array(1)}],['null option',{options:[null]}],['missing label',{options:[{value:'a'}]}],['number label',{options:[{value:'a',label:1}]}],['number value',{options:[{value:1,label:'A'}]}],['nonboolean disabled',{options:[{value:'a',label:'A',disabled:'true'}]}],['duplicate options',{options:[{value:'a',label:'A'},{value:'a',label:'Again'}]}],['groups',{options:[{label:'Group',options:flat}]}],['selected option',{options:[{value:'a',label:'A',selected:true}]}],['option children',{options:[{value:'a',label:'A',children:'A'}]}],
 ['multiple false',{multiple:false}],['size zero',{size:0}],['size one',{size:1}],['fractional size',{size:2.5}],['size NaN',{size:NaN}],['size Infinity',{size:Infinity}],['size string',{size:'6'}],['invalid label',{label:4}],['invalid helper',{helper:false}],
 ...['children','dangerouslySetInnerHTML','readOnly','role','open','defaultOpen','onOpenChange','onValueChange','placeholder','aria-expanded','aria-haspopup','aria-controls','aria-multiselectable'].map(key=>[key+' unsupported',{[key]:key==='children'?h('option',null,'x'):true}]),
];
for(const [name,props] of invalid)add('reject '+name,()=>{throws(()=>renderToString(h(Select34,props)));});
for(const field of ['value','label','disabled'])for(const kind of ['getter','inherited'])add(`descriptor ${kind} ${field} rejected without invoking getter`,()=>{
 let reads=0;const option={value:'a',label:'A',disabled:false};delete option[field];if(kind==='getter')Object.defineProperty(option,field,{get(){reads++;return field==='disabled'?false:'x';},enumerable:true});else Object.setPrototypeOf(option,{[field]:field==='disabled'?false:'x'});
 throws(()=>renderToString(h(Select34,{options:[option]})));eq(reads,0);
});
for(const prop of ['options','value','defaultValue'])for(const kind of ['getter','inherited'])add(`collection ${prop} ${kind} index rejected`,()=>{
 let reads=0;const a=Array(1);if(kind==='getter')Object.defineProperty(a,0,{get(){reads++;return prop==='options'?flat[0]:'a';}});else Object.setPrototypeOf(a,Object.assign(Object.create(Array.prototype),{0:prop==='options'?flat[0]:'a'}));throws(()=>renderToString(h(Select34,{[prop]:a})));eq(reads,0);
});
add('frozen dense arrays, empty flat options and own metadata allowed',()=>{
 ok(renderToString(h(Select34,{options:Object.freeze([Object.freeze({value:'',label:'Empty',metadata:'ignored'})]),value:Object.freeze([''])})).includes('selected=""'));ok(renderToString(h(Select34,{options:[]})).includes('multiple=""'));
});

// Independent native oracle with explicit expectation fixtures. No candidate selection helper is used.
const sites=['react-capture-stop','react-bubble-stop','native-capture-stop','native-target-stop','native-bubble-stop','native-target-open'];
function pair(config){
 const serial=++id,lanes=['candidate','oracle'],nodes={},forms={},handles={},events={candidate:[],oracle:[]},resetEvents={candidate:[],oracle:[]},wrappers={},disposers=[];
 function Scenario({lane}){
  const [state,set]=React.useState({show:config.mode!=='mount',key:0,value:config.uncontrolled?undefined:['a'],defaultValue:['a'],association:'a'});
  const formA=`reset-${serial}-${lane}-a`,formB=`reset-${serial}-${lane}-b`;
  function reset(event){if(event.target.id!==formA)return;if(config.canceled)event.preventDefault();if(config.site.endsWith('-stop'))event.stopPropagation();resetEvents[lane].push({canceled:event.defaultPrevented,cancelable:event.cancelable});
   if(config.mode==='existing') {if(config.nextOwner!==undefined)flushSync(()=>set(old=>({...old,value:config.nextOwner})));}
   else {flushSync(()=>set(old=>({...old,show:true,key:old.key+1,value:config.acquire||config.uncontrolled?undefined:config.owner})));if(config.acquire)flushSync(()=>set(old=>({...old,value:config.owner})));}
  }
  handles[lane]={reset,update:patch=>set(old=>({...old,...patch})),force:()=>set(old=>({...old}))};
  const onChange=event=>{events[lane].push({values:selected(event.currentTarget),native:event.nativeEvent instanceof window.Event,trusted:event.nativeEvent.isTrusted});if(config.change==='accept')flushSync(()=>set(old=>({...old,value:selected(event.currentTarget)})));if(config.change==='reject')flushSync(()=>set(old=>({...old})));};
  const props={name:'selection',ref:node=>nodes[lane]=node,form:state.association==='b'?formB:undefined,onChange,...(state.value===undefined?{defaultValue:state.defaultValue}:{value:state.value})};
  const control=state.show?(lane==='candidate'?h(Select34,{...props,key:state.key,options:flat}):h('select',{...props,key:state.key,multiple:true},flat.map(o=>h('option',{key:o.value,value:o.value,disabled:o.disabled},o.label)))):null;
  return h('section',{ref:node=>wrappers[lane]=node},h('form',{id:formA,ref:node=>forms[lane+'a']=node,...(config.site==='react-capture-stop'?{onResetCapture:reset}:config.site==='react-bubble-stop'?{onReset:reset}:{})},control),h('form',{id:formB,ref:node=>forms[lane+'b']=node}));
 }
 render(h(React.Fragment,null,...lanes.map(lane=>h(Scenario,{key:lane,lane}))));
 if(config.site.startsWith('native'))for(const lane of lanes){const target=config.site.includes('target')?forms[lane+'a']:wrappers[lane];const capture=config.site.includes('capture');const listener=event=>handles[lane].reset(event);target.addEventListener('reset',listener,capture);disposers.push(()=>target.removeEventListener('reset',listener,capture));}
 function snapshot(lane,retained){return {...snapshots(retained||nodes[lane]),dataA:Array.from(new window.FormData(forms[lane+'a'])),dataB:Array.from(new window.FormData(forms[lane+'b']))};}
 return {lanes,nodes,forms,handles,events,resetEvents,snapshot,reset(){for(const lane of lanes)forms[lane+'a'].reset();},update(patch){flushSync(()=>lanes.forEach(lane=>handles[lane].update(patch)));},compareOwner(expected){eq(selected(nodes.candidate),expected);const candidate=snapshot('candidate');flushSync(()=>handles.oracle.force());eq(selected(nodes.oracle),expected);eq(candidate,snapshot('oracle'));},cleanup(){for(const dispose of disposers)dispose();flushSync(()=>root.render(null));}};
}
for(const mode of ['mount','replace'])for(const acquire of [false,true])for(const owner of [[],['b'],['c','a'],['x'],['absent'],['']])for(const site of sites)for(const canceled of [false,true])add(`reset-${mode} acquire=${acquire} owner=${JSON.stringify(owner)} ${site} canceled=${canceled}`,async()=>{
 const f=pair({mode,acquire,owner,site,canceled});try{await tick();const old={...f.nodes};f.reset();for(const lane of f.lanes){ok(f.nodes[lane] instanceof window.HTMLSelectElement);ok(f.nodes[lane]!==old[lane]);eq(f.resetEvents[lane],[{canceled,cancelable:true}]);eq(f.events[lane],[]);if(old[lane])eq(old[lane].isConnected,false);}await tick();f.compareOwner(flat.filter(o=>owner.includes(o.value)).map(o=>o.value));}finally{f.cleanup();}
});
for(const mode of ['existing','mount','replace'])for(const canceled of [false,true])for(const site of sites)add(`uncontrolled reset ${mode} ${site} canceled=${canceled}`,async()=>{
 const f=pair({mode,uncontrolled:true,canceled,site});try{await tick();if(mode==='existing')for(const lane of f.lanes)change(f.nodes[lane],['b']);f.reset();const expect=mode==='existing'&&canceled?['b']:['a'];for(const lane of f.lanes)eq(selected(f.nodes[lane]),expect);await tick();eq(f.snapshot('candidate'),f.snapshot('oracle'));for(const lane of f.lanes){eq(selected(f.nodes[lane]),expect);change(f.nodes[lane],['c']);}await tick();eq(selected(f.nodes.candidate),['c']);eq(f.snapshot('candidate'),f.snapshot('oracle'));}finally{f.cleanup();}
});
for(const canceled of [false,true])for(const owner of [[],['b'],['x'],['absent'],['']])add(`existing owner update in reset canceled=${canceled} owner=${JSON.stringify(owner)}`,async()=>{
 const f=pair({mode:'existing',canceled,site:'react-bubble-stop',nextOwner:owner});try{await tick();f.reset();await tick();f.compareOwner(flat.filter(o=>owner.includes(o.value)).map(o=>o.value));eq(f.events.candidate,[]);}finally{f.cleanup();}
});
for(const mode of ['mount','replace'])for(const canceled of [false,true])for(const mutation of ['later-owner','release','unmount','reassociate','detach','replace-again'])add(`queued ownership ${mode} canceled=${canceled} ${mutation}`,async()=>{
 const f=pair({mode,canceled,site:'native-target-stop',owner:['b']}),retained={},parents={};try{await tick();f.reset();for(const lane of f.lanes)retained[lane]=f.nodes[lane];
 if(mutation==='later-owner')f.update({value:['c']});if(mutation==='release')f.update({value:undefined});if(mutation==='unmount')f.update({show:false});if(mutation==='reassociate')f.update({association:'b'});if(mutation==='replace-again')f.update({key:3,value:['x']});
 if(mutation==='detach')for(const lane of f.lanes){parents[lane]=retained[lane].parentNode;retained[lane].remove();}
 if(mutation!=='later-owner')for(const lane of f.lanes)for(const option of retained[lane].options)option.selected=option.value==='a';await tick();
 if(mutation==='later-owner')f.compareOwner(['c']);else if(mutation==='replace-again'){for(const lane of f.lanes)eq(selected(retained[lane]),['a']);f.compareOwner(['x']);}else{for(const lane of f.lanes)eq(selected(retained[lane]),['a']);eq(f.snapshot('candidate',retained.candidate),f.snapshot('oracle',retained.oracle));if(mutation==='reassociate'){for(const lane of f.lanes)f.forms[lane+'b'].reset();await tick();f.compareOwner(['b']);}}
 for(const lane of f.lanes)eq(f.events[lane],[]);
 }finally{for(const lane of f.lanes)if(parents[lane])parents[lane].appendChild(retained[lane]);f.cleanup();}
});
for(const mode of ['mount','replace'])for(const canceled of [false,true])for(const changeMode of ['accept','reject'])for(const timing of ['before','after'])add(`change during queued reset ${mode} canceled=${canceled} ${changeMode} ${timing}`,async()=>{
 const f=pair({mode,canceled,site:'react-bubble-stop',owner:['b'],change:changeMode});try{await tick();f.reset();if(timing==='after')await tick();for(const lane of f.lanes)change(f.nodes[lane],['a','c']);await tick();f.compareOwner(changeMode==='accept'?['a','c']:['b']);for(const lane of f.lanes)eq(f.events[lane],[{values:['a','c'],native:true,trusted:false}]);}finally{f.cleanup();}
});
add('strict mode repeated mount cleanup and callback ref changes',async()=>{
 let refs=[],set;function App(){const[state,update]=React.useState(0);set=update;return h(React.StrictMode,null,h('form',null,h(Select34,{key:state,value:['vegan'],ref:node=>refs.push(node)})));}render(h(App));await tick();const old=document.querySelector('select');flushSync(()=>set(1));const current=document.querySelector('select');await tick();ok(old!==current);eq(old.isConnected,false);ok(refs.includes(null));eq(selected(current),['vegan']);document.querySelector('form').reset();await tick();eq(selected(current),['vegan']);
});

add('functional local meal example: required, prepare, edit, reset',async()=>{
 const {MealBrief}=load(path.join(__dirname,'../examples/MealBrief.tsx'),{'@studio/wix-native-multiple':entry});const host=render(h(MealBrief));await tick();const form=host.querySelector('form'),node=host.querySelector('select');eq(form.checkValidity(),false);change(node,['vegan','halal']);await tick();eq(form.checkValidity(),true);flushSync(()=>form.dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true})));eq(host.querySelector('output').textContent,'Local brief: vegan, halal');change(node,['kosher']);await tick();eq(host.querySelector('output').textContent,'No brief prepared.');form.reset();await tick();eq(selected(node),[]);eq(host.querySelector('output').textContent,'No brief prepared.');
});
add('functional custom palette example: live preview, native FormData CSS, reset',async()=>{
 const {PaletteNativeSheet}=load(path.join(__dirname,'../examples/PaletteNativeSheet.tsx'),{'@studio/wix-native-multiple':entry});const host=render(h(PaletteNativeSheet,{colors:['#123456','#ABCDEF','#123456']}));await tick();const form=host.querySelector('form'),node=host.querySelector('select');eq(form.checkValidity(),false);eq(node.options.length,3);change(node,['swatch-3','swatch-1']);await tick();eq(host.querySelectorAll('li').length,2);flushSync(()=>form.dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true})));eq(host.querySelector('textarea').value,':root {\n  --palette-swatch-1: #123456;\n  --palette-swatch-3: #123456;\n}\n');form.reset();await tick();eq(selected(node),[]);eq(host.querySelectorAll('li').length,0);eq(host.querySelector('textarea').value,'');
});
add('palette helper validates colors and excludes unknown export tokens',()=>{
 const {preparePaletteCss,paletteOptions}=load(path.join(__dirname,'../examples/palette-css.ts'));eq(preparePaletteCss(['#abcdef'],['evil;}','swatch-1']),':root {\n  --palette-swatch-1: #ABCDEF;\n}\n');throws(()=>paletteOptions(['red']));throws(()=>paletteOptions(Array(2)));eq(paletteOptions([]),[]);
});

(async()=>{
 const before=sha(entry),started=Date.now();
 for(const test of tests){const count=assertions;try{await test.run();ok(assertions>count,'case must assert');rows.push({name:test.name,status:'PASS',assertions:assertions-count});}catch(error){rows.push({name:test.name,status:'FAIL',assertions:assertions-count,error:String(error.stack||error)});}finally{flushSync(()=>root.render(null));}}
 const failures=rows.filter(row=>row.status==='FAIL');if(runtimeErrors.length)failures.push({name:'react-errors',errors:runtimeErrors});if(sha(entry)!==before)failures.push({name:'entry-mutated'});
 const report={status:failures.length?'FAIL':'PASS',total:rows.length,assertions,failed:failures.length,filtered:false,completeMatrix:rows.length===tests.length,entry,entrySha256:before,packageRoot,elapsedMs:Date.now()-started,environment:{node:process.version,react:React.version,jsdom:require(path.join(E.dependencies,'jsdom/package.json')).version},realBrowser:false,trustedUserEvents:false,scope:'Full unfiltered local production React/JSDOM native multiple-select matrix. Oracle is independently rendered bare React native select; owner comparisons capture candidate before an oracle-only rerender. No browser, trusted keyboard/pointer, OS picker, screen reader, touch, or formal acceptance.',modelLimitation:'JSDOM may include selected disabled options in FormData. Disabled-option comparisons are model differential evidence only.',failures,cases:rows};
 const file=path.resolve(process.env.REPORT_PATH||path.join(__dirname,'../qa/runtime.json'));require('./report.cjs').writeReport(file,report);console.log(JSON.stringify({status:report.status,total:report.total,assertions,failed:failures.length,report:file}));if(failures.length){console.error(JSON.stringify(failures.slice(0,12),null,2));process.exitCode=1;}flushSync(()=>root.unmount());window.close();
})().catch(error=>{console.error(error);process.exitCode=1;window.close();});
