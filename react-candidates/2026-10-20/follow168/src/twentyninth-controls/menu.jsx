import React,{forwardRef,useCallback,useId,useLayoutEffect,useRef}from'react';
import {useDisclosureSet,FocusBoundary,Icon,observeCancellation}from'./engine.jsx';
import DATA from'./data.json';
const SECTION_IDS=['settings','workspace'],ACTION_IDS=['profile','appearance','notifications','billing','members','teams','projects','logout'];
const labelFor=id=>id==='logout'?'Log out':id[0].toUpperCase()+id.slice(1);
// Determine light-DOM availability without layout-box heuristics (which reject
// display:contents descendants and cannot be proved by a DOM-only test runner).
// Visibility is computed on the target: a visible descendant may override a
// visibility:hidden ancestor. Display, inert and closed containers still win.
function available(node){
 if(!node?.isConnected||node.matches(':disabled,[type="hidden"]')||node.closest('[hidden],[inert]'))return false;
 const view=node.ownerDocument.defaultView,visibility=view.getComputedStyle(node).visibility;
 if(visibility==='hidden'||visibility==='collapse')return false;
 for(let ancestor=node;ancestor;ancestor=ancestor.parentElement){
  const style=view.getComputedStyle(ancestor);
  if(style.display==='none'||(ancestor!==node&&style.contentVisibility==='hidden')||ancestor.matches('dialog:not([open])'))return false;
  if(ancestor!==node&&ancestor.matches('details:not([open])')){const summary=[...ancestor.children].find(child=>child.tagName==='SUMMARY');if(!summary?.contains(node))return false;}
 }
 return true;
}
function tabOrder(doc,excluded){
 const candidates=[...doc.querySelectorAll('a[href],area[href],button,input,select,textarea,iframe,object,embed,audio[controls],video[controls],summary,[contenteditable="true"],[contenteditable=""],[tabindex]')];
 const index=node=>!node.hasAttribute('tabindex')&&(node.matches('[contenteditable="true"],[contenteditable=""]')||node.matches('details>summary:first-of-type'))?0:node.tabIndex;
 return candidates.filter(node=>index(node)>=0&&available(node)&&!excluded?.contains(node)).filter(node=>{
  if(!node.matches('input[type="radio"]')||!node.name)return true;
  const checked=candidates.find(other=>other!==node&&other.matches('input[type="radio"]')&&other.name===node.name&&other.form===node.form&&other.getRootNode()===node.getRootNode()&&other.checked);
  return !checked||node.checked;
 }).sort((a,b)=>{const x=index(a),y=index(b);return x>0?(y>0?x-y:-1):y>0?1:0;});
}
function MenuContents({state,id,menuRef,menuProps,sections,disabled,itemProps,onAction,onKeyDown,onRemovedFocus}){
 const {ref:sectionRef,...sectionInput}=sections||{},owner=useDisclosureSet({...sectionInput,disabled:disabled||sectionInput.disabled},sectionRef,'collapsible-08',SECTION_IDS),root=useRef(null),uid=useId(),keyStamps=useRef(new WeakMap());
 const{ref:forwardedRef,onKeyDown:_key,onKeyDownCapture:consumerCapture,children:_c,dangerouslySetInnerHTML:_h,className='',...native}=menuProps;
 const setRef=useCallback(node=>{root.current=node;menuRef.current=node;const cleanup=typeof forwardedRef==='function'?forwardedRef(node):undefined;if(forwardedRef&&typeof forwardedRef!=='function')forwardedRef.current=node;return()=>{if(menuRef.current===node)menuRef.current=null;root.current=null;if(typeof cleanup==='function')cleanup();else if(typeof forwardedRef==='function')forwardedRef(null);else if(forwardedRef)forwardedRef.current=null;};},[menuRef,forwardedRef]);
 useLayoutEffect(()=>{const node=root.current;return()=>{const active=node?.ownerDocument.activeElement;if(node?.contains(active))onRemovedFocus(active);};},[onRemovedFocus]);
 const action=(action)=>{const p=itemProps[action]||{},{onClick,className='',children:_c,dangerouslySetInnerHTML:_h,...attrs}=p;return <button {...attrs} key={action} type="button" role="menuitem" tabIndex={-1} disabled={disabled||p.disabled} data-menu-action={action} className={`fr29-menu-action ${action==='logout'?'fr29-menu-destructive':''} ${className}`} onClick={e=>onAction(action,e,onClick)}><Icon kind={action==='profile'?'user':action==='logout'?'logout':'dot'}/><span>{labelFor(action)}</span></button>;};
 return <div {...native} ref={setRef} id={id} role="menu" tabIndex={-1} className={`fr29-workspace-menu ${className}`} onKeyDownCapture={e=>{keyStamps.current.set(e.nativeEvent,{outer:state.epoch.current,inner:owner.epoch.current});consumerCapture?.(e);}} onKeyDown={e=>onKeyDown(e,{stamp:keyStamps.current.get(e.nativeEvent),inner:owner.epoch})}>
 {action('profile')}<div role="separator" className="fr29-menu-separator"/>
 <div {...owner.native} ref={owner.rootRef} className={`fr29-menu-sections ${owner.className}`} data-menu-sections="">
 {DATA['collapsible-08'].sections.map((section,i)=>{const value=SECTION_IDS[i],open=owner.selected.includes(value),p=owner.triggerProps[value]||{},{onClick,className='',children:_c,dangerouslySetInnerHTML:_h,...attrs}=p,triggerId=`${uid}-${value}-trigger`,contentId=`${uid}-${value}-content`;
 return <div key={value} className="fr29-menu-section" data-menu-section={value} data-state={open?'open':'closed'}><button {...attrs} type="button" role="menuitem" tabIndex={-1} id={triggerId} aria-expanded={open} aria-controls={contentId} data-menu-section-trigger={value} disabled={owner.disabled||p.disabled} className={`fr29-menu-section-trigger ${className}`} onClick={e=>owner.click(e,value,onClick)}><Icon kind={value==='settings'?'settings':'users'}/><span>{section.label}</span><Icon kind="right"/></button><div id={contentId} role="group" aria-labelledby={triggerId} hidden={!open}>{open&&<FocusBoundary triggerId={triggerId} className="fr29-menu-subitems">{section.items.map(label=>action(label.toLowerCase()))}</FocusBoundary>}</div></div>;
 })}</div><div role="separator" className="fr29-menu-separator"/>{action('logout')}
 </div>;
}
export const Collapsible08=forwardRef(function Collapsible08({open,defaultOpen=false,onOpenChange,onAction,disabled=false,triggerProps={},menuProps={},sections={},itemProps={},...native},ref){
 if(open!==undefined&&arguments[0]?.defaultOpen!==undefined)throw new TypeError('Collapsible08: open/defaultOpen are exclusive');
 if((open!==undefined&&typeof open!=='boolean')||typeof defaultOpen!=='boolean')throw new TypeError('Collapsible08: open must be boolean');
 const state=useDisclosureSet({...native,...(open!==undefined?{expanded:open?['menu']:[]}:{defaultExpanded:defaultOpen?['menu']:[]}),disabled,onExpandedChange:(next,d)=>onOpenChange?.(next.includes('menu'),{id:'collapsible-08',reason:d.reason,previousOpen:d.previousExpanded.includes('menu'),event:d.event,button:d.button,cancel:d.cancel})},ref,'collapsible-08',['menu']);
 const shown=state.selected.includes('menu'),uid=useId(),trigger=useRef(null),menu=useRef(null),intent=useRef(null),removedFocus=useRef(null),lastShown=useRef(false),latest=useRef(null),typeahead=useRef({text:'',time:0});
 useLayoutEffect(()=>{latest.current={disabled,onAction,menuProps,shown};});
 const recordRemoved=useCallback(node=>{removedFocus.current=node;},[]);
 const triggerRef=useCallback(node=>{trigger.current=node;const consumer=triggerProps.ref,cleanup=typeof consumer==='function'?consumer(node):undefined;if(consumer&&typeof consumer!=='function')consumer.current=node;return()=>{if(trigger.current===node)trigger.current=null;if(typeof cleanup==='function')cleanup();else if(typeof consumer==='function')consumer(null);else if(consumer)consumer.current=null;};},[triggerProps.ref]);
 const enabled=()=>[...(menu.current?.querySelectorAll('[role="menuitem"]')||[])].filter(available);
 function request(next,reason,event,target,handler,guard){
  const marker={target,source:trigger.current?.ownerDocument.activeElement};intent.current=marker;
  state.request(typeof next==='function'?previous=>next(previous.includes('menu'))?['menu']:[]:next?['menu']:[],event,trigger.current,handler,{reason},accepted=>{if(!accepted&&intent.current===marker)intent.current=null;},{allowDisabled:next===false,guard});
 }
 useLayoutEffect(()=>{const previous=lastShown.current;lastShown.current=shown;if(previous===shown)return;const node=trigger.current,doc=node?.ownerDocument,mark=intent.current;intent.current=null;
  queueMicrotask(()=>{if(!node?.isConnected||!state.mounted.current||state.live.current.selected.includes('menu')!==shown)return;
   if(shown){if(doc.activeElement!==node&&doc.activeElement!==doc.body&&doc.activeElement!==mark?.source)return;const list=enabled();(mark?.target==='last'?list.at(-1):list[0]||menu.current)?.focus();}
   else{typeahead.current={text:'',time:0};const removed=removedFocus.current;removedFocus.current=null;if(mark?.target===null)return;if((removed||mark?.target)&&(doc.activeElement===removed||doc.activeElement===doc.body||doc.activeElement===node)){const target=mark?.target instanceof doc.defaultView.HTMLElement?mark.target:node;if(available(target))target.focus();}}
  });
 },[shown]);
 useLayoutEffect(()=>{if(!shown)return;const doc=trigger.current.ownerDocument;const pointer=e=>{if(!state.root.current?.contains(e.target))request(false,'outside-pointer',e,null);};const focus=e=>{if(!state.root.current?.contains(e.target))request(false,'outside-focus',e,null);};doc.addEventListener('pointerdown',pointer);doc.addEventListener('focusin',focus);return()=>{doc.removeEventListener('pointerdown',pointer);doc.removeEventListener('focusin',focus);};},[shown]);
 function triggerKey(e){const stamp=state.epoch.current,guard=observeCancellation(e);let transfer=false;try{triggerProps.onKeyDown?.(e);if(stamp!==state.epoch.current||guard.canceled()||e.isComposing||e.nativeEvent.isComposing||e.keyCode===229||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey)return;if(e.key==='ArrowDown'||e.key==='ArrowUp'){guard.preventOwnDefault();transfer=true;request(true,'keyboard',e,e.key==='ArrowUp'?'last':'first',undefined,guard);}else if(e.key==='Escape'&&shown){guard.preventOwnDefault();transfer=true;request(false,'escape',e,'return',undefined,guard);}}finally{if(!transfer)guard.restore();}}
 function menuKey(e,context){const stamp=context?.stamp?.outer??state.epoch.current,innerStamp=context?.stamp?.inner??context?.inner.current,innerUnchanged=()=>!context||innerStamp===context.inner.current,source=e.target,guard=observeCancellation(e);let transfer=false;
  try{latest.current.menuProps.onKeyDown?.(e);if(!innerUnchanged()||stamp!==state.epoch.current||guard.canceled()||e.isComposing||e.nativeEvent.isComposing||e.keyCode===229||e.altKey||e.ctrlKey||e.metaKey||(e.shiftKey&&e.key!=='Tab'))return;
   if(e.key==='Escape'){guard.preventOwnDefault();transfer=true;request(false,'escape',e,'return',undefined,guard);return;}
   if(e.key==='Tab'){const doc=source.ownerDocument,all=tabOrder(doc,menu.current),at=all.indexOf(trigger.current),target=all[at+(e.shiftKey?-1:1)]||trigger.current;guard.preventOwnDefault();transfer=true;request(false,'tab',e,target,undefined,guard);return;}
   const navigation=['ArrowDown','ArrowUp','Home','End','ArrowRight','ArrowLeft'].includes(e.key),letter=e.key.length===1&&/^[a-z]$/i.test(e.key);if(!navigation&&!letter)return;
   guard.preventOwnDefault();transfer=true;
   queueMicrotask(()=>{try{if(!state.mounted.current||!innerUnchanged()||stamp!==state.epoch.current||guard.canceled()||!menu.current?.contains(source)||source.ownerDocument.activeElement!==source)return;const nodes=enabled(),at=nodes.indexOf(source);if(at<0)return;let next;
    if(e.key==='ArrowDown')next=nodes[(at+1)%nodes.length];else if(e.key==='ArrowUp')next=nodes[(at-1+nodes.length)%nodes.length];else if(e.key==='Home')next=nodes[0];else if(e.key==='End')next=nodes.at(-1);
    else if(e.key==='ArrowRight'||e.key==='ArrowLeft'){const header=source.closest('[data-menu-section]')?.querySelector('[data-menu-section-trigger]');if(header){if(e.key==='ArrowRight'&&source===header&&header.getAttribute('aria-expanded')==='false')header.click();if(e.key==='ArrowLeft'&&header.getAttribute('aria-expanded')==='true'){header.click(); /* FocusBoundary returns focus only after an accepted close; consumer focus and cancellation win. */}}}
    else{const now=Date.now(),prior=typeahead.current,text=now-prior.time<700?prior.text+e.key.toLowerCase():e.key.toLowerCase();typeahead.current={text,time:now};const ordered=[...nodes.slice(at+1),...nodes.slice(0,at+1)];next=ordered.find(n=>n.textContent.trim().toLowerCase().startsWith(text))||ordered.find(n=>n.textContent.trim().toLowerCase().startsWith(e.key.toLowerCase()));}next?.focus();
   }finally{guard.restore();}});
  }finally{if(!transfer)guard.restore();}
 }
 function action(id,e,handler){const stamp=state.epoch.current,node=e.currentTarget,guard=observeCancellation(e);try{handler?.(e);}catch(error){guard.restore();throw error;}
  queueMicrotask(()=>{let transfer=false;try{if(!ACTION_IDS.includes(id)||!state.mounted.current||stamp!==state.epoch.current||guard.canceled()||latest.current.disabled||!node.isConnected||node.matches(':disabled'))return;let veto=false;const details={id:'collapsible-08',action:id,event:e,button:node,cancel(){veto=true;}},result=latest.current.onAction?.(id,details);if(veto||result===false||guard.canceled()||!state.mounted.current||stamp!==state.epoch.current||!node.isConnected||latest.current.disabled)return;if(id==='profile'||id==='logout'){transfer=true;request(false,'action',e,'return',undefined,guard);}}finally{if(!transfer)guard.restore();}});
 }
 const{onClick,onKeyDown:_key,ref:_ref,className='',children:_c,dangerouslySetInnerHTML:_h,...attrs}=triggerProps;
 return <div {...state.native} ref={state.rootRef} className={`fr7 fr29 fr29-workspace ${state.className}`} data-component-id="collapsible-08" data-disabled={disabled?'':undefined}><button {...attrs} ref={triggerRef} type="button" id={`${uid}-trigger`} aria-haspopup="menu" aria-expanded={shown} aria-controls={`${uid}-menu`} disabled={disabled||triggerProps.disabled} className={`fr29-workspace-trigger ${className}`} onClick={e=>request(v=>!v,'trigger',e,shown?'return':'first',onClick)} onKeyDown={triggerKey}><Icon kind="folder"/>Workspace menu</button>{shown&&<MenuContents state={state} id={`${uid}-menu`} menuRef={menu} menuProps={{...menuProps,'aria-labelledby':`${uid}-trigger`}} sections={sections} disabled={disabled} itemProps={itemProps} onAction={action} onKeyDown={menuKey} onRemovedFocus={recordRemoved}/>}</div>;
});
