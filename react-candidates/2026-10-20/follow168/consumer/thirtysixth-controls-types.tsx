import * as React from 'react';
import {RadioGroup03,RadioGroup04,RadioGroup05,RadioGroup06, type Radio160ChangeDetails, type RadioGroup03Value} from '@follow-ui/react-seven';
const good03=<RadioGroup03 defaultValue="light" name="g03" form="owner" required orientation="horizontal" loop={false} itemProps={{'light':{ref:input=>{if(input){input.checkValidity();return()=>{};}},onClick:event=>event.currentTarget.checked,onChange:event=>event.currentTarget.value,'aria-describedby':'extra','aria-labelledby':'title'}}} labelProps={{'light':{ref:label=>{if(label)label.htmlFor;}}}} onValueChange={(next,details)=>{if(details.reason==='reset'){const formEvent:Event=details.event;const none:null=details.input;}else if(details.reason==='keyboard'){const key:string=details.event.key;details.input.checked;}else{details.event.button;details.input.form;}details.cancel();return false;}}/>;
const null03=<RadioGroup03 value={null} ref={React.createRef<HTMLDivElement>()}/>;
const release03=<RadioGroup03 value={undefined}/>;
// @ts-expect-error reject 1
const bad1=<RadioGroup03 value="invalid"/>;
// @ts-expect-error reject 2
const bad2=<RadioGroup03 defaultValue="invalid"/>;
// @ts-expect-error reject 3
const bad3=<RadioGroup03 value="light" defaultValue="light"/>;
// @ts-expect-error reject 4
const bad4=<RadioGroup03 value={false}/>;
// @ts-expect-error reject 5
const bad5=<RadioGroup03 value={1}/>;
// @ts-expect-error reject 6
const bad6=<RadioGroup03 value={[]}/>;
// @ts-expect-error reject 7
const bad7=<RadioGroup03 orientation="diagonal"/>;
// @ts-expect-error reject 8
const bad8=<RadioGroup03 loop="yes"/>;
// @ts-expect-error reject 9
const bad9=<RadioGroup03 disabled="yes"/>;
// @ts-expect-error reject 10
const bad10=<RadioGroup03 required="yes"/>;
// @ts-expect-error reject 11
const bad11=<RadioGroup03 itemProps={{bad:{disabled:true}}}/>;
// @ts-expect-error reject 12
const bad12=<RadioGroup03 labelProps={{bad:{title:"x"}}}/>;
// @ts-expect-error reject 13
const bad13=<RadioGroup03 itemProps={{'light':{checked:true}}}/>;
// @ts-expect-error reject 14
const bad14=<RadioGroup03 itemProps={{'light':{name:"override"}}}/>;
// @ts-expect-error reject 15
const bad15=<RadioGroup03 itemProps={{'light':{id:"override"}}}/>;
// @ts-expect-error reject 16
const bad16=<RadioGroup03 itemProps={{'light':{"aria-label":"generic"}}}/>;
// @ts-expect-error reject 17
const bad17=<RadioGroup03 labelProps={{'light':{htmlFor:"override"}}}/>;
// @ts-expect-error reject 18
const bad18=<RadioGroup03 itemProps={{'light':{ref:React.createRef<HTMLButtonElement>()}}}/>;
// @ts-expect-error reject 19
const bad19=<RadioGroup03 ref={React.createRef<SVGSVGElement>()}/>;
// @ts-expect-error reject 20
const bad20=<RadioGroup03 children="Replacement"/>;
// @ts-expect-error reject 21
const bad21=<RadioGroup03 dangerouslySetInnerHTML={{__html:"x"}}/>;
// @ts-expect-error reject 22
const bad22=<RadioGroup03 onValueChange={()=>true}/>;
const exact03=<RadioGroup03 onValueChange={(next,details)=>{const id:'radio-group-03'=details.id;
// @ts-expect-error wrong variant owner id
const wrong:'radio-group-99'=details.id;
if(details.reason==='reset'){
// @ts-expect-error reset has no input node
const input:HTMLInputElement=details.input;
}}}/>;
const good04=<RadioGroup04 defaultValue="starter" name="g04" form="owner" required orientation="horizontal" loop={false} itemProps={{'starter':{ref:input=>{if(input){input.checkValidity();return()=>{};}},onClick:event=>event.currentTarget.checked,onChange:event=>event.currentTarget.value,'aria-describedby':'extra','aria-labelledby':'title'}}} labelProps={{'starter':{ref:label=>{if(label)label.htmlFor;}}}} onValueChange={(next,details)=>{if(details.reason==='reset'){const formEvent:Event=details.event;const none:null=details.input;}else if(details.reason==='keyboard'){const key:string=details.event.key;details.input.checked;}else{details.event.button;details.input.form;}details.cancel();return false;}}/>;
const null04=<RadioGroup04 value={null} ref={React.createRef<HTMLDivElement>()}/>;
const release04=<RadioGroup04 value={undefined}/>;
// @ts-expect-error reject 25
const bad25=<RadioGroup04 value="invalid"/>;
// @ts-expect-error reject 26
const bad26=<RadioGroup04 defaultValue="invalid"/>;
// @ts-expect-error reject 27
const bad27=<RadioGroup04 value="starter" defaultValue="starter"/>;
// @ts-expect-error reject 28
const bad28=<RadioGroup04 value={false}/>;
// @ts-expect-error reject 29
const bad29=<RadioGroup04 value={1}/>;
// @ts-expect-error reject 30
const bad30=<RadioGroup04 value={[]}/>;
// @ts-expect-error reject 31
const bad31=<RadioGroup04 orientation="diagonal"/>;
// @ts-expect-error reject 32
const bad32=<RadioGroup04 loop="yes"/>;
// @ts-expect-error reject 33
const bad33=<RadioGroup04 disabled="yes"/>;
// @ts-expect-error reject 34
const bad34=<RadioGroup04 required="yes"/>;
// @ts-expect-error reject 35
const bad35=<RadioGroup04 itemProps={{bad:{disabled:true}}}/>;
// @ts-expect-error reject 36
const bad36=<RadioGroup04 labelProps={{bad:{title:"x"}}}/>;
// @ts-expect-error reject 37
const bad37=<RadioGroup04 itemProps={{'starter':{checked:true}}}/>;
// @ts-expect-error reject 38
const bad38=<RadioGroup04 itemProps={{'starter':{name:"override"}}}/>;
// @ts-expect-error reject 39
const bad39=<RadioGroup04 itemProps={{'starter':{id:"override"}}}/>;
// @ts-expect-error reject 40
const bad40=<RadioGroup04 itemProps={{'starter':{"aria-label":"generic"}}}/>;
// @ts-expect-error reject 41
const bad41=<RadioGroup04 labelProps={{'starter':{htmlFor:"override"}}}/>;
// @ts-expect-error reject 42
const bad42=<RadioGroup04 itemProps={{'starter':{ref:React.createRef<HTMLButtonElement>()}}}/>;
// @ts-expect-error reject 43
const bad43=<RadioGroup04 ref={React.createRef<SVGSVGElement>()}/>;
// @ts-expect-error reject 44
const bad44=<RadioGroup04 children="Replacement"/>;
// @ts-expect-error reject 45
const bad45=<RadioGroup04 dangerouslySetInnerHTML={{__html:"x"}}/>;
// @ts-expect-error reject 46
const bad46=<RadioGroup04 onValueChange={()=>true}/>;
const exact04=<RadioGroup04 onValueChange={(next,details)=>{const id:'radio-group-04'=details.id;
// @ts-expect-error wrong variant owner id
const wrong:'radio-group-99'=details.id;
if(details.reason==='reset'){
// @ts-expect-error reset has no input node
const input:HTMLInputElement=details.input;
}}}/>;
const good05=<RadioGroup05 defaultValue="1" name="g05" form="owner" required orientation="horizontal" loop={false} itemProps={{'1':{ref:input=>{if(input){input.checkValidity();return()=>{};}},onClick:event=>event.currentTarget.checked,onChange:event=>event.currentTarget.value,'aria-describedby':'extra','aria-labelledby':'title'}}} labelProps={{'1':{ref:label=>{if(label)label.htmlFor;}}}} onValueChange={(next,details)=>{if(details.reason==='reset'){const formEvent:Event=details.event;const none:null=details.input;}else if(details.reason==='keyboard'){const key:string=details.event.key;details.input.checked;}else{details.event.button;details.input.form;}details.cancel();return false;}}/>;
const null05=<RadioGroup05 value={null} ref={React.createRef<HTMLDivElement>()}/>;
const release05=<RadioGroup05 value={undefined}/>;
// @ts-expect-error reject 49
const bad49=<RadioGroup05 value="invalid"/>;
// @ts-expect-error reject 50
const bad50=<RadioGroup05 defaultValue="invalid"/>;
// @ts-expect-error reject 51
const bad51=<RadioGroup05 value="1" defaultValue="1"/>;
// @ts-expect-error reject 52
const bad52=<RadioGroup05 value={false}/>;
// @ts-expect-error reject 53
const bad53=<RadioGroup05 value={1}/>;
// @ts-expect-error reject 54
const bad54=<RadioGroup05 value={[]}/>;
// @ts-expect-error reject 55
const bad55=<RadioGroup05 orientation="diagonal"/>;
// @ts-expect-error reject 56
const bad56=<RadioGroup05 loop="yes"/>;
// @ts-expect-error reject 57
const bad57=<RadioGroup05 disabled="yes"/>;
// @ts-expect-error reject 58
const bad58=<RadioGroup05 required="yes"/>;
// @ts-expect-error reject 59
const bad59=<RadioGroup05 itemProps={{bad:{disabled:true}}}/>;
// @ts-expect-error reject 60
const bad60=<RadioGroup05 labelProps={{bad:{title:"x"}}}/>;
// @ts-expect-error reject 61
const bad61=<RadioGroup05 itemProps={{'1':{checked:true}}}/>;
// @ts-expect-error reject 62
const bad62=<RadioGroup05 itemProps={{'1':{name:"override"}}}/>;
// @ts-expect-error reject 63
const bad63=<RadioGroup05 itemProps={{'1':{id:"override"}}}/>;
// @ts-expect-error reject 64
const bad64=<RadioGroup05 itemProps={{'1':{"aria-label":"generic"}}}/>;
// @ts-expect-error reject 65
const bad65=<RadioGroup05 labelProps={{'1':{htmlFor:"override"}}}/>;
// @ts-expect-error reject 66
const bad66=<RadioGroup05 itemProps={{'1':{ref:React.createRef<HTMLButtonElement>()}}}/>;
// @ts-expect-error reject 67
const bad67=<RadioGroup05 ref={React.createRef<SVGSVGElement>()}/>;
// @ts-expect-error reject 68
const bad68=<RadioGroup05 children="Replacement"/>;
// @ts-expect-error reject 69
const bad69=<RadioGroup05 dangerouslySetInnerHTML={{__html:"x"}}/>;
// @ts-expect-error reject 70
const bad70=<RadioGroup05 onValueChange={()=>true}/>;
const exact05=<RadioGroup05 onValueChange={(next,details)=>{const id:'radio-group-05'=details.id;
// @ts-expect-error wrong variant owner id
const wrong:'radio-group-99'=details.id;
if(details.reason==='reset'){
// @ts-expect-error reset has no input node
const input:HTMLInputElement=details.input;
}}}/>;
const good06=<RadioGroup06 defaultValue="starter" name="g06" form="owner" required orientation="horizontal" loop={false} itemProps={{'starter':{ref:input=>{if(input){input.checkValidity();return()=>{};}},onClick:event=>event.currentTarget.checked,onChange:event=>event.currentTarget.value,'aria-describedby':'extra','aria-labelledby':'title'}}} labelProps={{'starter':{ref:label=>{if(label)label.htmlFor;}}}} onValueChange={(next,details)=>{if(details.reason==='reset'){const formEvent:Event=details.event;const none:null=details.input;}else if(details.reason==='keyboard'){const key:string=details.event.key;details.input.checked;}else{details.event.button;details.input.form;}details.cancel();return false;}}/>;
const null06=<RadioGroup06 value={null} ref={React.createRef<HTMLDivElement>()}/>;
const release06=<RadioGroup06 value={undefined}/>;
// @ts-expect-error reject 73
const bad73=<RadioGroup06 value="invalid"/>;
// @ts-expect-error reject 74
const bad74=<RadioGroup06 defaultValue="invalid"/>;
// @ts-expect-error reject 75
const bad75=<RadioGroup06 value="starter" defaultValue="starter"/>;
// @ts-expect-error reject 76
const bad76=<RadioGroup06 value={false}/>;
// @ts-expect-error reject 77
const bad77=<RadioGroup06 value={1}/>;
// @ts-expect-error reject 78
const bad78=<RadioGroup06 value={[]}/>;
// @ts-expect-error reject 79
const bad79=<RadioGroup06 orientation="diagonal"/>;
// @ts-expect-error reject 80
const bad80=<RadioGroup06 loop="yes"/>;
// @ts-expect-error reject 81
const bad81=<RadioGroup06 disabled="yes"/>;
// @ts-expect-error reject 82
const bad82=<RadioGroup06 required="yes"/>;
// @ts-expect-error reject 83
const bad83=<RadioGroup06 itemProps={{bad:{disabled:true}}}/>;
// @ts-expect-error reject 84
const bad84=<RadioGroup06 labelProps={{bad:{title:"x"}}}/>;
// @ts-expect-error reject 85
const bad85=<RadioGroup06 itemProps={{'starter':{checked:true}}}/>;
// @ts-expect-error reject 86
const bad86=<RadioGroup06 itemProps={{'starter':{name:"override"}}}/>;
// @ts-expect-error reject 87
const bad87=<RadioGroup06 itemProps={{'starter':{id:"override"}}}/>;
// @ts-expect-error reject 88
const bad88=<RadioGroup06 itemProps={{'starter':{"aria-label":"generic"}}}/>;
// @ts-expect-error reject 89
const bad89=<RadioGroup06 labelProps={{'starter':{htmlFor:"override"}}}/>;
// @ts-expect-error reject 90
const bad90=<RadioGroup06 itemProps={{'starter':{ref:React.createRef<HTMLButtonElement>()}}}/>;
// @ts-expect-error reject 91
const bad91=<RadioGroup06 ref={React.createRef<SVGSVGElement>()}/>;
// @ts-expect-error reject 92
const bad92=<RadioGroup06 children="Replacement"/>;
// @ts-expect-error reject 93
const bad93=<RadioGroup06 dangerouslySetInnerHTML={{__html:"x"}}/>;
// @ts-expect-error reject 94
const bad94=<RadioGroup06 onValueChange={()=>true}/>;
const exact06=<RadioGroup06 onValueChange={(next,details)=>{const id:'radio-group-06'=details.id;
// @ts-expect-error wrong variant owner id
const wrong:'radio-group-99'=details.id;
if(details.reason==='reset'){
// @ts-expect-error reset has no input node
const input:HTMLInputElement=details.input;
}}}/>;
// @ts-expect-error native radio role protected
const badRole03=<RadioGroup03 itemProps={{'light':{role:'checkbox'}}}/>;
// @ts-expect-error native checked semantics protected
const badCheckedAria03=<RadioGroup03 itemProps={{'light':{'aria-checked':false}}}/>;
// @ts-expect-error native radio role protected
const badRole04=<RadioGroup04 itemProps={{'starter':{role:'checkbox'}}}/>;
// @ts-expect-error native checked semantics protected
const badCheckedAria04=<RadioGroup04 itemProps={{'starter':{'aria-checked':false}}}/>;
// @ts-expect-error native radio role protected
const badRole05=<RadioGroup05 itemProps={{'1':{role:'checkbox'}}}/>;
// @ts-expect-error native checked semantics protected
const badCheckedAria05=<RadioGroup05 itemProps={{'1':{'aria-checked':false}}}/>;
// @ts-expect-error native radio role protected
const badRole06=<RadioGroup06 itemProps={{'starter':{role:'checkbox'}}}/>;
// @ts-expect-error native checked semantics protected
const badCheckedAria06=<RadioGroup06 itemProps={{'starter':{'aria-checked':false}}}/>;
