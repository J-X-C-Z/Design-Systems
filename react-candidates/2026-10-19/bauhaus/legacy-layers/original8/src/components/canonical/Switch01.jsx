import {React} from '../../../vendor/react-runtime.js';
import {useValue} from '../../hooks.js';
export function Switch01({label='启用通知',checked,defaultChecked=false,onChange,disabled=false}) {
  const id=React.useId();const [value,set]=useValue(checked,defaultChecked,onChange);
  return <div className="mg09-switch-row" data-canonical="switch-01"><button type="button" id={id} role="switch" aria-checked={!!value} disabled={disabled} className="mg09-switch" onKeyDown={e=>{if(e.repeat&&(e.key==='Enter'||e.key===' '))e.preventDefault()}} onClick={()=>set(!value)}><span/></button><label htmlFor={id}>{label}</label></div>;
}
