import React, {createContext, forwardRef, useCallback, useContext, useEffect, useId, useLayoutEffect, useMemo, useRef, useState} from 'react';

function Arrow({left = false}) {
  return <svg className="fvx-arrow" aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="20" height="20"><path d={left ? 'M19 12H5m6-6-6 6 6 6' : 'M5 12h14m-6-6 6 6-6 6'} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function Ban() {
  return <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2"/><path d="m6 6 12 12" stroke="currentColor" strokeWidth="2"/></svg>;
}
const MotionGroup = createContext(null);
function useMotionGroup(reduced=false) {
  const latestReduced = useRef(reduced);
  useLayoutEffect(()=>{latestReduced.current=reduced;},[reduced]);
  const [pulse, setPulse] = useState({id:null, sequence:0});
  const request = useCallback(id=>{if(!latestReduced.current)setPulse(old=>({id,sequence:old.sequence+1}));},[]);
  const cancel = useCallback(id=>setPulse(old=>id === undefined || old.id === id ? {...old,id:null} : old),[]);
  return useMemo(()=>({pulse,request,cancel}),[pulse,request,cancel]);
}
const Pair = forwardRef(function Pair({children, ...props}, ref) {
  const parent = useContext(MotionGroup), local = useMotionGroup();
  return <MotionGroup.Provider value={parent || local}><div {...props} ref={ref}>{children}</div></MotionGroup.Provider>;
});
const cx = (...xs) => xs.filter(Boolean).join(' ');

// React owns the actual button node. No key interception, DOM mount or delegated handler.
const Action = forwardRef(function Action({tone='primary', fixedDisabled=false, iconBefore, iconAfter, children, className, disabled, onClick, type='button', ...native}, ref) {
  const [localPulse, setPulse] = useState(0), id = useId(), group = useContext(MotionGroup);
  const pulse = group ? (group.pulse.id === id ? group.pulse.sequence : 0) : localPulse;
  const blocked = fixedDisabled || disabled || native['aria-disabled'] === true || native['aria-disabled'] === 'true';
  useEffect(()=>{ if (blocked) { setPulse(0); group?.cancel(id); } },[blocked,id,group?.cancel]);
  return <button {...native} ref={ref} type={type} disabled={fixedDisabled || disabled} className={cx('fvx-button', `fvx-${tone}`, className)} onClick={event => {
    if (blocked) { event.preventDefault(); return; }
    onClick?.(event);
    const button = event.currentTarget;
    const nowBlocked = button.disabled || button.getAttribute('aria-disabled') === 'true' || !button.isConnected;
    if (!event.defaultPrevented && !nowBlocked && !group?.reduced && !native['data-static-arrow']) { if (group) group.request(id); else setPulse(value => value + 1); }
  }}><span className={cx('fvx-face', !blocked && pulse > 0 && (pulse % 2 ? 'fvx-pulse-a' : 'fvx-pulse-b'))}>{iconBefore}<span className="fvx-label">{children}</span>{iconAfter}</span></button>;
});

export function FlatActionScope({children, mode='light', reducedMotion=false, className, ...container}) {
  const [systemReduce,setSystemReduce] = useState(false);
  const group = useMotionGroup(reducedMotion || systemReduce);
  useEffect(()=>{
    const query = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!query) return;
    const change=()=>{setSystemReduce(query.matches); if(query.matches) group.cancel();};
    change(); query.addEventListener?.('change',change);
    return ()=>query.removeEventListener?.('change',change);
  },[group.cancel]);
  useEffect(()=>{if(reducedMotion)group.cancel();},[reducedMotion,group.cancel]);
  const context = useMemo(()=>({...group,reduced:reducedMotion || systemReduce}),[group,reducedMotion,systemReduce]);
  return <MotionGroup.Provider value={context}><div {...container} className={cx('fvx-actions', className)} data-mode={mode} data-motion={reducedMotion || systemReduce ? 'reduce' : 'normal'}>{children}</div></MotionGroup.Provider>;
}

// button-02: two independent outline actions, with directional decorative icons.
export const FlatButton02 = forwardRef(function FlatButton02({previousLabel='Prev', nextLabel='Next', previousProps={}, nextProps={}, className, ...container}, ref) {
  return <Pair {...container} ref={ref} className={cx('fvx-pair', className)} data-canonical-id="button-02">
    <Action {...previousProps} tone="outline" iconBefore={<Arrow left/>}>{previousLabel}</Action>
    <Action {...nextProps} tone="outline" iconAfter={<Arrow/>}>{nextLabel}</Action>
  </Pair>;
});

// button-03: secondary Discard and primary Save remain separate native actions.
export const FlatButton03 = forwardRef(function FlatButton03({discardLabel='Discard', saveLabel='Save', discardProps={}, saveProps={}, className, ...container}, ref) {
  return <Pair {...container} ref={ref} className={cx('fvx-pair', className)} data-canonical-id="button-03">
    <Action {...discardProps} tone="secondary">{discardLabel}</Action>
    <Action {...saveProps} tone="primary">{saveLabel}</Action>
  </Pair>;
});

// button-04: the original 200ms +4px/1.1 trailing-arrow feedback is retained.
export const FlatButton04 = forwardRef(function FlatButton04({children='Explore More', className, ...native}, ref) {
  return <Action {...native} ref={ref} className={cx('fvx-explore', className)} iconAfter={<Arrow/>} data-static-arrow="true" data-canonical-id="button-04">{children}</Action>;
});

// button-05 is a permanently disabled sample, not a switchable disabled controller.
export const FlatButton05 = forwardRef(function FlatButton05({children='Disabled', className, ...native}, ref) {
  return <Action {...native} ref={ref} fixedDisabled className={className} iconBefore={<Ban/>} data-canonical-id="button-05">{children}</Action>;
});
export const flatActionIds = Object.freeze(['button-02','button-03','button-04','button-05']);
