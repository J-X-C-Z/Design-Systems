import React,{useState} from 'react';
import {Accordion12,Accordion14,Accordion15,Accordion16} from '@follow-ui/react-seven';
const scenes=[{id:'accordion-12',label:'People / 入职与协作',title:'把每个起点，安排清楚。',component:Accordion12},{id:'accordion-14',label:'Product / 产品与支持',title:'让下一步，不再藏起来。',component:Accordion14},{id:'accordion-15',label:'Operations / 项目与团队',title:'先看分类，再拆开问题。',component:Accordion15,nested:true},{id:'accordion-16',label:'Campaign / 内容与复盘',title:'从计划，一直走到回看。',component:Accordion16,nested:true}];
const initialOuter=()=>Object.fromEntries(scenes.map(s=>[s.id,['item-1']]));
const initialInner=()=>Object.fromEntries(scenes.filter(s=>s.nested).map(s=>[s.id,Object.fromEntries(['item-1','item-2','item-3'].map(k=>[k,['faq-1']]))]));
export default function WorkflowDesk(){
 const[scene,setScene]=useState('accordion-12'),[outer,setOuter]=useState(initialOuter),[inner,setInner]=useState(initialInner),[reject,setReject]=useState(false),[disabled,setDisabled]=useState(false),[shown,setShown]=useState(true),[receipt,setReceipt]=useState('尚未读取流程台'),[event,setEvent]=useState('等待一次展开');
 const selected=scenes.find(s=>s.id===scene),Component=selected.component;
 const faqProps=selected.nested?Object.fromEntries(['item-1','item-2','item-3'].map(category=>[category,{value:inner[scene][category],onValueChange:(next,d)=>{setEvent((reject?'拒绝':'接受')+' / '+d.id+' / '+d.categoryId+' / '+d.faqId);if(reject){d.cancel();return;}setInner(old=>({...old,[scene]:{...old[scene],[category]:next}}));}}])):null;
 return <section className="follow128-workflow">
  <div className="workflow-rail"><span className="workflow-series">FIELD GUIDE / 128</span><h2>让问题，<br/>顺着流程<br/><em>展开。</em></h2><p>从独立问题，到分类里的下一层。保留原件的完整文案与层级，不把复杂的问题压成同一种形状。</p>
   <label htmlFor="workflow-scene">选择流程场景</label><select id="workflow-scene" value={scene} aria-controls="workflow-stage" aria-describedby="workflow-boundary" onChange={e=>setScene(e.currentTarget.value)}>{scenes.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select>
   <div className="workflow-layers" aria-hidden="true"><span>01 · CATEGORY</span><span>02 · QUESTION</span><span>03 · CONTEXT</span></div>
   <div className="workflow-controls"><button type="button" aria-pressed={reject} onClick={()=>setReject(v=>!v)}>拒绝流程台变更</button><button type="button" aria-pressed={disabled} onClick={()=>setDisabled(v=>!v)}>禁用流程台控件</button><button type="button" aria-pressed={shown} onClick={()=>setShown(v=>!v)}>装载流程台控件</button></div>
   <p id="workflow-boundary">这些是原件的业务示例文字，仅展示本地界面；不处理人事评审、产品工单、客户支持或真实营销数据。无外部请求。</p>
  </div>
  <form className="workflow-paper" onSubmit={e=>{e.preventDefault();setReceipt(JSON.stringify([...new FormData(e.currentTarget)]));}}>
   <header><p className="workflow-component-id">{scene}</p><h3>{selected.title}</h3><span className="workflow-depth">{selected.nested?'2 LAYERS / 3 × 3 QUESTIONS':'1 LAYER / 3 QUESTIONS'}</span></header>
   <div id="workflow-stage">{shown?<Component key={scene} value={outer[scene]} disabled={disabled} onValueChange={(next,d)=>{setEvent((reject?'拒绝':'接受')+' / '+d.id+' / '+d.itemId);if(reject)d.cancel();else setOuter(old=>({...old,[scene]:next}));}} {...(selected.nested?{faqProps}:{})}/>:<p className="workflow-empty">控件已卸载，父层记录仍保留。</p>}</div>
   <div className="workflow-state"><p>LIVE OWNER / 父层记录</p><span role="status" className="workflow-outer">分类：{outer[scene].join(',')||'无'}</span>{selected.nested&&<dl className="workflow-faq-ledger">{Object.entries(inner[scene]).map(([category,value])=><div key={category} data-workflow-category={category}><dt>{category}</dt><dd>{value.join(',')||'无'}</dd></div>)}</dl>}<span role="status" className="workflow-event">{event}</span></div>
   <p className="workflow-note">本例由父层保留分类与子问答选择。原件的非受控子问答会随分类关闭卸载，重开恢复该组默认首问。所有触发器都是非提交按钮，原生表单复位不改变展开状态。</p>
   <div className="actions"><button type="submit">读取流程台 FormData</button><button type="reset">原生复位流程台（受控保留）</button><button type="button" onClick={()=>{setOuter(initialOuter());setInner(initialInner());setReceipt('父层已复位');setEvent('等待一次展开');}}>父层复位流程台</button></div><span role="status" className="workflow-receipt">{receipt}</span>
  </form>
 </section>;
}
