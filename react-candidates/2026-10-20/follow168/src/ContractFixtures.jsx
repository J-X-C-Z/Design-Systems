import React,{useState} from 'react';
import implementedIDs from './implemented-ids.json';
import {SevenThemeProvider,Textarea01,InputMask01,Checkbox01,Switch01} from './index.jsx';
const specs={
 'textarea-01':{Component:Textarea01,baseline:'初始公开备注',a:'公开输入 A',b:'父级公开 B'},
 'input-mask-01':{Component:InputMask01,baseline:'',a:'CD56 EFG',b:'XY34 ZAB'},
 'checkbox-01':{Component:Checkbox01,baseline:false,a:true,b:false,boolean:true},
 'switch-01':{Component:Switch01,baseline:false,a:true,b:false,boolean:true}
};
export function ContractFixtures(){
 const [id,setId]=useState('textarea-01'),[generation,setGeneration]=useState(0),[held,setHeld]=useState(false),[accept,setAccept]=useState(false),[owner,setOwner]=useState(specs['textarea-01'].baseline),[requests,setRequests]=useState(0),[mode,setMode]=useState('light');
 const spec=specs[id],Field=spec.Component;
 function mount(next=id){setId(next);setGeneration(n=>n+1);setHeld(false);setAccept(false);setOwner(specs[next].baseline);setRequests(0)}
 function propose(value){setRequests(n=>n+1);if(accept)setOwner(value)}
 const props=spec.boolean?{defaultChecked:spec.baseline,checked:held?owner:undefined,onCheckedChange:propose}:{defaultValue:spec.baseline,value:held?owner:undefined,onValueChange:propose};
 return <SevenThemeProvider theme="follow" mode={mode} data-react-ready="true" data-react-candidate-count={implementedIDs.length}><main className="fr7-contract-fixture" style={{padding:24,maxWidth:900,margin:'auto'}}>
 <h1>原生输入 / React reset 复验</h1><p>公开样例，仅在当前页面内运行。请使用真实键盘、粘贴或开关点击；按钮不生成 input/change 事件。</p>
 <label>精确 ID<select value={id} onChange={e=>mount(e.target.value)}>{Object.keys(specs).map(x=><option key={x}>{x}</option>)}</select></label>{' '}
 <label>明暗<select value={mode} onChange={e=>setMode(e.target.value)}><option value="light">浅色</option><option value="dark">深色</option></select></label>
 <ol><li>点击“重新挂载”。实际{spec.boolean?'点击开关至 true':'将字段全选后输入或粘贴样例 A：'+spec.a}。</li><li>点击表单内“原生 HTML reset”，再点击“父级写入 B 并接管”。</li><li>实际{spec.boolean?'再次点击开关':'全选并输入或粘贴同一完整样例 A'}。默认拒绝提案，字段应保持 B，并增加回调次数。</li><li>普通 reset 对照：重新挂载 → 输入 A → reset → 再输入 A。未受控时应接受 A，回调应增加。</li></ol>
 <div className="fr7-inline-actions"><button type="button" onClick={()=>mount()}>重新挂载</button><button type="button" onClick={()=>{setOwner(spec.b);setHeld(true)}}>父级写入 B 并接管</button><button type="button" onClick={()=>setHeld(false)}>释放父级控制</button><label><input type="checkbox" checked={accept} onChange={e=>setAccept(e.target.checked)}/>接受提案</label></div>
 <form onSubmit={e=>e.preventDefault()} style={{padding:'24px 0'}}><Field key={id+':'+generation} {...props} label="公开样例字段" name="public-demo"/><button type="reset" style={{marginTop:20}}>原生 HTML reset</button></form>
 <p role="status" data-proposal-count={requests}>回调次数：{requests}；父级控制：{held?'是':'否'}；父级值：{String(owner)}；公开样例 B：{String(spec.b)}。</p>
 <p>此页不能证明真实输入法、所有浏览器或长期稳定性。未接入后台，也不写入存储。</p><a href="../index.html#follow/components">返回组件工作台</a>
 </main></SevenThemeProvider>
}
