import * as React from 'react';
import { Select34, wixNativeMultipleIds, type NativeMultipleOption, type Select34Props, type NativeMultipleProps, type WixNativeMultipleId } from '@studio/wix-native-multiple';
import '@studio/wix-native-multiple/styles.css';
const readonlyValues = ['a', 'b'] as const;
const readonlyOptions = [{value:'a', label:'Alpha'}, {value:'b',label:'Beta',disabled:true}] as const satisfies readonly NativeMultipleOption[];
const empty: readonly string[] = [];
const nativeRef = React.createRef<HTMLSelectElement>();
const p: Select34Props = {value:readonlyValues,options:readonlyOptions};
const common: NativeMultipleProps = {defaultValue:empty,multiple:true,name:'x',form:'owner',required:true};
const id: WixNativeMultipleId = wixNativeMultipleIds[0];
export const valid = <><Select34 /><Select34 {...p} ref={nativeRef} /><Select34 {...common} /><Select34 value={undefined} defaultValue={undefined} />
<Select34 options={[]} defaultValue={[]} label={null} helper={null} size={6} wrapperClassName="wrapper" className="control" style={{width:'100%'}} />
<Select34 onChange={event=>{const select:HTMLSelectElement=event.currentTarget;const target:HTMLSelectElement=event.target;const values:string[]=Array.from(select.selectedOptions,o=>o.value);void values;void target;event.preventDefault();}}
 onKeyDown={event=>{const select:HTMLSelectElement=event.currentTarget;void select;}} onFocus={event=>event.currentTarget.focus()}
 aria-label="Custom" aria-describedby="help" aria-invalid="grammar" disabled title="Native" autoFocus tabIndex={0} dir="rtl" />
</>;
// @ts-expect-error N01 scalar controlled string
const n01 = <Select34 value="a" />;
// @ts-expect-error N02 scalar default string
const n02 = <Select34 defaultValue="a" />;
// @ts-expect-error N03 numeric controlled element
const n03 = <Select34 value={[1]} />;
// @ts-expect-error N04 numeric default element
const n04 = <Select34 defaultValue={[1]} />;
// @ts-expect-error N05 null controlled value
const n05 = <Select34 value={null} />;
// @ts-expect-error N06 null default value
const n06 = <Select34 defaultValue={null} />;
// @ts-expect-error N07 mutually exclusive ownership
const n07 = <Select34 value={[]} defaultValue={[]} />;
// @ts-expect-error N08 false multiple cannot convert primitive
const n08 = <Select34 multiple={false} />;
// @ts-expect-error N09 children cannot replace actual options
const n09 = <Select34><option value="a">A</option></Select34>;
// @ts-expect-error N10 custom HTML cannot replace options
const n10 = <Select34 dangerouslySetInnerHTML={{__html:'x'}} />;
// @ts-expect-error N11 native select has no readOnly
const n11 = <Select34 readOnly />;
// @ts-expect-error N12 popup open unsupported
const n12 = <Select34 open />;
// @ts-expect-error N13 popup defaultOpen unsupported
const n13 = <Select34 defaultOpen />;
// @ts-expect-error N14 popup callback unsupported
const n14 = <Select34 onOpenChange={()=>{}} />;
// @ts-expect-error N15 no synthetic value callback
const n15 = <Select34 onValueChange={()=>{}} />;
// @ts-expect-error N16 placeholder unsupported
const n16 = <Select34 placeholder="Pick" />;
// @ts-expect-error N17 role cannot replace native semantics
const n17 = <Select34 role="combobox" />;
// @ts-expect-error N18 aria popup expanded unsupported
const n18 = <Select34 aria-expanded={true} />;
// @ts-expect-error N19 aria popup haspopup unsupported
const n19 = <Select34 aria-haspopup="listbox" />;
// @ts-expect-error N20 aria popup controls unsupported
const n20 = <Select34 aria-controls="popup" />;
// @ts-expect-error N21 native multiple semantics cannot be overridden
const n21 = <Select34 aria-multiselectable={false} />;
// @ts-expect-error N22 actual select ref not button ref
const n22 = <Select34 ref={React.createRef<HTMLButtonElement>()} />;
// @ts-expect-error N23 actual select ref not div ref
const n23 = <Select34 ref={React.createRef<HTMLDivElement>()} />;
// @ts-expect-error N24 invalid callback target
const n24 = <Select34 onChange={(event:React.ChangeEvent<HTMLInputElement>)=>{}} />;
// @ts-expect-error N25 onChange is event not values
const n25 = <Select34 onChange={(values:readonly string[])=>{}} />;
// @ts-expect-error N26 numeric label unsupported
const n26 = <Select34 label={4} />;
// @ts-expect-error N27 node label unsupported
const n27 = <Select34 label={<span>Label</span>} />;
// @ts-expect-error N28 boolean helper unsupported
const n28 = <Select34 helper={false} />;
// @ts-expect-error N29 string native size unsupported
const n29 = <Select34 size="sm" />;
// @ts-expect-error N30 options missing label
const n30 = <Select34 options={[{value:'a'}]} />;
// @ts-expect-error N31 numeric option value
const n31 = <Select34 options={[{value:1,label:'A'}]} />;
// @ts-expect-error N32 numeric option label
const n32 = <Select34 options={[{value:'a',label:1}]} />;
// @ts-expect-error N33 nonboolean disabled
const n33 = <Select34 options={[{value:'a',label:'A',disabled:'yes'}]} />;
// @ts-expect-error N34 groups unsupported
const n34 = <Select34 options={[{label:'Group',options:readonlyOptions}]} />;
// @ts-expect-error N35 children descriptor unsupported
const n35 = <Select34 options={[{value:'a',label:'A',children:'A'}]} />;
// @ts-expect-error N36 selected descriptor unsupported
const n36 = <Select34 options={[{value:'a',label:'A',selected:true}]} />;
// @ts-expect-error N37 mutable operation on readonly descriptor
readonlyOptions[0].label = 'Other';
// @ts-expect-error N38 cannot mutate public ID tuple
wixNativeMultipleIds.push('select-34');
// @ts-expect-error N39 missing canonical ID not accepted
const n39: WixNativeMultipleId = 'select-33';
// @ts-expect-error N40 only string option arrays accepted
const n40 = <Select34 options={['a']} />;
// @ts-expect-error N41 Set values unsupported
const n41 = <Select34 value={new Set(['a'])} />;
// @ts-expect-error N42 array-like values unsupported
const n42 = <Select34 value={{0:'a',length:1}} />;
// @ts-expect-error N43 boolean required only
const n43 = <Select34 required="required" />;
// @ts-expect-error N44 native form ID must be string
const n44 = <Select34 form={1} />;
// @ts-expect-error N45 native name must be string
const n45 = <Select34 name={1} />;
// @ts-expect-error N46 required actual select event methods
const n46 = <Select34 onChange={event=>event.currentTarget.setRangeText('text')} />;
// @ts-expect-error N47 input checked unsupported
const n47 = <Select34 checked />;
// @ts-expect-error N48 direct option value string required
const n48: NativeMultipleOption = {value:null,label:'A'};
