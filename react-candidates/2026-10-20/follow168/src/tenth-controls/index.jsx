import React,{forwardRef,useId}from'react';
const specs=[['compact','Compact input'],['standard','Standard input '],['expanded','Expanded input']];
export const Textarea19=forwardRef(function Textarea19({fields={},className='',children:_children,dangerouslySetInnerHTML:_html,...group},ref){
 const uid=useId();
 return <div {...group} ref={ref} className={'fr10-textarea19 '+className} data-component-id="textarea-19">{specs.map(([key,placeholder])=>{
  const p=fields[key]??{};if(p.value!==undefined&&p.defaultValue!==undefined)throw new TypeError('Textarea19 '+key+' value/defaultValue are mutually exclusive');
  const{id=`fr10-${uid}-${key}`,label,placeholder:hint=placeholder,className:fieldClass='',children:_child,dangerouslySetInnerHTML:_danger,...native}=p;
  return <div key={key} className={'fr10-size fr10-size-'+key} data-member={key}>{label!==undefined&&label!==null&&label!==false&&<label htmlFor={id}>{label}</label>}<textarea {...native} id={id} placeholder={hint} aria-label={native['aria-label']??(label===undefined||label===null||label===false?placeholder.trim():undefined)} className={'fr10-input '+fieldClass}/></div>;
 })}</div>;
});
function Symbol({kind}){return <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">{kind==='home'?<path d="M2 9 10 2l8 7M4 8v10h12V8M8 18v-6h4v6"/>:kind==='folder'?<path d="M2 5h6l2 2h8v10H2ZM2 5V3h6l2 2"/>:<path d="M4 2h8l4 4v12H4ZM12 2v5h4M7 11h6M7 14h6"/>}</svg>}
const defaults=[{label:'Home',href:'#',symbol:'home'},{label:'Reports',href:'#',symbol:'folder'},{label:'Revenue Summary',current:true,symbol:'document'}];
export const Breadcrumb03=forwardRef(function Breadcrumb03({segments=defaults,className='',children:_children,dangerouslySetInnerHTML:_html,'aria-label':ariaLabel='breadcrumb',...native},ref){return <nav {...native} ref={ref} aria-label={ariaLabel} className={'fr10-breadcrumb '+className} data-component-id="breadcrumb-03"><ol>{segments.map((segment,index)=>{
 const{label,current,symbol='document',icon,disabled=false,onClick,className:memberClass='',href,children:_child,dangerouslySetInnerHTML:_danger,...attrs}=segment;
 const visual=icon===undefined?<Symbol kind={symbol}/>:icon;
 return <li key={index}>{current?<span id={attrs.id} title={attrs.title} aria-label={attrs['aria-label']} className={'fr10-current '+memberClass} role="link" aria-current="page" aria-disabled="true">{visual}{label}</span>:<a {...attrs} href={disabled?undefined:href} aria-disabled={disabled||undefined} tabIndex={disabled?-1:attrs.tabIndex} onClick={event=>{if(disabled){event.preventDefault();return;}onClick?.(event)}} className={'fr10-link '+memberClass}>{visual}{label}</a>}{index<segments.length-1&&<span className="fr10-separator" role="presentation" aria-hidden="true"><svg viewBox="0 0 16 16" focusable="false"><path d="m6 3 5 5-5 5"/></svg></span>}</li>;
 })}</ol></nav>});
