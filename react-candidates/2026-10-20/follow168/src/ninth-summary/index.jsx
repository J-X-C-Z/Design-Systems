import React,{forwardRef,useId,useRef,useState,useLayoutEffect,useImperativeHandle}from'react';
const LIMIT=200;
function checkedText(value,name){if(typeof value!=='string')throw new TypeError(`Textarea18 ${name} must be a string`);if(value.length>LIMIT)throw new RangeError(`Textarea18 ${name} exceeds 200 UTF-16 code units`);return value;}
export const Textarea18=forwardRef(function Textarea18(props,ref){
 const{value,defaultValue='',label='Brief summary',placeholder='Write a short summary...',id,onChange,onCompositionEnd,'aria-describedby':externalDescription,className='',wrapperClassName='',children:_children,dangerouslySetInnerHTML:_html,maxLength:_maxLength,...native}=props;
 if(value!==undefined&&props.defaultValue!==undefined)throw new TypeError('Textarea18 value/defaultValue are mutually exclusive');
 checkedText(defaultValue,'defaultValue');if(value!==undefined)checkedText(value,'value');
 const controlled=value!==undefined,[stored,setStored]=useState(defaultValue),uid=useId(),node=useRef(null),serial=useRef(0),live=useRef(null);
 const previous=useRef({controlled,value:controlled?value:defaultValue});
 const displayed=!controlled&&previous.current.controlled?previous.current.value:controlled?value:stored,fieldId=id??`fr9-summary-${uid}`,counterId=fieldId+'-remaining';
 useImperativeHandle(ref,()=>node.current,[]);
 useLayoutEffect(()=>{previous.current={controlled,value:displayed};if(!controlled&&stored!==displayed)setStored(displayed);live.current={controlled,value:displayed,defaultValue,onChange,onCompositionEnd,disabled:!!native.disabled,readOnly:!!native.readOnly};});
 useLayoutEffect(()=>{const input=node.current,doc=input.ownerDocument;const reset=event=>{if(event.target!==input.form)return;const owner=input.form,ticket=++serial.current;queueMicrotask(()=>{if(event.defaultPrevented||serial.current!==ticket||!input.isConnected||input.form!==owner)return;const next=live.current.controlled?live.current.value:live.current.defaultValue;input.value=next;if(!live.current.controlled)setStored(next);});};doc.addEventListener('reset',reset,true);return()=>{serial.current++;doc.removeEventListener('reset',reset,true)};},[]);
 function change(event){const input=event.currentTarget,previous=live.current;const next=input.value;if(previous.disabled||previous.readOnly||next.length>LIMIT){input.value=previous.value;return;}serial.current++;if(!previous.controlled)setStored(next);previous.onChange?.(event);}
 function compositionEnd(event){live.current.onCompositionEnd?.(event);const current=live.current;event.currentTarget.value=current.value;}
 const described=[...new Set([externalDescription,counterId].filter(Boolean).join(' ').split(/\s+/).filter(Boolean))].join(' ');
 return <div className={'fr9-summary '+wrapperClassName} data-component-id="textarea-18">{label!==null&&label!==false&&<label htmlFor={fieldId}>{label}</label>}<textarea {...native} id={fieldId} ref={node} value={displayed} maxLength={LIMIT} onChange={change} onCompositionEnd={compositionEnd} placeholder={placeholder} className={'fr9-summary-input '+className} aria-describedby={described}/><p id={counterId} className="fr9-counter"><span>{LIMIT-displayed.length}</span> remaining</p></div>;
});
