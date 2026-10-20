import React,{createRef} from 'react';import {Pagination07,Textarea12} from '@follow-ui/react-seven';
const good=<><Pagination07 page={2} ref={createRef<HTMLElement>()} disabledLinks={['first','previous']} linkProps={{last:{href:'#3',ref:createRef<HTMLAnchorElement>(),onClick:e=>e.preventDefault()}}}/><Textarea12 disabled defaultValue="local seed" name="summary" form="outside" ref={createRef<HTMLTextAreaElement>()}/><Textarea12 value="programmatic"/></>;
// @ts-expect-error fixed disabled variant
const enabled=<Textarea12 disabled={false}/>;
// @ts-expect-error native ownership exclusive
const mixed=<Textarea12 value="a" defaultValue="b"/>;
// @ts-expect-error no field children
const child=<Textarea12>replacement</Textarea12>;
// @ts-expect-error native textarea ref
const ref=<Textarea12 ref={createRef<SVGSVGElement>()}/>;
// @ts-expect-error supported page marker1-3
const page=<Pagination07 page={4}/>;
// @ts-expect-error no invented automatic state callback
const automatic=<Pagination07 onPageChange={()=>{}}/>;
// @ts-expect-error exact link keys
const key=<Pagination07 disabledLinks={['back']}/>;
// @ts-expect-error component owns active aria-current
const aria=<Pagination07 linkProps={{'1':{'aria-current':'page'}}}/>;
void[good,enabled,mixed,child,ref,page,automatic,key,aria];
