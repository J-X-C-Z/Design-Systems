import React, {createContext, useContext, useState, useEffect, useRef, useId} from 'react';

/** All resource counters belong to this extension, not the host. Used by bounded browser tests. */
export const resources = {timers:0, listeners:0, observers:0, raf:0, locks:0};
export function listen(target, name, handler, options) {
  target.addEventListener(name, handler, options); resources.listeners++;
  let active=true; return () => {if(active){target.removeEventListener(name,handler,options);resources.listeners--;active=false;}};
}
export function later(fn, delay) {
  resources.timers++;let active=true;
  const id=setTimeout(()=>{if(active){active=false;resources.timers--;fn();}},delay);
  return ()=>{if(active){active=false;clearTimeout(id);resources.timers--;}};
}
export function repeat(fn,delay) {resources.timers++;const id=setInterval(fn,delay);let active=true;return()=>{if(active){active=false;clearInterval(id);resources.timers--;}};}
export function useLocalState(key,initial){
  const [value,setValue]=useState(()=>{try{return JSON.parse(localStorage.getItem('studio:cel-boil:'+key))??initial;}catch{return initial;}});
  useEffect(()=>{try{localStorage.setItem('studio:cel-boil:'+key,JSON.stringify(value));}catch{/* Storage may be disabled. The page remains usable. */}},[key,value]);
  return [value,setValue];
}
const Preferences=createContext(null);
export function CelProvider({children}){
  const [theme,setTheme]=useLocalState('theme-v1','light');
  const [paused,setPaused]=useLocalState('paused-v1',false);
  const [reduced,setReduced]=useState(()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(()=>{const m=matchMedia('(prefers-reduced-motion: reduce)');setReduced(m.matches);return listen(m,'change',e=>setReduced(e.matches));},[]);
  const value={theme:theme==='dark'?'dark':'light',setTheme,paused:!!paused,setPaused,reduced,motion:!paused&&!reduced};
  return <Preferences.Provider value={value}><div className="cb-root" data-theme={value.theme} data-motion={value.motion?'on':'off'}>{children}</div></Preferences.Provider>;
}
export function useCel(){return useContext(Preferences);}
export function useControllable(value,defaultValue,onChange){
  const [inner,setInner]=useState(defaultValue);const controlled=value!==undefined;const current=controlled?value:inner;
  return [current,next=>{const result=typeof next==='function'?next(current):next;if(!controlled)setInner(result);if(result!==current)onChange?.(result);}];
}
const OUTLINES=[
 'M4 5 Q30 2 53 4 T96 5 Q99 32 96 53 T95 95 Q70 98 49 96 T4 95 Q1 70 4 49 Z',
 'M5 4 Q29 5 53 3 T95 6 Q97 31 95 53 T96 94 Q68 96 50 95 T3 96 Q5 70 3 48 Z',
 'M4 6 Q29 3 54 5 T96 4 Q95 30 97 51 T94 96 Q69 95 48 97 T5 94 Q2 69 4 47 Z',
 'M3 4 Q31 4 51 5 T95 5 Q98 33 96 51 T96 95 Q68 97 51 95 T4 96 Q3 67 5 48 Z'
];
export function InkBorder({className=''}) {return <svg className={'cb-ink-border '+className} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{OUTLINES.map((d,i)=><path key={i} d={d} className={'cb-line cb-line-'+i} vectorEffect="non-scaling-stroke"/>)}</svg>;}
export function InkButton({children,tone='paper',className='',busy=false,type='button',disabled=false,...props}){
 return <button {...props} type={type} disabled={disabled||busy} aria-busy={busy||undefined} className={`cb-button cb-${tone} ${className}`}><InkBorder/><span className="cb-button-text">{busy&&<span className="cb-loader" aria-hidden="true"/>}{children}</span></button>;
}
export function Icon({name='star',size=22,...props}){
 const paths={arrow:'M4 12h15M13 5l7 7-7 7',back:'M20 12H5m7-7-7 7 7 7',plus:'M12 4v16M4 12h16',minus:'M4 12h16',close:'m5 5 14 14M19 5 5 19',check:'m4 12 5 5L20 6',play:'m8 4 12 8-12 8Z',pause:'M8 5v14M16 5v14',moon:'M19 14a8 8 0 0 1-9-10A9 9 0 1 0 21 16Z',sun:'M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',search:'M17 17l5 5M18 10A8 8 0 1 1 2 10a8 8 0 0 1 16 0',star:'m12 2 3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1Z',bookmark:'M6 3h12v19l-6-4-6 4Z',chevron:'m5 8 7 7 7-7',copy:'M8 8h13v13H8ZM3 16V3h13',info:'M12 11v6m0-11v1M22 12A10 10 0 1 1 2 12a10 10 0 0 1 20 0',redo:'M19 6a9 9 0 1 0 2 10M19 1v6h-6',file:'M6 2h8l5 5v15H6Zm8 0v6h5M9 12h7M9 16h7',eye:'M1 12Q12-4 23 12 12 28 1 12ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0',external:'M14 3h7v7M21 3 10 14M10 5H4v16h16v-6'};
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name]||paths.star}/></svg>;
}
export function Status({children,error=false}){return <p className={'cb-status '+(error?'cb-error':'')} role={error?'alert':'status'}>{children}</p>;}
export function Field({label,children,hint,error,id:provided}){const uid=useId();const id=provided||uid;return <div className="cb-field"><label htmlFor={id}>{label}</label>{React.cloneElement(children,{id,'aria-invalid':error?true:undefined,'aria-describedby':error||hint?id+'-note':undefined})}{(hint||error)&&<small id={id+'-note'} className={error?'cb-error':''}>{error||hint}</small>}</div>;}
let lockCount=0,savedOverflow='';
function lockScroll(){if(lockCount++===0){savedOverflow=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';}resources.locks++;let active=true;return()=>{if(!active)return;active=false;resources.locks--;if(--lockCount===0&&document.documentElement.style.overflow==='hidden')document.documentElement.style.overflow=savedOverflow;};}
export function Modal({open,onClose,title,children,alert=false,className=''}){
 const ref=useRef(null),titleId=useId();const onCloseRef=useRef(onClose);onCloseRef.current=onClose;
 useEffect(()=>{if(!open||!ref.current)return;const d=ref.current,previous=document.activeElement;d.showModal();const unlock=lockScroll();
  const first=d.querySelector('[data-autofocus]')||d.querySelector('button,input,textarea,select,a[href]');first?.focus();
  const trap=listen(d,'keydown',e=>{if(e.key!=='Tab')return;const nodes=[...d.querySelectorAll('button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])')].filter(n=>n.getClientRects().length&&!n.closest('[inert]'));const a=nodes[0],z=nodes[nodes.length-1];if(!a){e.preventDefault();d.focus();return;}if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus();}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();}});
  return()=>{trap();if(d.open)d.close();unlock();if(previous?.isConnected)previous.focus({preventScroll:true});};},[open]);
 return open?<dialog ref={ref} className={'cb-modal '+className} role={alert?'alertdialog':'dialog'} aria-modal="true" aria-labelledby={titleId} onCancel={e=>{e.preventDefault();onCloseRef.current();}} onClick={e=>{if(!alert&&e.target===ref.current){const r=ref.current.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)onCloseRef.current();}}}>
 <header className="cb-modal-header"><span className="cb-eyebrow">CEL / WORKING SHEET</span><InkButton className="cb-icon-button" aria-label="关闭对话框" onClick={onClose}><Icon name="close"/></InkButton></header><h2 id={titleId}>{title}</h2>{children}</dialog>:null;
}
export function useOutside(ref,open,close){const handler=useRef(close);handler.current=close;useEffect(()=>{if(!open)return;const off=listen(document,'pointerdown',e=>{if(!ref.current?.contains(e.target))handler.current(false);});const key=listen(document,'keydown',e=>{if(e.key==='Escape'&&!e.defaultPrevented){e.preventDefault();handler.current(true);}});return()=>{off();key();};},[open,ref]);}
export class ErrorBoundary extends React.Component{constructor(props){super(props);this.state={error:null};}static getDerivedStateFromError(error){return{error};}render(){return this.state.error?<div role="alert" className="cb-error-panel"><h2>这张画纸出了点问题</h2><p>{String(this.state.error.message)}</p><InkButton onClick={()=>location.reload()}>重新打开</InkButton></div>:this.props.children;}}
