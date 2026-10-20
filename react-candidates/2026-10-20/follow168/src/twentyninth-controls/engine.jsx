import React,{useCallback,useLayoutEffect,useRef,useState}from'react';
const prevented=e=>!!(e?.defaultPrevented||e?.nativeEvent?.defaultPrevented);
const defaultPrevented=prevented;
export function observeCancellation(event) {
  let veto = Boolean(defaultPrevented(event));
  let ownDefault = false;
  let suppress = false;
  const restorers = [];
  for (const target of [event, event.nativeEvent]) {
    if (!target || typeof target.preventDefault !== 'function') continue;
    const descriptor = Object.getOwnPropertyDescriptor(target, 'preventDefault');
    const original = target.preventDefault;
    const wrapped = function (...args) {
      if (!suppress) veto = true;
      return original.apply(this, args);
    };
    try {
      Object.defineProperty(target, 'preventDefault', {
        configurable: true, writable: true, value: wrapped,
      });
      restorers.push(() => {
        if (target.preventDefault !== wrapped) return;
        if (descriptor) Object.defineProperty(target, 'preventDefault', descriptor);
        else delete target.preventDefault;
      });
    } catch {
      // Ordinary React/native events are writable. Frozen user events still
      // retain their native defaultPrevented semantics for non-owned actions.
    }
  }
  return {
    canceled: () => veto || (!ownDefault && Boolean(defaultPrevented(event))),
    preventOwnDefault() {
      suppress = true;
      try { event.preventDefault(); } finally { suppress = false; }
      ownDefault = true;
    },
    restore() { restorers.reverse().forEach(restore => restore()); },
  };
}


/** Private set-owner shared by fixed canonical disclosures, not a public generic control. */
export function useDisclosureSet(input,ref,id,ids,initial=[]) {
 const {expanded,defaultExpanded=initial,onExpandedChange,disabled=false,triggerProps={},className='',children:_c,dangerouslySetInnerHTML:_h,...native}=input;
 const normalize=v=>{if(!Array.isArray(v)||Array.from(v).some(x=>!ids.includes(x)))throw new RangeError(id+': invalid expanded IDs');return ids.filter(x=>v.includes(x));};
 if(expanded!==undefined&&input.defaultExpanded!==undefined)throw new TypeError(id+': expanded/defaultExpanded are exclusive');
 const controlled=expanded!==undefined,[stored,setStored]=useState(()=>normalize(defaultExpanded)),root=useRef(null),mounted=useRef(false),epoch=useRef(0),live=useRef(null),logical=useRef(null),last=useRef({controlled,selected:controlled?normalize(expanded):stored});
 const selected=normalize(controlled?expanded:last.current.controlled?last.current.selected:stored);
 const rootRef=useCallback(node=>{root.current=node;const cleanup=typeof ref==='function'?ref(node):undefined;if(ref&&typeof ref!=='function')ref.current=node;return()=>{if(root.current===node)root.current=null;if(typeof cleanup==='function')cleanup();else if(typeof ref==='function')ref(null);else if(ref)ref.current=null;};},[ref]);
 useLayoutEffect(()=>{mounted.current=true;return()=>{mounted.current=false;epoch.current++;};},[]);
 useLayoutEffect(()=>{const changed=last.current.controlled!==controlled||(controlled&&last.current.selected.join('|')!==selected.join('|'));if(changed){epoch.current++;logical.current=selected;if(!controlled)setStored(selected);}else if(logical.current===null)logical.current=selected;last.current={controlled,selected};live.current={controlled,selected,disabled,onExpandedChange};});
 const canAct=(node,stamp,allowDisabled=false)=>mounted.current&&stamp===epoch.current&&root.current&&node?.isConnected&&root.current.contains(node)&&(allowDisabled||(!live.current.disabled&&!node.matches(':disabled')));
 function request(nextValue,event,node,handler,extra={},settled,{allowDisabled=false,guard:existingGuard}={}){
  const stamp=epoch.current;if(!canAct(node,stamp,allowDisabled)){existingGuard?.restore();settled?.(false);return;}
  const guard=existingGuard||observeCancellation(event);
  try{handler?.(event);if(!canAct(node,stamp,allowDisabled)||guard.canceled()){guard.restore();settled?.(false);return;}}catch(e){guard.restore();settled?.(false);throw e;}
  queueMicrotask(()=>{let accepted=false;try{
   if(!canAct(node,stamp,allowDisabled)||guard.canceled())return;
   const current=live.current,previous=current.controlled?current.selected:logical.current,next=normalize(typeof nextValue==='function'?nextValue(previous):nextValue);let veto=false;
   const details={id,...extra,previousExpanded:[...previous],event,button:node,cancel(){veto=true;}};
   if(extra.sectionId)details.open=next.includes(extra.sectionId);
   const result=current.onExpandedChange?.([...next],details);
   if(veto||result===false||guard.canceled()||!canAct(node,stamp,allowDisabled))return;
   accepted=true;if(!current.controlled&&!live.current.controlled){logical.current=next;setStored(next);}
  }finally{guard.restore();settled?.(accepted);}});
 }
 const click=(event,sectionId,handler)=>request(previous=>previous.includes(sectionId)?previous.filter(x=>x!==sectionId):[...previous,sectionId],event,event.currentTarget,handler,{sectionId});
 return{selected,root,rootRef,native,disabled,triggerProps,className,click,request,epoch,mounted,live};
}
/** Preserve explicit external focus when conditional content disappears. */
export function FocusBoundary({children,triggerId,...props}){
 const ref=useRef(null);
 useLayoutEffect(()=>{const node=ref.current;return()=>{const doc=node?.ownerDocument,active=doc?.activeElement;if(!node?.contains(active))return;const trigger=doc.getElementById(triggerId);queueMicrotask(()=>{if(trigger?.isConnected&&trigger.getAttribute('aria-expanded')==='false'&&(doc.activeElement===active||doc.activeElement===doc.body))trigger.focus();});};},[triggerId]);
 return <div {...props} ref={ref}>{children}</div>;
}
export function Icon({kind,...props}){return <svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
 {kind==='down'&&<path d="m6 9 6 6 6-6"/>}{kind==='right'&&<path d="m9 6 6 6-6 6"/>}{kind==='star'&&<path d="m12 3 2.8 5.7 6.3.9-4.5 4.4 1.1 6.3-5.7-3-5.7 3 1.1-6.3L2.9 9.6l6.3-.9Z"/>}
 {kind==='card'&&<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M6 15h4"/></>}
 {kind==='folder'&&<><path d="M3 7V4h6l3 3h9v13H3Z"/><path d="M8 11v5m4-5v3m4-3v6"/></>}
 {kind==='user'&&<><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>}
 {kind==='users'&&<><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0m1-15a3 3 0 0 1 0 6m2 3a6 6 0 0 1 3 6"/></>}
 {kind==='settings'&&<><path d="m9 3-1 3-3 1-2 4 2 3v4l4 3 3-1 4 1 3-3v-4l2-3-2-4-3-1-1-3Z"/><circle cx="12" cy="12" r="3"/></>}
 {kind==='logout'&&<><path d="M9 3H4v18h5m5-14 5 5-5 5m-5-5h10"/></>}{kind==='dot'&&<circle cx="12" cy="12" r="1.5" fill="currentColor"/>}
 </svg>}
