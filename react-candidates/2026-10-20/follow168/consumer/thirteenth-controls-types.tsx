import * as React from 'react';
import {Textarea13,Textarea17} from '@follow-ui/react-seven';
<Textarea13 value="generated" ref={React.createRef<HTMLTextAreaElement>()} name="output" form="outside"/>;
<Textarea13 defaultValue="" readOnly={false} onChange={e=>e.currentTarget.value}/>;
<Textarea17 value="reply" onChange={e=>e.currentTarget.value} buttonLabel={<b>Post Reply</b>} buttonProps={{ref:React.createRef<HTMLButtonElement>(),name:'action',value:'post',onClick:e=>e.preventDefault(),form:'outside'}}/>;
<Textarea17 defaultValue="note" buttonProps={{type:'reset',disabled:true}}/>;
// @ts-expect-error generated ownership exclusive
<Textarea13 value="a" defaultValue="b"/>;
// @ts-expect-error reply ownership exclusive
<Textarea17 value="a" defaultValue="b"/>;
// @ts-expect-error no children content
<Textarea13>child</Textarea13>;
// @ts-expect-error reply native ref textarea
<Textarea17 ref={React.createRef<SVGSVGElement>()}/>;
// @ts-expect-error button native ref
<Textarea17 buttonProps={{ref:React.createRef<HTMLTextAreaElement>()}}/>;
// @ts-expect-error source button label separate
<Textarea17 buttonProps={{children:'child'}}/>;
// @ts-expect-error button type exact native enumeration
<Textarea17 buttonProps={{type:'post'}}/>;
// @ts-expect-error no invented reply service event
<Textarea17 onPostReply={()=>{}}/>;
