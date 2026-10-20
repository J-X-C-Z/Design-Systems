import * as React from 'react';
import {Checkbox05,Switch05,CelSelectionScope,celSelectionIds, type CheckedChangeDetails} from './declarations/index.js';
const ref=React.createRef<HTMLInputElement>();
const yes=<CelSelectionScope mode="light" paused><Checkbox05 items={{default:{checked:true,ref,name:'a',label:'小',description:'说明',onCheckedChange:(v:boolean,d:CheckedChangeDetails)=>d.cancel()},medium:{defaultChecked:false,defaultIndeterminate:true},large:{indeterminate:true,checked:false}}}/><Switch05 items={{info:{size:'sm',checked:true,ref},success:{defaultChecked:false,form:'f'}}}/></CelSelectionScope>;
const ids:readonly ['checkbox-05','switch-05','checkbox-06','switch-06']=celSelectionIds;
// @ts-expect-error forbidden group children
const bad1=<Checkbox05>hidden</Checkbox05>;
// @ts-expect-error forbidden group children
const bad2=<Switch05>hidden</Switch05>;
// @ts-expect-error exclusive ownership
const bad3=<Checkbox05 items={{default:{checked:true,defaultChecked:false}}}/>;
// @ts-expect-error mixed ownership exclusive
const bad4=<Checkbox05 items={{medium:{indeterminate:true,defaultIndeterminate:true}}}/>;
// @ts-expect-error no mixed switch
const bad5=<Switch05 items={{info:{indeterminate:true}}}/>;
// @ts-expect-error source fixed sizes
const bad6=<Checkbox05 items={{default:{size:'sm'}}}/>;
// @ts-expect-error no native onChange
const bad7=<Switch05 items={{info:{onChange:()=>{}}}}/>;
// @ts-expect-error invalid tone
const bad8=<Switch05 items={{purple:{checked:true}}}/>;
// @ts-expect-error invalid checkbox key
const bad9=<Checkbox05 items={{small:{checked:true}}}/>;
// @ts-expect-error input ref
const bad10=<Checkbox05 items={{default:{ref:React.createRef<HTMLDivElement>()}}}/>;
void [yes,ids,bad1,bad2,bad3,bad4,bad5,bad6,bad7,bad8,bad9,bad10];
