import {React} from '../../../vendor/react-runtime.js';
import {useValue} from '../../hooks.js';
const OPTIONS=[['email','邮件通知'],['sms','短信通知'],['push','推送通知']];
export function RadioGroup01({value,defaultValue='email',onChange,disabled=false,label='校样联络偏好（仅记录，不发送）'}) {
  const id=React.useId(),[current,set]=useValue(value,defaultValue,onChange);
  return <fieldset className="mg09-radios" data-canonical="radio-group-01" disabled={disabled}><legend>{label}</legend>{OPTIONS.map(([v,text])=><label key={v} htmlFor={`${id}-${v}`}><input id={`${id}-${v}`} name={id} type="radio" value={v} checked={current===v} onChange={()=>set(v)}/><span>{text}</span></label>)}</fieldset>;
}
