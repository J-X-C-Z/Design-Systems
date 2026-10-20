import * as React from "react";
const classes = (...values) => values.filter(Boolean).join(" ");
function positiveCount(value) {
  if (!Number.isSafeInteger(value) || value < 1 || value > 1e3) throw new RangeError("Pagination05: pageCount must be an integer from 1 to 1000.");
  return value;
}
function clampPage(value, count) {
  if (!Number.isSafeInteger(value)) throw new RangeError("Pagination05: page/defaultPage must be a safe integer.");
  return Math.min(count, Math.max(1, value));
}
function Chevron({ direction }) {
  return <svg className="fr12-chevron" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
    <path d={direction === "previous" ? "M12.5 4.5 7 10l5.5 5.5" : "M7.5 4.5 13 10l-5.5 5.5"} />
  </svg>;
}
const Pagination05 = React.forwardRef((props, ref) => {
  const {
    page,
    defaultPage = 2,
    pageCount = 3,
    getPageHref = (page2, kind) => kind === "page" ? `#${page2}` : "#",
    disabled = false,
    onPageChange,
    className,
    children: _children,
    dangerouslySetInnerHTML: _html,
    "aria-label": ariaLabel = "pagination",
    ...nav
  } = props;
  if (page !== void 0 && props.defaultPage !== void 0) {
    throw new TypeError("Pagination05: page and defaultPage are mutually exclusive.");
  }
  const count = positiveCount(pageCount);
  const controlled = page !== void 0;
  const [innerPage, setInnerPage] = React.useState(() => clampPage(defaultPage, count));
  const currentPage = clampPage(controlled ? page : innerPage, count);
  const active = React.useRef(false);
  const serial = React.useRef(0);
  const owner = React.useRef({ controlled, currentPage, count, disabled });
  React.useLayoutEffect(() => {
    const previous = owner.current;
    if (previous.controlled !== controlled || previous.currentPage !== currentPage || previous.count !== count || previous.disabled !== disabled) serial.current++;
    owner.current = { controlled, currentPage, count, disabled };
    if (!controlled && innerPage !== currentPage) setInnerPage(currentPage);
  });
  React.useLayoutEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
      serial.current++;
    };
  }, []);
  const propose = (nextPage, blocked, event) => {
    if (blocked) {
      event.preventDefault();
      return;
    }
    if (event.defaultPrevented || event.nativeEvent.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    const ticket = ++serial.current;
    if (nextPage === currentPage) return;
    const anchor = event.currentTarget;
    let canceled = false;
    let open = true;
    const details = {
      event,
      previousPage: currentPage,
      page: nextPage,
      get canceled() {
        return canceled || event.defaultPrevented || event.nativeEvent.defaultPrevented;
      },
      cancel() {
        if (open) {
          canceled = true;
          event.preventDefault();
        }
      }
    };
    try {
      onPageChange?.(nextPage, details);
    } catch (error) {
      details.cancel();
      throw error;
    } finally {
      open = false;
    }
    queueMicrotask(() => {
      const latest = owner.current;
      if (!active.current || ticket !== serial.current || !anchor.isConnected || details.canceled || latest.disabled || latest.controlled) return;
      if (latest.currentPage !== currentPage || latest.count !== count) return;
      setInnerPage(nextPage);
    });
  };
  const link = (target, kind) => {
    const blocked = disabled || target < 1 || target > count;
    const activePage = kind === "page" && target === currentPage;
    return <li key={kind === "page" ? target : kind} className="fr12-pagination-item" data-slot="pagination-item">
      <a
      href={blocked ? void 0 : getPageHref(target, kind)}
      aria-label={kind === "previous" ? "Go to previous page" : kind === "next" ? "Go to next page" : void 0}
      aria-current={activePage ? "page" : void 0}
      aria-disabled={blocked || void 0}
      role={blocked ? "link" : void 0}
      tabIndex={blocked ? -1 : void 0}
      className={classes("fr12-page-link", kind !== "page" && "fr12-page-direction")}
      data-slot="pagination-link"
      data-active={activePage}
      data-page={target}
      data-kind={kind}
      onClick={(event) => propose(target, blocked, event)}
    >
        {kind === "page" ? target : kind === "previous" ? <><Chevron direction={kind} /><span className="fr12-direction-label">Prev</span></> : <><span className="fr12-direction-label">Next</span><Chevron direction={kind} /></>}
      </a>
    </li>;
  };
  return <nav
    {...nav}
    ref={ref}
    aria-label={ariaLabel}
    className={classes("fr12-pagination", className)}
    data-component="pagination-05"
    data-slot="pagination"
    data-page={currentPage}
    aria-disabled={disabled || void 0}
  >
    <ul className="fr12-pagination-list" data-slot="pagination-content">
      {link(currentPage - 1, "previous")}
      {Array.from({ length: count }, (_, index) => link(index + 1, "page"))}
      {link(currentPage + 1, "next")}
    </ul>
  </nav>;
});
Pagination05.displayName = "Pagination05";
export {
  Pagination05
};

export const Textarea11=React.forwardRef(function Textarea11({id,label='Project summary',placeholder=' ',wrapperClassName='',className='',children:_children,dangerouslySetInnerHTML:_html,...native},ref){const uid=React.useId(),fieldId=id??('fr12-summary-'+uid);if(native.value!==undefined&&native.defaultValue!==undefined)throw new TypeError('Textarea11 value/defaultValue are mutually exclusive');return <div className={'fr12-textarea11 '+wrapperClassName} data-component-id="textarea-11"><label htmlFor={fieldId}><span>{label}</span></label><textarea {...native} ref={ref} id={fieldId} placeholder={placeholder} className={'fr12-floating-input '+className}/></div>});
