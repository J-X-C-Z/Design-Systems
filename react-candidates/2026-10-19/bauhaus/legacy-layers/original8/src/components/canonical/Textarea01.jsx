import {React} from '../../../vendor/react-runtime.js';
import {useValue} from '../../hooks.js';
export function Textarea01({label='创作札记',value,defaultValue='',onChange,disabled=false,placeholder='写下一点什么……',maxLength=1000}) {
  const [current,set]=useValue(value,defaultValue,onChange);
  return <textarea data-canonical="textarea-01" className="mg09-textarea" aria-label={label} value={current} onChange={e=>set(e.target.value)} placeholder={placeholder} disabled={disabled} maxLength={maxLength} rows={4}/>;
}
