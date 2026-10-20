import React,{createRef} from 'react';import {Accordion04,Textarea05} from '@follow-ui/react-seven';
const good=<><Accordion04 defaultValue={['item-1','item-3']} triggerProps={{'item-2':{ref:createRef<HTMLButtonElement>(),disabled:true}}}/><Accordion04 value={[]} ref={createRef<HTMLDivElement>()} onValueChange={(next,d)=>{d.cancel();return false;}}/><Textarea05 ref={createRef<HTMLTextAreaElement>()} defaultValue="draft" name="draft" form="outside" labelProps={{ref:createRef<HTMLLabelElement>()}}/><Textarea05 value="owned" onChange={e=>void e.currentTarget.value}/></>;
// @ts-expect-error mutually exclusive ownership
const mix=<Accordion04 value={[]} defaultValue={[]}/>;
// @ts-expect-error fixed items
const wrong=<Accordion04 value={['item-4']}/>;
// @ts-expect-error fixed source content
const child=<Accordion04>replacement</Accordion04>;
// @ts-expect-error owned button type
const button=<Accordion04 triggerProps={{'item-1':{type:'submit'}}}/>;
// @ts-expect-error native textarea ownership exclusive
const textmix=<Textarea05 value="a" defaultValue="b"/>;
// @ts-expect-error textarea cannot have children content
const textchild=<Textarea05>replacement</Textarea05>;
// @ts-expect-error label association owned by generated/given id
const label=<Textarea05 labelProps={{htmlFor:'elsewhere'}}/>;
// @ts-expect-error native textarea ref
const ref=<Textarea05 ref={createRef<SVGSVGElement>()}/>;
void[good,mix,wrong,child,button,textmix,textchild,label,ref];
