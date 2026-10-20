import * as React from "react";
import {Select22,Select23,Select24,Select25,wixSelectStructureIds,type SelectStructureProps,type SelectOption,type SelectGroup,type SelectSeparator,type SelectItem,type SelectValueChangeDetail,type SelectOpenChangeDetail} from '../src/index.js';
const ref = React.createRef<HTMLButtonElement>();
const items: readonly (SelectOption | SelectGroup)[] = [{value:"a",label:"Alpha"},{label:"Group",options:[{value:"b",label:"Beta",disabled:true}],disabled:false}] as const;
const valueDetail = (value:string, detail:SelectValueChangeDetail) => { const reason:"pointer"|"keyboard" = detail.reason; const native:Event=detail.originalEvent; const cancel:boolean=detail.defaultPrevented; detail.preventDefault(); void [value,reason,native,cancel]; };
const openDetail = (open:boolean,detail:SelectOpenChangeDetail) => { const reason:SelectOpenChangeDetail["reason"]=detail.reason; detail.preventDefault(); void [open,reason]; };
const id:"select-22"|"select-23"|"select-24"|"select-25" = wixSelectStructureIds[0];
void id;
<Select22 ref={ref} />;
<Select22 value="a" open={false} options={items} onValueChange={valueDetail} onOpenChange={openDetail} />;
<Select22 defaultValue="" defaultOpen label="Field" placeholder="Choose" helper="Help" error="Error" name="choice" form="external" required disabled={false} readOnly={false} dir="rtl" motion="off" id="field" className="custom" style={{maxWidth:300}} aria-label="Field" aria-labelledby="external-label" aria-describedby="help external" aria-invalid="grammar" triggerProps={{title:"Choose",tabIndex:0,autoFocus:true,onClick:e=>{const b:HTMLButtonElement=e.currentTarget;b.focus();e.preventDefault();},onKeyDown:e=>{const key:string=e.key;void key;},onPointerDownCapture:e=>{const x:number=e.clientX;void x;},onFocus:e=>e.currentTarget.focus(),onBlur:e=>{void e.relatedTarget;}}} />;
<Select22 ref={node=>{node?.focus();return ()=>{};}} />;
<Select23 ref={ref} />;
<Select23 value="a" open={false} options={items} onValueChange={valueDetail} onOpenChange={openDetail} />;
<Select23 defaultValue="" defaultOpen label="Field" placeholder="Choose" helper="Help" error="Error" name="choice" form="external" required disabled={false} readOnly={false} dir="rtl" motion="off" id="field" className="custom" style={{maxWidth:300}} aria-label="Field" aria-labelledby="external-label" aria-describedby="help external" aria-invalid="grammar" triggerProps={{title:"Choose",tabIndex:0,autoFocus:true,onClick:e=>{const b:HTMLButtonElement=e.currentTarget;b.focus();e.preventDefault();},onKeyDown:e=>{const key:string=e.key;void key;},onPointerDownCapture:e=>{const x:number=e.clientX;void x;},onFocus:e=>e.currentTarget.focus(),onBlur:e=>{void e.relatedTarget;}}} />;
<Select23 ref={node=>{node?.focus();return ()=>{};}} />;
<Select24 ref={ref} />;
<Select24 value="a" open={false} options={items} onValueChange={valueDetail} onOpenChange={openDetail} />;
<Select24 defaultValue="" defaultOpen label="Field" placeholder="Choose" helper="Help" error="Error" name="choice" form="external" required disabled={false} readOnly={false} dir="rtl" motion="off" id="field" className="custom" style={{maxWidth:300}} aria-label="Field" aria-labelledby="external-label" aria-describedby="help external" aria-invalid="grammar" triggerProps={{title:"Choose",tabIndex:0,autoFocus:true,onClick:e=>{const b:HTMLButtonElement=e.currentTarget;b.focus();e.preventDefault();},onKeyDown:e=>{const key:string=e.key;void key;},onPointerDownCapture:e=>{const x:number=e.clientX;void x;},onFocus:e=>e.currentTarget.focus(),onBlur:e=>{void e.relatedTarget;}}} />;
<Select24 ref={node=>{node?.focus();return ()=>{};}} />;
<Select25 ref={ref} />;
<Select25 value="a" open={false} options={items} onValueChange={valueDetail} onOpenChange={openDetail} />;
<Select25 defaultValue="" defaultOpen label="Field" placeholder="Choose" helper="Help" error="Error" name="choice" form="external" required disabled={false} readOnly={false} dir="rtl" motion="off" id="field" className="custom" style={{maxWidth:300}} aria-label="Field" aria-labelledby="external-label" aria-describedby="help external" aria-invalid="grammar" triggerProps={{title:"Choose",tabIndex:0,autoFocus:true,onClick:e=>{const b:HTMLButtonElement=e.currentTarget;b.focus();e.preventDefault();},onKeyDown:e=>{const key:string=e.key;void key;},onPointerDownCapture:e=>{const x:number=e.clientX;void x;},onFocus:e=>e.currentTarget.focus(),onBlur:e=>{void e.relatedTarget;}}} />;
<Select25 ref={node=>{node?.focus();return ()=>{};}} />;
// @ts-expect-error N001 Select22: controlled and default values conflict
<Select22 value="a" defaultValue="b" />;
// @ts-expect-error N002 Select22: controlled and default popup state conflict
<Select22 open defaultOpen />;
// @ts-expect-error N003 Select22: numeric controlled value
<Select22 value={2} />;
// @ts-expect-error N004 Select22: numeric default value
<Select22 defaultValue={2} />;
// @ts-expect-error N005 Select22: array selection unsupported
<Select22 value={["a"]} />;
// @ts-expect-error N006 Select22: string popup state
<Select22 open="yes" />;
// @ts-expect-error N007 Select22: string default popup state
<Select22 defaultOpen="yes" />;
// @ts-expect-error N008 Select22: native select ref is not button ref
<Select22 ref={React.createRef<HTMLSelectElement>()} />;
// @ts-expect-error N009 Select22: native multiple unsupported
<Select22 multiple />;
// @ts-expect-error N010 Select22: native select onChange unsupported
<Select22 onChange={()=>{}} />;
// @ts-expect-error N011 Select22: children owned by listbox
<Select22 children="Bad" />;
// @ts-expect-error N012 Select22: inner HTML owned by listbox
<Select22 dangerouslySetInnerHTML={{__html:"Bad"}} />;
// @ts-expect-error N013 Select22: numeric label
<Select22 label={2} />;
// @ts-expect-error N014 Select22: React node label unsupported
<Select22 label={<b>Bad</b>} />;
// @ts-expect-error N015 Select22: numeric placeholder
<Select22 placeholder={2} />;
// @ts-expect-error N016 Select22: numeric helper
<Select22 helper={2} />;
// @ts-expect-error N017 Select22: boolean error unsupported
<Select22 error={true} />;
// @ts-expect-error N018 Select22: numeric name
<Select22 name={2} />;
// @ts-expect-error N019 Select22: form must be ID string
<Select22 form={document.createElement("form")} />;
// @ts-expect-error N020 Select22: string required
<Select22 required="yes" />;
// @ts-expect-error N021 Select22: string disabled
<Select22 disabled="yes" />;
// @ts-expect-error N022 Select22: string readonly
<Select22 readOnly="yes" />;
// @ts-expect-error N023 Select22: invalid direction
<Select22 dir="auto" />;
// @ts-expect-error N024 Select22: invalid motion enum
<Select22 motion="reduced" />;
// @ts-expect-error N025 Select22: invalid aria-invalid
<Select22 aria-invalid="invalid" />;
// @ts-expect-error N026 Select22: trigger type owned
<Select22 triggerProps={{type:"submit"}} />;
// @ts-expect-error N027 Select22: trigger name owned
<Select22 triggerProps={{name:"bad"}} />;
// @ts-expect-error N028 Select22: trigger role owned
<Select22 triggerProps={{role:"listbox"}} />;
// @ts-expect-error N029 Select22: wrong callback selected type
<Select22 onValueChange={(value:number)=>{}} />;
// @ts-expect-error N030 Select22: wrong callback open type
<Select22 onOpenChange={(open:string)=>{}} />;
// @ts-expect-error N031 Select22: explicit undefined value not valid owner
<Select22 value={undefined} />;
// @ts-expect-error N032 Select22: explicit undefined open not valid owner
<Select22 open={undefined} />;
// @ts-expect-error N033 Select22: nested group unsupported
<Select22 options={[{label:"Group",options:[{label:"Nested",options:[]}]}]} />;
// @ts-expect-error N034 Select22: mixed option/group rejected
<Select22 options={[{value:"a",label:"A",options:[]}]} />;
// @ts-expect-error N035 Select22: numeric option label rejected
<Select22 options={[{value:"a",label:2}]} />;
// @ts-expect-error N036 Select22: numeric option value rejected
<Select22 options={[{value:2,label:"A"}]} />;
// @ts-expect-error N037 Select22: group disabled boolean only
<Select22 options={[{label:"Group",options:[],disabled:"yes"}]} />;
// @ts-expect-error N038 Select23: controlled and default values conflict
<Select23 value="a" defaultValue="b" />;
// @ts-expect-error N039 Select23: controlled and default popup state conflict
<Select23 open defaultOpen />;
// @ts-expect-error N040 Select23: numeric controlled value
<Select23 value={2} />;
// @ts-expect-error N041 Select23: numeric default value
<Select23 defaultValue={2} />;
// @ts-expect-error N042 Select23: array selection unsupported
<Select23 value={["a"]} />;
// @ts-expect-error N043 Select23: string popup state
<Select23 open="yes" />;
// @ts-expect-error N044 Select23: string default popup state
<Select23 defaultOpen="yes" />;
// @ts-expect-error N045 Select23: native select ref is not button ref
<Select23 ref={React.createRef<HTMLSelectElement>()} />;
// @ts-expect-error N046 Select23: native multiple unsupported
<Select23 multiple />;
// @ts-expect-error N047 Select23: native select onChange unsupported
<Select23 onChange={()=>{}} />;
// @ts-expect-error N048 Select23: children owned by listbox
<Select23 children="Bad" />;
// @ts-expect-error N049 Select23: inner HTML owned by listbox
<Select23 dangerouslySetInnerHTML={{__html:"Bad"}} />;
// @ts-expect-error N050 Select23: numeric label
<Select23 label={2} />;
// @ts-expect-error N051 Select23: React node label unsupported
<Select23 label={<b>Bad</b>} />;
// @ts-expect-error N052 Select23: numeric placeholder
<Select23 placeholder={2} />;
// @ts-expect-error N053 Select23: numeric helper
<Select23 helper={2} />;
// @ts-expect-error N054 Select23: boolean error unsupported
<Select23 error={true} />;
// @ts-expect-error N055 Select23: numeric name
<Select23 name={2} />;
// @ts-expect-error N056 Select23: form must be ID string
<Select23 form={document.createElement("form")} />;
// @ts-expect-error N057 Select23: string required
<Select23 required="yes" />;
// @ts-expect-error N058 Select23: string disabled
<Select23 disabled="yes" />;
// @ts-expect-error N059 Select23: string readonly
<Select23 readOnly="yes" />;
// @ts-expect-error N060 Select23: invalid direction
<Select23 dir="auto" />;
// @ts-expect-error N061 Select23: invalid motion enum
<Select23 motion="reduced" />;
// @ts-expect-error N062 Select23: invalid aria-invalid
<Select23 aria-invalid="invalid" />;
// @ts-expect-error N063 Select23: trigger type owned
<Select23 triggerProps={{type:"submit"}} />;
// @ts-expect-error N064 Select23: trigger name owned
<Select23 triggerProps={{name:"bad"}} />;
// @ts-expect-error N065 Select23: trigger role owned
<Select23 triggerProps={{role:"listbox"}} />;
// @ts-expect-error N066 Select23: wrong callback selected type
<Select23 onValueChange={(value:number)=>{}} />;
// @ts-expect-error N067 Select23: wrong callback open type
<Select23 onOpenChange={(open:string)=>{}} />;
// @ts-expect-error N068 Select23: explicit undefined value not valid owner
<Select23 value={undefined} />;
// @ts-expect-error N069 Select23: explicit undefined open not valid owner
<Select23 open={undefined} />;
// @ts-expect-error N070 Select23: nested group unsupported
<Select23 options={[{label:"Group",options:[{label:"Nested",options:[]}]}]} />;
// @ts-expect-error N071 Select23: mixed option/group rejected
<Select23 options={[{value:"a",label:"A",options:[]}]} />;
// @ts-expect-error N072 Select23: numeric option label rejected
<Select23 options={[{value:"a",label:2}]} />;
// @ts-expect-error N073 Select23: numeric option value rejected
<Select23 options={[{value:2,label:"A"}]} />;
// @ts-expect-error N074 Select23: group disabled boolean only
<Select23 options={[{label:"Group",options:[],disabled:"yes"}]} />;
// @ts-expect-error N075 Select24: controlled and default values conflict
<Select24 value="a" defaultValue="b" />;
// @ts-expect-error N076 Select24: controlled and default popup state conflict
<Select24 open defaultOpen />;
// @ts-expect-error N077 Select24: numeric controlled value
<Select24 value={2} />;
// @ts-expect-error N078 Select24: numeric default value
<Select24 defaultValue={2} />;
// @ts-expect-error N079 Select24: array selection unsupported
<Select24 value={["a"]} />;
// @ts-expect-error N080 Select24: string popup state
<Select24 open="yes" />;
// @ts-expect-error N081 Select24: string default popup state
<Select24 defaultOpen="yes" />;
// @ts-expect-error N082 Select24: native select ref is not button ref
<Select24 ref={React.createRef<HTMLSelectElement>()} />;
// @ts-expect-error N083 Select24: native multiple unsupported
<Select24 multiple />;
// @ts-expect-error N084 Select24: native select onChange unsupported
<Select24 onChange={()=>{}} />;
// @ts-expect-error N085 Select24: children owned by listbox
<Select24 children="Bad" />;
// @ts-expect-error N086 Select24: inner HTML owned by listbox
<Select24 dangerouslySetInnerHTML={{__html:"Bad"}} />;
// @ts-expect-error N087 Select24: numeric label
<Select24 label={2} />;
// @ts-expect-error N088 Select24: React node label unsupported
<Select24 label={<b>Bad</b>} />;
// @ts-expect-error N089 Select24: numeric placeholder
<Select24 placeholder={2} />;
// @ts-expect-error N090 Select24: numeric helper
<Select24 helper={2} />;
// @ts-expect-error N091 Select24: boolean error unsupported
<Select24 error={true} />;
// @ts-expect-error N092 Select24: numeric name
<Select24 name={2} />;
// @ts-expect-error N093 Select24: form must be ID string
<Select24 form={document.createElement("form")} />;
// @ts-expect-error N094 Select24: string required
<Select24 required="yes" />;
// @ts-expect-error N095 Select24: string disabled
<Select24 disabled="yes" />;
// @ts-expect-error N096 Select24: string readonly
<Select24 readOnly="yes" />;
// @ts-expect-error N097 Select24: invalid direction
<Select24 dir="auto" />;
// @ts-expect-error N098 Select24: invalid motion enum
<Select24 motion="reduced" />;
// @ts-expect-error N099 Select24: invalid aria-invalid
<Select24 aria-invalid="invalid" />;
// @ts-expect-error N100 Select24: trigger type owned
<Select24 triggerProps={{type:"submit"}} />;
// @ts-expect-error N101 Select24: trigger name owned
<Select24 triggerProps={{name:"bad"}} />;
// @ts-expect-error N102 Select24: trigger role owned
<Select24 triggerProps={{role:"listbox"}} />;
// @ts-expect-error N103 Select24: wrong callback selected type
<Select24 onValueChange={(value:number)=>{}} />;
// @ts-expect-error N104 Select24: wrong callback open type
<Select24 onOpenChange={(open:string)=>{}} />;
// @ts-expect-error N105 Select24: explicit undefined value not valid owner
<Select24 value={undefined} />;
// @ts-expect-error N106 Select24: explicit undefined open not valid owner
<Select24 open={undefined} />;
// @ts-expect-error N107 Select24: nested group unsupported
<Select24 options={[{label:"Group",options:[{label:"Nested",options:[]}]}]} />;
// @ts-expect-error N108 Select24: mixed option/group rejected
<Select24 options={[{value:"a",label:"A",options:[]}]} />;
// @ts-expect-error N109 Select24: numeric option label rejected
<Select24 options={[{value:"a",label:2}]} />;
// @ts-expect-error N110 Select24: numeric option value rejected
<Select24 options={[{value:2,label:"A"}]} />;
// @ts-expect-error N111 Select24: group disabled boolean only
<Select24 options={[{label:"Group",options:[],disabled:"yes"}]} />;
// @ts-expect-error N112 Select25: controlled and default values conflict
<Select25 value="a" defaultValue="b" />;
// @ts-expect-error N113 Select25: controlled and default popup state conflict
<Select25 open defaultOpen />;
// @ts-expect-error N114 Select25: numeric controlled value
<Select25 value={2} />;
// @ts-expect-error N115 Select25: numeric default value
<Select25 defaultValue={2} />;
// @ts-expect-error N116 Select25: array selection unsupported
<Select25 value={["a"]} />;
// @ts-expect-error N117 Select25: string popup state
<Select25 open="yes" />;
// @ts-expect-error N118 Select25: string default popup state
<Select25 defaultOpen="yes" />;
// @ts-expect-error N119 Select25: native select ref is not button ref
<Select25 ref={React.createRef<HTMLSelectElement>()} />;
// @ts-expect-error N120 Select25: native multiple unsupported
<Select25 multiple />;
// @ts-expect-error N121 Select25: native select onChange unsupported
<Select25 onChange={()=>{}} />;
// @ts-expect-error N122 Select25: children owned by listbox
<Select25 children="Bad" />;
// @ts-expect-error N123 Select25: inner HTML owned by listbox
<Select25 dangerouslySetInnerHTML={{__html:"Bad"}} />;
// @ts-expect-error N124 Select25: numeric label
<Select25 label={2} />;
// @ts-expect-error N125 Select25: React node label unsupported
<Select25 label={<b>Bad</b>} />;
// @ts-expect-error N126 Select25: numeric placeholder
<Select25 placeholder={2} />;
// @ts-expect-error N127 Select25: numeric helper
<Select25 helper={2} />;
// @ts-expect-error N128 Select25: boolean error unsupported
<Select25 error={true} />;
// @ts-expect-error N129 Select25: numeric name
<Select25 name={2} />;
// @ts-expect-error N130 Select25: form must be ID string
<Select25 form={document.createElement("form")} />;
// @ts-expect-error N131 Select25: string required
<Select25 required="yes" />;
// @ts-expect-error N132 Select25: string disabled
<Select25 disabled="yes" />;
// @ts-expect-error N133 Select25: string readonly
<Select25 readOnly="yes" />;
// @ts-expect-error N134 Select25: invalid direction
<Select25 dir="auto" />;
// @ts-expect-error N135 Select25: invalid motion enum
<Select25 motion="reduced" />;
// @ts-expect-error N136 Select25: invalid aria-invalid
<Select25 aria-invalid="invalid" />;
// @ts-expect-error N137 Select25: trigger type owned
<Select25 triggerProps={{type:"submit"}} />;
// @ts-expect-error N138 Select25: trigger name owned
<Select25 triggerProps={{name:"bad"}} />;
// @ts-expect-error N139 Select25: trigger role owned
<Select25 triggerProps={{role:"listbox"}} />;
// @ts-expect-error N140 Select25: wrong callback selected type
<Select25 onValueChange={(value:number)=>{}} />;
// @ts-expect-error N141 Select25: wrong callback open type
<Select25 onOpenChange={(open:string)=>{}} />;
// @ts-expect-error N142 Select25: explicit undefined value not valid owner
<Select25 value={undefined} />;
// @ts-expect-error N143 Select25: explicit undefined open not valid owner
<Select25 open={undefined} />;
// @ts-expect-error N144 Select25: nested group unsupported
<Select25 options={[{label:"Group",options:[{label:"Nested",options:[]}]}]} />;
// @ts-expect-error N145 Select25: mixed option/group rejected
<Select25 options={[{value:"a",label:"A",options:[]}]} />;
// @ts-expect-error N146 Select25: numeric option label rejected
<Select25 options={[{value:"a",label:2}]} />;
// @ts-expect-error N147 Select25: numeric option value rejected
<Select25 options={[{value:2,label:"A"}]} />;
// @ts-expect-error N148 Select25: group disabled boolean only
<Select25 options={[{label:"Group",options:[],disabled:"yes"}]} />;
// @ts-expect-error N149 immutable ID tuple
wixSelectStructureIds.push("select-22");
// @ts-expect-error N150 immutable option value
const readonlyOption:SelectOption={value:"a",label:"A"}; readonlyOption.value="b";
// @ts-expect-error N151 immutable group options
const readonlyGroup:SelectGroup={label:"G",options:[]}; readonlyGroup.options.push({value:"a",label:"A"});
// @ts-expect-error N152 detail original event is readonly
const readonlyDetail = (d:SelectValueChangeDetail) => {d.originalEvent=new Event("click");};
// @ts-expect-error N153 detail reason is readonly
const readonlyReason = (d:SelectOpenChangeDetail) => {d.reason="trigger";};
const acceptsProps=(props:SelectStructureProps)=>props;
void acceptsProps;

const separator: SelectSeparator = {separator:true};
const mixed: readonly SelectItem[] = [{separator:true},{value:"a",label:"A"},{label:"Group",options:[{value:"b",label:"B"}]},separator];
<Select22 options={mixed} />;
// @ts-expect-error N154 Select22: separator must be literal true
<Select22 options={[{separator:false}]} />;
// @ts-expect-error N155 Select22: separator cannot carry selectable value
<Select22 options={[{separator:true,value:"a"}]} />;
// @ts-expect-error N156 Select22: separator cannot carry group options
<Select22 options={[{separator:true,options:[]}]} />;
// @ts-expect-error N157 Select22: separator has no accessible label override
<Select22 options={[{separator:true,label:"Divider"}]} />;
// @ts-expect-error N158 Select22: separator cannot be nested in group
<Select22 options={[{label:"Group",options:[{separator:true}]}]} />;
// @ts-expect-error N159 Select22: separator cannot be disabled
<Select22 options={[{separator:true,disabled:true}]} />;
// @ts-expect-error N160 Select22: explicit undefined separator violates exact optional contract
<Select22 options={[{value:"a",label:"A",separator:undefined}]} />;
// @ts-expect-error N161 Select22: option cannot silently carry false separator
<Select22 options={[{value:"a",label:"A",separator:false}]} />;
<Select23 options={mixed} />;
// @ts-expect-error N162 Select23: separator must be literal true
<Select23 options={[{separator:false}]} />;
// @ts-expect-error N163 Select23: separator cannot carry selectable value
<Select23 options={[{separator:true,value:"a"}]} />;
// @ts-expect-error N164 Select23: separator cannot carry group options
<Select23 options={[{separator:true,options:[]}]} />;
// @ts-expect-error N165 Select23: separator has no accessible label override
<Select23 options={[{separator:true,label:"Divider"}]} />;
// @ts-expect-error N166 Select23: separator cannot be nested in group
<Select23 options={[{label:"Group",options:[{separator:true}]}]} />;
// @ts-expect-error N167 Select23: separator cannot be disabled
<Select23 options={[{separator:true,disabled:true}]} />;
// @ts-expect-error N168 Select23: explicit undefined separator violates exact optional contract
<Select23 options={[{value:"a",label:"A",separator:undefined}]} />;
// @ts-expect-error N169 Select23: option cannot silently carry false separator
<Select23 options={[{value:"a",label:"A",separator:false}]} />;
<Select24 options={mixed} />;
// @ts-expect-error N170 Select24: separator must be literal true
<Select24 options={[{separator:false}]} />;
// @ts-expect-error N171 Select24: separator cannot carry selectable value
<Select24 options={[{separator:true,value:"a"}]} />;
// @ts-expect-error N172 Select24: separator cannot carry group options
<Select24 options={[{separator:true,options:[]}]} />;
// @ts-expect-error N173 Select24: separator has no accessible label override
<Select24 options={[{separator:true,label:"Divider"}]} />;
// @ts-expect-error N174 Select24: separator cannot be nested in group
<Select24 options={[{label:"Group",options:[{separator:true}]}]} />;
// @ts-expect-error N175 Select24: separator cannot be disabled
<Select24 options={[{separator:true,disabled:true}]} />;
// @ts-expect-error N176 Select24: explicit undefined separator violates exact optional contract
<Select24 options={[{value:"a",label:"A",separator:undefined}]} />;
// @ts-expect-error N177 Select24: option cannot silently carry false separator
<Select24 options={[{value:"a",label:"A",separator:false}]} />;
<Select25 options={mixed} />;
// @ts-expect-error N178 Select25: separator must be literal true
<Select25 options={[{separator:false}]} />;
// @ts-expect-error N179 Select25: separator cannot carry selectable value
<Select25 options={[{separator:true,value:"a"}]} />;
// @ts-expect-error N180 Select25: separator cannot carry group options
<Select25 options={[{separator:true,options:[]}]} />;
// @ts-expect-error N181 Select25: separator has no accessible label override
<Select25 options={[{separator:true,label:"Divider"}]} />;
// @ts-expect-error N182 Select25: separator cannot be nested in group
<Select25 options={[{label:"Group",options:[{separator:true}]}]} />;
// @ts-expect-error N183 Select25: separator cannot be disabled
<Select25 options={[{separator:true,disabled:true}]} />;
// @ts-expect-error N184 Select25: explicit undefined separator violates exact optional contract
<Select25 options={[{value:"a",label:"A",separator:undefined}]} />;
// @ts-expect-error N185 Select25: option cannot silently carry false separator
<Select25 options={[{value:"a",label:"A",separator:false}]} />;
