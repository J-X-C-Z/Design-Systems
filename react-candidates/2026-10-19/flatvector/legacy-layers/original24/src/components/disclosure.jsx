import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Button, Field, Icon, Modal, Note, useLatest, useOwned } from '../core.jsx';
const tabItems = [{ value: 'overview', title: '总览', content: <>从<strong>全局视角</strong>查看创意项目，梳理里程碑与当前进度，让团队目标清晰一致。</> }, { value: 'roadmap', title: '路线图', content: <>规划<strong>未来方向</strong>，按阶段安排功能和发布节点，让长期目标变得可执行。</> }, { value: 'backlog', title: '待办', content: <>整理<strong>待处理的任务与想法</strong>，先做最重要的事，不遗漏下一颗好点子。</> }];
export function FlatTabs({ value, defaultValue = 'overview', onChange, disabled = false }) {
    const [selected, set] = useOwned(value, defaultValue, onChange), id = useId(), buttons = useRef([]);
    function key(e, i) { if (e.repeat)
        return; let j; if (['ArrowRight', 'ArrowDown'].includes(e.key))
        j = (i + 1) % 3; if (['ArrowLeft', 'ArrowUp'].includes(e.key))
        j = (i + 2) % 3; if (e.key === 'Home')
        j = 0; if (e.key === 'End')
        j = 2; if (j !== undefined) {
        e.preventDefault();
        buttons.current[j].focus();
        set(tabItems[j].value);
    } }
    return <div className="fv-tabs"><div className="fv-tablist" role="tablist" aria-label="创意项目">{tabItems.map((t, i) => <button key={t.value} ref={el => buttons.current[i] = el} type="button" role="tab" id={id + '-' + t.value} aria-controls={id + '-panel-' + t.value} aria-selected={selected === t.value} tabIndex={selected === t.value ? 0 : -1} disabled={disabled} onKeyDown={e => key(e, i)} onClick={() => set(t.value)}>{t.title}</button>)}</div>{tabItems.map(t => <div key={t.value} id={id + '-panel-' + t.value} role="tabpanel" tabIndex={0} aria-labelledby={id + '-' + t.value} hidden={selected !== t.value}><p>{t.content}</p></div>)}</div>;
}
const questions = [['item-1', '我的数据安全吗？', '这里是本地 UI 演示，不发送表单内容。实际产品仍需自行实现加密、权限与隐私措施。'], ['item-2', '交易如何处理？', '组件只发出交互回调，不处理真实交易。支付状态、流水与更新应由你的业务服务提供。'], ['item-3', '可以集中管理吗？', '可以组合这些组件呈现活动、偏好与账户信息。当前示例不包含真实账户后台。']];
export function FlatAccordion({ value, defaultValue = ['item-1'], onChange, disabled = false }) {
    const [expanded, set] = useOwned(value, defaultValue, onChange), id = useId(), refs = useRef([]);
    return <div className="fv-accordion">{questions.map(([key, title, content], i) => { const open = expanded?.includes(key); return <section key={key} data-open={open}><h3><button type="button" ref={el => refs.current[i] = el} disabled={disabled} aria-expanded={open} aria-controls={id + key} onClick={() => set(open ? expanded.filter(x => x !== key) : [...expanded, key])} onKeyDown={e => { let n; if (e.key === 'ArrowDown')
        n = (i + 1) % 3; if (e.key === 'ArrowUp')
        n = (i + 2) % 3; if (e.key === 'Home')
        n = 0; if (e.key === 'End')
        n = 2; if (n !== undefined) {
        e.preventDefault();
        refs.current[n].focus();
    } }}><span className="fv-accordion-sign" aria-hidden="true">{open ? '−' : '+'}</span>{title}</button></h3><div id={id + key} hidden={!open}><p>{content}</p></div></section>; })}</div>;
}
export function FlatCollapsible({ open, defaultOpen = false, onChange, disabled = false }) { const [expanded, set] = useOwned(open, defaultOpen, onChange), id = useId(); return <div className="fv-notes"><div className="fv-row fv-between"><strong>团队共享了 3 份笔记</strong><Button tone="quiet" aria-label="展开或收起笔记" disabled={disabled} aria-expanded={expanded} aria-controls={id} onClick={() => set(!expanded)}><Icon name="chevron"/></Button></div><p className="fv-file">launch-plan.md</p><div id={id} hidden={!expanded}><p className="fv-file">project-brief.md</p><p className="fv-file">brand-notes.md</p></div></div>; }
export function FlatDialog({ disabled = false, onAction }) {
    const [open, set] = useState(false), [result, setResult] = useState('');
    return <div className="fv-stack"><Button tone="coral" disabled={disabled} onClick={() => set(true)}><Icon name="lock"/>确认操作</Button><output className="fv-status" aria-live="polite">{result || '危险操作先确认，焦点从“取消”开始。'}</output><Modal kind="alert" open={open} onDismiss={() => set(false)} title="确定继续吗？" description="真实产品中，删除账户可能无法撤销。这里仅演示确认流程，不会删除任何账户或数据。"><div className="fv-modal-actions"><Button data-initial-focus tone="quiet" onClick={() => set(false)}>取消</Button><Button tone="coral" onClick={() => { setResult('已确认本地演示；没有删除任何数据。'); set(false); onAction?.('confirm'); }}>继续</Button></div></Modal></div>;
}
export function FlatSheet({ disabled = false, onAction }) {
    const [open, set] = useState(false), [draft, setDraft] = useState({ theme: '', language: '', username: '' }), [saved, setSaved] = useState(false);
    return <div className="fv-stack"><Button tone="ink" disabled={disabled} onClick={() => set(true)}>偏好设置<Icon /></Button><output className="fv-status" aria-live="polite">{saved ? '偏好已在本组件内应用，未写入服务器。' : '收起后保留当前填写的内容。'}</output><Modal open={open} onDismiss={() => set(false)} kind="sheet" title="让它更像你。" description="外观、语言和通知名称，仅在当前演示中生效。"><div className="fv-stack fv-sheet-fields">{[['theme', '外观', '浅色 / 深色 / 系统'], ['language', '语言', '例如：简体中文'], ['username', '通知名称', '输入显示名称']].map(([k, label, placeholder]) => <Field key={k} label={label}><input value={draft[k]} placeholder={placeholder} onChange={e => setDraft({ ...draft, [k]: e.target.value })}/></Field>)}</div><div className="fv-modal-actions"><Button onClick={() => { setSaved(true); onAction?.('apply', { ...draft }); }}>应用更改</Button><Button tone="quiet" onClick={() => set(false)}>收起</Button></div></Modal></div>;
}
function usePopup(open, setOpen, root, trigger) {
    const set = useLatest(setOpen);
    useEffect(() => { if (!open)
        return; const outside = e => { if (!root.current?.contains(e.target))
        set.current(false); }; const key = e => { if (e.key === 'Escape') {
        e.preventDefault();
        set.current(false);
        trigger.current?.focus();
    } }; document.addEventListener('pointerdown', outside); document.addEventListener('keydown', key); return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', key); }; }, [open]);
}
export function FlatPopover({ disabled = false }) {
    const [open, set] = useState(false), root = useRef(), trigger = useRef(), id = useId();
    usePopup(open, set, root, trigger);
    return <div className="fv-popup-root" ref={root}><Button ref={trigger} tone="yellow" disabled={disabled} aria-expanded={open} aria-controls={id} onClick={() => set(!open)}><span aria-hidden="true">★</span>查看评价</Button>{open && <section id={id} className="fv-popover" aria-label="评价详情"><div className="fv-row fv-between"><strong className="fv-score">4.55</strong><span>300 条示例评价</span></div><p className="fv-status">今日 +6 · 静态数据，不代表实时活动</p><ul className="fv-ratings">{[[5, 225], [4, 30], [3, 30], [2, 15], [1, 0]].map(([stars, count]) => <li key={stars}><span>{stars} 星</span><progress aria-label={`${stars} 星评价比例`} value={count} max={300}/><span>{count}</span></li>)}</ul><Button tone="quiet" onClick={() => { set(false); root.current?.querySelector('button')?.focus(); }}>关闭</Button></section>}</div>;
}
export function FlatTooltip({ disabled = false, onAction }) {
    const [open, set] = useState(false), id = useId();
    return <span className="fv-tooltip-root" onMouseEnter={() => set(true)} onMouseLeave={() => set(false)} onFocus={() => set(true)} onBlur={() => set(false)} onKeyDown={e => { if (e.key === 'Escape') {
        e.preventDefault();
        set(false);
    } }}><Button tone="quiet" disabled={disabled} aria-describedby={open ? id : undefined} onClick={() => onAction?.('continue')}>带箭头的提示<Icon name="info"/></Button>{open && <span role="tooltip" id={id} className="fv-tooltip">点击以继续</span>}</span>;
}
const menu = [['account', '账户', 'info'], ['notifications', '通知', 'bell'], ['privacy', '隐私', 'lock'], ['preferences', '偏好', 'sun'], ['logout', '退出登录', 'external']];
export function FlatDropdown({ disabled = false, onAction }) {
    const [open, set] = useState(false), [action, setAction] = useState(''), root = useRef(), trigger = useRef(), items = useRef([]), id = useId();
    usePopup(open, set, root, trigger);
    useLayoutEffect(() => { if (open)
        items.current[0]?.focus(); }, [open]);
    function choose(k, label) { setAction(`已选择“${label}”；只触发本地回调。`); set(false); trigger.current?.focus(); onAction?.(k); }
    function key(e, i) { let j; if (e.key === 'ArrowDown')
        j = (i + 1) % 5; if (e.key === 'ArrowUp')
        j = (i + 4) % 5; if (e.key === 'Home')
        j = 0; if (e.key === 'End')
        j = 4; if (j !== undefined) {
        e.preventDefault();
        items.current[j]?.focus();
    } if (e.key === 'Tab') {
        trigger.current?.focus();
        set(false);
    } if (e.key.length === 1) {
        const found = menu.findIndex(([k, label]) => k.startsWith(e.key.toLowerCase()) || label.startsWith(e.key));
        if (found >= 0)
            items.current[found]?.focus();
    } }
    return <div ref={root} className="fv-popup-root"><button ref={trigger} className="fv-button fv-button-blue" type="button" disabled={disabled} aria-haspopup="menu" aria-controls={id} aria-expanded={open} onClick={() => set(!open)} onKeyDown={e => { if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        set(true);
    } }}>打开面板<Icon name="chevron"/></button>{open && <div id={id} role="menu" aria-label="管理偏好" className="fv-menu"><div className="fv-menu-heading" role="presentation"><strong>控制台</strong><small>管理你的偏好</small></div>{menu.map(([k, label, icon], i) => <React.Fragment key={k}>{i === 4 && <hr role="separator"/>}<button ref={el => items.current[i] = el} role="menuitem" tabIndex={-1} type="button" data-danger={i === 4} onKeyDown={e => key(e, i)} onClick={() => choose(k, label)}><Icon name={icon}/>{label}</button></React.Fragment>)}</div>}<output aria-live="polite" className="fv-status fv-block">{action || '方向键导航 · Escape 关闭'}</output></div>;
}
