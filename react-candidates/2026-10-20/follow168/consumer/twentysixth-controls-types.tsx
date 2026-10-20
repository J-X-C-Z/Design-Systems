import * as React from 'react';
import {Accordion06,Textarea20, type Accordion06ChangeDetails, type Accordion06Value} from '@follow-ui/react-seven';
const a=<Accordion06 defaultValue={['item-1','item-3']} triggerProps={{'item-2':{disabled:true,ref:React.createRef<HTMLButtonElement>()}}} ref={React.createRef<HTMLDivElement>()} onValueChange={(v:Accordion06Value[],d:Accordion06ChangeDetails)=>{d.event.nativeEvent.preventDefault(); return false;}}/>;
const b=<Accordion06 value={[]} orientation="horizontal" dir="rtl" loop={false}/>;
const c=<Textarea20 value="brief" onChange={e=>e.currentTarget.value} labelProps={{ref:React.createRef<HTMLLabelElement>()}} ref={React.createRef<HTMLTextAreaElement>()}/>;
const d=<Textarea20 defaultValue="draft" name="details" required form="external" label={null} aria-label="Brief" aria-describedby="extra"/>;
// @ts-expect-error owned and default are mutually exclusive
const e=<Accordion06 value={[]} defaultValue={['item-1']}/>;
// @ts-expect-error unknown item
const f=<Accordion06 value={['item-4']}/>;
// @ts-expect-error fixed canonical content
const g=<Accordion06>other</Accordion06>;
// @ts-expect-error semantic trigger type owned
const j=<Accordion06 triggerProps={{'item-1':{type:'submit'}}}/>;
// @ts-expect-error textarea exclusive ownership
const k=<Textarea20 value="a" defaultValue="b"/>;
// @ts-expect-error label association owned
const l=<Textarea20 labelProps={{htmlFor:'wrong'}}/>;
// @ts-expect-error native ref cannot be SVG
const m=<Textarea20 ref={React.createRef<SVGSVGElement>()}/>;
// @ts-expect-error native textarea cannot replace fixed children
const n=<Textarea20>other</Textarea20>;
void[a,b,c,d,e,f,g,j,k,l,m,n];
