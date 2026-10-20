import * as React from 'react';
import {Dialog04,Textarea06} from '@follow-ui/react-seven';
<Textarea06 value="note" onChange={e=>e.currentTarget.value} name="note" form="outside" ref={React.createRef<HTMLTextAreaElement>()} label={<b>Note</b>}/>;
<Textarea06 defaultValue="draft" required maxLength={500}/>;
<Dialog04 defaultOpen scrollRef={React.createRef<HTMLDivElement>()} dialogRef={React.createRef<HTMLDialogElement>()} onReadMore={d=>{d.localOnly;d.id;}} onDismiss={d=>d.reason==='back'?false:undefined}/>;
<Dialog04 open={false} onOpenChange={(v,d)=>{d.reason;return false}} readMoreDisabled description={<section>Notes</section>}/>;
// @ts-expect-error native ownership exclusive
<Textarea06 value="a" defaultValue="b"/>;
// @ts-expect-error native textarea ref only
<Textarea06 ref={React.createRef<HTMLInputElement>()}/>;
// @ts-expect-error no children
<Textarea06>child</Textarea06>;
// @ts-expect-error no selection event
<Textarea06 onValueChange={()=>{}}/>;
// @ts-expect-error dialog ownership exclusive
<Dialog04 open defaultOpen/>;
// @ts-expect-error no confirm closes contract
<Dialog04 onConfirm={()=>{}}/>;
// @ts-expect-error synchronous dismissal veto only
<Dialog04 onDismiss={async()=>true}/>;
// @ts-expect-error scroll region native div
<Dialog04 scrollRef={React.createRef<HTMLTextAreaElement>()}/>;
