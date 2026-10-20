import React,{createRef} from 'react';
import {RadioGroup02,Collapsible02} from '@follow-ui/react-seven';
const group=createRef<HTMLDivElement>(),input=createRef<HTMLInputElement>(),button=createRef<HTMLButtonElement>();
const good=<><RadioGroup02 ref={group} defaultValue="monthly" name="plan" form="outside" required itemProps={{yearly:{ref:input,disabled:true}}}/><RadioGroup02 value={null} onValueChange={(next,details)=>{details.cancel();return false;}}/><Collapsible02 ref={group} defaultExpanded={['src']} triggerProps={{src:{ref:button,onClick:e=>e.preventDefault()}}}/><Collapsible02 expanded={['src','src/sections']} onExpandedChange={(next,details)=>details.cancel()}/></>;
// @ts-expect-error mutually exclusive radio ownership
const mixedRadio=<RadioGroup02 value="monthly" defaultValue="yearly"/>;
// @ts-expect-error fixed source options
const invalidValue=<RadioGroup02 value="weekly"/>;
// @ts-expect-error fixed label structure has no root children
const child=<RadioGroup02>anything</RadioGroup02>;
// @ts-expect-error individual input cannot override group name
const inputName=<RadioGroup02 itemProps={{monthly:{name:'other'}}}/>;
// @ts-expect-error mutually exclusive tree ownership
const mixedTree=<Collapsible02 expanded={[]} defaultExpanded={['src']}/>;
// @ts-expect-error stable exact folders only
const wrongFolder=<Collapsible02 expanded={['unknown']}/>;
// @ts-expect-error root is div not SVG
const wrongRef=<Collapsible02 ref={createRef<SVGSVGElement>()}/>;
// @ts-expect-error files and folders are fixed source content
const unsafe=<Collapsible02 dangerouslySetInnerHTML={{__html:'x'}}/>;
void [good,mixedRadio,invalidValue,child,inputName,mixedTree,wrongFolder,wrongRef,unsafe];
