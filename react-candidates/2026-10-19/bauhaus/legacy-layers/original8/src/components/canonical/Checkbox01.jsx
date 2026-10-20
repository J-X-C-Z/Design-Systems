import {React} from '../../../vendor/react-runtime.js';
import {useValue} from '../../hooks.js';
export function Checkbox01({label='订阅产品更新',checked,defaultChecked=false,onChange,disabled=false}) {
  const id=React.useId();const [value,set]=useValue(checked,defaultChecked,onChange);
  return <label className="mg09-check" htmlFor={id} data-canonical="checkbox-01"><input id={id} type="checkbox" checked={value===true} disabled={disabled} onChange={e=>set(e.target.checked)}/><span>{label}</span></label>;
}
