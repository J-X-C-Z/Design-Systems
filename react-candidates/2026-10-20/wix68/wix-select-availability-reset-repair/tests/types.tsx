import * as React from "react";
import {Select18,Select19,Select20,Select21,wixSelectAvailabilityIds,type SelectAvailabilityProps,type SelectOption,type SelectGroup,type SelectValueChangeDetail,type SelectOpenChangeDetail} from '../src/index.js';
const ref = React.createRef<HTMLButtonElement>();
const items: readonly (SelectOption | SelectGroup)[] = [{value:"a",label:"Alpha"},{label:"Group",options:[{value:"b",label:"Beta",disabled:true}],disabled:false}] as const;
const valueDetail = (value:string, detail:SelectValueChangeDetail) => { const reason:"pointer"|"keyboard" = detail.reason; const native:Event=detail.originalEvent; const cancel:boolean=detail.defaultPrevented; detail.preventDefault(); void [value,reason,native,cancel]; };
const openDetail = (open:boolean,detail:SelectOpenChangeDetail) => { const reason:SelectOpenChangeDetail["reason"]=detail.reason; detail.preventDefault(); void [open,reason]; };
const id:"select-18"|"select-19"|"select-20"|"select-21" = wixSelectAvailabilityIds[0];
void id;
<Select18 ref={ref} />;
<Select18 value="a" open={false} options={items} onValueChange={valueDetail} onOpenChange={openDetail} />;
<Select18 defaultValue="" defaultOpen label="Field" placeholder="Choose" helper="Help" error="Error" name="choice" form="external" required disabled={false} readOnly={false} dir="rtl" motion="off" id="field" className="custom" style={{maxWidth:300}} aria-label="Field" aria-labelledby="external-label" aria-describedby="help external" aria-invalid="grammar" triggerProps={{title:"Choose",tabIndex:0,autoFocus:true,onClick:e=>{const b:HTMLButtonElement=e.currentTarget;b.focus();e.preventDefault();},onKeyDown:e=>{const key:string=e.key;void key;},onPointerDownCapture:e=>{const x:number=e.clientX;void x;},onFocus:e=>e.currentTarget.focus(),onBlur:e=>{void e.relatedTarget;}}} />;
<Select18 ref={node=>{node?.focus();return ()=>{};}} />;
<Select19 ref={ref} />;
<Select19 value="a" open={false} options={items} onValueChange={valueDetail} onOpenChange={openDetail} />;
<Select19 defaultValue="" defaultOpen label="Field" placeholder="Choose" helper="Help" error="Error" name="choice" form="external" required disabled={false} readOnly={false} dir="rtl" motion="off" id="field" className="custom" style={{maxWidth:300}} aria-label="Field" aria-labelledby="external-label" aria-describedby="help external" aria-invalid="grammar" triggerProps={{title:"Choose",tabIndex:0,autoFocus:true,onClick:e=>{const b:HTMLButtonElement=e.currentTarget;b.focus();e.preventDefault();},onKeyDown:e=>{const key:string=e.key;void key;},onPointerDownCapture:e=>{const x:number=e.clientX;void x;},onFocus:e=>e.currentTarget.focus(),onBlur:e=>{void e.relatedTarget;}}} />;
<Select19 ref={node=>{node?.focus();return ()=>{};}} />;
<Select20 ref={ref} />;
<Select20 value="a" open={false} options={items} onValueChange={valueDetail} onOpenChange={openDetail} />;
<Select20 defaultValue="" defaultOpen label="Field" placeholder="Choose" helper="Help" error="Error" name="choice" form="external" required disabled={false} readOnly={false} dir="rtl" motion="off" id="field" className="custom" style={{maxWidth:300}} aria-label="Field" aria-labelledby="external-label" aria-describedby="help external" aria-invalid="grammar" triggerProps={{title:"Choose",tabIndex:0,autoFocus:true,onClick:e=>{const b:HTMLButtonElement=e.currentTarget;b.focus();e.preventDefault();},onKeyDown:e=>{const key:string=e.key;void key;},onPointerDownCapture:e=>{const x:number=e.clientX;void x;},onFocus:e=>e.currentTarget.focus(),onBlur:e=>{void e.relatedTarget;}}} />;
<Select20 ref={node=>{node?.focus();return ()=>{};}} />;
<Select21 ref={ref} />;
<Select21 value="a" open={false} options={items} onValueChange={valueDetail} onOpenChange={openDetail} />;
<Select21 defaultValue="" defaultOpen label="Field" placeholder="Choose" helper="Help" error="Error" name="choice" form="external" required disabled={false} readOnly={false} dir="rtl" motion="off" id="field" className="custom" style={{maxWidth:300}} aria-label="Field" aria-labelledby="external-label" aria-describedby="help external" aria-invalid="grammar" triggerProps={{title:"Choose",tabIndex:0,autoFocus:true,onClick:e=>{const b:HTMLButtonElement=e.currentTarget;b.focus();e.preventDefault();},onKeyDown:e=>{const key:string=e.key;void key;},onPointerDownCapture:e=>{const x:number=e.clientX;void x;},onFocus:e=>e.currentTarget.focus(),onBlur:e=>{void e.relatedTarget;}}} />;
<Select21 ref={node=>{node?.focus();return ()=>{};}} />;
// @ts-expect-error N001 Select18: controlled and default values conflict
<Select18 value="a" defaultValue="b" />;
// @ts-expect-error N002 Select18: controlled and default popup state conflict
<Select18 open defaultOpen />;
// @ts-expect-error N003 Select18: numeric controlled value
<Select18 value={2} />;
// @ts-expect-error N004 Select18: numeric default value
<Select18 defaultValue={2} />;
// @ts-expect-error N005 Select18: array selection unsupported
<Select18 value={["a"]} />;
// @ts-expect-error N006 Select18: string popup state
<Select18 open="yes" />;
// @ts-expect-error N007 Select18: string default popup state
<Select18 defaultOpen="yes" />;
// @ts-expect-error N008 Select18: native select ref is not button ref
<Select18 ref={React.createRef<HTMLSelectElement>()} />;
// @ts-expect-error N009 Select18: native multiple unsupported
<Select18 multiple />;
// @ts-expect-error N010 Select18: native select onChange unsupported
<Select18 onChange={()=>{}} />;
// @ts-expect-error N011 Select18: children owned by listbox
<Select18 children="Bad" />;
// @ts-expect-error N012 Select18: inner HTML owned by listbox
<Select18 dangerouslySetInnerHTML={{__html:"Bad"}} />;
// @ts-expect-error N013 Select18: numeric label
<Select18 label={2} />;
// @ts-expect-error N014 Select18: React node label unsupported
<Select18 label={<b>Bad</b>} />;
// @ts-expect-error N015 Select18: numeric placeholder
<Select18 placeholder={2} />;
// @ts-expect-error N016 Select18: numeric helper
<Select18 helper={2} />;
// @ts-expect-error N017 Select18: boolean error unsupported
<Select18 error={true} />;
// @ts-expect-error N018 Select18: numeric name
<Select18 name={2} />;
// @ts-expect-error N019 Select18: form must be ID string
<Select18 form={document.createElement("form")} />;
// @ts-expect-error N020 Select18: string required
<Select18 required="yes" />;
// @ts-expect-error N021 Select18: string disabled
<Select18 disabled="yes" />;
// @ts-expect-error N022 Select18: string readonly
<Select18 readOnly="yes" />;
// @ts-expect-error N023 Select18: invalid direction
<Select18 dir="auto" />;
// @ts-expect-error N024 Select18: invalid motion enum
<Select18 motion="reduced" />;
// @ts-expect-error N025 Select18: invalid aria-invalid
<Select18 aria-invalid="invalid" />;
// @ts-expect-error N026 Select18: trigger type owned
<Select18 triggerProps={{type:"submit"}} />;
// @ts-expect-error N027 Select18: trigger name owned
<Select18 triggerProps={{name:"bad"}} />;
// @ts-expect-error N028 Select18: trigger role owned
<Select18 triggerProps={{role:"listbox"}} />;
// @ts-expect-error N029 Select18: wrong callback selected type
<Select18 onValueChange={(value:number)=>{}} />;
// @ts-expect-error N030 Select18: wrong callback open type
<Select18 onOpenChange={(open:string)=>{}} />;
// @ts-expect-error N031 Select18: explicit undefined value not valid owner
<Select18 value={undefined} />;
// @ts-expect-error N032 Select18: explicit undefined open not valid owner
<Select18 open={undefined} />;
// @ts-expect-error N033 Select18: nested group unsupported
<Select18 options={[{label:"Group",options:[{label:"Nested",options:[]}]}]} />;
// @ts-expect-error N034 Select18: mixed option/group rejected
<Select18 options={[{value:"a",label:"A",options:[]}]} />;
// @ts-expect-error N035 Select18: numeric option label rejected
<Select18 options={[{value:"a",label:2}]} />;
// @ts-expect-error N036 Select18: numeric option value rejected
<Select18 options={[{value:2,label:"A"}]} />;
// @ts-expect-error N037 Select18: group disabled boolean only
<Select18 options={[{label:"Group",options:[],disabled:"yes"}]} />;
// @ts-expect-error N038 Select19: controlled and default values conflict
<Select19 value="a" defaultValue="b" />;
// @ts-expect-error N039 Select19: controlled and default popup state conflict
<Select19 open defaultOpen />;
// @ts-expect-error N040 Select19: numeric controlled value
<Select19 value={2} />;
// @ts-expect-error N041 Select19: numeric default value
<Select19 defaultValue={2} />;
// @ts-expect-error N042 Select19: array selection unsupported
<Select19 value={["a"]} />;
// @ts-expect-error N043 Select19: string popup state
<Select19 open="yes" />;
// @ts-expect-error N044 Select19: string default popup state
<Select19 defaultOpen="yes" />;
// @ts-expect-error N045 Select19: native select ref is not button ref
<Select19 ref={React.createRef<HTMLSelectElement>()} />;
// @ts-expect-error N046 Select19: native multiple unsupported
<Select19 multiple />;
// @ts-expect-error N047 Select19: native select onChange unsupported
<Select19 onChange={()=>{}} />;
// @ts-expect-error N048 Select19: children owned by listbox
<Select19 children="Bad" />;
// @ts-expect-error N049 Select19: inner HTML owned by listbox
<Select19 dangerouslySetInnerHTML={{__html:"Bad"}} />;
// @ts-expect-error N050 Select19: numeric label
<Select19 label={2} />;
// @ts-expect-error N051 Select19: React node label unsupported
<Select19 label={<b>Bad</b>} />;
// @ts-expect-error N052 Select19: numeric placeholder
<Select19 placeholder={2} />;
// @ts-expect-error N053 Select19: numeric helper
<Select19 helper={2} />;
// @ts-expect-error N054 Select19: boolean error unsupported
<Select19 error={true} />;
// @ts-expect-error N055 Select19: numeric name
<Select19 name={2} />;
// @ts-expect-error N056 Select19: form must be ID string
<Select19 form={document.createElement("form")} />;
// @ts-expect-error N057 Select19: string required
<Select19 required="yes" />;
// @ts-expect-error N058 Select19: string disabled
<Select19 disabled="yes" />;
// @ts-expect-error N059 Select19: string readonly
<Select19 readOnly="yes" />;
// @ts-expect-error N060 Select19: invalid direction
<Select19 dir="auto" />;
// @ts-expect-error N061 Select19: invalid motion enum
<Select19 motion="reduced" />;
// @ts-expect-error N062 Select19: invalid aria-invalid
<Select19 aria-invalid="invalid" />;
// @ts-expect-error N063 Select19: trigger type owned
<Select19 triggerProps={{type:"submit"}} />;
// @ts-expect-error N064 Select19: trigger name owned
<Select19 triggerProps={{name:"bad"}} />;
// @ts-expect-error N065 Select19: trigger role owned
<Select19 triggerProps={{role:"listbox"}} />;
// @ts-expect-error N066 Select19: wrong callback selected type
<Select19 onValueChange={(value:number)=>{}} />;
// @ts-expect-error N067 Select19: wrong callback open type
<Select19 onOpenChange={(open:string)=>{}} />;
// @ts-expect-error N068 Select19: explicit undefined value not valid owner
<Select19 value={undefined} />;
// @ts-expect-error N069 Select19: explicit undefined open not valid owner
<Select19 open={undefined} />;
// @ts-expect-error N070 Select19: nested group unsupported
<Select19 options={[{label:"Group",options:[{label:"Nested",options:[]}]}]} />;
// @ts-expect-error N071 Select19: mixed option/group rejected
<Select19 options={[{value:"a",label:"A",options:[]}]} />;
// @ts-expect-error N072 Select19: numeric option label rejected
<Select19 options={[{value:"a",label:2}]} />;
// @ts-expect-error N073 Select19: numeric option value rejected
<Select19 options={[{value:2,label:"A"}]} />;
// @ts-expect-error N074 Select19: group disabled boolean only
<Select19 options={[{label:"Group",options:[],disabled:"yes"}]} />;
// @ts-expect-error N075 Select20: controlled and default values conflict
<Select20 value="a" defaultValue="b" />;
// @ts-expect-error N076 Select20: controlled and default popup state conflict
<Select20 open defaultOpen />;
// @ts-expect-error N077 Select20: numeric controlled value
<Select20 value={2} />;
// @ts-expect-error N078 Select20: numeric default value
<Select20 defaultValue={2} />;
// @ts-expect-error N079 Select20: array selection unsupported
<Select20 value={["a"]} />;
// @ts-expect-error N080 Select20: string popup state
<Select20 open="yes" />;
// @ts-expect-error N081 Select20: string default popup state
<Select20 defaultOpen="yes" />;
// @ts-expect-error N082 Select20: native select ref is not button ref
<Select20 ref={React.createRef<HTMLSelectElement>()} />;
// @ts-expect-error N083 Select20: native multiple unsupported
<Select20 multiple />;
// @ts-expect-error N084 Select20: native select onChange unsupported
<Select20 onChange={()=>{}} />;
// @ts-expect-error N085 Select20: children owned by listbox
<Select20 children="Bad" />;
// @ts-expect-error N086 Select20: inner HTML owned by listbox
<Select20 dangerouslySetInnerHTML={{__html:"Bad"}} />;
// @ts-expect-error N087 Select20: numeric label
<Select20 label={2} />;
// @ts-expect-error N088 Select20: React node label unsupported
<Select20 label={<b>Bad</b>} />;
// @ts-expect-error N089 Select20: numeric placeholder
<Select20 placeholder={2} />;
// @ts-expect-error N090 Select20: numeric helper
<Select20 helper={2} />;
// @ts-expect-error N091 Select20: boolean error unsupported
<Select20 error={true} />;
// @ts-expect-error N092 Select20: numeric name
<Select20 name={2} />;
// @ts-expect-error N093 Select20: form must be ID string
<Select20 form={document.createElement("form")} />;
// @ts-expect-error N094 Select20: string required
<Select20 required="yes" />;
// @ts-expect-error N095 Select20: string disabled
<Select20 disabled="yes" />;
// @ts-expect-error N096 Select20: string readonly
<Select20 readOnly="yes" />;
// @ts-expect-error N097 Select20: invalid direction
<Select20 dir="auto" />;
// @ts-expect-error N098 Select20: invalid motion enum
<Select20 motion="reduced" />;
// @ts-expect-error N099 Select20: invalid aria-invalid
<Select20 aria-invalid="invalid" />;
// @ts-expect-error N100 Select20: trigger type owned
<Select20 triggerProps={{type:"submit"}} />;
// @ts-expect-error N101 Select20: trigger name owned
<Select20 triggerProps={{name:"bad"}} />;
// @ts-expect-error N102 Select20: trigger role owned
<Select20 triggerProps={{role:"listbox"}} />;
// @ts-expect-error N103 Select20: wrong callback selected type
<Select20 onValueChange={(value:number)=>{}} />;
// @ts-expect-error N104 Select20: wrong callback open type
<Select20 onOpenChange={(open:string)=>{}} />;
// @ts-expect-error N105 Select20: explicit undefined value not valid owner
<Select20 value={undefined} />;
// @ts-expect-error N106 Select20: explicit undefined open not valid owner
<Select20 open={undefined} />;
// @ts-expect-error N107 Select20: nested group unsupported
<Select20 options={[{label:"Group",options:[{label:"Nested",options:[]}]}]} />;
// @ts-expect-error N108 Select20: mixed option/group rejected
<Select20 options={[{value:"a",label:"A",options:[]}]} />;
// @ts-expect-error N109 Select20: numeric option label rejected
<Select20 options={[{value:"a",label:2}]} />;
// @ts-expect-error N110 Select20: numeric option value rejected
<Select20 options={[{value:2,label:"A"}]} />;
// @ts-expect-error N111 Select20: group disabled boolean only
<Select20 options={[{label:"Group",options:[],disabled:"yes"}]} />;
// @ts-expect-error N112 Select21: controlled and default values conflict
<Select21 value="a" defaultValue="b" />;
// @ts-expect-error N113 Select21: controlled and default popup state conflict
<Select21 open defaultOpen />;
// @ts-expect-error N114 Select21: numeric controlled value
<Select21 value={2} />;
// @ts-expect-error N115 Select21: numeric default value
<Select21 defaultValue={2} />;
// @ts-expect-error N116 Select21: array selection unsupported
<Select21 value={["a"]} />;
// @ts-expect-error N117 Select21: string popup state
<Select21 open="yes" />;
// @ts-expect-error N118 Select21: string default popup state
<Select21 defaultOpen="yes" />;
// @ts-expect-error N119 Select21: native select ref is not button ref
<Select21 ref={React.createRef<HTMLSelectElement>()} />;
// @ts-expect-error N120 Select21: native multiple unsupported
<Select21 multiple />;
// @ts-expect-error N121 Select21: native select onChange unsupported
<Select21 onChange={()=>{}} />;
// @ts-expect-error N122 Select21: children owned by listbox
<Select21 children="Bad" />;
// @ts-expect-error N123 Select21: inner HTML owned by listbox
<Select21 dangerouslySetInnerHTML={{__html:"Bad"}} />;
// @ts-expect-error N124 Select21: numeric label
<Select21 label={2} />;
// @ts-expect-error N125 Select21: React node label unsupported
<Select21 label={<b>Bad</b>} />;
// @ts-expect-error N126 Select21: numeric placeholder
<Select21 placeholder={2} />;
// @ts-expect-error N127 Select21: numeric helper
<Select21 helper={2} />;
// @ts-expect-error N128 Select21: boolean error unsupported
<Select21 error={true} />;
// @ts-expect-error N129 Select21: numeric name
<Select21 name={2} />;
// @ts-expect-error N130 Select21: form must be ID string
<Select21 form={document.createElement("form")} />;
// @ts-expect-error N131 Select21: string required
<Select21 required="yes" />;
// @ts-expect-error N132 Select21: string disabled
<Select21 disabled="yes" />;
// @ts-expect-error N133 Select21: string readonly
<Select21 readOnly="yes" />;
// @ts-expect-error N134 Select21: invalid direction
<Select21 dir="auto" />;
// @ts-expect-error N135 Select21: invalid motion enum
<Select21 motion="reduced" />;
// @ts-expect-error N136 Select21: invalid aria-invalid
<Select21 aria-invalid="invalid" />;
// @ts-expect-error N137 Select21: trigger type owned
<Select21 triggerProps={{type:"submit"}} />;
// @ts-expect-error N138 Select21: trigger name owned
<Select21 triggerProps={{name:"bad"}} />;
// @ts-expect-error N139 Select21: trigger role owned
<Select21 triggerProps={{role:"listbox"}} />;
// @ts-expect-error N140 Select21: wrong callback selected type
<Select21 onValueChange={(value:number)=>{}} />;
// @ts-expect-error N141 Select21: wrong callback open type
<Select21 onOpenChange={(open:string)=>{}} />;
// @ts-expect-error N142 Select21: explicit undefined value not valid owner
<Select21 value={undefined} />;
// @ts-expect-error N143 Select21: explicit undefined open not valid owner
<Select21 open={undefined} />;
// @ts-expect-error N144 Select21: nested group unsupported
<Select21 options={[{label:"Group",options:[{label:"Nested",options:[]}]}]} />;
// @ts-expect-error N145 Select21: mixed option/group rejected
<Select21 options={[{value:"a",label:"A",options:[]}]} />;
// @ts-expect-error N146 Select21: numeric option label rejected
<Select21 options={[{value:"a",label:2}]} />;
// @ts-expect-error N147 Select21: numeric option value rejected
<Select21 options={[{value:2,label:"A"}]} />;
// @ts-expect-error N148 Select21: group disabled boolean only
<Select21 options={[{label:"Group",options:[],disabled:"yes"}]} />;
// @ts-expect-error N149 immutable ID tuple
wixSelectAvailabilityIds.push("select-18");
// @ts-expect-error N150 immutable option value
const readonlyOption:SelectOption={value:"a",label:"A"}; readonlyOption.value="b";
// @ts-expect-error N151 immutable group options
const readonlyGroup:SelectGroup={label:"G",options:[]}; readonlyGroup.options.push({value:"a",label:"A"});
// @ts-expect-error N152 detail original event is readonly
const readonlyDetail = (d:SelectValueChangeDetail) => {d.originalEvent=new Event("click");};
// @ts-expect-error N153 detail reason is readonly
const readonlyReason = (d:SelectOpenChangeDetail) => {d.reason="trigger";};
const acceptsProps=(props:SelectAvailabilityProps)=>props;
void acceptsProps;
