import React from 'react';
import { clamp, knobFromPoint } from '../model.js';
let nextId = 0;
export const uid = () => `mg-12-aurora-glass-${++nextId}`;

export function Icon({ name = 'arrow', size = 18 }) {
  const paths = {
    arrow: <path d="M4 9h10M10 4l5 5-5 5"/>, left: <path d="M14 9H4M8 4L3 9l5 5"/>,
    plus: <path d="M9 3v12M3 9h12"/>, check: <path d="m4 9 3 3 7-7"/>,
    star: <path d="m9 2 2 4.5 5 .6-3.7 3.4 1 5-4.3-2.4-4.3 2.4 1-5L2 7.1l5-.6Z"/>,
    download: <path d="M9 2v9M5 7l4 4 4-4M3 12v4h12v-4"/>,
    pause: <path d="M6 4v10M12 4v10"/>, play: <path d="m6 3 8 6-8 6Z"/>,
    reset: <path d="M3 7a6 6 0 1 1 0 5M3 2v5h5"/>, info: <g><circle cx="9" cy="9" r="7"/><path d="M9 8v5M9 5v.2"/></g>,
    cross: <path d="m4 4 10 10M14 4 4 14"/>, lens: <g><rect x="3" y="2" width="12" height="14" rx="4"/><path d="M6 5h6M6 13h6"/></g>
  };
  return <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.arrow}</svg>;
}
// button-01: one plain primary action. The source's 32px default is expanded to 44px for touch.
export function Button01({ children = '继续', disabled, onClick, ...rest }) {
  return <button type="button" className="ag-button ag-primary" data-component-id="button-01" disabled={disabled} onClick={onClick} {...rest}>{children}</button>;
}
export function Button02({ onPrevious, onNext, previousDisabled = false, nextDisabled = false }) {
  return <div className="ag-pair" data-component-id="button-02"><button type="button" className="ag-button ag-outline" disabled={previousDisabled} onClick={onPrevious}><Icon name="left"/>上一束</button><button type="button" className="ag-button ag-outline" disabled={nextDisabled} onClick={onNext}>下一束<Icon/></button></div>;
}
export function Button03({ onCancel, onSave, disabled = false }) {
  return <div className="ag-pair" data-component-id="button-03"><button type="button" className="ag-button ag-secondary" onClick={onCancel}>放弃</button><button type="button" className="ag-button ag-primary" disabled={disabled} onClick={onSave}>保存</button></div>;
}
export class Checkbox01 extends React.Component {
  constructor(props) { super(props); this.id = uid(); this.state = { value: props.defaultChecked === true }; }
  render() {
    const value = this.props.checked === undefined ? this.state.value : this.props.checked;
    return <label className="ag-check" htmlFor={this.id} data-component-id="checkbox-01"><input id={this.id} type="checkbox" checked={value} disabled={this.props.disabled} onChange={e => { this.setState({ value: e.target.checked }); this.props.onChange && this.props.onChange(e.target.checked); }}/><span>{this.props.label || '仅查看收藏'}</span></label>;
  }
}
export class Switch01 extends React.Component {
  constructor(props) { super(props); this.id = uid(); this.state = { value: props.defaultChecked === true }; }
  render() {
    const v = this.props.checked === undefined ? this.state.value : this.props.checked;
    const toggle = () => { if (this.props.disabled) return; this.setState({ value: !v }); this.props.onChange && this.props.onChange(!v); };
    return <div className="ag-switch-row" data-component-id="switch-01"><button type="button" id={this.id} role="switch" aria-checked={v} aria-labelledby={this.id + '-label'} disabled={this.props.disabled} className="ag-switch" onClick={toggle}><span/></button><label id={this.id + '-label'} htmlFor={this.id}>{this.props.label || '开启流动'}</label></div>;
  }
}
export class Range extends React.Component {
  constructor(props) { super(props); this.id = uid(); }
  render() { const p = this.props; return <div className="ag-range"><div><label htmlFor={this.id}>{p.label}</label><output htmlFor={this.id}>{p.format ? p.format(p.value) : p.value}{p.unit}</output></div><input id={this.id} type="range" min={p.min ?? 0} max={p.max ?? 100} step={p.step ?? 1} value={p.value} disabled={p.disabled} onChange={e => p.onChange(+e.target.value)} style={{ '--ag-range': `${(p.value - (p.min || 0)) / ((p.max || 100) - (p.min || 0)) * 100}%` }}/>{p.hint && <small>{p.hint}</small>}</div>; }
}
export class Textarea01 extends React.Component {
  constructor(props) { super(props); this.id = uid(); }
  render() { return <div className="ag-textarea" data-component-id="textarea-01"><label htmlFor={this.id}>{this.props.label || '光场笔记'}</label><textarea id={this.id} rows="3" placeholder="写下一点观察……" value={this.props.value} onChange={e => this.props.onChange(e.target.value)} maxLength={600} disabled={this.props.disabled}/></div>; }
}
export class KnobSlider extends React.Component {
  constructor(props) { super(props); this.dragging = false; this.id = uid(); }
  componentDidMount() {
    this.down = e => { if (this.props.disabled) return; e.preventDefault(); this.node.focus({preventScroll:true}); this.dragging = true; this.node.setPointerCapture(e.pointerId); this.updatePoint(e); };
    this.move = e => { if (this.dragging) this.updatePoint(e); };
    this.up = () => { this.dragging = false; };
    this.node.addEventListener('pointerdown', this.down); this.node.addEventListener('pointermove', this.move); this.node.addEventListener('pointerup', this.up); this.node.addEventListener('pointercancel', this.up); this.node.addEventListener('lostpointercapture', this.up);
  }
  componentWillUnmount() { ['pointerdown','pointermove','pointerup','pointercancel','lostpointercapture'].forEach((n,i) => this.node.removeEventListener(n,[this.down,this.move,this.up,this.up,this.up][i])); }
  updatePoint(e) { const r = this.node.getBoundingClientRect(); this.props.onChange(knobFromPoint(e.clientX,e.clientY,r.x+r.width/2,r.y+r.height/2,this.props.min ?? 0,this.props.max ?? 100)); }
  key(e) {
    if (this.props.disabled) return;
    const min = this.props.min ?? 0, max = this.props.max ?? 100, v = this.props.value;
    const actions = { ArrowUp: v+1, ArrowRight:v+1, ArrowDown:v-1, ArrowLeft:v-1, PageUp:v+10, PageDown:v-10, Home:min, End:max };
    if (e.key in actions) { e.preventDefault(); this.props.onChange(clamp(actions[e.key],min,max)); }
  }
  render() {
    const p = this.props, min = p.min ?? 0, max = p.max ?? 100;
    return <div className="ag-knob-wrap" data-component-id="knob-slider"><span id={this.id}>{p.label || '光场能量'}</span><div className="ag-knob" ref={n => this.node = n} role="slider" tabIndex={p.disabled ? -1 : 0} aria-labelledby={this.id} aria-valuemin={min} aria-valuemax={max} aria-valuenow={p.value} aria-valuetext={`${p.value} %，视觉参数`} aria-disabled={!!p.disabled} onKeyDown={e => this.key(e)}>
      <svg viewBox="0 0 100 100" aria-hidden="true">{Array.from({ length:72 },(_,i) => <line key={i} x1="50" y1="4" x2="50" y2={i%6===0 ? 10 : 8} transform={`rotate(${i*5} 50 50)`} stroke="currentColor" strokeWidth={i%6===0 ? 1 : .5} opacity={i/72 <= (p.value-min)/(max-min) ? 1 : .24}/>)}</svg>
      <div className="ag-knob-indicator" style={{ transform: `rotate(${(p.value-min)/(max-min)*360}deg)` }}><span/></div><div className="ag-knob-center" aria-hidden="true"><strong>{p.value}</strong><small>LIGHT / %</small></div></div><small>旋转调节 · 方向键微调</small></div>;
  }
}
