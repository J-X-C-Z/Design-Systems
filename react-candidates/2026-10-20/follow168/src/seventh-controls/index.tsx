'use client';
import * as React from 'react';
import type { FollowTextareaProps, BreadcrumbSegment, Breadcrumb02Props, PageChangeDetails, Pagination02Props } from './types.js';
export type {
  FollowTextareaProps, Textarea03Props, Textarea04Props,
  BreadcrumbSegment, FollowBreadcrumbSegment, Breadcrumb02Props, FollowBreadcrumbProps,
  PageChangeDetails, FollowPageChangeDetails, Pagination02Props, FollowPaginationProps,
} from './types.js';

const classes = (...values: (string | undefined | false)[]) => values.filter(Boolean).join(' ');
function describedBy(external: string | undefined, internal: string | undefined) {
  return [...new Set([external, internal].filter(Boolean).join(' ').split(/\s+/).filter(Boolean))].join(' ') || undefined;
}
function textarea(variant: '03' | '04') {
  const Component = React.forwardRef<HTMLTextAreaElement, FollowTextareaProps>((props, ref) => {
    const generatedId = React.useId();
    const {
      id = `fr7c-textarea-${generatedId}`, label = variant === '03' ? 'Add details' : 'Issue description',
      description = variant === '03' ? 'This helps us understand your input better.' : undefined,
      placeholder = variant === '03' ? 'Write your response...' : "Describe the issue you're facing...",
      required = variant === '04', className, wrapperClassName, 'aria-describedby': externalDescription,
      children: _children, dangerouslySetInnerHTML: _html, onValueChange: _valueChange, ...native
    } = props;
    if (native.value !== undefined && native.defaultValue !== undefined) {
      throw new TypeError(`Textarea${variant}: value and defaultValue are mutually exclusive.`);
    }
    const hasDescription = description !== undefined && description !== null && description !== false;
    const descriptionId = hasDescription ? `${id}-description` : undefined;
    return <div className={classes('fr7c-textarea-field', `fr7c-textarea${variant}`, wrapperClassName)} data-component={`textarea-${variant}`}>
      {label !== null && label !== false && <label className="fr7c-label" htmlFor={id}>{label}{required && <span className="fr7c-required" aria-hidden="true"> *</span>}</label>}
      <textarea {...native} ref={ref} id={id} required={required} placeholder={placeholder}
        aria-describedby={describedBy(externalDescription, descriptionId)}
        className={classes('fr7c-textarea', className)} data-slot="textarea" />
      {hasDescription && <p id={descriptionId} className="fr7c-description">{description}</p>}
    </div>;
  });
  Component.displayName = `Textarea${variant}`;
  return Component;
}
export const Textarea03 = textarea('03');
export const Textarea04 = textarea('04');

const originalSegments: readonly BreadcrumbSegment[] = [
  { label: 'Portal', href: '#' }, { label: 'Orders', href: '#' }, { label: 'Shipment Status', current: true },
];
function PortalSymbol() {
  return <svg className="fr7c-portal-symbol" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path d="M2 2h4v4H2zM10 2h4v4h-4zM2 10h4v4H2zM10 10h4v4h-4z" />
  </svg>;
}
export const Breadcrumb02 = React.forwardRef<HTMLElement, Breadcrumb02Props>(({
  segments = originalSegments, className, children: _children, dangerouslySetInnerHTML: _html,
  'aria-label': ariaLabel = 'breadcrumb', ...nav
}, ref) => <nav {...nav} ref={ref} aria-label={ariaLabel} className={classes('fr7c-breadcrumb', className)} data-component="breadcrumb-02" data-slot="breadcrumb">
  <ol className="fr7c-breadcrumb-list" data-slot="breadcrumb-list">
    {segments.map((segment, index) => {
      const { label, current, ...attributes } = segment;
      return <li key={index} className="fr7c-breadcrumb-item" data-slot="breadcrumb-item">
        {index > 0 && <span className="fr7c-breadcrumb-separator" aria-hidden="true" data-slot="breadcrumb-separator">/</span>}
        {current ? <span className={classes('fr7c-breadcrumb-current', segment.className)} id={segment.id} title={segment.title}
          aria-current="page" data-slot="breadcrumb-page">{label}</span>
          : <a {...attributes as React.ComponentPropsWithRef<'a'>} href={segment.href}
            className={classes('fr7c-breadcrumb-link', index === 0 && 'fr7c-breadcrumb-home', segment.className)} data-slot="breadcrumb-link">
            {index === 0 && <PortalSymbol />}{label}
          </a>}
      </li>;
    })}
  </ol>
</nav>);
Breadcrumb02.displayName = 'Breadcrumb02';

function positiveCount(value: number) {
  if (!Number.isSafeInteger(value) || value < 1) throw new RangeError('Pagination02: pageCount must be a positive safe integer.');
  return value;
}
function clampPage(value: number, count: number) {
  if (!Number.isSafeInteger(value)) throw new RangeError('Pagination02: page/defaultPage must be a safe integer.');
  return Math.min(count, Math.max(1, value));
}
function Chevron({ direction }: { direction: 'previous' | 'next' }) {
  return <svg className="fr7c-chevron" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
    <path d={direction === 'previous' ? 'M12.5 4.5 7 10l5.5 5.5' : 'M7.5 4.5 13 10l-5.5 5.5'} />
  </svg>;
}
export const Pagination02 = React.forwardRef<HTMLElement, Pagination02Props>((props, ref) => {
  const {
  page, defaultPage = 2, pageCount = 3, getPageHref = () => '#', disabled = false, onPageChange,
  className, children: _children, dangerouslySetInnerHTML: _html, 'aria-label': ariaLabel = 'pagination', ...nav
  } = props;
  if (page !== undefined && props.defaultPage !== undefined) {
    throw new TypeError('Pagination02: page and defaultPage are mutually exclusive.');
  }
  const count = positiveCount(pageCount);
  const controlled = page !== undefined;
  const [innerPage, setInnerPage] = React.useState(() => clampPage(defaultPage, count));
  const currentPage = clampPage(controlled ? page : innerPage, count);
  const active = React.useRef(false);
  const serial = React.useRef(0);
  const owner = React.useRef({ controlled, currentPage, count, disabled });
  React.useLayoutEffect(() => {
    const previous = owner.current;
    if (previous.controlled !== controlled || previous.currentPage !== currentPage || previous.count !== count || previous.disabled !== disabled) serial.current++;
    owner.current = { controlled, currentPage, count, disabled };
    // A shrinking range stays clamped if the range later expands.
    if (!controlled && innerPage !== currentPage) setInnerPage(currentPage);
  });
  React.useLayoutEffect(() => {
    active.current = true;
    return () => { active.current = false; serial.current++; };
  }, []);

  const propose = (nextPage: number, blocked: boolean, event: React.MouseEvent<HTMLAnchorElement>) => {
    if (blocked) { event.preventDefault(); return; }
    // Keep browser new-tab/window/download gestures entirely native.
    if (event.defaultPrevented || event.nativeEvent.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    const ticket = ++serial.current;
    if (nextPage === currentPage) return;
    const anchor = event.currentTarget;
    let canceled = false;
    let open = true;
    const details: PageChangeDetails = {
      event, previousPage: currentPage, page: nextPage,
      get canceled() { return canceled || event.defaultPrevented || event.nativeEvent.defaultPrevented; },
      cancel() { if (open) { canceled = true; event.preventDefault(); } },
    };
    try { onPageChange?.(nextPage, details); }
    catch (error) { details.cancel(); throw error; }
    finally { open = false; }
    // This is only a local-state commit. Navigation is never delayed, reissued, or synthesized.
    queueMicrotask(() => {
      const latest = owner.current;
      if (!active.current || ticket !== serial.current || !anchor.isConnected || details.canceled || latest.disabled || latest.controlled) return;
      if (latest.currentPage !== currentPage || latest.count !== count) return;
      setInnerPage(nextPage);
    });
  };
  const link = (target: number, kind: 'previous' | 'page' | 'next') => {
    const blocked = disabled || target < 1 || target > count;
    const activePage = kind === 'page' && target === currentPage;
    return <li key={kind === 'page' ? target : kind} className="fr7c-pagination-item" data-slot="pagination-item">
      <a href={blocked ? undefined : getPageHref(target)} aria-label={kind === 'previous' ? 'Previous' : kind === 'next' ? 'Next' : undefined}
        aria-current={activePage ? 'page' : undefined} aria-disabled={blocked || undefined} role={blocked ? 'link' : undefined} tabIndex={blocked ? -1 : undefined}
        className={classes('fr7c-page-link', kind !== 'page' && 'fr7c-page-direction')} data-slot="pagination-link"
        data-active={activePage} data-page={target} data-kind={kind} onClick={event => propose(target, blocked, event)}>
        {kind === 'page' ? target : <Chevron direction={kind} />}
      </a>
    </li>;
  };
  return <nav {...nav} ref={ref} aria-label={ariaLabel} className={classes('fr7c-pagination', className)} data-component="pagination-02"
    data-slot="pagination" data-page={currentPage} aria-disabled={disabled || undefined}>
    <ul className="fr7c-pagination-list" data-slot="pagination-content">
      {link(currentPage - 1, 'previous')}
      {Array.from({ length: count }, (_, index) => link(index + 1, 'page'))}
      {link(currentPage + 1, 'next')}
    </ul>
  </nav>;
});
Pagination02.displayName = 'Pagination02';
