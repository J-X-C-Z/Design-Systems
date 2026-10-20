import * as React from "react";
import {Select26,Select27,Select28,Select29,wixSelectContentIds,type SelectContentProps,type SelectOption,type SelectGroup,type SelectSeparator,type SelectItem,type SelectValueChangeDetail,type SelectOpenChangeDetail} from '../src/index.js';
const ref = React.createRef<HTMLButtonElement>();
const items: readonly (SelectOption | SelectGroup)[] = [{value:"a",label:"Alpha"},{label:"Group",options:[{value:"b",label:"Beta",disabled:true}],disabled:false}] as const;
const valueDetail = (value:string, detail:SelectValueChangeDetail) => { const reason:"pointer"|"keyboard" = detail.reason; const native:Event=detail.originalEvent; const cancel:boolean=detail.defaultPrevented; detail.preventDefault(); void [value,reason,native,cancel]; };
const openDetail = (open:boolean,detail:SelectOpenChangeDetail) => { const reason:SelectOpenChangeDetail["reason"]=detail.reason; detail.preventDefault(); void [open,reason]; };
const id:"select-26"|"select-27"|"select-28"|"select-29" = wixSelectContentIds[0];
void id;
<Select26 ref={ref} />;
<Select26 value="a" open={false} options={items} onValueChange={valueDetail} onOpenChange={openDetail} />;
<Select26 defaultValue="" defaultOpen label="Field" placeholder="Choose" helper="Help" error="Error" name="choice" form="external" required disabled={false} readOnly={false} dir="rtl" motion="off" id="field" className="custom" style={{maxWidth:300}} aria-label="Field" aria-labelledby="external-label" aria-describedby="help external" aria-invalid="grammar" triggerProps={{title:"Choose",tabIndex:0,autoFocus:true,onClick:e=>{const b:HTMLButtonElement=e.currentTarget;b.focus();e.preventDefault();},onKeyDown:e=>{const key:string=e.key;void key;},onPointerDownCapture:e=>{const x:number=e.clientX;void x;},onFocus:e=>e.currentTarget.focus(),onBlur:e=>{void e.relatedTarget;}}} />;
<Select26 ref={node=>{node?.focus();return ()=>{};}} />;
<Select27 ref={ref} />;
<Select27 value="a" open={false} options={items} onValueChange={valueDetail} onOpenChange={openDetail} />;
<Select27 defaultValue="" defaultOpen label="Field" placeholder="Choose" helper="Help" error="Error" name="choice" form="external" required disabled={false} readOnly={false} dir="rtl" motion="off" id="field" className="custom" style={{maxWidth:300}} aria-label="Field" aria-labelledby="external-label" aria-describedby="help external" aria-invalid="grammar" triggerProps={{title:"Choose",tabIndex:0,autoFocus:true,onClick:e=>{const b:HTMLButtonElement=e.currentTarget;b.focus();e.preventDefault();},onKeyDown:e=>{const key:string=e.key;void key;},onPointerDownCapture:e=>{const x:number=e.clientX;void x;},onFocus:e=>e.currentTarget.focus(),onBlur:e=>{void e.relatedTarget;}}} />;
<Select27 ref={node=>{node?.focus();return ()=>{};}} />;
<Select28 ref={ref} />;
<Select28 value="a" open={false} options={items} onValueChange={valueDetail} onOpenChange={openDetail} />;
<Select28 defaultValue="" defaultOpen label="Field" placeholder="Choose" helper="Help" error="Error" name="choice" form="external" required disabled={false} readOnly={false} dir="rtl" motion="off" id="field" className="custom" style={{maxWidth:300}} aria-label="Field" aria-labelledby="external-label" aria-describedby="help external" aria-invalid="grammar" triggerProps={{title:"Choose",tabIndex:0,autoFocus:true,onClick:e=>{const b:HTMLButtonElement=e.currentTarget;b.focus();e.preventDefault();},onKeyDown:e=>{const key:string=e.key;void key;},onPointerDownCapture:e=>{const x:number=e.clientX;void x;},onFocus:e=>e.currentTarget.focus(),onBlur:e=>{void e.relatedTarget;}}} />;
<Select28 ref={node=>{node?.focus();return ()=>{};}} />;
<Select29 ref={ref} />;
<Select29 value="a" open={false} options={items} onValueChange={valueDetail} onOpenChange={openDetail} />;
<Select29 defaultValue="" defaultOpen label="Field" placeholder="Choose" helper="Help" error="Error" name="choice" form="external" required disabled={false} readOnly={false} dir="rtl" motion="off" id="field" className="custom" style={{maxWidth:300}} aria-label="Field" aria-labelledby="external-label" aria-describedby="help external" aria-invalid="grammar" triggerProps={{title:"Choose",tabIndex:0,autoFocus:true,onClick:e=>{const b:HTMLButtonElement=e.currentTarget;b.focus();e.preventDefault();},onKeyDown:e=>{const key:string=e.key;void key;},onPointerDownCapture:e=>{const x:number=e.clientX;void x;},onFocus:e=>e.currentTarget.focus(),onBlur:e=>{void e.relatedTarget;}}} />;
<Select29 ref={node=>{node?.focus();return ()=>{};}} />;
// @ts-expect-error N001 Select26: controlled and default values conflict
<Select26 value="a" defaultValue="b" />;
// @ts-expect-error N002 Select26: controlled and default popup state conflict
<Select26 open defaultOpen />;
// @ts-expect-error N003 Select26: numeric controlled value
<Select26 value={2} />;
// @ts-expect-error N004 Select26: numeric default value
<Select26 defaultValue={2} />;
// @ts-expect-error N005 Select26: array selection unsupported
<Select26 value={["a"]} />;
// @ts-expect-error N006 Select26: string popup state
<Select26 open="yes" />;
// @ts-expect-error N007 Select26: string default popup state
<Select26 defaultOpen="yes" />;
// @ts-expect-error N008 Select26: native select ref is not button ref
<Select26 ref={React.createRef<HTMLSelectElement>()} />;
// @ts-expect-error N009 Select26: native multiple unsupported
<Select26 multiple />;
// @ts-expect-error N010 Select26: native select onChange unsupported
<Select26 onChange={()=>{}} />;
// @ts-expect-error N011 Select26: children owned by listbox
<Select26 children="Bad" />;
// @ts-expect-error N012 Select26: inner HTML owned by listbox
<Select26 dangerouslySetInnerHTML={{__html:"Bad"}} />;
// @ts-expect-error N013 Select26: numeric label
<Select26 label={2} />;
// @ts-expect-error N014 Select26: React node label unsupported
<Select26 label={<b>Bad</b>} />;
// @ts-expect-error N015 Select26: numeric placeholder
<Select26 placeholder={2} />;
// @ts-expect-error N016 Select26: numeric helper
<Select26 helper={2} />;
// @ts-expect-error N017 Select26: boolean error unsupported
<Select26 error={true} />;
// @ts-expect-error N018 Select26: numeric name
<Select26 name={2} />;
// @ts-expect-error N019 Select26: form must be ID string
<Select26 form={document.createElement("form")} />;
// @ts-expect-error N020 Select26: string required
<Select26 required="yes" />;
// @ts-expect-error N021 Select26: string disabled
<Select26 disabled="yes" />;
// @ts-expect-error N022 Select26: string readonly
<Select26 readOnly="yes" />;
// @ts-expect-error N023 Select26: invalid direction
<Select26 dir="auto" />;
// @ts-expect-error N024 Select26: invalid motion enum
<Select26 motion="reduced" />;
// @ts-expect-error N025 Select26: invalid aria-invalid
<Select26 aria-invalid="invalid" />;
// @ts-expect-error N026 Select26: trigger type owned
<Select26 triggerProps={{type:"submit"}} />;
// @ts-expect-error N027 Select26: trigger name owned
<Select26 triggerProps={{name:"bad"}} />;
// @ts-expect-error N028 Select26: trigger role owned
<Select26 triggerProps={{role:"listbox"}} />;
// @ts-expect-error N029 Select26: wrong callback selected type
<Select26 onValueChange={(value:number)=>{}} />;
// @ts-expect-error N030 Select26: wrong callback open type
<Select26 onOpenChange={(open:string)=>{}} />;
// @ts-expect-error N031 Select26: explicit undefined value not valid owner
<Select26 value={undefined} />;
// @ts-expect-error N032 Select26: explicit undefined open not valid owner
<Select26 open={undefined} />;
// @ts-expect-error N033 Select26: nested group unsupported
<Select26 options={[{label:"Group",options:[{label:"Nested",options:[]}]}]} />;
// @ts-expect-error N034 Select26: mixed option/group rejected
<Select26 options={[{value:"a",label:"A",options:[]}]} />;
// @ts-expect-error N035 Select26: numeric option label rejected
<Select26 options={[{value:"a",label:2}]} />;
// @ts-expect-error N036 Select26: numeric option value rejected
<Select26 options={[{value:2,label:"A"}]} />;
// @ts-expect-error N037 Select26: group disabled boolean only
<Select26 options={[{label:"Group",options:[],disabled:"yes"}]} />;
// @ts-expect-error N038 Select27: controlled and default values conflict
<Select27 value="a" defaultValue="b" />;
// @ts-expect-error N039 Select27: controlled and default popup state conflict
<Select27 open defaultOpen />;
// @ts-expect-error N040 Select27: numeric controlled value
<Select27 value={2} />;
// @ts-expect-error N041 Select27: numeric default value
<Select27 defaultValue={2} />;
// @ts-expect-error N042 Select27: array selection unsupported
<Select27 value={["a"]} />;
// @ts-expect-error N043 Select27: string popup state
<Select27 open="yes" />;
// @ts-expect-error N044 Select27: string default popup state
<Select27 defaultOpen="yes" />;
// @ts-expect-error N045 Select27: native select ref is not button ref
<Select27 ref={React.createRef<HTMLSelectElement>()} />;
// @ts-expect-error N046 Select27: native multiple unsupported
<Select27 multiple />;
// @ts-expect-error N047 Select27: native select onChange unsupported
<Select27 onChange={()=>{}} />;
// @ts-expect-error N048 Select27: children owned by listbox
<Select27 children="Bad" />;
// @ts-expect-error N049 Select27: inner HTML owned by listbox
<Select27 dangerouslySetInnerHTML={{__html:"Bad"}} />;
// @ts-expect-error N050 Select27: numeric label
<Select27 label={2} />;
// @ts-expect-error N051 Select27: React node label unsupported
<Select27 label={<b>Bad</b>} />;
// @ts-expect-error N052 Select27: numeric placeholder
<Select27 placeholder={2} />;
// @ts-expect-error N053 Select27: numeric helper
<Select27 helper={2} />;
// @ts-expect-error N054 Select27: boolean error unsupported
<Select27 error={true} />;
// @ts-expect-error N055 Select27: numeric name
<Select27 name={2} />;
// @ts-expect-error N056 Select27: form must be ID string
<Select27 form={document.createElement("form")} />;
// @ts-expect-error N057 Select27: string required
<Select27 required="yes" />;
// @ts-expect-error N058 Select27: string disabled
<Select27 disabled="yes" />;
// @ts-expect-error N059 Select27: string readonly
<Select27 readOnly="yes" />;
// @ts-expect-error N060 Select27: invalid direction
<Select27 dir="auto" />;
// @ts-expect-error N061 Select27: invalid motion enum
<Select27 motion="reduced" />;
// @ts-expect-error N062 Select27: invalid aria-invalid
<Select27 aria-invalid="invalid" />;
// @ts-expect-error N063 Select27: trigger type owned
<Select27 triggerProps={{type:"submit"}} />;
// @ts-expect-error N064 Select27: trigger name owned
<Select27 triggerProps={{name:"bad"}} />;
// @ts-expect-error N065 Select27: trigger role owned
<Select27 triggerProps={{role:"listbox"}} />;
// @ts-expect-error N066 Select27: wrong callback selected type
<Select27 onValueChange={(value:number)=>{}} />;
// @ts-expect-error N067 Select27: wrong callback open type
<Select27 onOpenChange={(open:string)=>{}} />;
// @ts-expect-error N068 Select27: explicit undefined value not valid owner
<Select27 value={undefined} />;
// @ts-expect-error N069 Select27: explicit undefined open not valid owner
<Select27 open={undefined} />;
// @ts-expect-error N070 Select27: nested group unsupported
<Select27 options={[{label:"Group",options:[{label:"Nested",options:[]}]}]} />;
// @ts-expect-error N071 Select27: mixed option/group rejected
<Select27 options={[{value:"a",label:"A",options:[]}]} />;
// @ts-expect-error N072 Select27: numeric option label rejected
<Select27 options={[{value:"a",label:2}]} />;
// @ts-expect-error N073 Select27: numeric option value rejected
<Select27 options={[{value:2,label:"A"}]} />;
// @ts-expect-error N074 Select27: group disabled boolean only
<Select27 options={[{label:"Group",options:[],disabled:"yes"}]} />;
// @ts-expect-error N075 Select28: controlled and default values conflict
<Select28 value="a" defaultValue="b" />;
// @ts-expect-error N076 Select28: controlled and default popup state conflict
<Select28 open defaultOpen />;
// @ts-expect-error N077 Select28: numeric controlled value
<Select28 value={2} />;
// @ts-expect-error N078 Select28: numeric default value
<Select28 defaultValue={2} />;
// @ts-expect-error N079 Select28: array selection unsupported
<Select28 value={["a"]} />;
// @ts-expect-error N080 Select28: string popup state
<Select28 open="yes" />;
// @ts-expect-error N081 Select28: string default popup state
<Select28 defaultOpen="yes" />;
// @ts-expect-error N082 Select28: native select ref is not button ref
<Select28 ref={React.createRef<HTMLSelectElement>()} />;
// @ts-expect-error N083 Select28: native multiple unsupported
<Select28 multiple />;
// @ts-expect-error N084 Select28: native select onChange unsupported
<Select28 onChange={()=>{}} />;
// @ts-expect-error N085 Select28: children owned by listbox
<Select28 children="Bad" />;
// @ts-expect-error N086 Select28: inner HTML owned by listbox
<Select28 dangerouslySetInnerHTML={{__html:"Bad"}} />;
// @ts-expect-error N087 Select28: numeric label
<Select28 label={2} />;
// @ts-expect-error N088 Select28: React node label unsupported
<Select28 label={<b>Bad</b>} />;
// @ts-expect-error N089 Select28: numeric placeholder
<Select28 placeholder={2} />;
// @ts-expect-error N090 Select28: numeric helper
<Select28 helper={2} />;
// @ts-expect-error N091 Select28: boolean error unsupported
<Select28 error={true} />;
// @ts-expect-error N092 Select28: numeric name
<Select28 name={2} />;
// @ts-expect-error N093 Select28: form must be ID string
<Select28 form={document.createElement("form")} />;
// @ts-expect-error N094 Select28: string required
<Select28 required="yes" />;
// @ts-expect-error N095 Select28: string disabled
<Select28 disabled="yes" />;
// @ts-expect-error N096 Select28: string readonly
<Select28 readOnly="yes" />;
// @ts-expect-error N097 Select28: invalid direction
<Select28 dir="auto" />;
// @ts-expect-error N098 Select28: invalid motion enum
<Select28 motion="reduced" />;
// @ts-expect-error N099 Select28: invalid aria-invalid
<Select28 aria-invalid="invalid" />;
// @ts-expect-error N100 Select28: trigger type owned
<Select28 triggerProps={{type:"submit"}} />;
// @ts-expect-error N101 Select28: trigger name owned
<Select28 triggerProps={{name:"bad"}} />;
// @ts-expect-error N102 Select28: trigger role owned
<Select28 triggerProps={{role:"listbox"}} />;
// @ts-expect-error N103 Select28: wrong callback selected type
<Select28 onValueChange={(value:number)=>{}} />;
// @ts-expect-error N104 Select28: wrong callback open type
<Select28 onOpenChange={(open:string)=>{}} />;
// @ts-expect-error N105 Select28: explicit undefined value not valid owner
<Select28 value={undefined} />;
// @ts-expect-error N106 Select28: explicit undefined open not valid owner
<Select28 open={undefined} />;
// @ts-expect-error N107 Select28: nested group unsupported
<Select28 options={[{label:"Group",options:[{label:"Nested",options:[]}]}]} />;
// @ts-expect-error N108 Select28: mixed option/group rejected
<Select28 options={[{value:"a",label:"A",options:[]}]} />;
// @ts-expect-error N109 Select28: numeric option label rejected
<Select28 options={[{value:"a",label:2}]} />;
// @ts-expect-error N110 Select28: numeric option value rejected
<Select28 options={[{value:2,label:"A"}]} />;
// @ts-expect-error N111 Select28: group disabled boolean only
<Select28 options={[{label:"Group",options:[],disabled:"yes"}]} />;
// @ts-expect-error N112 Select29: controlled and default values conflict
<Select29 value="a" defaultValue="b" />;
// @ts-expect-error N113 Select29: controlled and default popup state conflict
<Select29 open defaultOpen />;
// @ts-expect-error N114 Select29: numeric controlled value
<Select29 value={2} />;
// @ts-expect-error N115 Select29: numeric default value
<Select29 defaultValue={2} />;
// @ts-expect-error N116 Select29: array selection unsupported
<Select29 value={["a"]} />;
// @ts-expect-error N117 Select29: string popup state
<Select29 open="yes" />;
// @ts-expect-error N118 Select29: string default popup state
<Select29 defaultOpen="yes" />;
// @ts-expect-error N119 Select29: native select ref is not button ref
<Select29 ref={React.createRef<HTMLSelectElement>()} />;
// @ts-expect-error N120 Select29: native multiple unsupported
<Select29 multiple />;
// @ts-expect-error N121 Select29: native select onChange unsupported
<Select29 onChange={()=>{}} />;
// @ts-expect-error N122 Select29: children owned by listbox
<Select29 children="Bad" />;
// @ts-expect-error N123 Select29: inner HTML owned by listbox
<Select29 dangerouslySetInnerHTML={{__html:"Bad"}} />;
// @ts-expect-error N124 Select29: numeric label
<Select29 label={2} />;
// @ts-expect-error N125 Select29: React node label unsupported
<Select29 label={<b>Bad</b>} />;
// @ts-expect-error N126 Select29: numeric placeholder
<Select29 placeholder={2} />;
// @ts-expect-error N127 Select29: numeric helper
<Select29 helper={2} />;
// @ts-expect-error N128 Select29: boolean error unsupported
<Select29 error={true} />;
// @ts-expect-error N129 Select29: numeric name
<Select29 name={2} />;
// @ts-expect-error N130 Select29: form must be ID string
<Select29 form={document.createElement("form")} />;
// @ts-expect-error N131 Select29: string required
<Select29 required="yes" />;
// @ts-expect-error N132 Select29: string disabled
<Select29 disabled="yes" />;
// @ts-expect-error N133 Select29: string readonly
<Select29 readOnly="yes" />;
// @ts-expect-error N134 Select29: invalid direction
<Select29 dir="auto" />;
// @ts-expect-error N135 Select29: invalid motion enum
<Select29 motion="reduced" />;
// @ts-expect-error N136 Select29: invalid aria-invalid
<Select29 aria-invalid="invalid" />;
// @ts-expect-error N137 Select29: trigger type owned
<Select29 triggerProps={{type:"submit"}} />;
// @ts-expect-error N138 Select29: trigger name owned
<Select29 triggerProps={{name:"bad"}} />;
// @ts-expect-error N139 Select29: trigger role owned
<Select29 triggerProps={{role:"listbox"}} />;
// @ts-expect-error N140 Select29: wrong callback selected type
<Select29 onValueChange={(value:number)=>{}} />;
// @ts-expect-error N141 Select29: wrong callback open type
<Select29 onOpenChange={(open:string)=>{}} />;
// @ts-expect-error N142 Select29: explicit undefined value not valid owner
<Select29 value={undefined} />;
// @ts-expect-error N143 Select29: explicit undefined open not valid owner
<Select29 open={undefined} />;
// @ts-expect-error N144 Select29: nested group unsupported
<Select29 options={[{label:"Group",options:[{label:"Nested",options:[]}]}]} />;
// @ts-expect-error N145 Select29: mixed option/group rejected
<Select29 options={[{value:"a",label:"A",options:[]}]} />;
// @ts-expect-error N146 Select29: numeric option label rejected
<Select29 options={[{value:"a",label:2}]} />;
// @ts-expect-error N147 Select29: numeric option value rejected
<Select29 options={[{value:2,label:"A"}]} />;
// @ts-expect-error N148 Select29: group disabled boolean only
<Select29 options={[{label:"Group",options:[],disabled:"yes"}]} />;
// @ts-expect-error N149 immutable ID tuple
wixSelectContentIds.push("select-26");
// @ts-expect-error N150 immutable option value
const readonlyOption:SelectOption={value:"a",label:"A"}; readonlyOption.value="b";
// @ts-expect-error N151 immutable group options
const readonlyGroup:SelectGroup={label:"G",options:[]}; readonlyGroup.options.push({value:"a",label:"A"});
// @ts-expect-error N152 detail original event is readonly
const readonlyDetail = (d:SelectValueChangeDetail) => {d.originalEvent=new Event("click");};
// @ts-expect-error N153 detail reason is readonly
const readonlyReason = (d:SelectOpenChangeDetail) => {d.reason="trigger";};
const acceptsProps=(props:SelectContentProps)=>props;
void acceptsProps;

const separator: SelectSeparator = {separator:true};
const mixed: readonly SelectItem[] = [{separator:true},{value:"a",label:"A"},{label:"Group",options:[{value:"b",label:"B"}]},separator];
<Select26 options={mixed} />;
// @ts-expect-error N154 Select26: separator must be literal true
<Select26 options={[{separator:false}]} />;
// @ts-expect-error N155 Select26: separator cannot carry selectable value
<Select26 options={[{separator:true,value:"a"}]} />;
// @ts-expect-error N156 Select26: separator cannot carry group options
<Select26 options={[{separator:true,options:[]}]} />;
// @ts-expect-error N157 Select26: separator has no accessible label override
<Select26 options={[{separator:true,label:"Divider"}]} />;
// @ts-expect-error N158 Select26: separator cannot be nested in group
<Select26 options={[{label:"Group",options:[{separator:true}]}]} />;
// @ts-expect-error N159 Select26: separator cannot be disabled
<Select26 options={[{separator:true,disabled:true}]} />;
// @ts-expect-error N160 Select26: explicit undefined separator violates exact optional contract
<Select26 options={[{value:"a",label:"A",separator:undefined}]} />;
// @ts-expect-error N161 Select26: option cannot silently carry false separator
<Select26 options={[{value:"a",label:"A",separator:false}]} />;
<Select27 options={mixed} />;
// @ts-expect-error N162 Select27: separator must be literal true
<Select27 options={[{separator:false}]} />;
// @ts-expect-error N163 Select27: separator cannot carry selectable value
<Select27 options={[{separator:true,value:"a"}]} />;
// @ts-expect-error N164 Select27: separator cannot carry group options
<Select27 options={[{separator:true,options:[]}]} />;
// @ts-expect-error N165 Select27: separator has no accessible label override
<Select27 options={[{separator:true,label:"Divider"}]} />;
// @ts-expect-error N166 Select27: separator cannot be nested in group
<Select27 options={[{label:"Group",options:[{separator:true}]}]} />;
// @ts-expect-error N167 Select27: separator cannot be disabled
<Select27 options={[{separator:true,disabled:true}]} />;
// @ts-expect-error N168 Select27: explicit undefined separator violates exact optional contract
<Select27 options={[{value:"a",label:"A",separator:undefined}]} />;
// @ts-expect-error N169 Select27: option cannot silently carry false separator
<Select27 options={[{value:"a",label:"A",separator:false}]} />;
<Select28 options={mixed} />;
// @ts-expect-error N170 Select28: separator must be literal true
<Select28 options={[{separator:false}]} />;
// @ts-expect-error N171 Select28: separator cannot carry selectable value
<Select28 options={[{separator:true,value:"a"}]} />;
// @ts-expect-error N172 Select28: separator cannot carry group options
<Select28 options={[{separator:true,options:[]}]} />;
// @ts-expect-error N173 Select28: separator has no accessible label override
<Select28 options={[{separator:true,label:"Divider"}]} />;
// @ts-expect-error N174 Select28: separator cannot be nested in group
<Select28 options={[{label:"Group",options:[{separator:true}]}]} />;
// @ts-expect-error N175 Select28: separator cannot be disabled
<Select28 options={[{separator:true,disabled:true}]} />;
// @ts-expect-error N176 Select28: explicit undefined separator violates exact optional contract
<Select28 options={[{value:"a",label:"A",separator:undefined}]} />;
// @ts-expect-error N177 Select28: option cannot silently carry false separator
<Select28 options={[{value:"a",label:"A",separator:false}]} />;
<Select29 options={mixed} />;
// @ts-expect-error N178 Select29: separator must be literal true
<Select29 options={[{separator:false}]} />;
// @ts-expect-error N179 Select29: separator cannot carry selectable value
<Select29 options={[{separator:true,value:"a"}]} />;
// @ts-expect-error N180 Select29: separator cannot carry group options
<Select29 options={[{separator:true,options:[]}]} />;
// @ts-expect-error N181 Select29: separator has no accessible label override
<Select29 options={[{separator:true,label:"Divider"}]} />;
// @ts-expect-error N182 Select29: separator cannot be nested in group
<Select29 options={[{label:"Group",options:[{separator:true}]}]} />;
// @ts-expect-error N183 Select29: separator cannot be disabled
<Select29 options={[{separator:true,disabled:true}]} />;
// @ts-expect-error N184 Select29: explicit undefined separator violates exact optional contract
<Select29 options={[{value:"a",label:"A",separator:undefined}]} />;
// @ts-expect-error N185 Select29: option cannot silently carry false separator
<Select29 options={[{value:"a",label:"A",separator:false}]} />;

<Select26 prefix="Palette:" options={[{value:"a",label:"Code",decoration:{kind:"icon",name:"code"}},{value:"b",label:"Live",decoration:{kind:"status",tone:"active"}}]} />;
// @ts-expect-error N186 Select26: prefix must be a string
<Select26 prefix={23} />;
// @ts-expect-error N187 Select26: explicit undefined prefix violates exact optional
<Select26 prefix={undefined} />;
// @ts-expect-error N188 Select26: decoration requires a discriminant
<Select26 options={[{value:"a",label:"A",decoration:{name:"code"}}]} />;
// @ts-expect-error N189 Select26: unknown icon name
<Select26 options={[{value:"a",label:"A",decoration:{kind:"icon",name:"unknown"}}]} />;
// @ts-expect-error N190 Select26: unknown status tone
<Select26 options={[{value:"a",label:"A",decoration:{kind:"status",tone:"green"}}]} />;
// @ts-expect-error N191 Select26: icon cannot also carry status tone
<Select26 options={[{value:"a",label:"A",decoration:{kind:"icon",name:"code",tone:"active"}}]} />;
// @ts-expect-error N192 Select26: status cannot also carry icon name
<Select26 options={[{value:"a",label:"A",decoration:{kind:"status",tone:"active",name:"code"}}]} />;
// @ts-expect-error N193 Select26: groups have no decoration
<Select26 options={[{label:"Group",options:[],decoration:{kind:"icon",name:"code"}}]} />;
// @ts-expect-error N194 Select26: separators have no decoration
<Select26 options={[{separator:true,decoration:{kind:"icon",name:"code"}}]} />;
// @ts-expect-error N195 Select26: no arbitrary ReactNode decoration
<Select26 options={[{value:"a",label:"A",decoration:<span />}]} />;
// @ts-expect-error N196 Select26: no event handler in decoration
<Select26 options={[{value:"a",label:"A",decoration:{kind:"icon",name:"code",onClick:()=>{}}}]} />;
// @ts-expect-error N197 Select26: no decoration URL
<Select26 options={[{value:"a",label:"A",decoration:{kind:"icon",name:"code",src:"/asset.svg"}}]} />;
// @ts-expect-error N198 Select26: explicit undefined decoration violates exact optional
<Select26 options={[{value:"a",label:"A",decoration:undefined}]} />;
// @ts-expect-error N199 Select26: explicit undefined hybrid icon tone forbidden
<Select26 options={[{value:"a",label:"A",decoration:{kind:"icon",name:"code",tone:undefined}}]} />;
// @ts-expect-error N200 Select26: status requires tone
<Select26 options={[{value:"a",label:"A",decoration:{kind:"status"}}]} />;
// @ts-expect-error N201 Select26: icon requires name
<Select26 options={[{value:"a",label:"A",decoration:{kind:"icon"}}]} />;

<Select27 prefix="Palette:" options={[{value:"a",label:"Code",decoration:{kind:"icon",name:"code"}},{value:"b",label:"Live",decoration:{kind:"status",tone:"active"}}]} />;
// @ts-expect-error N202 Select27: prefix must be a string
<Select27 prefix={23} />;
// @ts-expect-error N203 Select27: explicit undefined prefix violates exact optional
<Select27 prefix={undefined} />;
// @ts-expect-error N204 Select27: decoration requires a discriminant
<Select27 options={[{value:"a",label:"A",decoration:{name:"code"}}]} />;
// @ts-expect-error N205 Select27: unknown icon name
<Select27 options={[{value:"a",label:"A",decoration:{kind:"icon",name:"unknown"}}]} />;
// @ts-expect-error N206 Select27: unknown status tone
<Select27 options={[{value:"a",label:"A",decoration:{kind:"status",tone:"green"}}]} />;
// @ts-expect-error N207 Select27: icon cannot also carry status tone
<Select27 options={[{value:"a",label:"A",decoration:{kind:"icon",name:"code",tone:"active"}}]} />;
// @ts-expect-error N208 Select27: status cannot also carry icon name
<Select27 options={[{value:"a",label:"A",decoration:{kind:"status",tone:"active",name:"code"}}]} />;
// @ts-expect-error N209 Select27: groups have no decoration
<Select27 options={[{label:"Group",options:[],decoration:{kind:"icon",name:"code"}}]} />;
// @ts-expect-error N210 Select27: separators have no decoration
<Select27 options={[{separator:true,decoration:{kind:"icon",name:"code"}}]} />;
// @ts-expect-error N211 Select27: no arbitrary ReactNode decoration
<Select27 options={[{value:"a",label:"A",decoration:<span />}]} />;
// @ts-expect-error N212 Select27: no event handler in decoration
<Select27 options={[{value:"a",label:"A",decoration:{kind:"icon",name:"code",onClick:()=>{}}}]} />;
// @ts-expect-error N213 Select27: no decoration URL
<Select27 options={[{value:"a",label:"A",decoration:{kind:"icon",name:"code",src:"/asset.svg"}}]} />;
// @ts-expect-error N214 Select27: explicit undefined decoration violates exact optional
<Select27 options={[{value:"a",label:"A",decoration:undefined}]} />;
// @ts-expect-error N215 Select27: explicit undefined hybrid icon tone forbidden
<Select27 options={[{value:"a",label:"A",decoration:{kind:"icon",name:"code",tone:undefined}}]} />;
// @ts-expect-error N216 Select27: status requires tone
<Select27 options={[{value:"a",label:"A",decoration:{kind:"status"}}]} />;
// @ts-expect-error N217 Select27: icon requires name
<Select27 options={[{value:"a",label:"A",decoration:{kind:"icon"}}]} />;

<Select28 prefix="Palette:" options={[{value:"a",label:"Code",decoration:{kind:"icon",name:"code"}},{value:"b",label:"Live",decoration:{kind:"status",tone:"active"}}]} />;
// @ts-expect-error N218 Select28: prefix must be a string
<Select28 prefix={23} />;
// @ts-expect-error N219 Select28: explicit undefined prefix violates exact optional
<Select28 prefix={undefined} />;
// @ts-expect-error N220 Select28: decoration requires a discriminant
<Select28 options={[{value:"a",label:"A",decoration:{name:"code"}}]} />;
// @ts-expect-error N221 Select28: unknown icon name
<Select28 options={[{value:"a",label:"A",decoration:{kind:"icon",name:"unknown"}}]} />;
// @ts-expect-error N222 Select28: unknown status tone
<Select28 options={[{value:"a",label:"A",decoration:{kind:"status",tone:"green"}}]} />;
// @ts-expect-error N223 Select28: icon cannot also carry status tone
<Select28 options={[{value:"a",label:"A",decoration:{kind:"icon",name:"code",tone:"active"}}]} />;
// @ts-expect-error N224 Select28: status cannot also carry icon name
<Select28 options={[{value:"a",label:"A",decoration:{kind:"status",tone:"active",name:"code"}}]} />;
// @ts-expect-error N225 Select28: groups have no decoration
<Select28 options={[{label:"Group",options:[],decoration:{kind:"icon",name:"code"}}]} />;
// @ts-expect-error N226 Select28: separators have no decoration
<Select28 options={[{separator:true,decoration:{kind:"icon",name:"code"}}]} />;
// @ts-expect-error N227 Select28: no arbitrary ReactNode decoration
<Select28 options={[{value:"a",label:"A",decoration:<span />}]} />;
// @ts-expect-error N228 Select28: no event handler in decoration
<Select28 options={[{value:"a",label:"A",decoration:{kind:"icon",name:"code",onClick:()=>{}}}]} />;
// @ts-expect-error N229 Select28: no decoration URL
<Select28 options={[{value:"a",label:"A",decoration:{kind:"icon",name:"code",src:"/asset.svg"}}]} />;
// @ts-expect-error N230 Select28: explicit undefined decoration violates exact optional
<Select28 options={[{value:"a",label:"A",decoration:undefined}]} />;
// @ts-expect-error N231 Select28: explicit undefined hybrid icon tone forbidden
<Select28 options={[{value:"a",label:"A",decoration:{kind:"icon",name:"code",tone:undefined}}]} />;
// @ts-expect-error N232 Select28: status requires tone
<Select28 options={[{value:"a",label:"A",decoration:{kind:"status"}}]} />;
// @ts-expect-error N233 Select28: icon requires name
<Select28 options={[{value:"a",label:"A",decoration:{kind:"icon"}}]} />;

<Select29 prefix="Palette:" options={[{value:"a",label:"Code",decoration:{kind:"icon",name:"code"}},{value:"b",label:"Live",decoration:{kind:"status",tone:"active"}}]} />;
// @ts-expect-error N234 Select29: prefix must be a string
<Select29 prefix={23} />;
// @ts-expect-error N235 Select29: explicit undefined prefix violates exact optional
<Select29 prefix={undefined} />;
// @ts-expect-error N236 Select29: decoration requires a discriminant
<Select29 options={[{value:"a",label:"A",decoration:{name:"code"}}]} />;
// @ts-expect-error N237 Select29: unknown icon name
<Select29 options={[{value:"a",label:"A",decoration:{kind:"icon",name:"unknown"}}]} />;
// @ts-expect-error N238 Select29: unknown status tone
<Select29 options={[{value:"a",label:"A",decoration:{kind:"status",tone:"green"}}]} />;
// @ts-expect-error N239 Select29: icon cannot also carry status tone
<Select29 options={[{value:"a",label:"A",decoration:{kind:"icon",name:"code",tone:"active"}}]} />;
// @ts-expect-error N240 Select29: status cannot also carry icon name
<Select29 options={[{value:"a",label:"A",decoration:{kind:"status",tone:"active",name:"code"}}]} />;
// @ts-expect-error N241 Select29: groups have no decoration
<Select29 options={[{label:"Group",options:[],decoration:{kind:"icon",name:"code"}}]} />;
// @ts-expect-error N242 Select29: separators have no decoration
<Select29 options={[{separator:true,decoration:{kind:"icon",name:"code"}}]} />;
// @ts-expect-error N243 Select29: no arbitrary ReactNode decoration
<Select29 options={[{value:"a",label:"A",decoration:<span />}]} />;
// @ts-expect-error N244 Select29: no event handler in decoration
<Select29 options={[{value:"a",label:"A",decoration:{kind:"icon",name:"code",onClick:()=>{}}}]} />;
// @ts-expect-error N245 Select29: no decoration URL
<Select29 options={[{value:"a",label:"A",decoration:{kind:"icon",name:"code",src:"/asset.svg"}}]} />;
// @ts-expect-error N246 Select29: explicit undefined decoration violates exact optional
<Select29 options={[{value:"a",label:"A",decoration:undefined}]} />;
// @ts-expect-error N247 Select29: explicit undefined hybrid icon tone forbidden
<Select29 options={[{value:"a",label:"A",decoration:{kind:"icon",name:"code",tone:undefined}}]} />;
// @ts-expect-error N248 Select29: status requires tone
<Select29 options={[{value:"a",label:"A",decoration:{kind:"status"}}]} />;
// @ts-expect-error N249 Select29: icon requires name
<Select29 options={[{value:"a",label:"A",decoration:{kind:"icon"}}]} />;
