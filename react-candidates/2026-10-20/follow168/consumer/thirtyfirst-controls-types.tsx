import * as React from 'react';
import {Tabs10,Tabs11,Tabs12,Tabs13,type Tabs10Value,type Tabs11Value,type Tabs12Value,type Tabs13Value} from '@follow-ui/react-seven';
const div=React.createRef<HTMLDivElement>(),button=React.createRef<HTMLButtonElement>();
export const valid10=<><Tabs10 value="archive" onValueChange={(v,d)=>{const id:'tabs-10'=d.id;const prior:Tabs10Value|null=d.previousValue;const reason:'click'|'focus'|'keyboard'=d.reason;d.button.focus();d.cancel();return false;}} ref={div} listProps={{ref:div,'aria-labelledby':'heading'}} triggerProps={{recent:{ref:button,disabled:true,onClick:e=>e.preventDefault()}}} panelProps={{archive:{ref:div,onFocus:e=>e.currentTarget.focus()}}}/><Tabs10 defaultValue={null} activationMode="manual" orientation="vertical" dir="rtl" loop={false}/><Tabs10 defaultValue="shared"/></>;
// @ts-expect-error Tabs10 exact value
const invalid1=<Tabs10 value="wrong"/>;
// @ts-expect-error Tabs10 exact default
const invalid2=<Tabs10 defaultValue="wrong"/>;
// @ts-expect-error Tabs10 exclusive owner
const invalid3=<Tabs10 value="recent" defaultValue="shared"/>;
// @ts-expect-error Tabs10 wrong value kind
const invalid4=<Tabs10 value={[]}/>;
// @ts-expect-error Tabs10 no invented tooltip
const invalid5=<Tabs10 tooltipProps={{value:null}}/>;
// @ts-expect-error Tabs10 no root replacement
const invalid6=<Tabs10 children="bad"/>;
// @ts-expect-error Tabs10 root ref kind
const invalid7=<Tabs10 ref={button}/>;
// @ts-expect-error Tabs10 trigger key
const invalid8=<Tabs10 triggerProps={{wrong:{}}}/>;
// @ts-expect-error Tabs10 trigger role
const invalid9=<Tabs10 triggerProps={{recent:{role:"button"}}}/>;
// @ts-expect-error Tabs10 trigger ID
const invalid10=<Tabs10 triggerProps={{shared:{id:"bad"}}}/>;
// @ts-expect-error Tabs10 panel visibility
const invalid11=<Tabs10 panelProps={{archive:{hidden:false}}}/>;
// @ts-expect-error Tabs10 panel key
const invalid12=<Tabs10 panelProps={{wrong:{}}}/>;
export const valid11=<><Tabs11 value="security" onValueChange={(v,d)=>{const id:'tabs-11'=d.id;const prior:Tabs11Value|null=d.previousValue;const reason:'click'|'focus'|'keyboard'=d.reason;d.button.focus();d.cancel();return false;}} ref={div} listProps={{ref:div,'aria-labelledby':'heading'}} triggerProps={{performance:{ref:button,disabled:true,onClick:e=>e.preventDefault()}}} panelProps={{security:{ref:div,onFocus:e=>e.currentTarget.focus()}}}/><Tabs11 defaultValue={null} activationMode="manual" orientation="vertical" dir="rtl" loop={false}/><Tabs11 defaultValue="infra"/></>;
// @ts-expect-error Tabs11 exact value
const invalid13=<Tabs11 value="wrong"/>;
// @ts-expect-error Tabs11 exact default
const invalid14=<Tabs11 defaultValue="wrong"/>;
// @ts-expect-error Tabs11 exclusive owner
const invalid15=<Tabs11 value="performance" defaultValue="infra"/>;
// @ts-expect-error Tabs11 wrong value kind
const invalid16=<Tabs11 value={[]}/>;
// @ts-expect-error Tabs11 no invented tooltip
const invalid17=<Tabs11 tooltipProps={{value:null}}/>;
// @ts-expect-error Tabs11 no root replacement
const invalid18=<Tabs11 children="bad"/>;
// @ts-expect-error Tabs11 root ref kind
const invalid19=<Tabs11 ref={button}/>;
// @ts-expect-error Tabs11 trigger key
const invalid20=<Tabs11 triggerProps={{wrong:{}}}/>;
// @ts-expect-error Tabs11 trigger role
const invalid21=<Tabs11 triggerProps={{performance:{role:"button"}}}/>;
// @ts-expect-error Tabs11 trigger ID
const invalid22=<Tabs11 triggerProps={{infra:{id:"bad"}}}/>;
// @ts-expect-error Tabs11 panel visibility
const invalid23=<Tabs11 panelProps={{security:{hidden:false}}}/>;
// @ts-expect-error Tabs11 panel key
const invalid24=<Tabs11 panelProps={{wrong:{}}}/>;
export const valid12=<><Tabs12 value="ux" onValueChange={(v,d)=>{const id:'tabs-12'=d.id;const prior:Tabs12Value|null=d.previousValue;const reason:'click'|'focus'|'keyboard'=d.reason;d.button.focus();d.cancel();return false;}} ref={div} listProps={{ref:div,'aria-labelledby':'heading'}} triggerProps={{branding:{ref:button,disabled:true,onClick:e=>e.preventDefault()}}} panelProps={{ux:{ref:div,onFocus:e=>e.currentTarget.focus()}}}/><Tabs12 defaultValue={null} activationMode="manual" orientation="vertical" dir="rtl" loop={false}/><Tabs12 defaultValue="dev"/></>;
// @ts-expect-error Tabs12 exact value
const invalid25=<Tabs12 value="wrong"/>;
// @ts-expect-error Tabs12 exact default
const invalid26=<Tabs12 defaultValue="wrong"/>;
// @ts-expect-error Tabs12 exclusive owner
const invalid27=<Tabs12 value="branding" defaultValue="dev"/>;
// @ts-expect-error Tabs12 wrong value kind
const invalid28=<Tabs12 value={[]}/>;
// @ts-expect-error Tabs12 no invented tooltip
const invalid29=<Tabs12 tooltipProps={{value:null}}/>;
// @ts-expect-error Tabs12 no root replacement
const invalid30=<Tabs12 children="bad"/>;
// @ts-expect-error Tabs12 root ref kind
const invalid31=<Tabs12 ref={button}/>;
// @ts-expect-error Tabs12 trigger key
const invalid32=<Tabs12 triggerProps={{wrong:{}}}/>;
// @ts-expect-error Tabs12 trigger role
const invalid33=<Tabs12 triggerProps={{branding:{role:"button"}}}/>;
// @ts-expect-error Tabs12 trigger ID
const invalid34=<Tabs12 triggerProps={{dev:{id:"bad"}}}/>;
// @ts-expect-error Tabs12 panel visibility
const invalid35=<Tabs12 panelProps={{ux:{hidden:false}}}/>;
// @ts-expect-error Tabs12 panel key
const invalid36=<Tabs12 panelProps={{wrong:{}}}/>;
export const valid13=<><Tabs13 value="certification" onValueChange={(v,d)=>{const id:'tabs-13'=d.id;const prior:Tabs13Value|null=d.previousValue;const reason:'click'|'focus'|'keyboard'=d.reason;d.button.focus();d.cancel();return false;}} ref={div} listProps={{ref:div,'aria-labelledby':'heading'}} triggerProps={{curriculum:{ref:button,disabled:true,onClick:e=>e.preventDefault()}}} panelProps={{certification:{ref:div,onFocus:e=>e.currentTarget.focus()}}}/><Tabs13 defaultValue={null} activationMode="manual" orientation="vertical" dir="rtl" loop={false}/><Tabs13 defaultValue="lessons"/></>;
// @ts-expect-error Tabs13 exact value
const invalid37=<Tabs13 value="wrong"/>;
// @ts-expect-error Tabs13 exact default
const invalid38=<Tabs13 defaultValue="wrong"/>;
// @ts-expect-error Tabs13 exclusive owner
const invalid39=<Tabs13 value="curriculum" defaultValue="lessons"/>;
// @ts-expect-error Tabs13 wrong value kind
const invalid40=<Tabs13 value={[]}/>;
// @ts-expect-error Tabs13 no invented tooltip
const invalid41=<Tabs13 tooltipProps={{value:null}}/>;
// @ts-expect-error Tabs13 no root replacement
const invalid42=<Tabs13 children="bad"/>;
// @ts-expect-error Tabs13 root ref kind
const invalid43=<Tabs13 ref={button}/>;
// @ts-expect-error Tabs13 trigger key
const invalid44=<Tabs13 triggerProps={{wrong:{}}}/>;
// @ts-expect-error Tabs13 trigger role
const invalid45=<Tabs13 triggerProps={{curriculum:{role:"button"}}}/>;
// @ts-expect-error Tabs13 trigger ID
const invalid46=<Tabs13 triggerProps={{lessons:{id:"bad"}}}/>;
// @ts-expect-error Tabs13 panel visibility
const invalid47=<Tabs13 panelProps={{certification:{hidden:false}}}/>;
// @ts-expect-error Tabs13 panel key
const invalid48=<Tabs13 panelProps={{wrong:{}}}/>;
// @ts-expect-error navigation mode
const invalid49=<Tabs10 activationMode="click"/>;
// @ts-expect-error orientation
const invalid50=<Tabs10 orientation="diagonal"/>;
// @ts-expect-error direction
const invalid51=<Tabs10 dir="auto"/>;
// @ts-expect-error boolean loop
const invalid52=<Tabs10 loop="yes"/>;
// @ts-expect-error list role
const invalid53=<Tabs10 listProps={{role:"navigation"}}/>;
// @ts-expect-error list orientation
const invalid54=<Tabs10 listProps={{"aria-orientation":"vertical"}}/>;
// @ts-expect-error list label
const invalid55=<Tabs10 listProps={{"aria-label":"bad"}}/>;
// @ts-expect-error trigger ref
const invalid56=<Tabs10 triggerProps={{recent:{ref:div}}}/>;
// @ts-expect-error panel ref
const invalid57=<Tabs10 panelProps={{shared:{ref:button}}}/>;
// @ts-expect-error root HTML
const invalid58=<Tabs10 dangerouslySetInnerHTML={{__html:"bad"}}/>;
// @ts-expect-error callback exact domain
const invalid59=<Tabs10 onValueChange={(v:"wrong")=>false}/>;
