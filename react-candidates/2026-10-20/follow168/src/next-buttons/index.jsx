import * as React from 'react';

// Adapted from the nine pinned Watermelon samples. See source-hashes.json and
// LICENSE.upstream. These sources are actions, not stateful toggles/controllers.
const cx = (...parts) => parts.filter(Boolean).join(' ');
const NativeButton = React.forwardRef(function NativeButton({
  children, variant, readOnly = false, type = 'button', className, onClick,
  disabled = false, ...native
}, ref) {
  return <button {...native} ref={ref} type={type} disabled={disabled}
    data-slot="button" data-follow-id={`button-${variant}`}
    className={cx('fr7 fr7-next-button', `fr7-next-button-${variant}`, className)}
    aria-disabled={readOnly || native['aria-disabled'] || undefined}
    onClick={event => {
      if (readOnly || event.currentTarget.disabled || native['aria-disabled'] === true || native['aria-disabled'] === 'true') {
        event.preventDefault(); return;
      }
      // Standard React onClick. No post-callback state, refocus, promise handling,
      // form submission, or action simulation is added by this adapter.
      onClick?.(event);
    }}>
    <span className="fr7-nb-face">{children}</span>
  </button>;
});

function Arrow() {
  return <svg className="fr7-nb-icon fr7-nb-arrow" data-icon="arrow" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>;
}
function Ban() {
  return <svg className="fr7-nb-icon" data-icon="ban" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="9" /><path d="m5.6 5.6 12.8 12.8" /></svg>;
}
function Bolt() {
  return <svg className="fr7-nb-icon" data-icon="bolt" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h7l-1 8 10-13h-7l1-7z" /></svg>;
}
function Trash() {
  return <svg className="fr7-nb-icon" data-icon="trash" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="currentColor"><path d="M9 3h6l1 2h4v2H4V5h4l1-2ZM6 9h12l-1 12H7L6 9Z" /><path d="M10 11v7m4-7v7" fill="none" stroke="var(--ds-danger-bg, #f8e7eb)" strokeWidth="1.5" /></svg>;
}
function Star() {
  return <svg className="fr7-nb-icon" data-icon="star" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"><path d="m12 2.8 2.9 6 6.6.9-4.8 4.7 1.2 6.6-5.9-3.1L6.1 21l1.2-6.6-4.8-4.7 6.6-.9L12 2.8Z" /></svg>;
}

export const Button04 = React.forwardRef(function Button04({ children = '探索更多', ...props }, ref) {
  return <NativeButton {...props} variant="04" ref={ref}><span className="fr7-nb-label">{children}</span><Arrow /></NativeButton>;
});
export const Button05 = React.forwardRef(function Button05({ children = '已禁用', ...props }, ref) {
  return <NativeButton {...props} variant="05" ref={ref} disabled><Ban /><span className="fr7-nb-label">{children}</span></NativeButton>;
});
export const Button06 = React.forwardRef(function Button06({ children = '小号按钮', ...props }, ref) {
  return <NativeButton {...props} variant="06" ref={ref}><span className="fr7-nb-label">{children}</span></NativeButton>;
});
export const Button07 = React.forwardRef(function Button07({ children = '大号按钮', ...props }, ref) {
  return <NativeButton {...props} variant="07" ref={ref}><span className="fr7-nb-label">{children}</span></NativeButton>;
});
export const Button08 = React.forwardRef(function Button08({ children = '超小号按钮', ...props }, ref) {
  return <NativeButton {...props} variant="08" ref={ref}><span className="fr7-nb-label">{children}</span></NativeButton>;
});
export const Button09 = React.forwardRef(function Button09({ children = '加载中', ...props }, ref) {
  return <NativeButton {...props} variant="09" ref={ref} disabled aria-busy="true">
    <span className="fr7-nb-label">{children}</span>
    <span className="fr7-nb-dots" aria-hidden="true"><span /><span /><span /></span>
  </NativeButton>;
});
export const Button10 = React.forwardRef(function Button10({ children = '升级', ...props }, ref) {
  return <NativeButton {...props} variant="10" ref={ref}><span className="fr7-nb-label">{children}</span><Bolt /></NativeButton>;
});
export const Button11 = React.forwardRef(function Button11({ children = '删除', ...props }, ref) {
  return <NativeButton {...props} variant="11" ref={ref}><Trash /><span className="fr7-nb-label">{children}</span></NativeButton>;
});
export const Button12 = React.forwardRef(function Button12({ children = '收藏', ...props }, ref) {
  return <NativeButton {...props} variant="12" ref={ref}><Star /><span className="fr7-nb-label">{children}</span></NativeButton>;
});
