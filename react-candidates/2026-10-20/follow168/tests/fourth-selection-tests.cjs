'use strict';
/* Author tests execute real React + JSDOM native click/reset defaults. Not browser layout/trusted-keyboard evidence. */
exports.run = async function run(window, React, createRoot, assert, C) {
  const h = React.createElement, act = React.act, flush = C.__flushSync;
  let scenarios = 0, assertions = 0, serial = 0;
  const eq = (a,b,m) => { assertions++; assert.strictEqual(a,b,m); };
  const ok = (a,m) => { assertions++; assert.ok(a,m); };
  const settle = async fn => { await act(async () => { fn?.(); await Promise.resolve(); }); };
  async function mount(name, props = {}, strict = false) {
    scenarios++;
    const form = window.document.createElement('form'), other = window.document.createElement('form'), host = window.document.createElement('div');
    form.id = `fourth-selection-${++serial}`; other.id = `fourth-selection-other-${serial}`;
    form.append(host); window.document.body.append(form, other); const root = createRoot(host); let current = props;
    const tree = () => strict ? h(React.StrictMode, null, h(C[name], current)) : h(C[name], current);
    await settle(() => root.render(tree()));
    return { form, other, host, root, get props(){return current;}, get inputs(){return [...host.querySelectorAll('input')];},
      render: async patch => { current = {...current,...patch}; await settle(() => root.render(tree())); },
      sync: props => flush(() => root.render(h(C[name], props))),
      close: async () => { await settle(() => root.unmount()); form.remove(); other.remove(); }
    };
  }
  async function use(name, props, test, strict) { const m = await mount(name, props, strict); try { await test(m); } finally { await m.close(); } }
  const groups = [
    ['Checkbox09','CHECKBOX09_SLOTS',['planning','design','operations'],[false,false,false]],
    ['Checkbox10','CHECKBOX10_SLOTS',['destructive','info','success'],[true,true,true]],
    ['Checkbox11','CHECKBOX11_SLOTS',['triangle','diamond','hexagon'],[true,true,true]],
    ['Checkbox12','CHECKBOX12_SLOTS',['destructive','info','success'],[true,true,true]],
    ['Switch12','SWITCH12_SLOTS',['privacy','notifications','darkTheme'],[false,false,false]]
  ];
  const single = [['Switch09',true],['Switch10',true],['Switch11',true]];
  const fields = [...groups.flatMap(([name,,keys]) => keys.map((slot,index) => ({name,slot,index}))), ...single.map(([name]) => ({name,index:0}))];
  const propsFor = (f, field, group = {}) => {
    const clean = { checked:undefined, disabled:false, readOnly:false, ownerRevision:undefined, onClick:undefined, onChange:undefined, onCheckedChange:undefined, ...field };
    const base = { ownerRevision:undefined, onChange:undefined, disabled:false, readOnly:false, ...group };
    return f.slot ? {...base,[f.slot]:clean} : {...base,...clean, ...(group.ownerRevision!==undefined?{ownerRevision:group.ownerRevision}:{})};
  };
  const get = (m,f) => m.inputs[f.index];
  for (const [name,constant,keys,defaults] of groups) {
    eq(C[constant].map(s=>s.key).join(),keys.join(),`${name} fixed exact member order`);
    ok(Object.isFrozen(C[constant]) && C[constant].every(Object.isFrozen),`${name} immutable slot contract`);
    await use(name, {}, async m => {
      eq(m.inputs.length,keys.length,`${name} exact native field cardinality`);
      eq(m.inputs.map(i=>i.checked).join(),defaults.join(),`${name} exact source defaults`);
      eq(new Set(m.inputs.map(i=>i.id)).size,keys.length,`${name} unique member ids`);
      eq(m.host.querySelectorAll('[data-selection-slot]').length,keys.length,`${name} fixed rendered slots`);
      for(let i=0;i<keys.length;i++) {
        const el=m.inputs[i]; eq(el.getAttribute('role'),name.startsWith('Switch')?'switch':null,`${name}.${keys[i]} native role`);
        ok(el.getAttribute('aria-label') || m.host.querySelector(`label[for="${el.id}"]`),`${name}.${keys[i]} named`);
        const before=m.inputs.map(i=>i.checked); await settle(()=>el.click());
        eq(m.inputs.map(i=>i.checked).join(),before.map((v,j)=>j===i?!v:v).join(),`${name}.${keys[i]} independent state`);
      }
    });
    await use(name,Object.fromEntries(keys.map(key=>[key,{defaultChecked:false}])),async m=>eq(m.inputs.map(i=>i.checked).join(),keys.map(()=>false).join(),`${name} explicit false overrides source defaults`));
    await use(name,Object.fromEntries(keys.map(key=>[key,null])),async m=>eq(m.inputs.map(i=>i.checked).join(),defaults.join(),`${name} null member uses source defaults`));
    const groupRef=React.createRef(), refs=Object.fromEntries(keys.map(key=>[`${key}Ref`,React.createRef()]));
    await use(name,{...refs,ref:groupRef,label:'长中文组标题'.repeat(20),description:'说明'.repeat(80),error:'错误'},async m=>{
      eq(groupRef.current.tagName,name==='Switch12'?'FIELDSET':'DIV',`${name} group ref target`);
      keys.forEach((key,i)=>{eq(refs[`${key}Ref`].current,m.inputs[i],`${name}.${key} input ref`);ok(m.inputs[i].getAttribute('aria-describedby').includes('description'),`${name}.${key} group description association`);eq(m.inputs[i].getAttribute('aria-invalid'),'true',`${name}.${key} group error state`);});
    });
    for(const flag of ['disabled','readOnly']) await use(name,{[flag]:true,...Object.fromEntries(keys.map(key=>[key,{[flag]:false,onCheckedChange:()=>{throw Error('blocked');}}]))},async m=>{
      const before=m.inputs.map(i=>i.checked).join(); await settle(()=>m.inputs.forEach(i=>i.click()));eq(m.inputs.map(i=>i.checked).join(),before,`${name} group ${flag} cannot be overridden`);
    });
    await use(name,{},async m=>{
      const changes=[]; const key=keys[0];
      await m.render({[key]:{defaultChecked:false,onChange:()=>changes.push('member'),onCheckedChange:()=>changes.push('proposal')},onChange:()=>changes.push('group')});
      await settle(()=>m.inputs[0].click()); eq(changes.join(),'member,group,proposal',`${name} event ordering`);
      changes.length=0; await m.render({[key]:{onChange:e=>{changes.push('member');e.nativeEvent.preventDefault();},onCheckedChange:()=>changes.push('proposal')}});
      await settle(()=>m.inputs[0].click()); eq(changes.join(),'member',`${name} native cancel stops group callback and proposal`);
    });
    await use(name,{[keys[0]]:{defaultChecked:false},onChange:e=>e.preventDefault()},async m=>{
      await settle(()=>m.inputs[0].click());eq(m.inputs[0].checked,false,`${name} group onChange veto`);
    });
    await use(name,{[keys[0]]:{defaultChecked:false}},async m=>{
      const marker=`${name}-group-error`;let errors=0;const handler=e=>{if(e.error?.message===marker){errors++;e.preventDefault();}};window.addEventListener('error',handler);
      try{await m.render({onChange:()=>{throw Error(marker);}});await settle(()=>m.inputs[0].click());eq(errors,1,`${name} group error propagated`);eq(m.inputs[0].checked,false,`${name} group error restored`);}finally{window.removeEventListener('error',handler);}
    });
  }
  for(const [name,initial]of single) await use(name,{},async m=>{
    eq(m.inputs.length,1,`${name} scalar cardinality`);eq(m.inputs[0].checked,initial,`${name} source initial`);
    if(name==='Switch11'){eq(m.host.querySelector('label').textContent,'自动同步','Switch11 source label translated');ok(m.host.querySelector('.fr7-help').textContent.includes('同步数据'),'Switch11 source help');eq(m.inputs[0].getAttribute('aria-describedby'),m.host.querySelector('.fr7-help').id,'Switch11 associated help');eq(m.host.querySelector('[data-icon]').dataset.icon,'refresh','Switch11 refresh icon');}
    if(name==='Switch09'||name==='Switch10'){eq(m.host.querySelectorAll('svg').length,2,`${name} two icon nodes`);eq([...m.host.querySelectorAll('svg')].map(e=>e.dataset.icon).join(),name==='Switch09'?'check,x':'moon,sun',`${name} exact unchecked then checked icon order`);eq(m.host.querySelector('.fr7-fourth-switch-art').getAttribute('aria-hidden'),'true',`${name} decorative icons hidden from accessibility tree`);}

  });
  for(const f of fields) {
    const tag=`${f.name}${f.slot?'.'+f.slot:''}`;
    await use(f.name,propsFor(f,{defaultChecked:false}),async m=>{
      const el=get(m,f);el.focus();await m.render(propsFor(f,{defaultChecked:false,label:'中文标签'.repeat(40),help:'辅助说明'.repeat(50)}));eq(get(m,f),el,`${tag} stable input identity`);eq(window.document.activeElement,el,`${tag} retained focus`);eq(el.getAttribute('aria-label'),null,`${tag} custom visible label supplies accessible name without stale source-only aria-label`);
      await settle(()=>el.click());eq(el.checked,true,`${tag} uncontrolled accepts edit`);
      await m.render(propsFor(f,{defaultChecked:true}));await settle(()=>m.form.reset());eq(el.checked,false,`${tag} mount-only reset baseline`);
    },true);
    await use(f.name,propsFor(f,{label:'自定义标签','aria-label':'显式可访问名称'}),async m=>{
      eq(get(m,f).getAttribute('aria-label'),'显式可访问名称',`${tag} explicit aria-label overrides visible label deliberately`);
      await m.render(propsFor(f,{label:null,'aria-label':'无可见标签的可访问名称'}));eq(get(m,f).getAttribute('aria-label'),'无可见标签的可访问名称',`${tag} null label with explicit accessible name`);
    });
    let calls=0;
    await use(f.name,propsFor(f,{defaultChecked:false,checked:false,onCheckedChange:()=>calls++}),async m=>{
      await settle(()=>get(m,f).click());eq(calls,1,`${tag} controlled proposal once`);eq(get(m,f).checked,false,`${tag} controlled parent refusal`);
      await m.render(propsFor(f,{defaultChecked:false,checked:true}));eq(get(m,f).checked,true,`${tag} owner accepts`);
      await settle(()=>m.form.reset());eq(get(m,f).checked,true,`${tag} reset preserves owner`);
      await m.render(propsFor(f,{defaultChecked:false,checked:undefined}));eq(get(m,f).checked,true,`${tag} release preserves last effective`);
      await settle(()=>m.form.reset());eq(get(m,f).checked,false,`${tag} released reset uses mount baseline`);
    });
    for(const flag of ['disabled','readOnly']) await use(f.name,propsFor(f,{defaultChecked:false,[flag]:true,onCheckedChange:()=>{throw Error('blocked');}}),async m=>{
      await settle(()=>get(m,f).click());eq(get(m,f).checked,false,`${tag} ${flag} stops edit`);
    });
    for(const veto of ['onChange','onClick','nativeClick','nativeEvent']) {
      calls=0;let changes=0;
      const p={defaultChecked:false,onCheckedChange:()=>calls++,onChange:e=>{changes++;if(veto==='onChange')e.preventDefault();}};
      if(veto==='onClick')p.onClick=e=>e.preventDefault();if(veto==='nativeEvent')p.onClick=e=>e.nativeEvent.preventDefault();
      await use(f.name,propsFor(f,p),async m=>{
        const el=get(m,f),cancel=e=>e.preventDefault();if(veto==='nativeClick')el.addEventListener('click',cancel);
        await settle(()=>el.click());eq(calls,0,`${tag} ${veto} no proposal`);eq(changes,1,`${tag} ${veto} forwards original React change`);eq(el.checked,false,`${tag} ${veto} restores after native rollback`);
        el.removeEventListener('click',cancel);await m.render(propsFor(f,{defaultChecked:false,onCheckedChange:()=>calls++}));await settle(()=>el.click());eq(el.checked,true,`${tag} recovers after ${veto}`);
      });
    }
    for(const callback of ['onClick','onChange','onCheckedChange']) await use(f.name,propsFor(f,{defaultChecked:false}),async m=>{
      const marker=`${tag}-${callback}-expected-error`;let errors=0;const listener=e=>{if(e.error?.message===marker||e.message===marker){errors++;e.preventDefault();}};window.addEventListener('error',listener);
      try{await m.render(propsFor(f,{defaultChecked:false,[callback]:()=>{throw Error(marker);}}));await settle(()=>get(m,f).click());eq(errors,1,`${tag} ${callback} exception surfaced`);eq(get(m,f).checked,false,`${tag} ${callback} error redraw`);
        await m.render(propsFor(f,{defaultChecked:false}));await settle(()=>get(m,f).click());eq(get(m,f).checked,true,`${tag} recovers after ${callback} throw`);
      }finally{window.removeEventListener('error',listener);}
    });
    for(const callback of ['onClick','onChange','onCheckedChange'])for(const action of ['accept','reject-command','release','disabled','readOnly','replace','unmount'])await use(f.name,propsFor(f,{defaultChecked:false}),async m=>{
      calls=0;await m.render(propsFor(f,{defaultChecked:false,[callback]:()=>{
        calls++;
        if(action==='accept')m.sync(propsFor(f,{defaultChecked:false,checked:true}));
        else if(action==='reject-command')m.sync(propsFor(f,{defaultChecked:false,checked:false,ownerRevision:1}));
        else if(action==='release'){m.sync(propsFor(f,{defaultChecked:false,checked:true}));m.sync(propsFor(f,{defaultChecked:false}));}
        else if(action==='replace')m.sync({...propsFor(f,{defaultChecked:true}),key:'replacement'});
        else if(action==='unmount')flush(()=>m.root.render(null));
        else m.sync(propsFor(f,{defaultChecked:false,[action]:true}));
      }}));
      await settle(()=>get(m,f).click());eq(calls,1,`${tag} ${callback} ${action} callback`);
      if(action==='unmount')eq(m.inputs.length,0,`${tag} ${callback} no post-unmount field`);
      else eq(get(m,f).checked,['accept','release','replace'].includes(action),`${tag} ${callback} ${action} owner precedence`);
    });
    for(const cancellations of [[false],[true],[false,false],[false,true],[true,false],[true,true]]) await use(f.name,propsFor(f,{defaultChecked:false}),async m=>{
      await settle(()=>get(m,f).click());let n=0;m.form.addEventListener('reset',e=>{if(cancellations[n++])e.preventDefault();});await settle(()=>cancellations.forEach(()=>m.form.reset()));eq(get(m,f).checked,cancellations.every(Boolean),`${tag} native reset cancellation ${cancellations}`);
    });
    await use(f.name,propsFor(f,{defaultChecked:false}),async m=>{
      await settle(()=>get(m,f).click());await settle(()=>{m.form.reset();get(m,f).click();});eq(get(m,f).checked,true,`${tag} same-model post-reset edit supersedes reset job`);
    });
    await use(f.name,propsFor(f,{defaultChecked:false}),async m=>{
      m.form.addEventListener('reset',()=>get(m,f).click());await settle(()=>m.form.reset());eq(get(m,f).checked,false,`${tag} dispatch edit precedes native reset default`);
    });
    for(const when of ['inside','after'])for(const command of ['member-revision','group-revision','write-release','replace'])await use(f.name,propsFor(f,{defaultChecked:false}),async m=>{
      await settle(()=>get(m,f).click());
      const update=()=>{
        if(command==='member-revision')m.sync(propsFor(f,{defaultChecked:false,ownerRevision:1}));
        if(command==='group-revision')m.sync(propsFor(f,{defaultChecked:false},{ownerRevision:1}));
        if(command==='write-release'){m.sync(propsFor(f,{defaultChecked:false,checked:true}));m.sync(propsFor(f,{defaultChecked:false}));}
        if(command==='replace')m.sync({...propsFor(f,{defaultChecked:true}),key:'new'});
      };
      if(when==='inside')m.form.addEventListener('reset',update,{once:true});await settle(()=>{m.form.reset();if(when==='after')update();});eq(get(m,f).checked,true,`${tag} ${when} reset ${command} wins`);
    });
    await use(f.name,propsFor(f,{defaultChecked:false,name:'chosen',value:'yes'}),async m=>{
      eq(new window.FormData(m.form).has('chosen'),false,`${tag} unchecked omitted`);await settle(()=>get(m,f).click());eq(new window.FormData(m.form).get('chosen'),'yes',`${tag} native FormData`);
      await m.render(propsFor(f,{defaultChecked:false,name:'chosen',value:'yes',disabled:true}));eq(new window.FormData(m.form).has('chosen'),false,`${tag} disabled omitted`);
      await m.render(propsFor(f,{defaultChecked:false,name:'chosen',value:'yes',readOnly:true}));eq(new window.FormData(m.form).get('chosen'),'yes',`${tag} readonly submitted`);
    });
    await use(f.name,propsFor(f,{defaultChecked:false}),async m=>{
      await settle(()=>get(m,f).click());await settle(()=>{m.form.reset();get(m,f).setAttribute('form',m.other.id);});eq(get(m,f).checked,true,`${tag} reassociation retires old reset`);
      await settle(()=>m.other.reset());eq(get(m,f).checked,false,`${tag} new associated form reset`);
    });
    await use(f.name,propsFor(f,{defaultChecked:false}),async m=>{
      let proposals=0;await m.render(propsFor(f,{defaultChecked:false,onCheckedChange:()=>proposals++}));await settle(()=>get(m,f).click());await settle(()=>m.form.reset());await settle(()=>get(m,f).click());eq(proposals,2,`${tag} same old edit after native reset visible to React`);
    });
    if(f.name.startsWith('Switch'))await use(f.name,propsFor(f,{defaultChecked:false}),async m=>{
      await settle(()=>get(m,f).dispatchEvent(new window.KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true})));eq(get(m,f).checked,true,`${tag} Enter accessibility extension`);
      await m.render(propsFor(f,{defaultChecked:false,onKeyDown:e=>e.preventDefault()}));await settle(()=>get(m,f).dispatchEvent(new window.KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true})));eq(get(m,f).checked,true,`${tag} keyboard callback veto`);
    });
  }
  // Compound forms: each member can associate with another form independently.
  for(const [name,,keys]of groups)await use(name,{},async m=>{
    const props=Object.fromEntries(keys.map((key,i)=>[key,{defaultChecked:false,name:'selection',value:key,form:i%2?m.other.id:m.form.id}]));await m.render(props);
    // Remount establishes explicit false baselines rather than inheriting source defaults.
    await settle(()=>m.sync({...props,key:'form-baselines'}));await settle(()=>m.inputs.forEach(i=>i.click()));
    eq(new window.FormData(m.form).getAll('selection').join(),keys.filter((_,i)=>i%2===0).join(),`${name} main form only its members`);
    eq(new window.FormData(m.other).getAll('selection').join(),keys.filter((_,i)=>i%2===1).join(),`${name} other form only its members`);
    await settle(()=>m.other.reset());eq(m.inputs.map(i=>i.checked).join(),keys.map((_,i)=>i%2===0).join(),`${name} independent split-form reset`);
  });
  for(const [name,,keys] of groups) {
    await use(name,{label:null},async m=>{
      for(let i=0;i<keys.length;i++){
        const slot=keys[i]; await m.render({[slot]:{label:null,defaultChecked:false}});
        const el=m.inputs[i];ok(el.getAttribute('aria-label'),`${name}.${slot} fallback name when label:null`);el.focus();eq(window.document.activeElement,el,`${name}.${slot} null-label focus`);
        const before=el.checked;await settle(()=>el.click());eq(el.checked,!before,`${name}.${slot} null-label activation`);
      }
    });
    await use(name,{},async m=>{
      await m.render(Object.fromEntries(keys.map(k=>[k,{label:'长中文可见标签'.repeat(40)}])));
      for(const label of m.host.querySelectorAll('label')){const input=window.document.getElementById(label.htmlFor),before=input.checked;await settle(()=>label.click());eq(input.checked,!before,`${name} native visible-label activation`);eq(input.getAttribute('aria-label'),null,`${name} no default aria-label masks visible label`);}
    });
    await use(name,{checked:true,defaultChecked:true,values:['fake'],name:'fake'},async m=>{
      eq(m.inputs.length,3,`${name} runtime aggregate props never create fake aggregate field`);eq(m.host.querySelectorAll('input[name="fake"]').length,0,`${name} ignores runtime aggregate name`);
    });
  }
  for(const f of fields){
    const tag=`${f.name}${f.slot?'.'+f.slot:''}`,ref=React.createRef();
    await use(f.name,{...propsFor(f,{defaultChecked:false}),...(f.slot?{[`${f.slot}Ref`]:ref}:{ref})},async m=>{
      eq(ref.current,get(m,f),`${tag} ref actual input`);await settle(()=>m.root.render(null));eq(ref.current,null,`${tag} object ref cleared on unmount`);
    });
    let attachments=0,cleanups=0;const callbackRef=node=>{if(node){attachments++;return()=>{cleanups++;};}};
    await use(f.name,{...propsFor(f,{defaultChecked:false}),...(f.slot?{[`${f.slot}Ref`]:callbackRef}:{ref:callbackRef})},async m=>{eq(attachments,1,`${tag} callback ref receives actual input once`);await settle(()=>m.root.render(null));eq(cleanups,1,`${tag} callback ref cleanup once`);});
    await use(f.name,propsFor(f,{defaultChecked:false,required:true}),async m=>{eq(get(m,f).checkValidity(),false,`${tag} native required invalid`);await settle(()=>get(m,f).click());eq(get(m,f).checkValidity(),true,`${tag} native required valid`);});
    await use(f.name,propsFor(f,{defaultChecked:false,name:'explicit',value:'yes',form:''}),async m=>{eq(get(m,f).form,null,`${tag} explicit empty form disassociates`);await settle(()=>get(m,f).click());await settle(()=>m.form.reset());eq(get(m,f).checked,true,`${tag} disassociated field ignores ancestor reset`);eq(new window.FormData(m.form).has('explicit'),false,`${tag} disassociated field not submitted`);});
    await use(f.name,propsFor(f,{defaultChecked:false}),async m=>{
      let original;
      await m.render(propsFor(f,{defaultChecked:false,onChange:e=>{original=e;eq(e.currentTarget,get(m,f),`${tag} original change currentTarget`);},onCheckedChange:(checked,e)=>{eq(e,original,`${tag} proposal preserves same event object`);eq(checked,true,`${tag} proposal carries native bool`);}}));
      await settle(()=>get(m,f).click());
    });
    await use(f.name,propsFor(f,{defaultChecked:false}),async m=>{await settle(()=>get(m,f).click());await settle(()=>{m.form.reset();m.sync(propsFor(f,{defaultChecked:false,ownerRevision:-0}));});eq(get(m,f).checked,true,`${tag} negative-zero member revision retires reset`);});
    await use(f.name,propsFor(f,{defaultChecked:false}),async m=>{await settle(()=>get(m,f).click());await settle(()=>{m.form.reset();flush(()=>m.root.render(null));});eq(m.inputs.length,0,`${tag} pending reset does not resurrect unmounted field`);});
  }
  await use('Checkbox09',{},async m=>{eq([...m.host.querySelectorAll('svg')].map(x=>x.dataset.icon).join(),'folder,pen,briefcase','Checkbox09 exact row icon sequence');eq([...m.host.querySelectorAll('label')].map(x=>x.textContent).join(),'规划,设计,运营','Checkbox09 translated source label order');});
  await use('Checkbox11',{},async m=>{eq([...m.host.querySelectorAll('svg')].map(x=>x.dataset.icon).join(),'triangle,diamond,hexagon','Checkbox11 three distinct geometry nodes');eq(m.host.querySelectorAll('.fr7-fourth-control-art').length,3,'Checkbox11 each independent native field owns its shape artwork');});
  await use('Checkbox12',{},async m=>{eq(m.host.querySelectorAll('[data-icon="circle-check"]').length,3,'Checkbox12 inset circle/check count');eq(m.host.querySelectorAll('circle').length,3,'Checkbox12 actual inner circles');});
  await use('Switch12',{},async m=>{eq(m.host.querySelectorAll('fieldset').length,1,'Switch12 native fieldset');eq(m.host.querySelectorAll('legend').length,1,'Switch12 native legend');eq(m.host.querySelectorAll('ul > li').length,3,'Switch12 exact semantic row list');eq([...m.host.querySelectorAll('[data-icon]')].map(x=>x.dataset.icon).join(),'shield,bell,moon','Switch12 icon sequence');});
  const settingsRootRef=React.createRef();
  await use('Switch12',{ref:settingsRootRef},async m=>{
    const root=settingsRootRef.current;
    eq(root.tagName,'FIELDSET','Switch12 forwarded native fieldset root');
    eq(root.disabled,false,'Switch12 root initially enabled');
    eq(root.form,m.form,'Switch12 root initially belongs to ancestor form');
    await m.render({form:m.other.id,disabled:true,privacy:{disabled:false,name:'setting',value:'privacy'},notifications:{form:m.form.id,disabled:false,name:'setting',value:'notifications'},darkTheme:{form:'',disabled:false,name:'setting',value:'darkTheme'}});
    eq(settingsRootRef.current,root,'Switch12 root identity stable through native prop update');
    eq(root.disabled,true,'Switch12 disabled prop reflected on native fieldset');
    eq(root.getAttribute('disabled'),'','Switch12 disabled root attribute present');
    eq(root.form,m.other,'Switch12 root explicit form association reflected');
    eq(root.getAttribute('form'),m.other.id,'Switch12 native root form attribute exact');
    eq(m.inputs[0].form,m.other,'Switch12 default member form explicitly forwarded independently');
    eq(m.inputs[1].form,m.form,'Switch12 member explicit form overrides root form');
    eq(m.inputs[2].form,null,'Switch12 member empty form overrides root form');
    for(const el of m.inputs){eq(el.disabled,true,'Switch12 disabled members retain explicit safety forwarding');const before=el.checked;await settle(()=>el.click());eq(el.checked,before,'Switch12 disabled root/member never toggles');}
    await m.render({disabled:false,notifications:{form:m.form.id,disabled:true,name:'setting',value:'notifications'}});
    eq(root.disabled,false,'Switch12 root disabled dynamic release');
    eq(root.hasAttribute('disabled'),false,'Switch12 disabled root attribute removed');
    eq(m.inputs.map(x=>x.disabled).join(),'false,true,false','Switch12 member safety preserved after root release');
    await settle(()=>m.inputs[0].click());eq(m.inputs[0].checked,true,'Switch12 member usable after disabled release');
    eq(new window.FormData(m.other).get('setting'),'privacy','Switch12 explicit member form submits independent of fieldset');
    await m.render({form:undefined,notifications:{form:m.other.id},darkTheme:{form:''}});
    eq(root.hasAttribute('form'),false,'Switch12 removed form prop clears root attribute');
    eq(root.form,m.form,'Switch12 root returns to ancestor form');
    eq(m.inputs[0].form,m.form,'Switch12 default member also returns to ancestor');
    eq(m.inputs[1].form,m.other,'Switch12 member stays with separately explicit form');
    eq(m.inputs[2].form,null,'Switch12 member still explicitly disassociated');
    await m.render({form:'',privacy:{},notifications:{form:m.other.id},darkTheme:{form:m.form.id}});
    eq(root.form,null,'Switch12 explicit empty root form disassociates only its own default');
    eq(m.inputs[0].form,null,'Switch12 empty default also explicitly passed to member');
    eq(m.inputs[1].form,m.other,'Switch12 separate member form survives empty root association');
    eq(m.inputs[2].form,m.form,'Switch12 third member association independent of empty root');
    await settle(()=>m.root.render(null));
    eq(settingsRootRef.current,null,'Switch12 native root ref cleared on unmount');
    eq(root.isConnected,false,'Switch12 native fieldset disconnected on cleanup');
    eq(m.inputs.length,0,'Switch12 native root cleanup removes member inputs');
  });
  const a=await mount('Switch12'),b=await mount('Switch12');try{const ids=[...a.inputs,...b.inputs].map(x=>x.id);eq(new Set(ids).size,6,'separate instances unique ids');await settle(()=>a.inputs[0].click());eq(b.inputs[0].checked,false,'separate instance isolation');}finally{await a.close();await b.close();}
  // Static token/selector tests are evidence of declared CSS, never browser computed style or hit-testing.
  const fs=require('node:fs'),path=require('node:path');
  const css=fs.readFileSync(path.join(__dirname,'../src/fourth-selection/styles.css'),'utf8');
  const jsx=fs.readFileSync(path.join(__dirname,'../src/fourth-selection/index.jsx'),'utf8');
  // Match declared CSS selectors against real React DOM. JSDOM cannot establish pseudo-element geometry.
  const activationRules=[...css.matchAll(/([^{}]+)::after\s*\{([^{}]*)\}/g)]
    .filter(([,selector,body])=>selector.includes('.fr7-switch-12') && /content:\s*(?:''|"")\s*;/.test(body))
    .map(([,selector])=>selector.trim());
  eq(activationRules.length,1,'Switch12 exactly one declared full-row activation pseudo-element rule');
  const longText='很长的中文偏好设置说明，需要保留全部内容并正常换行。'.repeat(12);
  for(const [caseName,props] of [
    ['default',{}], ['disabled',{disabled:true}],
    ['long',{label:longText,description:longText,privacy:{label:longText},notifications:{label:longText},darkTheme:{label:longText}}]
  ]) await use('Switch12',props,async m=>{
    const fieldset=m.host.querySelector('fieldset.fr7-switch-12'),legend=fieldset.querySelector(':scope > legend');
    ok(legend,'Switch12 '+caseName+' retains native legend');
    eq(fieldset.getAttribute('aria-labelledby'),legend.id,'Switch12 '+caseName+' fieldset retains native legend name');
    eq(legend.textContent,caseName==='long'?longText:'管理偏好设置：','Switch12 '+caseName+' complete Chinese heading');
    for(const selector of activationRules){
      eq(legend.matches(selector),false,'Switch12 '+caseName+' legend does not generate row activation overlay');
      const matched=[...fieldset.querySelectorAll(selector)];
      eq(matched.length,3,'Switch12 '+caseName+' exactly three row activation hosts');
      matched.forEach((label,index)=>{
        eq(label.tagName,'LABEL','Switch12 '+caseName+' activation host is a native label');
        ok(label.parentElement.matches('.fr7-check-row'),'Switch12 '+caseName+' label keeps local positioned row ancestor');
        eq(label.control,m.inputs[index],'Switch12 '+caseName+' label retains native input association');
        if(caseName==='long')eq(label.textContent,longText,'Switch12 long complete Chinese member content');
      });
    }
    if(caseName!=='disabled'){
      const label=fieldset.querySelector('label.fr7-label');
      await settle(()=>label.click());eq(m.inputs[0].checked,true,'Switch12 '+caseName+' native label activation still toggles input');
      await settle(()=>m.inputs[0].focus());eq(window.document.activeElement,m.inputs[0],'Switch12 '+caseName+' native input remains programmatically focusable');
    }else{
      await settle(()=>fieldset.querySelectorAll('label.fr7-label').forEach(label=>label.click()));
      eq(m.inputs.map(input=>input.checked).join(),'false,false,false','Switch12 disabled row labels cannot toggle inputs');
    }
  });
  await use('Switch12',{privacy:{label:null},notifications:{label:null},darkTheme:{label:null}},async m=>{
    for(const selector of activationRules)eq(m.host.querySelectorAll(selector).length,0,'Switch12 label:null creates no row activation overlays including legend');
    eq(m.inputs.length,3,'Switch12 label:null retains all three native controls');
    eq(m.host.querySelectorAll('legend').length,1,'Switch12 member label:null preserves native group legend');
    await settle(()=>m.inputs[0].click());eq(m.inputs[0].checked,true,'Switch12 label:null retains native input activation');
  });
  const rules=[
    [/overflow-wrap: anywhere/, 'long Chinese wrapping contract'],
    [/min-width: 0/, 'long Chinese shrinkable flex children'],
    [/\.fr7-fourth-icon-switch \.fr7-check-control \{ width: var\(--fr-fourth-switch-width\)/, 'icon-switch target has local width'],
    [/\.fr7-fourth-switch-art \{[^}]*top: 0;[^}]*height: 44px/, 'icon artwork anchored to first 44px row'],
    [/\.fr7-switch-11 \.fr7-check-control \{ position: static/, 'Switch11 full-card native input has no inner positioned containing block'],
    [/\.fr7-switch-11 \.fr7-check-input \{ min-width: 44px; min-height: 44px/, 'Switch11 input minimum target'],
    [/\.fr7-switch-12 \.fr7-check-row > label\.fr7-label::after \{[^}]*position: absolute; inset: -\.75rem -1\.25rem/, 'Switch12 real row label reaches padding without selecting legend'],
    [/\.fr7-checkbox-11 \.fr7-check-visual[^}]*background: transparent/, 'Checkbox11 has geometry rather than generic square'],
    [/\.fr7-checkbox-12 \.fr7-check-visual, \.fr7-checkbox-12 \.fr7-check-input:checked \+ \.fr7-check-visual \{[^}]*background: var\(--fr-fourth-tone\)/, 'Checkbox12 both states retain colored disk'],
    [/\.fr7-fourth-icon-switch:has\(\.fr7-check-input:checked\) \.fr7-fourth-unchecked-icon \{ visibility: hidden/, 'checked hides unchecked icon'],
    [/\.fr7-fourth-icon-switch:has\(\.fr7-check-input:checked\) \.fr7-fourth-checked-icon \{ visibility: visible/, 'checked shows source mapped icon'],
    [/prefers-reduced-motion: reduce/, 'system reduced motion'],
    [/data-motion="off"/, 'explicit motion off'],
    [/data-motion="reduce"/, 'explicit motion reduce'],
    [/--fr-fourth-sync-duration: 0ms/, 'finite sync rotation can be disabled'],
    [/:dir\(rtl\)/, 'RTL control direction contract'],
    [/forced-colors: active/, 'forced colors contract']
  ];
  for(const [re,message] of rules)ok(re.test(css),message);
  ok(!/animation[^;]*infinite/.test(css),'no looping animation');
  ok(!/dangerouslySetInnerHTML|innerHTML|iframe|fetch\(/.test(jsx),'real React composition without native HTML injection/network');
  const palettes=JSON.parse(fs.readFileSync(path.join(__dirname,'../src/palettes.json'),'utf8'));
  const rgb=s=>{s=s.replace('#','');if(s.length===3)s=[...s].map(x=>x+x).join('');return[0,2,4].map(i=>parseInt(s.slice(i,i+2),16)/255);};
  const luminance=s=>rgb(s).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
  const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
  for(const [mode,p] of Object.entries(palettes)){
    for(const bg of ['--ds-canvas','--ds-surface'])for(const fg of ['--ds-text','--ds-muted'])ok(contrast(p[fg],p[bg])>=4.5,`${mode} static text contrast ${fg}/${bg}`);
    for(const tone of ['danger','info','success']){
      ok(contrast(p[`--ds-${tone}`],p[`--ds-${tone}-bg`])>=3,`${mode} static checked mark semantic ${tone}`);
      for(const bg of ['--ds-canvas','--ds-surface'])ok(contrast(p[`--ds-${tone}`],p[bg])>=3,`${mode} static semantic shape ${tone}/${bg}`);
    }
    for(const bg of ['--ds-canvas','--ds-surface'])for(const fg of ['--ds-accent','--ds-control-line','--ds-focus'])ok(contrast(p[fg],p[bg])>=3,`${mode} static shape/boundary/focus ${fg}/${bg}`);
    for(const [fg,bg] of [['--ds-on-accent','--ds-accent-fill'],['--ds-text','--ds-subtle'],['--ds-control-line','--ds-subtle']])ok(contrast(p[fg],p[bg])>=3,`${mode} static switch ink/boundary ${fg}/${bg}`);
  }
  return {suite:'fourth-selection',scenarios,assertions,fields:fields.length,canonicalIds:8,browser:false,layout:false,trustedKeyboard:false};
};
