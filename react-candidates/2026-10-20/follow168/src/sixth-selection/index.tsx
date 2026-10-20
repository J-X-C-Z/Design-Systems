'use client';
import * as React from 'react';
import type {SelectionState,CheckedChangeDetails,FollowToggleProps} from './types.js';
export type {FollowToggleProps,FollowToggleChangeDetails} from './types.js';
type Kind = 'checkbox' | 'switch';
interface EngineProps {
  kind: Kind;
  checked?: boolean | undefined;
  defaultChecked?: boolean | undefined;
  indeterminate?: boolean;
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

type Variant=15|16|17|18;
function ThemeIcon({dark}:{dark:boolean}):React.ReactElement{return <svg className="fr6-symbol" viewBox="0 0 24 24" aria-hidden="true" focusable="false">{dark?<path d="M19 16A8 8 0 0 1 8 5A8 8 0 1 0 19 16Z"/>:<><circle cx="12" cy="12" r="4"/><path d="M12 1V4M12 20V23M1 12H4M20 12H23M4 4L6 6M18 18L20 20M4 20L6 18M18 6L20 4"/></>}</svg>}
function Toggle({variant,props,inputRef}:{variant:Variant;props:FollowToggleProps;inputRef:React.ForwardedRef<HTMLInputElement>}):React.ReactElement{
 const {checked,defaultChecked=variant!==18,disabled=false,readOnly=false,label,description,size='default',onCheckedChange,onClick,onKeyDown,className='',onChange:_change,indeterminate:_mixed,defaultIndeterminate:_initialMixed,'aria-label':ariaLabel,'aria-labelledby':labelledBy,'aria-describedby':describedBy,...inputProps}=props;
 const uid=React.useId(),id=inputProps.id??uid,descriptionId=uid+'-description',leftId=uid+'-left',rightId=uid+'-right',node=React.useRef<HTMLInputElement>(null);
 const bind=React.useCallback((el:HTMLInputElement|null)=>{node.current=el;if(typeof inputRef==='function'){const cleanup:unknown=inputRef(el);if(typeof cleanup==='function')return()=>{node.current=null;cleanup();};}else if(inputRef)inputRef.current=el;},[inputRef]);
 const state=useNativeSelection({kind:'switch',checked,defaultChecked:checked===undefined?defaultChecked:undefined,disabled,readOnly,onCheckedChange,onClick,onKeyDown},bind);
 const tasks=React.useRef(new Set<ReturnType<typeof setTimeout>>()),revision=React.useRef(0),choiceRevision=React.useRef(0),priorProps=React.useRef({checked,disabled,readOnly}),live=React.useRef({disabled,readOnly});
 React.useLayoutEffect(()=>{const prior=priorProps.current;if(prior.checked!==checked||prior.disabled!==disabled||prior.readOnly!==readOnly)revision.current++;priorProps.current={checked,disabled,readOnly};live.current={disabled,readOnly};});
 React.useLayoutEffect(()=>{
  const doc=node.current?.ownerDocument;
  const reset=(event:Event)=>{const input=node.current;if(!input||event.target!==input.form)return;const form=input.form,ticket=choiceRevision.current;
   // Check cancellation after all reset listeners, before queued side tasks.
   queueMicrotask(()=>{if(event.defaultPrevented||node.current!==input||!input.isConnected||input.form!==form||ticket!==choiceRevision.current)return;for(const task of tasks.current)clearTimeout(task);tasks.current.clear();});
  };
  doc?.addEventListener('reset',reset,true);
  return()=>{doc?.removeEventListener('reset',reset,true);for(const timer of tasks.current)clearTimeout(timer);tasks.current.clear();};
 },[]);
 /** Let the originating button event finish bubbling before making one idempotent native proposal. */
 function choose(desired:boolean,event:React.MouseEvent<HTMLButtonElement>){
  choiceRevision.current++;
  for(const task of tasks.current)clearTimeout(task);tasks.current.clear();
  const input=node.current,ticket=revision.current,native=event.nativeEvent;
  if(event.defaultPrevented||disabled||readOnly||!input||input.matches(':disabled'))return;
  const timer=setTimeout(()=>{tasks.current.delete(timer);if(native.defaultPrevented||event.defaultPrevented||ticket!==revision.current||node.current!==input||!input.isConnected||live.current.disabled||live.current.readOnly||input.matches(':disabled'))return;if(input.checked!==desired)input.click();},0);
  tasks.current.add(timer);
 }
 const hasDescription=description!==undefined&&description!==null&&description!==false;
 const accessible=variant===15?'Toggle notifications':variant===16?'Toggle between dark and light mode':variant===17?'Toggle switch':undefined;
 const customLabel=label!==undefined&&label!==null&&label!==false;
 const small=size==='sm',w=small?24:32,h=small?14:18.4,diameter=small?12:16,travel=small?10:14,y=small?7:9.2;
 const names=labelledBy??(ariaLabel===undefined&&variant===18?leftId+' '+rightId:undefined);
 const descriptionIds=Array.from(new Set(`${describedBy??''} ${hasDescription?descriptionId:''}`.split(/\s+/).filter(Boolean))).join(' ')||undefined;
 const side=(desired:boolean,sideLabel:string,sideId:string,icon:boolean)=><button type="button" className="fr6-choice" id={sideId} aria-label={icon?sideLabel:undefined} aria-controls={id} aria-pressed={state.value.checked===desired} disabled={disabled} aria-disabled={readOnly||undefined} onClick={e=>choose(desired,e)}>{icon?<><ThemeIcon dark={desired}/><span className="fr6-sr">{sideLabel}</span></>:sideLabel}</button>;
 return <div className={`fr6-field fr6-variant${variant} ${className}`.trim()} data-component-id={`switch-${variant}`} data-state={state.value.checked?'checked':'unchecked'} data-size={size}>
  <div className="fr6-row">
   {variant===16?side(false,'Light mode',leftId,true):variant===18?side(false,'Yes',leftId,false):null}
   <span className="fr6-hit"><input {...inputProps} {...state.input} onClick={event=>{for(const task of tasks.current)clearTimeout(task);tasks.current.clear();state.input.onClick(event);}} id={id} type="checkbox" role="switch" disabled={disabled} readOnly={readOnly} aria-readonly={readOnly||undefined} aria-checked={state.value.checked} aria-label={ariaLabel??(names?undefined:accessible)} aria-labelledby={names} aria-describedby={descriptionIds}/>
    <svg className="fr6-track" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" focusable="false"><rect x=".5" y=".5" width={w-1} height={h-1} rx={h/2}/><g className="fr6-direction"><circle className="fr6-thumb" cx={1+diameter/2} cy={y} r={diameter/2-.5} transform={`translate(${state.value.checked?travel:0} 0)`}/></g></svg>
   </span>
   {variant===16?side(true,'Dark mode',rightId,true):variant===18?side(true,'No',rightId,false):null}
   {variant===15?<label className="fr6-label" htmlFor={id}>{label===undefined?(state.value.checked?'Notifications On':'Notifications Off'):label}</label>:variant===17?<label className="fr6-icon-label" htmlFor={id}><span className="fr6-sr">Toggle switch</span><ThemeIcon dark={state.value.checked}/>{customLabel&&<span>{label}</span>}</label>:customLabel?<label className="fr6-label" htmlFor={id}>{label}</label>:null}
  </div>{hasDescription&&<p className="fr6-description" id={descriptionId}>{description}</p>}
 </div>;
}
export const Switch15=React.forwardRef<HTMLInputElement,FollowToggleProps>(function Switch15(props,ref){return <Toggle variant={15} props={props} inputRef={ref}/>});
export const Switch16=React.forwardRef<HTMLInputElement,FollowToggleProps>(function Switch16(props,ref){return <Toggle variant={16} props={props} inputRef={ref}/>});
export const Switch17=React.forwardRef<HTMLInputElement,FollowToggleProps>(function Switch17(props,ref){return <Toggle variant={17} props={props} inputRef={ref}/>});
export const Switch18=React.forwardRef<HTMLInputElement,FollowToggleProps>(function Switch18(props,ref){return <Toggle variant={18} props={props} inputRef={ref}/>});
