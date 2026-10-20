import * as React from 'react';
import {Textarea08,Dialog02,type Dialog02Props} from '@follow-ui/react-seven';
<Textarea08 value="note" onChange={e=>e.currentTarget.value} name="reason" form="outside" aria-invalid="grammar" description={null} ref={React.createRef<HTMLTextAreaElement>()}/>;
<Textarea08 defaultValue="note" readOnly required={false}/>;
<Dialog02 open={false} onOpenChange={(v,d)=>{d.reason;return false}} title={<span>Read carefully</span>} description={<span>Details</span>} triggerRef={React.createRef<HTMLButtonElement>()} dialogRef={React.createRef<HTMLDialogElement>()} onConfirm={d=>d.localOnly?false:undefined}/>;
<Dialog02 defaultOpen confirmDisabled onCancel={()=>false}/>;
// @ts-expect-error textarea ownership exclusive
<Textarea08 value="x" defaultValue="y"/>;
// @ts-expect-error no children content API
<Textarea08>content</Textarea08>;
// @ts-expect-error native onChange only
<Textarea08 onValueChange={()=>{}}/>;
// @ts-expect-error dialog ownership exclusive
<Dialog02 open={false} defaultOpen/>;
// @ts-expect-error composite children not accepted
<Dialog02>children</Dialog02>;
// @ts-expect-error dialog ref native dialog
<Dialog02 dialogRef={React.createRef<HTMLInputElement>()}/>;
// @ts-expect-error synchronous confirmation return boolean or void
<Dialog02 onConfirm={async()=>true}/>;
// @ts-expect-error not a selection control
<Dialog02 checked/>;
