/** Pure, deterministic document model. No DOM, network, or executable imports. */
export const NS = 'mg-09-bauhaus';
export const SCHEMA = `${NS}@1`;
export const PAPER = '#f1e9da';
export const INKS = { red: '#c93625', yellow: '#edbf24', blue: '#2448c6', black: '#191918' };
export const INK_NAMES = {red:'朱红', yellow:'明黄', blue:'群青', black:'墨黑'};
export const KIND_NAMES = {circle:'圆', rect:'方', triangle:'三角', arch:'半圆', ring:'圆环', bar:'长条'};
export const TRACKS = ['circle','rect','triangle'];
export const GRID = 120;
export const WIDTH = 960;
export const HEIGHT = 720;
export const clone = value => JSON.parse(JSON.stringify(value));
export const clamp = (value,min,max) => Math.max(min,Math.min(max,value));
export const periodFor = bpm => 60000 / clamp(bpm,60,180);
export function shapeTrack(kind) { return ['circle','ring','arch'].includes(kind) ? 'circle' : ['rect','bar'].includes(kind) ? 'rect' : 'triangle'; }
export const PRESETS = [
  { id:'balance', title:'平衡，不必对称。', english:'ASYMMETRIC BALANCE', note:'把圆的重量，交给一条垂直线。', shapes:[
    {id:'s1',kind:'circle',ink:'red',x:360,y:240,size:360,rotation:0},
    {id:'s2',kind:'rect',ink:'blue',x:660,y:180,size:240,rotation:0},
    {id:'s3',kind:'triangle',ink:'yellow',x:420,y:480,size:360,rotation:0},
    {id:'s4',kind:'bar',ink:'black',x:780,y:360,size:480,rotation:0},
    {id:'s5',kind:'arch',ink:'blue',x:840,y:540,size:240,rotation:0},
    {id:'s6',kind:'ring',ink:'black',x:180,y:540,size:240,rotation:0}
  ]},
  { id:'orbit', title:'圆的另一种秩序。', english:'CIRCULAR ORDER', note:'不是绕着中心，而是共同创造中心。', shapes:[
    {id:'s1',kind:'ring',ink:'black',x:480,y:360,size:480,rotation:0},
    {id:'s2',kind:'circle',ink:'red',x:300,y:300,size:240,rotation:0},
    {id:'s3',kind:'circle',ink:'blue',x:660,y:480,size:240,rotation:0},
    {id:'s4',kind:'triangle',ink:'yellow',x:720,y:180,size:240,rotation:90},
    {id:'s5',kind:'bar',ink:'black',x:240,y:600,size:240,rotation:90}
  ]},
  { id:'counterpoint', title:'重复之中，制造不同。', english:'COLOUR COUNTERPOINT', note:'留出一格空白，让变化有地方发生。', shapes:[
    {id:'s1',kind:'arch',ink:'red',x:240,y:180,size:240,rotation:0},
    {id:'s2',kind:'rect',ink:'blue',x:480,y:180,size:240,rotation:0},
    {id:'s3',kind:'triangle',ink:'yellow',x:720,y:180,size:240,rotation:0},
    {id:'s4',kind:'triangle',ink:'black',x:240,y:480,size:240,rotation:180},
    {id:'s5',kind:'arch',ink:'blue',x:480,y:480,size:240,rotation:180},
    {id:'s6',kind:'circle',ink:'red',x:720,y:480,size:240,rotation:0}
  ]}
];
export function initialDocument() { return {schema:SCHEMA,title:PRESETS[0].title,notes:'',bpm:120,notification:'email',pattern:{circle:[true,false,true,false],rect:[false,true,false,true],triangle:[false,false,true,true]},shapes:clone(PRESETS[0].shapes)}; }
export function shapeExtents(shape) {
  if(shape.kind!=='bar')return {x:shape.size/2,y:shape.size/2};
  return shape.rotation%180===0 ? {x:shape.size/8,y:shape.size/2} : {x:shape.size/2,y:shape.size/8};
}
export function movedShape(shape,dx,dy,snap=true) {
  const quantum = snap ? GRID : 12;
  const margin = shapeExtents(shape);
  return {...shape,x:clamp(Math.round((shape.x+dx)/quantum)*quantum,margin.x,WIDTH-margin.x),y:clamp(Math.round((shape.y+dy)/quantum)*quantum,margin.y,HEIGHT-margin.y)};
}
export function rotateShape(shape) {return {...shape,rotation:(shape.rotation+90)%360};}
export function validateDocument(raw) {
  if(!raw || typeof raw!=='object' || Array.isArray(raw) || raw.schema!==SCHEMA) throw new Error('不是此工作室的构成文件（schema 不匹配）。');
  if(typeof raw.title!=='string' || raw.title.length>40 || !raw.title.trim()) throw new Error('标题需要 1–40 个字符。');
  if(typeof raw.notes!=='string' || raw.notes.length>1000) throw new Error('创作札记最多 1000 个字符。');
  if(!Number.isFinite(raw.bpm) || raw.bpm<60 || raw.bpm>180 || !Number.isInteger(raw.bpm)) throw new Error('节拍必须为 60–180 的整数。');
  if(!['email','sms','push'].includes(raw.notification)) throw new Error('偏好值不合法。');
  if(!Array.isArray(raw.shapes) || raw.shapes.length<1 || raw.shapes.length>12) throw new Error('画布须包含 1–12 个几何元素。');
  const seen = new Set();
  const shapes=raw.shapes.map(s=>{
    if(!s || typeof s.id!=='string' || !/^[a-zA-Z][\w-]{0,35}$/.test(s.id) || seen.has(s.id)) throw new Error('元素 ID 不合法或重复。');
    seen.add(s.id);
    if(!Object.hasOwn(KIND_NAMES,s.kind) || !Object.hasOwn(INKS,s.ink)) throw new Error('存在未知形状或色版。');
    if(![120,240,360,480].includes(s.size) || ![0,90,180,270].includes(s.rotation)) throw new Error('元素尺寸或角度不合法。');
    const extent=shapeExtents(s);
    if(!Number.isFinite(s.x)||!Number.isFinite(s.y)||s.x<extent.x||s.x>WIDTH-extent.x||s.y<extent.y||s.y>HEIGHT-extent.y) throw new Error('元素位置超出画布边界。');
    return {id:s.id,kind:s.kind,ink:s.ink,x:s.x,y:s.y,size:s.size,rotation:s.rotation};
  });
  const pattern={};
  for(const track of TRACKS) {
    if(!Array.isArray(raw.pattern?.[track]) || raw.pattern[track].length!==4 || raw.pattern[track].some(v=>typeof v!=='boolean')) throw new Error('每条轨道需要四个布尔节拍。');
    pattern[track]=[...raw.pattern[track]];
  }
  return {schema:SCHEMA,title:raw.title,notes:raw.notes,bpm:raw.bpm,notification:raw.notification,shapes,pattern};
}
export function parseDocument(text) {
  if(typeof text!=='string' || new TextEncoder().encode(text).length>65536) throw new Error('构成文件不能超过 64 KiB。');
  let raw; try {raw=JSON.parse(text)} catch {throw new Error('JSON 格式错误，未替换当前作品。')}
  return validateDocument(raw);
}
export function nextShapeId(shapes) {let n=1;while(shapes.some(s=>s.id===`s${n}`))n++;return `s${n}`;}
export function safeFilename(title) {return (title.trim().replace(/[<>:"/\\|?*\u0000-\u001f]/g,'-').slice(0,40)||'composition');}

/** Stable key ordering for save indicators, independent of JSON input property order. */
export function documentFingerprint(doc) {
  return JSON.stringify([doc.schema,doc.title,doc.notes,doc.bpm,doc.notification,
    TRACKS.map(k=>doc.pattern[k]),doc.shapes.map(s=>[s.id,s.kind,s.ink,s.x,s.y,s.size,s.rotation])]);
}
