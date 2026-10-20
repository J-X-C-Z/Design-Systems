import * as React from "react";
import {Select10,Select11,Select12,Select13,wixSelectMenuIds,type SelectMenuProps,type SelectOption,type SelectGroup,type SelectValueChangeDetail,type SelectOpenChangeDetail} from '../src/index.js';
const ref = React.createRef<HTMLButtonElement>();
const items: readonly (SelectOption | SelectGroup)[] = [{value:"a",label:"Alpha"},{label:"Group",options:[{value:"b",label:"Beta",disabled:true}],disabled:false}] as const;
const valueDetail = (value:string, detail:SelectValueChangeDetail) => { const reason:"pointer"|"keyboard" = detail.reason; const native:Event=detail.originalEvent; const cancel:boolean=detail.defaultPrevented; detail.preventDefault(); void [value,reason,native,cancel]; };
const openDetail = (open:boolean,detail:SelectOpenChangeDetail) => { const reason:SelectOpenChangeDetail["reason"]=detail.reason; detail.preventDefault(); void [open,reason]; };
const id:"select-10"|"select-11"|"select-12"|"select-13" = wixSelectMenuIds[0];
void id;
<Select10 ref={ref} />;
<Select10 value="a" open={false} options={items} onValueChange={valueDetail} onOpenChange={openDetail} />;
<Select10 defaultValue="" defaultOpen label="Field" placeholder="Choose" helper="Help" error="Error" name="choice" form="external" required disabled={false} readOnly={false} dir="rtl" motion="off" id="field" className="custom" style={{maxWidth:300}} aria-label="Field" aria-labelledby="external-label" aria-describedby="help external" aria-invalid="grammar" triggerProps={{title:"Choose",tabIndex:0,autoFocus:true,onClick:e=>{const b:HTMLButtonElement=e.currentTarget;b.focus();e.preventDefault();},onKeyDown:e=>{const key:string=e.key;void key;},onPointerDownCapture:e=>{const x:number=e.clientX;void x;},onFocus:e=>e.currentTarget.focus(),onBlur:e=>{void e.relatedTarget;}}} />;
<Select10 ref={node=>{node?.focus();return ()=>{};}} />;
<Select11 ref={ref} />;
<Select11 value="a" open={false} options={items} onValueChange={valueDetail} onOpenChange={openDetail} />;
<Select11 defaultValue="" defaultOpen label="Field" placeholder="Choose" helper="Help" error="Error" name="choice" form="external" required disabled={false} readOnly={false} dir="rtl" motion="off" id="field" className="custom" style={{maxWidth:300}} aria-label="Field" aria-labelledby="external-label" aria-describedby="help external" aria-invalid="grammar" triggerProps={{title:"Choose",tabIndex:0,autoFocus:true,onClick:e=>{const b:HTMLButtonElement=e.currentTarget;b.focus();e.preventDefault();},onKeyDown:e=>{const key:string=e.key;void key;},onPointerDownCapture:e=>{const x:number=e.clientX;void x;},onFocus:e=>e.currentTarget.focus(),onBlur:e=>{void e.relatedTarget;}}} />;
<Select11 ref={node=>{node?.focus();return ()=>{};}} />;
<Select12 ref={ref} />;
<Select12 value="a" open={false} options={items} onValueChange={valueDetail} onOpenChange={openDetail} />;
<Select12 defaultValue="" defaultOpen label="Field" placeholder="Choose" helper="Help" error="Error" name="choice" form="external" required disabled={false} readOnly={false} dir="rtl" motion="off" id="field" className="custom" style={{maxWidth:300}} aria-label="Field" aria-labelledby="external-label" aria-describedby="help external" aria-invalid="grammar" triggerProps={{title:"Choose",tabIndex:0,autoFocus:true,onClick:e=>{const b:HTMLButtonElement=e.currentTarget;b.focus();e.preventDefault();},onKeyDown:e=>{const key:string=e.key;void key;},onPointerDownCapture:e=>{const x:number=e.clientX;void x;},onFocus:e=>e.currentTarget.focus(),onBlur:e=>{void e.relatedTarget;}}} />;
<Select12 ref={node=>{node?.focus();return ()=>{};}} />;
<Select13 ref={ref} />;
<Select13 value="a" open={false} options={items} onValueChange={valueDetail} onOpenChange={openDetail} />;
<Select13 defaultValue="" defaultOpen label="Field" placeholder="Choose" helper="Help" error="Error" name="choice" form="external" required disabled={false} readOnly={false} dir="rtl" motion="off" id="field" className="custom" style={{maxWidth:300}} aria-label="Field" aria-labelledby="external-label" aria-describedby="help external" aria-invalid="grammar" triggerProps={{title:"Choose",tabIndex:0,autoFocus:true,onClick:e=>{const b:HTMLButtonElement=e.currentTarget;b.focus();e.preventDefault();},onKeyDown:e=>{const key:string=e.key;void key;},onPointerDownCapture:e=>{const x:number=e.clientX;void x;},onFocus:e=>e.currentTarget.focus(),onBlur:e=>{void e.relatedTarget;}}} />;
<Select13 ref={node=>{node?.focus();return ()=>{};}} />;
// @ts-expect-error N001 Select10: controlled and default values conflict
<Select10 value="a" defaultValue="b" />;
// @ts-expect-error N002 Select10: controlled and default popup state conflict
<Select10 open defaultOpen />;
// @ts-expect-error N003 Select10: numeric controlled value
<Select10 value={2} />;
// @ts-expect-error N004 Select10: numeric default value
<Select10 defaultValue={2} />;
// @ts-expect-error N005 Select10: array selection unsupported
<Select10 value={["a"]} />;
// @ts-expect-error N006 Select10: string popup state
<Select10 open="yes" />;
// @ts-expect-error N007 Select10: string default popup state
<Select10 defaultOpen="yes" />;
// @ts-expect-error N008 Select10: native select ref is not button ref
<Select10 ref={React.createRef<HTMLSelectElement>()} />;
// @ts-expect-error N009 Select10: native multiple unsupported
<Select10 multiple />;
// @ts-expect-error N010 Select10: native select onChange unsupported
<Select10 onChange={()=>{}} />;
// @ts-expect-error N011 Select10: children owned by listbox
<Select10 children="Bad" />;
// @ts-expect-error N012 Select10: inner HTML owned by listbox
<Select10 dangerouslySetInnerHTML={{__html:"Bad"}} />;
// @ts-expect-error N013 Select10: numeric label
<Select10 label={2} />;
// @ts-expect-error N014 Select10: React node label unsupported
<Select10 label={<b>Bad</b>} />;
// @ts-expect-error N015 Select10: numeric placeholder
<Select10 placeholder={2} />;
// @ts-expect-error N016 Select10: numeric helper
<Select10 helper={2} />;
// @ts-expect-error N017 Select10: boolean error unsupported
<Select10 error={true} />;
// @ts-expect-error N018 Select10: numeric name
<Select10 name={2} />;
// @ts-expect-error N019 Select10: form must be ID string
<Select10 form={document.createElement("form")} />;
// @ts-expect-error N020 Select10: string required
<Select10 required="yes" />;
// @ts-expect-error N021 Select10: string disabled
<Select10 disabled="yes" />;
// @ts-expect-error N022 Select10: string readonly
<Select10 readOnly="yes" />;
// @ts-expect-error N023 Select10: invalid direction
<Select10 dir="auto" />;
// @ts-expect-error N024 Select10: invalid motion enum
<Select10 motion="reduced" />;
// @ts-expect-error N025 Select10: invalid aria-invalid
<Select10 aria-invalid="invalid" />;
// @ts-expect-error N026 Select10: trigger type owned
<Select10 triggerProps={{type:"submit"}} />;
// @ts-expect-error N027 Select10: trigger name owned
<Select10 triggerProps={{name:"bad"}} />;
// @ts-expect-error N028 Select10: trigger role owned
<Select10 triggerProps={{role:"listbox"}} />;
// @ts-expect-error N029 Select10: wrong callback selected type
<Select10 onValueChange={(value:number)=>{}} />;
// @ts-expect-error N030 Select10: wrong callback open type
<Select10 onOpenChange={(open:string)=>{}} />;
// @ts-expect-error N031 Select10: explicit undefined value not valid owner
<Select10 value={undefined} />;
// @ts-expect-error N032 Select10: explicit undefined open not valid owner
<Select10 open={undefined} />;
// @ts-expect-error N033 Select10: nested group unsupported
<Select10 options={[{label:"Group",options:[{label:"Nested",options:[]}]}]} />;
// @ts-expect-error N034 Select10: mixed option/group rejected
<Select10 options={[{value:"a",label:"A",options:[]}]} />;
// @ts-expect-error N035 Select10: numeric option label rejected
<Select10 options={[{value:"a",label:2}]} />;
// @ts-expect-error N036 Select10: numeric option value rejected
<Select10 options={[{value:2,label:"A"}]} />;
// @ts-expect-error N037 Select10: group disabled boolean only
<Select10 options={[{label:"Group",options:[],disabled:"yes"}]} />;
// @ts-expect-error N038 Select11: controlled and default values conflict
<Select11 value="a" defaultValue="b" />;
// @ts-expect-error N039 Select11: controlled and default popup state conflict
<Select11 open defaultOpen />;
// @ts-expect-error N040 Select11: numeric controlled value
<Select11 value={2} />;
// @ts-expect-error N041 Select11: numeric default value
<Select11 defaultValue={2} />;
// @ts-expect-error N042 Select11: array selection unsupported
<Select11 value={["a"]} />;
// @ts-expect-error N043 Select11: string popup state
<Select11 open="yes" />;
// @ts-expect-error N044 Select11: string default popup state
<Select11 defaultOpen="yes" />;
// @ts-expect-error N045 Select11: native select ref is not button ref
<Select11 ref={React.createRef<HTMLSelectElement>()} />;
// @ts-expect-error N046 Select11: native multiple unsupported
<Select11 multiple />;
// @ts-expect-error N047 Select11: native select onChange unsupported
<Select11 onChange={()=>{}} />;
// @ts-expect-error N048 Select11: children owned by listbox
<Select11 children="Bad" />;
// @ts-expect-error N049 Select11: inner HTML owned by listbox
<Select11 dangerouslySetInnerHTML={{__html:"Bad"}} />;
// @ts-expect-error N050 Select11: numeric label
<Select11 label={2} />;
// @ts-expect-error N051 Select11: React node label unsupported
<Select11 label={<b>Bad</b>} />;
// @ts-expect-error N052 Select11: numeric placeholder
<Select11 placeholder={2} />;
// @ts-expect-error N053 Select11: numeric helper
<Select11 helper={2} />;
// @ts-expect-error N054 Select11: boolean error unsupported
<Select11 error={true} />;
// @ts-expect-error N055 Select11: numeric name
<Select11 name={2} />;
// @ts-expect-error N056 Select11: form must be ID string
<Select11 form={document.createElement("form")} />;
// @ts-expect-error N057 Select11: string required
<Select11 required="yes" />;
// @ts-expect-error N058 Select11: string disabled
<Select11 disabled="yes" />;
// @ts-expect-error N059 Select11: string readonly
<Select11 readOnly="yes" />;
// @ts-expect-error N060 Select11: invalid direction
<Select11 dir="auto" />;
// @ts-expect-error N061 Select11: invalid motion enum
<Select11 motion="reduced" />;
// @ts-expect-error N062 Select11: invalid aria-invalid
<Select11 aria-invalid="invalid" />;
// @ts-expect-error N063 Select11: trigger type owned
<Select11 triggerProps={{type:"submit"}} />;
// @ts-expect-error N064 Select11: trigger name owned
<Select11 triggerProps={{name:"bad"}} />;
// @ts-expect-error N065 Select11: trigger role owned
<Select11 triggerProps={{role:"listbox"}} />;
// @ts-expect-error N066 Select11: wrong callback selected type
<Select11 onValueChange={(value:number)=>{}} />;
// @ts-expect-error N067 Select11: wrong callback open type
<Select11 onOpenChange={(open:string)=>{}} />;
// @ts-expect-error N068 Select11: explicit undefined value not valid owner
<Select11 value={undefined} />;
// @ts-expect-error N069 Select11: explicit undefined open not valid owner
<Select11 open={undefined} />;
// @ts-expect-error N070 Select11: nested group unsupported
<Select11 options={[{label:"Group",options:[{label:"Nested",options:[]}]}]} />;
// @ts-expect-error N071 Select11: mixed option/group rejected
<Select11 options={[{value:"a",label:"A",options:[]}]} />;
// @ts-expect-error N072 Select11: numeric option label rejected
<Select11 options={[{value:"a",label:2}]} />;
// @ts-expect-error N073 Select11: numeric option value rejected
<Select11 options={[{value:2,label:"A"}]} />;
// @ts-expect-error N074 Select11: group disabled boolean only
<Select11 options={[{label:"Group",options:[],disabled:"yes"}]} />;
// @ts-expect-error N075 Select12: controlled and default values conflict
<Select12 value="a" defaultValue="b" />;
// @ts-expect-error N076 Select12: controlled and default popup state conflict
<Select12 open defaultOpen />;
// @ts-expect-error N077 Select12: numeric controlled value
<Select12 value={2} />;
// @ts-expect-error N078 Select12: numeric default value
<Select12 defaultValue={2} />;
// @ts-expect-error N079 Select12: array selection unsupported
<Select12 value={["a"]} />;
// @ts-expect-error N080 Select12: string popup state
<Select12 open="yes" />;
// @ts-expect-error N081 Select12: string default popup state
<Select12 defaultOpen="yes" />;
// @ts-expect-error N082 Select12: native select ref is not button ref
<Select12 ref={React.createRef<HTMLSelectElement>()} />;
// @ts-expect-error N083 Select12: native multiple unsupported
<Select12 multiple />;
// @ts-expect-error N084 Select12: native select onChange unsupported
<Select12 onChange={()=>{}} />;
// @ts-expect-error N085 Select12: children owned by listbox
<Select12 children="Bad" />;
// @ts-expect-error N086 Select12: inner HTML owned by listbox
<Select12 dangerouslySetInnerHTML={{__html:"Bad"}} />;
// @ts-expect-error N087 Select12: numeric label
<Select12 label={2} />;
// @ts-expect-error N088 Select12: React node label unsupported
<Select12 label={<b>Bad</b>} />;
// @ts-expect-error N089 Select12: numeric placeholder
<Select12 placeholder={2} />;
// @ts-expect-error N090 Select12: numeric helper
<Select12 helper={2} />;
// @ts-expect-error N091 Select12: boolean error unsupported
<Select12 error={true} />;
// @ts-expect-error N092 Select12: numeric name
<Select12 name={2} />;
// @ts-expect-error N093 Select12: form must be ID string
<Select12 form={document.createElement("form")} />;
// @ts-expect-error N094 Select12: string required
<Select12 required="yes" />;
// @ts-expect-error N095 Select12: string disabled
<Select12 disabled="yes" />;
// @ts-expect-error N096 Select12: string readonly
<Select12 readOnly="yes" />;
// @ts-expect-error N097 Select12: invalid direction
<Select12 dir="auto" />;
// @ts-expect-error N098 Select12: invalid motion enum
<Select12 motion="reduced" />;
// @ts-expect-error N099 Select12: invalid aria-invalid
<Select12 aria-invalid="invalid" />;
// @ts-expect-error N100 Select12: trigger type owned
<Select12 triggerProps={{type:"submit"}} />;
// @ts-expect-error N101 Select12: trigger name owned
<Select12 triggerProps={{name:"bad"}} />;
// @ts-expect-error N102 Select12: trigger role owned
<Select12 triggerProps={{role:"listbox"}} />;
// @ts-expect-error N103 Select12: wrong callback selected type
<Select12 onValueChange={(value:number)=>{}} />;
// @ts-expect-error N104 Select12: wrong callback open type
<Select12 onOpenChange={(open:string)=>{}} />;
// @ts-expect-error N105 Select12: explicit undefined value not valid owner
<Select12 value={undefined} />;
// @ts-expect-error N106 Select12: explicit undefined open not valid owner
<Select12 open={undefined} />;
// @ts-expect-error N107 Select12: nested group unsupported
<Select12 options={[{label:"Group",options:[{label:"Nested",options:[]}]}]} />;
// @ts-expect-error N108 Select12: mixed option/group rejected
<Select12 options={[{value:"a",label:"A",options:[]}]} />;
// @ts-expect-error N109 Select12: numeric option label rejected
<Select12 options={[{value:"a",label:2}]} />;
// @ts-expect-error N110 Select12: numeric option value rejected
<Select12 options={[{value:2,label:"A"}]} />;
// @ts-expect-error N111 Select12: group disabled boolean only
<Select12 options={[{label:"Group",options:[],disabled:"yes"}]} />;
// @ts-expect-error N112 Select13: controlled and default values conflict
<Select13 value="a" defaultValue="b" />;
// @ts-expect-error N113 Select13: controlled and default popup state conflict
<Select13 open defaultOpen />;
// @ts-expect-error N114 Select13: numeric controlled value
<Select13 value={2} />;
// @ts-expect-error N115 Select13: numeric default value
<Select13 defaultValue={2} />;
// @ts-expect-error N116 Select13: array selection unsupported
<Select13 value={["a"]} />;
// @ts-expect-error N117 Select13: string popup state
<Select13 open="yes" />;
// @ts-expect-error N118 Select13: string default popup state
<Select13 defaultOpen="yes" />;
// @ts-expect-error N119 Select13: native select ref is not button ref
<Select13 ref={React.createRef<HTMLSelectElement>()} />;
// @ts-expect-error N120 Select13: native multiple unsupported
<Select13 multiple />;
// @ts-expect-error N121 Select13: native select onChange unsupported
<Select13 onChange={()=>{}} />;
// @ts-expect-error N122 Select13: children owned by listbox
<Select13 children="Bad" />;
// @ts-expect-error N123 Select13: inner HTML owned by listbox
<Select13 dangerouslySetInnerHTML={{__html:"Bad"}} />;
// @ts-expect-error N124 Select13: numeric label
<Select13 label={2} />;
// @ts-expect-error N125 Select13: React node label unsupported
<Select13 label={<b>Bad</b>} />;
// @ts-expect-error N126 Select13: numeric placeholder
<Select13 placeholder={2} />;
// @ts-expect-error N127 Select13: numeric helper
<Select13 helper={2} />;
// @ts-expect-error N128 Select13: boolean error unsupported
<Select13 error={true} />;
// @ts-expect-error N129 Select13: numeric name
<Select13 name={2} />;
// @ts-expect-error N130 Select13: form must be ID string
<Select13 form={document.createElement("form")} />;
// @ts-expect-error N131 Select13: string required
<Select13 required="yes" />;
// @ts-expect-error N132 Select13: string disabled
<Select13 disabled="yes" />;
// @ts-expect-error N133 Select13: string readonly
<Select13 readOnly="yes" />;
// @ts-expect-error N134 Select13: invalid direction
<Select13 dir="auto" />;
// @ts-expect-error N135 Select13: invalid motion enum
<Select13 motion="reduced" />;
// @ts-expect-error N136 Select13: invalid aria-invalid
<Select13 aria-invalid="invalid" />;
// @ts-expect-error N137 Select13: trigger type owned
<Select13 triggerProps={{type:"submit"}} />;
// @ts-expect-error N138 Select13: trigger name owned
<Select13 triggerProps={{name:"bad"}} />;
// @ts-expect-error N139 Select13: trigger role owned
<Select13 triggerProps={{role:"listbox"}} />;
// @ts-expect-error N140 Select13: wrong callback selected type
<Select13 onValueChange={(value:number)=>{}} />;
// @ts-expect-error N141 Select13: wrong callback open type
<Select13 onOpenChange={(open:string)=>{}} />;
// @ts-expect-error N142 Select13: explicit undefined value not valid owner
<Select13 value={undefined} />;
// @ts-expect-error N143 Select13: explicit undefined open not valid owner
<Select13 open={undefined} />;
// @ts-expect-error N144 Select13: nested group unsupported
<Select13 options={[{label:"Group",options:[{label:"Nested",options:[]}]}]} />;
// @ts-expect-error N145 Select13: mixed option/group rejected
<Select13 options={[{value:"a",label:"A",options:[]}]} />;
// @ts-expect-error N146 Select13: numeric option label rejected
<Select13 options={[{value:"a",label:2}]} />;
// @ts-expect-error N147 Select13: numeric option value rejected
<Select13 options={[{value:2,label:"A"}]} />;
// @ts-expect-error N148 Select13: group disabled boolean only
<Select13 options={[{label:"Group",options:[],disabled:"yes"}]} />;
// @ts-expect-error N149 immutable ID tuple
wixSelectMenuIds.push("select-10");
// @ts-expect-error N150 immutable option value
const readonlyOption:SelectOption={value:"a",label:"A"}; readonlyOption.value="b";
// @ts-expect-error N151 immutable group options
const readonlyGroup:SelectGroup={label:"G",options:[]}; readonlyGroup.options.push({value:"a",label:"A"});
// @ts-expect-error N152 detail original event is readonly
const readonlyDetail = (d:SelectValueChangeDetail) => {d.originalEvent=new Event("click");};
// @ts-expect-error N153 detail reason is readonly
const readonlyReason = (d:SelectOpenChangeDetail) => {d.reason="trigger";};
const acceptsProps=(props:SelectMenuProps)=>props;
void acceptsProps;
