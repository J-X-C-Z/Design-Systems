import * as React from'react';
import {Collapsible05,Collapsible06,Collapsible08,Collapsible09,type Collapsible05Section,type Collapsible09DeliveryValue,type Collapsible08Action}from'@follow-ui/react-seven';
const rootRef:React.Ref<HTMLDivElement>=node=>{node?.focus();return()=>{};};
const inputRef:React.Ref<HTMLInputElement>=node=>{node?.focus();return()=>{};};
const buttonRef:React.Ref<HTMLButtonElement>=node=>{node?.focus();return()=>{};};
const filter=<Collapsible05 ref={rootRef} expanded={['price','ratings','brand','battery']} triggerProps={{price:{ref:buttonRef}}} onExpandedChange={(v,d)=>{const id:'collapsible-05'=d.id;const key:Collapsible05Section=d.sectionId;d.cancel();return false;}} inputProps={{'min-price':{name:'min',value:'10',onChange:e=>e.currentTarget.value,ref:inputRef}}} checkboxProps={{'brand-apple':{checked:true,name:'brand',onCheckedChange:(v,e)=>e.currentTarget.checked,ref:inputRef}}}/>;
const faq=<Collapsible06 defaultExpanded={['faq-2']} ref={rootRef} triggerProps={{'faq-1':{ref:buttonRef}}} onExpandedChange={(v,d)=>{const id:'collapsible-06'=d.id;d.cancel();}}/>;
const checkout=<Collapsible09 expanded={['address','delivery','payment']} ref={rootRef} fieldProps={{'full-name':{value:'Example',onChange:e=>e.currentTarget.value,ref:inputRef},address:{defaultValue:'Draft',rows:3,ref:n=>{n?.focus();return()=>{};}}}} deliveryProps={{value:'2',name:'delivery',ref:rootRef,itemProps:{'1':{ref:inputRef}},onValueChange:(v,d)=>{const value:Collapsible09DeliveryValue=v;const id:'collapsible-09'=d.id;const field:'delivery'=d.fieldId;d.cancel();}}}/>;
const menu=<Collapsible08 open={false} ref={rootRef} triggerProps={{ref:buttonRef}} menuProps={{ref:rootRef,onKeyDown:e=>e.key}} sections={{expanded:['settings','workspace'],ref:rootRef,triggerProps:{settings:{ref:buttonRef}},onExpandedChange:(v,d)=>{const id:'collapsible-08'=d.id;d.cancel();}}} itemProps={{logout:{ref:buttonRef}}} onAction={(v,d)=>{const action:Collapsible08Action=v;const id:'collapsible-08'=d.id;d.cancel();}} onOpenChange={(v,d)=>{const id:'collapsible-08'=d.id;d.cancel();return false;}}/>;
// @ts-expect-error exact filter sections
const e1=<Collapsible05 expanded={['faq-1']}/>;
// @ts-expect-error exclusive filter owner
const e2=<Collapsible05 expanded={[]} defaultExpanded={[]}/>;
// @ts-expect-error fixed content
const e3=<Collapsible05>replace</Collapsible05>;
// @ts-expect-error fixed trigger type
const e4=<Collapsible05 triggerProps={{price:{type:'submit'}}}/>;
// @ts-expect-error fixed source checkbox ids
const e5=<Collapsible05 checkboxProps={{unknown:{checked:true}}}/>;
// @ts-expect-error checkbox ownership exclusive
const e6=<Collapsible05 checkboxProps={{'brand-apple':{checked:true,defaultChecked:true}}}/>;
// @ts-expect-error canonical label protected
const e7=<Collapsible05 checkboxProps={{'brand-apple':{label:'replace'}}}/>;
// @ts-expect-error native number type fixed
const e8=<Collapsible05 inputProps={{'min-price':{type:'text'}}}/>;
// @ts-expect-error input owner exclusive
const e9=<Collapsible05 inputProps={{'min-price':{value:'1',defaultValue:'2'}}}/>;
// @ts-expect-error unique association protected
const e10=<Collapsible05 inputProps={{'min-price':{id:'foreign'}}}/>;
// @ts-expect-error exact FAQ ids
const e11=<Collapsible06 expanded={['faq-3']}/>;
// @ts-expect-error exclusive FAQ owner
const e12=<Collapsible06 expanded={[]} defaultExpanded={[]}/>;
// @ts-expect-error canonical FAQ copy fixed
const e13=<Collapsible06 children="replace"/>;
// @ts-expect-error native trigger type fixed
const e14=<Collapsible06 triggerProps={{'faq-1':{type:'submit'}}}/>;
// @ts-expect-error ID-specific callback details
const e15=<Collapsible06 onExpandedChange={(v,d)=>{const id:'collapsible-05'=d.id;}}/>;
// @ts-expect-error original checkout sections
const e16=<Collapsible09 expanded={['price']}/>;
// @ts-expect-error root owner exclusive
const e17=<Collapsible09 expanded={[]} defaultExpanded={[]}/>;
// @ts-expect-error text field ref type
const e18=<Collapsible09 fieldProps={{'full-name':{ref:React.createRef<HTMLTextAreaElement>()}}}/>;
// @ts-expect-error textarea field ref type
const e19=<Collapsible09 fieldProps={{address:{ref:React.createRef<HTMLInputElement>()}}}/>;
// @ts-expect-error textarea ownership exclusive
const e20=<Collapsible09 fieldProps={{address:{value:'A',defaultValue:'B'}}}/>;
// @ts-expect-error fixed payment type
const e21=<Collapsible09 fieldProps={{'card-number':{type:'password'}}}/>;
// @ts-expect-error canonical delivery value
const e22=<Collapsible09 deliveryProps={{value:'express'}}/>;
// @ts-expect-error radio owner exclusive
const e23=<Collapsible09 deliveryProps={{value:'2',defaultValue:'1'}}/>;
// @ts-expect-error fixed radio group member values
const e24=<Collapsible09 deliveryProps={{itemProps:{'2':{value:'other'}}}}/>;
// @ts-expect-error fixed radio name under group owner
const e25=<Collapsible09 deliveryProps={{itemProps:{'2':{name:'foreign'}}}}/>;
// @ts-expect-error protected radio descriptions
const e26=<Collapsible09 deliveryProps={{itemProps:{'2':{'aria-describedby':'foreign'}}}}/>;
// @ts-expect-error detail ID cannot be radio-group-02
const e27=<Collapsible09 deliveryProps={{onValueChange:(v,d)=>{const id:'radio-group-02'=d.id;}}}/>;
// @ts-expect-error menu owner exclusive
const e28=<Collapsible08 open={true} defaultOpen={false}/>;
// @ts-expect-error menu boolean owner
const e29=<Collapsible08 open="true"/>;
// @ts-expect-error menu content fixed
const e30=<Collapsible08>replace</Collapsible08>;
// @ts-expect-error fixed menu popup association
const e31=<Collapsible08 triggerProps={{'aria-haspopup':'dialog'}}/>;
// @ts-expect-error fixed menu role
const e32=<Collapsible08 menuProps={{role:'dialog'}}/>;
// @ts-expect-error menu content HTML fixed
const e33=<Collapsible08 menuProps={{dangerouslySetInnerHTML:{__html:'replace'}}}/>;
// @ts-expect-error nested section identity fixed
const e34=<Collapsible08 sections={{expanded:['profile']}}/>;
// @ts-expect-error nested section owner exclusive
const e35=<Collapsible08 sections={{expanded:[],defaultExpanded:[]}}/>;
// @ts-expect-error nested native trigger type fixed
const e36=<Collapsible08 sections={{triggerProps:{settings:{type:'submit'}}}}/>;
// @ts-expect-error canonical menu action identity
const e37=<Collapsible08 itemProps={{delete:{disabled:true}}}/>;
// @ts-expect-error fixed menuitem role
const e38=<Collapsible08 itemProps={{profile:{role:'button'}}}/>;
// @ts-expect-error wrong root ref
const e39=<Collapsible08 ref={React.createRef<HTMLButtonElement>()}/>;
// @ts-expect-error action detail no sectionId
const e40=<Collapsible08 onAction={(v,d)=>d.sectionId}/>;
