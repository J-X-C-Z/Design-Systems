import * as React from 'react';
import {RadioGroup11,RadioGroup12,RadioGroup13,Switch19} from '@follow-ui/react-seven';
const good11=<RadioGroup11 defaultValue="1" ref={React.createRef<HTMLDivElement>()} name="g11" form="external" required orientation="horizontal" loop={false} itemProps={{'1':{ref:input=>{if(input){input.checkValidity();return()=>{};}},onClick:event=>event.currentTarget.checked,'aria-describedby':'extra','aria-labelledby':'title'}}} labelProps={{'1':{ref:label=>{if(label)label.htmlFor;}}}} onValueChange={(next,details)=>{const id:'radio-group-11'=details.id;if(details.reason==='reset'){const event:Event=details.event;const input:null=details.input;}else if(details.reason==='keyboard'){details.event.key;details.input.checked;}else{details.event.button;details.input.form;}details.cancel();return false;}}/>;
const empty11=<RadioGroup11 value={null}/>;const release11=<RadioGroup11 value={undefined}/>;
// @ts-expect-error reject 1
const bad1=<RadioGroup11 value="invalid"/>;
// @ts-expect-error reject 2
const bad2=<RadioGroup11 defaultValue="invalid"/>;
// @ts-expect-error reject 3
const bad3=<RadioGroup11 value="1" defaultValue="1"/>;
// @ts-expect-error reject 4
const bad4=<RadioGroup11 value={false}/>;
// @ts-expect-error reject 5
const bad5=<RadioGroup11 value={1}/>;
// @ts-expect-error reject 6
const bad6=<RadioGroup11 value={[]}/>;
// @ts-expect-error reject 7
const bad7=<RadioGroup11 orientation="diagonal"/>;
// @ts-expect-error reject 8
const bad8=<RadioGroup11 loop="yes"/>;
// @ts-expect-error reject 9
const bad9=<RadioGroup11 disabled="yes"/>;
// @ts-expect-error reject 10
const bad10=<RadioGroup11 required="yes"/>;
// @ts-expect-error reject 11
const bad11=<RadioGroup11 itemProps={{bad:{disabled:true}}}/>;
// @ts-expect-error reject 12
const bad12=<RadioGroup11 labelProps={{bad:{title:"x"}}}/>;
// @ts-expect-error reject 13
const bad13=<RadioGroup11 itemProps={{'1':{checked:true}}}/>;
// @ts-expect-error reject 14
const bad14=<RadioGroup11 itemProps={{'1':{name:"override"}}}/>;
// @ts-expect-error reject 15
const bad15=<RadioGroup11 itemProps={{'1':{id:"override"}}}/>;
// @ts-expect-error reject 16
const bad16=<RadioGroup11 itemProps={{'1':{"aria-label":"generic"}}}/>;
// @ts-expect-error reject 17
const bad17=<RadioGroup11 labelProps={{'1':{htmlFor:"override"}}}/>;
// @ts-expect-error reject 18
const bad18=<RadioGroup11 itemProps={{'1':{ref:React.createRef<HTMLButtonElement>()}}}/>;
// @ts-expect-error reject 19
const bad19=<RadioGroup11 ref={React.createRef<SVGSVGElement>()}/>;
// @ts-expect-error reject 20
const bad20=<RadioGroup11 children="Replacement"/>;
// @ts-expect-error reject 21
const bad21=<RadioGroup11 dangerouslySetInnerHTML={{__html:"x"}}/>;
// @ts-expect-error reject 22
const bad22=<RadioGroup11 onValueChange={()=>true}/>;
const details11=<RadioGroup11 onValueChange={(next,details)=>{
// @ts-expect-error wrong canonical id
const wrong:'radio-group-99'=details.id;
if(details.reason==='reset'){
// @ts-expect-error reset has no native input
const wrongInput:HTMLInputElement=details.input;
}}}/>;
const good12=<RadioGroup12 defaultValue="starter" ref={React.createRef<HTMLDivElement>()} name="g12" form="external" required orientation="horizontal" loop={false} itemProps={{'starter':{ref:input=>{if(input){input.checkValidity();return()=>{};}},onClick:event=>event.currentTarget.checked,'aria-describedby':'extra','aria-labelledby':'title'}}} labelProps={{'starter':{ref:label=>{if(label)label.htmlFor;}}}} onValueChange={(next,details)=>{const id:'radio-group-12'=details.id;if(details.reason==='reset'){const event:Event=details.event;const input:null=details.input;}else if(details.reason==='keyboard'){details.event.key;details.input.checked;}else{details.event.button;details.input.form;}details.cancel();return false;}}/>;
const empty12=<RadioGroup12 value={null}/>;const release12=<RadioGroup12 value={undefined}/>;
// @ts-expect-error reject 25
const bad25=<RadioGroup12 value="invalid"/>;
// @ts-expect-error reject 26
const bad26=<RadioGroup12 defaultValue="invalid"/>;
// @ts-expect-error reject 27
const bad27=<RadioGroup12 value="starter" defaultValue="starter"/>;
// @ts-expect-error reject 28
const bad28=<RadioGroup12 value={false}/>;
// @ts-expect-error reject 29
const bad29=<RadioGroup12 value={1}/>;
// @ts-expect-error reject 30
const bad30=<RadioGroup12 value={[]}/>;
// @ts-expect-error reject 31
const bad31=<RadioGroup12 orientation="diagonal"/>;
// @ts-expect-error reject 32
const bad32=<RadioGroup12 loop="yes"/>;
// @ts-expect-error reject 33
const bad33=<RadioGroup12 disabled="yes"/>;
// @ts-expect-error reject 34
const bad34=<RadioGroup12 required="yes"/>;
// @ts-expect-error reject 35
const bad35=<RadioGroup12 itemProps={{bad:{disabled:true}}}/>;
// @ts-expect-error reject 36
const bad36=<RadioGroup12 labelProps={{bad:{title:"x"}}}/>;
// @ts-expect-error reject 37
const bad37=<RadioGroup12 itemProps={{'starter':{checked:true}}}/>;
// @ts-expect-error reject 38
const bad38=<RadioGroup12 itemProps={{'starter':{name:"override"}}}/>;
// @ts-expect-error reject 39
const bad39=<RadioGroup12 itemProps={{'starter':{id:"override"}}}/>;
// @ts-expect-error reject 40
const bad40=<RadioGroup12 itemProps={{'starter':{"aria-label":"generic"}}}/>;
// @ts-expect-error reject 41
const bad41=<RadioGroup12 labelProps={{'starter':{htmlFor:"override"}}}/>;
// @ts-expect-error reject 42
const bad42=<RadioGroup12 itemProps={{'starter':{ref:React.createRef<HTMLButtonElement>()}}}/>;
// @ts-expect-error reject 43
const bad43=<RadioGroup12 ref={React.createRef<SVGSVGElement>()}/>;
// @ts-expect-error reject 44
const bad44=<RadioGroup12 children="Replacement"/>;
// @ts-expect-error reject 45
const bad45=<RadioGroup12 dangerouslySetInnerHTML={{__html:"x"}}/>;
// @ts-expect-error reject 46
const bad46=<RadioGroup12 onValueChange={()=>true}/>;
const details12=<RadioGroup12 onValueChange={(next,details)=>{
// @ts-expect-error wrong canonical id
const wrong:'radio-group-99'=details.id;
if(details.reason==='reset'){
// @ts-expect-error reset has no native input
const wrongInput:HTMLInputElement=details.input;
}}}/>;
const good13=<RadioGroup13 defaultValue="1" ref={React.createRef<HTMLFieldSetElement>()} name="g13" form="external" required orientation="horizontal" loop={false} itemProps={{'1':{ref:input=>{if(input){input.checkValidity();return()=>{};}},onClick:event=>event.currentTarget.checked,'aria-describedby':'extra','aria-labelledby':'title'}}} labelProps={{'1':{ref:label=>{if(label)label.htmlFor;}}}} onValueChange={(next,details)=>{const id:'radio-group-13'=details.id;if(details.reason==='reset'){const event:Event=details.event;const input:null=details.input;}else if(details.reason==='keyboard'){details.event.key;details.input.checked;}else{details.event.button;details.input.form;}details.cancel();return false;}}/>;
const empty13=<RadioGroup13 value={null}/>;const release13=<RadioGroup13 value={undefined}/>;
// @ts-expect-error reject 49
const bad49=<RadioGroup13 value="invalid"/>;
// @ts-expect-error reject 50
const bad50=<RadioGroup13 defaultValue="invalid"/>;
// @ts-expect-error reject 51
const bad51=<RadioGroup13 value="1" defaultValue="1"/>;
// @ts-expect-error reject 52
const bad52=<RadioGroup13 value={false}/>;
// @ts-expect-error reject 53
const bad53=<RadioGroup13 value={1}/>;
// @ts-expect-error reject 54
const bad54=<RadioGroup13 value={[]}/>;
// @ts-expect-error reject 55
const bad55=<RadioGroup13 orientation="diagonal"/>;
// @ts-expect-error reject 56
const bad56=<RadioGroup13 loop="yes"/>;
// @ts-expect-error reject 57
const bad57=<RadioGroup13 disabled="yes"/>;
// @ts-expect-error reject 58
const bad58=<RadioGroup13 required="yes"/>;
// @ts-expect-error reject 59
const bad59=<RadioGroup13 itemProps={{bad:{disabled:true}}}/>;
// @ts-expect-error reject 60
const bad60=<RadioGroup13 labelProps={{bad:{title:"x"}}}/>;
// @ts-expect-error reject 61
const bad61=<RadioGroup13 itemProps={{'1':{checked:true}}}/>;
// @ts-expect-error reject 62
const bad62=<RadioGroup13 itemProps={{'1':{name:"override"}}}/>;
// @ts-expect-error reject 63
const bad63=<RadioGroup13 itemProps={{'1':{id:"override"}}}/>;
// @ts-expect-error reject 64
const bad64=<RadioGroup13 itemProps={{'1':{"aria-label":"generic"}}}/>;
// @ts-expect-error reject 65
const bad65=<RadioGroup13 labelProps={{'1':{htmlFor:"override"}}}/>;
// @ts-expect-error reject 66
const bad66=<RadioGroup13 itemProps={{'1':{ref:React.createRef<HTMLButtonElement>()}}}/>;
// @ts-expect-error reject 67
const bad67=<RadioGroup13 ref={React.createRef<SVGSVGElement>()}/>;
// @ts-expect-error reject 68
const bad68=<RadioGroup13 children="Replacement"/>;
// @ts-expect-error reject 69
const bad69=<RadioGroup13 dangerouslySetInnerHTML={{__html:"x"}}/>;
// @ts-expect-error reject 70
const bad70=<RadioGroup13 onValueChange={()=>true}/>;
const details13=<RadioGroup13 onValueChange={(next,details)=>{
// @ts-expect-error wrong canonical id
const wrong:'radio-group-99'=details.id;
if(details.reason==='reset'){
// @ts-expect-error reset has no native input
const wrongInput:HTMLInputElement=details.input;
}}}/>;
const goodSwitch=<Switch19 defaultChecked name="sync" value="on" form="external" required readOnly={false} ref={node=>{if(node){node.checked;return()=>{};}}} rootProps={{ref:node=>{if(node){node.dataset.state;return()=>{};}},className:'card'}} onClick={e=>e.currentTarget.checked} onInput={e=>e.currentTarget.value} onChange={e=>e.currentTarget.checked} aria-labelledby="title" aria-describedby="hint" onCheckedChange={(next,details)=>{const value:boolean=next;const id:'switch-19'=details.id;const before:boolean=details.previousChecked;if(details.reason==='reset'){const node:HTMLInputElement=details.input;const native:Event=details.event;}else if(details.reason==='keyboard'){details.event.key;details.input.checked;}else{details.event.button;details.input.form;}details.cancel();return false;}}/>;
const switchRelease=<Switch19 checked={undefined}/>;
// @ts-expect-error reject 73
const bad73=<Switch19 checked="true"/>;
// @ts-expect-error reject 74
const bad74=<Switch19 defaultChecked="true"/>;
// @ts-expect-error reject 75
const bad75=<Switch19 checked={null}/>;
// @ts-expect-error reject 76
const bad76=<Switch19 checked={true} defaultChecked={false}/>;
// @ts-expect-error reject 77
const bad77=<Switch19 onCheckedChange={()=>true}/>;
// @ts-expect-error reject 78
const bad78=<Switch19 type="radio"/>;
// @ts-expect-error reject 79
const bad79=<Switch19 role="checkbox"/>;
// @ts-expect-error reject 80
const bad80=<Switch19 aria-checked={false}/>;
// @ts-expect-error reject 81
const bad81=<Switch19 aria-label="fake"/>;
// @ts-expect-error reject 82
const bad82=<Switch19 children="fake"/>;
// @ts-expect-error reject 83
const bad83=<Switch19 dangerouslySetInnerHTML={{__html:"fake"}}/>;
// @ts-expect-error reject 84
const bad84=<Switch19 rootProps={{children:"fake"}}/>;
// @ts-expect-error reject 85
const bad85=<Switch19 rootProps={{dangerouslySetInnerHTML:{__html:"fake"}}}/>;
// @ts-expect-error reject 86
const bad86=<Switch19 rootProps={{ref:React.createRef<SVGSVGElement>()}}/>;
// @ts-expect-error reject 87
const bad87=<Switch19 ref={React.createRef<HTMLButtonElement>()}/>;
// @ts-expect-error reject 88
const bad88=<Switch19 onCheckedChange={(next:string)=>{}}/>;
// @ts-expect-error reject 89
const bad89=<Switch19 disabled="yes"/>;
// @ts-expect-error reject 90
const bad90=<Switch19 readOnly="yes"/>;
// @ts-expect-error reject 91
const bad91=<Switch19 required="yes"/>;
// @ts-expect-error lower-case source identity mismatch
const wrongCase=<RadioGroup12 value="Starter"/>;
// @ts-expect-error fixed Tablet cannot be enabled through itemProps
const tabletEnable=<RadioGroup13 itemProps={{'2':{disabled:false}}}/>;
// @ts-expect-error fieldset ref cannot be a div
const fieldsetRef=<RadioGroup13 ref={React.createRef<HTMLDivElement>()}/>;
