'use client';
import * as React from 'react';
import type { Textarea02Props } from './textarea-types.js';
export type { Textarea02Props } from './textarea-types.js';

const asText = (value: Textarea02Props['value']) => value == null ? '' : String(value);

/**
 * Native text-entry behavior, including a real label, form association and ref.
 * An onChange proposal can be rejected synchronously in this component's own
 * callback (or an earlier capture handler) with event.preventDefault(). A later
 * ancestor bubble handler cannot retroactively reject that accepted proposal.
 * Controlled values always belong to the parent and take precedence over a
 * simultaneous defaultValue; reset emits no change event.
 */
export const Textarea02 = React.forwardRef<HTMLTextAreaElement, Textarea02Props>(
  function Textarea02({
    label='Your input', description, error, id, className = '', placeholder = 'Share your thoughts...', value, defaultValue, reducedMotion = false,
    onFocus, onBlur, onChange, children: _children, ...native
  }, forwardedRef) {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const inputRef = React.useRef<HTMLTextAreaElement>(null);
    const controlled = value != null;
    const [focused, setFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(asText(value ?? defaultValue) !== '');
    const sequence = React.useRef(0);
    const accepted = React.useRef({ order: 0, value: asText(value ?? defaultValue) });
    const ownerVersion = React.useRef(0);
    const owner = React.useRef({ controlled, value });
    const initialized = React.useRef(false);
    const mounted = React.useRef(false);
    const timers = React.useRef(new Set<ReturnType<typeof setTimeout>>());

    React.useImperativeHandle(forwardedRef, () => inputRef.current!, []);

    const syncLabel = (input: HTMLTextAreaElement) => {
      if (mounted.current) setHasValue(input.value !== '');
    };
    const restore = (input: HTMLTextAreaElement) => {
      const next = owner.current.controlled ? asText(owner.current.value) : accepted.current.value;
      // Avoid an unnecessary write so native selection/caret stays untouched.
      if (input.value !== next) input.value = next;
      syncLabel(input);
    };

    React.useLayoutEffect(() => {
      const input = inputRef.current;
      if (!input) return;
      const ownerChanged = owner.current.controlled !== controlled || owner.current.value !== value;
      owner.current = { controlled, value };
      if (ownerChanged) ownerVersion.current++;
      if (!initialized.current || ownerChanged) {
        accepted.current = { order: ++sequence.current, value: input.value };
        initialized.current = true;
      }
      // Read the native value after React and the browser sanitize it (e.g. number).
      setHasValue(input.value !== '');
    });

    React.useLayoutEffect(() => {
      mounted.current = true;
      const input = inputRef.current;
      if (!input) return;
      const doc = input.ownerDocument;
      const onReset = (event: Event) => {
        const form = input.form;
        if (!form || event.target !== form) return;
        // Reserve order before consumer reset listeners run. A canceled edit does
        // not advance accepted order; an edit accepted later beats an older reset.
        const order = ++sequence.current;
        const ownerTicket = ownerVersion.current;
        const timer = setTimeout(() => {
          timers.current.delete(timer);
          if (!mounted.current || inputRef.current !== input || !input.isConnected || input.form !== form) return;
          if (!event.defaultPrevented && !owner.current.controlled &&
              ownerTicket === ownerVersion.current && order > accepted.current.order) {
            // The native defaultValue is authoritative, including parent updates.
            input.value = input.defaultValue;
            accepted.current = { order, value: input.value };
          }
          restore(input);
        }, 0);
        timers.current.add(timer);
      };
      doc.addEventListener('reset', onReset, true);
      return () => {
        mounted.current = false;
        doc.removeEventListener('reset', onReset, true);
        for (const timer of timers.current) clearTimeout(timer);
        timers.current.clear();
      };
    }, []);

    const hasDescription=description!=null&&description!==false,hasError=error!=null&&error!==false;
    const described=Array.from(new Set([native['aria-describedby'],hasDescription?generatedId+'-help':undefined,hasError?generatedId+'-error':undefined].filter(Boolean))).join(' ')||undefined;
    return (
      <div className={`flatvector-editor-textarea ${className}`.trim()} data-catalog-id="textarea-02"
        data-filled={hasValue ? 'true' : 'false'} data-focused={focused ? 'true' : 'false'}
        data-disabled={native.disabled ? 'true' : 'false'} data-motion={reducedMotion ? 'off' : 'on'}>
        {label!=null&&label!==false&&<label htmlFor={inputId}>{label}</label>}
        <textarea {...native} ref={inputRef} id={inputId} aria-label={native['aria-label']??(label==null&&!native['aria-labelledby']?'Your input':undefined)} aria-describedby={described} aria-invalid={hasError?true:native['aria-invalid']}
          placeholder={placeholder} value={value} defaultValue={controlled ? undefined : defaultValue}
          onFocus={event => {
            setFocused(true);
            syncLabel(event.currentTarget);
            onFocus?.(event);
          }}
          onBlur={event => {
            setFocused(false);
            syncLabel(event.currentTarget);
            onBlur?.(event);
          }}
          onChange={event => {
            const input = event.currentTarget;
            const order = ++sequence.current;
            const ownerTicket = ownerVersion.current;
            const proposal = input.value;
            if (native.disabled || native.readOnly || input.matches(':disabled')) {
              event.preventDefault();
              restore(input);
              return;
            }
            try {
              onChange?.(event);
            } catch (error) {
              restore(input);
              throw error;
            }
            if (!mounted.current || inputRef.current !== input) return;
            if (!event.defaultPrevented && ownerTicket === ownerVersion.current &&
                !owner.current.controlled && order > accepted.current.order) {
              accepted.current = { order, value: proposal };
            }
            // React restores a controlled input after event dispatch. Leaving an
            // accepted proposal alone here preserves its native caret/selection.
            if (!owner.current.controlled || event.defaultPrevented) restore(input);
          }}
        />
        {hasDescription&&<p id={generatedId+'-help'} className="flatvector-editor-help">{description}</p>}
        {hasError&&<p id={generatedId+'-error'} className="flatvector-editor-error">{error}</p>}
      </div>
    );
  }
);
