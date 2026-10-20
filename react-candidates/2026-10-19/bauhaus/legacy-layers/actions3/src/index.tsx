'use client';

import * as React from 'react';
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import type {
  BauhausActionMemberProps,
  BauhausActionScopeProps,
  BauhausActionTheme,
  BauhausButton02Props,
  BauhausButton03Props,
  BauhausButton05Props,
} from './types.js';

export type {
  BauhausActionId,
  BauhausActionTheme,
  BauhausActionMemberProps,
  BauhausActionScopeProps,
  BauhausButton02Props,
  BauhausButton03Props,
  BauhausButton05Props,
} from './types.js';

export const bauhausActionIds = Object.freeze(['button-02', 'button-03', 'button-05'] as const);

const BEAT_MS = 500;
const useCommitEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const join = (...names: Array<string | undefined>) => names.filter(Boolean).join(' ');
const isAriaDisabled = (value: unknown) => value === true || value === 'true';

interface MotionScope {
  theme: BauhausActionTheme;
  paused: boolean;
  reducedMotion: boolean;
  hidden: boolean;
}
const ScopeContext = createContext<MotionScope>({
  theme: 'light', paused: false, reducedMotion: false, hidden: false,
});

export const BauhausActionScope = forwardRef<HTMLDivElement, BauhausActionScopeProps>(
  function BauhausActionScope({
    theme, paused = false, reducedMotion = false, hidden = false, className, children, ...props
  }, ref) {
    const parent = useContext(ScopeContext);
    const value = useMemo<MotionScope>(() => ({
      theme: theme ?? parent.theme,
      paused: paused || parent.paused,
      reducedMotion: reducedMotion || parent.reducedMotion,
      hidden: hidden || parent.hidden,
    }), [theme, paused, reducedMotion, hidden, parent]);
    return (
      <ScopeContext.Provider value={value}>
        <div {...props} ref={ref} className={join('bha-scope', className)} hidden={hidden}
          data-bha-theme={value.theme} data-bha-paused={value.paused ? 'true' : 'false'}
          data-bha-reduced-motion={value.reducedMotion ? 'true' : 'false'}>
          {children}
        </div>
      </ScopeContext.Provider>
    );
  },
);

interface Beat {
  active: boolean;
  serial: number;
  module: number;
  from: number;
  to: number;
  turns: [number, number, number];
}
const initialBeat: Beat = { active: false, serial: 0, module: 0, from: 0, to: 0, turns: [0, 0, 0] };

/** No layout measurement: native fieldset/first-legend rules remain authoritative. */
function blockedAction(node: HTMLButtonElement): boolean {
  return node.disabled || node.matches(':disabled') || isAriaDisabled(node.getAttribute('aria-disabled'));
}

function blockedEnvironment(node: HTMLButtonElement): boolean {
  const doc = node.ownerDocument;
  const view = doc.defaultView;
  return doc.hidden || doc.visibilityState === 'hidden'
    || Boolean(view?.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
}

function hiddenElement(node: HTMLButtonElement): boolean {
  if (node.closest('[hidden], [inert]')) return true;
  const view = node.ownerDocument.defaultView;
  if (!view) return true;
  for (let item: Element | null = node; item; item = item.parentElement) {
    const style = view.getComputedStyle(item);
    if (style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse') return true;
  }
  return false;
}

function afterEventCommit(callback: () => void) {
  // Two microtasks let parent bubbling handlers enqueue their own synchronous React commit.
  // This is decoration scheduling only; native click/default actions are never deferred.
  void Promise.resolve().then(() => { void Promise.resolve().then(callback); });
}

interface InternalButtonProps extends Omit<BauhausActionMemberProps, 'ref'> {
  action: 'previous' | 'next' | 'discard' | 'save' | 'disabled';
  variant: 'outline' | 'secondary' | 'primary';
  icon?: 'left' | 'right' | 'ban';
  permanentDisabled?: boolean;
}

const ActionButton = forwardRef<HTMLButtonElement, InternalButtonProps>(function ActionButton({
  action, variant, icon, permanentDisabled = false, disabled = false,
  type = 'button', className, children, onClick, style, ...props
}, forwardedRef) {
  const scope = useContext(ScopeContext);
  const nativeRef = useRef<HTMLButtonElement>(null);
  const mounted = useRef(false);
  const handling = useRef(false);
  const attempt = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [beat, setBeat] = useState<Beat>(initialBeat);
  const [environmentOff, setEnvironmentOff] = useState(false);
  const nativeDisabled = permanentDisabled || disabled;
  const ariaDisabled = isAriaDisabled(props['aria-disabled']);
  const latest = useRef({ nativeDisabled, ariaDisabled, scope });

  useImperativeHandle(forwardedRef, () => nativeRef.current as HTMLButtonElement, []);

  const stop = useCallback(() => {
    attempt.current += 1;
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    if (mounted.current) setBeat(current => current.active ? { ...current, active: false } : current);
  }, []);

  const canAnimate = useCallback((node: HTMLButtonElement) => {
    const current = latest.current;
    return mounted.current && nativeRef.current === node && node.isConnected
      && !current.nativeDisabled && !current.ariaDisabled
      && !current.scope.paused && !current.scope.reducedMotion && !current.scope.hidden
      && !blockedAction(node) && !blockedEnvironment(node) && !hiddenElement(node);
  }, []);

  useCommitEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      attempt.current += 1;
      if (timer.current !== null) clearTimeout(timer.current);
      timer.current = null;
    };
  }, []);

  useCommitEffect(() => {
    latest.current = { nativeDisabled, ariaDisabled, scope };
    const node = nativeRef.current;
    if (node && !canAnimate(node)) stop();
  });

  useEffect(() => {
    const node = nativeRef.current;
    if (!node) return;
    const doc = node.ownerDocument;
    const media = doc.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)');
    const refresh = () => {
      setEnvironmentOff(blockedEnvironment(node));
      if (!canAnimate(node)) stop();
    };
    refresh();
    doc.addEventListener('visibilitychange', refresh);
    if (media?.addEventListener) media.addEventListener('change', refresh);
    else media?.addListener(refresh);
    return () => {
      doc.removeEventListener('visibilitychange', refresh);
      if (media?.removeEventListener) media.removeEventListener('change', refresh);
      else media?.removeListener(refresh);
    };
  }, [canAnimate, stop]);

  useEffect(() => {
    if (!beat.active) return;
    const node = nativeRef.current;
    if (!node) return;
    const Observer = node.ownerDocument.defaultView?.MutationObserver;
    if (!Observer) return;
    // Bounded to this 500 ms feedback; catches native fieldset changes and reparenting.
    const observer = new Observer(() => { if (!canAnimate(node)) stop(); });
    observer.observe(node.ownerDocument.documentElement, {
      attributes: true, attributeFilter: ['disabled', 'aria-disabled', 'hidden', 'inert', 'class', 'style'],
      childList: true, subtree: true,
    });
    return () => observer.disconnect();
  }, [beat.active, canAnimate, stop]);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    const node = event.currentTarget;
    if (permanentDisabled || latest.current.nativeDisabled || latest.current.ariaDisabled || blockedAction(node)) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (handling.current) {
      attempt.current += 1;
      event.preventDefault();
      return;
    }
    const ticket = ++attempt.current;
    handling.current = true;
    try {
      // Preserve the actual React event. A thrown handler propagates and skips decoration.
      onClick?.(event);
    } finally {
      handling.current = false;
    }
    if (event.defaultPrevented || event.nativeEvent.defaultPrevented || ticket !== attempt.current) return;
    afterEventCommit(() => {
      if (ticket !== attempt.current || event.defaultPrevented || event.nativeEvent.defaultPrevented || !canAnimate(node)) return;
      if (timer.current !== null) clearTimeout(timer.current);
      setBeat(current => {
        const module = current.serial % 3;
        const from = current.turns[module] ?? 0;
        const to = from + (action === 'previous' ? -90 : 90);
        const turns: [number, number, number] = [...current.turns];
        turns[module] = to;
        return { active: true, serial: current.serial + 1, module, from, to, turns };
      });
      timer.current = setTimeout(() => {
        timer.current = null;
        if (mounted.current) setBeat(current => ({ ...current, active: false }));
      }, BEAT_MS);
    });
  };

  const motionOff = nativeDisabled || ariaDisabled || environmentOff
    || scope.paused || scope.reducedMotion || scope.hidden;
  const inkStyle = {
    ...style,
    '--bha-turn-from': `${beat.from}deg`,
    '--bha-turn-to': `${beat.to}deg`,
  } as CSSProperties;

  return (
    <button {...props} ref={nativeRef} type={type} disabled={nativeDisabled} onClick={handleClick}
      className={join('bha-button', `bha-button--${variant}`, className)} style={inkStyle}
      data-slot="button" data-size="default" data-variant={variant === 'primary' ? 'default' : variant}
      data-bha-action={action} data-bha-variant={variant}
      data-bha-feedback={beat.active && !motionOff ? 'on' : 'off'}
      data-bha-beat={beat.serial % 2 ? 'odd' : 'even'} data-bha-motion={motionOff ? 'off' : 'on'}>
      {icon && icon !== 'right' ? <ActionIcon kind={icon} /> : null}
      <span className="bha-label">{children}</span>
      {icon === 'right' ? <ActionIcon kind="right" /> : null}
      <span className="bha-geometry" aria-hidden="true">
        {(['circle', 'triangle', 'rectangle'] as const).map((shape, index) => (
          <span key={shape} className={`bha-module bha-module--${shape}`}
            data-bha-turning={beat.module === index ? 'true' : 'false'}
            data-bha-pivot={index === 1 ? 'corner' : 'center'}
            style={{ transform: `rotate(${beat.turns[index]}deg)` }} />
        ))}
      </span>
    </button>
  );
});

/** Small original SVG geometry; no icon-font or external icon runtime is bundled. */
function ActionIcon({ kind }: { kind: 'left' | 'right' | 'ban' }) {
  return (
    <svg className="bha-icon" data-bha-icon={kind} viewBox="0 0 24 24" width="16" height="16"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" focusable="false">
      {kind === 'ban' ? <><circle cx="12" cy="12" r="9" /><path d="M6 6 18 18" /></>
        : kind === 'left' ? <><path d="M19 12H5" /><path d="m11 6-6 6 6 6" /></>
          : <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>}
    </svg>
  );
}

function memberContent(props: BauhausActionMemberProps | undefined, label: ReactNode): ReactNode {
  return props?.children !== undefined ? props.children : label;
}

export const BauhausButton02 = forwardRef<HTMLDivElement, BauhausButton02Props>(function BauhausButton02({
  previousProps, nextProps, previousLabel = 'Prev', nextLabel = 'Next', className, ...props
}, ref) {
  return (
    <div {...props} ref={ref} className={join('bha-pair', 'bha-pair--02', className)} data-bha-id="button-02">
      <ActionButton {...previousProps} action="previous" variant="outline" icon="left">
        {memberContent(previousProps, previousLabel)}
      </ActionButton>
      <ActionButton {...nextProps} action="next" variant="outline" icon="right">
        {memberContent(nextProps, nextLabel)}
      </ActionButton>
    </div>
  );
});

export const BauhausButton03 = forwardRef<HTMLDivElement, BauhausButton03Props>(function BauhausButton03({
  discardProps, saveProps, discardLabel = 'Discard', saveLabel = 'Save', className, ...props
}, ref) {
  return (
    <div {...props} ref={ref} className={join('bha-pair', 'bha-pair--03', className)} data-bha-id="button-03">
      <ActionButton {...discardProps} action="discard" variant="secondary">
        {memberContent(discardProps, discardLabel)}
      </ActionButton>
      <ActionButton {...saveProps} action="save" variant="primary">
        {memberContent(saveProps, saveLabel)}
      </ActionButton>
    </div>
  );
});

export const BauhausButton05 = forwardRef<HTMLButtonElement, BauhausButton05Props>(function BauhausButton05({
  children = 'Disabed', ...props
}, ref) {
  return (
    <ActionButton {...props} ref={ref} action="disabled" variant="primary" icon="ban" permanentDisabled
      disabled data-bha-id="button-05">
      {children}
    </ActionButton>
  );
});
