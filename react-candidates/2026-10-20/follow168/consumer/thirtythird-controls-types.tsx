import * as React from 'react';
import {Tabs18,Tabs19,Tabs20,Tabs21,type Tabs18Value,type Tabs19Value,type Tabs20Value,type Tabs21Value} from '@follow-ui/react-seven';
const div=React.createRef<HTMLDivElement>(),button=React.createRef<HTMLButtonElement>();
export const valid18=<><Tabs18 value="done" onValueChange={(v,d)=>{const id:'tabs-18'=d.id;const prior:Tabs18Value|null=d.previousValue;d.cancel();d.button.focus();return false;}} ref={div} listProps={{ref:div,'aria-labelledby':'heading'}} triggerProps={{'todo':{ref:button,onClick:e=>e.preventDefault()}}} panelProps={{'done':{ref:div}}}/><Tabs18 defaultValue={null} activationMode="manual" orientation="horizontal" dir="rtl" loop={false}/><Tabs18 defaultValue="in-progress"/></>;
// @ts-expect-error exact state/native contract 1
const invalid1=<Tabs18 value="wrong"/>;
// @ts-expect-error exact state/native contract 2
const invalid2=<Tabs18 defaultValue="wrong"/>;
// @ts-expect-error exact state/native contract 3
const invalid3=<Tabs18 value="todo" defaultValue="in-progress"/>;
// @ts-expect-error exact state/native contract 4
const invalid4=<Tabs18 value={[]}/>;
// @ts-expect-error exact state/native contract 5
const invalid5=<Tabs18 children="bad"/>;
// @ts-expect-error exact state/native contract 6
const invalid6=<Tabs18 ref={button}/>;
// @ts-expect-error exact state/native contract 7
const invalid7=<Tabs18 triggerProps={{wrong:{}}}/>;
// @ts-expect-error exact state/native contract 8
const invalid8=<Tabs18 triggerProps={{'todo':{role:"button"}}}/>;
// @ts-expect-error exact state/native contract 9
const invalid9=<Tabs18 triggerProps={{'in-progress':{id:"bad"}}}/>;
// @ts-expect-error exact state/native contract 10
const invalid10=<Tabs18 panelProps={{'done':{hidden:false}}}/>;
// @ts-expect-error exact state/native contract 11
const invalid11=<Tabs18 panelProps={{wrong:{}}}/>;
// @ts-expect-error exact state/native contract 12
const invalid12=<Tabs18 onValueChange={(v:"wrong")=>false}/>;
export const valid19=<><Tabs19 value="experiences" onValueChange={(v,d)=>{const id:'tabs-19'=d.id;const prior:Tabs19Value|null=d.previousValue;d.cancel();d.button.focus();return false;}} ref={div} listProps={{ref:div,'aria-labelledby':'heading'}} triggerProps={{'stays':{ref:button,onClick:e=>e.preventDefault()}}} panelProps={{'experiences':{ref:div}}}/><Tabs19 defaultValue={null} activationMode="manual" orientation="horizontal" dir="rtl" loop={false}/><Tabs19 defaultValue="flights"/></>;
// @ts-expect-error exact state/native contract 13
const invalid13=<Tabs19 value="wrong"/>;
// @ts-expect-error exact state/native contract 14
const invalid14=<Tabs19 defaultValue="wrong"/>;
// @ts-expect-error exact state/native contract 15
const invalid15=<Tabs19 value="stays" defaultValue="flights"/>;
// @ts-expect-error exact state/native contract 16
const invalid16=<Tabs19 value={[]}/>;
// @ts-expect-error exact state/native contract 17
const invalid17=<Tabs19 children="bad"/>;
// @ts-expect-error exact state/native contract 18
const invalid18=<Tabs19 ref={button}/>;
// @ts-expect-error exact state/native contract 19
const invalid19=<Tabs19 triggerProps={{wrong:{}}}/>;
// @ts-expect-error exact state/native contract 20
const invalid20=<Tabs19 triggerProps={{'stays':{role:"button"}}}/>;
// @ts-expect-error exact state/native contract 21
const invalid21=<Tabs19 triggerProps={{'flights':{id:"bad"}}}/>;
// @ts-expect-error exact state/native contract 22
const invalid22=<Tabs19 panelProps={{'experiences':{hidden:false}}}/>;
// @ts-expect-error exact state/native contract 23
const invalid23=<Tabs19 panelProps={{wrong:{}}}/>;
// @ts-expect-error exact state/native contract 24
const invalid24=<Tabs19 onValueChange={(v:"wrong")=>false}/>;
export const valid20=<><Tabs20 value="radio" onValueChange={(v,d)=>{const id:'tabs-20'=d.id;const prior:Tabs20Value|null=d.previousValue;d.cancel();d.button.focus();return false;}} ref={div} listProps={{ref:div,'aria-labelledby':'heading'}} triggerProps={{'playlists':{ref:button,onClick:e=>e.preventDefault()}}} panelProps={{'radio':{ref:div}}}/><Tabs20 defaultValue={null} activationMode="manual" orientation="horizontal" dir="rtl" loop={false}/><Tabs20 defaultValue="podcasts"/></>;
// @ts-expect-error exact state/native contract 25
const invalid25=<Tabs20 value="wrong"/>;
// @ts-expect-error exact state/native contract 26
const invalid26=<Tabs20 defaultValue="wrong"/>;
// @ts-expect-error exact state/native contract 27
const invalid27=<Tabs20 value="playlists" defaultValue="podcasts"/>;
// @ts-expect-error exact state/native contract 28
const invalid28=<Tabs20 value={[]}/>;
// @ts-expect-error exact state/native contract 29
const invalid29=<Tabs20 children="bad"/>;
// @ts-expect-error exact state/native contract 30
const invalid30=<Tabs20 ref={button}/>;
// @ts-expect-error exact state/native contract 31
const invalid31=<Tabs20 triggerProps={{wrong:{}}}/>;
// @ts-expect-error exact state/native contract 32
const invalid32=<Tabs20 triggerProps={{'playlists':{role:"button"}}}/>;
// @ts-expect-error exact state/native contract 33
const invalid33=<Tabs20 triggerProps={{'podcasts':{id:"bad"}}}/>;
// @ts-expect-error exact state/native contract 34
const invalid34=<Tabs20 panelProps={{'radio':{hidden:false}}}/>;
// @ts-expect-error exact state/native contract 35
const invalid35=<Tabs20 panelProps={{wrong:{}}}/>;
// @ts-expect-error exact state/native contract 36
const invalid36=<Tabs20 onValueChange={(v:"wrong")=>false}/>;
export const valid21=<><Tabs21 value="deployment" onValueChange={(v,d)=>{const id:'tabs-21'=d.id;const prior:Tabs21Value|null=d.previousValue;d.cancel();d.button.focus();return false;}} ref={div} listProps={{ref:div,'aria-labelledby':'heading'}} triggerProps={{'installation':{ref:button,onClick:e=>e.preventDefault()}}} panelProps={{'deployment':{ref:div}}}/><Tabs21 defaultValue={null} activationMode="manual" orientation="horizontal" dir="rtl" loop={false}/><Tabs21 defaultValue="config"/></>;
// @ts-expect-error exact state/native contract 37
const invalid37=<Tabs21 value="wrong"/>;
// @ts-expect-error exact state/native contract 38
const invalid38=<Tabs21 defaultValue="wrong"/>;
// @ts-expect-error exact state/native contract 39
const invalid39=<Tabs21 value="installation" defaultValue="config"/>;
// @ts-expect-error exact state/native contract 40
const invalid40=<Tabs21 value={[]}/>;
// @ts-expect-error exact state/native contract 41
const invalid41=<Tabs21 children="bad"/>;
// @ts-expect-error exact state/native contract 42
const invalid42=<Tabs21 ref={button}/>;
// @ts-expect-error exact state/native contract 43
const invalid43=<Tabs21 triggerProps={{wrong:{}}}/>;
// @ts-expect-error exact state/native contract 44
const invalid44=<Tabs21 triggerProps={{'installation':{role:"button"}}}/>;
// @ts-expect-error exact state/native contract 45
const invalid45=<Tabs21 triggerProps={{'config':{id:"bad"}}}/>;
// @ts-expect-error exact state/native contract 46
const invalid46=<Tabs21 panelProps={{'deployment':{hidden:false}}}/>;
// @ts-expect-error exact state/native contract 47
const invalid47=<Tabs21 panelProps={{wrong:{}}}/>;
// @ts-expect-error exact state/native contract 48
const invalid48=<Tabs21 onValueChange={(v:"wrong")=>false}/>;
export const actions=<><Tabs18 onAction={(a,d)=>{const action:'view-tasks'=a;const id:'tabs-18'=d.id;const v:Tabs18Value=d.value;d.button.focus();}} actionProps={{'in-progress':{'view-tasks':{ref:button,onClick:e=>e.preventDefault()}}}}/><Tabs19 onAction={(a,d)=>{const action:'explore'=a;const id:'tabs-19'=d.id;const v:Tabs19Value=d.value;}} actionProps={{stays:{explore:{disabled:true}}}}/><Tabs21 tooltipProps={{value:'config',delayDuration:20,onValueChange:(v,d)=>{const id:'tabs-21'=d.id;const prev:Tabs21Value|null=d.previousValue;d.cancel();return false;}}}/><Tabs21 tooltipProps={{defaultValue:null,disabled:true}}/></>;
// @ts-expect-error precise action/tooltip contract 49
const invalid49=<Tabs18 tooltipProps={{value:null}}/>;
// @ts-expect-error precise action/tooltip contract 50
const invalid50=<Tabs19 tooltipProps={{value:null}}/>;
// @ts-expect-error precise action/tooltip contract 51
const invalid51=<Tabs20 tooltipProps={{value:null}}/>;
// @ts-expect-error precise action/tooltip contract 52
const invalid52=<Tabs20 actionProps={{playlists:{play:{}}}}/>;
// @ts-expect-error precise action/tooltip contract 53
const invalid53=<Tabs21 onAction={()=>{}}/>;
// @ts-expect-error precise action/tooltip contract 54
const invalid54=<Tabs18 actionProps={{todo:{explore:{}}}}/>;
// @ts-expect-error precise action/tooltip contract 55
const invalid55=<Tabs19 actionProps={{wrong:{explore:{}}}}/>;
// @ts-expect-error precise action/tooltip contract 56
const invalid56=<Tabs18 onAction={(a:"explore")=>{}}/>;
// @ts-expect-error precise action/tooltip contract 57
const invalid57=<Tabs19 onAction={(a:"view-tasks")=>{}}/>;
// @ts-expect-error precise action/tooltip contract 58
const invalid58=<Tabs18 actionProps={{done:{"view-tasks":{type:"submit"}}}}/>;
// @ts-expect-error precise action/tooltip contract 59
const invalid59=<Tabs19 actionProps={{flights:{explore:{children:"bad"}}}}/>;
// @ts-expect-error precise action/tooltip contract 60
const invalid60=<Tabs19 actionProps={{stays:{explore:{id:"bad"}}}}/>;
// @ts-expect-error precise action/tooltip contract 61
const invalid61=<Tabs18 actionProps={{todo:{"view-tasks":{role:"link"}}}}/>;
// @ts-expect-error precise action/tooltip contract 62
const invalid62=<Tabs19 actionProps={{experiences:{explore:{ref:div}}}}/>;
// @ts-expect-error precise action/tooltip contract 63
const invalid63=<Tabs18 onAction={(a,d)=>d.cancel()}/>;
// @ts-expect-error precise action/tooltip contract 64
const invalid64=<Tabs21 tooltipProps={{value:"configuration"}}/>;
// @ts-expect-error precise action/tooltip contract 65
const invalid65=<Tabs21 tooltipProps={{value:null,defaultValue:null}}/>;
// @ts-expect-error precise action/tooltip contract 66
const invalid66=<Tabs21 tooltipProps={{delayDuration:"20"}}/>;
// @ts-expect-error precise action/tooltip contract 67
const invalid67=<Tabs21 tooltipProps={{onValueChange:(v:"wrong")=>false}}/>;
// @ts-expect-error precise action/tooltip contract 68
const invalid68=<Tabs20 progress={60}/>;
// @ts-expect-error precise action/tooltip contract 69
const invalid69=<Tabs21 orientation="diagonal"/>;
// @ts-expect-error precise action/tooltip contract 70
const invalid70=<Tabs18 activationMode="click"/>;
// @ts-expect-error precise action/tooltip contract 71
const invalid71=<Tabs19 dir="auto"/>;
// @ts-expect-error precise action/tooltip contract 72
const invalid72=<Tabs20 loop="yes"/>;
// @ts-expect-error precise action/tooltip contract 73
const invalid73=<Tabs21 listProps={{role:"menu"}}/>;
// @ts-expect-error precise action/tooltip contract 74
const invalid74=<Tabs18 listProps={{"aria-orientation":"vertical"}}/>;
// @ts-expect-error precise action/tooltip contract 75
const invalid75=<Tabs19 listProps={{"aria-label":"bad"}}/>;
// @ts-expect-error precise action/tooltip contract 76
const invalid76=<Tabs20 triggerProps={{playlists:{ref:div}}}/>;
// @ts-expect-error precise action/tooltip contract 77
const invalid77=<Tabs21 panelProps={{config:{ref:button}}}/>;
// @ts-expect-error precise action/tooltip contract 78
const invalid78=<Tabs18 dangerouslySetInnerHTML={{__html:"bad"}}/>;
