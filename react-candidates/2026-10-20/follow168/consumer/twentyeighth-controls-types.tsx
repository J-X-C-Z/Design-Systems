import * as React from 'react';
import {Accordion12,type Accordion12Value,Accordion14,type Accordion14Value,Accordion15,type Accordion15Value,Accordion16,type Accordion16Value} from '@follow-ui/react-seven';

const selected12:Accordion12Value[]=['item-1','item-3'];
const good12=<Accordion12 value={selected12} orientation="horizontal" dir="rtl" loop={false} ref={n=>{n?.focus();return()=>{};}} triggerProps={{'item-2':{disabled:true,ref:n=>{n?.focus();return()=>{};}}}} onValueChange={(next,d)=>{const id:'accordion-12'=d.id;d.button.focus();d.cancel();return false;}}/>;
// @ts-expect-error exclusive root owner
const badOwner12=<Accordion12 value={[]} defaultValue={[]}/>;
// @ts-expect-error exact root values
const badValue12=<Accordion12 value={['unknown']}/>;
// @ts-expect-error fixed root content
const badChild12=<Accordion12>replace</Accordion12>;
// @ts-expect-error native submit override excluded
const badType12=<Accordion12 triggerProps={{'item-1':{type:'submit'}}}/>;
// @ts-expect-error generated association excluded
const badLink12=<Accordion12 triggerProps={{'item-1':{'aria-controls':'foreign'}}}/>;

const selected14:Accordion14Value[]=['item-1','item-3'];
const good14=<Accordion14 value={selected14} orientation="horizontal" dir="rtl" loop={false} ref={n=>{n?.focus();return()=>{};}} triggerProps={{'item-2':{disabled:true,ref:n=>{n?.focus();return()=>{};}}}} onValueChange={(next,d)=>{const id:'accordion-14'=d.id;d.button.focus();d.cancel();return false;}}/>;
// @ts-expect-error exclusive root owner
const badOwner14=<Accordion14 value={[]} defaultValue={[]}/>;
// @ts-expect-error exact root values
const badValue14=<Accordion14 value={['unknown']}/>;
// @ts-expect-error fixed root content
const badChild14=<Accordion14>replace</Accordion14>;
// @ts-expect-error native submit override excluded
const badType14=<Accordion14 triggerProps={{'item-1':{type:'submit'}}}/>;
// @ts-expect-error generated association excluded
const badLink14=<Accordion14 triggerProps={{'item-1':{'aria-controls':'foreign'}}}/>;

const selected15:Accordion15Value[]=['item-1','item-3'];
const good15=<Accordion15 value={selected15} orientation="horizontal" dir="rtl" loop={false} ref={n=>{n?.focus();return()=>{};}} triggerProps={{'item-2':{disabled:true,ref:n=>{n?.focus();return()=>{};}}}} onValueChange={(next,d)=>{const id:'accordion-15'=d.id;d.button.focus();d.cancel();return false;}}/>;
// @ts-expect-error exclusive root owner
const badOwner15=<Accordion15 value={[]} defaultValue={[]}/>;
// @ts-expect-error exact root values
const badValue15=<Accordion15 value={['unknown']}/>;
// @ts-expect-error fixed root content
const badChild15=<Accordion15>replace</Accordion15>;
// @ts-expect-error native submit override excluded
const badType15=<Accordion15 triggerProps={{'item-1':{type:'submit'}}}/>;
// @ts-expect-error generated association excluded
const badLink15=<Accordion15 triggerProps={{'item-1':{'aria-controls':'foreign'}}}/>;
const nested15=<Accordion15 faqProps={{'item-1':{value:['faq-2'],ref:n=>{n?.focus();return()=>{};},triggerProps:{'faq-2':{ref:n=>{n?.focus();return()=>{};}}},onValueChange:(v,d)=>{const id:'accordion-15'=d.id;const group:Accordion15Value=d.categoryId;const q:'faq-1'|'faq-2'|'faq-3'=d.faqId;d.cancel();return false;}},'item-2':{defaultValue:[],disabled:true}}}/>;
// @ts-expect-error nested owner exclusive
const nestedOwner15=<Accordion15 faqProps={{'item-1':{value:[],defaultValue:[]}}}/>;
// @ts-expect-error nested values are FAQ ids, not category ids
const nestedId15=<Accordion15 faqProps={{'item-1':{value:['item-1']}}}/>;
// @ts-expect-error canonical nested copy fixed
const nestedChild15=<Accordion15 faqProps={{'item-1':{children:'replace'}}}/>;
// @ts-expect-error native inner submit override excluded
const nestedSubmit15=<Accordion15 faqProps={{'item-1':{triggerProps:{'faq-1':{type:'submit'}}}}}/>;

const selected16:Accordion16Value[]=['item-1','item-3'];
const good16=<Accordion16 value={selected16} orientation="horizontal" dir="rtl" loop={false} ref={n=>{n?.focus();return()=>{};}} triggerProps={{'item-2':{disabled:true,ref:n=>{n?.focus();return()=>{};}}}} onValueChange={(next,d)=>{const id:'accordion-16'=d.id;d.button.focus();d.cancel();return false;}}/>;
// @ts-expect-error exclusive root owner
const badOwner16=<Accordion16 value={[]} defaultValue={[]}/>;
// @ts-expect-error exact root values
const badValue16=<Accordion16 value={['unknown']}/>;
// @ts-expect-error fixed root content
const badChild16=<Accordion16>replace</Accordion16>;
// @ts-expect-error native submit override excluded
const badType16=<Accordion16 triggerProps={{'item-1':{type:'submit'}}}/>;
// @ts-expect-error generated association excluded
const badLink16=<Accordion16 triggerProps={{'item-1':{'aria-controls':'foreign'}}}/>;
const nested16=<Accordion16 faqProps={{'item-1':{value:['faq-2'],ref:n=>{n?.focus();return()=>{};},triggerProps:{'faq-2':{ref:n=>{n?.focus();return()=>{};}}},onValueChange:(v,d)=>{const id:'accordion-16'=d.id;const group:Accordion16Value=d.categoryId;const q:'faq-1'|'faq-2'|'faq-3'=d.faqId;d.cancel();return false;}},'item-2':{defaultValue:[],disabled:true}}}/>;
// @ts-expect-error nested owner exclusive
const nestedOwner16=<Accordion16 faqProps={{'item-1':{value:[],defaultValue:[]}}}/>;
// @ts-expect-error nested values are FAQ ids, not category ids
const nestedId16=<Accordion16 faqProps={{'item-1':{value:['item-1']}}}/>;
// @ts-expect-error canonical nested copy fixed
const nestedChild16=<Accordion16 faqProps={{'item-1':{children:'replace'}}}/>;
// @ts-expect-error native inner submit override excluded
const nestedSubmit16=<Accordion16 faqProps={{'item-1':{triggerProps:{'faq-1':{type:'submit'}}}}}/>;
