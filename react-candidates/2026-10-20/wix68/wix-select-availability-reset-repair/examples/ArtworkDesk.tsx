import * as React from 'react';
import {Select18,Select19,Select20,Select21,type SelectItem} from '@studio/wix-select-availability';
import '@studio/wix-select-availability/styles.css';
import {createArtwork,type ArtworkSettings} from './artwork.js';
const scales:readonly SelectItem[]=[{value:'80',label:'Compact output · 80%'},{value:'100',label:'Original output · 100%'},{value:'125',label:'Larger output · 125%'},{value:'150',label:'Large output · 150%'}];
const formats:readonly SelectItem[]=[{value:'svg',label:'SVG vector file'}];
const layouts:readonly SelectItem[]=[{value:'card',label:'Portrait card'},{value:'poster',label:'Large poster — unavailable',disabled:true},{value:'banner',label:'Landscape banner'},{value:'animation',label:'Animation — unavailable',disabled:true}];
const palettes:readonly SelectItem[]=[{value:'mocha',label:'Mocha Mousse'},{value:'fern',label:'Fern green'},{value:'ink',label:'Midnight ink'},{value:'clay',label:'Warm clay'}];
/** Four actual variants, locked format, disabled choices, native FormData and local SVG export. */
export default function ArtworkDesk(){
 const [scale,setScale]=React.useState('100'),[layout,setLayout]=React.useState('card'),[palette,setPalette]=React.useState(''),[status,setStatus]=React.useState('Choose a required palette to create your artwork.');
 const paletteRef=React.useRef<HTMLButtonElement>(null),preview=palette?createArtwork({scale,layout,palette,format:'svg'} as ArtworkSettings):null;
 function submit(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();const form=event.currentTarget,data=new FormData(form);
  if(!form.reportValidity()){paletteRef.current?.focus();setStatus('Choose a required palette to create your artwork.');return;}
  try{if(data.has('format'))throw new TypeError('Locked format must not be a successful form control.');
   const file=createArtwork({...Object.fromEntries(data),format:'svg'} as unknown as ArtworkSettings),url=URL.createObjectURL(new Blob([file.content],{type:file.mime+';charset=utf-8'})),anchor=document.createElement('a');
   anchor.href=url;anchor.download=file.filename;document.body.append(anchor);try{anchor.click();}finally{anchor.remove();URL.revokeObjectURL(url)}setStatus('Downloaded '+file.filename+'.');
  }catch{setStatus('Invalid artwork settings; no file was created.');}
 }
 return <section aria-label="Local artwork example"><form aria-label="Artwork settings" onSubmit={submit} onReset={()=>{setScale('100');setLayout('card');setPalette('');setStatus('Artwork settings reset.');}} style={{display:'grid',gap:20,maxWidth:640}}>
  <Select18 name="scale" label="Artwork scale" options={scales} value={scale} onValueChange={setScale}/>
  <Select19 name="format" label="Output format (locked)" options={formats} value="svg" helper="SVG is fixed by this local example; disabled fields are excluded from FormData."/>
  <Select20 name="layout" label="Artwork layout" options={layouts} value={layout} onValueChange={setLayout}/>
  <Select21 ref={paletteRef} name="palette" label="Artwork palette" placeholder="Choose a palette" options={palettes} value={palette} onValueChange={setPalette}/>
  <div><button type="submit">Download artwork SVG</button><button type="reset">Reset artwork</button></div>
 </form><p role="status">{status}</p>{preview?<svg aria-label="Artwork preview" role="img" width={preview.width} height={preview.height} viewBox={`0 0 ${preview.viewWidth} ${preview.viewHeight}`} style={{maxWidth:'100%',height:'auto'}}><title>Quiet study</title><rect width={preview.viewWidth} height={preview.viewHeight} rx="24" fill={preview.colors.paper}/><circle {...preview.circle} fill={preview.colors.accent}/><path d={`M ${preview.circle.cx-preview.circle.r} ${preview.circle.cy} H ${preview.circle.cx+preview.circle.r} M ${preview.circle.cx} ${preview.circle.cy-preview.circle.r} V ${preview.circle.cy+preview.circle.r}`} stroke={preview.colors.paper} strokeWidth="2"/><rect x="32" y="32" width={preview.viewWidth-64} height={preview.viewHeight-64} rx="8" fill="none" stroke={preview.colors.ink}/><text x="56" y={preview.titleY} fill={preview.colors.ink} fontFamily="Georgia, serif" fontSize="40">Quiet study</text><text x="58" y={preview.subtitleY} fill={preview.colors.ink} fontFamily="Arial, sans-serif" fontSize="12" letterSpacing="3">LOCAL ARTWORK / 2025</text></svg>:null}<pre aria-label="Exact SVG download preview">{preview?.content??'Choose a palette.'}</pre></section>;
}
