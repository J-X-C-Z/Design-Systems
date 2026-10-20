import * as React from 'react';
import { Accordion08, type Accordion08Value, Accordion09, type Accordion09Value, Accordion10, type Accordion10Value, Accordion11, type Accordion11Value } from '@follow-ui/react-seven';

const items08: Accordion08Value[]=['item-1','item-3'];
const positive08=<Accordion08 value={items08} ref={node=>{node?.focus();return()=>{};}} orientation="horizontal" dir="rtl" loop={false} triggerProps={{'item-2':{disabled:true,ref:node=>{node?.focus();return()=>{};},onKeyDown:event=>event.preventDefault()}}} onValueChange={(value,details)=>{const id:'accordion-08'=details.id;const item:Accordion08Value=details.itemId;details.button.focus();details.event.preventDefault();details.cancel();return false;}}/>;
const uncontrolled08=<Accordion08 defaultValue={['item-1']} aria-label="Fixed questions" />;
// @ts-expect-error owner state and mount default are mutually exclusive
const owner08=<Accordion08 value={[]} defaultValue={[]}/>;
// @ts-expect-error no unknown item value
const item08=<Accordion08 value={['other']}/>;
// @ts-expect-error fixed content is not an item renderer
const children08=<Accordion08>replacement</Accordion08>;
// @ts-expect-error a trigger cannot become a submit button
const submit08=<Accordion08 triggerProps={{'item-1':{type:'submit'}}}/>;
// @ts-expect-error trigger value association is managed by the component
const controls08=<Accordion08 triggerProps={{'item-1':{'aria-controls':'foreign'}}}/>;

const items09: Accordion09Value[]=['item-1','item-3'];
const positive09=<Accordion09 value={items09} ref={node=>{node?.focus();return()=>{};}} orientation="horizontal" dir="rtl" loop={false} triggerProps={{'item-2':{disabled:true,ref:node=>{node?.focus();return()=>{};},onKeyDown:event=>event.preventDefault()}}} onValueChange={(value,details)=>{const id:'accordion-09'=details.id;const item:Accordion09Value=details.itemId;details.button.focus();details.event.preventDefault();details.cancel();return false;}}/>;
const uncontrolled09=<Accordion09 defaultValue={['item-1']} aria-label="Fixed questions" />;
// @ts-expect-error owner state and mount default are mutually exclusive
const owner09=<Accordion09 value={[]} defaultValue={[]}/>;
// @ts-expect-error no unknown item value
const item09=<Accordion09 value={['other']}/>;
// @ts-expect-error fixed content is not an item renderer
const children09=<Accordion09>replacement</Accordion09>;
// @ts-expect-error a trigger cannot become a submit button
const submit09=<Accordion09 triggerProps={{'item-1':{type:'submit'}}}/>;
// @ts-expect-error trigger value association is managed by the component
const controls09=<Accordion09 triggerProps={{'item-1':{'aria-controls':'foreign'}}}/>;

const items10: Accordion10Value[]=['item-1','item-3'];
const positive10=<Accordion10 value={items10} ref={node=>{node?.focus();return()=>{};}} orientation="horizontal" dir="rtl" loop={false} triggerProps={{'item-2':{disabled:true,ref:node=>{node?.focus();return()=>{};},onKeyDown:event=>event.preventDefault()}}} onValueChange={(value,details)=>{const id:'accordion-10'=details.id;const item:Accordion10Value=details.itemId;details.button.focus();details.event.preventDefault();details.cancel();return false;}}/>;
const uncontrolled10=<Accordion10 defaultValue={['item-1']} aria-label="Fixed questions" />;
// @ts-expect-error owner state and mount default are mutually exclusive
const owner10=<Accordion10 value={[]} defaultValue={[]}/>;
// @ts-expect-error no unknown item value
const item10=<Accordion10 value={['other']}/>;
// @ts-expect-error fixed content is not an item renderer
const children10=<Accordion10>replacement</Accordion10>;
// @ts-expect-error a trigger cannot become a submit button
const submit10=<Accordion10 triggerProps={{'item-1':{type:'submit'}}}/>;
// @ts-expect-error trigger value association is managed by the component
const controls10=<Accordion10 triggerProps={{'item-1':{'aria-controls':'foreign'}}}/>;

const items11: Accordion11Value[]=['item-1','item-3'];
const positive11=<Accordion11 value={items11} ref={node=>{node?.focus();return()=>{};}} orientation="horizontal" dir="rtl" loop={false} triggerProps={{'item-2':{disabled:true,ref:node=>{node?.focus();return()=>{};},onKeyDown:event=>event.preventDefault()}}} onValueChange={(value,details)=>{const id:'accordion-11'=details.id;const item:Accordion11Value=details.itemId;details.button.focus();details.event.preventDefault();details.cancel();return false;}}/>;
const uncontrolled11=<Accordion11 defaultValue={['item-1']} aria-label="Fixed questions" />;
// @ts-expect-error owner state and mount default are mutually exclusive
const owner11=<Accordion11 value={[]} defaultValue={[]}/>;
// @ts-expect-error no unknown item value
const item11=<Accordion11 value={['other']}/>;
// @ts-expect-error fixed content is not an item renderer
const children11=<Accordion11>replacement</Accordion11>;
// @ts-expect-error a trigger cannot become a submit button
const submit11=<Accordion11 triggerProps={{'item-1':{type:'submit'}}}/>;
// @ts-expect-error trigger value association is managed by the component
const controls11=<Accordion11 triggerProps={{'item-1':{'aria-controls':'foreign'}}}/>;
