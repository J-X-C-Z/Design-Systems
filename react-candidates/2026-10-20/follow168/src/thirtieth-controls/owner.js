import {useLayoutEffect,useRef,useState}from'react';
// One method wrapper per target supports overlapping leases restored out of order.
// A tooltip and tab may observe the same native event through different React events.
const cancellationTargets=new WeakMap();let ownDefaultDepth=0;
export function observeCancellation(event){const native=event.nativeEvent,targets=[...new Set([event,native].filter(Boolean))],alreadyOwned=targets.some(target=>cancellationTargets.get(target)?.owned),context={veto:!alreadyOwned&&Boolean(event.defaultPrevented||native?.defaultPrevented),owned:alreadyOwned},leases=[];let restored=false;
 for(const target of targets){if(typeof target.preventDefault!=='function')continue;let state=cancellationTargets.get(target);if(!state){const descriptor=Object.getOwnPropertyDescriptor(target,'preventDefault'),original=target.preventDefault;state={descriptor,original,layers:new Set(),owned:false};state.wrapper=function(...args){if(!ownDefaultDepth)for(const layer of state.layers)layer.veto=true;return state.original.apply(this,args);};try{Object.defineProperty(target,'preventDefault',{configurable:true,writable:true,value:state.wrapper});cancellationTargets.set(target,state);}catch{continue;}}state.layers.add(context);leases.push([target,state]);}
 return{canceled:()=>context.veto||(!context.owned&&Boolean(event.defaultPrevented||native?.defaultPrevented)),preventOwnDefault(){context.owned=true;for(const[,state]of leases){state.owned=true;for(const layer of state.layers)layer.owned=true;}ownDefaultDepth++;try{event.preventDefault();}finally{ownDefaultDepth--;}} ,restore(){if(restored)return;restored=true;for(const[target,state]of leases){state.layers.delete(context);if(state.layers.size)continue;if(target.preventDefault===state.wrapper){if(state.descriptor)Object.defineProperty(target,'preventDefault',state.descriptor);else delete target.preventDefault;}if(cancellationTargets.get(target)===state)cancellationTargets.delete(target);}}};}

export function available(node){
 if(!node?.isConnected||node.matches(':disabled,[type="hidden"]')||node.closest('[hidden],[inert]'))return false;
 const view=node.ownerDocument.defaultView,visibility=view.getComputedStyle(node).visibility;
 if(visibility==='hidden'||visibility==='collapse')return false;
 for(let ancestor=node;ancestor;ancestor=ancestor.parentElement){const style=view.getComputedStyle(ancestor);if(style.display==='none'||ancestor.matches('dialog:not([open])')||(ancestor!==node&&style.contentVisibility==='hidden'))return false;if(ancestor!==node&&ancestor.matches('details:not([open])')){const summary=[...ancestor.children].find(child=>child.tagName==='SUMMARY');if(!summary?.contains(node))return false;}}
 return true;
}
/** Catch callback prevention even when an owned key was already prevented earlier.
 * This watcher lives only across the synchronous proposal callback and restores exact descriptors. */
function watchCallbackPrevention(event){let veto=false;const restorers=[];for(const target of [event,event.nativeEvent]){if(!target||typeof target.preventDefault!=='function')continue;const descriptor=Object.getOwnPropertyDescriptor(target,'preventDefault'),original=target.preventDefault,wrapped=function(...args){veto=true;return original.apply(this,args);};try{Object.defineProperty(target,'preventDefault',{configurable:true,writable:true,value:wrapped});restorers.push(()=>{if(target.preventDefault!==wrapped)return;if(descriptor)Object.defineProperty(target,'preventDefault',descriptor);else delete target.preventDefault;});}catch{}}return{canceled:()=>veto,restore:()=>restorers.reverse().forEach(fn=>fn())};}
/** Private scalar proposal owner. No public generic control and no hidden form field. */
export function useValueOwner({value,defaultValue,initial,values,id,disabled,onValueChange,root,configuration=''}){
 const clean=next=>{if(next!==null&&!values.includes(next))throw new RangeError(id+': unknown value');return next;};
 if(value!==undefined&&defaultValue!==undefined)throw new TypeError(id+': value/defaultValue are exclusive');
 if(value!==undefined)clean(value);if(defaultValue!==undefined)clean(defaultValue);
 const controlled=value!==undefined,[stored,setStored]=useState(()=>clean(defaultValue===undefined?initial:defaultValue)),last=useRef({controlled,value:controlled?value:stored,configuration,disabled}),selected=clean(controlled?value:last.current.controlled?last.current.value:stored),logical=useRef(selected),live=useRef(null),epoch=useRef(0),mounted=useRef(false);
 useLayoutEffect(()=>{mounted.current=true;return()=>{mounted.current=false;epoch.current++;};},[]);
 useLayoutEffect(()=>{const previous=last.current,changed=previous.controlled!==controlled||(controlled&&previous.value!==selected)||previous.configuration!==configuration||previous.disabled!==disabled;if(changed){epoch.current++;logical.current=selected;if(previous.controlled&&!controlled)setStored(selected);}last.current={controlled,value:selected,configuration,disabled};live.current={controlled,selected,disabled,onValueChange};});
 const canAct=(node,stamp,allowDisabled=false)=>mounted.current&&stamp===epoch.current&&root.current?.contains(node)&&node?.isConnected&&(allowDisabled||(!live.current.disabled&&available(node)));
 function request(next,event,node,reason,handler,{guard:given,stamp=epoch.current,when,allowDisabled=false,settled}={}){
  const guard=given||observeCancellation(event);let queued=false;
  try{handler?.(event);if(!canAct(node,stamp,allowDisabled)||guard.canceled()||when&&!when())return;
   queued=true;queueMicrotask(()=>{let accepted=false;try{if(!canAct(node,stamp,allowDisabled)||guard.canceled()||when&&!when())return;const current=live.current,previousValue=current.controlled?current.selected:logical.current,nextValue=clean(typeof next==='function'?next(previousValue):next);if(previousValue===nextValue)return;let veto=false;const detail={id,reason,previousValue,event,button:node,cancel(){veto=true;}};const callbackGuard=watchCallbackPrevention(event);let result,callbackCanceled;try{result=current.onValueChange?.(nextValue,detail);callbackCanceled=callbackGuard.canceled();}finally{callbackGuard.restore();}if(veto||result===false||callbackCanceled||guard.canceled()||!canAct(node,stamp,allowDisabled))return;accepted=true;if(!current.controlled&&!live.current.controlled){logical.current=nextValue;setStored(nextValue);}}finally{guard.restore();settled?.(accepted);}});
  }finally{if(!queued){guard.restore();settled?.(false);}}
 }
 return{selected,logical,live,epoch,mounted,request,canAct};
}
