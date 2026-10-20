import React,{forwardRef,useId}from'react';
import {Checkbox01}from'../scalar/index.jsx';
import {useDisclosureSet,FocusBoundary,Icon}from'./engine.jsx';
import {DeliveryChoices}from'./delivery.jsx';
import DATA from'./data.json';
const FILTER_SECTIONS=['price','ratings','brand','battery'],ADDRESS_SECTIONS=['address','delivery','payment'];
function Section({state,uid,value,title,children}){
 const open=state.selected.includes(value),props=state.triggerProps[value]||{},triggerId=`${uid}-${value}-trigger`,contentId=`${uid}-${value}-content`;
 const{onClick,className='',children:_c,dangerouslySetInnerHTML:_h,...attrs}=props;
 return <section className="fr29-form-section" data-section={value} data-state={open?'open':'closed'}>
  <div className="fr29-section-heading"><h3>{title}</h3><button {...attrs} type="button" id={triggerId} disabled={state.disabled||props.disabled} aria-expanded={open} aria-controls={contentId} data-disclosure-value={value} className={`fr29-section-toggle ${className}`} onClick={e=>state.click(e,value,onClick)}><Icon kind="down"/><span className="fr29-sr">Toggle {title}</span></button></div>
  <div id={contentId} role="region" aria-labelledby={triggerId} hidden={!open}>{open&&<FocusBoundary triggerId={triggerId} className="fr29-section-content">{children}</FocusBoundary>}</div>
 </section>;
}
function NativeField({uid,fieldId,label,type='text',floating=false,textarea=false,placeholder,disabled,props={}}){
 const{className='',children:_c,dangerouslySetInnerHTML:_h,id:_id,type:_type,...native}=props,id=`${uid}-${fieldId}`;
 const Tag=textarea?'textarea':'input';
 return <div className={`fr29-native-field ${floating?'fr29-floating-field':''}`}><label htmlFor={id}><span>{label}</span></label><Tag {...native} id={id} type={textarea?undefined:type} disabled={disabled||props.disabled} placeholder={props.placeholder??placeholder} className={`fr29-input ${className}`} data-field-id={fieldId}/>{fieldId==='card-number'&&<Icon kind="card" className="fr29-card-marker"/>}</div>;
}
export const Collapsible05=forwardRef(function Collapsible05({inputProps={},checkboxProps={},...props},ref){
 const state=useDisclosureSet(props,ref,'collapsible-05',FILTER_SECTIONS),uid=useId(),data=DATA['collapsible-05'];
 const check=(item,rating)=>{const p=checkboxProps[item.id]||{}, {children:_c,dangerouslySetInnerHTML:_h,id:_id,type:_type,label:_label,help:_help,error:_error,...native}=p;
 return <div className="fr29-filter-choice" key={item.id} data-filter-choice={item.id}><Checkbox01 {...native} id={`${uid}-${item.id}`} disabled={state.disabled||p.disabled} label={rating?<><span>{item.value}</span><Icon kind="star"/> &amp; Up</>:item.label}/></div>;};
 return <div {...state.native} ref={state.rootRef} className={`fr7 fr29 fr29-filter ${state.className}`} data-component-id="collapsible-05" data-disabled={state.disabled?'':undefined}>
 <Section state={state} uid={uid} value="price" title="Price Range"><NativeField uid={uid} fieldId="min-price" label="Min Price" type="number" placeholder={data.priceRange.minPlaceholder} disabled={state.disabled} props={inputProps['min-price']}/><NativeField uid={uid} fieldId="max-price" label="Max Price" type="number" placeholder={data.priceRange.maxPlaceholder} disabled={state.disabled} props={inputProps['max-price']}/></Section>
 <Section state={state} uid={uid} value="ratings" title="Customer Ratings">{data.ratings.map(x=>check(x,true))}</Section>
 <Section state={state} uid={uid} value="brand" title="Brand">{data.brands.map(x=>check(x,false))}</Section>
 <Section state={state} uid={uid} value="battery" title="Battery">{data.batterySizes.map(x=>check(x,false))}</Section>
 </div>;
});
export const Collapsible06=forwardRef(function Collapsible06(props,ref){
 const state=useDisclosureSet(props,ref,'collapsible-06',['faq-1','faq-2'],['faq-1']),uid=useId();
 return <div {...state.native} ref={state.rootRef} className={`fr7 fr29 fr29-answer-list ${state.className}`} data-component-id="collapsible-06" data-disabled={state.disabled?'':undefined}>{DATA['collapsible-06'].map((item,i)=>{
 const value=`faq-${i+1}`,open=state.selected.includes(value),p=state.triggerProps[value]||{},triggerId=`${uid}-${value}-trigger`,contentId=`${uid}-${value}-content`,questionId=`${uid}-${value}-question`,{onClick,className='',children:_c,dangerouslySetInnerHTML:_h,...attrs}=p;
 return <section key={value} className="fr29-answer-row" data-state={open?'open':'closed'}><h3 id={questionId}>{item.question}</h3><div id={contentId} role="region" aria-labelledby={questionId} hidden={!open}>{open&&<p>{item.answer}</p>}</div><button {...attrs} type="button" id={triggerId} aria-expanded={open} aria-controls={contentId} aria-describedby={questionId} disabled={state.disabled||p.disabled} data-disclosure-value={value} className={`fr29-answer-toggle ${className}`} onClick={e=>state.click(e,value,onClick)}>{open?'Hide answer':'Show answer'}</button></section>;
 })}</div>;
});
export const Collapsible09=forwardRef(function Collapsible09({fieldProps={},deliveryProps={},...props},ref){
 const state=useDisclosureSet(props,ref,'collapsible-09',ADDRESS_SECTIONS),uid=useId(),data=DATA['collapsible-09'];
 return <div {...state.native} ref={state.rootRef} className={`fr7 fr29 fr29-checkout ${state.className}`} data-component-id="collapsible-09" data-disabled={state.disabled?'':undefined}>
 <Section state={state} uid={uid} value="address" title="Delivery Address">{data.addressFields.slice(0,1).map(f=><NativeField key={f.id} uid={uid} fieldId={f.id} label={f.label} type={f.type} floating placeholder=" " disabled={state.disabled} props={fieldProps[f.id]}/>)}<NativeField uid={uid} fieldId="address" label="Address" textarea floating placeholder=" " disabled={state.disabled} props={fieldProps.address}/>{data.addressFields.slice(1).map(f=><NativeField key={f.id} uid={uid} fieldId={f.id} label={f.label} type={f.type} floating placeholder=" " disabled={state.disabled} props={fieldProps[f.id]}/>)}</Section>
 <Section state={state} uid={uid} value="delivery" title="Delivery Options"><DeliveryChoices {...deliveryProps} disabled={state.disabled||deliveryProps.disabled}/></Section>
 <Section state={state} uid={uid} value="payment" title="Payment"><fieldset className="fr29-card-fields"><legend>Card details</legend><NativeField uid={uid} fieldId="card-number" label="Card number" placeholder="1234 1234 1234 1234" disabled={state.disabled} props={fieldProps['card-number']}/><div className="fr29-card-bottom"><NativeField uid={uid} fieldId="expiry" label="Expiry" placeholder="MM / YY" disabled={state.disabled} props={fieldProps.expiry}/><NativeField uid={uid} fieldId="cvc" label="CVC" placeholder="CVC" disabled={state.disabled} props={fieldProps.cvc}/></div><span className="fr29-sr">Card Provider</span></fieldset></Section>
 </div>;
});
