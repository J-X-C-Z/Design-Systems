import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
export const diagnostics = { roots: 0, timers: 0, animations: 0, mediaListeners: 0 };
export const cx = (...v) => v.filter(Boolean).join(' ');
export function useLatest(value) { const r = useRef(value); r.current = value; return r; }
// Props are request/response controlled, like React inputs; undefined means local ownership.
export function useOwned(value, initial, onChange) {
    const [local, setLocal] = useState(initial);
    const effective = value === undefined ? local : value;
    const last = useRef(effective);
    const cb = useLatest(onChange);
    useLayoutEffect(() => { last.current = effective; if (value !== undefined)
        setLocal(value); }, [effective, value]);
    const request = useCallback(next => { if (Object.is(next, last.current))
        return; if (cb.current?.(next) === false)
        return; if (value === undefined)
        setLocal(next); }, [value]);
    return [effective, request];
}
export function useReducedMotion(explicit) {
    const [os, setOS] = useState(() => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches);
    useEffect(() => { const q = matchMedia('(prefers-reduced-motion: reduce)'); const update = () => setOS(q.matches); q.addEventListener('change', update); diagnostics.mediaListeners++; update(); return () => { q.removeEventListener('change', update); diagnostics.mediaListeners--; }; }, []);
    return os || explicit === true;
}
export function useTimers() {
    const pending = useRef(new Set());
    const clear = useCallback(() => { for (const t of pending.current) {
        clearTimeout(t);
        diagnostics.timers--;
    } pending.current.clear(); }, []);
    useEffect(() => clear, [clear]);
    return { clear, later: useCallback((fn, ms) => { const t = setTimeout(() => { pending.current.delete(t); diagnostics.timers--; fn(); }, ms); pending.current.add(t); diagnostics.timers++; return t; }, []) };
}
export function usePop(ref, reduced) {
    const active = useRef(null);
    const cancel = useCallback(() => { if (active.current) {
        active.current.cancel();
        active.current = null;
        diagnostics.animations--;
    } }, []);
    useEffect(() => { if (reduced)
        cancel(); return cancel; }, [reduced, cancel]);
    return useCallback(() => { cancel(); if (reduced || !ref.current?.animate)
        return; const a = ref.current.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.07,.93)', offset: .18 }, { transform: 'scale(.95,1.06)', offset: .5 }, { transform: 'scale(1)' }], { duration: 380, easing: 'cubic-bezier(.34,1.56,.64,1)' }); active.current = a; diagnostics.animations++; a.onfinish = () => { if (active.current === a) {
        active.current = null;
        diagnostics.animations--;
    } }; }, [reduced, cancel]);
}
export function Icon({ name = 'arrow', size = 20, ...rest }) {
    const paths = { arrow: 'M4 12h15m-6-6 6 6-6 6', back: 'M20 12H5m6-6-6 6 6 6', check: 'm5 12 4 4L19 6', close: 'm6 6 12 12M18 6 6 18', plus: 'M12 5v14M5 12h14', chevron: 'm6 9 6 6 6-6', sun: 'M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2', moon: 'M20 15A8 8 0 0 1 9 4a8 8 0 1 0 11 11Z', code: 'm8 6-6 6 6 6m8-12 6 6-6 6m-5 1 2-14', copy: 'M8 8h12v12H8zM4 16V4h12', search: 'M16 16l5 5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0', play: 'm7 4 13 8-13 8Z', pause: 'M8 4v16M16 4v16', download: 'M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4', bell: 'M6 9a6 6 0 0 1 12 0v7l2 2H4l2-2V9m4 12h4', lock: 'M5 10h14v11H5zM8 10V6a4 4 0 0 1 8 0v4', info: 'M12 10v7m0-10v.5M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0', upload: 'M12 17V3m-5 5 5-5 5 5M4 16v5h16v-5', reset: 'M4 8a9 9 0 1 1-1 7M4 2v6h6', external: 'M13 3h8v8M21 3 10 14M9 4H4v16h16v-5' };
    return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...rest}><path d={paths[name] || paths.arrow}/>{name === 'sun' && <circle cx="12" cy="12" r="4"/>}</svg>;
}
export const Button = React.forwardRef(function Button({ tone = 'blue', children, loading = false, disabled = false, className, onClick, ...rest }, ref) { return <button ref={ref} type="button" className={cx('fv-button', 'fv-button-' + tone, className)} disabled={disabled || loading} aria-busy={loading || undefined} onClick={onClick} {...rest}>{loading && <span className="fv-loading" aria-hidden="true"/>}{children}</button>; });
export function Field({ label, id, error, help, children }) { const uid = useId(); id = id || `fv-field-${uid}`; return <div className="fv-field"><label htmlFor={id}>{label}</label>{React.cloneElement(children, { id, 'aria-invalid': error ? true : undefined, 'aria-describedby': error ? `${id}-error` : help ? `${id}-help` : undefined })}{help && <small id={`${id}-help`}>{help}</small>}{error && <small className="fv-error" id={`${id}-error`} role="alert">{error}</small>}</div>; }
export function Modal({ open, onDismiss, title, description, children, kind = 'dialog', initialFocus }) {
    const dialog = useRef(null), last = useRef(null), uid = useId(), dismiss = useLatest(onDismiss);
    useLayoutEffect(() => {
        const el = dialog.current;
        if (open && !el.open) {
            last.current = document.activeElement;
            el.showModal();
            const first = initialFocus?.current || el.querySelector('[data-initial-focus],button,input,select,textarea,[tabindex="0"]');
            first?.focus();
        }
        else if (!open && el.open) {
            el.close();
            if (last.current?.isConnected)
                last.current.focus();
        }
    }, [open]);
    useEffect(() => () => { if (dialog.current?.open)
        dialog.current.close(); if (last.current?.isConnected)
        last.current.focus(); }, []);
    return <dialog ref={dialog} className={cx('fv-modal', kind === 'sheet' && 'fv-sheet')} role={kind === 'alert' ? 'alertdialog' : undefined} aria-labelledby={uid + '-title'} aria-describedby={description ? uid + '-description' : undefined} onKeyDown={e => { if (e.key !== "Tab" || e.target.closest("dialog") !== dialog.current)
        return; const nodes = Array.from(dialog.current.querySelectorAll("button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href],[tabindex=\"0\"]")).filter(n => n.getClientRects().length && n.closest("dialog") === dialog.current); if (!nodes.length) {
        e.preventDefault();
        dialog.current.focus();
        return;
    } const first = nodes[0], last = nodes[nodes.length - 1]; if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    }
    else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    } }} onCancel={e => { e.preventDefault(); e.stopPropagation(); dismiss.current?.(); }} onClose={e => { e.stopPropagation(); if (open)
        dismiss.current?.(); }}>
 <div className="fv-modal-head"><span className="fv-eyebrow">{kind === 'sheet' ? 'YOUR SPACE' : 'A MOMENT, PLEASE'}</span><h2 id={uid + '-title'}>{title}</h2>{description && <p id={uid + '-description'}>{description}</p>}</div>{children}</dialog>;
}
export function Note({ children }) { return <p className="fv-note">{children}</p>; }
