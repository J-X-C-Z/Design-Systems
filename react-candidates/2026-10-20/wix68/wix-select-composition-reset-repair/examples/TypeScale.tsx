import * as React from 'react';
import {Select14,Select15,Select16,Select17,type SelectItem} from '@studio/wix-select-composition';
import '@studio/wix-select-composition/styles.css';
import {createTypeScale,type TypeScaleSettings} from './type-scale.js';
const families:readonly SelectItem[]=[{value:'serif',label:'Serif'},{value:'sans',label:'Sans serif'},{value:'mono',label:'Monospace'}];
const weights:readonly SelectItem[]=[{value:'regular',label:'Regular · 400'},{value:'medium',label:'Medium · 500'},{value:'bold',label:'Bold · 700'}];
const leadings:readonly SelectItem[]=[{label:'Reading rhythm',options:[{value:'compact',label:'Compact · 1.2'},{value:'comfortable',label:'Comfortable · 1.5'},{value:'generous',label:'Generous · 1.8'}]}];
const sizeOptions=(label:string,values:readonly string[]):readonly SelectItem[]=>[{label,options:values.map(value=>({value,label:value+' px'}))}];
/** Six real controls, native FormData and an actual local CSS download. */
export default function TypeScale(){
 const [family,setFamily]=React.useState('serif'),[weight,setWeight]=React.useState('medium'),[leading,setLeading]=React.useState('comfortable');
 const [small,setSmall]=React.useState(''),[standard,setStandard]=React.useState(''),[large,setLarge]=React.useState(''),[status,setStatus]=React.useState('Choose all three text sizes.');
 const smallRef=React.useRef<HTMLButtonElement>(null),standardRef=React.useRef<HTMLButtonElement>(null),largeRef=React.useRef<HTMLButtonElement>(null);
 const preview=small&&standard&&large?createTypeScale({family,weight,leading,small,standard,large} as TypeScaleSettings):null;
 function submit(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();const form=event.currentTarget,data=new FormData(form);
  if(!form.reportValidity()){const missing=[['small',smallRef],['standard',standardRef],['large',largeRef]] as const;missing.find(([name])=>!data.get(name))?.[1].current?.focus();setStatus('Choose all three text sizes.');return;}
  try{
   const file=createTypeScale(Object.fromEntries(data) as unknown as TypeScaleSettings),url=URL.createObjectURL(new Blob([file.content],{type:file.mime+';charset=utf-8'})),anchor=document.createElement('a');
   anchor.href=url;anchor.download=file.filename;document.body.append(anchor);try{anchor.click();}finally{anchor.remove();URL.revokeObjectURL(url)}setStatus('Downloaded '+file.filename+'.');
  }catch{setStatus('Invalid type settings; no file was created.');}
 }
 return <section aria-label="Local type scale example"><form aria-label="Type scale settings" onSubmit={submit} onReset={()=>{setFamily('serif');setWeight('medium');setLeading('comfortable');setSmall('');setStandard('');setLarge('');setStatus('Type scale reset.');}} style={{display:'grid',gap:20,maxWidth:640}}>
  <Select14 name="family" label="Font family" required options={families} value={family} warning="Installed fonts vary between devices. This example does not load remote fonts." aria-invalid={false} onValueChange={setFamily}/>
  <Select15 aria-label="Three independent text sizes" small={{label:'Small text size',placeholder:'Choose small text size',name:'small',required:true,options:sizeOptions('Small text',['12','14','16']),value:small,onValueChange:setSmall,triggerRef:smallRef}} standard={{label:'Standard text size',placeholder:'Choose standard text size',name:'standard',required:true,options:sizeOptions('Standard text',['18','20','24']),value:standard,onValueChange:setStandard,triggerRef:standardRef}} large={{label:'Large text size',placeholder:'Choose large text size',name:'large',required:true,options:sizeOptions('Large text',['28','32','40']),value:large,onValueChange:setLarge,triggerRef:largeRef}}/>
  <Select16 name="weight" label="Type weight" required options={weights} value={weight} onValueChange={setWeight}/>
  <Select17 name="leading" label="Line spacing" required options={leadings} value={leading} onValueChange={setLeading}/>
  <div><button type="submit">Download type CSS</button><button type="reset">Reset type scale</button></div>
 </form><p role="status">{status}</p>{preview?<div aria-label="Type scale preview">{(['small','standard','large'] as const).map(size=><p key={size} data-type-sample={size} style={{fontFamily:preview.fontFamily,fontWeight:preview.fontWeight,lineHeight:preview.lineHeight,fontSize:preview.sizes[size]}}>Mocha has a quiet rhythm. 字里行间，自有温度。</p>)}</div>:null}<pre aria-label="Exact CSS download preview">{preview?.content??'Choose three text sizes.'}</pre></section>;
}
