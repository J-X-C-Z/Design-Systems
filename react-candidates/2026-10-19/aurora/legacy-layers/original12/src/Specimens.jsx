import React from 'react';
import { Button01, Button02, Button03, Switch01, Checkbox01, Textarea01, KnobSlider } from './components/Controls.jsx';
import { Tabs01, Accordion01, Dialog01, Tooltip01, SaveToggle } from './components/Disclosure.jsx';
import ledger from '../ledger/react-849.json';
export class Specimens extends React.Component {
  constructor(p){super(p);this.state={count:0,index:1,draft:'未提交的光场笔记',saved:'',toggle:false,checked:false,knob:68,query:'',limit:40,status:'全部',message:''};}
  componentDidMount(){this.observer=new IntersectionObserver(e=>{if(e[0].isIntersecting)this.setState(s=>({limit:s.limit+40}));});this.observer.observe(this.sentinel);}
  componentWillUnmount(){this.observer.disconnect();}
  render(){const s=this.state,items=ledger.items.filter(x=>(s.status==='全部'||(s.status==='已实现'&&x.react.implementation==='implemented')||(s.status==='待做'&&x.react.implementation==='not_started'))&&(`${x.id} ${x.title} ${x.category}`).toLowerCase().includes(s.query.toLowerCase()));
    return <div className="mg-12-aurora-glass"><main className="ag-specimens"><a href={document.documentElement.dataset.preview==='offline'?'standalone.html':'index.html'} className="ag-button ag-outline">← 返回光屿</a><h1>组件不是截图。<br/>试一试，再看证据。</h1><p>这 12 项各自对应真实规范 ID。下面是独立实例，不是旧 Follow 的包装；材质和文案为本风格改写。当前只记本轮作者自测，正式验收仍为 0。</p>
      <Fixture id="button-01" text="单个无图标主按钮；原生 disabled / type=button；触控高度增至 44px。"><Button01 onClick={()=>this.setState({count:s.count+1})}>记录一次观察</Button01><output className="ag-fixture-result" data-result="button01"> 观察 {s.count} 次</output><Button01 disabled>禁用状态</Button01></Fixture>
      <Fixture id="button-02" text="两枚描边按钮，前置左箭头、后置右箭头，16px 间距；两个动作独立。"><Button02 onPrevious={()=>this.setState({index:Math.max(1,s.index-1)})} onNext={()=>this.setState({index:Math.min(3,s.index+1)})} previousDisabled={s.index===1} nextDisabled={s.index===3}/><output className="ag-fixture-result" data-result="button02">当前光谱 {s.index} / 3</output></Fixture>
      <Fixture id="button-03" text="独立次级放弃与主色保存。放弃恢复先前内容，保存写入本地演示状态。"><label>待提交内容<input aria-label="待提交内容" type="text" value={s.draft} onChange={e=>this.setState({draft:e.target.value})}/></label><Button03 onCancel={()=>this.setState({draft:s.saved})} onSave={()=>this.setState({saved:s.draft})}/><output data-result="button03">已保存：{s.saved||'无'}</output></Fixture>
      <Fixture id="switch-01" text="右侧关联标签；原生按钮支持 Enter / Space，状态不只以色彩表达。"><Switch01 checked={s.toggle} onChange={toggle=>this.setState({toggle})}/><output data-result="switch01">{s.toggle?'开启':'关闭'}</output></Fixture>
      <Fixture id="checkbox-01" text="初始未选，点击标签或空格切换。"><Checkbox01 checked={s.checked} onChange={checked=>this.setState({checked})}/><output data-result="checkbox01">{s.checked?'已选':'未选'}</output></Fixture>
      <Fixture id="tabs-01" text="overview / roadmap / backlog，3 个文字页签；方向键、Home/End 自动激活；面板关系完整。"><Tabs01/></Fixture>
      <Fixture id="dialog-01" text="初始关闭；原生模态 alertdialog；取消初始焦点；Escape 返回触发器；点外部不关闭。"><Dialog01 trigger="打开实验确认" onConfirm={()=>this.setState({message:'已确认本地演示'})}/><output data-result="dialog01">{s.message}</output></Fixture>
      <Fixture id="accordion-01" text="3 项可同时打开，初始只有第 1 项；前置图标；上下方向键只移动焦点，不改变展开。"><Accordion01/></Fixture>
      <Fixture id="textarea-01" text="单个原生多行输入，无 Enter 提交拦截；命名、选择与编辑保留。"><Textarea01 label="组件笔记" value={s.draft} onChange={draft=>this.setState({draft})}/></Fixture>
      <Fixture id="tooltip-01" text="零延迟 hover/focus，带箭头；Escape 关闭；点击不伪造导航。"><Tooltip01 label="带箭头提示" content="点击继续 / Click to continue"/></Fixture>
      <Fixture id="knob-slider" text="72 刻度，整周角度吸附；受控数值；补充 Pointer Capture、触控与键盘。原滚动数字/弹簧/拖拽模糊尚未复刻，已记录为视觉差异。"><KnobSlider value={s.knob} onChange={knob=>this.setState({knob})}/></Fixture>
      <Fixture id="save-toggle" text="idle → loading → success → saved → idle。默认 1000 / 800ms，圆形过渡；卸载和修订会取消计时器。"><SaveToggle onSave={()=>this.setState({message:'保存流程已完成'})}/></Fixture>
      <section id="ag-ledger"><h2>849 项 React 台账</h2><p>使用基线的完整目录，未删除分母。这里的台账行不是组件占位实现。</p><div className="ag-ledger-tools"><input aria-label="搜索台账" type="search" placeholder="ID / 类别 / 名称" value={s.query} onChange={e=>this.setState({query:e.target.value,limit:40})}/><label>筛选<select value={s.status} onChange={e=>this.setState({status:e.target.value,limit:40})}><option>全部</option><option>已实现</option><option>待做</option></select></label><span data-result="ledger-count">{items.length} 项</span></div>{items.slice(0,s.limit).map(x=><article className="ag-ledger-item" key={x.canonical_id}><span>{x.id} · {x.title}</span><span>{x.react.implementation==='implemented'?'已实现 · 未独立验收':'待做'}</span><small>{x.react.code_path||'尚无本风格实现'}{x.react.gaps.length?' · '+x.react.gaps.join('；'):''}</small></article>)}<div ref={n=>this.sentinel=n} style={{minHeight:40}}>{Math.min(s.limit,items.length)} / {items.length}{items.length>s.limit&&<button type="button" className="ag-button ag-outline" onClick={()=>this.setState({limit:s.limit+40})}>继续显示</button>}</div></section>
    </main></div>;
  }
}
function Fixture({id,text,children}){return <section className="ag-specimen" id={'spec-'+id}><div><h2>{id}</h2><p>{text}</p></div><div>{children}</div></section>;}
