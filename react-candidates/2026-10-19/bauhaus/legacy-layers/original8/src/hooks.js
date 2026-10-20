import {React} from '../vendor/react-runtime.js';
import {clone,periodFor} from './model.js';
const {useEffect,useLayoutEffect,useRef,useState,useCallback}=React;
export function useValue(value,defaultValue,onChange) {
  const [local,setLocal]=useState(defaultValue);
  const prior=useRef(value!==undefined), last=useRef(value!==undefined?value:local);
  const effective=value!==undefined?value:prior.current?last.current:local;
  useLayoutEffect(()=>{if(prior.current&&value===undefined)setLocal(last.current);prior.current=value!==undefined;last.current=effective},[effective,value]);
  return [effective,next=>{if(value===undefined)setLocal(next);onChange?.(next)}];
}
export function useReducedMotion() {
  const [reduced,set]=useState(()=>globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false);
  useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const change=()=>set(media.matches);media.addEventListener('change',change);return()=>media.removeEventListener('change',change)},[]);
  return reduced;
}
export function useHistory(initial) {
  const [state,set]=useState(()=>({past:[],present:clone(initial),future:[]}));
  const current=useRef(state);current.current=state;
  const change=useCallback(fn=>set(s=>{const next=typeof fn==='function'?fn(s.present):fn;if(JSON.stringify(next)===JSON.stringify(s.present))return s;return {past:[...s.past,s.present].slice(-40),present:clone(next),future:[]}}),[]);
  const transient=useCallback(fn=>set(s=>({...s,present:typeof fn==='function'?fn(s.present):fn})),[]);
  const commit=useCallback(before=>set(s=>JSON.stringify(before)===JSON.stringify(s.present)?s:{...s,past:[...s.past,clone(before)].slice(-40),future:[]}),[]);
  const undo=useCallback(()=>set(s=>s.past.length?{past:s.past.slice(0,-1),present:s.past.at(-1),future:[s.present,...s.future]}:s),[]);
  const redo=useCallback(()=>set(s=>s.future.length?{past:[...s.past,s.present],present:s.future[0],future:s.future.slice(1)}:s),[]);
  return {...state,current,change,transient,commit,undo,redo};
}
/** Wall-clock anchored scheduling; never integrates a drifting interval. */
export function useTransport(playing,bpm,onBeat,onHidden) {
  const beatCallback=useRef(onBeat),hiddenCallback=useRef(onHidden);
  beatCallback.current=onBeat;hiddenCallback.current=onHidden;
  useEffect(()=>{
    if(!playing)return;
    const period=periodFor(bpm),start=performance.now();let timeout,stopped=false,last=-1;
    const tick=()=>{if(stopped)return;const elapsed=performance.now()-start,n=Math.floor(elapsed/period);if(n!==last){last=n;beatCallback.current(n%4)}timeout=setTimeout(tick,Math.max(4,(n+1)*period-(performance.now()-start)))};
    const hide=()=>{if(document.hidden){stopped=true;clearTimeout(timeout);hiddenCallback.current()}};
    document.addEventListener('visibilitychange',hide);tick();
    return()=>{stopped=true;clearTimeout(timeout);document.removeEventListener('visibilitychange',hide)};
  },[playing,bpm]);
}
export function useMetronome(enabled,onError) {
  const audio=useRef(null), error=useRef(onError);error.current=onError;
  const arm=useCallback(async()=>{
    try {if(!audio.current){const C=globalThis.AudioContext||globalThis.webkitAudioContext;if(!C)throw new Error('Web Audio unavailable');audio.current=new C()}if(audio.current.state==='suspended')await audio.current.resume();return true}
    catch{error.current?.('当前浏览器未能启用声音；视觉节拍仍可使用。');return false}
  },[]);
  const tick=useCallback(beat=>{
    const c=audio.current;if(!enabled||!c||c.state!=='running')return;
    const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=beat===0?1100:750;
    g.gain.setValueAtTime(.035,c.currentTime);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+.045);
    o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.05);o.onended=()=>{o.disconnect();g.disconnect()};
  },[enabled]);
  useEffect(()=>()=>{audio.current?.close().catch(()=>{});audio.current=null},[]);
  return {arm,tick};
}
