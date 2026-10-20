import * as React from 'react';
import {Tabs06,Tabs07,Tabs08,Tabs09,type Tabs06Value,type Tabs07TooltipChangeDetails} from '@follow-ui/react-seven';
const div=React.createRef<HTMLDivElement>(),button=React.createRef<HTMLButtonElement>();
export const valid=<><Tabs06 value="bounce" onValueChange={(v,d)=>{const id:'tabs-06'=d.id;const prior:Tabs06Value|null=d.previousValue;d.button.focus();d.cancel();return false;}} ref={div} listProps={{ref:div,'aria-labelledby':'heading'}} triggerProps={{conversions:{ref:button,disabled:true,onClick:e=>e.preventDefault()}}} panelProps={{bounce:{ref:div,onFocus:e=>e.currentTarget.focus()}}}/><Tabs07 defaultValue={null} activationMode="manual" orientation="vertical" dir="rtl" loop={false} tooltipProps={{defaultValue:'identity',delayDuration:120,onValueChange:(v,d)=>{const id:'tabs-07'=d.id;const e:Tabs07TooltipChangeDetails=d;d.cancel();return false;}}}/><Tabs08 value="design"/><Tabs09 defaultValue="ultimate" label="Plan"/></>;
// @ts-expect-error exact06 value
const e01=<Tabs06 value="bounce-rate"/>;
// @ts-expect-error exact07 value
const e02=<Tabs07 value="conversions"/>;
// @ts-expect-error exact08 value
const e03=<Tabs08 value="home"/>;
// @ts-expect-error exact09 value
const e04=<Tabs09 value="design"/>;
// @ts-expect-error exclusive scalar owner
const e05=<Tabs06 value="bounce" defaultValue="conversions"/>;
// @ts-expect-error exclusive scalar owner
const e06=<Tabs07 value={null} defaultValue={null}/>;
// @ts-expect-error exclusive scalar owner
const e07=<Tabs08 value="design" defaultValue="animate"/>;
// @ts-expect-error exclusive scalar owner
const e08=<Tabs09 value="standard" defaultValue="ultimate"/>;
// @ts-expect-error fixed root children
const e09=<Tabs06>replace</Tabs06>;
// @ts-expect-error fixed root HTML
const e10=<Tabs07 dangerouslySetInnerHTML={{__html:'bad'}}/>;
// @ts-expect-error invalid activation mode
const e11=<Tabs08 activationMode="click"/>;
// @ts-expect-error invalid orientation
const e12=<Tabs09 orientation="diagonal"/>;
// @ts-expect-error invalid direction
const e13=<Tabs06 dir="auto"/>;
// @ts-expect-error boolean loop
const e14=<Tabs07 loop="yes"/>;
// @ts-expect-error wrong trigger key
const e15=<Tabs06 triggerProps={{home:{}}}/>;
// @ts-expect-error fixed trigger content
const e16=<Tabs07 triggerProps={{home:{children:'bad'}}}/>;
// @ts-expect-error protected trigger type
const e17=<Tabs08 triggerProps={{design:{type:'submit'}}}/>;
// @ts-expect-error protected trigger ID
const e18=<Tabs09 triggerProps={{standard:{id:'bad'}}}/>;
// @ts-expect-error protected trigger selected
const e19=<Tabs06 triggerProps={{bounce:{'aria-selected':false}}}/>;
// @ts-expect-error protected trigger association
const e20=<Tabs07 triggerProps={{home:{'aria-controls':'bad'}}}/>;
// @ts-expect-error protected tab stop
const e21=<Tabs08 triggerProps={{design:{tabIndex:3}}}/>;
// @ts-expect-error protected trigger role
const e22=<Tabs09 triggerProps={{ultimate:{role:'button'}}}/>;
// @ts-expect-error fixed panel content
const e23=<Tabs06 panelProps={{bounce:{children:'bad'}}}/>;
// @ts-expect-error protected panel hidden
const e24=<Tabs07 panelProps={{home:{hidden:false}}}/>;
// @ts-expect-error protected panel association
const e25=<Tabs08 panelProps={{animate:{'aria-labelledby':'bad'}}}/>;
// @ts-expect-error protected panel role
const e26=<Tabs09 panelProps={{standard:{role:'main'}}}/>;
// @ts-expect-error protected list content
const e27=<Tabs06 listProps={{children:'bad'}}/>;
// @ts-expect-error protected list role
const e28=<Tabs07 listProps={{role:'navigation'}}/>;
// @ts-expect-error protected list orientation
const e29=<Tabs08 listProps={{'aria-orientation':'vertical'}}/>;
// @ts-expect-error list label is dedicated root API
const e30=<Tabs09 listProps={{'aria-label':'bad'}}/>;
// @ts-expect-error tooltip only07
const e31=<Tabs06 tooltipProps={{value:'conversions'}}/>;
// @ts-expect-error tooltip only07
const e32=<Tabs08 tooltipProps={{value:'design'}}/>;
// @ts-expect-error tooltip only07
const e33=<Tabs09 tooltipProps={{value:'standard'}}/>;
// @ts-expect-error tooltip owner exclusivity
const e34=<Tabs07 tooltipProps={{value:'home',defaultValue:'identity'}}/>;
// @ts-expect-error exact tooltip value
const e35=<Tabs07 tooltipProps={{value:'bad'}}/>;
// @ts-expect-error finite numeric delay
const e36=<Tabs07 tooltipProps={{delayDuration:'100'}}/>;
// @ts-expect-error root div ref
const e37=<Tabs07 ref={button}/>;
// @ts-expect-error trigger button ref
const e38=<Tabs06 triggerProps={{conversions:{ref:div}}}/>;
// @ts-expect-error panel div ref
const e39=<Tabs09 panelProps={{premium:{ref:button}}}/>;
// @ts-expect-error list div ref
const e40=<Tabs08 listProps={{ref:button}}/>;
