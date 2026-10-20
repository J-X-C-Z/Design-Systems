import {INKS,SCHEMA,WIDTH,HEIGHT,safeFilename,validateDocument} from './model.js';
const SVGNS='http://www.w3.org/2000/svg';
/** Construct XML nodes, never interpolate user strings as markup. */
export function svgDocument(documentValue) {
  const doc=validateDocument(documentValue),xml=document.implementation.createDocument(SVGNS,'svg',null),svg=xml.documentElement;
  svg.setAttribute('viewBox',`0 0 ${WIDTH} ${HEIGHT}`);svg.setAttribute('width',WIDTH);svg.setAttribute('height',HEIGHT);
  const add=(name,attributes,parent=svg)=>{const node=xml.createElementNS(SVGNS,name);Object.entries(attributes).forEach(([k,v])=>node.setAttribute(k,String(v)));parent.append(node);return node};
  const title=add('title',{});title.textContent=doc.title;
  const desc=add('desc',{});desc.textContent=`${SCHEMA}. Static vector composition. Rhythm is retained in the JSON export, not in this SVG.`;
  add('rect',{width:WIDTH,height:HEIGHT,fill:'#f1e9da'});
  for(const s of doc.shapes){const r=s.size/2,g=add('g',{fill:INKS[s.ink],transform:`translate(${s.x} ${s.y}) rotate(${s.rotation})`});
    if(s.kind==='circle')add('circle',{r},g);
    if(s.kind==='rect')add('rect',{x:-r,y:-r,width:s.size,height:s.size},g);
    if(s.kind==='bar')add('rect',{x:-r/4,y:-r,width:r/2,height:s.size},g);
    if(s.kind==='triangle')add('path',{d:`M 0 ${-r} L ${r} ${r} L ${-r} ${r} Z`},g);
    if(s.kind==='arch')add('path',{d:`M 0 ${-r} A ${r} ${r} 0 0 1 0 ${r} Z`},g);
    if(s.kind==='ring')add('path',{'fill-rule':'evenodd',d:`M ${r} 0 A ${r} ${r} 0 1 0 ${-r} 0 A ${r} ${r} 0 1 0 ${r} 0 M ${r*.57} 0 A ${r*.57} ${r*.57} 0 1 1 ${-r*.57} 0 A ${r*.57} ${r*.57} 0 1 1 ${r*.57} 0`},g);
  }
  return '<?xml version="1.0" encoding="UTF-8"?>\n'+new XMLSerializer().serializeToString(svg);
}
export function downloadText(text,title,extension,mime) {
  const url=URL.createObjectURL(new Blob([text],{type:mime})),a=document.createElement('a');a.href=url;a.download=`${safeFilename(title)}.${extension}`;a.click();setTimeout(()=>URL.revokeObjectURL(url),0);
}
