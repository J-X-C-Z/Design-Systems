import React,{createRef}from'react';import{Tabs05,Alerts10}from'@follow-ui/react-seven';
const good=<><Tabs05 defaultValue="profile" triggerProps={{security:{ref:createRef<HTMLButtonElement>(),disabled:true}}}/><Tabs05 value={null} onValueChange={(next,d)=>{d.cancel();return false;}}/><Alerts10 open={true} ref={createRef<HTMLDivElement>()} onOpenChange={(open,d)=>{d.cancel();return false;}} closeButtonProps={{type:'button',name:'action',value:'close',ref:createRef<HTMLButtonElement>()}}/><Alerts10 defaultOpen={false}/></>;
// @ts-expect-error exact original tabs
const tab=<Tabs05 value="settings"/>;
// @ts-expect-error mutually exclusive ownership
const mixed=<Tabs05 value="profile" defaultValue="security"/>;
// @ts-expect-error fixed tab content
const child=<Tabs05>replacement</Tabs05>;
// @ts-expect-error owned tab button type
const type=<Tabs05 triggerProps={{profile:{type:'submit'}}}/>;
// @ts-expect-error mutually exclusive alert ownership
const alert=<Alerts10 open defaultOpen/>;
// @ts-expect-error fixed source alert text
const text=<Alerts10>replacement</Alerts10>;
// @ts-expect-error fixed close content
const close=<Alerts10 closeButtonProps={{children:'different'}}/>;
// @ts-expect-error div not SVG root
const ref=<Alerts10 ref={createRef<SVGSVGElement>()}/>;
void[good,tab,mixed,child,type,alert,text,close,ref];
