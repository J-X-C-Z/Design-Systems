import React, {forwardRef,useCallback,useId,useLayoutEffect,useRef,useState} from 'react';
const values=['inventory','pending','shipped'];
const labels=['Inventory','Pending','Shipped'];
const counts=[1,4,6];
const contents=[<>Keep track of your <strong>current stock levels</strong>. Manage SKU counts, reorder alerts, and warehouse locations to keep your fulfillment center running at peak efficiency.</>,<>Monitor incoming <strong>customer orders</strong>. Review payment statuses, verify addresses, and prepare your pick-lists for next-day dispatch.</>,<>Access your <strong>delivery history</strong>. Track parcels, manage returns, and analyze shipping performance across all your carrier partners.</>];
const canceled=e=>e.defaultPrevented||e.nativeEvent?.defaultPrevented;
function ownKey(e){let veto=false;const n=e.nativeEvent,old=n.preventDefault;e.preventDefault();const observe=function(...args){veto=true;return old.apply(this,args);};n.preventDefault=observe;queueMicrotask(()=>queueMicrotask(()=>{if(n.preventDefault===observe)n.preventDefault=old;}));return()=>veto;}
const clean=v=>{if(v!==null&&!values.includes(v))throw new RangeError('Tabs04: unknown tab value');return v;};
export const Tabs04=forwardRef(function Tabs04({value,defaultValue='inventory',onValueChange,disabled=false,activationMode='automatic',orientation='horizontal',dir='ltr',loop=true,triggerProps={},label='Stock overview',className='',children:_children,dangerouslySetInnerHTML:_html,...native},ref){
 const controlled=value!==undefined,[stored,setStored]=useState(()=>clean(defaultValue)),[focused,setFocused]=useState(null),uid=useId(),root=useRef(null),live=useRef(null),mounted=useRef(false),epoch=useRef(0),lastOwner=useRef({controlled,value}),logical=useRef(null);
 const selected=clean(controlled?value:lastOwner.current.controlled?lastOwner.current.value:stored);
 const rootRef=useCallback(node=>{root.current=node;if(typeof ref==='function')return ref(node);if(ref)ref.current=node;},[ref]);
 useLayoutEffect(()=>{mounted.current=true;return()=>{mounted.current=false;epoch.current++;};},[]);
 useLayoutEffect(()=>{if(lastOwner.current.controlled!==controlled||controlled&&lastOwner.current.value!==value){epoch.current++;logical.current=selected;if(!controlled)setStored(selected);}else if(logical.current===null)logical.current=selected;lastOwner.current={controlled,value};live.current={controlled,selected,disabled,onValueChange,triggerProps};});
 const enabled=values.filter(v=>!disabled&&!triggerProps[v]?.disabled),roving=enabled.includes(focused)?focused:enabled.includes(selected)?selected:enabled[0];
 function request(next,reason,event,node,wasCanceled=()=>canceled(event)){
  const start=live.current,stamp=epoch.current;
  queueMicrotask(()=>{const now=live.current;if(!mounted.current||stamp!==epoch.current||!node.isConnected||node.disabled||wasCanceled()||now.disabled)return;
   const previousValue=now.controlled?now.selected:logical.current;if(previousValue===next)return;let veto=false;
   const details={id:'tabs-04',previousValue,reason,event,button:node,cancel(){veto=true;}};
   const result=now.onValueChange?.(next,details);
   if(veto||result===false||wasCanceled()||!mounted.current||stamp!==epoch.current||live.current.disabled||node.disabled)return;
   if(!start.controlled&&!live.current.controlled){logical.current=next;setStored(next);}
  });
 }
 function key(event,key,node,user){user?.(event);if(canceled(event)||event.isComposing||event.nativeEvent?.isComposing||event.keyCode===229||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey)return;
  if(event.key===' '||event.key==='Enter'){const veto=ownKey(event);if(!event.repeat)request(key,'keyboard',event,node,veto);return;}
  const forward=orientation==='vertical'?'ArrowDown':dir==='rtl'?'ArrowLeft':'ArrowRight',back=orientation==='vertical'?'ArrowUp':dir==='rtl'?'ArrowRight':'ArrowLeft';let index=enabled.indexOf(key),next;
  if(event.key==='Home')next=enabled[0];else if(event.key==='End')next=enabled.at(-1);else if(event.key===forward)next=enabled[loop?(index+1)%enabled.length:Math.min(index+1,enabled.length-1)];else if(event.key===back)next=enabled[loop?(index-1+enabled.length)%enabled.length:Math.max(index-1,0)];else return;
  const veto=ownKey(event),stamp=epoch.current;queueMicrotask(()=>{if(mounted.current&&stamp===epoch.current&&!veto())root.current?.querySelector(`[data-tab-value="${next}"]`)?.focus();});
 }
 return <div {...native} ref={rootRef} className={`fr7 fr7-sixteenth fr7-stock-tabs ${className}`} data-component-id="tabs-04" dir={dir} data-orientation={orientation}>
  <div role="tablist" aria-label={label} aria-orientation={orientation} className="fr7-stock-track">{values.map((v,i)=>{const p=triggerProps[v]||{};const {onClick,onFocus,onKeyDown,children:_c,dangerouslySetInnerHTML:_h,...attrs}=p;return <button {...attrs} key={v} type="button" role="tab" id={`${uid}-${v}-tab`} aria-controls={`${uid}-${v}-panel`} aria-selected={selected===v} data-tab-value={v} disabled={disabled||p.disabled} tabIndex={roving===v?0:-1} className={`fr7-stock-tab ${p.className||''}`} onFocus={e=>{onFocus?.(e);setFocused(v);if(activationMode==='automatic'&&!canceled(e))request(v,'focus',e,e.currentTarget);}} onClick={e=>{onClick?.(e);if(!canceled(e))request(v,'click',e,e.currentTarget);}} onKeyDown={e=>key(e,v,e.currentTarget,onKeyDown)}>{labels[i]}<span className="fr7-stock-count">{counts[i]}</span></button>;})}</div>
  {values.map((v,i)=><div key={v} role="tabpanel" id={`${uid}-${v}-panel`} aria-labelledby={`${uid}-${v}-tab`} tabIndex={0} hidden={selected!==v} className="fr7-stock-panel">{selected===v&&<p>{contents[i]}</p>}</div>)}
 </div>;
});
export const Breadcrumb04=forwardRef(function Breadcrumb04({linkProps={},className='',children:_children,dangerouslySetInnerHTML:_html,'aria-label':label='breadcrumb',...native},ref){return <nav {...native} ref={ref} aria-label={label} data-component-id="breadcrumb-04" className={`fr7 fr7-sixteenth fr7-notes-breadcrumb ${className}`}><ol>{['Library','Resources','Design Notes'].map((label,i)=><li key={label}>{i<2?<><a {...linkProps[i===0?'library':'resources']} href={linkProps[i===0?'library':'resources']?.href??'#'}>{label}</a><span className="fr7-notes-dot" aria-hidden="true">·</span></>:<span role="link" aria-disabled="true" aria-current="page" className="fr7-notes-current">{label}</span>}</li>)}</ol></nav>;});
