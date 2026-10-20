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
    form.id = `third-selection-${++serial}`; other.id = `third-selection-other-${serial}`;
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
    ['Checkbox05','CHECKBOX05_SLOTS',['standard','medium','large'],[true,true,true]],
    ['Checkbox06','CHECKBOX06_SLOTS',['salad','wrap','juice'],[true,true,false]],
    ['Checkbox08','CHECKBOX08_SLOTS',['design','marketing','product'],[false,false,false]],
    ['Switch05','SWITCH05_SLOTS',['destructive','success','info','warning'],[true,true,true,true]],
    ['Switch07','SWITCH07_SLOTS',['small','medium','large'],[false,false,false]]
  ];
  const single = [['Checkbox07',true],['Switch06',false],['Switch08',true]];
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
      eq(groupRef.current.tagName,'DIV',`${name} group ref target`);
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
    if(name==='Checkbox07'){eq(m.host.querySelector('label').textContent,'订阅更新','Checkbox07 source label');ok(m.host.querySelector('.fr7-help').textContent.includes('条款与条件'),'Checkbox07 source help');eq(m.inputs[0].getAttribute('aria-describedby'),m.host.querySelector('.fr7-help').id,'Checkbox07 associated help');}
    if(name==='Switch08'){eq(m.host.querySelectorAll('svg').length,2,'Switch08 both icon nodes present');eq([...m.host.querySelectorAll('svg')].map(e=>e.dataset.icon).join(),'check,x','Switch08 source icon order');eq(m.host.querySelector('.fr7-switch-icons').getAttribute('aria-hidden'),'true','Switch08 decorative icons hidden from accessibility tree');}
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
    for(const callback of ['onChange','onCheckedChange'])for(const action of ['accept','reject-command','release','disabled','readOnly','replace','unmount'])await use(f.name,propsFor(f,{defaultChecked:false}),async m=>{
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
    m.sync({...props,key:'form-baselines'});await settle(()=>m.inputs.forEach(i=>i.click()));
    eq(new window.FormData(m.form).getAll('selection').join(),keys.filter((_,i)=>i%2===0).join(),`${name} main form only its members`);
    eq(new window.FormData(m.other).getAll('selection').join(),keys.filter((_,i)=>i%2===1).join(),`${name} other form only its members`);
    await settle(()=>m.other.reset());eq(m.inputs.map(i=>i.checked).join(),keys.map((_,i)=>i%2===0).join(),`${name} independent split-form reset`);
  });
  await use('Checkbox06',{},async m=>{
    for(const label of m.host.querySelectorAll('label')){const input=window.document.getElementById(label.htmlFor),before=input.checked;await settle(()=>label.click());eq(input.checked,!before,'Checkbox06 actual badge label activation');}
  });
  await use('Checkbox06',{salad:{label:null,'aria-label':'无可见标签的沙拉',defaultChecked:false}},async m=>{
    const el=m.inputs[0];eq(el.getAttribute('aria-label'),'无可见标签的沙拉','Checkbox06 label-null accessible name');el.focus();eq(window.document.activeElement,el,'Checkbox06 label-null native focus');await settle(()=>el.click());eq(el.checked,true,'Checkbox06 label-null native activation');
  });
  const a=await mount('Checkbox08'),b=await mount('Checkbox08');try{const ids=[...a.inputs,...b.inputs].map(x=>x.id);eq(new Set(ids).size,6,'separate instances unique ids');await settle(()=>a.inputs[0].click());eq(b.inputs[0].checked,false,'separate instance isolation');}finally{await a.close();await b.close();}
  return {suite:'third-selection',scenarios,assertions,fields:fields.length,canonicalIds:8,browser:false,layout:false,trustedKeyboard:false};
};
