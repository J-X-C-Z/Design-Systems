import React, {forwardRef,useCallback,useId,useLayoutEffect,useRef,useState} from 'react';
const values=['profile','preferences','security'];
const labels=['Profile','Preferences','Security'];

const contents=[<>Personalize your <strong>digital identity</strong>. Update your avatar, bio, and social links to show the world who you are and what you're building.</>,<>Fine-tune your <strong>user experience</strong>. Adjust your theme, language, and notification settings to perfectly match your daily workflow.</>,<>Fortify your <strong>account barriers</strong>. Manage your passwords, two-factor authentication, and connected devices for maximum data privacy.</>];
function SettingIcon({index}){return <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{index===0?<><circle cx="12" cy="12" r="9"/><circle cx="12" cy="9" r="3"/><path d="M5 18c1-5 13-5 14 0"/></>:index===1?<><path d="M3 6h18M3 12h18M3 18h18"/><circle cx="8" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="9" cy="18" r="2"/></>:<><path d="m12 2 8 4v6c0 5-8 9-8 9s-8-4-8-9V6Z"/><rect x="9" y="10" width="6" height="6" rx="1"/><path d="M10 10V8a2 2 0 0 1 4 0v2"/></>}</svg>;}

const canceled=e=>e.defaultPrevented||e.nativeEvent?.defaultPrevented;
function ownKey(e){let veto=false;const n=e.nativeEvent,old=n.preventDefault;e.preventDefault();const observe=function(...args){veto=true;return old.apply(this,args);};n.preventDefault=observe;queueMicrotask(()=>queueMicrotask(()=>{if(n.preventDefault===observe)n.preventDefault=old;}));return()=>veto;}
const clean=v=>{if(v!==null&&!values.includes(v))throw new RangeError('Tabs05: unknown tab value');return v;};
export const Tabs05=forwardRef(function Tabs05({value,defaultValue='profile',onValueChange,disabled=false,activationMode='automatic',orientation='horizontal',dir='ltr',loop=true,triggerProps={},label='Settings',className='',children:_children,dangerouslySetInnerHTML:_html,...native},ref){
 const controlled=value!==undefined,[stored,setStored]=useState(()=>clean(defaultValue)),[focused,setFocused]=useState(null),uid=useId(),root=useRef(null),live=useRef(null),mounted=useRef(false),epoch=useRef(0),lastOwner=useRef({controlled,value}),logical=useRef(null);
 const selected=clean(controlled?value:lastOwner.current.controlled?lastOwner.current.value:stored);
 const rootRef=useCallback(node=>{root.current=node;if(typeof ref==='function')return ref(node);if(ref)ref.current=node;},[ref]);
 useLayoutEffect(()=>{mounted.current=true;return()=>{mounted.current=false;epoch.current++;};},[]);
 useLayoutEffect(()=>{if(lastOwner.current.controlled!==controlled||controlled&&lastOwner.current.value!==value){epoch.current++;logical.current=selected;if(!controlled)setStored(selected);}else if(logical.current===null)logical.current=selected;lastOwner.current={controlled,value};live.current={controlled,selected,disabled,onValueChange,triggerProps};});
 const enabled=values.filter(v=>!disabled&&!triggerProps[v]?.disabled),roving=enabled.includes(focused)?focused:enabled.includes(selected)?selected:enabled[0];
 function request(next,reason,event,node,wasCanceled=()=>canceled(event)){
  const start=live.current,stamp=epoch.current;
  queueMicrotask(()=>{const now=live.current;if(!mounted.current||stamp!==epoch.current||!node.isConnected||node.matches(':disabled')||wasCanceled()||now.disabled)return;
   const previousValue=now.controlled?now.selected:logical.current;if(previousValue===next)return;let veto=false;
   const details={id:'tabs-05',previousValue,reason,event,button:node,cancel(){veto=true;}};
   const result=now.onValueChange?.(next,details);
   if(veto||result===false||wasCanceled()||!mounted.current||stamp!==epoch.current||live.current.disabled||node.matches(':disabled'))return;
   if(!start.controlled&&!live.current.controlled){logical.current=next;setStored(next);}
  });
 }
 function key(event,key,node,user){user?.(event);if(canceled(event)||event.isComposing||event.nativeEvent?.isComposing||event.keyCode===229||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey)return;
  if(event.key===' '||event.key==='Enter'){const veto=ownKey(event);if(!event.repeat)request(key,'keyboard',event,node,veto);return;}
  const forward=orientation==='vertical'?'ArrowDown':dir==='rtl'?'ArrowLeft':'ArrowRight',back=orientation==='vertical'?'ArrowUp':dir==='rtl'?'ArrowRight':'ArrowLeft';let index=enabled.indexOf(key),next;
  if(event.key==='Home')next=enabled[0];else if(event.key==='End')next=enabled.at(-1);else if(event.key===forward)next=enabled[loop?(index+1)%enabled.length:Math.min(index+1,enabled.length-1)];else if(event.key===back)next=enabled[loop?(index-1+enabled.length)%enabled.length:Math.max(index-1,0)];else return;
  const veto=ownKey(event),stamp=epoch.current;queueMicrotask(()=>{if(mounted.current&&stamp===epoch.current&&!veto())root.current?.querySelector(`[data-tab-value="${next}"]`)?.focus();});
 }
 return <div {...native} ref={rootRef} className={`fr7 fr7-nineteenth fr7-settings-tabs ${className}`} data-component-id="tabs-05" dir={dir} data-orientation={orientation}>
  <div role="tablist" aria-label={label} aria-orientation={orientation} className="fr7-settings-track">{values.map((v,i)=>{const p=triggerProps[v]||{};const {onClick,onFocus,onKeyDown,children:_c,dangerouslySetInnerHTML:_h,...attrs}=p;return <button {...attrs} key={v} type="button" role="tab" aria-label={p['aria-label']??labels[i]} id={`${uid}-${v}-tab`} aria-controls={`${uid}-${v}-panel`} aria-selected={selected===v} data-tab-value={v} disabled={disabled||p.disabled} tabIndex={roving===v?0:-1} className={`fr7-settings-tab ${p.className||''}`} onFocus={e=>{onFocus?.(e);setFocused(v);if(activationMode==='automatic'&&!canceled(e))request(v,'focus',e,e.currentTarget);}} onClick={e=>{onClick?.(e);if(!canceled(e))request(v,'click',e,e.currentTarget);}} onKeyDown={e=>key(e,v,e.currentTarget,onKeyDown)}><SettingIcon index={i}/><span className="fr7-settings-label">{labels[i]}</span></button>;})}</div>
  {values.map((v,i)=><div key={v} role="tabpanel" id={`${uid}-${v}-panel`} aria-labelledby={`${uid}-${v}-tab`} tabIndex={0} hidden={selected!==v} className="fr7-settings-panel">{selected===v&&<><h3>{labels[i]}</h3><p>{contents[i]}</p></>}</div>)}
 </div>;
});

function useEmailAlert({open,defaultOpen,disabled,onOpenChange}){
 if(open!==undefined&&defaultOpen!==undefined)throw new TypeError('Alerts10: open/defaultOpen are exclusive');
 const controlled=open!==undefined,[stored,setStored]=useState(defaultOpen??true),mounted=useRef(false),serial=useRef(0),owner=useRef(null);
 const visible=controlled?open:owner.current?.controlled?owner.current.visible:stored;
 useLayoutEffect(()=>{const previous=owner.current;if(previous&&(previous.controlled!==controlled||previous.visible!==visible||previous.disabled!==disabled))serial.current++;if(previous?.controlled&&!controlled)setStored(visible);owner.current={controlled,visible,disabled,onOpenChange};});
 useLayoutEffect(()=>{mounted.current=true;return()=>{mounted.current=false;serial.current++;};},[]);
 function close(event){const button=event.currentTarget,ticket=++serial.current;queueMicrotask(()=>{const current=owner.current;if(!mounted.current||ticket!==serial.current||!current.visible||current.disabled||!button.isConnected||button.matches(':disabled')||canceled(event))return;let veto=false;const details={id:'alerts-10',reason:'close',event,button,localOnly:true,cancel(){veto=true;}};const result=current.onOpenChange?.(false,details);if(result===false||veto||canceled(event)||!mounted.current||ticket!==serial.current||!button.isConnected||button.matches(':disabled'))return;const latest=owner.current;if(!current.controlled&&!latest.controlled&&latest.visible&&!latest.disabled)setStored(false);});}
 return{visible,close};
}
export const Alerts10=forwardRef(function Alerts10({open,defaultOpen,onOpenChange,disabled=false,closeButtonProps={},className='',children:_children,dangerouslySetInnerHTML:_html,...native},ref){const state=useEmailAlert({open,defaultOpen,disabled,onOpenChange}),uid=useId(),titleId=`${uid}-title`,descriptionId=`${uid}-description`;if(!state.visible)return null;const {children:_c,dangerouslySetInnerHTML:_h,onClick,className:buttonClass,disabled:buttonDisabled,...button}=closeButtonProps;return <div {...native} ref={ref} role="alert" aria-labelledby={native['aria-labelledby']??titleId} aria-describedby={native['aria-describedby']??descriptionId} data-component-id="alerts-10" data-slot="alert" className={`fr7 fr7-nineteenth fr7-email-alert ${className}`}><svg className="fr7-email-symbol" aria-hidden="true" focusable="false" viewBox="0 0 20 20" width="16" height="16"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M10 5v6m0 3v.2" stroke="currentColor" strokeWidth="2"/></svg><div className="fr7-email-copy"><div data-slot="alert-title" id={titleId} className="fr7-email-title">Confirm your email to get started</div><div data-slot="alert-description" id={descriptionId} className="fr7-email-description">A verification link has been sent to your email. Open it to activate your account.</div></div><button {...button} disabled={disabled||buttonDisabled} className={`fr7-email-close ${buttonClass||''}`} onClick={e=>{onClick?.(e);state.close(e);}}><svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 20 20"><path d="m5 5 10 10M15 5 5 15" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg><span className="fr7-settings-sr">Close</span></button></div>;});
