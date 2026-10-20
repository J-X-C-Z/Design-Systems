import React,{forwardRef,useId}from'react';
export {Tabs26}from'./tabs.jsx';
export const Textarea21=forwardRef(function Textarea21({label='Project Notes',labelProps={},wrapperClassName='',id:suppliedId,className='',placeholder='Write a quick note about your project...',children:_c,dangerouslySetInnerHTML:_h,...native},ref){
 const uid=useId(),id=suppliedId??uid;const{children:_lc,dangerouslySetInnerHTML:_lh,...labelAttributes}=labelProps;
 return <div className={`fr7 fr35 fr35-notes-field ${wrapperClassName}`} data-component-id="textarea-21">{label!==null&&label!==false&&<label {...labelAttributes} htmlFor={id} data-slot="label">{label}</label>}<textarea {...native} ref={ref} id={id} className={`fr35-notes ${className}`} placeholder={placeholder} data-slot="textarea"/></div>;
});
function icon(kind){return <svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 24 24" data-icon={kind} fill={kind==='bell'?'currentColor':'none'} stroke="currentColor" strokeWidth={kind==='bell'?0:1.8} strokeLinecap="round" strokeLinejoin="round">{kind==='check'?<><path d="m2 12 5 5L18 6"/><path d="m11 16 2 2L23 7"/></>:<><path d="M12 2a2 2 0 0 1 2 2v.3c3 1 4.5 3.6 4.5 6.7v3l2 3v1H3.5v-1l2-3v-3c0-3.1 1.5-5.7 4.5-6.7V4a2 2 0 0 1 2-2Z"/><path d="M9 20h6a3 3 0 0 1-6 0Z"/></>}</svg>;}
function makeIconButton(id,kind,name){return forwardRef(function IconButton({label=name,type='button',className='',children:_c,dangerouslySetInnerHTML:_h,...native},ref){return <button {...native} ref={ref} type={type} className={`fr7 fr35 fr35-icon-button fr35-${kind}-button ${className}`} data-component-id={id}>{icon(kind)}{kind==='bell'&&<span className="fr35-notification-dot" aria-hidden="true"/>}<span className="fr35-sr-only">{label}</span></button>;});}
export const Button37=makeIconButton('button-37','check','Check');
export const Button38=makeIconButton('button-38','bell','Notifications');
