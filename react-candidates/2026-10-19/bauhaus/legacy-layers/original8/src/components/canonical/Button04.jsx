import {React} from '../../../vendor/react-runtime.js';
export function Button04({children='探索更多',onClick,disabled=false,...props}) {
  return <button {...props} data-canonical="button-04" className={'mg09-arrow-button '+(props.className||'')} type="button" onClick={onClick} disabled={disabled}><span>{children}</span><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2"/></svg></button>;
}
