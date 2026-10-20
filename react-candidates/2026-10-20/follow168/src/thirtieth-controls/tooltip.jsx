import {useLayoutEffect,useRef,useState}from'react';
import {useValueOwner,observeCancellation,available}from'./owner.js';
// One event belongs to one local tooltip owner, chosen before user handlers run.
// Weak document/event maps do not retain detached roots or completed events.
const tooltipDocuments=new WeakMap(),escapeOwners=new WeakMap();let interactionOrder=0;
function chooseEscapeOwner(doc,event){
 const members=[...(tooltipDocuments.get(doc)||[])].filter(member=>member.root.current?.isConnected);
 const containing=node=>node?.nodeType?members.filter(member=>member.root.current.contains(node)):[];
 const innermost=list=>list.find(member=>!list.some(other=>other!==member&&member.root.current.contains(other.root.current)));
 const target=innermost(containing(event.target));if(target)return target;
 const active=innermost(containing(doc.activeElement));if(active)return active;
 const ready=members.filter(member=>member.ready()),engaged=ready.filter(member=>member.engaged());
 if(engaged.length)return engaged.reduce((latest,member)=>member.order>latest.order?member:latest);
 return ready.length===1?ready[0]:null;
}
/** Independent local tooltip owner; no portal or geometry equivalence is asserted. */
export function useTooltipController({enabled,id,values,props,root,disabled,uid,triggerProps}){
 const{value,defaultValue,onValueChange,delayDuration=0,disabled:tooltipDisabled=false}=props;
 if(!Number.isFinite(delayDuration)||delayDuration<0)throw new RangeError(id+': tooltip delay must be finite and nonnegative');
 const off=!enabled||disabled||tooltipDisabled;
 const owner=useValueOwner({value,defaultValue,initial:null,values,id,disabled:off,onValueChange,root,configuration:String(delayDuration)});
 const hover=useRef(null),focus=useRef(null),blocked=useRef(new Set()),timer=useRef(null),ticket=useRef(0),live=useRef(null),eventStamps=useRef(new WeakMap()),pointerPress=useRef(null),pendingNode=useRef(null),pendingWork=useRef(null),[eligible,setEligible]=useState(true);
 live.current={off,delayDuration};
 const memberRef=useRef(null);if(!memberRef.current)memberRef.current={root,order:0};const member=memberRef.current;
 const pendingValid=()=>{const work=pendingWork.current;return work&&work.ticket===ticket.current&&work.stamp===owner.epoch.current&&!work.guard.canceled();};
 const pendingSource=()=>{const node=pendingNode.current,work=pendingWork.current;return node&&pendingValid()&&(work.reason==='pointer'||work.reason==='focus')&&work.opening?.()!==null&&available(node)?node:null;};
 member.ready=()=>{const state=owner.live.current,current=state?.controlled?state.selected:owner.logical.current,node=current===null?null:root.current?.querySelector(`[data-tab-value="${current}"]`);return !live.current.off&&owner.mounted.current&&Boolean(node&&available(node)||pendingSource());};
 member.engaged=()=>Boolean(pendingSource()||hover.current&&available(hover.current.node)&&!blocked.current.has(hover.current.value)||focus.current&&available(focus.current.node)&&focus.current.node.ownerDocument.activeElement===focus.current.node&&!blocked.current.has(focus.current.value));
 const stampOf=event=>eventStamps.current.get(event?.nativeEvent??event)??owner.epoch.current;
 useLayoutEffect(()=>{if(!enabled)return;const doc=root.current?.ownerDocument;if(!doc)return;let members=tooltipDocuments.get(doc);if(!members){members=new Set();tooltipDocuments.set(doc,members);}members.add(member);const capture=event=>{if(event.type==='keydown'&&event.key==='Escape'&&!escapeOwners.has(event))escapeOwners.set(event,chooseEscapeOwner(doc,event));if(root.current?.contains(event.target)||event.type==='keydown'&&event.key==='Escape')eventStamps.current.set(event,owner.epoch.current);};const types=['pointerover','pointerout','pointerdown','focusin','focusout','keydown','click'];for(const type of types)doc.addEventListener(type,capture,true);return()=>{members.delete(member);if(!members.size)tooltipDocuments.delete(doc);for(const type of types)doc.removeEventListener(type,capture,true);};},[enabled]);
 const clear=()=>{ticket.current++;pendingNode.current=null;pendingWork.current=null;if(timer.current!==null){clearTimeout(timer.current);timer.current=null;}};
 function reconcile(records=[]){const pending=pendingNode.current;const changedWhilePending=pending&&records.some(record=>{const target=record.target;if(!target.contains(pending))return false;if(record.attributeName==='style'||record.attributeName==='class')return false;if(record.attributeName==='open'){if(!['DETAILS','DIALOG'].includes(target.tagName))return false;if(target.tagName==='DETAILS'){const summary=[...target.children].find(child=>child.tagName==='SUMMARY');if(summary?.contains(pending))return false;}return record.oldValue!==null;}if(record.attributeName==='disabled'){if(target.tagName==='FIELDSET'){const legend=[...target.children].find(child=>child.tagName==='LEGEND');if(legend?.contains(pending))return false;}else if(target!==pending)return false;}return record.oldValue!==null||target.hasAttribute(record.attributeName);});if(pending&&(!available(pending)||changedWhilePending))clear();if(hover.current&&!available(hover.current.node))hover.current=null;if(focus.current&&!available(focus.current.node))focus.current=null;const current=owner.live.current,selected=current?.controlled?current.selected:owner.logical.current,node=selected===null?null:root.current?.querySelector(`[data-tab-value="${selected}"]`),next=!node||available(node);setEligible(previous=>previous===next?previous:next);}
 useLayoutEffect(()=>{if(pendingWork.current&&!pendingValid())clear();reconcile();});
 useLayoutEffect(()=>{if(!enabled||!root.current)return;const node=root.current,Observer=node.ownerDocument.defaultView.MutationObserver,observer=new Observer(reconcile),options={attributes:true,attributeOldValue:true,attributeFilter:['disabled','hidden','inert','style','class','open']};observer.observe(node,{...options,subtree:true});for(let ancestor=node.parentElement;ancestor;ancestor=ancestor.parentElement)observer.observe(ancestor,options);return()=>observer.disconnect();},[enabled]);
 useLayoutEffect(()=>{clear();if(off){hover.current=null;focus.current=null;blocked.current.clear();pointerPress.current=null;}return clear;},[off,delayDuration]);
 const button=v=>root.current?.querySelector(`[data-tab-value="${v}"]`);
 const focused=()=>{const item=focus.current;return item&&available(item.node)&&item.node.ownerDocument.activeElement===item.node&&!blocked.current.has(item.value)?item:null;};
 const hovered=()=>{const item=hover.current;return item&&available(item.node)&&!blocked.current.has(item.value)?item:null;};
 function act(event,node,reason,handler,update,{stamp=stampOf(event),delay=false,ownDefault=false,givenGuard,opening=()=>null}={}){
  const guard=givenGuard?{canceled:givenGuard.canceled,restore(){}}:observeCancellation(event);clear();const requestTicket=ticket.current;let queued=false;
  try{handler?.(event);if(live.current.off||!owner.canAct(node,stamp)||guard.canceled())return;if(reason==='pointer'||reason==='focus')member.order=++interactionOrder;if(ownDefault)guard.preventOwnDefault();queued=true;pendingNode.current=node;pendingWork.current={stamp,ticket:requestTicket,guard,reason,opening};
   queueMicrotask(()=>{let transferred=false;try{if(requestTicket!==ticket.current||live.current.off||!owner.canAct(node,stamp)||guard.canceled())return;const next=update();
    const propose=()=>{timer.current=null;if(requestTicket!==ticket.current||live.current.off||guard.canceled()||!owner.canAct(node,stamp))return;transferred=true;owner.request(next,event,node,reason,undefined,{stamp,guard,when:()=>requestTicket===ticket.current&&!live.current.off,settled:()=>{if(requestTicket===ticket.current){pendingNode.current=null;pendingWork.current=null;}}});};
    if(delay&&next!==null&&live.current.delayDuration>0)timer.current=setTimeout(propose,live.current.delayDuration);else propose();
   }finally{if(!transferred){guard.restore();if(requestTicket===ticket.current&&timer.current===null){pendingNode.current=null;pendingWork.current=null;}}}});
  }finally{if(!queued)guard.restore();}
 }
 function enter(event,v,node,handler){const stamp=stampOf(event);act(event,node,'pointer',handler,()=>{if(hover.current?.value!==v){blocked.current.delete(v);pointerPress.current=null;}hover.current={value:v,node};return hovered()?.value??focused()?.value??null;},{stamp,delay:true,opening:()=>hover.current?.value!==v||!blocked.current.has(v)?v:focused()?.value??null});}
 function leave(event,v,node,handler){const stamp=stampOf(event),related=event.relatedTarget,inside=related?.nodeType&&node.parentElement?.contains(related);if(inside){handler?.(event);return;}act(event,node,'leave',handler,()=>{if(hover.current?.value===v)hover.current=null;if(pointerPress.current?.value===v)pointerPress.current=null;blocked.current.delete(v);return hovered()?.value??focused()?.value??null;},{stamp});}
 function focusIn(event,v,node,stamp=stampOf(event)){act(event,node,'focus',undefined,()=>{const press=pointerPress.current,pressed=press?.node===node&&press.stamp===owner.epoch.current&&!press.guard.canceled();if(pressed)blocked.current.add(v);else if(focus.current?.node!==node)blocked.current.delete(v);focus.current={value:v,node};return pressed?null:focused()?.value??hovered()?.value??null;},{stamp,opening:()=>{const press=pointerPress.current,pressed=press?.node===node&&press.stamp===owner.epoch.current&&!press.guard.canceled();if(pressed)return null;return node.ownerDocument.activeElement===node&&(focus.current?.node!==node||!blocked.current.has(v))?v:hovered()?.value??null;}});}
 function blur(event,v,node,handler,stamp=stampOf(event)){act(event,node,'blur',handler,()=>{if(focus.current?.value===v)focus.current=null;if(pointerPress.current?.value===v)pointerPress.current=null;blocked.current.delete(v);return hovered()?.value??focused()?.value??null;},{stamp});}
 function press(event,v,node,stamp=stampOf(event),handler,givenGuard){act(event,node,'press',handler,()=>{if(hover.current)blocked.current.add(hover.current.value);if(focus.current)blocked.current.add(focus.current.value);blocked.current.add(v);return null;},{stamp,givenGuard});}
 function pointerDown(event,v,node,handler){const stamp=stampOf(event),guard=observeCancellation(event);try{handler?.(event);if(!live.current.off&&owner.canAct(node,stamp)&&!guard.canceled())pointerPress.current={value:v,node,stamp,guard};press(event,v,node,stamp,undefined,guard);}finally{queueMicrotask(guard.restore);}}
 useLayoutEffect(()=>{if(off)return;const doc=root.current?.ownerDocument;if(!doc)return;const key=event=>{if(escapeOwners.get(event)!==member||event.key!=='Escape'||event.isComposing||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey||event.defaultPrevented)return;const current=owner.live.current.controlled?owner.live.current.selected:owner.logical.current;const pending=pendingSource();if(current===null&&!pending)return;const source=[button(current),pending,hover.current?.node,focus.current?.node].find(node=>node&&available(node));if(!source)return;act(event,source,'escape',undefined,()=>{if(hover.current)blocked.current.add(hover.current.value);if(focus.current)blocked.current.add(focus.current.value);return null;},{ownDefault:true});};doc.addEventListener('keydown',key);return()=>doc.removeEventListener('keydown',key);});
 return{value:off||!eligible||triggerProps[owner.selected]?.disabled||triggerProps[owner.selected]?.hidden?null:owner.selected,snapshot:stampOf,focus:focusIn,blur,press,enter,leave,pointerDown,
 enterContentBoundary(){},
 leaveContentBoundary(event,v){const node=button(v);if(node&&hover.current?.value===v)leave(event,v,node);},
 enterTip(event,v){const node=button(v);if(node)enter(event,v,node);},
 leaveTip(event,v){const node=button(v);if(node)leave(event,v,node);}};
}
