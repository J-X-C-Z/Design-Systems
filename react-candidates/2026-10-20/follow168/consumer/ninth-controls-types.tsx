import * as React from 'react';
import {Dialog03,Textarea18,type Dialog03AcknowledgmentProps} from '@follow-ui/react-seven';
<Textarea18 value="brief" onChange={e=>e.currentTarget.value} name="brief" form="outside" ref={React.createRef<HTMLTextAreaElement>()}/>;
<Textarea18 defaultValue="draft" onCompositionEnd={e=>e.currentTarget.value} label={<b>Note</b>}/>;
<Dialog03 defaultOpen acknowledgment={{defaultChecked:false,name:'ack',form:'external',ref:React.createRef<HTMLInputElement>()}} onConfirm={d=>{d.acknowledged;d.localOnly;return false}}/>;
<Dialog03 open={false} onOpenChange={(v,d)=>false} acknowledgment={{checked:true,onChange:e=>e.currentTarget.checked}} dialogRef={React.createRef<HTMLDialogElement>()}/>;
// @ts-expect-error ownership exclusive
<Textarea18 value="a" defaultValue="b"/>;
// @ts-expect-error source fixed limit
<Textarea18 maxLength={100}/>;
// @ts-expect-error string ownership
<Textarea18 value={100}/>;
// @ts-expect-error no child content
<Textarea18>child</Textarea18>;
// @ts-expect-error acknowledgment ownership exclusive
<Dialog03 acknowledgment={{checked:true,defaultChecked:false}}/>;
// @ts-expect-error acknowledgment remains checkbox
<Dialog03 acknowledgment={{type:'radio'}}/>;
// @ts-expect-error open ownership exclusive
<Dialog03 open defaultOpen/>;
// @ts-expect-error confirmation synchronous
<Dialog03 onConfirm={async()=>true}/>;
