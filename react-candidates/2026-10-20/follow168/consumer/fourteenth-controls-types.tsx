import React,{createRef} from 'react';
import {Alerts07,Alerts08} from '@follow-ui/react-seven';
const div=createRef<HTMLDivElement>(),button=createRef<HTMLButtonElement>();
const good=<><Alerts07 ref={div} defaultOpen cancelButtonProps={{ref:button,name:'action',value:'cancel',form:'local'}}/><Alerts07 open progress={50} onOpenChange={(next,details)=>{details.cancel();return false;}}/><Alerts08 defaultOpen={false} laterButtonProps={{type:'button'}} updateNowButtonProps={{onClick:e=>e.preventDefault()}}/><Alerts08 open onOpenChange={()=>false} closeButtonProps={{disabled:true}}/></>;
// @ts-expect-error mutually exclusive owner modes
const mixed=<Alerts07 open defaultOpen/>;
// @ts-expect-error root does not promise arbitrary visual children
const children=<Alerts08>replacement</Alerts08>;
// @ts-expect-error fixed source action text uses no native children override
const actionChildren=<Alerts07 cancelButtonProps={{children:'erase'}}/>;
// @ts-expect-error root ref is div, not SVG
const wrongRef=<Alerts08 ref={createRef<SVGSVGElement>()}/>;
// @ts-expect-error progress is numeric
const badProgress=<Alerts07 progress="50"/>;
// @ts-expect-error unsupported action service API
const noService=<Alerts08 onUpdate={()=>{}}/>;
// @ts-expect-error upload another remains fixed disabled, no unsafe children
const dangerous=<Alerts07 uploadAnotherButtonProps={{dangerouslySetInnerHTML:{__html:'x'}}}/>;
// @ts-expect-error progress belongs to upload variant only
const noProgress=<Alerts08 progress={20}/>;
void [good,mixed,children,actionChildren,wrongRef,badProgress,noService,dangerous,noProgress];
