'use client';

import * as React from 'react';
import type {
  Checkbox04Props, Switch02Props, SwitchItemProps, Checkbox03Props, Switch03Props, Switch03Tone, SelectionState, CheckedChangeDetails,
  FlatVectorSelectionScopeProps,
} from './types.js';
export type {
  Checkbox04Props, Switch02Props, SwitchItemProps, Checkbox03Props, Switch03Props, Switch03Tone, SelectionState, CheckedChangeDetails,
  SelectionProps, FlatVectorSelectionScopeProps,
} from './types.js';

export const flatvectorSelectionIds = Object.freeze(['checkbox-03', 'switch-03', 'checkbox-04', 'switch-02'] as const);
const MotionContext = React.createContext(false);

/** A scoped primary-colour modular surface. Stop settings affect decoration, never input behavior. */
export function FlatVectorSelectionScope({
  children, mode = 'light', paused = false, reducedMotion = false, className = '', ...rest
}: FlatVectorSelectionScopeProps): React.ReactElement {
  const inheritedStop = React.useContext(MotionContext);
  const [systemStop, setSystemStop] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const root = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const doc = root.current?.ownerDocument;
    const media = doc?.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)');
    const syncMedia = () => setSystemStop(Boolean(media?.matches));
    const syncVisibility = () => setHidden(doc?.visibilityState === 'hidden');
    syncMedia(); syncVisibility();
    media?.addEventListener('change', syncMedia);
    doc?.addEventListener('visibilitychange', syncVisibility);
    return () => {
      media?.removeEventListener('change', syncMedia);
      doc?.removeEventListener('visibilitychange', syncVisibility);
    };
  }, []);
  const stopped = inheritedStop || paused || reducedMotion || systemStop || hidden;
  return <MotionContext.Provider value={stopped}>
    <div {...rest} ref={root} className={`flatvector-selection ${className}`.trim()}
      data-mode={mode} data-motion={stopped ? 'off' : 'on'}>{children}</div>
  </MotionContext.Provider>;
}

type Kind = 'checkbox' | 'switch';
interface EngineProps {
  kind: Kind;
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  defaultIndeterminate?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  onCheckedChange?: (checked: boolean, details: CheckedChangeDetails) => void;
  onClick?: React.MouseEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}
interface Owner extends SelectionState {
  checkedControlled: boolean;
  mixedControlled: boolean;
  disabled: boolean;
  readOnly: boolean;
}
interface Stamp { checked: number; indeterminate: number; status: number; action: number }

/** Per-axis revisions let an explicit parent commit win without losing the other uncontrolled axis. */
function useNativeSelection(props: EngineProps, forwardedRef: React.ForwardedRef<HTMLInputElement>) {
  const {
    kind, checked, defaultChecked = false, indeterminate, defaultIndeterminate = false,
    disabled = false, readOnly = false, onClick, onKeyDown, onCheckedChange,
  } = props;
  const initial = React.useRef<SelectionState>({
    checked: Boolean(defaultChecked),
    indeterminate: kind === 'checkbox' && Boolean(defaultIndeterminate),
  });
  const [inner, setInner] = React.useState<SelectionState>(initial.current);
  const checkedControlled = checked !== undefined;
  const mixedControlled = kind === 'checkbox' && indeterminate !== undefined;
  const value: SelectionState = {
    checked: checkedControlled ? Boolean(checked) : inner.checked,
    indeterminate: kind === 'checkbox' && (mixedControlled ? Boolean(indeterminate) : inner.indeterminate),
  };
  const node = React.useRef<HTMLInputElement>(null);
  // Intent order is separate from provisional commits and explicit owner changes.
  const intentSerial = React.useRef(0);
  const resetIntents = React.useRef<{ serial:number; event:Event }[]>([]);
  const ownerStamp = React.useRef({ checked: 0, indeterminate: 0 });
  const clickIntents = React.useRef<{ serial:number; native:Event; canceled:()=>boolean; rollback:()=>boolean; checked:boolean; mixed:boolean }[]>([]);
  const mounted = React.useRef(false);
  const pending = React.useRef(new Set<ReturnType<typeof setTimeout>>());
  const stamp = React.useRef<Stamp>({ checked: 0, indeterminate: 0, status: 0, action: 0 });
  const owner = React.useRef<Owner>({ ...value, checkedControlled, mixedControlled, disabled, readOnly });

  function syncDOM(): void {
    const input = node.current;
    if (!mounted.current || !input?.isConnected) return;
    input.defaultChecked = initial.current.checked;
    input.checked = owner.current.checked;
    input.indeterminate = owner.current.indeterminate;
  }
  function later(work: () => void): void {
    if (!mounted.current) return;
    const timer = setTimeout(() => {
      pending.current.delete(timer);
      if (mounted.current) work();
    }, 0);
    pending.current.add(timer);
  }
  function commit(next: SelectionState, changeChecked: boolean, changeMixed: boolean, resetIntent = false): void {
    const old = owner.current;
    const checkedValue = changeChecked ? next.checked : old.checked;
    const mixedValue = changeMixed ? next.indeterminate : old.indeterminate;
    if (checkedValue !== old.checked || (resetIntent && changeChecked)) stamp.current.checked++;
    if (mixedValue !== old.indeterminate || (resetIntent && changeMixed)) stamp.current.indeterminate++;
    owner.current = { ...old, checked: checkedValue, indeterminate: mixedValue };
    setInner({ checked: checkedValue, indeterminate: mixedValue });
  }

  React.useLayoutEffect(() => {
    const old = owner.current;
    if (old.checkedControlled !== checkedControlled || old.checked !== value.checked) { stamp.current.checked++; ownerStamp.current.checked++; }
    if (old.mixedControlled !== mixedControlled || old.indeterminate !== value.indeterminate) { stamp.current.indeterminate++; ownerStamp.current.indeterminate++; }
    if (old.disabled !== disabled || old.readOnly !== readOnly) stamp.current.status++;
    owner.current = { ...value, checkedControlled, mixedControlled, disabled, readOnly };
    // Mirror the last controlled value for a later controlled -> uncontrolled handoff.
    setInner(previous => previous.checked === value.checked && previous.indeterminate === value.indeterminate
      ? previous : value);
    syncDOM();
  });

  React.useLayoutEffect(() => {
    mounted.current = true;
    const doc = node.current?.ownerDocument;
    syncDOM();
    const reset = (event: Event) => {
      const input = node.current;
      const form = input?.form;
      if (!input || !form || event.target !== form) return;
      const ticket = { ...stamp.current, owner: { ...ownerStamp.current }, intent: ++intentSerial.current };
      const resetIntent = { serial: ticket.intent, event }; resetIntents.current.push(resetIntent);
      later(() => {
        resetIntents.current = resetIntents.current.filter(item => item !== resetIntent);
        if (node.current !== input || !input.isConnected) return;
        if (input.form !== form) { syncDOM(); return; }
        // Wait until all reset listeners have had their chance to cancel the native reset.
        if (!event.defaultPrevented && ticket.status === stamp.current.status) {
          const live = owner.current;
          const newerChecked = clickIntents.current.some(intent => intent.serial > ticket.intent && intent.checked && !intent.canceled());
          const newerMixed = clickIntents.current.some(intent => intent.serial > ticket.intent && intent.mixed && !intent.canceled());
          const resetChecked = !live.checkedControlled && ticket.owner.checked === ownerStamp.current.checked && !newerChecked;
          const resetMixed = kind === 'checkbox' && !live.mixedControlled && ticket.owner.indeterminate === ownerStamp.current.indeterminate && !newerMixed;
          // Each reset intent independently respects later accepted axes and explicit owner commits.
          if (resetChecked || resetMixed) {
            stamp.current.action++;
            commit(initial.current, resetChecked, resetMixed, true);
          }
        }
        syncDOM();
      });
    };
    doc?.addEventListener('reset', reset, true);
    return () => {
      mounted.current = false;
      doc?.removeEventListener('reset', reset, true);
      for (const timer of pending.current) clearTimeout(timer);
      pending.current.clear();
    };
  }, []);

  const bindRef = React.useCallback((element: HTMLInputElement | null) => {
    node.current = element;
    if (typeof forwardedRef === 'function') {
      // ForwardedRef may be typed as void by compatible React declarations; React 19 can return a cleanup.
      const cleanup: unknown = forwardedRef(element);
      if (typeof cleanup === 'function') return () => {
        if (node.current === element) node.current = null;
        cleanup();
      };
    } else if (forwardedRef) forwardedRef.current = element;
  }, [forwardedRef]);

  function click(event: React.MouseEvent<HTMLInputElement>): void {
    const input = event.currentTarget;
    const native = event.nativeEvent;
    const hadCanceled = clickIntents.current.some(item => item.canceled());
    let settledChecked = false;
    for (const previousIntent of [...clickIntents.current].reverse()) {
      settledChecked = previousIntent.rollback() || settledChecked;
    }
    // Native activation may have toggled from a provisional ancestor-canceled DOM value.
    if (settledChecked || hadCanceled) {
      const reset = resetIntents.current.filter(item => !item.event.defaultPrevented).slice(-1)[0];
      const afterReset = reset && clickIntents.current.some(item => item.serial > reset.serial && item.checked && !item.canceled());
      input.checked = reset && !afterReset && !owner.current.checkedControlled ? !initial.current.checked : !owner.current.checked;
    }
    const intent = { serial: ++intentSerial.current, native, canceled: () => event.defaultPrevented || native.defaultPrevented, rollback: () => false, checked: false, mixed: false };
    clickIntents.current.push(intent);
    const previous = Object.freeze<SelectionState>({ checked: owner.current.checked, indeterminate: owner.current.indeterminate });
    const next = Object.freeze<SelectionState>({ checked: input.checked, indeterminate: false });
    const ticket = { ...stamp.current, action: ++stamp.current.action };
    let canceled = event.defaultPrevented;
    let appliedChecked = false;
    let appliedMixed = false;
    let committed = { ...ticket };
    const details: CheckedChangeDetails = {
      event, previousState: previous, nextState: next,
      cancel() { canceled = true; event.preventDefault(); },
      get canceled() { return canceled || event.defaultPrevented || native.defaultPrevented; },
    };
    intent.canceled = () => details.canceled;
    try {
      onClick?.(event);
      const live = owner.current;
      if (live.disabled || live.readOnly || input.matches(':disabled')) details.cancel();
      if (!details.canceled && mounted.current && node.current === input &&
          ticket.status === stamp.current.status && ticket.action === stamp.current.action) {
        onCheckedChange?.(next.checked, details);
        if (!details.canceled && mounted.current && node.current === input &&
            ticket.status === stamp.current.status && ticket.action === stamp.current.action) {
          const current = owner.current;
          appliedChecked = !current.checkedControlled && ticket.checked === stamp.current.checked;
          appliedMixed = kind === 'checkbox' && !current.mixedControlled && ticket.indeterminate === stamp.current.indeterminate;
          intent.checked = appliedChecked; intent.mixed = appliedMixed;
          commit(next, appliedChecked, appliedMixed);
          committed = { ...stamp.current };
        }
      }
    } catch (error) {
      details.cancel();
      throw error;
    } finally {
      // Settle known canceled provisional commits before another same-task click,
      // or in the original task after browser canceled-activation rollback.
      let rolledBack = false;
      intent.rollback = () => {
        if (rolledBack || !details.canceled || node.current !== input || !input.isConnected) return false;
        rolledBack = true;
        const live = owner.current;
        const restoreChecked = appliedChecked && !live.checkedControlled && committed.checked === stamp.current.checked;
        const restoreMixed = appliedMixed && !live.mixedControlled && committed.indeterminate === stamp.current.indeterminate;
        commit(previous, restoreChecked, restoreMixed);
        return restoreChecked;
      };
      later(() => {
        clickIntents.current = clickIntents.current.filter(item => item !== intent);
        if (node.current !== input || !input.isConnected) return;
        intent.rollback();
        syncDOM();
      });
    }
  }
  function keyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    onKeyDown?.(event);
    if (event.defaultPrevented || event.nativeEvent.isComposing || event.key !== 'Enter') return;
    if (kind === 'switch') {
      // Suppress native Enter form submission on repeats too; only the first keydown activates.
      event.preventDefault();
      if (event.repeat) return;
      if (!owner.current.disabled && !owner.current.readOnly && !event.currentTarget.matches(':disabled')) event.currentTarget.click();
    }
    // Checkbox Space and Enter retain native browser semantics (including native form handling).
  }
  return { value, input: { ref: bindRef, checked: value.checked, onChange: () => {}, onClick: click, onKeyDown: keyDown } };
}

function CheckboxInk({ state }: { state: 'mixed' | 'checked' | 'unchecked'; dashed?: boolean }): React.ReactElement {
 const previous=React.useRef(state);const changed=previous.current!==state;React.useEffect(()=>{previous.current=state},[state]);
 return <svg data-feedback={changed || undefined} className="flatvector-checkbox-art" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><rect className="flatvector-box" x="8" y="8" width="24" height="24" rx="5"/><path key={state} className="flatvector-mark" d={state === 'mixed' ? 'M13 18H27V22H13Z' : state === 'checked' ? 'M12 20L15 17L19 21L26 13L29 16L19 27Z' : ''}/></svg>;
}
function SwitchInk({ small, checked, tone }: { small: boolean; checked: boolean; rounded?: boolean; tone?: Switch03Tone }): React.ReactElement {
 const previous=React.useRef(checked);const changed=previous.current!==checked;React.useEffect(()=>{previous.current=checked},[checked]);
 return <span data-feedback={changed || undefined} className="flatvector-switch-art" data-small={small || undefined} aria-hidden="true"><span className="flatvector-track"/><span className="flatvector-thumb"><span key={String(checked)} className="flatvector-thumb-shape"><span data-symbol={tone}>{tone === 'success' ? '✓' : tone === 'info' ? 'i' : tone === 'warning' ? '!' : tone === 'destructive' ? '×' : ''}</span></span></span></span>;
}

interface InternalProps extends EngineProps {
  catalogId?: string;
  tone?: Switch03Tone;
  rounded?: boolean;
  inputProps: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>;
  inputRef: React.ForwardedRef<HTMLInputElement>;
  label?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  size?: 'default' | 'sm';
}
function NativeSelection({ catalogId, tone, rounded, kind, inputProps, inputRef, label, description, className = '', size = 'default', ...engine }: InternalProps): React.ReactElement {
  const generated = React.useId();
  const id = inputProps.id ?? generated;
  const descriptionId = `${generated}-description`;
  const stopped = React.useContext(MotionContext);
  const state = useNativeSelection({ ...engine, kind }, inputRef);
  const mixed = state.value.indeterminate;
  const visual = mixed ? 'mixed' : state.value.checked ? 'checked' : 'unchecked';
  const hasLabel = label !== null && label !== undefined && label !== false;
  const hasDescription = description !== null && description !== undefined && description !== false;
  const describedBy = Array.from(new Set(
    `${inputProps['aria-describedby'] ?? ''} ${hasDescription ? descriptionId : ''}`.split(/\s+/).filter(Boolean)
  )).join(' ') || undefined;
  return <div className={`flatvector-field flatvector-${kind} ${className}`.trim()}
    data-catalog-id={catalogId ?? (kind === 'checkbox' ? 'checkbox-03' : 'switch-03-item')} data-tone={tone} data-state={visual}
    data-size={size} data-motion={stopped ? 'off' : 'on'} data-disabled={engine.disabled ? 'true' : undefined}>
    <span className="flatvector-hit">
      <input {...inputProps} {...state.input} id={id} type="checkbox" role={kind === 'switch' ? 'switch' : undefined}
        disabled={engine.disabled} readOnly={engine.readOnly} aria-readonly={engine.readOnly || undefined}
        aria-checked={mixed ? 'mixed' : state.value.checked} aria-describedby={describedBy} />
      {kind === 'checkbox' ? <CheckboxInk state={visual} dashed={catalogId === 'checkbox-03'} /> : <SwitchInk tone={tone} small={size === 'sm'} checked={state.value.checked} rounded={rounded} />}
    </span>
    {(hasLabel || hasDescription) && <div className="flatvector-copy">
      {hasLabel && <label htmlFor={id} className="flatvector-label">{label}</label>}
      {hasDescription && <p id={descriptionId} className="flatvector-description">{description}</p>}
    </div>}
  </div>;
}

/** Dashed-border subscription checkbox from exact upstream variant 3; no mixed default. */
export const Checkbox03 = React.forwardRef<HTMLInputElement, Checkbox03Props>(function Checkbox03({
  label = 'Subscribe to product updates', description,
  checked, defaultChecked, indeterminate, defaultIndeterminate = false, disabled = false, readOnly = false,
  onCheckedChange, onChange: _unusedOnChange, onClick, onKeyDown, className,
  'aria-label': ariaLabel, ...inputProps
}, ref) {
  return <NativeSelection catalogId="checkbox-03" kind="checkbox" inputRef={ref} label={label} description={description} className={className}
    checked={checked} defaultChecked={defaultChecked} indeterminate={indeterminate} defaultIndeterminate={defaultIndeterminate}
    disabled={disabled} readOnly={readOnly} onCheckedChange={onCheckedChange} onClick={onClick} onKeyDown={onKeyDown}
    inputProps={{ ...inputProps, 'aria-label': ariaLabel ?? ((label == null || label === false) && !inputProps['aria-labelledby'] ? 'Subscribe to product updates' : undefined) }} />;
});
const switch03Names = { destructive: 'Destructive Switch', success: 'Success Switch', info: 'Info Switch', warning: 'Warning Switch' } as const;
const Switch03Item = React.forwardRef<HTMLInputElement, SwitchItemProps & { tone: Switch03Tone }>(function Switch03Item({
  tone, label, description, checked, defaultChecked, disabled = false, readOnly = false, size = 'default',
  indeterminate: _unusedMixed, defaultIndeterminate: _unusedDefaultMixed,
  onCheckedChange, onChange: _unusedOnChange, onClick, onKeyDown, className,
  'aria-label': ariaLabel, ...inputProps
}, ref) {
  return <NativeSelection catalogId="switch-03-item" tone={tone} rounded kind="switch" inputRef={ref}
    label={label} description={description} className={className} size={size}
    checked={checked} defaultChecked={defaultChecked ?? true} disabled={disabled} readOnly={readOnly}
    onCheckedChange={onCheckedChange} onClick={onClick} onKeyDown={onKeyDown}
    inputProps={{ ...inputProps, 'aria-label': ariaLabel ?? ((label == null || label === false) && !inputProps['aria-labelledby'] ? switch03Names[tone] : undefined) }} />;
});
/** One catalog identity contains FOUR independently owned switches, in upstream order. */
export function Switch03({ items = {}, className = '', ...rest }: Switch03Props): React.ReactElement {
  return <div {...rest} className={`flatvector-switch03 ${className}`.trim()} data-catalog-id="switch-03">
    {(Object.keys(switch03Names) as Switch03Tone[]).map(tone => <Switch03Item key={tone} {...items[tone]} tone={tone} />)}
  </div>;
}

/** Exact04: checked by default, with completion typography following the actual native state. */
export const Checkbox04=React.forwardRef<HTMLInputElement,Checkbox04Props>(function Checkbox04({
 label='Review weekly tasks',description,checked,defaultChecked,disabled=false,readOnly=false,
 indeterminate:_unusedMixed,defaultIndeterminate:_unusedDefaultMixed,children:_unusedChildren,
 onCheckedChange,onChange:_unusedOnChange,onClick,onKeyDown,className,'aria-label':ariaLabel,...inputProps
},ref){return <NativeSelection catalogId="checkbox-04" kind="checkbox" inputRef={ref} label={label} description={description} className={className}
 checked={checked} defaultChecked={defaultChecked??true} disabled={disabled} readOnly={readOnly}
 onCheckedChange={onCheckedChange} onClick={onClick} onKeyDown={onKeyDown}
 inputProps={{...inputProps,'aria-label':ariaLabel??((label==null||label===false)&&!inputProps['aria-labelledby']?'Review weekly tasks':undefined)}}/>});
/** Exact02: square track and thumb, initially unchecked. */
export const Switch02=React.forwardRef<HTMLInputElement,Switch02Props>(function Switch02({
 label,description,checked,defaultChecked=false,disabled=false,readOnly=false,size='default',
 indeterminate:_unusedMixed,defaultIndeterminate:_unusedDefaultMixed,children:_unusedChildren,
 onCheckedChange,onChange:_unusedOnChange,onClick,onKeyDown,className,'aria-label':ariaLabel,...inputProps
},ref){return <NativeSelection catalogId="switch-02" kind="switch" inputRef={ref} label={label} description={description} className={className} size={size}
 checked={checked} defaultChecked={defaultChecked} disabled={disabled} readOnly={readOnly}
 onCheckedChange={onCheckedChange} onClick={onClick} onKeyDown={onKeyDown}
 inputProps={{...inputProps,'aria-label':ariaLabel??((label==null||label===false)&&!inputProps['aria-labelledby']?'Square switch':undefined)}}/>});
