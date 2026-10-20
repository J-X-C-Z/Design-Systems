'use client';

import * as React from 'react';
import type { Accordion02Item, Accordion02Props, Accordion02ChangeDetails } from './accordion-types.js';
export type { Accordion02Item, Accordion02Props, Accordion02ChangeDetails } from './accordion-types.js';

/** Exact catalog copy from Watermelon accordion/variant-2.tsx (MIT). */
const DEFAULT_ITEMS: readonly Accordion02Item[] = [
  {
    value: 'item-1',
    title: 'How secure is my data?',
    content: 'We use industry-standard encryption and secure infrastructure to protect your data at every step. Your information is never shared without your consent.',
  },
  {
    value: 'item-2',
    title: 'How do transactions work?',
    content: 'Transactions are processed instantly and reflected in your account in real time. You can view detailed history and insights anytime.',
  },
  {
    value: 'item-3',
    title: 'Can I manage everything in one place?',
    content: 'Yes - track activity, manage settings, and control your account from a single, unified dashboard designed for clarity and speed.',
  },
];

function normalize(values: readonly string[]): string[] {
  return [...new Set(values)];
}

/**
 * Semantic multiple-open FAQ with one finite 800ms disclosure turn per toggle.
 * State is keyed by item.value, never by presentation order. Unknown state keys
 * remain in callbacks, enabling temporarily absent items to return still open.
 */
export const Accordion02 = React.forwardRef<HTMLDivElement, Accordion02Props>(function Accordion02({
  items = DEFAULT_ITEMS,
  value,
  defaultValue,
  disabled = false,
  reducedMotion = false,
  onValueChange,
  className = '',
  onKeyDown,
  children: _children,
  ...native
}, forwardedRef) {
  const base = React.useId();
  const root = React.useRef<HTMLDivElement>(null);
  const [inner, setInner] = React.useState<readonly string[]>(() =>
    normalize(defaultValue ?? (items[0] ? [items[0].value] : [])));
  const innerRef = React.useRef(inner);
  innerRef.current = inner;
  const [environmentStopped, setEnvironmentStopped] = React.useState(false);
  React.useImperativeHandle(forwardedRef, () => root.current!, []);

  React.useEffect(() => {
    const doc = root.current?.ownerDocument;
    const media = doc?.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!doc) return;
    const update = () => setEnvironmentStopped(Boolean(media?.matches || doc.visibilityState === 'hidden'));
    update();
    media?.addEventListener?.('change', update);
    doc.addEventListener('visibilitychange', update);
    return () => {
      media?.removeEventListener?.('change', update);
      doc.removeEventListener('visibilitychange', update);
    };
  }, []);

  if (new Set(items.map(item => item.value)).size !== items.length) {
    throw new Error('Accordion02 item values must be unique.');
  }
  const controlled = value !== undefined;
  const open = normalize(controlled ? value : inner);

  const change = (item: Accordion02Item, event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || item.disabled || event.defaultPrevented) return;
    const previous = normalize(controlled ? value : innerRef.current);
    const next = previous.includes(item.value)
      ? previous.filter(key => key !== item.value)
      : [...previous, item.value];
    let canceled = false;
    const details: Accordion02ChangeDetails = {
      event,
      previousValue: Object.freeze(previous),
      cancel() { canceled = true; event.preventDefault(); },
      get canceled() { return canceled || event.defaultPrevented; },
    };
    // The callback receives its own proposal; mutating it cannot corrupt internal state.
    onValueChange?.([...next], details);
    if (!details.canceled && !controlled) {
      innerRef.current = next;
      setInner(next);
    }
  };

  const keyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const buttons = Array.from(root.current?.querySelectorAll<HTMLButtonElement>(
      ':scope > .aurora-editor-accordion-card > h3 > button:not(:disabled)',
    ) ?? []);
    const index = buttons.indexOf(event.target as HTMLButtonElement);
    if (index < 0) return;
    let next: number | undefined;
    if (event.key === 'ArrowDown') next = (index + 1) % buttons.length;
    else if (event.key === 'ArrowUp') next = (index + buttons.length - 1) % buttons.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = buttons.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      buttons[next]?.focus();
    }
  };

  return <div {...native} ref={root} className={`aurora-editor-accordion ${className}`.trim()}
    data-catalog-id="accordion-02" data-motion={reducedMotion || environmentStopped ? 'off' : 'on'}
    onKeyDown={keyDown}>
    {items.map((item, index) => {
      const expanded = open.includes(item.value);
      const triggerId = `${base}-trigger-${index}`;
      const panelId = `${base}-panel-${index}`;
      return <section key={item.value} className="aurora-editor-accordion-card"
        data-state={expanded ? 'open' : 'closed'} data-geometry={index % 3}>
        <h3 className="aurora-editor-accordion-heading">
          <button type="button" id={triggerId} className="aurora-editor-accordion-trigger"
            aria-expanded={expanded} aria-controls={panelId} disabled={disabled || item.disabled}
            onClick={event => change(item, event)}>
            <span aria-hidden="true" className="aurora-editor-accordion-number">{String(index + 1).padStart(2, '0')}</span>
            <span className="aurora-editor-accordion-title">{item.title}</span>
            <span aria-hidden="true" className="aurora-editor-accordion-art">
              <span className="aurora-editor-accordion-axis" />
              <span className="aurora-editor-accordion-shape" />
            </span>
          </button>
        </h3>
        <div id={panelId} role="region" aria-labelledby={triggerId} hidden={!expanded}
          className="aurora-editor-accordion-panel">{item.content}</div>
      </section>;
    })}
  </div>;
});
