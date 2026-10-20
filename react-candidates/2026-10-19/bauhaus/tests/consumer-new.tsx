import * as React from 'react';
import {Checkbox04,Switch02,BauhausSelectionScope} from '../src/index.js';
const valid=<BauhausSelectionScope><Checkbox04 ref={React.createRef<HTMLInputElement>()} name="task" onCheckedChange={(v,d)=>{if(!v)d.cancel()}}/><Switch02 size="sm" checked={false} readOnly label="Square"/></BauhausSelectionScope>;
// @ts-expect-error checked/default conflict
const a=<Checkbox04 checked defaultChecked/>;
// @ts-expect-error source04 boolean no mixed
const b=<Checkbox04 indeterminate/>;
// @ts-expect-error fixed role
const c=<Switch02 role="button"/>;
// @ts-expect-error ignored children forbidden
const d=<Switch02>ignored</Switch02>;
// @ts-expect-error source04 children forbidden
const e=<Checkbox04>ignored</Checkbox04>;
// @ts-expect-error callback contract
const f=<Checkbox04 onChange={()=>{}}/>;
// @ts-expect-error valid sizes only
const g=<Switch02 size="lg"/>;
export {valid,a,b,c,d,e,f,g};
