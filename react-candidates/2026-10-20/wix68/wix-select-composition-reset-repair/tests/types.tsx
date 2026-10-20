import * as React from 'react';
import {Select14,Select15,Select16,Select17,wixSelectCompositionIds,type SelectCompositionProps,type Select15Props,type Select15SlotProps,type SelectItem,type SelectValueChangeDetail,type SelectOpenChangeDetail,type WixSelectCompositionId} from '../src/index.js';
const button=React.createRef<HTMLButtonElement>(),div=React.createRef<HTMLDivElement>(),select=React.createRef<HTMLSelectElement>(),input=React.createRef<HTMLInputElement>();
const options:readonly SelectItem[]=[{label:'Group',disabled:false,options:[{value:'a',label:'Alpha'},{value:'b',label:'Beta',disabled:true}]},{value:'c',label:'Gamma'}];
const valueHandler=(value:string,detail:SelectValueChangeDetail)=>{const kind:'pointer'|'keyboard'=detail.reason;const original:Event=detail.originalEvent;const yes:true=detail.cancelable;const canceled:boolean=detail.defaultPrevented;if(value==='cancel')detail.preventDefault();void[kind,original,yes,canceled];};
const openHandler=(value:boolean,detail:SelectOpenChangeDetail)=>{const reason:string=detail.reason;detail.preventDefault();void[value,reason];};
const props:SelectCompositionProps={options,defaultValue:'a',defaultOpen:false,label:'Label',placeholder:'Pick',helper:'Help',error:'Error',id:'id',name:'choice',form:'form',required:true,disabled:false,readOnly:false,dir:'rtl',motion:'off',className:'custom',style:{color:'brown'},'aria-label':'Label','aria-describedby':'help','aria-invalid':false,onValueChange:valueHandler,onOpenChange:openHandler,triggerProps:{title:'Info',tabIndex:0,autoFocus:false,onClick:e=>e.currentTarget.focus(),onClickCapture:e=>e.preventDefault(),onKeyDown:e=>{e.currentTarget.focus();void e.key},onKeyDownCapture:e=>e.nativeEvent.preventDefault(),onPointerDown:e=>{void e.pointerType},onPointerDownCapture:e=>e.preventDefault(),onFocus:e=>e.currentTarget.focus(),onFocusCapture:e=>e.preventDefault(),onBlur:e=>e.currentTarget.focus(),onBlurCapture:e=>e.preventDefault()}};
<Select14 {...props} warning="Stable note" ref={button}/>;
<Select16 {...props} ref={button}/>;
<Select17 {...props} ref={button}/>;
const slot:Select15SlotProps={...props,triggerRef:button};
const composition:Select15Props={small:slot,standard:{options,value:'b',open:true,onValueChange:valueHandler,onOpenChange:openHandler,triggerRef:node=>{if(node)return()=>{void node.id}}},large:{defaultValue:'',required:true,form:'other',triggerRef:button},id:'memory',dir:'ltr',motion:'system',className:'layout',style:{gap:16},'aria-label':'Memory','aria-describedby':'description'};
<Select15 {...composition} ref={div}/>;
<Select15 ref={node=>{if(node)return()=>{void node.align}}}/>;
const id:WixSelectCompositionId='select-15';void[id,wixSelectCompositionIds];
// @ts-expect-error N001 Select14 number value
<Select14 value={3}/>;
// @ts-expect-error N002 Select14 boolean default value
<Select14 defaultValue={false}/>;
// @ts-expect-error N003 Select14 value plus default
<Select14 value="a" defaultValue="b"/>;
// @ts-expect-error N004 Select14 nullable value
<Select14 value={null}/>;
// @ts-expect-error N005 Select14 explicit undefined value
<Select14 value={undefined}/>;
// @ts-expect-error N006 Select14 explicit undefined default
<Select14 defaultValue={undefined}/>;
// @ts-expect-error N007 Select14 string open
<Select14 open="true"/>;
// @ts-expect-error N008 Select14 number default open
<Select14 defaultOpen={1}/>;
// @ts-expect-error N009 Select14 open plus default
<Select14 open={true} defaultOpen={false}/>;
// @ts-expect-error N010 Select14 nullable open
<Select14 open={null}/>;
// @ts-expect-error N011 Select14 explicit undefined open
<Select14 open={undefined}/>;
// @ts-expect-error N012 Select14 native change
<Select14 onChange={()=>{}}/>;
// @ts-expect-error N013 Select14 native multiple
<Select14 multiple/>;
// @ts-expect-error N014 Select14 children
<Select14 children="wrong"/>;
// @ts-expect-error N015 Select14 asChild
<Select14 asChild/>;
// @ts-expect-error N016 Select14 native select size
<Select14 size={3}/>;
// @ts-expect-error N017 Select14 native button type
<Select14 type="submit"/>;
// @ts-expect-error N018 Select14 native default checked
<Select14 defaultChecked/>;
// @ts-expect-error N019 Select14 wrong motion
<Select14 motion="auto"/>;
// @ts-expect-error N020 Select14 wrong dir
<Select14 dir="auto"/>;
// @ts-expect-error N021 Select14 numeric name
<Select14 name={1}/>;
// @ts-expect-error N022 Select14 nullable helper
<Select14 helper={null}/>;
// @ts-expect-error N023 Select14 numeric label
<Select14 label={1}/>;
// @ts-expect-error N024 Select14 invalid selected aria string
<Select14 aria-invalid="maybe"/>;
// @ts-expect-error N025 Select14 wrong value callback
<Select14 onValueChange={(value:number)=>{}}/>;
// @ts-expect-error N026 Select14 wrong open callback
<Select14 onOpenChange={(value:string)=>{}}/>;
// @ts-expect-error N027 Select14 button prop bypass
<Select14 triggerProps={{type:"submit"}}/>;
// @ts-expect-error N028 Select14 button disabled bypass
<Select14 triggerProps={{disabled:true}}/>;
// @ts-expect-error N029 Select14 button children bypass
<Select14 triggerProps={{children:"child"}}/>;
// @ts-expect-error N030 Select14 button ref bypass
<Select14 triggerProps={{ref:button}}/>;
// @ts-expect-error N031 Select14 button wrong target
<Select14 triggerProps={{onKeyDown:e=>{void e.currentTarget.selectedOptions}}}/>;
// @ts-expect-error N032 Select14 option numeric value
<Select14 options={[{value:1,label:"A"}]}/>;
// @ts-expect-error N033 Select14 option nullable label
<Select14 options={[{value:"a",label:null}]}/>;
// @ts-expect-error N034 Select14 nested group
<Select14 options={[{label:"G",options:[{label:"Nested",options:[]}]}]}/>;
// @ts-expect-error N035 Select14 group value
<Select14 options={[{label:"G",value:"group",options:[]}]}/>;
// @ts-expect-error N036 Select14 group disabled string
<Select14 options={[{label:"G",disabled:"true",options:[]}]}/>;
// @ts-expect-error N037 Select14 wrong native ref
<Select14 ref={select}/>;
// @ts-expect-error N038 Select14 wrong div ref
<Select14 ref={div}/>;
// @ts-expect-error N039 Select14 readonly detail
<Select14 onValueChange={(v,d)=>{d.reason="pointer"}}/>;
// @ts-expect-error N040 Select16 number value
<Select16 value={3}/>;
// @ts-expect-error N041 Select16 boolean default value
<Select16 defaultValue={false}/>;
// @ts-expect-error N042 Select16 value plus default
<Select16 value="a" defaultValue="b"/>;
// @ts-expect-error N043 Select16 nullable value
<Select16 value={null}/>;
// @ts-expect-error N044 Select16 explicit undefined value
<Select16 value={undefined}/>;
// @ts-expect-error N045 Select16 explicit undefined default
<Select16 defaultValue={undefined}/>;
// @ts-expect-error N046 Select16 string open
<Select16 open="true"/>;
// @ts-expect-error N047 Select16 number default open
<Select16 defaultOpen={1}/>;
// @ts-expect-error N048 Select16 open plus default
<Select16 open={true} defaultOpen={false}/>;
// @ts-expect-error N049 Select16 nullable open
<Select16 open={null}/>;
// @ts-expect-error N050 Select16 explicit undefined open
<Select16 open={undefined}/>;
// @ts-expect-error N051 Select16 native change
<Select16 onChange={()=>{}}/>;
// @ts-expect-error N052 Select16 native multiple
<Select16 multiple/>;
// @ts-expect-error N053 Select16 children
<Select16 children="wrong"/>;
// @ts-expect-error N054 Select16 asChild
<Select16 asChild/>;
// @ts-expect-error N055 Select16 native select size
<Select16 size={3}/>;
// @ts-expect-error N056 Select16 native button type
<Select16 type="submit"/>;
// @ts-expect-error N057 Select16 native default checked
<Select16 defaultChecked/>;
// @ts-expect-error N058 Select16 wrong motion
<Select16 motion="auto"/>;
// @ts-expect-error N059 Select16 wrong dir
<Select16 dir="auto"/>;
// @ts-expect-error N060 Select16 numeric name
<Select16 name={1}/>;
// @ts-expect-error N061 Select16 nullable helper
<Select16 helper={null}/>;
// @ts-expect-error N062 Select16 numeric label
<Select16 label={1}/>;
// @ts-expect-error N063 Select16 invalid selected aria string
<Select16 aria-invalid="maybe"/>;
// @ts-expect-error N064 Select16 wrong value callback
<Select16 onValueChange={(value:number)=>{}}/>;
// @ts-expect-error N065 Select16 wrong open callback
<Select16 onOpenChange={(value:string)=>{}}/>;
// @ts-expect-error N066 Select16 button prop bypass
<Select16 triggerProps={{type:"submit"}}/>;
// @ts-expect-error N067 Select16 button disabled bypass
<Select16 triggerProps={{disabled:true}}/>;
// @ts-expect-error N068 Select16 button children bypass
<Select16 triggerProps={{children:"child"}}/>;
// @ts-expect-error N069 Select16 button ref bypass
<Select16 triggerProps={{ref:button}}/>;
// @ts-expect-error N070 Select16 button wrong target
<Select16 triggerProps={{onKeyDown:e=>{void e.currentTarget.selectedOptions}}}/>;
// @ts-expect-error N071 Select16 option numeric value
<Select16 options={[{value:1,label:"A"}]}/>;
// @ts-expect-error N072 Select16 option nullable label
<Select16 options={[{value:"a",label:null}]}/>;
// @ts-expect-error N073 Select16 nested group
<Select16 options={[{label:"G",options:[{label:"Nested",options:[]}]}]}/>;
// @ts-expect-error N074 Select16 group value
<Select16 options={[{label:"G",value:"group",options:[]}]}/>;
// @ts-expect-error N075 Select16 group disabled string
<Select16 options={[{label:"G",disabled:"true",options:[]}]}/>;
// @ts-expect-error N076 Select16 wrong native ref
<Select16 ref={select}/>;
// @ts-expect-error N077 Select16 wrong div ref
<Select16 ref={div}/>;
// @ts-expect-error N078 Select16 readonly detail
<Select16 onValueChange={(v,d)=>{d.reason="pointer"}}/>;
// @ts-expect-error N079 Select17 number value
<Select17 value={3}/>;
// @ts-expect-error N080 Select17 boolean default value
<Select17 defaultValue={false}/>;
// @ts-expect-error N081 Select17 value plus default
<Select17 value="a" defaultValue="b"/>;
// @ts-expect-error N082 Select17 nullable value
<Select17 value={null}/>;
// @ts-expect-error N083 Select17 explicit undefined value
<Select17 value={undefined}/>;
// @ts-expect-error N084 Select17 explicit undefined default
<Select17 defaultValue={undefined}/>;
// @ts-expect-error N085 Select17 string open
<Select17 open="true"/>;
// @ts-expect-error N086 Select17 number default open
<Select17 defaultOpen={1}/>;
// @ts-expect-error N087 Select17 open plus default
<Select17 open={true} defaultOpen={false}/>;
// @ts-expect-error N088 Select17 nullable open
<Select17 open={null}/>;
// @ts-expect-error N089 Select17 explicit undefined open
<Select17 open={undefined}/>;
// @ts-expect-error N090 Select17 native change
<Select17 onChange={()=>{}}/>;
// @ts-expect-error N091 Select17 native multiple
<Select17 multiple/>;
// @ts-expect-error N092 Select17 children
<Select17 children="wrong"/>;
// @ts-expect-error N093 Select17 asChild
<Select17 asChild/>;
// @ts-expect-error N094 Select17 native select size
<Select17 size={3}/>;
// @ts-expect-error N095 Select17 native button type
<Select17 type="submit"/>;
// @ts-expect-error N096 Select17 native default checked
<Select17 defaultChecked/>;
// @ts-expect-error N097 Select17 wrong motion
<Select17 motion="auto"/>;
// @ts-expect-error N098 Select17 wrong dir
<Select17 dir="auto"/>;
// @ts-expect-error N099 Select17 numeric name
<Select17 name={1}/>;
// @ts-expect-error N100 Select17 nullable helper
<Select17 helper={null}/>;
// @ts-expect-error N101 Select17 numeric label
<Select17 label={1}/>;
// @ts-expect-error N102 Select17 invalid selected aria string
<Select17 aria-invalid="maybe"/>;
// @ts-expect-error N103 Select17 wrong value callback
<Select17 onValueChange={(value:number)=>{}}/>;
// @ts-expect-error N104 Select17 wrong open callback
<Select17 onOpenChange={(value:string)=>{}}/>;
// @ts-expect-error N105 Select17 button prop bypass
<Select17 triggerProps={{type:"submit"}}/>;
// @ts-expect-error N106 Select17 button disabled bypass
<Select17 triggerProps={{disabled:true}}/>;
// @ts-expect-error N107 Select17 button children bypass
<Select17 triggerProps={{children:"child"}}/>;
// @ts-expect-error N108 Select17 button ref bypass
<Select17 triggerProps={{ref:button}}/>;
// @ts-expect-error N109 Select17 button wrong target
<Select17 triggerProps={{onKeyDown:e=>{void e.currentTarget.selectedOptions}}}/>;
// @ts-expect-error N110 Select17 option numeric value
<Select17 options={[{value:1,label:"A"}]}/>;
// @ts-expect-error N111 Select17 option nullable label
<Select17 options={[{value:"a",label:null}]}/>;
// @ts-expect-error N112 Select17 nested group
<Select17 options={[{label:"G",options:[{label:"Nested",options:[]}]}]}/>;
// @ts-expect-error N113 Select17 group value
<Select17 options={[{label:"G",value:"group",options:[]}]}/>;
// @ts-expect-error N114 Select17 group disabled string
<Select17 options={[{label:"G",disabled:"true",options:[]}]}/>;
// @ts-expect-error N115 Select17 wrong native ref
<Select17 ref={select}/>;
// @ts-expect-error N116 Select17 wrong div ref
<Select17 ref={div}/>;
// @ts-expect-error N117 Select17 readonly detail
<Select17 onValueChange={(v,d)=>{d.reason="pointer"}}/>;
// @ts-expect-error N118 Select15 small value number
<Select15 small={{value:3}}/>;
// @ts-expect-error N119 Select15 small default number
<Select15 small={{defaultValue:2}}/>;
// @ts-expect-error N120 Select15 small value plus default
<Select15 small={{value:"a",defaultValue:"b"}}/>;
// @ts-expect-error N121 Select15 small open string
<Select15 small={{open:"yes"}}/>;
// @ts-expect-error N122 Select15 small open plus default
<Select15 small={{open:true,defaultOpen:true}}/>;
// @ts-expect-error N123 Select15 small explicit undefined id
<Select15 small={{id:undefined}}/>;
// @ts-expect-error N124 Select15 small explicit undefined dir
<Select15 small={{dir:undefined}}/>;
// @ts-expect-error N125 Select15 small explicit undefined motion
<Select15 small={{motion:undefined}}/>;
// @ts-expect-error N126 Select15 small value callback
<Select15 small={{onValueChange:(v:number)=>{}}}/>;
// @ts-expect-error N127 Select15 small open callback
<Select15 small={{onOpenChange:(v:string)=>{}}}/>;
// @ts-expect-error N128 Select15 small native change
<Select15 small={{onChange:()=>{}}}/>;
// @ts-expect-error N129 Select15 small native ref
<Select15 small={{triggerRef:select}}/>;
// @ts-expect-error N130 Select15 small div ref
<Select15 small={{triggerRef:div}}/>;
// @ts-expect-error N131 Select15 small root ref
<Select15 small={{ref:button}}/>;
// @ts-expect-error N132 Select15 small native multiple
<Select15 small={{multiple:true}}/>;
// @ts-expect-error N133 Select15 small children
<Select15 small={{children:"x"}}/>;
// @ts-expect-error N134 Select15 small warning belongs only14
<Select15 small={{warning:"x"}}/>;
// @ts-expect-error N135 Select15 small bad option
<Select15 small={{options:[{value:3,label:"A"}]}}/>;
// @ts-expect-error N136 Select15 small bad group
<Select15 small={{options:[{label:"G",value:"a",options:[]}]}}/>;
// @ts-expect-error N137 Select15 small bad native button prop
<Select15 small={{triggerProps:{type:"submit"}}}/>;
// @ts-expect-error N138 Select15 small form wrong type
<Select15 small={{form:7}}/>;
// @ts-expect-error N139 Select15 small name wrong type
<Select15 small={{name:false}}/>;
// @ts-expect-error N140 Select15 small required wrong type
<Select15 small={{required:"yes"}}/>;
// @ts-expect-error N141 Select15 small readOnly wrong type
<Select15 small={{readOnly:"yes"}}/>;
// @ts-expect-error N142 Select15 small label wrong type
<Select15 small={{label:false}}/>;
// @ts-expect-error N143 Select15 small helper wrong type
<Select15 small={{helper:null}}/>;
// @ts-expect-error N144 Select15 small style wrong type
<Select15 small={{style:"red"}}/>;
// @ts-expect-error N145 Select15 small motion bad enum
<Select15 small={{motion:"auto"}}/>;
// @ts-expect-error N146 Select15 small dir bad enum
<Select15 small={{dir:"auto"}}/>;
// @ts-expect-error N147 Select15 small unknown slot field
<Select15 small={{selected:"a"}}/>;
// @ts-expect-error N148 Select15 standard value number
<Select15 standard={{value:3}}/>;
// @ts-expect-error N149 Select15 standard default number
<Select15 standard={{defaultValue:2}}/>;
// @ts-expect-error N150 Select15 standard value plus default
<Select15 standard={{value:"a",defaultValue:"b"}}/>;
// @ts-expect-error N151 Select15 standard open string
<Select15 standard={{open:"yes"}}/>;
// @ts-expect-error N152 Select15 standard open plus default
<Select15 standard={{open:true,defaultOpen:true}}/>;
// @ts-expect-error N153 Select15 standard explicit undefined id
<Select15 standard={{id:undefined}}/>;
// @ts-expect-error N154 Select15 standard explicit undefined dir
<Select15 standard={{dir:undefined}}/>;
// @ts-expect-error N155 Select15 standard explicit undefined motion
<Select15 standard={{motion:undefined}}/>;
// @ts-expect-error N156 Select15 standard value callback
<Select15 standard={{onValueChange:(v:number)=>{}}}/>;
// @ts-expect-error N157 Select15 standard open callback
<Select15 standard={{onOpenChange:(v:string)=>{}}}/>;
// @ts-expect-error N158 Select15 standard native change
<Select15 standard={{onChange:()=>{}}}/>;
// @ts-expect-error N159 Select15 standard native ref
<Select15 standard={{triggerRef:select}}/>;
// @ts-expect-error N160 Select15 standard div ref
<Select15 standard={{triggerRef:div}}/>;
// @ts-expect-error N161 Select15 standard root ref
<Select15 standard={{ref:button}}/>;
// @ts-expect-error N162 Select15 standard native multiple
<Select15 standard={{multiple:true}}/>;
// @ts-expect-error N163 Select15 standard children
<Select15 standard={{children:"x"}}/>;
// @ts-expect-error N164 Select15 standard warning belongs only14
<Select15 standard={{warning:"x"}}/>;
// @ts-expect-error N165 Select15 standard bad option
<Select15 standard={{options:[{value:3,label:"A"}]}}/>;
// @ts-expect-error N166 Select15 standard bad group
<Select15 standard={{options:[{label:"G",value:"a",options:[]}]}}/>;
// @ts-expect-error N167 Select15 standard bad native button prop
<Select15 standard={{triggerProps:{type:"submit"}}}/>;
// @ts-expect-error N168 Select15 standard form wrong type
<Select15 standard={{form:7}}/>;
// @ts-expect-error N169 Select15 standard name wrong type
<Select15 standard={{name:false}}/>;
// @ts-expect-error N170 Select15 standard required wrong type
<Select15 standard={{required:"yes"}}/>;
// @ts-expect-error N171 Select15 standard readOnly wrong type
<Select15 standard={{readOnly:"yes"}}/>;
// @ts-expect-error N172 Select15 standard label wrong type
<Select15 standard={{label:false}}/>;
// @ts-expect-error N173 Select15 standard helper wrong type
<Select15 standard={{helper:null}}/>;
// @ts-expect-error N174 Select15 standard style wrong type
<Select15 standard={{style:"red"}}/>;
// @ts-expect-error N175 Select15 standard motion bad enum
<Select15 standard={{motion:"auto"}}/>;
// @ts-expect-error N176 Select15 standard dir bad enum
<Select15 standard={{dir:"auto"}}/>;
// @ts-expect-error N177 Select15 standard unknown slot field
<Select15 standard={{selected:"a"}}/>;
// @ts-expect-error N178 Select15 large value number
<Select15 large={{value:3}}/>;
// @ts-expect-error N179 Select15 large default number
<Select15 large={{defaultValue:2}}/>;
// @ts-expect-error N180 Select15 large value plus default
<Select15 large={{value:"a",defaultValue:"b"}}/>;
// @ts-expect-error N181 Select15 large open string
<Select15 large={{open:"yes"}}/>;
// @ts-expect-error N182 Select15 large open plus default
<Select15 large={{open:true,defaultOpen:true}}/>;
// @ts-expect-error N183 Select15 large explicit undefined id
<Select15 large={{id:undefined}}/>;
// @ts-expect-error N184 Select15 large explicit undefined dir
<Select15 large={{dir:undefined}}/>;
// @ts-expect-error N185 Select15 large explicit undefined motion
<Select15 large={{motion:undefined}}/>;
// @ts-expect-error N186 Select15 large value callback
<Select15 large={{onValueChange:(v:number)=>{}}}/>;
// @ts-expect-error N187 Select15 large open callback
<Select15 large={{onOpenChange:(v:string)=>{}}}/>;
// @ts-expect-error N188 Select15 large native change
<Select15 large={{onChange:()=>{}}}/>;
// @ts-expect-error N189 Select15 large native ref
<Select15 large={{triggerRef:select}}/>;
// @ts-expect-error N190 Select15 large div ref
<Select15 large={{triggerRef:div}}/>;
// @ts-expect-error N191 Select15 large root ref
<Select15 large={{ref:button}}/>;
// @ts-expect-error N192 Select15 large native multiple
<Select15 large={{multiple:true}}/>;
// @ts-expect-error N193 Select15 large children
<Select15 large={{children:"x"}}/>;
// @ts-expect-error N194 Select15 large warning belongs only14
<Select15 large={{warning:"x"}}/>;
// @ts-expect-error N195 Select15 large bad option
<Select15 large={{options:[{value:3,label:"A"}]}}/>;
// @ts-expect-error N196 Select15 large bad group
<Select15 large={{options:[{label:"G",value:"a",options:[]}]}}/>;
// @ts-expect-error N197 Select15 large bad native button prop
<Select15 large={{triggerProps:{type:"submit"}}}/>;
// @ts-expect-error N198 Select15 large form wrong type
<Select15 large={{form:7}}/>;
// @ts-expect-error N199 Select15 large name wrong type
<Select15 large={{name:false}}/>;
// @ts-expect-error N200 Select15 large required wrong type
<Select15 large={{required:"yes"}}/>;
// @ts-expect-error N201 Select15 large readOnly wrong type
<Select15 large={{readOnly:"yes"}}/>;
// @ts-expect-error N202 Select15 large label wrong type
<Select15 large={{label:false}}/>;
// @ts-expect-error N203 Select15 large helper wrong type
<Select15 large={{helper:null}}/>;
// @ts-expect-error N204 Select15 large style wrong type
<Select15 large={{style:"red"}}/>;
// @ts-expect-error N205 Select15 large motion bad enum
<Select15 large={{motion:"auto"}}/>;
// @ts-expect-error N206 Select15 large dir bad enum
<Select15 large={{dir:"auto"}}/>;
// @ts-expect-error N207 Select15 large unknown slot field
<Select15 large={{selected:"a"}}/>;
// @ts-expect-error N208 Select15 outer does not accept value="a"
<Select15 value="a"/>;
// @ts-expect-error N209 Select15 outer does not accept defaultValue="a"
<Select15 defaultValue="a"/>;
// @ts-expect-error N210 Select15 outer does not accept open={true}
<Select15 open={true}/>;
// @ts-expect-error N211 Select15 outer does not accept defaultOpen={true}
<Select15 defaultOpen={true}/>;
// @ts-expect-error N212 Select15 outer does not accept name="all"
<Select15 name="all"/>;
// @ts-expect-error N213 Select15 outer does not accept form="all"
<Select15 form="all"/>;
// @ts-expect-error N214 Select15 outer does not accept required
<Select15 required/>;
// @ts-expect-error N215 Select15 outer does not accept disabled
<Select15 disabled/>;
// @ts-expect-error N216 Select15 outer does not accept readOnly
<Select15 readOnly/>;
// @ts-expect-error N217 Select15 outer does not accept options={options}
<Select15 options={options}/>;
// @ts-expect-error N218 Select15 outer does not accept onValueChange={valueHandler}
<Select15 onValueChange={valueHandler}/>;
// @ts-expect-error N219 Select15 outer does not accept onOpenChange={openHandler}
<Select15 onOpenChange={openHandler}/>;
// @ts-expect-error N220 Select15 outer does not accept triggerRef={button}
<Select15 triggerRef={button}/>;
// @ts-expect-error N221 Select15 outer does not accept ref={button}
<Select15 ref={button}/>;
// @ts-expect-error N222 Select15 outer does not accept helper="h"
<Select15 helper="h"/>;
// @ts-expect-error N223 Select15 outer does not accept warning="w"
<Select15 warning="w"/>;
// @ts-expect-error N224 Select15 outer does not accept error="e"
<Select15 error="e"/>;
// @ts-expect-error N225 Select15 outer does not accept label="l"
<Select15 label="l"/>;
// @ts-expect-error N226 Select15 outer does not accept placeholder="p"
<Select15 placeholder="p"/>;
// @ts-expect-error N227 Select15 outer does not accept children="bad"
<Select15 children="bad"/>;
// @ts-expect-error N228 Select15 outer does not accept small={null}
<Select15 small={null}/>;
// @ts-expect-error N229 Select15 outer does not accept standard="bad"
<Select15 standard="bad"/>;
// @ts-expect-error N230 Select15 outer does not accept large={[]}
<Select15 large={[]}/>;
// @ts-expect-error N231 Select15 outer does not accept motion="auto"
<Select15 motion="auto"/>;
// @ts-expect-error N232 Select15 outer does not accept dir="auto"
<Select15 dir="auto"/>;
// @ts-expect-error N233 Select15 outer does not accept id={undefined}
<Select15 id={undefined}/>;
// @ts-expect-error N234 Select16 no warning API
<Select16 warning="bad"/>;
// @ts-expect-error N235 Select17 no warning API
<Select17 warning="bad"/>;
// @ts-expect-error N236 warning string only
<Select14 warning={null}/>;
// @ts-expect-error N237 warning not boolean
<Select14 warning={false}/>;
// @ts-expect-error N238 readonly id list
wixSelectCompositionIds.push('select-14');
// @ts-expect-error N239 only four canonical ids
const wrongId:WixSelectCompositionId='select-15-small';
// @ts-expect-error N240 old canonical id unavailable
const oldId:WixSelectCompositionId='select-10';
// @ts-expect-error N241 flat option cannot contain group
const badItems:readonly SelectItem[]=[{value:'a',label:'A',options:[]}];
