import * as React from 'react';
import {Textarea02,Accordion02,FlatVectorSelectionScope,flatvectorComponentIds} from '../src/complete.js';
const t=React.createRef<HTMLTextAreaElement>();<FlatVectorSelectionScope paused><Textarea02 ref={t} name="caption" defaultValue="hello" required/><Accordion02 defaultValue={['item-1']} onValueChange={(v,d)=>{v.map(String);d.cancel()}}/></FlatVectorSelectionScope>;const id:'textarea-02'=flatvectorComponentIds[5];
// @ts-expect-error conflicting ownership
<Textarea02 value="a" defaultValue="b"/>;
// @ts-expect-error no hidden children
<Textarea02>ignored</Textarea02>;
// @ts-expect-error wrong value
<Textarea02 value={3}/>;
// @ts-expect-error wrong ref
<Textarea02 ref={React.createRef<HTMLInputElement>()}/>;
// @ts-expect-error conflicting accordion ownership
<Accordion02 value={[]} defaultValue={[]}/>;
// @ts-expect-error no hidden children
<Accordion02>ignored</Accordion02>;
// @ts-expect-error multiple array required
<Accordion02 value="item-1"/>;
// @ts-expect-error item content required
<Accordion02 items={[{value:'a',title:'A'}]}/>;
