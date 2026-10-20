'use client';
import * as React from 'react';
import type {SelectionState,CheckedChangeDetails,Checkbox13Props,Checkbox14Props,FollowSwitchProps} from './types.js';
export type {Checkbox13Props,Checkbox14Props,FollowSwitchProps,FollowSelectionItemProps,FollowSwitchItemProps} from './types.js';
// Native transactional engine reused from the reviewed local selection slices.
type Kind = 'checkbox' | 'switch';
interface EngineProps {
  kind: Kind;
  checked?: boolean | undefined;
  defaultChecked?: boolean | undefined;
  indeterminate?: boolean | undefined;
  defaultIndeterminate?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  onCheckedChange?: ((checked: boolean, details: CheckedChangeDetails) => void) | undefined;
  onClick?: React.MouseEventHandler<HTMLInputElement> | undefined;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement> | undefined;
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
  const mounted = React.useRef(false);
  const pending = React.useRef(new Set<ReturnType<typeof setTimeout>>());
  const resets = React.useRef(new Set<{event: Event; ticket: Stamp; run: () => boolean}>());
  const activations = React.useRef(new Set<{event: Event; run: () => boolean}>());
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
  function commit(next: SelectionState, changeChecked: boolean, changeMixed: boolean): void {
    const old = owner.current;
    const checkedValue = changeChecked ? next.checked : old.checked;
    const mixedValue = changeMixed ? next.indeterminate : old.indeterminate;
    if (checkedValue !== old.checked) stamp.current.checked++;
    if (mixedValue !== old.indeterminate) stamp.current.indeterminate++;
    owner.current = { ...old, checked: checkedValue, indeterminate: mixedValue };
    setInner({ checked: checkedValue, indeterminate: mixedValue });
  }

  React.useLayoutEffect(() => {
    const old = owner.current;
    if (old.checkedControlled !== checkedControlled || old.checked !== value.checked) stamp.current.checked++;
    if (old.mixedControlled !== mixedControlled || old.indeterminate !== value.indeterminate) stamp.current.indeterminate++;
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
      for(const job of [...activations.current])if(job.event.eventPhase===0)job.run();
      const ticket = { ...stamp.current };
      const job = {event, ticket, run: (): boolean => false}; resets.current.add(job);
      job.run = () => {
        if (!resets.current.delete(job)) return false;
        if (node.current !== input || !input.isConnected) return false;
        if (input.form !== form) { syncDOM(); return true; }
        // Wait until all reset listeners have had their chance to cancel the native reset.
        if (!event.defaultPrevented && ticket.action === stamp.current.action && ticket.status === stamp.current.status) {
          const live = owner.current;
          const resetChecked = !live.checkedControlled && ticket.checked === stamp.current.checked;
          const resetMixed = kind === 'checkbox' && !live.mixedControlled && ticket.indeterminate === stamp.current.indeterminate;
          // The first uncanceled reset in a same-task burst is sufficient: defaults are mount-stable.
          if (resetChecked || resetMixed) {
            stamp.current.action++;
            commit(initial.current, resetChecked, resetMixed);
          }
        }
        syncDOM(); return true;
      }; later(job.run);
    };
    const settleResetBeforeClick = (event: Event) => {
      const input=node.current; if(!input||event.target!==input)return;
      let settled=false;
      for(const job of [...activations.current])if(job.event.eventPhase===0)settled=job.run()||settled;
      for(const job of [...resets.current])if(job.event.eventPhase===0)settled=job.run()||settled;
      if(settled&&mounted.current&&node.current===input)Object.getOwnPropertyDescriptor(input.ownerDocument.defaultView!.HTMLInputElement.prototype,'checked')!.set!.call(input,!owner.current.checked);
    };
    doc?.addEventListener('click',settleResetBeforeClick,true);
    doc?.addEventListener('reset', reset, true);
    return () => {
      mounted.current = false;
      doc?.removeEventListener('reset', reset, true);
      doc?.removeEventListener('click',settleResetBeforeClick,true);resets.current.clear();activations.current.clear();
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
          commit(next, appliedChecked, appliedMixed);
          committed = { ...stamp.current };
        }
      }
    } catch (error) {
      details.cancel();
      throw error;
    } finally {
      // Browser canceled-activation rollback happens AFTER React's delegated click callbacks.
      // Reconcile in a task, not a capture microtask, and never replace a newer owner commit.
      const job={event:native,run:():boolean=>false};activations.current.add(job);
      job.run=()=>{
        if(!activations.current.delete(job))return false;
        if (node.current !== input || !input.isConnected) return false;
        if ((native.defaultPrevented || event.defaultPrevented) && ticket.action === stamp.current.action) {
          const live = owner.current;
          const beforeRollback = {...stamp.current};
          commit(previous,
            appliedChecked && !live.checkedControlled && committed.checked === stamp.current.checked,
            appliedMixed && !live.mixedControlled && committed.indeterminate === stamp.current.indeterminate);
          // A reset requested later in this dispatch must survive rollback of this
          // canceled activation. Rebase only unchanged axes, never newer owner edits.
          for (const reset of resets.current) {
            if (reset.ticket.action !== ticket.action) continue;
            if (reset.ticket.checked === beforeRollback.checked) reset.ticket.checked = stamp.current.checked;
            if (reset.ticket.indeterminate === beforeRollback.indeterminate) reset.ticket.indeterminate = stamp.current.indeterminate;
          }
        }
        syncDOM();return true;
      };later(job.run);
    }
  }
  function keyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    onKeyDown?.(event);
    if (event.defaultPrevented || event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229 || event.key !== 'Enter') return;
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

type Graphic='mail'|'cloud'|'pen'|'briefcase'|'badge';
/** Original geometric symbols stand in for source icon meaning, not source icon pixels. */
function Symbol({kind}:{kind:Graphic}):React.ReactElement {
 const paths={mail:'M3 5H21V19H3ZM3 5L12 12L21 5',cloud:'M7 18H18Q23 18 21 12Q20 9 17 10Q16 3 10 5Q5 5 5 11Q0 12 3 17Z',pen:'M4 20L6 13L16 3L21 8L11 18ZM6 13L11 18M4 20L11 18',briefcase:'M3 8H21V20H3ZM8 8V4H16V8M3 12L12 15L21 12',badge:'M12 2L16 5L21 6L20 12L21 18L16 19L12 22L8 19L3 18L4 12L3 6L8 5ZM7 12L10 15L17 9'};
 return <svg className="fr5-symbol" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d={paths[kind]}/></svg>;
}
interface InternalProps extends EngineProps{
 inputProps:Omit<React.InputHTMLAttributes<HTMLInputElement>,'size'>;inputRef:React.ForwardedRef<HTMLInputElement>;
 label?:React.ReactNode;description?:React.ReactNode;className?:string|undefined;graphic?:Graphic;variant:'setting'|'skill'|'mail'|'cloud';catalogId?:string;
}
function Row({kind,inputProps,inputRef,label,description,className='',graphic,variant,catalogId,...engine}:InternalProps):React.ReactElement{
 const uid=React.useId(),id=inputProps.id??uid,descriptionId=uid+'-description',state=useNativeSelection({...engine,kind},inputRef);
 const hasLabel=label!==null&&label!==undefined&&label!==false,hasDescription=description!==null&&description!==undefined&&description!==false;
 const described=Array.from(new Set(`${inputProps['aria-describedby']??''} ${hasDescription?descriptionId:''}`.split(/\s+/).filter(Boolean))).join(' ')||undefined;
 return <div className={`fr5-row fr5-${variant} ${className}`.trim()} data-catalog-id={catalogId} data-state={state.value.indeterminate?'mixed':state.value.checked?'checked':'unchecked'}>
  {graphic&&<Symbol kind={graphic}/>}
  <div className="fr5-copy">{hasLabel&&<label className="fr5-label" htmlFor={id}>{label}</label>}{hasDescription&&<p id={descriptionId} className="fr5-description">{description}</p>}</div>
  <span className={`fr5-hit fr5-${kind}`}><input {...inputProps} {...state.input} id={id} type="checkbox" role={kind==='switch'?'switch':undefined} disabled={engine.disabled} readOnly={engine.readOnly} aria-readonly={engine.readOnly||undefined} aria-checked={state.value.indeterminate?'mixed':state.value.checked} aria-describedby={described}/>
   {kind==='checkbox'?<svg viewBox="0 0 16 16" className="fr5-check-art" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="14.5" height="14.5" rx="2"/>{state.value.indeterminate?<path d="M4 8H12"/>:state.value.checked?<path d="M3.5 8L6.5 11L12.5 4.5"/>:null}</svg>:
    <svg viewBox="0 0 24 16" className="fr5-switch-art" aria-hidden="true" focusable="false"><rect x=".5" y=".5" width="23" height="15" rx="7.5"/><g className="fr5-direction"><circle className="fr5-thumb" cx="7" cy="8" r="5.5" transform={`translate(${state.value.checked?10:0} 0)`}/></g></svg>}
  </span>
 </div>;
}
const SETTINGS=[
 {key:'auto-start',label:'Launch at startup',description:'Starting with your OS.',initial:true},
 {key:'auto-update',label:'Install updates automatically',description:'Download and install new version',initial:false},
] as const;
export function Checkbox13({items={},className='',...props}:Checkbox13Props):React.ReactElement{
 return <div {...props} className={`fr5-settings ${className}`.trim()} data-catalog-id="checkbox-13">
  {SETTINGS.map(option=>{
   const {ref=null,label=option.label,description=option.description,checked,defaultChecked=option.initial,indeterminate,defaultIndeterminate=false,disabled=false,readOnly=false,onCheckedChange,onClick,onKeyDown,className:itemClass,onChange:_change,'aria-label':ariaLabel,...inputProps}=items[option.key]??{};
   return <Row key={option.key} kind="checkbox" variant="setting" label={label} description={description} inputRef={ref} className={itemClass}
    checked={checked} defaultChecked={checked===undefined?defaultChecked:undefined} indeterminate={indeterminate} defaultIndeterminate={defaultIndeterminate} disabled={disabled} readOnly={readOnly} onCheckedChange={onCheckedChange} onClick={onClick} onKeyDown={onKeyDown}
    inputProps={{...inputProps,'aria-label':ariaLabel??((label==null||label===false)&&!inputProps['aria-labelledby']?option.label:undefined)}}/>;
  })}
 </div>;
}
const SKILLS=[
 {key:'frontend-engineering',label:'Frontend Engineering',graphic:'pen'},
 {key:'business-insights',label:'Business Insights',graphic:'briefcase'},
 {key:'visual-branding',label:'Visual Branding',graphic:'badge'},
] as const;
export function Checkbox14({items={},className='',...props}:Checkbox14Props):React.ReactElement{
 return <ul {...props} className={`fr5-skills ${className}`.trim()} data-catalog-id="checkbox-14">
  {SKILLS.map(option=>{
   const {ref=null,label=option.label,description,checked,defaultChecked=false,indeterminate,defaultIndeterminate=false,disabled=false,readOnly=false,onCheckedChange,onClick,onKeyDown,className:itemClass,onChange:_change,'aria-label':ariaLabel,...inputProps}=items[option.key]??{};
   return <li key={option.key}><Row kind="checkbox" variant="skill" graphic={option.graphic} label={label} description={description} inputRef={ref} className={itemClass}
    checked={checked} defaultChecked={checked===undefined?defaultChecked:undefined} indeterminate={indeterminate} defaultIndeterminate={defaultIndeterminate} disabled={disabled} readOnly={readOnly} onCheckedChange={onCheckedChange} onClick={onClick} onKeyDown={onKeyDown}
    inputProps={{...inputProps,'aria-label':ariaLabel??((label==null||label===false)&&!inputProps['aria-labelledby']?option.label:undefined)}}/></li>;
  })}
 </ul>;
}
function SwitchCard({variant,props,inputRef}:{variant:'mail'|'cloud';props:FollowSwitchProps;inputRef:React.ForwardedRef<HTMLInputElement>}):React.ReactElement{
 const name=variant==='mail'?'Email Updates':'Cloud Backup',defaultDescription=variant==='mail'?'Receive important updates and notifications via email.':'Securely store your files, photos, and documents in the cloud.';
 const{label=name,description=defaultDescription,checked,defaultChecked=false,disabled=false,readOnly=false,onCheckedChange,onClick,onKeyDown,className,onChange:_change,indeterminate:_mixed,defaultIndeterminate:_initialMixed,'aria-label':ariaLabel,...inputProps}=props;
 return <Row kind="switch" variant={variant} graphic={variant} catalogId={variant==='mail'?'switch-13':'switch-14'} label={label} description={description} inputRef={inputRef} className={className}
 checked={checked} defaultChecked={checked===undefined?defaultChecked:undefined} disabled={disabled} readOnly={readOnly} onCheckedChange={onCheckedChange} onClick={onClick} onKeyDown={onKeyDown}
 inputProps={{...inputProps,'aria-label':ariaLabel??((label==null||label===false)&&!inputProps['aria-labelledby']?name:undefined)}}/>;
}
export const Switch13=React.forwardRef<HTMLInputElement,FollowSwitchProps>(function Switch13(props,ref){return <SwitchCard variant="mail" props={props} inputRef={ref}/>});
export const Switch14=React.forwardRef<HTMLInputElement,FollowSwitchProps>(function Switch14(props,ref){return <SwitchCard variant="cloud" props={props} inputRef={ref}/>});
