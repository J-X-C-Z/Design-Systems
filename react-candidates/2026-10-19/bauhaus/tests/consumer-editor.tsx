import * as React from 'react';
import {Textarea03,Accordion02,BauhausSelectionScope,bauhausComponentIds} from '../src/complete.js';
const t=React.createRef<HTMLTextAreaElement>();<BauhausSelectionScope paused><Textarea03 ref={t} name="caption" defaultValue="hello" required/><Accordion02 defaultValue={['item-1']} onValueChange={(v,d)=>{v.map(String);d.cancel()}}/></BauhausSelectionScope>;const id:'textarea-03'=bauhausComponentIds[5];
// @ts-expect-error conflicting ownership
<Textarea03 value="a" defaultValue="b"/>;
// @ts-expect-error no hidden children
<Textarea03>ignored</Textarea03>;
// @ts-expect-error wrong value
<Textarea03 value={3}/>;
// @ts-expect-error wrong ref
<Textarea03 ref={React.createRef<HTMLInputElement>()}/>;
// @ts-expect-error conflicting accordion ownership
<Accordion02 value={[]} defaultValue={[]}/>;
// @ts-expect-error no hidden children
<Accordion02>ignored</Accordion02>;
// @ts-expect-error multiple array required
<Accordion02 value="item-1"/>;
// @ts-expect-error item content required
<Accordion02 items={[{value:'a',title:'A'}]}/>;
