import * as React from 'react';
import {Breadcrumb08,Textarea16} from '@follow-ui/react-seven';
const a=<Breadcrumb08 ref={React.createRef<HTMLElement>()} linkProps={{home:{href:'#',ref:React.createRef<HTMLAnchorElement>(),onClick:e=>e.preventDefault()}}}/>;
const b=<Textarea16 value="note" onChange={e=>e.currentTarget.value} labelProps={{ref:React.createRef<HTMLLabelElement>()}} ref={React.createRef<HTMLTextAreaElement>()}/>;
const c=<Textarea16 defaultValue="draft" name="note" required form="external" label={null} aria-label="Note"/>;
// @ts-expect-error value and defaultValue are exclusive
const d=<Textarea16 value="a" defaultValue="b"/>;
// @ts-expect-error fixed breadcrumb children
const e=<Breadcrumb08>Other</Breadcrumb08>;
// @ts-expect-error native textarea children not supported
const f=<Textarea16>Other</Textarea16>;
// @ts-expect-error fixed link children
const g=<Breadcrumb08 linkProps={{home:{children:'Other'}}}/>;
// @ts-expect-error textarea ref is not SVG
const j=<Textarea16 ref={React.createRef<SVGSVGElement>()}/>;
// @ts-expect-error internal label association owned by component
const k=<Textarea16 labelProps={{htmlFor:'wrong'}}/>;
void[a,b,c,d,e,f,g,j,k];
