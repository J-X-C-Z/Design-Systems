import * as React from 'react';
import {Textarea03,Textarea04,Breadcrumb02,Pagination02,type BreadcrumbSegment} from '@follow-ui/react-seven';
const ref=React.createRef<HTMLTextAreaElement>();
<Textarea03 ref={ref} value="draft" onChange={e=>e.currentTarget.value} name="details" form="f" maxLength={400}/>;
<Textarea04 defaultValue="issue" required={false} disabled readOnly label="Issue" description="Describe"/>;
<Breadcrumb02 segments={[{label:'Home',href:'#home',onClick:e=>e.preventDefault()},{label:'Here',current:true}]} aria-label="Position"/>;
<Pagination02 page={2} pageCount={3} getPageHref={p=>'#p'+p} onPageChange={(p,d)=>{d.event.preventDefault();d.cancel();}}/>;
<Pagination02 defaultPage={1} disabled/>;
// @ts-expect-error native ownership is exclusive
<Textarea03 value="a" defaultValue="b"/>;
// @ts-expect-error native change API, not unrelated onValueChange
<Textarea04 onValueChange={(v:string)=>{}}/>;
// @ts-expect-error textarea children are not content API
<Textarea03>text</Textarea03>;
// @ts-expect-error current breadcrumb cannot also navigate
const invalid:BreadcrumbSegment={label:'Here',current:true,href:'#'};
// @ts-expect-error composite children not accepted
<Breadcrumb02>children</Breadcrumb02>;
// @ts-expect-error page ownership exclusive
<Pagination02 page={2} defaultPage={1}/>;
// @ts-expect-error no freeform children
<Pagination02>children</Pagination02>;
// @ts-expect-error page is numeric
<Pagination02 page="2"/>;
