import React,{useState} from 'react';
import{createRoot}from'react-dom/client';
import{Checkbox05,Switch05,Checkbox06,Switch06,CelSelectionScope}from'@studio/cel-selection';
import '@studio/cel-selection/styles.css';
import './showcase.css';
function Preview(){
 const[snacks,setSnacks]=useState({Salad:true,Wrap:true,Juice:false}),[mini,setMini]=useState(false);
 const[mode,setMode]=useState('light'),[paused,setPaused]=useState(false),[cancel,setCancel]=useState(false),[show,setShow]=useState(true),[scene,setScene]=useState(0),[report,setReport]=useState('尚未提交');
 const[sizes,setSizes]=useState({default:true,medium:true,large:true}),[fx,setFx]=useState({destructive:true,success:true,info:true,warning:true});
 const checkItems=Object.fromEntries(Object.keys(sizes).map((key,i)=>[key,{checked:sizes[key],name:'size',value:key,label:['小火','中火','大火'][i],onCheckedChange:(v,d)=>{if(cancel)d.cancel();else setSizes(x=>({...x,[key]:v}));}}]));
 const switchItems=Object.fromEntries(Object.keys(fx).map((key,i)=>[key,{checked:fx[key],name:'fx',value:key,label:['火花','烟团','速度线','星光'][i],onCheckedChange:(v,d)=>{if(cancel)d.cancel();else setFx(x=>({...x,[key]:v}));}}]));
 return <CelSelectionScope mode={mode} paused={paused}><div className="cel-showcase">
  <header><p>CEL WORKSHOP / EXPOSURE SHEET 05</p><h1>一根火柴，三张画。</h1><p>轻微错版、四套线稿、24 fps 时间表。点击控件切换真实状态，纸上的火苗一起回应。</p></header>
  <section className="cel-stage" aria-label="火柴三幕状态示意" data-scene={scene}>
   <svg viewBox="0 0 960 540" role="img" aria-label={['第一幕：划火柴','第二幕：火苗起舞','第三幕：手作定格'][scene]}>
    <path fill="none" stroke="currentColor" strokeWidth="3" d="M42 455Q472 451 920 458"/>
    <g transform={`translate(480 270) scale(${sizes.large?1:sizes.medium?.8:.6})`}>
     <path fill="#ffc425" stroke="#1c1613" strokeWidth="6" d={scene===0?'M-130 100L90 -80L106 -61L-112 118Z':'M-85 76Q-120 5 -38 -42Q-13 -73 -19 -128Q94 -65 59 3Q131 36 70 100Q-23 159 -85 76Z'}/>
     {scene!==0&&<><path fill="#e5402b" d="M-36 83Q-69 32 1 -20Q13 21 42 40Q68 100 -36 83Z"/><path fill="none" stroke="#1c1613" strokeWidth="5" d="M-32 -2L-26 5M27 -5L32 2M-19 27Q4 48 24 25"/></>}
     {fx.destructive&&<path fill="none" stroke="#e5402b" strokeWidth="6" d="M-125 -69L-145 -88M112 -95L135 -123"/>}
     {fx.success&&<path fill="none" stroke="currentColor" strokeWidth="3" d="M-170 15Q-210 -10 -178 -42Q-183 -72 -147 -70M144 55Q196 48 174 12"/>}
     {fx.info&&<path fill="none" stroke="currentColor" strokeWidth="3" d="M-240 97L-172 83M148 101L226 121"/>}
     {fx.warning&&<path fill="#ffc425" stroke="#1c1613" strokeWidth="3" d="M194 -91L202 -70L224 -61L203 -54L194 -31L186 -54L164 -61L186 -70Z"/>}
    </g>
    {scene===2&&<text x="480" y="493" textAnchor="middle" fontSize="36" fontWeight="800" fill="currentColor">HAND MADE · 手作</text>}
   </svg>
   <nav aria-label="三幕"><button type="button" onClick={()=>setScene(0)}>01 划火柴</button><button type="button" onClick={()=>setScene(1)}>02 火苗起舞</button><button type="button" onClick={()=>setScene(2)}>03 手作定格</button></nav>
  </section>
  <aside className="cel-toolbar"><button onClick={()=>setMode(x=>x==='light'?'dark':'light')}>切换明暗</button><button onClick={()=>setPaused(x=>!x)} aria-pressed={paused}>暂停装饰</button><button onClick={()=>setCancel(x=>!x)} aria-pressed={cancel}>取消下一次切换：{cancel?'开':'关'}</button><button onClick={()=>setShow(x=>!x)}>装载控件：{show?'开':'关'}</button></aside>
  <form id="controlled" onSubmit={e=>{e.preventDefault();setReport(JSON.stringify([...new FormData(e.currentTarget)]));}}>
   {show&&<><section><h2>05 / 三尺寸复选框</h2><p>16 / 20 / 24 px；三个状态独立。</p><Checkbox05 items={checkItems}/></section><section><h2>05 / 描边语义开关</h2><p>浅填充轨道，着色滑块；四个状态独立。</p><Switch05 items={switchItems}/></section></>}
   <button type="submit">读取 FormData</button><button type="reset">原生 reset（受控值保留）</button><button type="button" onClick={()=>{setSizes({default:true,medium:true,large:true});setFx({destructive:true,success:true,info:true,warning:true});}}>父组件重置</button>
  </form><output aria-live="polite">{report}</output>
  <details><summary>非受控、禁用、只读与小尺寸</summary><form id="uncontrolled"><Checkbox05 items={{default:{name:'small',defaultChecked:false,label:'默认未选'},medium:{name:'medium',disabled:true,label:'禁用'},large:{name:'large',readOnly:true,label:'只读'}}}/><Switch05 items={{info:{name:'small-switch',size:'sm',label:'小尺寸',description:'24 × 14 px，滑移 10 px'}}}/><button type="reset">重置非受控</button></form></details>
  <section id="new-snacks" className="cel6-fieldnote"><h2>06 / A hand-drawn snack break</h2><form onReset={()=>setSnacks({Salad:true,Wrap:true,Juice:false})}><Checkbox06 items={Object.fromEntries(Object.keys(snacks).map(k=>[k,{name:k,checked:snacks[k],onCheckedChange:v=>setSnacks(s=>({...s,[k]:v}))}]))}/><button type="reset">Reset snack cels</button></form><div className="cel6-platter" aria-hidden="true">{Object.keys(snacks).map((k,i)=><svg key={k} data-picked={snacks[k]} viewBox="0 0 60 60"><path d={i===0?'M6 25Q30 14 54 26L46 47Q28 56 13 45Z':i===1?'M8 18L44 8L54 41L18 53Z':'M17 12L44 14L39 50L20 48Z'} fill={i===2?'#ffc425':'#e5402b'} stroke="currentColor" strokeWidth="2"/><path d="M14 28Q32 20 47 30M20 36L39 33" fill="none" stroke="#fff6e2" strokeWidth="2"/></svg>)}</div><output className="cel6-summary">{Object.keys(snacks).filter(k=>snacks[k]).join(' + ')||'No snacks selected'}</output></section><section id="new-mini" className="cel6-fieldnote"><h2>06 / A tiny trigger, a full-size target</h2><form onReset={()=>setMini(false)}><Switch06 checked={mini} onCheckedChange={setMini} name="mini"/><Switch06 size="sm" label="Small mini switch"/><button type="reset">Reset mini cel</button></form><output className="cel6-mini-summary">{mini?'INK ON / Mini signal selected':'INK OFF / Mini signal unselected'}</output></section><footer>当前集成 checkbox-05 / switch-05 / checkbox-06 / switch-06 共4项。旧42项外部保留，46项为分层候选。代码模型验证不等同于浏览器验收；不含视频、音频或外部素材。</footer>
 </div></CelSelectionScope>;
}
createRoot(document.getElementById('root')).render(<Preview/>);
