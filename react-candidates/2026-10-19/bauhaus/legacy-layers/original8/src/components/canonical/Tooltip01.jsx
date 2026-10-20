import {React} from '../../../vendor/react-runtime.js';
export function Tooltip01({label='默认提示 · 带箭头',text='点击以继续'}) {
  const id=React.useId();const [open,set]=React.useState(false);
  return <span className="mg09-tooltip-wrap" data-canonical="tooltip-01" onMouseEnter={()=>set(true)} onMouseLeave={()=>set(false)}><button type="button" aria-describedby={open?id:undefined} onFocus={()=>set(true)} onBlur={()=>set(false)} onKeyDown={e=>{if(e.key==='Escape'){e.preventDefault();set(false)}}}>{label}</button>{open&&<span role="tooltip" id={id} className="mg09-tooltip">{text}<i aria-hidden="true"/></span>}</span>;
}
