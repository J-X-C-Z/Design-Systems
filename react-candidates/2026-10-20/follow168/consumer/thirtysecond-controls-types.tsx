import * as React from 'react';
import {Tabs14,Tabs15,Tabs16,Tabs17,type Tabs14Value,type Tabs15Value,type Tabs16Value,type Tabs17Value} from '@follow-ui/react-seven';
const div=React.createRef<HTMLDivElement>(),button=React.createRef<HTMLButtonElement>();
export const valid10=<><Tabs14 value="home" onValueChange={(v,d)=>{const id:'tabs-14'=d.id;const prior:Tabs14Value|null=d.previousValue;const reason:'click'|'focus'|'keyboard'=d.reason;d.button.focus();d.cancel();return false;}} ref={div} listProps={{ref:div,'aria-labelledby':'heading'}} triggerProps={{electronics:{ref:button,disabled:true,onClick:e=>e.preventDefault()}}} panelProps={{home:{ref:div,onFocus:e=>e.currentTarget.focus()}}}/><Tabs14 defaultValue={null} activationMode="manual" orientation="vertical" dir="rtl" loop={false}/><Tabs14 defaultValue="apparel"/></>;
// @ts-expect-error Tabs14 exact value
const invalid1=<Tabs14 value="wrong"/>;
// @ts-expect-error Tabs14 exact default
const invalid2=<Tabs14 defaultValue="wrong"/>;
// @ts-expect-error Tabs14 exclusive owner
const invalid3=<Tabs14 value="electronics" defaultValue="apparel"/>;
// @ts-expect-error Tabs14 wrong value kind
const invalid4=<Tabs14 value={[]}/>;
// @ts-expect-error Tabs14 no invented tooltip
const invalid5=<Tabs14 tooltipProps={{value:null}}/>;
// @ts-expect-error Tabs14 no root replacement
const invalid6=<Tabs14 children="bad"/>;
// @ts-expect-error Tabs14 root ref kind
const invalid7=<Tabs14 ref={button}/>;
// @ts-expect-error Tabs14 trigger key
const invalid8=<Tabs14 triggerProps={{wrong:{}}}/>;
// @ts-expect-error Tabs14 trigger role
const invalid9=<Tabs14 triggerProps={{electronics:{role:"button"}}}/>;
// @ts-expect-error Tabs14 trigger ID
const invalid10=<Tabs14 triggerProps={{apparel:{id:"bad"}}}/>;
// @ts-expect-error Tabs14 panel visibility
const invalid11=<Tabs14 panelProps={{home:{hidden:false}}}/>;
// @ts-expect-error Tabs14 panel key
const invalid12=<Tabs14 panelProps={{wrong:{}}}/>;
export const valid11=<><Tabs15 value="industrial" onValueChange={(v,d)=>{const id:'tabs-15'=d.id;const prior:Tabs15Value|null=d.previousValue;const reason:'click'|'focus'|'keyboard'=d.reason;d.button.focus();d.cancel();return false;}} ref={div} listProps={{ref:div,'aria-labelledby':'heading'}} triggerProps={{residential:{ref:button,disabled:true,onClick:e=>e.preventDefault()}}} panelProps={{industrial:{ref:div,onFocus:e=>e.currentTarget.focus()}}}/><Tabs15 defaultValue={null} activationMode="manual" orientation="vertical" dir="rtl" loop={false}/><Tabs15 defaultValue="commercial"/></>;
// @ts-expect-error Tabs15 exact value
const invalid13=<Tabs15 value="wrong"/>;
// @ts-expect-error Tabs15 exact default
const invalid14=<Tabs15 defaultValue="wrong"/>;
// @ts-expect-error Tabs15 exclusive owner
const invalid15=<Tabs15 value="residential" defaultValue="commercial"/>;
// @ts-expect-error Tabs15 wrong value kind
const invalid16=<Tabs15 value={[]}/>;
// @ts-expect-error Tabs15 no invented tooltip
const invalid17=<Tabs15 tooltipProps={{value:null}}/>;
// @ts-expect-error Tabs15 no root replacement
const invalid18=<Tabs15 children="bad"/>;
// @ts-expect-error Tabs15 root ref kind
const invalid19=<Tabs15 ref={button}/>;
// @ts-expect-error Tabs15 trigger key
const invalid20=<Tabs15 triggerProps={{wrong:{}}}/>;
// @ts-expect-error Tabs15 trigger role
const invalid21=<Tabs15 triggerProps={{residential:{role:"button"}}}/>;
// @ts-expect-error Tabs15 trigger ID
const invalid22=<Tabs15 triggerProps={{commercial:{id:"bad"}}}/>;
// @ts-expect-error Tabs15 panel visibility
const invalid23=<Tabs15 panelProps={{industrial:{hidden:false}}}/>;
// @ts-expect-error Tabs15 panel key
const invalid24=<Tabs15 panelProps={{wrong:{}}}/>;
export const valid12=<><Tabs16 value="database" onValueChange={(v,d)=>{const id:'tabs-16'=d.id;const prior:Tabs16Value|null=d.previousValue;const reason:'click'|'focus'|'keyboard'=d.reason;d.button.focus();d.cancel();return false;}} ref={div} listProps={{ref:div,'aria-labelledby':'heading'}} triggerProps={{compute:{ref:button,disabled:true,onClick:e=>e.preventDefault()}}} panelProps={{database:{ref:div,onFocus:e=>e.currentTarget.focus()}}}/><Tabs16 defaultValue={null} activationMode="manual" orientation="vertical" dir="rtl" loop={false}/><Tabs16 defaultValue="storage"/></>;
// @ts-expect-error Tabs16 exact value
const invalid25=<Tabs16 value="wrong"/>;
// @ts-expect-error Tabs16 exact default
const invalid26=<Tabs16 defaultValue="wrong"/>;
// @ts-expect-error Tabs16 exclusive owner
const invalid27=<Tabs16 value="compute" defaultValue="storage"/>;
// @ts-expect-error Tabs16 wrong value kind
const invalid28=<Tabs16 value={[]}/>;
// @ts-expect-error Tabs16 no invented tooltip
const invalid29=<Tabs16 tooltipProps={{value:null}}/>;
// @ts-expect-error Tabs16 no root replacement
const invalid30=<Tabs16 children="bad"/>;
// @ts-expect-error Tabs16 root ref kind
const invalid31=<Tabs16 ref={button}/>;
// @ts-expect-error Tabs16 trigger key
const invalid32=<Tabs16 triggerProps={{wrong:{}}}/>;
// @ts-expect-error Tabs16 trigger role
const invalid33=<Tabs16 triggerProps={{compute:{role:"button"}}}/>;
// @ts-expect-error Tabs16 trigger ID
const invalid34=<Tabs16 triggerProps={{storage:{id:"bad"}}}/>;
// @ts-expect-error Tabs16 panel visibility
const invalid35=<Tabs16 panelProps={{database:{hidden:false}}}/>;
// @ts-expect-error Tabs16 panel key
const invalid36=<Tabs16 panelProps={{wrong:{}}}/>;
export const valid13=<><Tabs17 value="nutrition" onValueChange={(v,d)=>{const id:'tabs-17'=d.id;const prior:Tabs17Value|null=d.previousValue;const reason:'click'|'focus'|'keyboard'=d.reason;d.button.focus();d.cancel();return false;}} ref={div} listProps={{ref:div,'aria-labelledby':'heading'}} triggerProps={{telehealth:{ref:button,disabled:true,onClick:e=>e.preventDefault()}}} panelProps={{nutrition:{ref:div,onFocus:e=>e.currentTarget.focus()}}}/><Tabs17 defaultValue={null} activationMode="manual" orientation="vertical" dir="rtl" loop={false}/><Tabs17 defaultValue="therapy"/></>;
// @ts-expect-error Tabs17 exact value
const invalid37=<Tabs17 value="wrong"/>;
// @ts-expect-error Tabs17 exact default
const invalid38=<Tabs17 defaultValue="wrong"/>;
// @ts-expect-error Tabs17 exclusive owner
const invalid39=<Tabs17 value="telehealth" defaultValue="therapy"/>;
// @ts-expect-error Tabs17 wrong value kind
const invalid40=<Tabs17 value={[]}/>;
// @ts-expect-error Tabs17 no invented tooltip
const invalid41=<Tabs17 tooltipProps={{value:null}}/>;
// @ts-expect-error Tabs17 no root replacement
const invalid42=<Tabs17 children="bad"/>;
// @ts-expect-error Tabs17 root ref kind
const invalid43=<Tabs17 ref={button}/>;
// @ts-expect-error Tabs17 trigger key
const invalid44=<Tabs17 triggerProps={{wrong:{}}}/>;
// @ts-expect-error Tabs17 trigger role
const invalid45=<Tabs17 triggerProps={{telehealth:{role:"button"}}}/>;
// @ts-expect-error Tabs17 trigger ID
const invalid46=<Tabs17 triggerProps={{therapy:{id:"bad"}}}/>;
// @ts-expect-error Tabs17 panel visibility
const invalid47=<Tabs17 panelProps={{nutrition:{hidden:false}}}/>;
// @ts-expect-error Tabs17 panel key
const invalid48=<Tabs17 panelProps={{wrong:{}}}/>;
// @ts-expect-error navigation mode
const invalid49=<Tabs14 activationMode="click"/>;
// @ts-expect-error orientation
const invalid50=<Tabs14 orientation="diagonal"/>;
// @ts-expect-error direction
const invalid51=<Tabs14 dir="auto"/>;
// @ts-expect-error boolean loop
const invalid52=<Tabs14 loop="yes"/>;
// @ts-expect-error list role
const invalid53=<Tabs14 listProps={{role:"navigation"}}/>;
// @ts-expect-error list orientation
const invalid54=<Tabs14 listProps={{"aria-orientation":"vertical"}}/>;
// @ts-expect-error list label
const invalid55=<Tabs14 listProps={{"aria-label":"bad"}}/>;
// @ts-expect-error trigger ref
const invalid56=<Tabs14 triggerProps={{electronics:{ref:div}}}/>;
// @ts-expect-error panel ref
const invalid57=<Tabs14 panelProps={{apparel:{ref:button}}}/>;
// @ts-expect-error root HTML
const invalid58=<Tabs14 dangerouslySetInnerHTML={{__html:"bad"}}/>;
// @ts-expect-error callback exact domain
const invalid59=<Tabs14 onValueChange={(v:"wrong")=>false}/>;

export const actions=<><Tabs16 onAction={(action,d)=>{const a:'deploy'=action;const id:'tabs-16'=d.id;const value:'compute'|'storage'|'database'=d.value;const e:React.MouseEvent<HTMLButtonElement>=d.event;d.button.focus();}} actionProps={{compute:{deploy:{ref:button,'aria-label':'Deploy example',onClick:e=>e.preventDefault(),disabled:true}}}}/><Tabs17 onAction={(action,d)=>{const a:'book'|'profile'=action;const id:'tabs-17'=d.id;const v:'telehealth'|'therapy'|'nutrition'=d.value;}} actionProps={{nutrition:{book:{ref:button},profile:{title:'Local example'}}}}/></>;
// @ts-expect-error precise action/ID contract 60
const invalid60=<Tabs14 onAction={()=>{}}/>;
// @ts-expect-error precise action/ID contract 61
const invalid61=<Tabs15 actionProps={{residential:{deploy:{}}}}/>;
// @ts-expect-error precise action/ID contract 62
const invalid62=<Tabs16 onAction={(a:"book")=>{}}/>;
// @ts-expect-error precise action/ID contract 63
const invalid63=<Tabs17 onAction={(a:"deploy")=>{}}/>;
// @ts-expect-error precise action/ID contract 64
const invalid64=<Tabs16 actionProps={{wrong:{deploy:{}}}}/>;
// @ts-expect-error precise action/ID contract 65
const invalid65=<Tabs16 actionProps={{compute:{book:{}}}}/>;
// @ts-expect-error precise action/ID contract 66
const invalid66=<Tabs17 actionProps={{therapy:{deploy:{}}}}/>;
// @ts-expect-error precise action/ID contract 67
const invalid67=<Tabs16 actionProps={{compute:{deploy:{type:"submit"}}}}/>;
// @ts-expect-error precise action/ID contract 68
const invalid68=<Tabs17 actionProps={{therapy:{book:{children:"Bad"}}}}/>;
// @ts-expect-error precise action/ID contract 69
const invalid69=<Tabs17 actionProps={{nutrition:{profile:{id:"bad"}}}}/>;
// @ts-expect-error precise action/ID contract 70
const invalid70=<Tabs16 actionProps={{database:{deploy:{role:"link"}}}}/>;
// @ts-expect-error precise action/ID contract 71
const invalid71=<Tabs17 actionProps={{nutrition:{book:{ref:div}}}}/>;
// @ts-expect-error precise action/ID contract 72
const invalid72=<Tabs16 onAction={(a,d)=>d.cancel()}/>;
// @ts-expect-error precise action/ID contract 73
const invalid73=<Tabs14 value="compute"/>;
// @ts-expect-error precise action/ID contract 74
const invalid74=<Tabs15 value="telehealth"/>;
