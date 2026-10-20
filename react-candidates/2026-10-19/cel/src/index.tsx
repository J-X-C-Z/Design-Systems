'use client';

import * as React from 'react';
import type {
  Checkbox06Props, Checkbox06Snack, Switch06Props, Checkbox05Props, Switch05Props, Switch05Tone, SelectionState, CheckedChangeDetails,
  CelSelectionScopeProps,
} from './types.js';
export type {
  Checkbox06ItemProps, Checkbox06Props, Checkbox06Snack, Switch06Props, Checkbox05Props, Switch05Props, Switch05Tone, SelectionState, CheckedChangeDetails,
  CheckboxItemProps, Checkbox05Size, SwitchItemProps, SelectionProps, CelSelectionScopeProps,
} from './types.js';

export const celSelectionIds = Object.freeze(['checkbox-05', 'switch-05', 'checkbox-06', 'switch-06'] as const);
const MotionContext = React.createContext<boolean | undefined>(undefined);

/** Scopes share a listener; standalone controls also stop when hidden or reduced. */
function useMotionStop(root: React.RefObject<HTMLElement | null>): boolean {
  const inherited = React.useContext(MotionContext);
  const [systemStop, setSystemStop] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  React.useEffect(() => {
    if (inherited !== undefined) return;
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
  }, [inherited, root]);
  return inherited ?? (systemStop || hidden);
}

/** Stopping snaps decoration to the current semantic state; resuming never replays it. */
export function CelSelectionScope({
  children, mode = 'light', paused = false, reducedMotion = false, className = '', ...rest
}: CelSelectionScopeProps): React.ReactElement {
  const root = React.useRef<HTMLDivElement>(null);
  const inheritedStop = useMotionStop(root);
  const stopped = inheritedStop || paused || reducedMotion;
  return <MotionContext.Provider value={stopped}>
    <div {...rest} ref={root} className={`cel5-scope ${className}`.trim()}
      data-cel5-mode={mode} data-cel5-motion={stopped ? 'off' : 'on'}>{children}</div>
  </MotionContext.Provider>;
}

// Native transaction engine adapted from the local Line Art selection slice.
// Its browser cancellation/reset reconciliation is shared source, not shared QA credit.
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

type Visual = 'mixed' | 'checked' | 'unchecked';
interface CelFrame { tick:number; active:boolean }
/** Eighteen 24fps frames: on-2s drawing, one smear on frame 2, on-3s final hold. */
function useCelFrame(visual:Visual,stopped:boolean,root:React.RefObject<HTMLDivElement|null>):CelFrame {
 const prior=React.useRef(visual),[frame,setFrame]=React.useState<CelFrame>({tick:18,active:false});
 React.useLayoutEffect(()=>{
  const changed=prior.current!==visual;prior.current=visual;const win=root.current?.ownerDocument.defaultView;
  if(!changed||stopped||!win?.requestAnimationFrame){setFrame({tick:18,active:false});return;}
  const start=win.performance.now();let handle=0,canceled=false;
  const render=(now:number)=>{if(canceled)return;const tick=Math.min(18,Math.floor(Math.max(0,now-start)*24/1000));setFrame({tick,active:tick<18});if(tick<18)handle=win.requestAnimationFrame(render);};
  render(start);return()=>{canceled=true;win.cancelAnimationFrame(handle);};
 },[visual,stopped,root]);return frame;
}
const BOX_LINES=[
 'M1.2 1.3Q7 .4 14.5 1.2L14.8 14.5Q8 15.3 1 14.6Z',
 'M.9 1.6Q7 .7 14.8 .9L14.5 14.8Q7.7 15 1.3 14.3Z',
 'M1.5 .9Q7.5 1.3 14.3 1.4L15 14.2Q8 14.8 .9 14.9Z',
 'M1 1.1Q8 .6 14.6 1.5L14.6 14.6Q7 15.2 1.4 14.5Z',
];
const MARK_LINES=['M3.6 7.8L6.7 11.2L12.3 4.7','M3.4 8.1L6.9 10.9L12.6 4.5','M3.8 8L6.5 11.1L12.2 4.9','M3.5 7.7L6.8 11.4L12.5 4.6'];
function exposure(frame:CelFrame):number {return frame.active?Math.floor(frame.tick/(frame.tick<12?2:3))%4:0;}
function CelFX({frame}:{frame:CelFrame}):React.ReactElement|null {
 if(!frame.active)return null;
 const phase=frame.tick<2?'anticipation':frame.tick===2?'smear':frame.tick<8?'sparks':frame.tick<12?'puff':'hold';
 const paths=[
  'M13 24Q2 22 6 14Q1 5 12 6Q17 -1 22 7Q31 3 32 13Q40 20 31 24',
  'M9 25Q-1 19 5 12Q4 0 15 4Q23 -3 27 7Q39 6 35 16Q42 26 28 28',
  'M8 25Q0 20 4 15M7 7Q12 -1 19 4M27 4Q37 5 36 14M39 22Q36 30 29 28',
  'M3 20L1 17M11 2L14 1M35 8L37 11M33 29L30 30',
 ];
 return <svg className="cel5-fx" data-cel5-fx={phase} viewBox="0 0 42 32" aria-hidden="true" focusable="false">
  {phase==='smear'?<path className="cel5-smear" d="M2 18Q19 3 40 14Q28 24 2 18Z"/>:null}
  {phase==='sparks'?<path className="cel5-sparks" d={frame.tick<5?'M8 14L2 9M20 8L22 1M32 13L40 8':'M5 12L0 7M23 5L25 0M35 10L41 5'}/>:null}
  {phase==='puff'?<path className="cel5-puff" d={paths[frame.tick-8]}/>:null}
 </svg>;
}
function CheckboxCel({state,frame,pixels}:{state:Visual;frame:CelFrame;pixels:number}):React.ReactElement {
 const e=exposure(frame);
 return <svg className="cel5-checkbox-art" width={pixels} height={pixels} viewBox="0 0 16 16" data-cel5-exposure={e} aria-hidden="true" focusable="false">
  <path className="cel5-box-fill" d={BOX_LINES[e]} transform="translate(.35 -.2)"/>
  <path className="cel5-box-line" d={BOX_LINES[e]}/>
  {state==='mixed'?<path className="cel5-mark" d="M4 8H12"/>:state==='checked'?<path className="cel5-mark" d={MARK_LINES[e]}/>:null}
 </svg>;
}
function SwitchCel({small,checked,frame}:{small:boolean;checked:boolean;frame:CelFrame}):React.ReactElement {
 const w=small?24:32,h=small?14:18.4,d=small?12:16,travel=small?10:14,y=small?1:1.2,e=exposure(frame),j=[0,.18,-.15,.1][e];
 return <svg className="cel5-switch-art" width={w} height={h} viewBox={`0 0 ${w} ${h}`} data-cel5-exposure={e} aria-hidden="true" focusable="false">
  <path className="cel5-track" d={`M${h/2} .7C${w-h/2+j} .3 ${w-.5} -.1 ${w-.6} ${h/2}S${w-h/2} ${h-.5} ${h/2} ${h-.7}S.6 ${h-.2} .6 ${h/2}S3 .7 ${h/2} .7Z`}/>
  <g className="cel5-direction"><g className="cel5-thumb" transform={`translate(${1+(checked?travel:0)} ${y})`}>
   <circle className="cel5-thumb-fill" cx={d/2+.2} cy={d/2-.15} r={d/2-.7}/>
   <path className="cel5-thumb-line" d={`M${d/2} .5C${d-1+j} .3 ${d-.5} 3 ${d-.5} ${d/2}S${d-3} ${d-.5} ${d/2} ${d-.5}S.5 ${d-3} .5 ${d/2}S3 .5 ${d/2} .5Z`}/>
  </g></g>
 </svg>;
}
function MiniSwitchCel({small,checked,frame}:{small:boolean;checked:boolean;frame:CelFrame}):React.ReactElement {
 const w=small?24:32,h=small?14:12,d=small?12:18,travel=d-2,e=exposure(frame),j=[0,.18,-.15,.1][e],y=(h-d)/2;
 return <svg className="cel5-switch-art cel6-mini-art" width={w} height={h} viewBox={`0 0 ${w} ${h}`} data-cel5-exposure={e} aria-hidden="true" focusable="false">
 <path className="cel6-mini-track" d={`M${h/2} .4Q${w-1} ${-.1+j} ${w-.4} ${h/2}Q${w} ${h-.2} ${w-h/2} ${h-.4}H${h/2}Q.2 ${h} .4 ${h/2}Q0 .1 ${h/2} .4Z`}/>
 <g className="cel5-direction"><g className="cel6-mini-thumb" transform={`translate(${checked?travel:0} ${y})`}><path className="cel6-mini-fill" d={`M${d/2} .5C${d-1+j} .3 ${d-.5} 3 ${d-.5} ${d/2}S${d-3} ${d-.5} ${d/2} ${d-.5}S.5 ${d-3} .5 ${d/2}S3 .5 ${d/2} .5Z`}/></g></g></svg>;
}
interface InternalProps extends EngineProps {
 catalogId?:string;mini?:boolean;
 inputProps:Omit<React.InputHTMLAttributes<HTMLInputElement>,'size'>;inputRef:React.ForwardedRef<HTMLInputElement>;
 label?:React.ReactNode;description?:React.ReactNode;className?:string;size?:'default'|'sm';tone?:Switch05Tone;pixels?:number;
}
function NativeSelection({catalogId,mini=false,kind,inputProps,inputRef,label,description,className='',size='default',tone,pixels=16,...engine}:InternalProps):React.ReactElement {
 const generated=React.useId(),id=inputProps.id??generated,descriptionId=`${generated}-description`,root=React.useRef<HTMLDivElement>(null),stopped=useMotionStop(root);
 const state=useNativeSelection({...engine,kind},inputRef),mixed=state.value.indeterminate,visual:Visual=mixed?'mixed':state.value.checked?'checked':'unchecked',frame=useCelFrame(visual,stopped,root);
 const hasLabel=label!==null&&label!==undefined&&label!==false,hasDescription=description!==null&&description!==undefined&&description!==false;
 const describedBy=Array.from(new Set(`${inputProps['aria-describedby']??''} ${hasDescription?descriptionId:''}`.split(/\s+/).filter(Boolean))).join(' ')||undefined;
 return <div ref={root} data-catalog-id={catalogId} className={`cel5-field cel5-${kind} ${className}`.trim()} data-cel5-state={visual} data-cel5-size={size} data-cel5-pixels={pixels} data-cel5-tone={tone} data-cel5-tick={frame.tick} data-cel5-motion={stopped?'off':'on'}>
  <span className="cel5-hit"><input {...inputProps} {...state.input} id={id} type="checkbox" role={kind==='switch'?'switch':undefined} disabled={engine.disabled} readOnly={engine.readOnly} aria-readonly={engine.readOnly||undefined} aria-checked={mixed?'mixed':state.value.checked} aria-describedby={describedBy}/>
   {kind==='checkbox'?<CheckboxCel state={visual} frame={frame} pixels={pixels}/>:mini?<MiniSwitchCel small={size==='sm'} checked={state.value.checked} frame={frame}/>:<SwitchCel small={size==='sm'} checked={state.value.checked} frame={frame}/>}
   <CelFX frame={frame}/>
  </span>
  {(hasLabel||hasDescription)&&<div className="cel5-copy">{hasLabel&&<label className="cel5-label" htmlFor={id}>{label}</label>}{hasDescription&&<p id={descriptionId} className="cel5-description">{description}</p>}</div>}
 </div>;
}
const CHECKBOX05_SIZES=['default','medium','large'] as const;
const CHECKBOX05_NAMES={default:'Default checkbox size',medium:'Medium checkbox size',large:'Large checkbox size'};
const CHECKBOX05_PIXELS={default:16,medium:20,large:24};
/** The exact source is a composition of three independent checked size options. */
export function Checkbox05({items={},className='',...groupProps}:Checkbox05Props):React.ReactElement {
 return <div {...groupProps} className={`cel5-checkbox05-group ${className}`.trim()} data-catalog-id="checkbox-05">
  {CHECKBOX05_SIZES.map(key=>{
   const {ref=null,label,description,checked,defaultChecked=true,indeterminate,defaultIndeterminate=false,disabled=false,readOnly=false,onCheckedChange,onClick,onKeyDown,className:itemClass,onChange:_change,'aria-label':ariaLabel,...inputProps}=items[key]??{};
   return <NativeSelection key={key} kind="checkbox" pixels={CHECKBOX05_PIXELS[key]} inputRef={ref} label={label} description={description} className={itemClass}
    checked={checked} defaultChecked={checked===undefined?defaultChecked:undefined} indeterminate={indeterminate} defaultIndeterminate={defaultIndeterminate}
    disabled={disabled} readOnly={readOnly} onCheckedChange={onCheckedChange} onClick={onClick} onKeyDown={onKeyDown}
    inputProps={{...inputProps,'aria-label':ariaLabel??((label==null||label===false)&&!inputProps['aria-labelledby']?CHECKBOX05_NAMES[key]:undefined)}}/>;
  })}
 </div>;
}
const SWITCH05_TONES=['destructive','success','info','warning'] as const;
const SWITCH05_NAMES={destructive:'Destructive Switch',success:'Success outline Switch',info:'Info outline Switch',warning:'Warning outline Switch'};
export function Switch05({items={},className='',...groupProps}:Switch05Props):React.ReactElement {
 return <div {...groupProps} className={`cel5-switch05-group ${className}`.trim()} data-catalog-id="switch-05">
  {SWITCH05_TONES.map(tone=>{
   const {ref=null,label,description,checked,defaultChecked=true,disabled=false,readOnly=false,size='default',onCheckedChange,onClick,onKeyDown,className:itemClass,indeterminate:_mixed,defaultIndeterminate:_defaultMixed,onChange:_change,'aria-label':ariaLabel,...inputProps}=items[tone]??{};
   return <NativeSelection key={tone} tone={tone} kind="switch" inputRef={ref} label={label} description={description} className={itemClass} size={size}
    checked={checked} defaultChecked={checked===undefined?defaultChecked:undefined} disabled={disabled} readOnly={readOnly} onCheckedChange={onCheckedChange} onClick={onClick} onKeyDown={onKeyDown}
    inputProps={{...inputProps,'aria-label':ariaLabel??((label==null||label===false)&&!inputProps['aria-labelledby']?SWITCH05_NAMES[tone]:undefined)}}/>;
  })}
 </div>;
}

/** Exact06: three badge labels; Salad and Wrap selected, Juice initially unselected. */
export function Checkbox06({items={},className='',...rest}:Checkbox06Props):React.ReactElement{
 const snacks=['Salad','Wrap','Juice'] as const;
 return <div {...rest} data-catalog-id="checkbox-06" className={`cel6-snacks ${className}`.trim()}>{snacks.map(snack=>{
 const {ref=null,label=snack,description,checked,defaultChecked=snack!=='Juice',disabled=false,readOnly=false,indeterminate:_mixed,defaultIndeterminate:_defaultMixed,children:_children,onChange:_onChange,onCheckedChange,onClick,onKeyDown,className:itemClass='', 'aria-label':ariaLabel,...inputProps}=items[snack]??{};
 return <NativeSelection key={snack} catalogId="checkbox-06-item" kind="checkbox" pixels={16} inputRef={ref} label={label} description={description} className={`cel6-snack ${itemClass}`} checked={checked} defaultChecked={checked===undefined?defaultChecked:undefined} disabled={disabled} readOnly={readOnly} onCheckedChange={onCheckedChange} onClick={onClick} onKeyDown={onKeyDown} inputProps={{...inputProps,'aria-label':ariaLabel??((label==null||label===false)&&!inputProps['aria-labelledby']?snack:undefined)}}/>;
 })}</div>;
}
/** Exact06: borderless12px default track,18px overhanging thumb. */
export const Switch06=React.forwardRef<HTMLInputElement,Switch06Props>(function Switch06({label,description,checked,defaultChecked=false,disabled=false,readOnly=false,size='default',indeterminate:_mixed,defaultIndeterminate:_defaultMixed,children:_children,onChange:_onChange,onCheckedChange,onClick,onKeyDown,className,'aria-label':ariaLabel,...inputProps},ref){
 return <NativeSelection catalogId="switch-06" mini kind="switch" inputRef={ref} label={label} description={description} className={className} size={size} checked={checked} defaultChecked={checked===undefined?defaultChecked:undefined} disabled={disabled} readOnly={readOnly} onCheckedChange={onCheckedChange} onClick={onClick} onKeyDown={onKeyDown} inputProps={{...inputProps,'aria-label':ariaLabel??((label==null||label===false)&&!inputProps['aria-labelledby']?'mini switch':undefined)}}/>;
});
