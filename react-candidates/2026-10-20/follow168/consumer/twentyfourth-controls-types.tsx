import React,{createRef}from'react';import {Breadcrumb07,Textarea15} from '@follow-ui/react-seven';
const good=<><Breadcrumb07 defaultOpen triggerProps={{ref:createRef<HTMLButtonElement>()}} itemProps={{Updates:{disabled:true}}} onSelect={(option,d)=>{d.cancel();return false;}}/><Breadcrumb07 open={false} onOpenChange={(open,d)=>{d.cancel();}} ref={createRef<HTMLElement>()} linkProps={{home:{href:'#local'}}}/><Textarea15 defaultValue="draft" name="notes" form="external" ref={createRef<HTMLTextAreaElement>()}/></>;
// @ts-expect-error mutually exclusive ownership
const both=<Breadcrumb07 open defaultOpen/>;
// @ts-expect-error fixed source options
const option=<Breadcrumb07 itemProps={{Other:{disabled:true}}}/>;
// @ts-expect-error owned menu trigger type
const trigger=<Breadcrumb07 triggerProps={{type:'submit'}}/>;
// @ts-expect-error fixed source content
const child=<Breadcrumb07>replacement</Breadcrumb07>;
// @ts-expect-error menu item roving/tab behavior owned
const tab=<Breadcrumb07 itemProps={{Updates:{tabIndex:0}}}/>;
// @ts-expect-error textarea ownership
const text=<Textarea15 value="a" defaultValue="b"/>;
// @ts-expect-error label association
const label=<Textarea15 labelProps={{htmlFor:'other'}}/>;
// @ts-expect-error textarea native ref
const ref=<Textarea15 ref={createRef<SVGSVGElement>()}/>;
void[good,both,option,trigger,child,tab,text,label,ref];
