import * as React from 'react';
import type {Pagination05Props,Pagination05ChangeDetails} from './index.js';
const classes=(...values:(string|undefined|false)[])=>values.filter(Boolean).join(' ');
function positiveCount(value: number) {
  if (!Number.isSafeInteger(value) || value < 1 || value > 1000) throw new RangeError('Pagination05: pageCount must be an integer from 1 to 1000.');
  return value;
}
function clampPage(value: number, count: number) {
  if (!Number.isSafeInteger(value)) throw new RangeError('Pagination05: page/defaultPage must be a safe integer.');
  return Math.min(count, Math.max(1, value));
}
function Chevron({ direction }: { direction: 'previous' | 'next' }) {
  return <svg className="fr12-chevron" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
    <path d={direction === 'previous' ? 'M12.5 4.5 7 10l5.5 5.5' : 'M7.5 4.5 13 10l-5.5 5.5'} />
  </svg>;
}
export const Pagination05 = React.forwardRef<HTMLElement, Pagination05Props>((props, ref) => {
  const {
  page, defaultPage = 2, pageCount = 3, getPageHref = (page: number,kind: string) => kind==='page'?`#${page}`:'#', disabled = false, onPageChange,
  className, children: _children, dangerouslySetInnerHTML: _html, 'aria-label': ariaLabel = 'pagination', ...nav
  } = props;
  if (page !== undefined && props.defaultPage !== undefined) {
    throw new TypeError('Pagination05: page and defaultPage are mutually exclusive.');
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
    const details: Pagination05ChangeDetails = {
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
    return <li key={kind === 'page' ? target : kind} className="fr12-pagination-item" data-slot="pagination-item">
      <a href={blocked ? undefined : getPageHref(target,kind)} aria-label={kind === 'previous' ? 'Go to previous page' : kind === 'next' ? 'Go to next page' : undefined}
        aria-current={activePage ? 'page' : undefined} aria-disabled={blocked || undefined} role={blocked ? 'link' : undefined} tabIndex={blocked ? -1 : undefined}
        className={classes('fr12-page-link', kind !== 'page' && 'fr12-page-direction')} data-slot="pagination-link"
        data-active={activePage} data-page={target} data-kind={kind} onClick={event => propose(target, blocked, event)}>
        {kind === 'page' ? target : kind==='previous'?<><Chevron direction={kind}/><span className="fr12-direction-label">Prev</span></>:<><span className="fr12-direction-label">Next</span><Chevron direction={kind}/></>}
      </a>
    </li>;
  };
  return <nav {...nav} ref={ref} aria-label={ariaLabel} className={classes('fr12-pagination', className)} data-component="pagination-05"
    data-slot="pagination" data-page={currentPage} aria-disabled={disabled || undefined}>
    <ul className="fr12-pagination-list" data-slot="pagination-content">
      {link(currentPage - 1, 'previous')}
      {Array.from({ length: count }, (_, index) => link(index + 1, 'page'))}
      {link(currentPage + 1, 'next')}
    </ul>
  </nav>;
});
Pagination05.displayName = 'Pagination05';
