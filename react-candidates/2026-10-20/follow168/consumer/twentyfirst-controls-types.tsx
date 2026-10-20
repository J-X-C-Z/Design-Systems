import React,{createRef} from 'react';import {Breadcrumb05,Textarea10} from '@follow-ui/react-seven';
const good=<><Breadcrumb05 ref={createRef<HTMLElement>()} linkProps={{workspace:{href:'#local',ref:createRef<HTMLAnchorElement>(),onClick:e=>e.preventDefault()},campaigns:{target:'_self'}}}/><Textarea10 defaultValue="seed" name="message" form="external" ref={createRef<HTMLTextAreaElement>()} labelProps={{ref:createRef<HTMLLabelElement>()}}/><Textarea10 value="owned" onChange={e=>void e.target.value}/></>;
// @ts-expect-error fixed source segment labels
const navchild=<Breadcrumb05>replacement</Breadcrumb05>;
// @ts-expect-error exact link keys
const key=<Breadcrumb05 linkProps={{library:{href:'#'}}}/>;
// @ts-expect-error native links have no button disabled API
const disabled=<Breadcrumb05 linkProps={{workspace:{disabled:true}}}/>;
// @ts-expect-error nested link content fixed
const child=<Breadcrumb05 linkProps={{workspace:{children:'replace'}}}/>;
// @ts-expect-error ownership exclusive
const mixed=<Textarea10 value="a" defaultValue="b"/>;
// @ts-expect-error field children forbidden
const fieldchild=<Textarea10>replacement</Textarea10>;
// @ts-expect-error label association owned
const label=<Textarea10 labelProps={{htmlFor:'other'}}/>;
// @ts-expect-error textarea native ref
const ref=<Textarea10 ref={createRef<SVGSVGElement>()}/>;
void[good,navchild,key,disabled,child,mixed,fieldchild,label,ref];
