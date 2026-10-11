/* Skin changes resolve semantic appearance only. Never rewrite layout/content/timelines.
   This module is a personal design language utility, NOT an SP MCP tool. */
(function(global){
 'use strict';
 const allowed=['light','dark'];
 function apply(root,mode){
   if(!(root instanceof Element))throw new TypeError('root must be an Element');
   if(!allowed.includes(mode))throw new RangeError('mode must be light or dark');
   const before=root.getAttribute('data-mimo-mode');
   root.setAttribute('data-mimo-mode',mode);
   return ()=>{if(before===null)root.removeAttribute('data-mimo-mode');else root.setAttribute('data-mimo-mode',before);};
 }
 function resolve(property,context){
   if(property && typeof property==='object' && Object.hasOwn(property,'value'))return property.value;
   if(!property || typeof property.token!=='string')throw new TypeError('Expected {token} or {value}.');
   const key=property.token;
   for(const layer of [context.element,context.page,context.project,context.branch,context.base]){
     if(layer && Object.hasOwn(layer,key))return layer[key];
   }
   throw new Error('Unresolved semantic token '+key);
 }
 function snapshot(profile,mode){
   const key=mode==='light'?'rational-humanistic':mode==='dark'?'dark-tech':null;
   if(!key || !profile.branches[key])throw new RangeError('Invalid mode');
   return JSON.parse(JSON.stringify({format:'personal-design-language-snapshot',schemaVersion:2,languageId:profile.id,languageVersion:profile.version,branch:key,tokens:profile.branches[key].color,motion:profile.motion}));
 }
 global.MimoSkin={version:'2.0.0',apply,resolve,snapshot};
})(typeof window!=='undefined'?window:globalThis);
