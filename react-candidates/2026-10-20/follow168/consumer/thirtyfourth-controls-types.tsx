import * as React from 'react';
import {Tabs22,Tabs23,Tabs24,Tabs25,type Tabs25Action,type Tabs25ActionDetails,type Tabs25MemberIds} from '@follow-ui/react-seven';
const div=React.createRef<HTMLDivElement>(),button=React.createRef<HTMLButtonElement>();
export const valid22=<><Tabs22 value="v3" onValueChange={(v,d)=>{const id:'tabs-22'=d.id;d.cancel();d.button.focus();return false;}} ref={div} listProps={{ref:div,'aria-labelledby':'heading'}} triggerProps={{'v4':{ref:button,onClick:e=>e.preventDefault()}}} panelProps={{'v3':{ref:div}}}/><Tabs22 defaultValue={null} activationMode="manual" orientation="horizontal" dir="rtl" loop={false}/><Tabs22 defaultValue="v3.2"/></>;
export const valid23=<><Tabs23 value="system" onValueChange={(v,d)=>{const id:'tabs-23'=d.id;d.cancel();d.button.focus();return false;}} ref={div} listProps={{ref:div,'aria-labelledby':'heading'}} triggerProps={{'mentions':{ref:button,onClick:e=>e.preventDefault()}}} panelProps={{'system':{ref:div}}}/><Tabs23 defaultValue={null} activationMode="manual" orientation="horizontal" dir="rtl" loop={false}/><Tabs23 defaultValue="direct"/></>;
export const valid24=<><Tabs24 value="acquisition" onValueChange={(v,d)=>{const id:'tabs-24'=d.id;d.cancel();d.button.focus();return false;}} ref={div} listProps={{ref:div,'aria-labelledby':'heading'}} triggerProps={{'traffic':{ref:button,onClick:e=>e.preventDefault()}}} panelProps={{'acquisition':{ref:div}}}/><Tabs24 defaultValue={null} activationMode="manual" orientation="horizontal" dir="rtl" loop={false}/><Tabs24 defaultValue="sales"/></>;
export const valid25=<><Tabs25 value="marketing" onValueChange={(v,d)=>{const id:'tabs-25'=d.id;d.cancel();d.button.focus();return false;}} ref={div} listProps={{ref:div,'aria-labelledby':'heading'}} triggerProps={{'engineering':{ref:button,onClick:e=>e.preventDefault()}}} panelProps={{'marketing':{ref:div}}}/><Tabs25 defaultValue={null} activationMode="manual" orientation="horizontal" dir="rtl" loop={false}/><Tabs25 defaultValue="design"/></>;
export const memberButtons=<Tabs25 actionProps={{engineering:{'alice-chen':{email:{ref:button,name:'local',onClick:e=>{e.preventDefault();e.currentTarget.focus();}},more:{disabled:true}},'bob-smith':{more:{'aria-describedby':'explanation'}}},design:{'diana-prince':{email:{tabIndex:0}},'evan-wright':{more:{}}},marketing:{'fiona-gallagher':{email:{}},'george-miller':{more:{}},'hannah-lee':{email:{},more:{}}}}} onAction={(action,details)=>{const a:Tabs25Action=action;const id:'tabs-25'=details.id;const status:'Online'|'Busy'|'Offline'=details.memberStatus;if(details.value==='engineering'){const member:Tabs25MemberIds['engineering']=details.memberId;}if(details.value==='design'){const member:'diana-prince'|'evan-wright'=details.memberId;}details.button.focus();details.event.preventDefault();}}/>;
// @ts-expect-error exact native/member contract 1
const invalid1=<Tabs22 value="wrong"/>;
// @ts-expect-error exact native/member contract 2
const invalid2=<Tabs22 defaultValue="wrong"/>;
// @ts-expect-error exact native/member contract 3
const invalid3=<Tabs22 value="v4" defaultValue="v3.2"/>;
// @ts-expect-error exact native/member contract 4
const invalid4=<Tabs22 value={[]}/>;
// @ts-expect-error exact native/member contract 5
const invalid5=<Tabs22 children="bad"/>;
// @ts-expect-error exact native/member contract 6
const invalid6=<Tabs22 ref={button}/>;
// @ts-expect-error exact native/member contract 7
const invalid7=<Tabs22 triggerProps={{wrong:{}}}/>;
// @ts-expect-error exact native/member contract 8
const invalid8=<Tabs22 triggerProps={{'v4':{role:"button"}}}/>;
// @ts-expect-error exact native/member contract 9
const invalid9=<Tabs22 triggerProps={{'v3.2':{id:"bad"}}}/>;
// @ts-expect-error exact native/member contract 10
const invalid10=<Tabs22 panelProps={{'v3':{hidden:false}}}/>;
// @ts-expect-error exact native/member contract 11
const invalid11=<Tabs22 panelProps={{wrong:{}}}/>;
// @ts-expect-error exact native/member contract 12
const invalid12=<Tabs22 onValueChange={(v:"wrong")=>false}/>;
// @ts-expect-error exact native/member contract 13
const invalid13=<Tabs22 activationMode="eager"/>;
// @ts-expect-error exact native/member contract 14
const invalid14=<Tabs22 orientation="diagonal"/>;
// @ts-expect-error exact native/member contract 15
const invalid15=<Tabs22 dir="auto"/>;
// @ts-expect-error exact native/member contract 16
const invalid16=<Tabs22 loop="false"/>;
// @ts-expect-error exact native/member contract 17
const invalid17=<Tabs22 tooltipProps={{value:null}}/>;
// @ts-expect-error exact native/member contract 19
const invalid19=<Tabs22 onAction={()=>{}}/>;
// @ts-expect-error exact native/member contract 20
const invalid20=<Tabs22 actionProps={{}}/>;
// @ts-expect-error exact native/member contract 21
const invalid21=<Tabs23 value="wrong"/>;
// @ts-expect-error exact native/member contract 22
const invalid22=<Tabs23 defaultValue="wrong"/>;
// @ts-expect-error exact native/member contract 23
const invalid23=<Tabs23 value="mentions" defaultValue="direct"/>;
// @ts-expect-error exact native/member contract 24
const invalid24=<Tabs23 value={[]}/>;
// @ts-expect-error exact native/member contract 25
const invalid25=<Tabs23 children="bad"/>;
// @ts-expect-error exact native/member contract 26
const invalid26=<Tabs23 ref={button}/>;
// @ts-expect-error exact native/member contract 27
const invalid27=<Tabs23 triggerProps={{wrong:{}}}/>;
// @ts-expect-error exact native/member contract 28
const invalid28=<Tabs23 triggerProps={{'mentions':{role:"button"}}}/>;
// @ts-expect-error exact native/member contract 29
const invalid29=<Tabs23 triggerProps={{'direct':{id:"bad"}}}/>;
// @ts-expect-error exact native/member contract 30
const invalid30=<Tabs23 panelProps={{'system':{hidden:false}}}/>;
// @ts-expect-error exact native/member contract 31
const invalid31=<Tabs23 panelProps={{wrong:{}}}/>;
// @ts-expect-error exact native/member contract 32
const invalid32=<Tabs23 onValueChange={(v:"wrong")=>false}/>;
// @ts-expect-error exact native/member contract 33
const invalid33=<Tabs23 activationMode="eager"/>;
// @ts-expect-error exact native/member contract 34
const invalid34=<Tabs23 orientation="diagonal"/>;
// @ts-expect-error exact native/member contract 35
const invalid35=<Tabs23 dir="auto"/>;
// @ts-expect-error exact native/member contract 36
const invalid36=<Tabs23 loop="false"/>;
// @ts-expect-error exact native/member contract 37
const invalid37=<Tabs23 tooltipProps={{value:null}}/>;
// @ts-expect-error exact native/member contract 39
const invalid39=<Tabs23 onAction={()=>{}}/>;
// @ts-expect-error exact native/member contract 40
const invalid40=<Tabs23 actionProps={{}}/>;
// @ts-expect-error exact native/member contract 41
const invalid41=<Tabs24 value="wrong"/>;
// @ts-expect-error exact native/member contract 42
const invalid42=<Tabs24 defaultValue="wrong"/>;
// @ts-expect-error exact native/member contract 43
const invalid43=<Tabs24 value="traffic" defaultValue="sales"/>;
// @ts-expect-error exact native/member contract 44
const invalid44=<Tabs24 value={[]}/>;
// @ts-expect-error exact native/member contract 45
const invalid45=<Tabs24 children="bad"/>;
// @ts-expect-error exact native/member contract 46
const invalid46=<Tabs24 ref={button}/>;
// @ts-expect-error exact native/member contract 47
const invalid47=<Tabs24 triggerProps={{wrong:{}}}/>;
// @ts-expect-error exact native/member contract 48
const invalid48=<Tabs24 triggerProps={{'traffic':{role:"button"}}}/>;
// @ts-expect-error exact native/member contract 49
const invalid49=<Tabs24 triggerProps={{'sales':{id:"bad"}}}/>;
// @ts-expect-error exact native/member contract 50
const invalid50=<Tabs24 panelProps={{'acquisition':{hidden:false}}}/>;
// @ts-expect-error exact native/member contract 51
const invalid51=<Tabs24 panelProps={{wrong:{}}}/>;
// @ts-expect-error exact native/member contract 52
const invalid52=<Tabs24 onValueChange={(v:"wrong")=>false}/>;
// @ts-expect-error exact native/member contract 53
const invalid53=<Tabs24 activationMode="eager"/>;
// @ts-expect-error exact native/member contract 54
const invalid54=<Tabs24 orientation="diagonal"/>;
// @ts-expect-error exact native/member contract 55
const invalid55=<Tabs24 dir="auto"/>;
// @ts-expect-error exact native/member contract 56
const invalid56=<Tabs24 loop="false"/>;
// @ts-expect-error exact native/member contract 57
const invalid57=<Tabs24 tooltipProps={{value:null}}/>;
// @ts-expect-error exact native/member contract 59
const invalid59=<Tabs24 onAction={()=>{}}/>;
// @ts-expect-error exact native/member contract 60
const invalid60=<Tabs24 actionProps={{}}/>;
// @ts-expect-error exact native/member contract 61
const invalid61=<Tabs25 value="wrong"/>;
// @ts-expect-error exact native/member contract 62
const invalid62=<Tabs25 defaultValue="wrong"/>;
// @ts-expect-error exact native/member contract 63
const invalid63=<Tabs25 value="engineering" defaultValue="design"/>;
// @ts-expect-error exact native/member contract 64
const invalid64=<Tabs25 value={[]}/>;
// @ts-expect-error exact native/member contract 65
const invalid65=<Tabs25 children="bad"/>;
// @ts-expect-error exact native/member contract 66
const invalid66=<Tabs25 ref={button}/>;
// @ts-expect-error exact native/member contract 67
const invalid67=<Tabs25 triggerProps={{wrong:{}}}/>;
// @ts-expect-error exact native/member contract 68
const invalid68=<Tabs25 triggerProps={{'engineering':{role:"button"}}}/>;
// @ts-expect-error exact native/member contract 69
const invalid69=<Tabs25 triggerProps={{'design':{id:"bad"}}}/>;
// @ts-expect-error exact native/member contract 70
const invalid70=<Tabs25 panelProps={{'marketing':{hidden:false}}}/>;
// @ts-expect-error exact native/member contract 71
const invalid71=<Tabs25 panelProps={{wrong:{}}}/>;
// @ts-expect-error exact native/member contract 72
const invalid72=<Tabs25 onValueChange={(v:"wrong")=>false}/>;
// @ts-expect-error exact native/member contract 73
const invalid73=<Tabs25 activationMode="eager"/>;
// @ts-expect-error exact native/member contract 74
const invalid74=<Tabs25 orientation="diagonal"/>;
// @ts-expect-error exact native/member contract 75
const invalid75=<Tabs25 dir="auto"/>;
// @ts-expect-error exact native/member contract 76
const invalid76=<Tabs25 loop="false"/>;
// @ts-expect-error exact native/member contract 77
const invalid77=<Tabs25 tooltipProps={{value:null}}/>;
// @ts-expect-error exact native/member contract 79
const invalid79=<Tabs25 actionProps={{wrong:{}}}/>;
// @ts-expect-error exact native/member contract 80
const invalid80=<Tabs25 actionProps={{engineering:{wrong:{}}}}/>;
// @ts-expect-error exact native/member contract 81
const invalid81=<Tabs25 actionProps={{engineering:{'diana-prince':{email:{}}}}}/>;
// @ts-expect-error exact native/member contract 82
const invalid82=<Tabs25 actionProps={{design:{'alice-chen':{email:{}}}}}/>;
// @ts-expect-error exact native/member contract 83
const invalid83=<Tabs25 actionProps={{marketing:{'bob-smith':{more:{}}}}}/>;
// @ts-expect-error exact native/member contract 84
const invalid84=<Tabs25 actionProps={{engineering:{'alice-chen':{delete:{}}}}}/>;
// @ts-expect-error exact native/member contract 85
const invalid85=<Tabs25 actionProps={{engineering:{'alice-chen':{email:{ref:div}}}}}/>;
// @ts-expect-error exact native/member contract 86
const invalid86=<Tabs25 actionProps={{engineering:{'alice-chen':{email:{'type':"submit"}}}}}/>;
// @ts-expect-error exact native/member contract 87
const invalid87=<Tabs25 actionProps={{engineering:{'alice-chen':{email:{'role':"link"}}}}}/>;
// @ts-expect-error exact native/member contract 88
const invalid88=<Tabs25 actionProps={{engineering:{'alice-chen':{email:{'id':"bad"}}}}}/>;
// @ts-expect-error exact native/member contract 89
const invalid89=<Tabs25 actionProps={{engineering:{'alice-chen':{email:{'children':"bad"}}}}}/>;
// @ts-expect-error exact native/member contract 90
const invalid90=<Tabs25 actionProps={{engineering:{'alice-chen':{email:{'aria-label':"anonymous"}}}}}/>;
// @ts-expect-error exact native/member contract 91
const invalid91=<Tabs25 actionProps={{engineering:{'alice-chen':{email:{'aria-labelledby':"other"}}}}}/>;
// @ts-expect-error exact native/member contract 92
const invalid92=<Tabs25 actionProps={{engineering:{'alice-chen':{email:{'aria-hidden':true}}}}}/>;
// @ts-expect-error exact native/member contract 93
const invalid93=<Tabs25 actionProps={{engineering:{'alice-chen':{email:{'aria-haspopup':"menu"}}}}}/>;
// @ts-expect-error exact native/member contract 94
const invalid94=<Tabs25 actionProps={{engineering:{'alice-chen':{email:{'aria-expanded':true}}}}}/>;
// @ts-expect-error exact native/member contract 95
const invalid95=<Tabs25 actionProps={{engineering:{'alice-chen':{email:{'dangerouslySetInnerHTML':{__html:"bad"}}}}}}/>;
// @ts-expect-error exact native/member contract 96
const invalid96=<Tabs25 onAction={(action:"delete")=>{}}/>;
// @ts-expect-error exact native/member contract 97
const invalid97=<Tabs25 onAction={(action,d)=>{const member:"diana-prince"=d.memberId;}}/>;
// @ts-expect-error exact native/member contract 98
const invalid98=<Tabs25 onAction={(action,d)=>{d.memberName="Changed";}}/>;
// @ts-expect-error exact native/member contract 99
const invalid99=<Tabs25 onAction={(action,d)=>{d.memberId="alice-chen";}}/>;
// @ts-expect-error exact native/member contract 100
const invalid100=<Tabs25 onAction={(action,d)=>{d.value="engineering";}}/>;
// @ts-expect-error exact native/member contract 101
const invalid101=<Tabs25 onAction={(action,d)=>{if(d.value==="design"){const x:"alice-chen"=d.memberId;}}}/>;
