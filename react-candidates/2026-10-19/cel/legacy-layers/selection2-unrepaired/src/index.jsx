import React,{createContext,useContext,useEffect,useLayoutEffect,useRef,useState,useId,useCallback,forwardRef} from 'react';

export const celSelectionIds=Object.freeze(['checkbox-03','switch-04']);
const ScopeContext=createContext({paused:false});
export function CelSelectionScope({children,mode='light',paused=false,className='',...rest}){
 const [system,setSystem]=useState(false),[background,setBackground]=useState(false);
 useEffect(()=>{
  const doc=globalThis.document,m=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');
  const media=()=>setSystem(!!m?.matches),visibility=()=>setBackground(doc?.visibilityState==='hidden');
  media();visibility();m?.addEventListener?.('change',media);doc?.addEventListener('visibilitychange',visibility);
  return()=>{m?.removeEventListener?.('change',media);doc?.removeEventListener('visibilitychange',visibility);};
 },[]);
 const stop=!!paused||system||background;
 return <ScopeContext.Provider value={{paused:stop}}><div {...rest} className={'celx-selection '+className} data-mode={mode==='dark'?'dark':'light'} data-motion={stop?'off':'on'}>{children}</div></ScopeContext.Provider>;
}
const OUTLINES=[
 'M3 4Q12 2 21 3L22 20Q12 22 3 21Z',
 'M4 3Q13 4 21 2L21 21Q11 20 2 21Z',
 'M3 3Q12 2 22 4L21 22Q12 21 3 20Z',
 'M2 4Q12 3 21 3L22 21Q12 23 4 21Z'
];
function Ink({wide=false}){return <svg className="celx-ink" viewBox="0 0 24 24" preserveAspectRatio="none" aria-hidden="true" focusable="false">{OUTLINES.map((d,i)=><path key={i} d={d} className={'celx-line celx-line-'+i} vectorEffect="non-scaling-stroke" strokeDasharray={wide?undefined:'3 2'}/>)}</svg>;}
function useSelection(props,ref){
 const {checked,defaultChecked=false,disabled=false,readOnly=false,onCheckedChange,onClick,onKeyDown,kind}=props;
 const [inner,setInner]=useState(!!defaultChecked),initial=useRef(!!defaultChecked),node=useRef(null),timers=useRef(new Set()),revision=useRef(0),mounted=useRef(false);
 const controlled=checked!==undefined,value=controlled?!!checked:inner;
 const current=useRef({controlled,value,disabled,readOnly,onCheckedChange});
 useLayoutEffect(()=>{
  const old=current.current;
  if(old.controlled!==controlled||old.value!==value||old.disabled!==disabled||old.readOnly!==readOnly)revision.current++;
  current.current={controlled,value,disabled,readOnly,onCheckedChange};
  if(controlled)setInner(value);
  if(node.current){node.current.defaultChecked=initial.current;node.current.checked=value;}
 });
 function reconcile(){if(mounted.current&&node.current?.isConnected)node.current.checked=current.current.value;}
 function later(fn){const id=setTimeout(()=>{timers.current.delete(id);if(mounted.current)fn();},0);timers.current.add(id);}
 useEffect(()=>{
  mounted.current=true;const doc=node.current?.ownerDocument;
  function reset(event){
   const input=node.current,form=input?.form;if(!form||event.target!==form)return;
   const ticket=revision.current;
   later(()=>{
    if(node.current!==input||!input.isConnected)return;
    if(input.form!==form){reconcile();return;}
    if(!event.defaultPrevented&&ticket===revision.current&&!current.current.controlled){
     current.current={...current.current,value:initial.current};revision.current++;setInner(initial.current);
    }
    reconcile();
   });
  }
  doc?.addEventListener('reset',reset,true);
  return()=>{mounted.current=false;doc?.removeEventListener('reset',reset,true);for(const id of timers.current)clearTimeout(id);timers.current.clear();};
 },[]);
 function change(event,next){
  const input=event.currentTarget,prev=current.current.value,native=event.nativeEvent,ticket=++revision.current;
  const state=current.current;let canceled=state.disabled||state.readOnly||event.defaultPrevented;
  const detail={event,cancel(){canceled=true;},get canceled(){return canceled;}};
  try{
   if(!canceled)state.onCheckedChange?.(next,detail);
   if(!canceled&&!event.defaultPrevented&&ticket===revision.current&&!current.current.controlled){current.current={...current.current,value:next};setInner(next);}
  }finally{
   // Browser checkbox default rollback occurs after React's delegated callbacks.
   // A task reconciles the *current* accepted owner state after that boundary.
   later(()=>{
    if(native.defaultPrevented&&ticket===revision.current&&!current.current.controlled){current.current={...current.current,value:prev};revision.current++;setInner(prev);}
    reconcile();
   });
  }
 }
 function click(event){
  const next=event.currentTarget.checked;
  try{onClick?.(event);if(current.current.disabled||current.current.readOnly)event.preventDefault();if(!event.defaultPrevented)change(event,next);}
  finally{later(reconcile);}
 }
 function key(event){
  onKeyDown?.(event);
  if(event.defaultPrevented||event.nativeEvent.isComposing||event.repeat||event.key!=='Enter')return;
  event.preventDefault();
  if(kind==='switch'&&!current.current.disabled&&!current.current.readOnly)event.currentTarget.click();
 }
 const assign=useCallback(el=>{
  node.current=el;
  if(typeof ref==='function'){const cleanup=ref(el);if(typeof cleanup==='function')return()=>{if(node.current===el)node.current=null;cleanup();};}
  else if(ref)ref.current=el;
 },[ref]);
 return {value,input:{ref:assign,checked:value,onChange:()=>{},onClick:click,onKeyDown:key}};
}
const Selection=forwardRef(function Selection({kind,label,description,checked,defaultChecked,disabled=false,readOnly=false,onCheckedChange,onChange:_unusedOnChange,onClick,onKeyDown,id:provided,className='',...rest},ref){
 const generated=useId(),id=provided||generated,descriptionId=id+'-hint';const state=useSelection({kind,checked,defaultChecked,disabled,readOnly,onCheckedChange,onClick,onKeyDown},ref);useContext(ScopeContext);
 const desc=[rest['aria-describedby'],description?descriptionId:null].filter(Boolean).join(' ')||undefined;
 return <div className={'celx-field celx-'+kind+' '+className} data-canonical-id={kind==='switch'?'switch-04':'checkbox-03'} data-state={state.value?'checked':'unchecked'} data-disabled={disabled?'true':undefined}>
  <label className="celx-control" htmlFor={id}>
   <span className="celx-hit"><input {...rest} {...state.input} id={id} type="checkbox" role={kind==='switch'?'switch':undefined} disabled={disabled} readOnly={readOnly} aria-readonly={readOnly||undefined} aria-checked={kind==='switch'?state.value:undefined} aria-describedby={desc}/><span className="celx-art" aria-hidden="true"><Ink wide={kind==='switch'}/>{kind==='switch'?<span className="celx-thumb"><span>{state.value?'●':'○'}</span></span>:<svg className="celx-check" viewBox="0 0 24 24" focusable="false"><path d="m5 12 5 5 10-11"/></svg>}</span></span>
   {(label!=null||description)&&<span className="celx-copy">{label!=null&&<span className="celx-label">{label}</span>}{description&&<span className="celx-description" id={descriptionId}>{description}</span>}</span>}
  </label>
 </div>;
});
export const CelCheckbox03=forwardRef(function CelCheckbox03({label='Subscribe to product updates',...props},ref){return <Selection {...props} ref={ref} kind="checkbox" label={label}/>;});
export const CelSwitch04=forwardRef(function CelSwitch04({label,'aria-label':ariaLabel,...props},ref){return <Selection {...props} ref={ref} kind="switch" label={label} aria-label={ariaLabel??(label==null?'Destructive Switch':undefined)}/>;});
