import * as React from 'react';
import {Tabs26,Textarea21,Button37,Button38,type Tabs26Value,type Tabs26ChangeDetails,type Tabs26Props,type Textarea21Props,type Button37Props,type Button38Props}from'@follow-ui/react-seven';
const div=React.createRef<HTMLDivElement>(),button=React.createRef<HTMLButtonElement>(),textarea=React.createRef<HTMLTextAreaElement>();
export const tabs=<><Tabs26 ref={div} value="specs" onValueChange={(v,d)=>{const value:Tabs26Value|null=v;const id:'tabs-26'=d.id;const previous:Tabs26Value|null=d.previousValue;d.cancel();d.event.preventDefault();d.button.focus();return false;}} triggerProps={{dimensions:{ref:button,disabled:true,onKeyDown:e=>e.preventDefault()}}} panelProps={{box:{ref:div}}} listProps={{ref:div,'aria-labelledby':'title'}}/><Tabs26 defaultValue={null} orientation="vertical" dir="rtl" loop={false} activationMode="manual"/></>;
export const field=<><Textarea21 ref={textarea} value="text" onChange={e=>e.currentTarget.value} label="Notes" labelProps={{ref:React.createRef<HTMLLabelElement>()}} name="notes" form="outside" readOnly required/><Textarea21 defaultValue="seed" rows={5} maxLength={80}/><Textarea21 label={null} aria-label="Notes" onCompositionEnd={e=>e.data}/></>;
export const buttons=<><Button37 ref={button} type="submit" form="outside" name="check" value="1" onClick={e=>e.preventDefault()} label="Check locally"/><Button38 ref={node=>()=>{}} type="reset" disabled title="Local" aria-describedby="hint" onKeyDown={e=>e.currentTarget.focus()}/></>;
// @ts-expect-error exact contract 1
const invalid1=<Tabs26 value="wrong"/>;
// @ts-expect-error exact contract 2
const invalid2=<Tabs26 defaultValue="wrong"/>;
// @ts-expect-error exact contract 3
const invalid3=<Tabs26 value="specs" defaultValue="box"/>;
// @ts-expect-error exact contract 4
const invalid4=<Tabs26 value={3}/>;
// @ts-expect-error exact contract 5
const invalid5=<Tabs26 orientation="diagonal"/>;
// @ts-expect-error exact contract 6
const invalid6=<Tabs26 activationMode="hover"/>;
// @ts-expect-error exact contract 7
const invalid7=<Tabs26 dir="auto"/>;
// @ts-expect-error exact contract 8
const invalid8=<Tabs26 loop="true"/>;
// @ts-expect-error exact contract 9
const invalid9=<Tabs26 ref={button}/>;
// @ts-expect-error exact contract 10
const invalid10=<Tabs26 onValueChange={(v:number)=>{}}/>;
// @ts-expect-error exact contract 11
const invalid11=<Tabs26 onValueChange={(v,d)=>{const id:"tabs-25"=d.id;}}/>;
// @ts-expect-error exact contract 12
const invalid12=<Tabs26 triggerProps={{wrong:{}}}/>;
// @ts-expect-error exact contract 13
const invalid13=<Tabs26 panelProps={{wrong:{}}}/>;
// @ts-expect-error exact contract 14
const invalid14=<Tabs26 triggerProps={{specs:{type:"submit"}}}/>;
// @ts-expect-error exact contract 15
const invalid15=<Tabs26 triggerProps={{specs:{role:"link"}}}/>;
// @ts-expect-error exact contract 16
const invalid16=<Tabs26 triggerProps={{specs:{id:"bad"}}}/>;
// @ts-expect-error exact contract 17
const invalid17=<Tabs26 triggerProps={{specs:{tabIndex:3}}}/>;
// @ts-expect-error exact contract 18
const invalid18=<Tabs26 triggerProps={{specs:{"aria-selected":true}}}/>;
// @ts-expect-error exact contract 19
const invalid19=<Tabs26 panelProps={{box:{hidden:true}}}/>;
// @ts-expect-error exact contract 20
const invalid20=<Tabs26 panelProps={{box:{id:"bad"}}}/>;
// @ts-expect-error exact contract 21
const invalid21=<Tabs26 listProps={{role:"menu"}}/>;
// @ts-expect-error exact contract 22
const invalid22=<Tabs26 listProps={{"aria-orientation":"vertical"}}/>;
// @ts-expect-error exact contract 23
const invalid23=<Tabs26>bad</Tabs26>;
// @ts-expect-error exact contract 24
const invalid24=<Tabs26 actionProps={{}}/>;
// @ts-expect-error exact contract 25
const invalid25=<Tabs26 tooltipProps={{}}/>;
// @ts-expect-error exact contract 26
const invalid26=<Textarea21 value="text" defaultValue="seed"/>;
// @ts-expect-error exact contract 27
const invalid27=<Textarea21 value={null}/>;
// @ts-expect-error exact contract 28
const invalid28=<Textarea21 defaultValue={null}/>;
// @ts-expect-error exact contract 29
const invalid29=<Textarea21 ref={button}/>;
// @ts-expect-error exact contract 30
const invalid30=<Textarea21 labelProps={{htmlFor:"bad"}}/>;
// @ts-expect-error exact contract 31
const invalid31=<Textarea21 labelProps={{children:"bad"}}/>;
// @ts-expect-error exact contract 32
const invalid32=<Textarea21>bad</Textarea21>;
// @ts-expect-error exact contract 33
const invalid33=<Textarea21 dangerouslySetInnerHTML={{__html:"bad"}}/>;
// @ts-expect-error exact contract 34
const invalid34=<Textarea21 onValueChange={()=>{}}/>;
// @ts-expect-error exact contract 35
const invalid35=<Textarea21 rows="5"/>;
// @ts-expect-error exact contract 36
const invalid36=<Textarea21 readOnly="true"/>;
// @ts-expect-error exact contract 37
const invalid37=<Textarea21 type="text"/>;
// @ts-expect-error exact contract 38
const invalid38=<Textarea21 onChange={(e:React.MouseEvent)=>{}}/>;
// @ts-expect-error exact contract 39
const invalid39=<Button37 type="switch"/>;
// @ts-expect-error exact contract 40
const invalid40=<Button37 ref={div}/>;
// @ts-expect-error exact contract 41
const invalid41=<Button37 label={<span/>}/>;
// @ts-expect-error exact contract 42
const invalid42=<Button37>bad</Button37>;
// @ts-expect-error exact contract 43
const invalid43=<Button37 dangerouslySetInnerHTML={{__html:"bad"}}/>;
// @ts-expect-error exact contract 44
const invalid44=<Button37 disabled="true"/>;
// @ts-expect-error exact contract 45
const invalid45=<Button37 onValueChange={()=>{}}/>;
// @ts-expect-error exact contract 46
const invalid46=<Button37 href="https://example.com"/>;
// @ts-expect-error exact contract 47
const invalid47=<Button37 onClick={(e:React.ChangeEvent<HTMLTextAreaElement>)=>{}}/>;
// @ts-expect-error exact contract 48
const invalid48=<Button38 type="switch"/>;
// @ts-expect-error exact contract 49
const invalid49=<Button38 ref={div}/>;
// @ts-expect-error exact contract 50
const invalid50=<Button38 label={<span/>}/>;
// @ts-expect-error exact contract 51
const invalid51=<Button38>bad</Button38>;
// @ts-expect-error exact contract 52
const invalid52=<Button38 dangerouslySetInnerHTML={{__html:"bad"}}/>;
// @ts-expect-error exact contract 53
const invalid53=<Button38 disabled="true"/>;
// @ts-expect-error exact contract 54
const invalid54=<Button38 onValueChange={()=>{}}/>;
// @ts-expect-error exact contract 55
const invalid55=<Button38 href="https://example.com"/>;
// @ts-expect-error exact contract 56
const invalid56=<Button38 onClick={(e:React.ChangeEvent<HTMLTextAreaElement>)=>{}}/>;
