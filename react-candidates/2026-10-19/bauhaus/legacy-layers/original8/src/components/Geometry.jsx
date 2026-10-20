import {React} from '../../vendor/react-runtime.js';
import {INKS,INK_NAMES,KIND_NAMES,WIDTH,HEIGHT,movedShape,rotateShape,shapeTrack,clone} from '../model.js';
export function Shape({shape}) {
  const r=shape.size/2;
  switch(shape.kind) {
    case 'circle': return <circle r={r}/>;
    case 'rect': return <rect x={-r} y={-r} width={r*2} height={r*2}/>;
    case 'bar': return <rect x={-r/4} y={-r} width={r/2} height={r*2}/>;
    case 'triangle': return <path d={`M 0 ${-r} L ${r} ${r} L ${-r} ${r} Z`}/>;
    case 'arch': return <path d={`M 0 ${-r} A ${r} ${r} 0 0 1 0 ${r} Z`}/>;
    case 'ring': return <path fillRule="evenodd" d={`M ${r} 0 A ${r} ${r} 0 1 0 ${-r} 0 A ${r} ${r} 0 1 0 ${r} 0 M ${r*.57} 0 A ${r*.57} ${r*.57} 0 1 1 ${-r*.57} 0 A ${r*.57} ${r*.57} 0 1 1 ${r*.57} 0`}/>;
    default: return null;
  }
}
export function MiniComposition({shapes,label}) {
  return <svg className="mg09-mini-composition" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={label}><rect width={WIDTH} height={HEIGHT} fill="#f1e9da"/>{shapes.map(shape=><g key={shape.id} fill={INKS[shape.ink]} transform={`translate(${shape.x} ${shape.y}) rotate(${shape.rotation})`}><Shape shape={shape}/></g>)}</svg>;
}
export function GeometryStage({history,selected,onSelect,snap,grid,playing,manualFrame,beat,pattern,reduced,announce}) {
  const svg=React.useRef(null),drag=React.useRef(null),prefix=React.useId();
  const down=(event,shape)=>{
    if(event.button!==0)return;
    event.preventDefault();event.stopPropagation();event.currentTarget.focus({preventScroll:true});onSelect(shape.id);
    drag.current={id:shape.id,pointerId:event.pointerId,x:event.clientX,y:event.clientY,before:clone(history.current.current.present)};
    svg.current.setPointerCapture(event.pointerId);
  };
  const move=event=>{
    const d=drag.current;if(!d||d.pointerId!==event.pointerId)return;
    const box=svg.current.getBoundingClientRect(),dx=(event.clientX-d.x)*WIDTH/box.width,dy=(event.clientY-d.y)*HEIGHT/box.height;
    history.transient(d.before.map(s=>s.id===d.id?movedShape(s,dx,dy,snap):s));
  };
  const end=(event,cancel=false)=>{
    const d=drag.current;if(!d||d.pointerId!==event.pointerId)return;drag.current=null;
    if(cancel){history.transient(d.before);announce('已取消这次拖动。')}else{history.commit(d.before);announce('元素位置已更新，可撤销。')}
    if(svg.current.hasPointerCapture(event.pointerId))svg.current.releasePointerCapture(event.pointerId);
  };
  const key=(event,shape)=>{
    if(event.altKey||event.ctrlKey||event.metaKey)return;
    const delta=event.shiftKey?12:snap?120:12;
    const vectors={ArrowLeft:[-delta,0],ArrowRight:[delta,0],ArrowUp:[0,-delta],ArrowDown:[0,delta]};
    if(vectors[event.key]){event.preventDefault();const[dx,dy]=vectors[event.key];history.change(shapes=>shapes.map(s=>s.id===shape.id?movedShape(s,dx,dy,!event.shiftKey&&snap):s));return}
    if(event.key.toLowerCase()==='r'){event.preventDefault();history.change(shapes=>shapes.map(s=>s.id===shape.id?movedShape(rotateShape(s),0,0,false):s));announce('已旋转 90 度。')}
    if(event.key==='Escape'&&drag.current)end({pointerId:drag.current.pointerId},true);
  };
  return <div className="mg09-stage-shell"><div className="mg09-stage-topline"><span>PLATE 09 / LIVE COMPOSITION</span><span>960 × 720 / 120 U</span></div><svg ref={svg} data-testid="composition" className="mg09-stage" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="group" aria-label="可编辑构成画布" aria-describedby={`${prefix}-help`} onPointerMove={move} onPointerUp={e=>end(e)} onPointerCancel={e=>end(e,true)} onLostPointerCapture={e=>end(e,true)}>
    <title>包豪斯构成乐谱：可选择、拖动和旋转的 SVG 元素</title><rect width={WIDTH} height={HEIGHT} fill="#f1e9da"/>
    {grid&&<g data-ui="grid" stroke="#191918" strokeOpacity=".13" strokeWidth="1" aria-hidden="true">{Array.from({length:7},(_,i)=><path key={'x'+i} d={`M ${(i+1)*120} 0 V ${HEIGHT}`}/>)}{Array.from({length:5},(_,i)=><path key={'y'+i} d={`M 0 ${(i+1)*120} H ${WIDTH}`}/>)}</g>}
    {history.present.map((shape,i)=>{
      const energized=(playing||manualFrame)&&pattern[shapeTrack(shape.kind)][beat];
      return <g key={shape.id} data-shape={shape.id} data-kind={shape.kind} data-x={shape.x} data-y={shape.y} tabIndex={0} role="button" aria-label={`元素 ${i+1}：${INK_NAMES[shape.ink]}${KIND_NAMES[shape.kind]}；位置 ${shape.x}, ${shape.y}；旋转 ${shape.rotation} 度`} aria-pressed={selected===shape.id} transform={`translate(${shape.x} ${shape.y})`} onFocus={()=>onSelect(shape.id)} onPointerDown={e=>down(e,shape)} onKeyDown={e=>key(e,shape)} className="mg09-shape-handle"><g fill={INKS[shape.ink]} className="mg09-shape-art" style={{transform:`rotate(${shape.rotation+(energized&&(!reduced||manualFrame)?90:0)}deg) scale(${energized&&(!reduced||manualFrame) ? .94 : 1})`}}><Shape shape={shape}/></g>{selected===shape.id&&<g data-ui="selection" className="mg09-selection" aria-hidden="true"><rect x={-shape.size/2-8} y={-shape.size/2-8} width={shape.size+16} height={shape.size+16}/><path d="M -16 0 H 16 M 0 -16 V 16"/></g>}</g>
    })}
    <g data-ui="registration" className="mg09-registration" fill="none" stroke="#191918" strokeWidth="2" aria-hidden="true"><path d="M 12 34 V 12 H 34 M 926 12 H 948 V 34 M 12 686 V 708 H 34 M 926 708 H 948 V 686"/></g>
  </svg><div className="mg09-stage-bottomline" id={`${prefix}-help`}><span>拖动构成 · 方向键移动 · Shift 微调 · R 旋转</span><span aria-hidden="true">▲ ■ ●</span></div></div>;
}
