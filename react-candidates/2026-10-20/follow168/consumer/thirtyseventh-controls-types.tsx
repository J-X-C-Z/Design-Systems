import * as React from 'react';
import {RadioGroup07,RadioGroup08,RadioGroup09,RadioGroup10, type Radio164ChangeDetails, type RadioGroup07Value} from '@follow-ui/react-seven';
const good07=<RadioGroup07 defaultValue="beginner" name="g07" form="owner" required orientation="horizontal" loop={false} itemProps={{'beginner':{ref:input=>{if(input){input.checkValidity();return()=>{};}},onClick:event=>event.currentTarget.checked,onChange:event=>event.currentTarget.value,'aria-describedby':'extra','aria-labelledby':'title'}}} labelProps={{'beginner':{ref:label=>{if(label)label.htmlFor;}}}} onValueChange={(next,details)=>{if(details.reason==='reset'){const formEvent:Event=details.event;const none:null=details.input;}else if(details.reason==='keyboard'){const key:string=details.event.key;details.input.checked;}else{details.event.button;details.input.form;}details.cancel();return false;}}/>;
const null07=<RadioGroup07 value={null} ref={React.createRef<HTMLDivElement>()}/>;
const release07=<RadioGroup07 value={undefined}/>;
// @ts-expect-error reject 1
const bad1=<RadioGroup07 value="invalid"/>;
// @ts-expect-error reject 2
const bad2=<RadioGroup07 defaultValue="invalid"/>;
// @ts-expect-error reject 3
const bad3=<RadioGroup07 value="beginner" defaultValue="beginner"/>;
// @ts-expect-error reject 4
const bad4=<RadioGroup07 value={false}/>;
// @ts-expect-error reject 5
const bad5=<RadioGroup07 value={1}/>;
// @ts-expect-error reject 6
const bad6=<RadioGroup07 value={[]}/>;
// @ts-expect-error reject 7
const bad7=<RadioGroup07 orientation="diagonal"/>;
// @ts-expect-error reject 8
const bad8=<RadioGroup07 loop="yes"/>;
// @ts-expect-error reject 9
const bad9=<RadioGroup07 disabled="yes"/>;
// @ts-expect-error reject 10
const bad10=<RadioGroup07 required="yes"/>;
// @ts-expect-error reject 11
const bad11=<RadioGroup07 itemProps={{bad:{disabled:true}}}/>;
// @ts-expect-error reject 12
const bad12=<RadioGroup07 labelProps={{bad:{title:"x"}}}/>;
// @ts-expect-error reject 13
const bad13=<RadioGroup07 itemProps={{'beginner':{checked:true}}}/>;
// @ts-expect-error reject 14
const bad14=<RadioGroup07 itemProps={{'beginner':{name:"override"}}}/>;
// @ts-expect-error reject 15
const bad15=<RadioGroup07 itemProps={{'beginner':{id:"override"}}}/>;
// @ts-expect-error reject 16
const bad16=<RadioGroup07 itemProps={{'beginner':{"aria-label":"generic"}}}/>;
// @ts-expect-error reject 17
const bad17=<RadioGroup07 labelProps={{'beginner':{htmlFor:"override"}}}/>;
// @ts-expect-error reject 18
const bad18=<RadioGroup07 itemProps={{'beginner':{ref:React.createRef<HTMLButtonElement>()}}}/>;
// @ts-expect-error reject 19
const bad19=<RadioGroup07 ref={React.createRef<SVGSVGElement>()}/>;
// @ts-expect-error reject 20
const bad20=<RadioGroup07 children="Replacement"/>;
// @ts-expect-error reject 21
const bad21=<RadioGroup07 dangerouslySetInnerHTML={{__html:"x"}}/>;
// @ts-expect-error reject 22
const bad22=<RadioGroup07 onValueChange={()=>true}/>;
const exact07=<RadioGroup07 onValueChange={(next,details)=>{const id:'radio-group-07'=details.id;
// @ts-expect-error wrong variant owner id
const wrong:'radio-group-99'=details.id;
if(details.reason==='reset'){
// @ts-expect-error reset has no input node
const input:HTMLInputElement=details.input;
}}}/>;
const good08=<RadioGroup08 defaultValue="default" name="g08" form="owner" required orientation="horizontal" loop={false} itemProps={{'default':{ref:input=>{if(input){input.checkValidity();return()=>{};}},onClick:event=>event.currentTarget.checked,onChange:event=>event.currentTarget.value,'aria-describedby':'extra','aria-labelledby':'title'}}} labelProps={{'default':{ref:label=>{if(label)label.htmlFor;}}}} onValueChange={(next,details)=>{if(details.reason==='reset'){const formEvent:Event=details.event;const none:null=details.input;}else if(details.reason==='keyboard'){const key:string=details.event.key;details.input.checked;}else{details.event.button;details.input.form;}details.cancel();return false;}}/>;
const null08=<RadioGroup08 value={null} ref={React.createRef<HTMLDivElement>()}/>;
const release08=<RadioGroup08 value={undefined}/>;
// @ts-expect-error reject 25
const bad25=<RadioGroup08 value="invalid"/>;
// @ts-expect-error reject 26
const bad26=<RadioGroup08 defaultValue="invalid"/>;
// @ts-expect-error reject 27
const bad27=<RadioGroup08 value="default" defaultValue="default"/>;
// @ts-expect-error reject 28
const bad28=<RadioGroup08 value={false}/>;
// @ts-expect-error reject 29
const bad29=<RadioGroup08 value={1}/>;
// @ts-expect-error reject 30
const bad30=<RadioGroup08 value={[]}/>;
// @ts-expect-error reject 31
const bad31=<RadioGroup08 orientation="diagonal"/>;
// @ts-expect-error reject 32
const bad32=<RadioGroup08 loop="yes"/>;
// @ts-expect-error reject 33
const bad33=<RadioGroup08 disabled="yes"/>;
// @ts-expect-error reject 34
const bad34=<RadioGroup08 required="yes"/>;
// @ts-expect-error reject 35
const bad35=<RadioGroup08 itemProps={{bad:{disabled:true}}}/>;
// @ts-expect-error reject 36
const bad36=<RadioGroup08 labelProps={{bad:{title:"x"}}}/>;
// @ts-expect-error reject 37
const bad37=<RadioGroup08 itemProps={{'default':{checked:true}}}/>;
// @ts-expect-error reject 38
const bad38=<RadioGroup08 itemProps={{'default':{name:"override"}}}/>;
// @ts-expect-error reject 39
const bad39=<RadioGroup08 itemProps={{'default':{id:"override"}}}/>;
// @ts-expect-error reject 40
const bad40=<RadioGroup08 itemProps={{'default':{"aria-label":"generic"}}}/>;
// @ts-expect-error reject 41
const bad41=<RadioGroup08 labelProps={{'default':{htmlFor:"override"}}}/>;
// @ts-expect-error reject 42
const bad42=<RadioGroup08 itemProps={{'default':{ref:React.createRef<HTMLButtonElement>()}}}/>;
// @ts-expect-error reject 43
const bad43=<RadioGroup08 ref={React.createRef<SVGSVGElement>()}/>;
// @ts-expect-error reject 44
const bad44=<RadioGroup08 children="Replacement"/>;
// @ts-expect-error reject 45
const bad45=<RadioGroup08 dangerouslySetInnerHTML={{__html:"x"}}/>;
// @ts-expect-error reject 46
const bad46=<RadioGroup08 onValueChange={()=>true}/>;
const exact08=<RadioGroup08 onValueChange={(next,details)=>{const id:'radio-group-08'=details.id;
// @ts-expect-error wrong variant owner id
const wrong:'radio-group-99'=details.id;
if(details.reason==='reset'){
// @ts-expect-error reset has no input node
const input:HTMLInputElement=details.input;
}}}/>;
const good09=<RadioGroup09 defaultValue="warning" name="g09" form="owner" required orientation="horizontal" loop={false} itemProps={{'warning':{ref:input=>{if(input){input.checkValidity();return()=>{};}},onClick:event=>event.currentTarget.checked,onChange:event=>event.currentTarget.value,'aria-describedby':'extra','aria-labelledby':'title'}}} labelProps={{'warning':{ref:label=>{if(label)label.htmlFor;}}}} onValueChange={(next,details)=>{if(details.reason==='reset'){const formEvent:Event=details.event;const none:null=details.input;}else if(details.reason==='keyboard'){const key:string=details.event.key;details.input.checked;}else{details.event.button;details.input.form;}details.cancel();return false;}}/>;
const null09=<RadioGroup09 value={null} ref={React.createRef<HTMLDivElement>()}/>;
const release09=<RadioGroup09 value={undefined}/>;
// @ts-expect-error reject 49
const bad49=<RadioGroup09 value="invalid"/>;
// @ts-expect-error reject 50
const bad50=<RadioGroup09 defaultValue="invalid"/>;
// @ts-expect-error reject 51
const bad51=<RadioGroup09 value="warning" defaultValue="warning"/>;
// @ts-expect-error reject 52
const bad52=<RadioGroup09 value={false}/>;
// @ts-expect-error reject 53
const bad53=<RadioGroup09 value={1}/>;
// @ts-expect-error reject 54
const bad54=<RadioGroup09 value={[]}/>;
// @ts-expect-error reject 55
const bad55=<RadioGroup09 orientation="diagonal"/>;
// @ts-expect-error reject 56
const bad56=<RadioGroup09 loop="yes"/>;
// @ts-expect-error reject 57
const bad57=<RadioGroup09 disabled="yes"/>;
// @ts-expect-error reject 58
const bad58=<RadioGroup09 required="yes"/>;
// @ts-expect-error reject 59
const bad59=<RadioGroup09 itemProps={{bad:{disabled:true}}}/>;
// @ts-expect-error reject 60
const bad60=<RadioGroup09 labelProps={{bad:{title:"x"}}}/>;
// @ts-expect-error reject 61
const bad61=<RadioGroup09 itemProps={{'warning':{checked:true}}}/>;
// @ts-expect-error reject 62
const bad62=<RadioGroup09 itemProps={{'warning':{name:"override"}}}/>;
// @ts-expect-error reject 63
const bad63=<RadioGroup09 itemProps={{'warning':{id:"override"}}}/>;
// @ts-expect-error reject 64
const bad64=<RadioGroup09 itemProps={{'warning':{"aria-label":"generic"}}}/>;
// @ts-expect-error reject 65
const bad65=<RadioGroup09 labelProps={{'warning':{htmlFor:"override"}}}/>;
// @ts-expect-error reject 66
const bad66=<RadioGroup09 itemProps={{'warning':{ref:React.createRef<HTMLButtonElement>()}}}/>;
// @ts-expect-error reject 67
const bad67=<RadioGroup09 ref={React.createRef<SVGSVGElement>()}/>;
// @ts-expect-error reject 68
const bad68=<RadioGroup09 children="Replacement"/>;
// @ts-expect-error reject 69
const bad69=<RadioGroup09 dangerouslySetInnerHTML={{__html:"x"}}/>;
// @ts-expect-error reject 70
const bad70=<RadioGroup09 onValueChange={()=>true}/>;
const exact09=<RadioGroup09 onValueChange={(next,details)=>{const id:'radio-group-09'=details.id;
// @ts-expect-error wrong variant owner id
const wrong:'radio-group-99'=details.id;
if(details.reason==='reset'){
// @ts-expect-error reset has no input node
const input:HTMLInputElement=details.input;
}}}/>;
const good10=<RadioGroup10 defaultValue="1" name="g10" form="owner" required orientation="horizontal" loop={false} itemProps={{'1':{ref:input=>{if(input){input.checkValidity();return()=>{};}},onClick:event=>event.currentTarget.checked,onChange:event=>event.currentTarget.value,'aria-describedby':'extra','aria-labelledby':'title'}}} labelProps={{'1':{ref:label=>{if(label)label.htmlFor;}}}} onValueChange={(next,details)=>{if(details.reason==='reset'){const formEvent:Event=details.event;const none:null=details.input;}else if(details.reason==='keyboard'){const key:string=details.event.key;details.input.checked;}else{details.event.button;details.input.form;}details.cancel();return false;}}/>;
const null10=<RadioGroup10 value={null} ref={React.createRef<HTMLDivElement>()}/>;
const release10=<RadioGroup10 value={undefined}/>;
// @ts-expect-error reject 73
const bad73=<RadioGroup10 value="invalid"/>;
// @ts-expect-error reject 74
const bad74=<RadioGroup10 defaultValue="invalid"/>;
// @ts-expect-error reject 75
const bad75=<RadioGroup10 value="1" defaultValue="1"/>;
// @ts-expect-error reject 76
const bad76=<RadioGroup10 value={false}/>;
// @ts-expect-error reject 77
const bad77=<RadioGroup10 value={1}/>;
// @ts-expect-error reject 78
const bad78=<RadioGroup10 value={[]}/>;
// @ts-expect-error reject 79
const bad79=<RadioGroup10 orientation="diagonal"/>;
// @ts-expect-error reject 80
const bad80=<RadioGroup10 loop="yes"/>;
// @ts-expect-error reject 81
const bad81=<RadioGroup10 disabled="yes"/>;
// @ts-expect-error reject 82
const bad82=<RadioGroup10 required="yes"/>;
// @ts-expect-error reject 83
const bad83=<RadioGroup10 itemProps={{bad:{disabled:true}}}/>;
// @ts-expect-error reject 84
const bad84=<RadioGroup10 labelProps={{bad:{title:"x"}}}/>;
// @ts-expect-error reject 85
const bad85=<RadioGroup10 itemProps={{'1':{checked:true}}}/>;
// @ts-expect-error reject 86
const bad86=<RadioGroup10 itemProps={{'1':{name:"override"}}}/>;
// @ts-expect-error reject 87
const bad87=<RadioGroup10 itemProps={{'1':{id:"override"}}}/>;
// @ts-expect-error reject 88
const bad88=<RadioGroup10 itemProps={{'1':{"aria-label":"generic"}}}/>;
// @ts-expect-error reject 89
const bad89=<RadioGroup10 labelProps={{'1':{htmlFor:"override"}}}/>;
// @ts-expect-error reject 90
const bad90=<RadioGroup10 itemProps={{'1':{ref:React.createRef<HTMLButtonElement>()}}}/>;
// @ts-expect-error reject 91
const bad91=<RadioGroup10 ref={React.createRef<SVGSVGElement>()}/>;
// @ts-expect-error reject 92
const bad92=<RadioGroup10 children="Replacement"/>;
// @ts-expect-error reject 93
const bad93=<RadioGroup10 dangerouslySetInnerHTML={{__html:"x"}}/>;
// @ts-expect-error reject 94
const bad94=<RadioGroup10 onValueChange={()=>true}/>;
const exact10=<RadioGroup10 onValueChange={(next,details)=>{const id:'radio-group-10'=details.id;
// @ts-expect-error wrong variant owner id
const wrong:'radio-group-99'=details.id;
if(details.reason==='reset'){
// @ts-expect-error reset has no input node
const input:HTMLInputElement=details.input;
}}}/>;

// @ts-expect-error source uses capital-A Advanced, not lowercase
const wrongCase=<RadioGroup07 value="advanced"/>;
// @ts-expect-error 07 value cannot leak to another variant
const wrongFamily=<RadioGroup08 value="Advanced"/>;
