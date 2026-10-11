/* Self-contained, editable design specimen. No model call, analytics or persistence. */
(function(){
 'use strict';
 const $=id=>document.getElementById(id), all=s=>Array.from(document.querySelectorAll(s));
 const profile=JSON.parse($('mimo-profile').textContent);
 const motions=JSON.parse($('mimo-motions').textContent).resources;
 const motionExamples=JSON.parse($('mimo-motion-examples').textContent);
 const body=document.body;const scenes=['research','developer','workspace'];
 let activeScene='research',editEnabled=false,stressEnabled=false,controller=null,currentMotion='index-trace';
 let toastTimer=0,taskTimers=[],taskActive=false;
 const trustedOriginals=new Map(all('[data-edit-id]').map(e=>[e.dataset.editId,e.innerHTML]));
 const textEls=new Map(all('[data-edit-id]').map(e=>[e.dataset.editId,e]));
 const on=(id,event,fn)=>{if($(id))$(id).addEventListener(event,fn);};
 function say(message){const t=$('toast');if(!t)return;t.textContent=message;t.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.hidden=true,4200);if($('global-status'))$('global-status').textContent=message;}
 function mode(){return body.dataset.mimoMode==='dark'?'dark':'light';}
 function colorProfile(){return profile.branches[mode()==='light'?'rational-humanistic':'dark-tech'].color;}
 function contrast(a,b){
   const l=s=>{const c=s.replace('#','').match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2];};
   const [x,y]=[l(a),l(b)].sort((x,y)=>y-x);return(x+.05)/(y+.05);
 }
 function updatePalette(){
   const c=colorProfile();
   if($('palette')){
     $('palette').replaceChildren();
     for(const [k,label] of [['canvas','Canvas'],['surface','Surface'],['raised','Raised'],['ink','Ink'],['muted','Muted'],['accent','Accent']]){
       const d=document.createElement('div');d.className='palette-item';const chip=document.createElement('div');chip.className='chip';chip.style.backgroundColor=c[k];
       const l=document.createElement('div');l.className='label';l.append(document.createTextNode(label),document.createElement('br'));const hex=document.createElement('span');hex.textContent=c[k];l.append(hex);d.append(chip,l);$('palette').append(d);
     }
   }
   if($('contrast-readout'))$('contrast-readout').textContent='正文 '+contrast(c.ink,c.canvas).toFixed(2)+':1 · 次正文 '+contrast(c.muted,c.canvas).toFixed(2)+':1';
 }
 function setMode(m){MimoSkin.apply(body,m);if($('mode-toggle')){$('mode-toggle').setAttribute('aria-pressed',String(m==='dark'));$('mode-toggle').textContent=m==='dark'?'理性人文 ↗':'暗黑科技 ↗';}if($('mode-label'))$('mode-label').textContent=m==='dark'?'暗黑科技':'理性人文';updatePalette();}
 function setScene(s){
   if(!scenes.includes(s))throw new RangeError('Invalid scene');activeScene=s;
   all('[data-scene]').forEach(b=>{b.setAttribute('aria-selected',String(b.dataset.scene===s));b.tabIndex=b.dataset.scene===s?0:-1;});
   scenes.forEach(id=>{if($('scene-'+id))$('scene-'+id).hidden=id!==s;});if($('scene-name'))$('scene-name').textContent=s.toUpperCase();
 }
 function setupTabs(){all('[role="tablist"]').forEach(group=>group.addEventListener('keydown',e=>{
   if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
   const tabs=Array.from(group.querySelectorAll('[role="tab"]'));const i=tabs.indexOf(document.activeElement);if(i<0)return;e.preventDefault();
   const n=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[n].focus();tabs[n].click();
 }));}
 function isReduced(){return MimoMotion.isReduced(body);}
 function setReduced(flag){body.dataset.mimoMotion=flag?'reduced':'auto';if($('motion-toggle')){$('motion-toggle').setAttribute('aria-pressed',String(flag));$('motion-toggle').textContent=flag?'动态已减少':'减少动态';}if(isReduced()&&controller)controller.finish();}
 function loadMotion(id){
   const r=motions.find(x=>x.localId===id);if(!r||!$('motion-root'))return;currentMotion=id;
   controller?.cancel();$('motion-root').innerHTML=motionExamples[id]; // trusted package source, never imported user markup
   all('[data-motion-id]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.motionId===id)));
   $('motion-title').textContent=r.nameZh;$('motion-meaning').textContent=r.meaning;$('motion-duration').textContent=r.durationMs+' ms';$('motion-policy').textContent=r.guidance;
   controller=MimoMotion.play($('motion-root'),id,{autoplay:false,onUpdate:state=>{
     $('motion-seek').value=Math.round(state.progress*100);$('motion-percent').textContent=Math.round(state.progress*100)+'%';
     $('motion-pause').textContent=state.playing?'暂停':'继续';$('motion-stage').dataset.playing=String(state.playing);
   }});
 }
 function download(text,name,type){const url=URL.createObjectURL(new Blob([text],{type:type||'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);}
 function plain(el){const c=el.cloneNode(true);c.querySelectorAll('br').forEach(b=>b.replaceWith('\n'));return c.textContent;}
 function getProject(){const texts={};textEls.forEach((e,k)=>texts[k]=plain(e));return{format:'mimo-editable-specimen',schemaVersion:2,languageVersion:profile.version,mode:mode(),scene:activeScene,texts};}
 function validateProject(p){
   if(!p||typeof p!=='object'||p.format!=='mimo-editable-specimen'||p.schemaVersion!==2)throw new Error('不是兼容的 MiMo v2 样例项目。');
   if(!['light','dark'].includes(p.mode)||!scenes.includes(p.scene))throw new Error('项目分支或场景无效。');
   if(!p.texts||typeof p.texts!=='object'||Array.isArray(p.texts)||Object.getPrototypeOf(p.texts)!==Object.prototype)throw new Error('缺少文本数据。');
   for(const [k,v]of Object.entries(p.texts)){if(!textEls.has(k)||typeof v!=='string'||v.length>3000)throw new Error('项目包含未知字段或过长文本。');}
   return p;
 }
 function applyProject(p){validateProject(p);setMode(p.mode);setScene(p.scene);for(const [k,v]of Object.entries(p.texts)){const e=textEls.get(k);e.textContent=v;e.style.whiteSpace='pre-line';}return p;}
 function setEditable(flag){editEnabled=flag;all('[data-edit-id]').forEach(e=>{e.contentEditable=String(flag);e.setAttribute('spellcheck','false');if(flag)e.setAttribute('aria-label','可编辑样例文字：'+e.dataset.editId);else e.removeAttribute('aria-label');});if($('edit-toggle')){$('edit-toggle').setAttribute('aria-pressed',String(flag));$('edit-toggle').textContent=flag?'完成编辑':'编辑文字';}}
 function exportHtml(){
   const snapshot=getProject();const clone=document.documentElement.cloneNode(true);
   clone.querySelector('#mimo-project-state').textContent=JSON.stringify(snapshot).replace(/</g,'\\u003c');
   clone.querySelectorAll('[contenteditable]').forEach(e=>e.removeAttribute('contenteditable'));const toast=clone.querySelector('#toast');if(toast)toast.hidden=true;
   clone.querySelectorAll('dialog[open]').forEach(e=>e.removeAttribute('open'));
   download('<!doctype html>\n'+clone.outerHTML,'MiMo_Editable_Design_v2.0.html','text/html;charset=utf-8');say('已生成 HTML 文件。请保存下载，页面不会自动写入你的硬盘。');
 }
 async function copyCommand(){
   const text=$('copy-command').textContent;let success=false;
   try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text);success=true;}}catch(_){/* Fallback below. */}
   if(!success){const t=document.createElement('textarea');t.value=text;t.style.position='fixed';t.style.top='0';t.style.left='-10000px';document.body.append(t);t.select();try{success=document.execCommand('copy');}catch(_){}t.remove();}
   if(success){$('copy-command-button').textContent='已复制 ✓';say('命令已复制，未执行。');setTimeout(()=>$('copy-command-button').textContent='复制 ↗',1900);}else{say('浏览器未授予复制权限，请手动选择并复制命令。');const range=document.createRange();range.selectNodeContents($('copy-command'));const sel=window.getSelection();sel.removeAllRanges();sel.addRange(range);}
 }
 function taskProgress(n,msg){$('task-status').textContent=msg;$('task-progress').setAttribute('aria-valuenow',String(n));$('task-progress').querySelector('i').style.width=(n/3*100)+'%';all('[data-step]').forEach(e=>e.dataset.state=Number(e.dataset.step)===Math.min(2,n)?'active':'idle');}
 function stopTask(canceled){taskTimers.forEach(clearTimeout);taskTimers=[];taskActive=false;if($('task-run')){$('task-run').disabled=false;$('task-run').removeAttribute('aria-busy');}$('task-cancel')&&($('task-cancel').disabled=true);if(canceled){taskProgress(0,'已取消 · 你的输入仍保留');$('task-output').textContent='演示已停止，没有调用模型或创建外部文件。';}}
 function runTask(){
   if(taskActive)return;const text=$('task-input').value.trim();if(!text){say('先写下想完成的任务。');$('task-input').focus();return;}
   stopTask(false);taskActive=true;$('task-run').disabled=true;$('task-run').setAttribute('aria-busy','true');$('task-cancel').disabled=false;$('task-output').textContent='';taskProgress(0,'本地演示 · 理解意图');
   taskTimers.push(setTimeout(()=>taskProgress(1,'本地演示 · 建立结构'),650),setTimeout(()=>taskProgress(2,'本地演示 · 整理表达'),1300),setTimeout(()=>{
     taskProgress(3,'演示完成 · 非 AI 生成结果');$('task-output').textContent='示例纲要：明确内容目标 → 选择所需设计资源 → 预览并保留人的修改权。';stopTask(false);
   },1950));
 }
 function selectWorkspace(tab){all('[data-workspace-nav]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.workspaceNav===tab)));['compose','files','history'].forEach(t=>$('workspace-'+t).hidden=t!==tab);}
 // Safe export/import operates on known text fields only. No arbitrary HTML execution.
 on('mode-toggle','click',()=>setMode(mode()==='light'?'dark':'light'));
 on('motion-toggle','click',()=>setReduced(body.dataset.mimoMotion!=='reduced'));
 all('[data-scene]').forEach(b=>b.addEventListener('click',()=>setScene(b.dataset.scene)));
 all('[data-motion-id]').forEach(b=>b.addEventListener('click',()=>loadMotion(b.dataset.motionId)));
 on('motion-play','click',()=>{controller?.seek(0);controller?.play();if(isReduced())say('减少动态效果已生效，直接展示最终状态。');});
 on('motion-pause','click',()=>controller?.playing?controller.pause():controller?.play());
 on('motion-reset','click',()=>controller?.reset());on('motion-seek','input',e=>{if(isReduced()){controller?.finish();return;}controller?.seek(Number(e.target.value)/100);});
 on('edit-toggle','click',()=>setEditable(!editEnabled));
 const english={
  'research-title':'A clearer path from a difficult question to a meaningful scientific explanation.',
  'research-body':'A strong visual system should remain legible when the content becomes more complex. This is a deliberately long English paragraph for responsive stress testing, not a claim about a real research project.',
  'developer-title':'Build with intention. Keep the complexity understandable.',
  'developer-body':'Commands, code, evidence and state are useful content—not decorative placeholders. This long paragraph tests wrapping across compact viewports without changing the design identity.',
  'workspace-title':'A quiet workspace for work that deserves your complete attention.',
  'workspace-body':'Keep your intention, progress and result within reach. This local interaction sample is not connected to an AI model or cloud project.'
 };
 on('text-toggle','click',()=>{stressEnabled=!stressEnabled;for(const [k,v]of Object.entries(english)){const e=textEls.get(k);if(stressEnabled){e.textContent=v;e.lang='en';e.style.whiteSpace='normal';}else{e.innerHTML=trustedOriginals.get(k);e.lang='zh-CN';}}$('text-toggle').setAttribute('aria-pressed',String(stressEnabled));$('text-toggle').textContent=stressEnabled?'恢复中文样例':'长英文测试';});
 on('export-html','click',exportHtml);on('export-project','click',()=>download(JSON.stringify(getProject(),null,2),'MiMo_Specimen_Project_v2.0.json','application/json'));
 on('export-tokens','click',()=>download(JSON.stringify(profile,null,2),'MiMo_Design_Language_v2.0.json','application/json'));
 on('import-project','click',()=>$('project-file').click());
 on('project-file','change',async e=>{const f=e.target.files[0];if(!f)return;try{if(f.size>131072)throw new Error('样例项目大小不能超过 128 KiB。');const p=JSON.parse(await f.text());validateProject(p);applyProject(p);say('项目已恢复。只有白名单文本字段与分支状态被读取。');}catch(error){say('导入失败：'+error.message);}finally{e.target.value='';}});
 on('copy-command-button','click',copyCommand);
 all('[data-platform]').forEach(b=>b.addEventListener('click',()=>{all('[data-platform]').forEach(t=>{t.setAttribute('aria-selected',String(t===b));t.tabIndex=t===b?0:-1;});$('command-example').setAttribute('aria-labelledby',b.id);$('copy-command').textContent=b.dataset.platform==='node'?'node --version':'python --version';$('copy-command-button').textContent='复制 ↗';}));
 all('[data-workspace-nav]').forEach(b=>b.addEventListener('click',()=>selectWorkspace(b.dataset.workspaceNav)));
 all('[data-prompt]').forEach(b=>b.addEventListener('click',()=>{$('task-input').value=b.dataset.prompt;$('task-input').focus();}));
 on('task-run','click',runTask);on('task-cancel','click',()=>stopTask(true));
 on('primary-demo','click',()=>say('已收到操作。此为本地组件反馈示例。'));
 on('open-dialog','click',()=>$('demo-dialog').showModal());on('close-dialog','click',()=>$('demo-dialog').close());
 on('open-principles-dialog','click',()=>$('ai-dialog').showModal());on('close-ai-dialog','click',()=>$('ai-dialog').close());
 on('loading-demo','click',()=>{const b=$('loading-demo');b.disabled=true;b.setAttribute('aria-busy','true');b.textContent='处理中…';setTimeout(()=>{b.disabled=false;b.removeAttribute('aria-busy');b.textContent='模拟处理中';say('本地反馈示例已完成。');},850);});
 on('validate-name','click',()=>{const e=$('name-input'),ok=e.value.trim().length>0;e.setAttribute('aria-invalid',String(!ok));$('name-feedback').className=ok?'mimo-success':'mimo-error';$('name-feedback').textContent=ok?'名称有效 ✓ · 未发送到服务器。':'请填写项目名称。原有输入不会被清空。';if(!ok)e.focus();});
 on('name-input','input',()=>{if($('name-input').value.trim()){$('name-input').setAttribute('aria-invalid','false');$('name-feedback').className='';$('name-feedback').textContent='修改已保留，点击验证继续。';}});
 let savedReferences=0;on('save-reference','click',()=>{savedReferences++;$('reference-feedback').textContent='已收藏 '+savedReferences+' 个会话内参考。刷新会清除，请用导出保存作品。';});
 all('input[name="density"]').forEach(e=>e.addEventListener('change',()=>{const small=e.value==='compact';all('#density-table :is(td,th)').forEach(c=>c.style.paddingBlock=small?'8px':'13px');}));
 setupTabs();setMode(mode());setScene('research');
 try{applyProject(JSON.parse($('mimo-project-state').textContent));}catch(e){say('无法恢复内嵌项目：'+e.message);}
 setEditable(false);setReduced(body.dataset.mimoMotion==='reduced');loadMotion('index-trace');
 const pref=window.matchMedia('(prefers-reduced-motion: reduce)');pref.addEventListener?.('change',()=>{if(isReduced())controller?.finish();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)controller?.pause();});
 globalThis.MimoLab={version:'2.0.0',getProject,applyProject,validateProject,setMode,setScene,setReduced,loadMotion,getMotion:()=>controller,profile,manifest:motions,contrast};
})();
