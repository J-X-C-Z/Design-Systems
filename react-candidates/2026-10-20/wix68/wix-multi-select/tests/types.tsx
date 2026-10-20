import * as React from 'react';
import { Select32, Select33, wixMultiSelectIds, type MultiSelectProps, type MultiSelectOption, type MultiSelectTriggerProps, type MultiSelectValueState, type MultiSelectOpenState, type MultiSelectCommonProps, type MultiSelectChangeDetail, type MultiSelectValueChangeReason, type MultiSelectOpenChangeReason, type MultiSelectValueChangeDetail, type MultiSelectOpenChangeDetail, type MultiSelectValueChangeHandler, type MultiSelectOpenChangeHandler, type Select32Props, type Select33Props, type WixMultiSelectId } from '../src/index.js';
import { PacketDesk } from './PacketDesk.js';
import { buildPalettePacket, canonicalizePaletteColors, parsePacketFormData, sectionOptions, formatOptions, type PacketSettings, type PacketSection, type PacketFormat, type PacketFile, type PalettePacket } from './palette-packet.js';

// Static types do not prove density, uniqueness, nonempty strings, runtime validation,
// immutability at runtime, DOM focus, or form behavior. Those have separate runtime tests.
const ref = React.createRef<HTMLButtonElement>();
const readonlyValues: readonly string[] = Object.freeze(['b', 'a', 'latent']);
const empty: readonly string[] = [];
const mutableValues: string[] = ['a'];
const items: readonly MultiSelectOption[] = Object.freeze([{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta', disabled: true }]);
const tupleOptions = [{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta', disabled: false }] as const satisfies readonly MultiSelectOption[];
const valueHandler: MultiSelectValueChangeHandler = (next, detail) => {
  const readonlyNext: readonly string[] = next;
  const reason: 'pointer' | 'keyboard' | 'clear' | 'remove' = detail.reason;
  const event: Event = detail.originalEvent;
  const cancelable: true = detail.cancelable;
  const prevented: boolean = detail.defaultPrevented;
  const generic: MultiSelectChangeDetail<MultiSelectValueChangeReason> = detail;
  detail.preventDefault();
  switch (reason) { case 'pointer': case 'keyboard': case 'clear': case 'remove': break; default: { const exhaustive: never = reason; void exhaustive; } }
  void [readonlyNext, event, cancelable, prevented, generic];
};
const openHandler: MultiSelectOpenChangeHandler = (open, detail) => {
  const next: boolean = open;
  const reason: 'trigger' | 'keyboard' | 'escape' | 'tab' | 'outside-pointer' | 'focus-out' = detail.reason;
  const event: Event = detail.originalEvent;
  const generic: MultiSelectChangeDetail<MultiSelectOpenChangeReason> = detail;
  detail.preventDefault();
  switch (reason) { case 'trigger': case 'keyboard': case 'escape': case 'tab': case 'outside-pointer': case 'focus-out': break; default: { const exhaustive: never = reason; void exhaustive; } }
  void [next, event, generic];
};
const trigger: MultiSelectTriggerProps = {
  title: 'Choose several', tabIndex: 0, autoFocus: false,
  onClick: event => { const button: HTMLButtonElement = event.currentTarget; button.focus(); event.preventDefault(); },
  onClickCapture: event => { const native: MouseEvent = event.nativeEvent; void native; },
  onKeyDown: event => { const key: string = event.key; const button: HTMLButtonElement = event.currentTarget; void [key, button]; },
  onKeyDownCapture: event => event.preventDefault(),
  onPointerDown: event => { const pointer: number = event.pointerId; void pointer; },
  onPointerDownCapture: event => { const native: PointerEvent = event.nativeEvent; void native; },
  onFocus: event => { const button: HTMLButtonElement = event.currentTarget; void button; },
  onFocusCapture: event => { void event.relatedTarget; },
  onBlur: event => { const button: HTMLButtonElement = event.currentTarget; void button; },
  onBlurCapture: event => { void event.relatedTarget; },
};
const valueAlias: MultiSelectValueState = { value: readonlyValues };
const openAlias: MultiSelectOpenState = { defaultOpen: false };
const commonAlias: MultiSelectCommonProps = { options: items, triggerProps: trigger, clearable: true, showSelectedItems: true, pluralLabel: 'items selected' };
const alias32: Select32Props = { ...valueAlias, ...openAlias, ...commonAlias };
const alias33: Select33Props = alias32;
const aliasCommon: MultiSelectProps = alias33;
const id: WixMultiSelectId = wixMultiSelectIds[0];
const ids: readonly ['select-32', 'select-33'] = wixMultiSelectIds;
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
const ref32: Equal<React.ComponentRef<typeof Select32>, HTMLButtonElement> = true;
const ref33: Equal<React.ComponentRef<typeof Select33>, HTMLButtonElement> = true;
const aliasEquality: Equal<Select32Props, Select33Props> = true;
void [aliasCommon, id, ids, ref32, ref33, aliasEquality];

// The complete example is compiled as a separate file and its self-import must
// resolve to the selected source or public-declaration lane, never another build.
<PacketDesk />;
<PacketDesk colors={Object.freeze(['#A47864', '#FFFFFF'])} motion="off" />;
const settings: PacketSettings = { sections: ['swatches', 'metadata'] as const, formats: ['html', 'json', 'css', 'csv', 'svg'] as const };
const section: PacketSection = sectionOptions[0].value;
const format: PacketFormat = formatOptions[0].value;
const packet: PalettePacket = buildPalettePacket(Object.freeze(['#a47864']), settings);
const file: PacketFile | undefined = packet.files[0];
const zip: Uint8Array = packet.bytes;
const colors: readonly string[] = canonicalizePaletteColors(['#a47864']);
const parsed: PacketSettings = parsePacketFormData(new FormData());
void [section, format, file, zip, colors, parsed];

<Select32 ref={ref} />;
<Select32 {...alias32} />;
<Select32 value={readonlyValues} defaultOpen options={items} onValueChange={valueHandler} onOpenChange={openHandler} />;
<Select32 defaultValue={readonlyValues} open={false} options={tupleOptions} />;
<Select32 value={empty} />;
<Select32 defaultValue={mutableValues} />;
<Select32 defaultValue={[]} defaultOpen={false} label="Services" placeholder="Choose services" pluralLabel="services active" helper="Local selection only" error="Choose a service" clearable showSelectedItems name="services" form="external" required disabled={false} readOnly={false} dir="rtl" motion="off" id="services" className="custom" style={{ maxWidth: 320 }} aria-label="Services" aria-labelledby="external-label" aria-describedby="extra-help" aria-invalid="grammar" triggerProps={trigger} />;
<Select32 ref={node => { if (node) { const button: HTMLButtonElement = node; button.focus(); } }} />;
<Select32 onValueChange={(next, detail) => { const selected: readonly string[] = next; const info: MultiSelectValueChangeDetail = detail; void [selected, info]; }} onOpenChange={(next, detail) => { const opened: boolean = next; const info: MultiSelectOpenChangeDetail = detail; void [opened, info]; }} />;

<Select33 ref={ref} />;
<Select33 {...alias32} />;
<Select33 value={readonlyValues} defaultOpen options={items} onValueChange={valueHandler} onOpenChange={openHandler} />;
<Select33 defaultValue={readonlyValues} open={false} options={tupleOptions} />;
<Select33 value={empty} />;
<Select33 defaultValue={mutableValues} />;
<Select33 defaultValue={[]} defaultOpen={false} label="Services" placeholder="Choose services" pluralLabel="services active" helper="Local selection only" error="Choose a service" clearable showSelectedItems name="services" form="external" required disabled={false} readOnly={false} dir="rtl" motion="off" id="services" className="custom" style={{ maxWidth: 320 }} aria-label="Services" aria-labelledby="external-label" aria-describedby="extra-help" aria-invalid="grammar" triggerProps={trigger} />;
<Select33 ref={node => { if (node) { const button: HTMLButtonElement = node; button.focus(); } }} />;
<Select33 onValueChange={(next, detail) => { const selected: readonly string[] = next; const info: MultiSelectValueChangeDetail = detail; void [selected, info]; }} onOpenChange={(next, detail) => { const opened: boolean = next; const info: MultiSelectOpenChangeDetail = detail; void [opened, info]; }} />;

// @ts-expect-error N001 Select32: controlled/default array ownership conflict
<Select32 value={["a"]} defaultValue={["b"]} />;

// @ts-expect-error N002 Select32: controlled/default open ownership conflict
<Select32 open defaultOpen />;

// @ts-expect-error N003 Select32: scalar string is not array selection
<Select32 value="a" />;

// @ts-expect-error N004 Select32: scalar default is not array selection
<Select32 defaultValue="a" />;

// @ts-expect-error N005 Select32: numeric owner rejected
<Select32 value={2} />;

// @ts-expect-error N006 Select32: Set owner is not readonly array
<Select32 value={new Set(["a"])} />;

// @ts-expect-error N007 Select32: Set default is not readonly array
<Select32 defaultValue={new Set(["a"])} />;

// @ts-expect-error N008 Select32: array entries must be strings
<Select32 value={["a", 2]} />;

// @ts-expect-error N009 Select32: default array entries must be strings
<Select32 defaultValue={[false]} />;

// @ts-expect-error N010 Select32: null owner rejected
<Select32 value={null} />;

// @ts-expect-error N011 Select32: string open rejected
<Select32 open="true" />;

// @ts-expect-error N012 Select32: numeric defaultOpen rejected
<Select32 defaultOpen={1} />;

// @ts-expect-error N013 Select32: select ref is not trigger button ref
<Select32 ref={React.createRef<HTMLSelectElement>()} />;

// @ts-expect-error N014 Select32: div ref is not trigger button ref
<Select32 ref={React.createRef<HTMLDivElement>()} />;

// @ts-expect-error N015 Select32: children cannot replace structural trigger
<Select32 children={<span />} />;

// @ts-expect-error N016 Select32: native onChange is absent
<Select32 onChange={() => {}} />;

// @ts-expect-error N017 Select32: root onClick is absent; use triggerProps
<Select32 onClick={() => {}} />;

// @ts-expect-error N018 Select32: native multiple attribute is internal
<Select32 multiple />;

// @ts-expect-error N019 Select32: native size is absent
<Select32 size={4} />;

// @ts-expect-error N020 Select32: native type is internal
<Select32 type="submit" />;

// @ts-expect-error N021 Select32: root role is internal
<Select32 role="listbox" />;

// @ts-expect-error N022 Select32: top level tabIndex belongs in triggerProps
<Select32 tabIndex={0} />;

// @ts-expect-error N023 Select32: plain label only
<Select32 label={<span>Label</span>} />;

// @ts-expect-error N024 Select32: plain placeholder only
<Select32 placeholder={<span />} />;

// @ts-expect-error N025 Select32: plain pluralLabel only
<Select32 pluralLabel={<span />} />;

// @ts-expect-error N026 Select32: plain helper only
<Select32 helper={<span />} />;

// @ts-expect-error N027 Select32: plain error only
<Select32 error={<span />} />;

// @ts-expect-error N028 Select32: clearable must be boolean
<Select32 clearable="true" />;

// @ts-expect-error N029 Select32: selected items enhancement must be boolean
<Select32 showSelectedItems={<span />} />;

// @ts-expect-error N030 Select32: no custom clear button structure
<Select32 clearButtonProps={{ type: "submit" }} />;

// @ts-expect-error N031 Select32: no custom chip structure
<Select32 chipProps={{ role: "option" }} />;

// @ts-expect-error N032 Select32: no custom remove button structure
<Select32 removeButtonProps={{ onClick: () => {} }} />;

// @ts-expect-error N033 Select32: no uncontrolled clear owner
<Select32 defaultClearable />;

// @ts-expect-error N034 Select32: unknown motion rejected
<Select32 motion="automatic" />;

// @ts-expect-error N035 Select32: unknown direction rejected
<Select32 dir="auto" />;

// @ts-expect-error N036 Select32: options must be array
<Select32 options={new Set([{ value: "a", label: "A" }])} />;

// @ts-expect-error N037 Select32: string option rejected
<Select32 options={["a"]} />;

// @ts-expect-error N038 Select32: option value required
<Select32 options={[{ label: "A" }]} />;

// @ts-expect-error N039 Select32: option label required
<Select32 options={[{ value: "a" }]} />;

// @ts-expect-error N040 Select32: option label is plain string
<Select32 options={[{ value: "a", label: <span /> }]} />;

// @ts-expect-error N041 Select32: option value is string
<Select32 options={[{ value: 1, label: "A" }]} />;

// @ts-expect-error N042 Select32: option disabled is boolean
<Select32 options={[{ value: "a", label: "A", disabled: "yes" }]} />;

// @ts-expect-error N043 Select32: groups unavailable
<Select32 options={[{ label: "Group", options: [{ value: "a", label: "A" }] }]} />;

// @ts-expect-error N044 Select32: hybrid groups unavailable
<Select32 options={[{ value: "a", label: "A", options: [] }]} />;

// @ts-expect-error N045 Select32: separators unavailable
<Select32 options={[{ separator: true }]} />;

// @ts-expect-error N046 Select32: hybrid separators unavailable
<Select32 options={[{ value: "a", label: "A", separator: true }]} />;

// @ts-expect-error N047 Select32: images unavailable
<Select32 options={[{ value: "a", label: "A", image: "/a.png" }]} />;

// @ts-expect-error N048 Select32: rich decorations unavailable
<Select32 options={[{ value: "a", label: "A", decoration: { kind: "icon", name: "code" } }]} />;

// @ts-expect-error N049 Select32: option children unavailable
<Select32 options={[{ value: "a", label: "A", children: <span /> }]} />;

// @ts-expect-error N050 Select32: arbitrary option handlers unavailable
<Select32 options={[{ value: "a", label: "A", onClick: () => {} }]} />;

// @ts-expect-error N051 Select32: mutable handler cannot consume readonly snapshot
<Select32 onValueChange={(next: string[]) => { next.push("a"); }} />;

// @ts-expect-error N052 Select32: single-value handler incompatible
<Select32 onValueChange={(next: string) => { void next; }} />;

// @ts-expect-error N053 Select32: React change event is not proposal detail
<Select32 onValueChange={(_next: readonly string[], detail: React.ChangeEvent<HTMLSelectElement>) => { void detail; }} />;

// @ts-expect-error N054 Select32: open handler requires boolean
<Select32 onOpenChange={(next: string) => { void next; }} />;

// @ts-expect-error N055 Select32: value reasons exclude trigger
<Select32 onValueChange={(_next, detail: MultiSelectChangeDetail<"trigger">) => { void detail; }} />;

// @ts-expect-error N056 Select32: open reasons exclude clear
<Select32 onOpenChange={(_next, detail: MultiSelectChangeDetail<"clear">) => { void detail; }} />;

// @ts-expect-error N057 Select32: trigger type is structural
<Select32 triggerProps={{ type: "submit" }} />;

// @ts-expect-error N058 Select32: trigger role is structural
<Select32 triggerProps={{ role: "listbox" }} />;

// @ts-expect-error N059 Select32: trigger children are internal
<Select32 triggerProps={{ children: <span /> }} />;

// @ts-expect-error N060 Select32: trigger form belongs on component
<Select32 triggerProps={{ form: "other" }} />;

// @ts-expect-error N061 Select32: trigger name belongs on component
<Select32 triggerProps={{ name: "other" }} />;

// @ts-expect-error N062 Select32: trigger value belongs on component
<Select32 triggerProps={{ value: "other" }} />;

// @ts-expect-error N063 Select32: trigger disabled belongs on component
<Select32 triggerProps={{ disabled: true }} />;

// @ts-expect-error N064 Select32: trigger id belongs on component
<Select32 triggerProps={{ id: "other" }} />;

// @ts-expect-error N065 Select32: trigger class belongs on component
<Select32 triggerProps={{ className: "other" }} />;

// @ts-expect-error N066 Select32: trigger style belongs on component
<Select32 triggerProps={{ style: { color: "red" } }} />;

// @ts-expect-error N067 Select32: trigger popup ARIA is structural
<Select32 triggerProps={{ "aria-haspopup": "listbox" }} />;

// @ts-expect-error N068 Select32: trigger expanded ARIA is structural
<Select32 triggerProps={{ "aria-expanded": false }} />;

// @ts-expect-error N069 Select32: trigger controls ARIA is structural
<Select32 triggerProps={{ "aria-controls": "other" }} />;

// @ts-expect-error N070 Select32: trigger change event unavailable
<Select32 triggerProps={{ onChange: () => {} }} />;

// @ts-expect-error N071 Select32: trigger click must target button
<Select32 triggerProps={{ onClick: (event: React.MouseEvent<HTMLSelectElement>) => { void event; } }} />;

// @ts-expect-error N072 Select32: explicit undefined value rejected
<Select32 value={undefined} />;

// @ts-expect-error N073 Select32: explicit undefined default rejected
<Select32 defaultValue={undefined} />;

// @ts-expect-error N074 Select32: explicit undefined open rejected
<Select32 open={undefined} />;

// @ts-expect-error N075 Select32: explicit undefined defaultOpen rejected
<Select32 defaultOpen={undefined} />;

// @ts-expect-error N076 Select32: explicit undefined options rejected
<Select32 options={undefined} />;

// @ts-expect-error N077 Select32: explicit undefined boolean enhancement rejected
<Select32 clearable={undefined} />;

// @ts-expect-error N078 Select32: explicit undefined chips enhancement rejected
<Select32 showSelectedItems={undefined} />;

// @ts-expect-error N079 Select32: explicit undefined label rejected
<Select32 pluralLabel={undefined} />;

// @ts-expect-error N080 Select32: explicit undefined optional disabled rejected
<Select32 options={[{ value: "a", label: "A", disabled: undefined }]} />;

// @ts-expect-error N081 Select32: undefined hybrid group still forbidden
<Select32 options={[{ value: "a", label: "A", options: undefined }]} />;

// @ts-expect-error N082 Select32: undefined image still forbidden
<Select32 options={[{ value: "a", label: "A", image: undefined }]} />;

// @ts-expect-error N083 Select33: controlled/default array ownership conflict
<Select33 value={["a"]} defaultValue={["b"]} />;

// @ts-expect-error N084 Select33: controlled/default open ownership conflict
<Select33 open defaultOpen />;

// @ts-expect-error N085 Select33: scalar string is not array selection
<Select33 value="a" />;

// @ts-expect-error N086 Select33: scalar default is not array selection
<Select33 defaultValue="a" />;

// @ts-expect-error N087 Select33: numeric owner rejected
<Select33 value={2} />;

// @ts-expect-error N088 Select33: Set owner is not readonly array
<Select33 value={new Set(["a"])} />;

// @ts-expect-error N089 Select33: Set default is not readonly array
<Select33 defaultValue={new Set(["a"])} />;

// @ts-expect-error N090 Select33: array entries must be strings
<Select33 value={["a", 2]} />;

// @ts-expect-error N091 Select33: default array entries must be strings
<Select33 defaultValue={[false]} />;

// @ts-expect-error N092 Select33: null owner rejected
<Select33 value={null} />;

// @ts-expect-error N093 Select33: string open rejected
<Select33 open="true" />;

// @ts-expect-error N094 Select33: numeric defaultOpen rejected
<Select33 defaultOpen={1} />;

// @ts-expect-error N095 Select33: select ref is not trigger button ref
<Select33 ref={React.createRef<HTMLSelectElement>()} />;

// @ts-expect-error N096 Select33: div ref is not trigger button ref
<Select33 ref={React.createRef<HTMLDivElement>()} />;

// @ts-expect-error N097 Select33: children cannot replace structural trigger
<Select33 children={<span />} />;

// @ts-expect-error N098 Select33: native onChange is absent
<Select33 onChange={() => {}} />;

// @ts-expect-error N099 Select33: root onClick is absent; use triggerProps
<Select33 onClick={() => {}} />;

// @ts-expect-error N100 Select33: native multiple attribute is internal
<Select33 multiple />;

// @ts-expect-error N101 Select33: native size is absent
<Select33 size={4} />;

// @ts-expect-error N102 Select33: native type is internal
<Select33 type="submit" />;

// @ts-expect-error N103 Select33: root role is internal
<Select33 role="listbox" />;

// @ts-expect-error N104 Select33: top level tabIndex belongs in triggerProps
<Select33 tabIndex={0} />;

// @ts-expect-error N105 Select33: plain label only
<Select33 label={<span>Label</span>} />;

// @ts-expect-error N106 Select33: plain placeholder only
<Select33 placeholder={<span />} />;

// @ts-expect-error N107 Select33: plain pluralLabel only
<Select33 pluralLabel={<span />} />;

// @ts-expect-error N108 Select33: plain helper only
<Select33 helper={<span />} />;

// @ts-expect-error N109 Select33: plain error only
<Select33 error={<span />} />;

// @ts-expect-error N110 Select33: clearable must be boolean
<Select33 clearable="true" />;

// @ts-expect-error N111 Select33: selected items enhancement must be boolean
<Select33 showSelectedItems={<span />} />;

// @ts-expect-error N112 Select33: no custom clear button structure
<Select33 clearButtonProps={{ type: "submit" }} />;

// @ts-expect-error N113 Select33: no custom chip structure
<Select33 chipProps={{ role: "option" }} />;

// @ts-expect-error N114 Select33: no custom remove button structure
<Select33 removeButtonProps={{ onClick: () => {} }} />;

// @ts-expect-error N115 Select33: no uncontrolled clear owner
<Select33 defaultClearable />;

// @ts-expect-error N116 Select33: unknown motion rejected
<Select33 motion="automatic" />;

// @ts-expect-error N117 Select33: unknown direction rejected
<Select33 dir="auto" />;

// @ts-expect-error N118 Select33: options must be array
<Select33 options={new Set([{ value: "a", label: "A" }])} />;

// @ts-expect-error N119 Select33: string option rejected
<Select33 options={["a"]} />;

// @ts-expect-error N120 Select33: option value required
<Select33 options={[{ label: "A" }]} />;

// @ts-expect-error N121 Select33: option label required
<Select33 options={[{ value: "a" }]} />;

// @ts-expect-error N122 Select33: option label is plain string
<Select33 options={[{ value: "a", label: <span /> }]} />;

// @ts-expect-error N123 Select33: option value is string
<Select33 options={[{ value: 1, label: "A" }]} />;

// @ts-expect-error N124 Select33: option disabled is boolean
<Select33 options={[{ value: "a", label: "A", disabled: "yes" }]} />;

// @ts-expect-error N125 Select33: groups unavailable
<Select33 options={[{ label: "Group", options: [{ value: "a", label: "A" }] }]} />;

// @ts-expect-error N126 Select33: hybrid groups unavailable
<Select33 options={[{ value: "a", label: "A", options: [] }]} />;

// @ts-expect-error N127 Select33: separators unavailable
<Select33 options={[{ separator: true }]} />;

// @ts-expect-error N128 Select33: hybrid separators unavailable
<Select33 options={[{ value: "a", label: "A", separator: true }]} />;

// @ts-expect-error N129 Select33: images unavailable
<Select33 options={[{ value: "a", label: "A", image: "/a.png" }]} />;

// @ts-expect-error N130 Select33: rich decorations unavailable
<Select33 options={[{ value: "a", label: "A", decoration: { kind: "icon", name: "code" } }]} />;

// @ts-expect-error N131 Select33: option children unavailable
<Select33 options={[{ value: "a", label: "A", children: <span /> }]} />;

// @ts-expect-error N132 Select33: arbitrary option handlers unavailable
<Select33 options={[{ value: "a", label: "A", onClick: () => {} }]} />;

// @ts-expect-error N133 Select33: mutable handler cannot consume readonly snapshot
<Select33 onValueChange={(next: string[]) => { next.push("a"); }} />;

// @ts-expect-error N134 Select33: single-value handler incompatible
<Select33 onValueChange={(next: string) => { void next; }} />;

// @ts-expect-error N135 Select33: React change event is not proposal detail
<Select33 onValueChange={(_next: readonly string[], detail: React.ChangeEvent<HTMLSelectElement>) => { void detail; }} />;

// @ts-expect-error N136 Select33: open handler requires boolean
<Select33 onOpenChange={(next: string) => { void next; }} />;

// @ts-expect-error N137 Select33: value reasons exclude trigger
<Select33 onValueChange={(_next, detail: MultiSelectChangeDetail<"trigger">) => { void detail; }} />;

// @ts-expect-error N138 Select33: open reasons exclude clear
<Select33 onOpenChange={(_next, detail: MultiSelectChangeDetail<"clear">) => { void detail; }} />;

// @ts-expect-error N139 Select33: trigger type is structural
<Select33 triggerProps={{ type: "submit" }} />;

// @ts-expect-error N140 Select33: trigger role is structural
<Select33 triggerProps={{ role: "listbox" }} />;

// @ts-expect-error N141 Select33: trigger children are internal
<Select33 triggerProps={{ children: <span /> }} />;

// @ts-expect-error N142 Select33: trigger form belongs on component
<Select33 triggerProps={{ form: "other" }} />;

// @ts-expect-error N143 Select33: trigger name belongs on component
<Select33 triggerProps={{ name: "other" }} />;

// @ts-expect-error N144 Select33: trigger value belongs on component
<Select33 triggerProps={{ value: "other" }} />;

// @ts-expect-error N145 Select33: trigger disabled belongs on component
<Select33 triggerProps={{ disabled: true }} />;

// @ts-expect-error N146 Select33: trigger id belongs on component
<Select33 triggerProps={{ id: "other" }} />;

// @ts-expect-error N147 Select33: trigger class belongs on component
<Select33 triggerProps={{ className: "other" }} />;

// @ts-expect-error N148 Select33: trigger style belongs on component
<Select33 triggerProps={{ style: { color: "red" } }} />;

// @ts-expect-error N149 Select33: trigger popup ARIA is structural
<Select33 triggerProps={{ "aria-haspopup": "listbox" }} />;

// @ts-expect-error N150 Select33: trigger expanded ARIA is structural
<Select33 triggerProps={{ "aria-expanded": false }} />;

// @ts-expect-error N151 Select33: trigger controls ARIA is structural
<Select33 triggerProps={{ "aria-controls": "other" }} />;

// @ts-expect-error N152 Select33: trigger change event unavailable
<Select33 triggerProps={{ onChange: () => {} }} />;

// @ts-expect-error N153 Select33: trigger click must target button
<Select33 triggerProps={{ onClick: (event: React.MouseEvent<HTMLSelectElement>) => { void event; } }} />;

// @ts-expect-error N154 Select33: explicit undefined value rejected
<Select33 value={undefined} />;

// @ts-expect-error N155 Select33: explicit undefined default rejected
<Select33 defaultValue={undefined} />;

// @ts-expect-error N156 Select33: explicit undefined open rejected
<Select33 open={undefined} />;

// @ts-expect-error N157 Select33: explicit undefined defaultOpen rejected
<Select33 defaultOpen={undefined} />;

// @ts-expect-error N158 Select33: explicit undefined options rejected
<Select33 options={undefined} />;

// @ts-expect-error N159 Select33: explicit undefined boolean enhancement rejected
<Select33 clearable={undefined} />;

// @ts-expect-error N160 Select33: explicit undefined chips enhancement rejected
<Select33 showSelectedItems={undefined} />;

// @ts-expect-error N161 Select33: explicit undefined label rejected
<Select33 pluralLabel={undefined} />;

// @ts-expect-error N162 Select33: explicit undefined optional disabled rejected
<Select33 options={[{ value: "a", label: "A", disabled: undefined }]} />;

// @ts-expect-error N163 Select33: undefined hybrid group still forbidden
<Select33 options={[{ value: "a", label: "A", options: undefined }]} />;

// @ts-expect-error N164 Select33: undefined image still forbidden
<Select33 options={[{ value: "a", label: "A", image: undefined }]} />;

// @ts-expect-error N165 readonly snapshot has no push
((next: readonly string[]) => { next.push("a"); })(readonlyValues);

// @ts-expect-error N166 readonly snapshot cannot replace entry
((next: readonly string[]) => { next[0] = "a"; })(readonlyValues);

// @ts-expect-error N167 option descriptor cannot mutate value
items[0]!.value = "other";

// @ts-expect-error N168 readonly options cannot append
items.push({ value: "c", label: "C" });

// @ts-expect-error N169 exported IDs cannot mutate
wixMultiSelectIds[0] = "select-33";

// @ts-expect-error N170 unknown component ID rejected
const invalidId: WixMultiSelectId = "select-31";

// @ts-expect-error N171 value detail reason is readonly
((detail: MultiSelectValueChangeDetail) => { detail.reason = "clear"; })({} as MultiSelectValueChangeDetail);

// @ts-expect-error N172 detail event is readonly
((detail: MultiSelectValueChangeDetail) => { detail.originalEvent = new Event("click"); })({} as MultiSelectValueChangeDetail);

// @ts-expect-error N173 detail cancellation flag is readonly
((detail: MultiSelectOpenChangeDetail) => { detail.defaultPrevented = true; })({} as MultiSelectOpenChangeDetail);

// @ts-expect-error N174 detail cancelable is literal true
const badDetail: MultiSelectValueChangeDetail = { reason: "pointer", originalEvent: new Event("click"), cancelable: false, defaultPrevented: false, preventDefault() {} };

// @ts-expect-error N175 value reason union does not include escape
const invalidValueReason: MultiSelectValueChangeReason = "escape";

// @ts-expect-error N176 open reason union does not include remove
const invalidOpenReason: MultiSelectOpenChangeReason = "remove";

// @ts-expect-error N177 typed root structural aria-haspopup excluded
const structuralPopup: MultiSelectProps = { "aria-haspopup": "listbox" };

// @ts-expect-error N178 typed root structural aria-expanded excluded
const structuralExpanded: MultiSelectProps = { "aria-expanded": true };

// @ts-expect-error N179 typed root structural aria-controls excluded
const structuralControls: MultiSelectProps = { "aria-controls": "other" };

// @ts-expect-error N180 typed root aria-multiselectable excluded
const structuralMultiple: MultiSelectProps = { "aria-multiselectable": true };

// @ts-expect-error N181 value union itself excludes both owners
const invalidValueState: MultiSelectValueState = { value: [], defaultValue: [] };

// @ts-expect-error N182 open union itself excludes both owners
const invalidOpenState: MultiSelectOpenState = { open: false, defaultOpen: false };

// @ts-expect-error N183 select32 alias excludes both value owners
const invalid32: Select32Props = { value: [], defaultValue: [] };

// @ts-expect-error N184 select33 alias excludes scalar default
const invalid33: Select33Props = { defaultValue: "a" };

// @ts-expect-error N185 helper section keys bounded
const invalidSection: PacketSection = "notifications";

// @ts-expect-error N186 helper format keys bounded
const invalidFormat: PacketFormat = "pdf";

// @ts-expect-error N187 helper requires arrays not scalar selections
const invalidSettings: PacketSettings = { sections: "swatches", formats: ["html"] };

// @ts-expect-error N188 helper settings selection arrays readonly
settings.sections.push("tokens");

// @ts-expect-error N189 helper rejects unknown format at type boundary
buildPalettePacket(["#FFFFFF"], { sections: ["swatches"], formats: ["png"] });

// @ts-expect-error N190 helper requires actual FormData
parsePacketFormData({ sections: ["swatches"], formats: ["html"] });

// @ts-expect-error N191 helper packet file list readonly
packet.files.push({ name: "x", mime: "x", text: "x", bytes: new Uint8Array() });

// @ts-expect-error N192 example motion uses declared union
<PacketDesk motion="slow" />;

// @ts-expect-error N193 example requires readonly string colors
<PacketDesk colors={[4]} />;

// Structural width is legal TypeScript. Runtime forwarding must use the documented whitelist.
const wideNativeTrigger: React.ButtonHTMLAttributes<HTMLButtonElement> = {
  title: 'Supported title', role: 'listbox', 'aria-hidden': true,
  form: 'untrusted-form', name: 'untrusted-name', value: 'untrusted-value',
  dangerouslySetInnerHTML: { __html: '<b>ignored</b>' },
  onClick: event => { const button: HTMLButtonElement = event.currentTarget; void button; },
};
<Select32 triggerProps={wideNativeTrigger} />;
<Select33 triggerProps={wideNativeTrigger} />;

class AccessorOption implements MultiSelectOption {
  get value(): string { return 'class-option'; }
  get label(): string { return 'Class option'; }
  get disabled(): boolean { return true; }
}
<Select32 options={[new AccessorOption()]} value={['class-option']} />;
<Select33 options={[new AccessorOption()]} defaultValue={[]} />;
