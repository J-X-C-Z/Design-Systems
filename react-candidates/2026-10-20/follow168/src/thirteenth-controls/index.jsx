import React,{forwardRef,useId}from'react';
const originalOutput='This content is generated and cannot be edited.';
export const Textarea13=forwardRef(function Textarea13({id,label='Generated output',placeholder='Output will appear here...',readOnly=true,value,defaultValue,wrapperClassName='',className='',children:_child,dangerouslySetInnerHTML:_html,...native},ref){
 const uid=useId(),fieldId=id??`fr13-output-${uid}`;if(value!==undefined&&defaultValue!==undefined)throw new TypeError('Textarea13 value/defaultValue are mutually exclusive');
 return <div className={'fr13-textarea13 '+wrapperClassName} data-component-id="textarea-13">{label!==null&&label!==false&&<label htmlFor={fieldId}>{label}</label>}<textarea {...native} ref={ref} id={fieldId} value={value} defaultValue={value===undefined?(defaultValue??originalOutput):undefined} readOnly={readOnly} placeholder={placeholder} className={'fr13-output '+className}/></div>;
});
export const Textarea17=forwardRef(function Textarea17({id,label='Leave a reply',placeholder='Write your reply...',buttonLabel='Post Reply',buttonProps={},wrapperClassName='',className='',children:_child,dangerouslySetInnerHTML:_html,...native},ref){
 const uid=useId(),fieldId=id??`fr13-reply-${uid}`;if(native.value!==undefined&&native.defaultValue!==undefined)throw new TypeError('Textarea17 value/defaultValue are mutually exclusive');
 const{children:_buttonChildren,dangerouslySetInnerHTML:_buttonHtml,className:buttonClass='',...button}=buttonProps;
 return <div className={'fr13-textarea17 '+wrapperClassName} data-component-id="textarea-17">{label!==null&&label!==false&&<label htmlFor={fieldId}>{label}</label>}<textarea {...native} ref={ref} id={fieldId} placeholder={placeholder} className={'fr13-reply '+className}/><button {...button} form={button.form??native.form} disabled={!!native.disabled||!!button.disabled} className={'fr13-post '+buttonClass}>{buttonLabel}</button></div>;
});
