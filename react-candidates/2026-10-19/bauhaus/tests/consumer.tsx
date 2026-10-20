import * as React from 'react';
import {Checkbox03,Switch03,BauhausSelectionScope,bauhausSelectionIds} from '../src/index.js';
const ref=React.createRef<HTMLInputElement>();
const valid=<BauhausSelectionScope paused><Checkbox03 ref={ref} checked={false} onCheckedChange={(v,d)=>d.cancel()}/><Switch03 items={{success:{checked:true,ref},warning:{defaultChecked:false,name:'warning'}}}/></BauhausSelectionScope>;
// @ts-expect-error checked ownership conflict
const a=<Checkbox03 checked defaultChecked/>;
// @ts-expect-error indeterminate ownership conflict
const b=<Checkbox03 indeterminate defaultIndeterminate/>;
// @ts-expect-error native change intentionally excluded
const c=<Checkbox03 onChange={()=>{}}/>;
// @ts-expect-error semantic role fixed
const d=<Checkbox03 role="button"/>;
// @ts-expect-error four exact tone keys
const e=<Switch03 items={{green:{checked:true}}}/>;
// @ts-expect-error switches cannot be mixed
const f=<Switch03 items={{info:{indeterminate:true}}}/>;
// @ts-expect-error ID tuple exact
const id:typeof bauhausSelectionIds[number]='checkbox-02';
void[valid,a,b,c,d,e,f,id];

// @ts-expect-error composite does not accept discarded children
const children=<Switch03>ignored</Switch03>;
