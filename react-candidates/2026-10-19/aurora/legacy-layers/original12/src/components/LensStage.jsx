import React from 'react';
import { OpticalRenderer } from '../render/OpticalRenderer.js';
import { clamp } from '../model.js';
import { Icon, uid } from './Controls.jsx';
export class LensStage extends React.Component {
  constructor(props){super(props);this.state={renderer:'starting'};this.id=uid();this.drag=false;}
  componentDidMount(){
    if(new URLSearchParams(location.search).get('renderer')==='css')this.setState({renderer:'fallback'});
    else {this.renderer=new OpticalRenderer(this.canvas,status=>this.setState({renderer:status}));this.renderer.update(this.props);}
    this.down=e=>{if(e.button!==0)return;e.preventDefault();this.drag=true;this.handle.focus({preventScroll:true});this.handle.setPointerCapture(e.pointerId);const box=this.stage.getBoundingClientRect();this.start={px:e.clientX,py:e.clientY,x:this.props.x,y:this.props.y,w:box.width,h:box.height};};
    this.move=e=>{if(!this.drag)return;this.props.onPosition(clamp(this.start.x+(e.clientX-this.start.px)/this.start.w*100,22,78),clamp(this.start.y+(e.clientY-this.start.py)/this.start.h*100,28,72));};
    this.up=()=>{this.drag=false;};
    this.handle.addEventListener('pointerdown',this.down);this.handle.addEventListener('pointermove',this.move);this.handle.addEventListener('pointerup',this.up);this.handle.addEventListener('pointercancel',this.up);this.handle.addEventListener('lostpointercapture',this.up);
  }
  componentDidUpdate(){if(this.renderer)this.renderer.update(this.props);}
  componentWillUnmount(){if(this.renderer)this.renderer.destroy();['pointerdown','pointermove','pointerup','pointercancel','lostpointercapture'].forEach((n,i)=>this.handle.removeEventListener(n,[this.down,this.move,this.up,this.up,this.up][i]));}
  key(e){let x=this.props.x,y=this.props.y,step=e.shiftKey?5:1;if(e.key==='ArrowLeft')x-=step;else if(e.key==='ArrowRight')x+=step;else if(e.key==='ArrowUp')y-=step;else if(e.key==='ArrowDown')y+=step;else if(e.key==='Home'){x=55;y=47;}else return;e.preventDefault();this.props.onPosition(clamp(x,22,78),clamp(y,28,72));}
  render(){const p=this.props,status=this.state.renderer,usable=status==='webgl';return <figure className="ag-stage-wrap"><div className="ag-stage" ref={n=>this.stage=n} data-renderer={status}>
    <div className="ag-stage-fallback" aria-hidden="true"><div className="ag-fallback-lens" style={{left:p.x+'%',top:p.y+'%'}}/></div>
    <canvas ref={n=>this.canvas=n} className="ag-canvas" aria-label="可调节极光与玻璃折射。等效参数控制位于下方。" role="img" style={{opacity:usable?1:0}}/>
    <div className="ag-stage-top"><span><i className={p.motion&&!p.reduced?'ag-status-dot':''}/>{usable?'实时着色':'静态光场'}</span><span>ILLUSTRATIVE / NOT MEASURED</span></div>
    <div className="ag-stage-label ag-label-left" aria-hidden="true"><span>01 — MEDIUM</span><strong>光穿过，<br/>而信息留下。</strong></div>
    <div className="ag-stage-reading"><span>REFRACTIVE INDEX</span><strong>{p.ior.toFixed(2)}<small> n</small></strong><span>渲染参数 / 非实测</span></div>
    <button type="button" className="ag-lens-hit" ref={n=>this.handle=n} style={{left:p.x+'%',top:p.y+'%'}} onKeyDown={e=>this.key(e)} aria-label="移动折射玻璃" aria-describedby={this.id}><span className="ag-handle-cross" aria-hidden="true"><Icon name="plus"/></span><span className="ag-drag-text">{usable?'拖动玻璃 · 感受折射':'拖动玻璃 · 观察层次'}</span></button>
    <div className="ag-stage-bottom"><span>POSITION <b>{Math.round(p.x)} / {Math.round(p.y)}</b></span><button className="ag-icon-button" type="button" onClick={()=>p.onMotion(!p.motion)} aria-label={p.motion?'暂停光场':'播放光场'} disabled={p.reduced}><Icon name={p.motion&&!p.reduced?'pause':'play'}/></button></div>
  </div><figcaption id={this.id}>拖动中心玻璃，或聚焦后用方向键移动。Shift 加速，Home 归位。{p.reduced?' 已遵循系统减少动效。':!p.motion?' 光场已暂停，调节仍可用。':''}{!usable?' 当前为 CSS 降级，无实时折射。':''}</figcaption></figure>;}
}
