import React,{createRef} from 'react';import {Accordion05,Textarea09} from '@follow-ui/react-seven';
const good=<><Accordion05 defaultValue={['item-1','item-3']} triggerProps={{'item-2':{ref:createRef<HTMLButtonElement>(),disabled:true}}}/><Accordion05 value={[]} ref={createRef<HTMLDivElement>()} onValueChange={(next,d)=>{d.cancel();return false;}}/><Textarea09 ref={createRef<HTMLTextAreaElement>()} defaultValue="draft" name="draft" form="outside" labelProps={{ref:createRef<HTMLLabelElement>()}}/><Textarea09 value="owned" onChange={e=>void e.currentTarget.value}/></>;
// @ts-expect-error mutually exclusive ownership
const mix=<Accordion05 value={[]} defaultValue={[]}/>;
// @ts-expect-error fixed items
const wrong=<Accordion05 value={['item-4']}/>;
// @ts-expect-error fixed source content
const child=<Accordion05>replacement</Accordion05>;
// @ts-expect-error owned button type
const button=<Accordion05 triggerProps={{'item-1':{type:'submit'}}}/>;
// @ts-expect-error native textarea ownership exclusive
const textmix=<Textarea09 value="a" defaultValue="b"/>;
// @ts-expect-error textarea cannot have children content
const textchild=<Textarea09>replacement</Textarea09>;
// @ts-expect-error label association owned by generated/given id
const label=<Textarea09 labelProps={{htmlFor:'elsewhere'}}/>;
// @ts-expect-error native textarea ref
const ref=<Textarea09 ref={createRef<SVGSVGElement>()}/>;
void[good,mix,wrong,child,button,textmix,textchild,label,ref];
