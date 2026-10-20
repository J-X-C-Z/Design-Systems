import * as React from 'react';

// Twelve independently inspected pinned source compositions. The shared private
// primitive only owns native semantics; it does not invent domain actions.
const cx = (...parts) => parts.filter(Boolean).join(' ');
const ariaTrue = value => value === true || value === 'true';
const NativeButton = React.forwardRef(function NativeButton({
  children, variant, className, type = 'button', disabled = false,
  readOnly = false, onClick, ...native
}, ref) {
  const blocked = readOnly || ariaTrue(native['aria-disabled']);
  return <button {...native} ref={ref} type={type} disabled={disabled}
    data-slot="button" data-follow-id={`button-${variant}`}
    aria-disabled={blocked ? true : native['aria-disabled']}
    className={cx('fr7 fr7-third-button', `fr7-third-button-${variant}`, className)}
    onClick={event => {
      if (blocked || event.currentTarget.disabled) { event.preventDefault(); return; }
      // No callback chaining, promise inspection, state, refocus, or post-callback
      // work. Synchronous owner updates/unmounts and exceptions retain React semantics.
      onClick?.(event);
    }}><span className="fr7-tb-face">{children}</span></button>;
});

function Icon({ name }) {
  const geometry = {
    copy: <><path d="M8 2h11a2 2 0 0 1 2 2v11h-3V6H8z" /><path d="M4 7h10a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" /></>,
    download: <><path d="M10 2h4v10h4l-6 7-6-7h4zM3 18h4v2h10v-2h4v5H3z" /></>,
    save: <><path d="M3 2h14l4 4v16H3V2Zm4 0v7h10V2H7Zm0 12v6h10v-6H7Z" /><path d="M13 3h2v4h-2z" /></>,
    warning: <><path d="M10.3 3.6a2 2 0 0 1 3.4 0l9 15.5a2 2 0 0 1-1.7 3H3a2 2 0 0 1-1.7-3l9-15.5Z" /><path d="M12 8v6m0 4v.1" fill="none" stroke="var(--tb-icon-cutout, #fff4ce)" strokeWidth="2.5" strokeLinecap="round" /></>,
    cancel: <><circle cx="12" cy="12" r="10" /><path d="m8 8 8 8m0-8-8 8" fill="none" stroke="var(--tb-icon-cutout, #fff)" strokeWidth="2" /></>,
    confirm: <><circle cx="12" cy="12" r="10" /><path d="m6.5 12 3.5 3.5 7.5-7.5" fill="none" stroke="var(--tb-icon-cutout, #fff)" strokeWidth="2" /></>,
    back: <path d="M20 12H4m7-7-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
    bell: <><path d="M12 2a2 2 0 0 1 2 2v.3A7 7 0 0 1 19 11v4l3 3H2l3-3v-4a7 7 0 0 1 5-6.7V4a2 2 0 0 1 2-2zM9 20h6a3 3 0 0 1-6 0z" /></>
  };
  return <svg className={cx('fr7-tb-icon', name === 'back' && 'fr7-tb-back')} data-icon={name}
    aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="currentColor">{geometry[name]}</svg>;
}

export const Button13 = React.forwardRef(function Button13({ children = '复制', ...props }, ref) {
  return <NativeButton {...props} ref={ref} variant="13"><Icon name="copy" /><span className="fr7-tb-label">{children}</span></NativeButton>;
});
export const Button14 = React.forwardRef(function Button14({ children = '下载', ...props }, ref) {
  return <NativeButton {...props} ref={ref} variant="14"><Icon name="download" /><span className="fr7-tb-label">{children}</span></NativeButton>;
});
export const Button15 = React.forwardRef(function Button15({ url = 'https://watermelon-ui.com/', children = '复制网址', shellClassName, ...props }, ref) {
  return <div className={cx('fr7 fr7-third-url', shellClassName)} data-follow-composition="button-15">
    <p className="fr7-tb-url" title={url}>{url}</p>
    <NativeButton {...props} ref={ref} variant="15"><Icon name="copy" /><span className="fr7-tb-sr-only">{children}</span></NativeButton>
  </div>;
});
export const Button16 = React.forwardRef(function Button16({ children = '保存', ...props }, ref) {
  return <NativeButton {...props} ref={ref} variant="16"><Icon name="save" /><span className="fr7-tb-label">{children}</span></NativeButton>;
});
export const Button17 = React.forwardRef(function Button17({ children = '警告', ...props }, ref) {
  return <NativeButton {...props} ref={ref} variant="17"><Icon name="warning" /><span className="fr7-tb-label">{children}</span></NativeButton>;
});

export const BUTTON18_MEMBERS = Object.freeze(['cancel', 'confirm']);
// Group locks cannot be undone by a child's props. A per-member onClick replaces
// the common default; it is intentionally never chained after another callback.
function memberProps(own, shared) {
  return { ...own, disabled: Boolean(shared.disabled || own.disabled),
    readOnly: Boolean(shared.readOnly || own.readOnly),
    'aria-disabled': ariaTrue(shared['aria-disabled']) ? true : own['aria-disabled'],
    onClick: own.onClick === undefined ? shared.onClick : own.onClick };
}
export const Button18 = React.forwardRef(function Button18({
  cancelLabel = '取消', confirmLabel = '确认', cancelProps = {}, confirmProps = {},
  disabled = false, readOnly = false, onClick, className, children: _children, ...group
}, ref) {
  const shared = { disabled, readOnly, onClick, 'aria-disabled': group['aria-disabled'] };
  return <div {...group} ref={ref} role={group.role || 'group'} data-follow-id="button-18"
    aria-disabled={disabled || readOnly || ariaTrue(group['aria-disabled']) ? true : group['aria-disabled']}
    className={cx('fr7 fr7-third-actions', className)}>
    <NativeButton {...memberProps(cancelProps, shared)} variant="18" data-member="cancel">
      <span className="fr7-tb-label">{cancelLabel}</span><Icon name="cancel" />
    </NativeButton>
    <NativeButton {...memberProps(confirmProps, shared)} variant="18" data-member="confirm">
      <span className="fr7-tb-label">{confirmLabel}</span><Icon name="confirm" />
    </NativeButton>
  </div>;
});
export const Button19 = React.forwardRef(function Button19({ children = '返回', ...props }, ref) {
  return <NativeButton {...props} ref={ref} variant="19"><Icon name="back" /><span className="fr7-tb-label">{children}</span></NativeButton>;
});
export const Button20 = React.forwardRef(function Button20({ children = '联系我们', href = '#', className,
  disabled = false, readOnly = false, onClick, ...native }, ref) {
  const blocked = disabled || readOnly || ariaTrue(native['aria-disabled']);
  return <a {...native} ref={ref} href={href} data-follow-id="button-20"
    aria-disabled={blocked ? true : native['aria-disabled']}
    className={cx('fr7 fr7-third-link', className)}
    onClick={event => {
      if (blocked) { event.preventDefault(); return; }
      onClick?.(event);
    }}><span className="fr7-tb-link-label">{children}</span></a>;
});

export const BUTTON_PROVIDERS = Object.freeze(['google', 'x', 'facebook', 'github']);
const providerNames = { google: 'Google', x: 'X', facebook: 'Facebook', github: 'GitHub' };
function BrandIcon({ provider }) {
  // Original compact vector renditions, not copied react-icons path geometry.
  return <svg className="fr7-tb-brand" data-icon={provider} aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="currentColor">
    {provider === 'google' && <><path d="M19 6a9 9 0 0 0-14 1" fill="none" stroke="#ea4335" strokeWidth="4" /><path d="M5 7a9 9 0 0 0 0 10" fill="none" stroke="#fbbc05" strokeWidth="4" /><path d="M5 17a9 9 0 0 0 14 1" fill="none" stroke="#34a853" strokeWidth="4" /><path d="M19 18a9 9 0 0 0 2-6h-9" fill="none" stroke="#4285f4" strokeWidth="4" /></>}
    {provider === 'x' && <><path d="m3 3 18 18M21 3 3 21" fill="none" stroke="currentColor" strokeWidth="2.3" /><path d="M6 3h4l11 18h-4z" /></>}
    {provider === 'facebook' && <><circle cx="12" cy="12" r="11" fill="#1877f2" /><path d="M14 23v-9h3l.5-4H14V8c0-1 .4-1.5 1.8-1.5H18V3h-3c-3 0-5 1.8-5 5v2H7v4h3v9z" fill="#fff" /></>}
    {provider === 'github' && <><path d="M12 1a11 11 0 0 0-3.5 21.4v-3.6c-3 .6-3.7-1.3-3.7-1.3-.5-1.3-1.3-1.6-1.3-1.6 1.2-.6 2.3 1 2.3 1 1 .8 2 .6 2.8.3.2-.6.5-1 .8-1.3-2.5-.3-5.1-1.3-5.1-5.5 0-1.2.4-2.2 1.2-3-.1-.3-.5-1.5.2-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.7 1.6.3 2.8.2 3.1.8.8 1.2 1.8 1.2 3 0 4.2-2.6 5.2-5.1 5.5.4.4.8 1.1.8 2.2v4.3A11 11 0 0 0 12 1Z" /></>}
  </svg>;
}
function SocialGroup({ variant, groupRef, providerLabels = {}, providerProps = {}, disabled = false,
  readOnly = false, onClick, className, children: _children, ...group }) {
  const shared = { disabled, readOnly, onClick, 'aria-disabled': group['aria-disabled'] };
  return <div {...group} ref={groupRef} role={group.role || 'group'} data-follow-id={`button-${variant}`}
    aria-disabled={disabled || readOnly || ariaTrue(group['aria-disabled']) ? true : group['aria-disabled']}
    className={cx('fr7 fr7-third-social', `fr7-third-social-${variant}`, className)}>
    {BUTTON_PROVIDERS.map(provider => {
      const label = providerLabels[provider] ?? `使用 ${providerNames[provider]} 继续`;
      const own = providerProps[provider] || {};
      return <NativeButton key={provider} {...memberProps(own, shared)} variant={variant}
        data-provider={provider} aria-label={own['aria-label'] ?? label}>
        <BrandIcon provider={provider} />
        {variant === '22' && <span className="fr7-tb-provider-label">{label}</span>}
      </NativeButton>;
    })}
  </div>;
}
export const Button21 = React.forwardRef(function Button21(props, ref) {
  return <SocialGroup {...props} groupRef={ref} variant="21" />;
});
export const Button22 = React.forwardRef(function Button22(props, ref) {
  return <SocialGroup {...props} groupRef={ref} variant="22" />;
});
export const Button23 = React.forwardRef(function Button23({ children = '收件箱', count = 8, ...props }, ref) {
  return <NativeButton {...props} ref={ref} variant="23"><Icon name="bell" /><span className="fr7-tb-label">{children}</span>
    <span className="fr7-tb-badge" data-slot="badge">{count}</span>
  </NativeButton>;
});

// Self-contained original avatar: no third-party request at the default settings.
const LOCAL_AVATAR = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="#e8dccb"/><circle cx="24" cy="18" r="9" fill="#6b4c37"/><path d="M7 47c0-15 7-20 17-20s17 5 17 20" fill="#b36a3c"/><circle cx="21" cy="17" r="1" fill="#fff"/><circle cx="27" cy="17" r="1" fill="#fff"/></svg>');
function Avatar({ src, alt, fallback }) {
  const [status, setStatus] = React.useState(src ? 'loading' : 'fallback');
  const image = React.useRef(null);
  const active = React.useRef(false);
  React.useEffect(() => {
    active.current = true;
    const node = image.current;
    if (node?.complete && node.naturalWidth > 0) setStatus('loaded');
    return () => { active.current = false; };
  }, []);
  return <span className="fr7-tb-avatar" data-slot="avatar" data-status={status}>
    {src && <img ref={image} src={src} alt={alt} className="fr7-tb-avatar-image" data-slot="avatar-image"
      style={{ visibility: status === 'loaded' ? 'visible' : 'hidden' }}
      onLoad={event => { if (active.current && image.current === event.currentTarget) setStatus('loaded'); }}
      onError={event => { if (active.current && image.current === event.currentTarget) setStatus('fallback'); }} />}
    {status !== 'loaded' && <span className="fr7-tb-avatar-fallback" data-slot="avatar-fallback" aria-hidden="true">{fallback}</span>}
  </span>;
}
export const Button24 = React.forwardRef(function Button24({ children = '@Follow', avatarSrc = LOCAL_AVATAR,
  avatarAlt = '', avatarFallback = 'FU', ...props }, ref) {
  return <NativeButton {...props} ref={ref} variant="24"><Avatar key={avatarSrc || ''} src={avatarSrc} alt={avatarAlt} fallback={avatarFallback} /><span className="fr7-tb-label">{children}</span></NativeButton>;
});
