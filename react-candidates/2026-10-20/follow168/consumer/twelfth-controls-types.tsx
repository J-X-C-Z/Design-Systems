import * as React from 'react';
import {Textarea11,Pagination05} from '@follow-ui/react-seven';
<Textarea11 value="summary" onChange={e=>e.currentTarget.value} form="outside" name="summary" ref={React.createRef<HTMLTextAreaElement>()}/>;
<Textarea11 defaultValue="summary" label={<b>Project summary</b>} placeholder=" " required maxLength={300}/>;
<Pagination05 page={2} onPageChange={(p,d)=>{d.previousPage;d.cancel();}} getPageHref={(p,kind)=>'#'+kind+p} ref={React.createRef<HTMLElement>()}/>;
<Pagination05 defaultPage={2} pageCount={3} disabled/>;
// @ts-expect-error exclusive textarea ownership
<Textarea11 value="a" defaultValue="b"/>;
// @ts-expect-error no children
<Textarea11>child</Textarea11>;
// @ts-expect-error native textarea ref
<Textarea11 ref={React.createRef<SVGSVGElement>()}/>;
// @ts-expect-error no abstract value event
<Textarea11 onValueChange={()=>{}}/>;
// @ts-expect-error exclusive pagination owner
<Pagination05 page={2} defaultPage={1}/>;
// @ts-expect-error numeric page
<Pagination05 page="2"/>;
// @ts-expect-error no children
<Pagination05>child</Pagination05>;
// @ts-expect-error href must string
<Pagination05 getPageHref={()=>42}/>;
