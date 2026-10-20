import React,{createRef}from'react';import {Breadcrumb06,Textarea14} from '@follow-ui/react-seven';
const good=<><Breadcrumb06 defaultOpen triggerProps={{ref:createRef<HTMLButtonElement>()}} itemProps={{Tokens:{disabled:true}}} onSelect={(option,d)=>{d.cancel();return false;}}/><Breadcrumb06 open={false} onOpenChange={(open,d)=>{d.cancel();}} ref={createRef<HTMLElement>()} linkProps={{home:{href:'#local'}}}/><Textarea14 defaultValue="draft" name="notes" form="external" ref={createRef<HTMLTextAreaElement>()}/></>;
// @ts-expect-error mutually exclusive ownership
const both=<Breadcrumb06 open defaultOpen/>;
// @ts-expect-error fixed source options
const option=<Breadcrumb06 itemProps={{Other:{disabled:true}}}/>;
// @ts-expect-error owned menu trigger type
const trigger=<Breadcrumb06 triggerProps={{type:'submit'}}/>;
// @ts-expect-error fixed source content
const child=<Breadcrumb06>replacement</Breadcrumb06>;
// @ts-expect-error menu item roving/tab behavior owned
const tab=<Breadcrumb06 itemProps={{Tokens:{tabIndex:0}}}/>;
// @ts-expect-error textarea ownership
const text=<Textarea14 value="a" defaultValue="b"/>;
// @ts-expect-error label association
const label=<Textarea14 labelProps={{htmlFor:'other'}}/>;
// @ts-expect-error textarea native ref
const ref=<Textarea14 ref={createRef<SVGSVGElement>()}/>;
void[good,both,option,trigger,child,tab,text,label,ref];
