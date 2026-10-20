import * as React from 'react';

// Independently adapted from the exact pinned variants 25–36. See source-hashes.json.
const cx = (...parts) => parts.filter(Boolean).join(' ');
const ariaTrue = value => value === true || value === 'true';
const cancelled = event => event.defaultPrevented || event.nativeEvent?.defaultPrevented;
const locked = props => Boolean(props.disabled || props.readOnly || ariaTrue(props['aria-disabled']));
const iconLabel = (children, title, fallback) => children === undefined ? (title || fallback) : children;

const NativeButton = React.forwardRef(function NativeButton({ children, variant, className,
  type = 'button', disabled = false, readOnly = false, onClick, ...native }, ref) {
  const blocked = readOnly || ariaTrue(native['aria-disabled']);
  return <button {...native} ref={ref} type={type} disabled={disabled}
    data-slot="button" data-follow-id={`button-${variant}`}
    aria-disabled={blocked ? true : native['aria-disabled']}
    className={cx('fr7 fr7-fourth-button', `fr7-fourth-button-${variant}`, className)}
    onClick={event => {
      if (blocked || event.currentTarget.disabled) { event.preventDefault(); return; }
      onClick?.(event);
    }}><span className="fr7-fb-face">{children}</span></button>;
});

function Icon({ name }) {
  // Original outlines, not copied react-icons geometry.
  const shapes = {
    spinner: <path d="M12 3a9 9 0 1 1-9 9" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2" /></>,
    moon: <path d="M20.5 14.8A9 9 0 0 1 9.2 3.5 9 9 0 1 0 20.5 14.8Z" />,
    menu: <path d="M3 5h18M3 12h18M3 19h18" />,
    close: <path d="m5 5 14 14M19 5 5 19" />,
    plus: <path d="M12 4v16M4 12h16" />,
    bookmark: <path d="M6 3h12v19l-6-5-6 5V3Z" />,
    'bookmark-filled': <path d="M6 3h12v19l-6-5-6 5V3Z" fill="currentColor" />,
    warning: <><path d="m12 3 10 18H2L12 3Z" /><path d="M12 9v5m0 3v.2" /></>,
    share: <><path d="M5 10v11h14V10M12 15V2m-4 4 4-4 4 4" /></>,
    mail: <><path d="m2 10 10-8 10 8v12H2V10Zm0 0 10 7 10-7M3 21l6-6m12 6-6-6" /><path d="M7 10V7h10v3" /></>,
    copy: <><path d="M9 7V2h13v15h-5M2 7h15v15H2V7Z" /></>,
    check: <path d="m3 12 6 6L21 5" />,
    trash: <><path d="M3 6h18M9 6V2h6v4M5 6l1 16h12l1-16M10 10v8m4-8v8" /></>
  };
  return <svg data-icon={name} className={cx('fr7-fb-icon', name === 'spinner' && 'fr7-fb-spinner')}
    aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{shapes[name]}</svg>;
}

// Only meaningful owner/value/reset changes invalidate an event. Metadata and
// controlled same-value commits must not swallow the first activation. Async
// operations share the cancellation epoch; native locked state is checked live.
function useLifecycle(forwardedRef, resetKey, onReset) {
  const node = React.useRef(null);
  const life = React.useRef({ active: false, commit: 0, epoch: 0 });
  const reset = React.useRef(onReset);
  const cancel = React.useRef(() => {});
  const previousResetKey = React.useRef(resetKey);
  React.useLayoutEffect(() => {
    life.current.active = true; life.current.commit++;
    reset.current = onReset;
  });
  // React tracks forwardedRef identity as part of useImperativeHandle. Stable
  // metadata renders must not detach/reattach a callback ref or steal focus.
  React.useImperativeHandle(forwardedRef, () => node.current, []);
  React.useLayoutEffect(() => () => {
    life.current.active = false; life.current.epoch++; cancel.current();
  }, []);
  const resetNow = () => {
    life.current.epoch++; cancel.current();
    if (life.current.active) reset.current();
  };
  React.useLayoutEffect(() => {
    if (!Object.is(previousResetKey.current, resetKey)) {
      previousResetKey.current = resetKey; resetNow();
    }
  }, [resetKey]);
  React.useLayoutEffect(() => {
    const form = node.current?.form;
    if (!form) return undefined;
    const handleReset = event => {
      const epoch = life.current.epoch;
      // A later handler may cancel native reset; never reset ahead of that decision.
      queueMicrotask(() => {
        if (life.current.active && life.current.epoch === epoch && !event.defaultPrevented && node.current?.form === form) resetNow();
      });
    };
    form.addEventListener('reset', handleReset);
    return () => form.removeEventListener('reset', handleReset);
  });
  return { node, life, cancel, resetNow,
    stamp: () => life.current.epoch,
    validEvent: stamp => life.current.active && life.current.epoch === stamp &&
      node.current && !node.current.disabled && !ariaTrue(node.current.getAttribute('aria-disabled')),
    validOperation: epoch => life.current.active && life.current.epoch === epoch };
}

export const Button25 = React.forwardRef(function Button25({ children = '点击演示', loadingLabel = '加载中',
  successLabel = '演示成功', errorLabel = '演示失败', resetKey, onClick, ...props }, ref) {
  const [status, setStatus] = React.useState('idle');
  const labelId = React.useId();
  const timer = React.useRef(null), running = React.useRef(false);
  const state = useLifecycle(ref, resetKey, () => setStatus('idle'));
  state.cancel.current = () => { if (timer.current !== null) clearTimeout(timer.current); timer.current = null; running.current = false; };
  const externalLock = locked(props);
  React.useLayoutEffect(() => { if (externalLock) state.resetNow(); }, [externalLock]);
  const click = event => {
    const stamp = state.stamp();
    onClick?.(event);
    if (cancelled(event) || !state.validEvent(stamp) || running.current) return;
    running.current = true; const epoch = ++state.life.current.epoch;
    setStatus('loading');
    timer.current = setTimeout(() => {
      if (!state.validOperation(epoch)) return;
      timer.current = null; running.current = false;
      let result;
      try { result = Math.random() > 0.5 ? 'success' : 'error'; } catch { result = 'error'; }
      if (state.validOperation(epoch)) setStatus(result);
    }, 1000);
  };
  const label = status === 'loading' ? loadingLabel : status === 'success' ? successLabel : status === 'error' ? errorLabel : children;
  // Explicit caller naming wins; otherwise use the existing live text without flattening children.
  const labelledBy = props['aria-labelledby'] ?? (props['aria-label'] == null ? labelId : undefined);
  return <NativeButton {...props} aria-labelledby={labelledBy} ref={state.node} variant="25" onClick={click}
    disabled={props.disabled || status === 'loading'} aria-busy={status === 'loading'} data-status={status}>
    {status === 'loading' && <Icon name="spinner" />}<span id={labelId} className="fr7-fb-label" role="status" aria-live="polite">{label}</span>
  </NativeButton>;
});

function ToggleButton({ variant, forwardedRef, pressed, defaultPressed = false, onPressedChange,
  resetKey, children, onClick, ...props }) {
  const controlled = pressed !== undefined;
  const baseline = React.useRef(Boolean(defaultPressed)).current;
  const [local, setLocal] = React.useState(baseline);
  const model = React.useRef({ controlled, value: controlled ? Boolean(pressed) : baseline });
  const acceptedResetKey = React.useRef(resetKey);
  const resetting = !Object.is(acceptedResetKey.current, resetKey);
  // Releasing control retains the last accepted owner value, with no one-frame jump.
  const value = controlled ? Boolean(pressed) : resetting ? baseline : model.current.controlled ? model.current.value : local;
  const state = useLifecycle(forwardedRef, resetKey, () => { if (!controlled) setLocal(baseline); });
  React.useLayoutEffect(() => {
    const previous = model.current;
    acceptedResetKey.current = resetKey;
    if (previous.controlled !== controlled || previous.value !== value) state.life.current.epoch++;
    model.current = { controlled, value };
    if (previous.controlled && !controlled) setLocal(value);
  });
  const labels = { 26: '切换明暗图标', 27: '切换菜单图标', 29: '书签' };
  const icons = { 26: value ? 'moon' : 'sun', 27: value ? 'close' : 'menu', 29: value ? 'bookmark-filled' : 'bookmark' };
  return <NativeButton {...props} ref={state.node} variant={variant} aria-pressed={value}
    onClick={event => {
      const stamp = state.stamp(); onClick?.(event);
      if (cancelled(event) || !state.validEvent(stamp)) return;
      const next = !value; onPressedChange?.(next, event);
      if (cancelled(event) || !state.validEvent(stamp) || controlled) return;
      setLocal(next);
    }}><Icon name={icons[variant]} /><span className="fr7-fb-sr-only">{iconLabel(children, props.title, labels[variant])}</span></NativeButton>;
}
export const Button26 = React.forwardRef(function Button26(props, ref) { return <ToggleButton {...props} forwardedRef={ref} variant="26" />; });
export const Button27 = React.forwardRef(function Button27(props, ref) { return <ToggleButton {...props} forwardedRef={ref} variant="27" />; });
export const Button29 = React.forwardRef(function Button29(props, ref) { return <ToggleButton {...props} forwardedRef={ref} variant="29" />; });

const tooltipStacks = new WeakMap();
export const Button28 = React.forwardRef(function Button28({ children, tooltip = '添加新项目', shellClassName,
  resetKey, onFocus, onBlur, onClick, ...props }, ref) {
  const [interaction, setInteraction] = React.useState({ hover: false, focus: false, dismissed: false });
  const state = useLifecycle(ref, resetKey, () => setInteraction({ hover: false, focus: false, dismissed: false }));
  const tooltipId = `fr7-fb-tip-${React.useId()}`;
  const shell = React.useRef(null), tooltipNode = React.useRef(null);
  const [position, setPosition] = React.useState(null);
  const externalLock = locked(props);
  const open = !externalLock && !interaction.dismissed && (interaction.hover || interaction.focus);
  React.useLayoutEffect(() => { if (externalLock) state.resetNow(); }, [externalLock]);
  const measureTooltip = () => {
    if (!open || !state.life.current.active || !shell.current || !tooltipNode.current) return;
    const doc = state.node.current.ownerDocument, view = doc.defaultView;
    const anchor = state.node.current.getBoundingClientRect(), origin = shell.current.getBoundingClientRect();
    const boundary = shell.current.parentElement?.getBoundingClientRect();
    const tip = tooltipNode.current.getBoundingClientRect();
    const viewportWidth = doc.documentElement.clientWidth || view.innerWidth || 1024;
    const viewportHeight = doc.documentElement.clientHeight || view.innerHeight || 768;
    let leftEdge = 8, rightEdge = viewportWidth - 8;
    if (boundary?.width > 32) { leftEdge = Math.max(leftEdge, boundary.left + 4); rightEdge = Math.min(rightEdge, boundary.right - 4); }
    if (rightEdge - leftEdge < 32) { leftEdge = 8; rightEdge = viewportWidth - 8; }
    const maxWidth = Math.max(1, Math.min(320, rightEdge - leftEdge));
    const width = Math.min(tip.width || maxWidth, maxWidth);
    const center = anchor.left + anchor.width / 2;
    const left = Math.max(leftEdge, Math.min(center - width / 2, rightEdge - width));
    const topEdge = 8, bottomEdge = Math.max(8, viewportHeight - 8);
    const availableAbove = Math.max(0, Math.min(anchor.top, bottomEdge) - topEdge);
    const availableBelow = Math.max(0, bottomEdge - Math.max(anchor.bottom, topEdge));
    const above = tip.height <= availableAbove || availableAbove >= availableBelow;
    const available = above ? availableAbove : availableBelow;
    // If the trigger consumes the entire viewport, overlap it rather than place
    // unreadable content outside the viewport. Normal cases use only chosen-side space.
    const maxHeight = available >= 16 ? available : Math.max(16, viewportHeight - 16);
    const height = Math.min(tip.height || maxHeight, maxHeight);
    const wantedTop = above ? anchor.top - height : anchor.bottom;
    const top = Math.max(topEdge, Math.min(wantedTop, bottomEdge - height));
    const next = { left: left - origin.left, top: top - origin.top,
      maxWidth, maxHeight, side: above ? 'top' : 'bottom',
      arrow: Math.max(4, Math.min(center - left - 5, width - 14)) };
    setPosition(previous => previous && Object.keys(next).every(key => previous[key] === next[key]) ? previous : next);
  };
  // Read layout after each React commit (including wrapping); only changed geometry
  // writes React state. Never imperatively mount or mutate tooltip DOM.
  React.useLayoutEffect(() => { if (open) measureTooltip(); });
  React.useLayoutEffect(() => {
    if (!open) return undefined;
    const doc = state.node.current.ownerDocument, view = doc.defaultView;
    const update = () => measureTooltip();
    view.addEventListener('resize', update);
    view.addEventListener('scroll', update, true);
    view.visualViewport?.addEventListener('resize', update);
    view.visualViewport?.addEventListener('scroll', update);
    const observer = typeof view.ResizeObserver === 'function' ? new view.ResizeObserver(update) : null;
    for (const target of [state.node.current, tooltipNode.current, shell.current.parentElement]) if (target) observer?.observe(target);
    return () => {
      view.removeEventListener('resize', update); view.removeEventListener('scroll', update, true);
      view.visualViewport?.removeEventListener('resize', update); view.visualViewport?.removeEventListener('scroll', update);
      observer?.disconnect();
    };
  }, [open]);
  React.useEffect(() => {
    if (!open) return undefined;
    const doc = state.node.current.ownerDocument;
    let stack = tooltipStacks.get(doc); if (!stack) { stack = []; tooltipStacks.set(doc, stack); }
    const item = {}; stack.push(item);
    const escape = event => {
      if (event.key !== 'Escape' || event.defaultPrevented || stack.at(-1) !== item || !state.life.current.active) return;
      event.preventDefault(); setInteraction(old => ({ ...old, dismissed: true }));
    };
    doc.addEventListener('keydown', escape);
    return () => { const index = stack.indexOf(item); if (index >= 0) stack.splice(index, 1); doc.removeEventListener('keydown', escape); };
  }, [open]);
  return <span ref={shell} className={cx('fr7 fr7-fourth-tooltip', shellClassName)} data-follow-composition="button-28"
    onPointerEnter={event => {
      if (event.pointerType !== 'touch' && !externalLock) setInteraction(old => ({ ...old, hover: true, dismissed: false }));
    }}
    onPointerLeave={() => setInteraction(old => ({ ...old, hover: false }))}>
    <NativeButton {...props} ref={state.node} variant="28"
      aria-describedby={cx(props['aria-describedby'], open && tooltipId) || undefined}
      onFocus={event => {
        const stamp = state.stamp(); onFocus?.(event);
        if (!cancelled(event) && state.validEvent(stamp) && !externalLock) setInteraction(old => ({ ...old, focus: true, dismissed: false }));
      }}
      onBlur={event => {
        const stamp = state.stamp(); onBlur?.(event);
        if (state.validEvent(stamp)) setInteraction(old => ({ ...old, focus: false }));
      }}
      onClick={event => {
        const stamp = state.stamp(); onClick?.(event);
        if (!cancelled(event) && state.validEvent(stamp)) setInteraction(old => ({ ...old, dismissed: true }));
      }}><Icon name="plus" /><span className="fr7-fb-sr-only">{iconLabel(children, props.title, '添加新项目')}</span></NativeButton>
    {open && <span ref={tooltipNode} id={tooltipId} role="tooltip" className="fr7-fb-tooltip-content" data-slot="tooltip-content"
      data-side={position?.side || 'top'} style={position ? { left: position.left, top: position.top, maxWidth: position.maxWidth, '--fb-tip-max-height': `${position.maxHeight}px`, '--fb-tip-arrow-left': `${position.arrow}px` } : undefined}>
      <span className="fr7-fb-tooltip-text">{tooltip}</span><span aria-hidden="true" className="fr7-fb-tooltip-arrow" />
    </span>}
  </span>;
});

export const Button30 = React.forwardRef(function Button30({ children, ...props }, ref) {
  return <NativeButton {...props} ref={ref} variant="30"><Icon name="warning" /><span className="fr7-fb-sr-only">{iconLabel(children, props.title, '错误')}</span></NativeButton>;
});
export const Button31 = React.forwardRef(function Button31({ children = '开始使用', ...props }, ref) {
  return <NativeButton {...props} ref={ref} variant="31"><span className="fr7-fb-label">{children}</span></NativeButton>;
});
export const Button32 = React.forwardRef(function Button32({ children = '发布', ...props }, ref) {
  return <NativeButton {...props} ref={ref} variant="32"><span className="fr7-fb-share-block" data-slot="share-block"><Icon name="share" /></span><span className="fr7-fb-label">{children}</span></NativeButton>;
});
export const Button33 = React.forwardRef(function Button33({ children = '收件箱', count = '99+', ...props }, ref) {
  return <NativeButton {...props} ref={ref} variant="33"><Icon name="mail" /><span className="fr7-fb-label">{children}</span><span className="fr7-fb-badge" data-slot="badge">{count}</span></NativeButton>;
});

export const Button34 = React.forwardRef(function Button34({ children = '复制', text = 'Thank you for using Watermelon UI!',
  copyingLabel = '复制中', copiedLabel = '已复制', errorLabel = '复制失败', onCopy, onCopyError,
  resetKey, onClick, ...props }, ref) {
  const [status, setStatus] = React.useState('idle');
  const labelId = React.useId();
  const timer = React.useRef(null), running = React.useRef(false);
  const state = useLifecycle(ref, resetKey, () => setStatus('idle'));
  const latest = React.useRef({ onCopy, onCopyError });
  React.useLayoutEffect(() => { latest.current = { onCopy, onCopyError }; });
  state.cancel.current = () => { if (timer.current !== null) clearTimeout(timer.current); timer.current = null; running.current = false; };
  const externalLock = locked(props), previousText = React.useRef(text);
  React.useLayoutEffect(() => {
    if (externalLock || !Object.is(previousText.current, text)) state.resetNow();
    previousText.current = text;
  }, [externalLock, text]);
  const click = event => {
    const stamp = state.stamp(); onClick?.(event);
    if (cancelled(event) || !state.validEvent(stamp) || running.current) return;
    running.current = true; const epoch = ++state.life.current.epoch;
    setStatus('copying');
    const failure = error => {
      if (!state.validOperation(epoch)) return;
      running.current = false; setStatus('error');
      // Notification callbacks are not caught as clipboard errors. Throws surface.
      latest.current.onCopyError?.(error);
    };
    let request;
    try {
      const view = state.node.current.ownerDocument.defaultView;
      if (view.isSecureContext === false) throw new Error('Clipboard requires a secure context.');
      if (typeof view.navigator.clipboard?.writeText !== 'function') throw new Error('Clipboard.writeText is unavailable.');
      request = view.navigator.clipboard.writeText(text);
      if (!request || typeof request.then !== 'function') throw new TypeError('Clipboard.writeText did not return a Promise.');
    } catch (error) { failure(error); return; }
    Promise.resolve(request).then(() => {
      if (!state.validOperation(epoch)) return;
      setStatus('copied');
      timer.current = setTimeout(() => {
        if (!state.validOperation(epoch)) return;
        timer.current = null; running.current = false; setStatus('idle');
      }, 2000);
      latest.current.onCopy?.(text);
    }, failure);
  };
  const copied = status === 'copied';
  const label = copied ? copiedLabel : status === 'copying' ? copyingLabel : status === 'error' ? errorLabel : children;
  // Explicit caller naming wins; otherwise use the existing live text without flattening children.
  const labelledBy = props['aria-labelledby'] ?? (props['aria-label'] == null ? labelId : undefined);
  return <NativeButton {...props} aria-labelledby={labelledBy} ref={state.node} variant="34" data-status={status}
    disabled={props.disabled || status === 'copying' || copied} aria-busy={status === 'copying'} onClick={click}>
    <span className="fr7-fb-copy-check" data-visible={copied}><Icon name="check" /></span>
    <span className="fr7-fb-copy-original" data-visible={!copied}><Icon name="copy" /></span>
    <span id={labelId} className="fr7-fb-label" role="status" aria-live="polite">{label}</span>
  </NativeButton>;
});
export const Button35 = React.forwardRef(function Button35({ children = '删除', ...props }, ref) {
  return <NativeButton {...props} ref={ref} variant="35"><Icon name="trash" /><span className="fr7-fb-label">{children}</span></NativeButton>;
});
export const Button36 = React.forwardRef(function Button36({ children, count = 3, ...props }, ref) {
  return <NativeButton {...props} ref={ref} variant="36"><Icon name="mail" /><span className="fr7-fb-sr-only">{iconLabel(children, props.title, '消息')}</span><span className="fr7-fb-badge" data-slot="badge">{count}</span></NativeButton>;
});
