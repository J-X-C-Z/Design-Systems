import * as React from 'react';
import { Checkbox01, Switch01 } from '../scalar/index.jsx';

const cx = (...parts) => parts.filter(Boolean).join(' ');
const slots = entries => Object.freeze(entries.map(entry => Object.freeze(entry)));
export const CHECKBOX09_SLOTS = slots([
  { key: 'planning', label: '规划', ariaLabel: '规划', icon: 'folder', defaultChecked: false },
  { key: 'design', label: '设计', ariaLabel: '设计', icon: 'pen', defaultChecked: false },
  { key: 'operations', label: '运营', ariaLabel: '运营', icon: 'briefcase', defaultChecked: false }
]);
export const CHECKBOX10_SLOTS = slots([
  { key: 'destructive', label: null, ariaLabel: '危险色复选框', defaultChecked: true },
  { key: 'info', label: null, ariaLabel: '信息色复选框', defaultChecked: true },
  { key: 'success', label: null, ariaLabel: '成功色复选框', defaultChecked: true }
]);
export const CHECKBOX11_SLOTS = slots([
  { key: 'triangle', label: null, ariaLabel: '三角形复选框', icon: 'triangle', defaultChecked: true },
  { key: 'diamond', label: null, ariaLabel: '菱形复选框', icon: 'diamond', defaultChecked: true },
  { key: 'hexagon', label: null, ariaLabel: '六边形复选框', icon: 'hexagon', defaultChecked: true }
]);
export const CHECKBOX12_SLOTS = slots([
  { key: 'destructive', label: null, ariaLabel: '危险色圆形复选框', icon: 'circle-check', defaultChecked: true },
  { key: 'info', label: null, ariaLabel: '信息色圆形复选框', icon: 'circle-check', defaultChecked: true },
  { key: 'success', label: null, ariaLabel: '成功色圆形复选框', icon: 'circle-check', defaultChecked: true }
]);
export const SWITCH12_SLOTS = slots([
  { key: 'privacy', label: '隐私模式', ariaLabel: '隐私模式', icon: 'shield', defaultChecked: false },
  { key: 'notifications', label: '通知', ariaLabel: '通知', icon: 'bell', defaultChecked: false },
  { key: 'darkTheme', label: '深色主题', ariaLabel: '深色主题', icon: 'moon', defaultChecked: false }
]);
const revision = token => token === undefined ? ['undefined'] : typeof token === 'number'
  ? ['number', Object.is(token, -0) ? '-0' : String(token)] : ['string', token];
const combineRevision = (group, member) => JSON.stringify([revision(group), revision(member)]);
const hasLabel = label => label != null && label !== '' && label !== false;

function Icon({ name, className }) {
  const paths = {
    folder: <><path d="M3 7V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /><path d="M7 10v7m5-7v4m5-4v7" /></>,
    pen: <><path d="m16 3 5 5-4 4-5-5Zm-4 4-7 3-2 11 11-2 3-7M3 21l7-7" /><circle cx="11" cy="13" r="2" /></>,
    briefcase: <><rect x="3" y="7" width="18" height="14" rx="2" /><path d="M8 7V3h8v4M3 12h18M10 12v3h4v-3" /></>,
    triangle: <path d="M10.4 3.7 1.8 18.5A1.7 1.7 0 0 0 3.3 21h17.4a1.7 1.7 0 0 0 1.5-2.5L13.6 3.7a1.85 1.85 0 0 0-3.2 0Z" />,
    diamond: <path d="m10.6 2.6-8 8a2 2 0 0 0 0 2.8l8 8a2 2 0 0 0 2.8 0l8-8a2 2 0 0 0 0-2.8l-8-8a2 2 0 0 0-2.8 0Z" />,
    hexagon: <path d="m12 2 9 5v10l-9 5-9-5V7Z" />,
    'circle-check': <><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    x: <path d="m6 6 12 12M6 18 18 6" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 1v2m0 18v2M1 12h2m18 0h2M4.2 4.2l1.4 1.4m12.8 12.8 1.4 1.4M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></>,
    moon: <path d="M20.8 13A9 9 0 0 1 11 3.2 9 9 0 1 0 20.8 13Z" />,
    refresh: <><path d="M21 3v6h-6M3 21v-6h6" /><path d="M5.5 5.5a9 9 0 0 1 14.9 3M3.6 15.5a9 9 0 0 0 14.9 3" /></>,
    shield: <path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6Z" />,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>
  };
  return <svg className={cx('fr7-fourth-icon', className)} data-icon={name} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[name]}</svg>;
}

/** Shared ownership/event wiring only. Each exact ID supplies its source composition. */
function SelectionGroup({ specification, componentId, composition, accessibleName, defaultLabel, forwardedRef, ...props }) {
  const { disabled, readOnly, ownerRevision, form, onChange, label = defaultLabel, description, error,
    id: suppliedId, className, children: ignoredChildren,
    checked: ignoredChecked, defaultChecked: ignoredDefaultChecked, onCheckedChange: ignoredCheckedChange,
    value: ignoredValue, defaultValue: ignoredDefaultValue, values: ignoredValues, defaultValues: ignoredDefaultValues,
    onValueChange: ignoredValueChange, name: ignoredName, ...groupProps } = props;
  const generated = React.useId(), id = suppliedId ?? `fr7-${componentId}-${generated}`;
  const members = {}, refs = {};
  for (const { key } of specification) {
    members[key] = groupProps[key] ?? {}; refs[key] = groupProps[`${key}Ref`];
    delete groupProps[key]; delete groupProps[`${key}Ref`];
  }
  const heading = hasLabel(label), settings = composition === 'settings';
  const Root = settings ? 'fieldset' : 'div', Heading = settings ? 'legend' : 'div';
  const List = settings ? 'ul' : 'div', Item = settings ? 'li' : 'div';
  const describedBy = [groupProps['aria-describedby'], description ? `${id}-description` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') || undefined;
  const Field = settings ? Switch01 : Checkbox01;
  return <Root {...groupProps} {...(settings ? { disabled: !!disabled, form } : {})} ref={forwardedRef} id={id} role={groupProps.role ?? (settings ? undefined : 'group')}
    aria-label={groupProps['aria-label'] ?? (heading ? undefined : accessibleName)}
    aria-labelledby={groupProps['aria-labelledby'] ?? (heading ? `${id}-label` : undefined)}
    aria-describedby={describedBy} aria-invalid={error ? true : groupProps['aria-invalid']}
    className={cx('fr7 fr7-fourth-selection', `fr7-${componentId}`, className)} data-component-id={componentId}>
    {heading ? <Heading className="fr7-fourth-heading fr7-label" id={`${id}-label`}>{label}</Heading> : null}
    {description ? <p className="fr7-help fr7-fourth-description" id={`${id}-description`}>{description}</p> : null}
    <List className="fr7-fourth-members">
      {specification.map(({ key, label: sourceLabel, ariaLabel, defaultChecked, icon }) => {
        const member = members[key], effectiveLabel = member.label === undefined ? sourceLabel : member.label;
        const decoratedLabel = hasLabel(effectiveLabel) && (composition === 'focus' || settings)
          ? <span className="fr7-fourth-label-content"><Icon name={icon} /><span>{effectiveLabel}</span></span> : effectiveLabel;
        return <Item className={`fr7-fourth-member fr7-fourth-member-${key}`} data-selection-slot={key} key={key}>
          <Field {...member} label={decoratedLabel}
            id={member.id ?? `${id}-${key}`} form={member.form ?? form}
            defaultChecked={member.defaultChecked === undefined ? defaultChecked : member.defaultChecked}
            aria-label={member['aria-label'] ?? (hasLabel(effectiveLabel) ? undefined : ariaLabel)}
            aria-describedby={[member['aria-describedby'], describedBy].filter(Boolean).join(' ') || undefined}
            aria-invalid={member.error || error ? true : member['aria-invalid']}
            disabled={!!(disabled || member.disabled)} readOnly={!!(readOnly || member.readOnly)}
            ownerRevision={combineRevision(ownerRevision, member.ownerRevision)}
            onChange={event => {
              member.onChange?.(event);
              if (!event.defaultPrevented && !event.nativeEvent.defaultPrevented) onChange?.(event);
            }} ref={refs[key]} />
          {composition === 'shapes' || composition === 'circles' ? <span className="fr7-fourth-control-art" aria-hidden="true"><Icon name={icon} /></span> : null}
        </Item>;
      })}
    </List>
    {error ? <p className="fr7-error fr7-fourth-error" id={`${id}-error`}>{error}</p> : null}
  </Root>;
}
export const Checkbox09 = React.forwardRef(function Checkbox09(props, ref) {
  return <SelectionGroup {...props} specification={CHECKBOX09_SLOTS} componentId="checkbox-09" composition="focus" accessibleName="关注领域" defaultLabel="关注领域" forwardedRef={ref} />;
});
export const Checkbox10 = React.forwardRef(function Checkbox10(props, ref) {
  return <SelectionGroup {...props} specification={CHECKBOX10_SLOTS} componentId="checkbox-10" composition="colors" accessibleName="彩色复选框" forwardedRef={ref} />;
});
export const Checkbox11 = React.forwardRef(function Checkbox11(props, ref) {
  return <SelectionGroup {...props} specification={CHECKBOX11_SLOTS} componentId="checkbox-11" composition="shapes" accessibleName="几何图形复选框" forwardedRef={ref} />;
});
export const Checkbox12 = React.forwardRef(function Checkbox12(props, ref) {
  return <SelectionGroup {...props} specification={CHECKBOX12_SLOTS} componentId="checkbox-12" composition="circles" accessibleName="圆形彩色复选框" forwardedRef={ref} />;
});
function IconSwitch({ componentId, uncheckedIcon, checkedIcon, accessibleName, forwardedRef, label = null, 'aria-label': ariaLabel, defaultChecked = true, ...props }) {
  return <div className={`fr7 fr7-fourth-selection fr7-${componentId}`} data-component-id={componentId}>
    <div className="fr7-fourth-icon-switch">
      <Switch01 {...props} label={label} aria-label={ariaLabel ?? (hasLabel(label) ? undefined : accessibleName)} defaultChecked={defaultChecked} ref={forwardedRef} />
      <span className="fr7-fourth-switch-art" aria-hidden="true">
        <Icon name={uncheckedIcon} className="fr7-fourth-unchecked-icon" />
        <Icon name={checkedIcon} className="fr7-fourth-checked-icon" />
      </span>
    </div>
  </div>;
}
export const Switch09 = React.forwardRef(function Switch09(props, ref) {
  return <IconSwitch {...props} componentId="switch-09" uncheckedIcon="check" checkedIcon="x" accessibleName="勾叉状态开关" forwardedRef={ref} />;
});
export const Switch10 = React.forwardRef(function Switch10(props, ref) {
  return <IconSwitch {...props} componentId="switch-10" uncheckedIcon="moon" checkedIcon="sun" accessibleName="方形日月开关" forwardedRef={ref} />;
});
export const Switch11 = React.forwardRef(function Switch11({ label = '自动同步', help = '自动在你的设备之间同步数据。', defaultChecked = true, 'aria-label': ariaLabel, ...props }, ref) {
  return <div className="fr7 fr7-fourth-selection fr7-switch-11" data-component-id="switch-11">
    <Switch01 {...props} label={label} help={help} aria-label={ariaLabel ?? (hasLabel(label) ? undefined : '自动同步')} defaultChecked={defaultChecked} ref={ref} />
    <span className="fr7-fourth-sync-art" aria-hidden="true"><Icon name="refresh" /></span>
  </div>;
});
export const Switch12 = React.forwardRef(function Switch12(props, ref) {
  return <SelectionGroup {...props} specification={SWITCH12_SLOTS} componentId="switch-12" composition="settings" accessibleName="管理偏好设置" defaultLabel="管理偏好设置：" forwardedRef={ref} />;
});
