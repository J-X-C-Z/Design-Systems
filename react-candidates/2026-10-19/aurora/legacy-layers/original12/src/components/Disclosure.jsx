import React from 'react';
import { uid, Icon } from './Controls.jsx';

export class Tabs01 extends React.Component {
  constructor(props) { super(props); this.id = uid(); this.state = { selected: 'overview' }; this.buttons = []; }
  choose(value) { this.setState({ selected:value }); this.props.onChange && this.props.onChange(value); }
  render() {
    const tabs = this.props.tabs || [
      { id:'overview', label:'光场', content:<span>用<strong>邻近色的漫射</strong>组织空间。光线在内容之后流动，不与文字争抢注意力。</span> },
      { id:'roadmap', label:'介质', content:<span><strong>折射只作用于光场</strong>，而不是 DOM 文字。玻璃边缘接收高光，交互表面保持可靠对比。</span> },
      { id:'backlog', label:'留存', content:<span>每次收藏都是<strong>参数与笔记的快照</strong>。记录只留在当前浏览器，可随时导出或删除。</span> }
    ];
    const selected = this.props.value === undefined ? this.state.selected : this.props.value;
    return <div className="ag-tabs" data-component-id="tabs-01"><div role="tablist" aria-label={this.props.label || '认识这束光'} aria-orientation="horizontal">{tabs.map((tab,i) => <button key={tab.id} type="button" role="tab" id={`${this.id}-${tab.id}`} aria-selected={selected === tab.id} aria-controls={`${this.id}-panel-${tab.id}`} tabIndex={selected === tab.id ? 0 : -1} ref={n => this.buttons[i] = n} onClick={() => this.choose(tab.id)} onKeyDown={e => {
      let next = i; if(e.key==='ArrowRight') next=(i+1)%tabs.length; else if(e.key==='ArrowLeft') next=(i-1+tabs.length)%tabs.length; else if(e.key==='Home') next=0; else if(e.key==='End') next=tabs.length-1; else return;
      e.preventDefault(); this.choose(tabs[next].id); this.buttons[next].focus();
    }}>{tab.label}</button>)}</div>{tabs.map(tab => <div key={tab.id} role="tabpanel" hidden={selected !== tab.id} id={`${this.id}-panel-${tab.id}`} aria-labelledby={`${this.id}-${tab.id}`} tabIndex="0"><p>{tab.content}</p></div>)}</div>;
  }
}
export class Accordion01 extends React.Component {
  constructor(props) { super(props); this.id = uid(); this.state = { open:[0] }; this.buttons=[]; }
  render() {
    const items = this.props.items || [
      { title:'光，如何成为界面？', content:'源参考以缓慢漂移的光斑建立气氛。这里将光场变成可以调节、暂停和收藏的对象；导航、正文与命中区域始终留在稳定的平面上。' },
      { title:'透明，但不牺牲可读性。', content:'大玻璃只承担视觉层次。输入框、按钮和状态文字使用独立实色衬底。无 WebGL、低功耗、不透明模式和减少动效都有可用替代。' },
      { title:'这一批，真实完成到哪里？', content:'这是 React 纵向切片，不是 849 项全部完成。12 个规范 ID 分别记录实现与本轮自测证据，正式独立验收仍为 0；其余 ID 没有用通用卡片冒充。' }
    ];
    return <div className="ag-accordion" data-component-id="accordion-01">{items.map((it,i) => <section key={i}><h3><button ref={n => this.buttons[i]=n} id={`${this.id}-h${i}`} type="button" aria-expanded={this.state.open.includes(i)} aria-controls={`${this.id}-p${i}`} onClick={() => this.setState(s => ({ open: s.open.includes(i) ? s.open.filter(x => x!==i) : [...s.open,i] }))} onKeyDown={e => { let j=i; if(e.key==='ArrowDown')j=(i+1)%items.length;else if(e.key==='ArrowUp')j=(i-1+items.length)%items.length;else if(e.key==='Home')j=0;else if(e.key==='End')j=items.length-1;else return;e.preventDefault();this.buttons[j].focus(); }}><span className="ag-plus"><Icon name="plus"/></span>{it.title}</button></h3><div id={`${this.id}-p${i}`} role="region" aria-labelledby={`${this.id}-h${i}`} hidden={!this.state.open.includes(i)}><p>{it.content}</p></div></section>)}</div>;
  }
}
export class Dialog01 extends React.Component {
  constructor(props) { super(props); this.id=uid(); this.state={ open:false }; }
  componentDidMount() { this.cancel=e=>{e.preventDefault();this.close(false);}; this.dialog.addEventListener('cancel',this.cancel); }
  componentWillUnmount() { this.dialog.removeEventListener('cancel',this.cancel); if(this.dialog.open)this.dialog.close(); }
  open() { this.restore=document.activeElement; this.setState({open:true},()=> { this.dialog.showModal(); this.cancelButton.focus(); }); }
  close(confirm) { this.dialog.close(); this.setState({open:false},()=>{if(confirm && this.props.onConfirm)this.props.onConfirm();if(this.restore && this.restore.isConnected)this.restore.focus();}); }
  render() { return <div data-component-id="dialog-01"><button type="button" className="ag-button ag-outline" onClick={()=>this.open()}>{this.props.trigger || '重置调光'}</button><dialog className="ag-dialog" role="alertdialog" aria-labelledby={this.id+'-title'} aria-describedby={this.id+'-desc'} ref={n=>this.dialog=n}><div className="ag-dialog-orb" aria-hidden="true"/><p className="ag-eyebrow">A FRESH START</p><h2 id={this.id+'-title'}>{this.props.title || '让光，回到起点？'}</h2><p id={this.id+'-desc'}>{this.props.description || '本次调光参数会恢复默认。你的笔记和收藏样本不会被删除，操作不会发送到服务器。'}</p><div className="ag-pair"><button type="button" ref={n=>this.cancelButton=n} className="ag-button ag-secondary" onClick={()=>this.close(false)}>取消</button><button type="button" className="ag-button ag-primary" onClick={()=>this.close(true)}>继续</button></div></dialog></div>; }
}
export class Tooltip01 extends React.Component {
  constructor(props){super(props);this.id=uid();this.state={open:false};}
  render(){return <span className="ag-tooltip-wrap" data-component-id="tooltip-01" onMouseEnter={()=>this.setState({open:true})} onMouseLeave={()=>this.setState({open:false})}><button type="button" className="ag-button ag-outline" aria-describedby={this.state.open?this.id:undefined} onFocus={()=>this.setState({open:true})} onBlur={()=>this.setState({open:false})} onKeyDown={e=>{if(e.key==='Escape'){e.preventDefault();this.setState({open:false});}}}>{this.props.label || '操作提示'}</button>{this.state.open && <span role="tooltip" id={this.id} className="ag-tooltip">{this.props.content || '拖动玻璃，或聚焦后按方向键；Home 可归位。'}</span>}</span>;}
}
export class SaveToggle extends React.Component {
  constructor(props){super(props);this.state={status:'idle',error:''};this.timers=[];this.alive=false;}
  componentDidMount(){this.alive=true;}
  componentDidUpdate(prev){if(prev.revision!==this.props.revision){this.clear();if(this.state.status!=='idle'||this.state.error)this.setState({status:'idle',error:''});}}
  componentWillUnmount(){this.alive=false;this.clear();}
  clear(){this.timers.forEach(clearTimeout);this.timers=[];}
  status(status){if(!this.alive)return;this.setState({status});this.props.onStatusChange && this.props.onStatusChange(status);}
  click(){
    if(this.props.disabled)return;
    if(this.state.status==='saved'){this.props.onUnsave && this.props.onUnsave();this.status('idle');return;}
    if(this.state.status!=='idle')return;
    this.setState({error:''});this.status('loading');
    this.timers.push(setTimeout(()=>{
      try{this.props.onSave && this.props.onSave();this.status('success');this.timers.push(setTimeout(()=>this.status('saved'),this.props.successDuration ?? 800));}
      catch(_){this.setState({status:'idle',error:'未能写入本地记录，请导出参数后再试。'});}
    },this.props.loadingDuration ?? 1000));
  }
  render(){let status=this.state.status;return <div className="ag-save-wrap" data-component-id="save-toggle"><button type="button" className="ag-save" data-status={status} aria-busy={status==='loading'} aria-pressed={status==='saved'} aria-label={{idle:'收藏光谱',loading:'正在收藏',success:'收藏成功',saved:'已收藏，再次点击取消本次收藏'}[status]} disabled={this.props.disabled || status==='loading' || status==='success'} onClick={()=>this.click()}>{status==='idle'?'收藏光谱':status==='loading'?<span className="ag-spinner"/>:<span><Icon name="check" size={22}/>{status==='saved' && <span>已收藏</span>}</span>}</button><span className="ag-sr" role="status">{{loading:'正在写入本地样本',success:'已写入',saved:'光谱已收藏'}[status]}</span>{this.state.error && <p className="ag-error" role="alert">{this.state.error}</p>}</div>;}
}
