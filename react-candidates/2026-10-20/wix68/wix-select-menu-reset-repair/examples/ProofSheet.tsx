import * as React from 'react';
import {Select10, Select11, Select12, Select13, type SelectItem} from '@studio/wix-select-menu';
import '@studio/wix-select-menu/styles.css';
import {createProofSheet, type ProofSettings} from './proof.js';
const palette = ['#A47864', '#F4EDE3', '#30231E', '#C9A987', '#80918A'];
const archive = ['#312A42', '#E9C7BA'];
const sources: readonly SelectItem[] = [{label:'Local collections',options:[{value:'palette',label:'Current palette'},{value:'archive',label:'Saved archive'}]}];
const templates: readonly SelectItem[] = [{label:'Proof layouts',options:[{value:'cards',label:'Swatch cards'},{value:'bands',label:'Horizontal bands'},{value:'tokens',label:'Circular tokens'}]}];
const sizes: readonly SelectItem[] = [{value:'small',label:'Small · 480 px'},{value:'medium',label:'Medium · 720 px'},{value:'large',label:'Large · 960 px'}];
const labels: readonly SelectItem[] = [{value:'hex',label:'Hex values'},{value:'ordinal',label:'Ordinal labels'},{value:'none',label:'No labels'}];
/** A real local form and SVG download. Popup implementation is independent of Radix. */
export default function ProofSheet() {
  const [source,setSource]=React.useState('palette'),[template,setTemplate]=React.useState(''),[size,setSize]=React.useState('small'),[label,setLabel]=React.useState('hex'),[status,setStatus]=React.useState('Choose a layout to make a local proof.');
  const preview = template ? createProofSheet(source==='archive'?archive:palette,{source,template,size,labels:label} as ProofSettings):null;
  function submit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form=event.currentTarget;
    if(!form.reportValidity())return;
    try {
      const data=new FormData(form),file=createProofSheet(data.get('source')==='archive'?archive:palette,{source:data.get('source'),template:data.get('template'),size:data.get('size'),labels:data.get('labels')} as ProofSettings);
      const url=URL.createObjectURL(new Blob([file.content],{type:file.mime+';charset=utf-8'})),link=document.createElement('a');
      link.href=url;link.download=file.filename;document.body.append(link);
      try{link.click();}finally{link.remove();URL.revokeObjectURL(url);}
      setStatus(`Downloaded ${file.filename}; ${file.width} × ${file.height}.`);
    } catch {setStatus('Cannot export invalid proof settings.');}
  }
  return <section aria-label="Local palette proof example"><form onSubmit={submit} onReset={()=>{setSource('palette');setTemplate('');setSize('small');setLabel('hex');setStatus('Proof settings reset.');}}>
    <Select10 label="Collection" name="source" required options={sources} value={source} onValueChange={setSource}/>
    <Select11 label="Proof layout" placeholder="Choose a proof layout" name="template" required options={templates} value={template} onValueChange={setTemplate}/>
    <Select12 label="Width" name="size" required options={sizes} value={size} onValueChange={setSize}/>
    <Select13 label="Labels" helper="This creates a local design file; no deployment or upload occurs." name="labels" required options={labels} value={label} onValueChange={setLabel}/>
    <button type="submit">Download proof SVG</button><button type="reset">Reset proof</button>
  </form><p role="status">{status}</p><pre aria-label="Exact inert SVG download preview">{preview?.content??'Choose a layout.'}</pre></section>;
}
