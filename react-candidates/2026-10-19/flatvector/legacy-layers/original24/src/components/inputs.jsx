import React, { useEffect, useId, useRef, useState } from 'react';
import { Button, Field, Icon, Note, useOwned, useTimers, usePop, useReducedMotion } from '../core.jsx';
export function FlatButton({ label = '开始创作', disabled = false, loading = false, onAction, reducedMotion }) {
    const [count, setCount] = useState(0), ref = useRef(), reduce = useReducedMotion(reducedMotion), pop = usePop(ref, reduce);
    return <div className="fv-stack"><span ref={ref} className="fv-fit"><Button disabled={disabled} loading={loading} onClick={() => { setCount(n => n + 1); pop(); onAction?.('activate'); }}>{label}<Icon /></Button></span><output className="fv-status" aria-live="polite">{count ? `已触发 ${count} 次本地操作` : '一个动作，一次清晰的反馈。'}</output></div>;
}
export function FlatBadge({ label = '默认' }) { return <span className="fv-badge">{label}</span>; }
export function FlatAvatar({ name = 'Maya Chen', src }) {
    const [broken, setBroken] = useState(false);
    useEffect(() => setBroken(false), [src]);
    let safe = false;
    try {
        const u = new URL(src);
        safe = ['http:', 'https:'].includes(u.protocol) && !u.username && !u.password;
    }
    catch { }
    return <span className="fv-avatar" role="img" aria-label={name}>{safe && !broken ? <img src={src} alt="" onError={() => setBroken(true)}/> : <span aria-hidden="true">{name === 'Maya Chen' ? 'MC' : name.trim().split(/\s+/).map(x => x[0]).slice(0, 2).join('').toUpperCase()}</span>}</span>;
}
export function FlatCheckbox({ checked, defaultChecked = false, onChange, disabled = false, label = '订阅产品更新' }) {
    const [value, set] = useOwned(checked, defaultChecked, onChange), id = useId();
    return <label className="fv-check-row" htmlFor={id}><input id={id} type="checkbox" checked={!!value} disabled={disabled} onChange={e => set(e.target.checked)}/><span className="fv-check-box" aria-hidden="true"><Icon name="check" size={18}/></span><span>{label}</span></label>;
}
export function FlatSwitch({ checked, defaultChecked = false, onChange, disabled = false, label = '启用通知' }) {
    const [value, set] = useOwned(checked, defaultChecked, onChange);
    return <label className="fv-check-row"><button type="button" role="switch" aria-checked={!!value} aria-label={label} disabled={disabled} className="fv-switch" onClick={() => set(!value)}><span aria-hidden="true"/></button><span>{label}</span></label>;
}
const channels = [['email', '电子邮件通知'], ['sms', '短信通知'], ['push', '推送通知']];
export function FlatRadio({ value, defaultValue = 'email', onChange, disabled = false }) {
    const [chosen, set] = useOwned(value, defaultValue, onChange), id = useId();
    return <fieldset className="fv-radio-group"><legend>选择通知方式</legend>{channels.map(([v, label]) => <label key={v}><input type="radio" name={id} value={v} checked={chosen === v} disabled={disabled} onChange={() => set(v)}/><span className="fv-radio-dot" aria-hidden="true"/>{label}</label>)}</fieldset>;
}
export function FlatSelect({ value, defaultValue = 'owner', onChange, disabled = false, error }) {
    const [chosen, set] = useOwned(value, defaultValue, onChange);
    return <Field label="账户身份角色" error={error}><select value={chosen} disabled={disabled} onChange={e => set(e.target.value)}>{[['owner', '组织所有者'], ['admin', '系统管理员'], ['editor', '内容贡献者'], ['viewer', '平台观察员']].map(([v, label]) => <option key={v} value={v}>{label}</option>)}</select></Field>;
}
export function FlatTextarea({ value, defaultValue = '', onChange, disabled = false, readOnly = false, label = '多行文本', error }) { const [text, set] = useOwned(value, defaultValue, onChange), id = useId(); return <><textarea className="fv-textarea" aria-label={label} value={text} disabled={disabled} readOnly={readOnly} rows={4} placeholder="写点什么……" aria-invalid={!!error} aria-describedby={error ? id : undefined} onChange={e => set(e.target.value)}/>{error && <small className="fv-error" id={id}>{error}</small>}</>; }
export function FloatingInput({ value, defaultValue = '', onChange, disabled = false, label = '电子邮箱', type = 'email', error }) {
    const [text, set] = useOwned(value, defaultValue, onChange), id = useId();
    return <div className="fv-floating"><input id={id} placeholder=" " type={type} value={text} disabled={disabled} onChange={e => set(e.target.value)} aria-invalid={!!error} aria-describedby={error ? id + '-err' : undefined}/><label htmlFor={id}>{label}</label>{error && <small id={id + '-err'} className="fv-error">{error}</small>}</div>;
}
export function AdaptiveSlider({ value, defaultValue = 300, min = 100, max = 800, step = 50, onChange, disabled = false }) {
    const [raw, set] = useOwned(value, defaultValue, onChange), id = useId();
    min = Number.isFinite(min) ? min : 100;
    max = Number.isFinite(max) ? Math.max(min, max) : 800;
    step = Number.isFinite(step) && step > 0 ? step : 50;
    const val = Math.min(max, Math.max(min, Number.isFinite(raw) ? raw : min));
    const percent = max > min ? (val - min) / (max - min) * 100 : 0;
    return <div className="fv-slider" data-band={percent < 50 ? 'low' : percent < 70 ? 'middle' : 'high'}><div className="fv-slider-heading"><label htmlFor={id}>能量目标</label><output htmlFor={id}>{val}<small> kCal</small></output></div><div className="fv-range-wrap"><div className="fv-range-fill" aria-hidden="true" style={{ width: percent + '%' }}/><input id={id} aria-label="能量目标" type="range" min={min} max={max} step={step} value={val} disabled={disabled || min === max} onChange={e => set(Number(e.target.value))}/></div><div className="fv-range-dots" aria-hidden="true">{Array.from({ length: 6 }, (_, i) => <i key={i}/>)}</div><span className="fv-status">{percent < 50 ? '轻盈起步' : percent < 70 ? '稳步向前' : '能量充沛'} · {min}—{max} kCal</span></div>;
}
export function FlatOTP({ value, defaultValue = '', onChange, disabled = false, error, length = 4, digitsOnly = true, label = '输入验证码' }) {
    const [text, set] = useOwned(value, defaultValue, onChange), id = useId();
    return <div className="fv-otp"><label htmlFor={id}>{label}</label><div className="fv-otp-body"><div className="fv-otp-slots" aria-hidden="true" style={{ '--slots': length }}>{Array.from({ length }, (_, i) => <span key={i} data-filled={!!text?.[i]}>{text?.[i] || ''}</span>)}</div><input id={id} className="fv-otp-input" value={text ?? ''} disabled={disabled} inputMode={digitsOnly ? 'numeric' : 'text'} autoComplete="one-time-code" maxLength={length} aria-invalid={!!error} aria-describedby={error ? id + '-error' : undefined} onChange={e => set((digitsOnly ? e.target.value.replace(/\D/g, '') : e.target.value).slice(0, length))}/></div>{error && <small className="fv-error" id={id + '-error'} role="alert">{error}</small>}</div>;
}
export function FlatForm({ disabled = false, onAction }) {
    const [pin, setPin] = useState(''), [error, setError] = useState(''), [status, setStatus] = useState('idle');
    const { later, clear } = useTimers();
    const reset = () => { clear(); setPin(''); setError(''); setStatus('idle'); };
    return <form className="fv-stack" noValidate onSubmit={e => { e.preventDefault(); if (status === 'loading' || disabled)
        return; if (Array.from(pin).length < 6) {
        setError('请输入 6 位验证码；这只是本地格式校验。');
        return;
    } setError(''); setStatus('loading'); later(() => { setStatus('success'); onAction?.('local-validate'); }, 650); }} onReset={e => { e.preventDefault(); reset(); }}><FlatOTP length={6} digitsOnly={false} value={pin} onChange={v => { setPin(v); setError(''); if (status === 'success')
        setStatus('idle'); }} disabled={disabled || status === 'loading'} label="六位验证码" error={error}/><div className="fv-row"><Button type="submit" loading={status === 'loading'} disabled={disabled}>本地校验<Icon name="check"/></Button><Button type="reset" tone="quiet" disabled={disabled}>重置</Button></div><output aria-live="polite" className="fv-status">{status === 'success' ? '本地格式校验通过。未发送验证码，未连接身份服务。' : status === 'loading' ? '正在执行本地演示……' : '演示表单 · 支持 6 位文本，不限制为数字。'}</output></form>;
}
export function FlatButtonGroup({ disabled = false, onAction }) { const [triggered, set] = useState(false); return <div className="fv-stack"><div className="fv-upload-group"><Button disabled={disabled} onClick={() => { set(true); onAction?.('upload-request'); }}><Icon name="upload"/>上传文件</Button><span>24 个文件</span></div><output className="fv-status" aria-live="polite">{triggered ? '已触发上传请求回调；未读取或上传任何文件。' : '计数为原始示例的静态 24；此处没有上传服务。'}</output></div>; }
