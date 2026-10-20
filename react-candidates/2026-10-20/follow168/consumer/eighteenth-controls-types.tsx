import React,{createRef} from 'react';import{Textarea07,Pagination06}from'@follow-ui/react-seven';
const good=<><Textarea07 ref={createRef<HTMLTextAreaElement>()} defaultValue="idea" name="idea" form="other" labelProps={{ref:createRef<HTMLLabelElement>()}}/><Textarea07 value="owner" onChange={e=>void e.currentTarget.value}/><Pagination06 page={3} ref={createRef<HTMLElement>()} disabledLinks={['next']} linkProps={{'1':{href:'#one',ref:createRef<HTMLAnchorElement>(),onClick:e=>e.preventDefault()}}}/></>;
// @ts-expect-error native textarea mutually exclusive ownership
const mixed=<Textarea07 value="x" defaultValue="y"/>;
// @ts-expect-error no arbitrary textarea children
const child=<Textarea07>text</Textarea07>;
// @ts-expect-error id owns label association
const label=<Textarea07 labelProps={{htmlFor:'other'}}/>;
// @ts-expect-error exact original pages
const page=<Pagination06 page={4}/>;
// @ts-expect-error static default is not an uncontrolled pagination state
const defaultPage=<Pagination06 defaultPage={1}/>;
// @ts-expect-error no invented change callback
const callback=<Pagination06 onPageChange={()=>{}}/>;
// @ts-expect-error link active marker owned by page prop
const marker=<Pagination06 linkProps={{'1':{'aria-current':'page'}}}/>;
// @ts-expect-error native textarea ref rejects SVG
const ref=<Textarea07 ref={createRef<SVGSVGElement>()}/>;
void[good,mixed,child,label,page,defaultPage,callback,marker,ref];
