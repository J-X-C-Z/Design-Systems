import React, { forwardRef, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';

const classes = (...values) => values.filter(Boolean).join(' ');
const canceled = event => event.defaultPrevented || event.nativeEvent.defaultPrevented;

// Wait for both React and native bubbling, and the button's native form action.
// An ancestor can veto the click without the alert disappearing beforehand.
function useAlertOpen({ id, open, defaultOpen, disabled, onOpenChange }) {
  if (open !== undefined && defaultOpen !== undefined) throw new TypeError(`${id}: open/defaultOpen are mutually exclusive`);
  const controlled = open !== undefined;
  const [stored, setStored] = useState(defaultOpen ?? true);
  const visible = controlled ? open : stored;
  const mounted = useRef(false), serial = useRef(0), owner = useRef(null);
  useLayoutEffect(() => {
    const previous = owner.current;
    if (previous && (previous.controlled !== controlled || previous.visible !== visible || previous.disabled !== disabled)) serial.current++;
    owner.current = { controlled, visible, disabled, onOpenChange };
  });
  useLayoutEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; serial.current++; };
  }, []);
  function close(event) {
    const button = event.currentTarget;
    const ticket = ++serial.current;
    queueMicrotask(() => {
      const current = owner.current;
      if (!mounted.current || ticket !== serial.current || !current.visible || current.disabled || !button.isConnected || button.matches(':disabled') || canceled(event)) return;
      let vetoed = false;
      const detail = {
        id, reason: 'close', event, button, localOnly: true,
        cancel() { vetoed = true; }
      };
      const result = current.onOpenChange?.(false, detail);
      if (result === false || vetoed || canceled(event) || !mounted.current || ticket !== serial.current || !button.isConnected || button.matches(':disabled')) return;
      const latest = owner.current;
      if (!current.controlled && !latest.controlled && latest.visible && !latest.disabled) setStored(false);
    });
  }
  return { visible, close };
}

function ActionButton({ buttonProps = {}, disabled, fixedDisabled = false, className, action, children, onClick }) {
  const { children: _children, dangerouslySetInnerHTML: _html, className: suppliedClass, disabled: suppliedDisabled, onClick: suppliedClick, ...native } = buttonProps;
  return <button
    {...native}
    disabled={!!disabled || fixedDisabled || !!suppliedDisabled}
    className={classes('fr14-button', className, suppliedClass)}
    data-slot="button"
    data-action={action}
    onClick={event => { suppliedClick?.(event); onClick?.(event); }}
  >{children}</button>;
}
function CloseIcon() {
  return <><svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="m5 5 10 10M15 5 5 15" /></svg><span className="fr14-sr-only">Close</span></>;
}
function UploadIcon() {
  return <svg className="fr14-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 16V3m-5 5 5-5 5 5M4 15v6h16v-6" /></svg>;
}
function UpdateIcon() {
  return <svg className="fr14-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9" /><path d="M12 7v6m0 3v.5" /></svg>;
}
function progressValue(value) {
  if (value !== undefined && (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 100)) throw new RangeError('Alerts07: progress must be a finite number from 0 to 100');
  return value;
}

export const Alerts07 = forwardRef(function Alerts07({
  open, defaultOpen, onOpenChange, disabled = false, progress,
  cancelButtonProps, uploadAnotherButtonProps, closeButtonProps,
  className, children: _children, dangerouslySetInnerHTML: _html, ...native
}, ref) {
  progressValue(progress);
  const state = useAlertOpen({ id: 'alerts-07', open, defaultOpen, disabled, onOpenChange });
  const [demoProgress, setDemoProgress] = useState(0);
  const uid = useId(), titleId = `fr14-upload-title-${uid}`, descriptionId = `fr14-upload-description-${uid}`;
  // Source demo: one bounded mount timer. Hiding/reopening never starts an upload.
  // A supplied progress value only overrides the display, not this demo timeline.
  useEffect(() => {
    const timer = setTimeout(() => setDemoProgress(50), 100);
    return () => clearTimeout(timer);
  }, []);
  const value = progress ?? demoProgress;
  if (!state.visible) return null;
  return <div {...native} ref={ref} role="alert" aria-labelledby={native['aria-labelledby'] ?? titleId} aria-describedby={native['aria-describedby'] ?? descriptionId} className={classes('fr14-alert', 'fr14-upload-alert', className)} data-component-id="alerts-07" data-slot="alert" data-disabled={disabled || undefined}>
    <UploadIcon />
    <div className="fr14-content">
      <div className="fr14-copy">
        <div id={titleId} className="fr14-title" data-slot="alert-title">Uploading your 'watermelon.png'</div>
        <div id={descriptionId} className="fr14-description" data-slot="alert-description">Please wait While we upload your image.</div>
      </div>
      <div className="fr14-progress" data-slot="progress" role="progressbar" aria-label="Upload Progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
        <div className="fr14-progress-indicator" data-slot="progress-indicator" style={{ transform: `translateX(-${100 - value}%)` }} />
      </div>
      <div className="fr14-actions">
        <ActionButton buttonProps={cancelButtonProps} disabled={disabled} action="cancel">Cancel</ActionButton>
        <ActionButton buttonProps={uploadAnotherButtonProps} disabled={disabled} fixedDisabled action="upload-another" className="fr14-upload-another">Upload another</ActionButton>
      </div>
    </div>
    <ActionButton buttonProps={closeButtonProps} disabled={disabled} action="close" className="fr14-close" onClick={state.close}><CloseIcon /></ActionButton>
  </div>;
});

export const Alerts08 = forwardRef(function Alerts08({
  open, defaultOpen, onOpenChange, disabled = false,
  laterButtonProps, updateNowButtonProps, closeButtonProps,
  className, children: _children, dangerouslySetInnerHTML: _html, ...native
}, ref) {
  const state = useAlertOpen({ id: 'alerts-08', open, defaultOpen, disabled, onOpenChange });
  const uid = useId(), titleId = `fr14-update-title-${uid}`, descriptionId = `fr14-update-description-${uid}`;
  if (!state.visible) return null;
  return <div {...native} ref={ref} role="alert" aria-labelledby={native['aria-labelledby'] ?? titleId} aria-describedby={native['aria-describedby'] ?? descriptionId} className={classes('fr14-alert', 'fr14-update-alert', className)} data-component-id="alerts-08" data-slot="alert" data-disabled={disabled || undefined}>
    <UpdateIcon />
    <div className="fr14-content">
      <div className="fr14-copy">
        <div id={titleId} className="fr14-title" data-slot="alert-title">Update ready to install</div>
        <div id={descriptionId} className="fr14-description" data-slot="alert-description">A new version is available with performance improvements and a refreshed dashboard experience.</div>
      </div>
      <div className="fr14-actions">
        <ActionButton buttonProps={laterButtonProps} disabled={disabled} action="later" className="fr14-later">Later</ActionButton>
        <ActionButton buttonProps={updateNowButtonProps} disabled={disabled} action="update-now" className="fr14-update-now">Update now</ActionButton>
      </div>
    </div>
    <ActionButton buttonProps={closeButtonProps} disabled={disabled} action="close" className="fr14-close" onClick={state.close}><CloseIcon /></ActionButton>
  </div>;
});
