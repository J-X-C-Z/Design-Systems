import * as React from 'react';
import { Checkbox01, Switch01 } from '../scalar/index.jsx';

const cx = (...parts) => parts.filter(Boolean).join(' ');
const slots = entries => Object.freeze(entries.map(entry => Object.freeze(entry)));
export const CHECKBOX05_SLOTS = slots([
  { key: 'standard', label: null, ariaLabel: '标准尺寸复选框', defaultChecked: true, size: 16 },
  { key: 'medium', label: null, ariaLabel: '中号复选框', defaultChecked: true, size: 20 },
  { key: 'large', label: null, ariaLabel: '大号复选框', defaultChecked: true, size: 24 }
]);
export const CHECKBOX06_SLOTS = slots([
  { key: 'salad', label: '沙拉', defaultChecked: true },
  { key: 'wrap', label: '卷饼', defaultChecked: true },
  { key: 'juice', label: '果汁', defaultChecked: false }
]);
export const CHECKBOX08_SLOTS = slots([
  { key: 'design', label: '设计', defaultChecked: false },
  { key: 'marketing', label: '营销', defaultChecked: false },
  { key: 'product', label: '产品', defaultChecked: false }
]);
export const SWITCH05_SLOTS = slots([
  { key: 'destructive', label: null, ariaLabel: '危险描边开关', defaultChecked: true },
  { key: 'success', label: null, ariaLabel: '成功描边开关', defaultChecked: true },
  { key: 'info', label: null, ariaLabel: '信息描边开关', defaultChecked: true },
  { key: 'warning', label: null, ariaLabel: '警告描边开关', defaultChecked: true }
]);
export const SWITCH07_SLOTS = slots([
  { key: 'small', label: null, ariaLabel: '小号开关', defaultChecked: false },
  { key: 'medium', label: null, ariaLabel: '中号开关', defaultChecked: false },
  { key: 'large', label: null, ariaLabel: '大号开关', defaultChecked: false }
]);
// JSON's usual undefined/null and -0/0 collapse must not erase owner commands.
const revision = token => token === undefined ? ['undefined'] : typeof token === 'number'
  ? ['number', Object.is(token, -0) ? '-0' : String(token)] : ['string', token];
const combineRevision = (group, member) => JSON.stringify([revision(group), revision(member)]);

/** Fixed source members, each backed by its own real React scalar field. */
function SelectionGroup({ specification, componentId, kind, accessibleName, defaultLabel, forwardedRef, ...props }) {
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
  const heading = label != null && label !== '';
  const descriptions = [groupProps['aria-describedby'], description ? `${id}-description` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') || undefined;
  const Field = kind === 'switch' ? Switch01 : Checkbox01;
  return <div {...groupProps} ref={forwardedRef} id={id} role={groupProps.role ?? 'group'}
    aria-label={groupProps['aria-label'] ?? (heading ? undefined : accessibleName)}
    aria-labelledby={groupProps['aria-labelledby'] ?? (heading ? `${id}-label` : undefined)}
    aria-describedby={descriptions} aria-invalid={error ? true : groupProps['aria-invalid']}
    className={cx('fr7 fr7-third-selection', `fr7-${componentId}`, className)} data-component-id={componentId}>
    {heading ? <div className="fr7-selection-heading fr7-label" id={`${id}-label`}>{label}</div> : null}
    {description ? <p className="fr7-help fr7-group-description" id={`${id}-description`}>{description}</p> : null}
    <div className="fr7-selection-members">
      {specification.map(({ key, label: sourceLabel, ariaLabel, defaultChecked }) => {
        const member = members[key], effectiveLabel = member.label === undefined ? sourceLabel : member.label;
        return <div className={`fr7-selection-member fr7-selection-member-${key}`} data-selection-slot={key} key={key}>
          <Field {...member} label={effectiveLabel}
            id={member.id ?? `${id}-${key}`} form={member.form ?? form}
            defaultChecked={member.defaultChecked === undefined ? defaultChecked : member.defaultChecked}
            aria-label={member['aria-label'] ?? (effectiveLabel != null && effectiveLabel !== '' ? undefined : ariaLabel)}
            aria-describedby={[member['aria-describedby'], descriptions].filter(Boolean).join(' ') || undefined}
            aria-invalid={member.error || error ? true : member['aria-invalid']}
            disabled={!!(disabled || member.disabled)} readOnly={!!(readOnly || member.readOnly)}
            ownerRevision={combineRevision(ownerRevision, member.ownerRevision)}
            onChange={event => {
              member.onChange?.(event);
              if (!event.defaultPrevented && !event.nativeEvent.defaultPrevented) onChange?.(event);
            }} ref={refs[key]} />
        </div>;
      })}
    </div>
    {error ? <p className="fr7-error fr7-group-error" id={`${id}-error`}>{error}</p> : null}
  </div>;
}
export const Checkbox05 = React.forwardRef(function Checkbox05(props, ref) {
  return <SelectionGroup {...props} specification={CHECKBOX05_SLOTS} componentId="checkbox-05" kind="checkbox" accessibleName="复选框尺寸" forwardedRef={ref} />;
});
export const Checkbox06 = React.forwardRef(function Checkbox06(props, ref) {
  return <SelectionGroup {...props} specification={CHECKBOX06_SLOTS} componentId="checkbox-06" kind="checkbox" accessibleName="选择小食" forwardedRef={ref} />;
});
export const Checkbox07 = React.forwardRef(function Checkbox07({ label = '订阅更新', help = '点击此复选框，即表示你同意相关条款与条件。', defaultChecked = true, ...props }, ref) {
  return <div className="fr7-third-selection fr7-checkbox-07" data-component-id="checkbox-07"><Checkbox01 {...props} label={label} help={help} defaultChecked={defaultChecked} ref={ref} /></div>;
});
export const Checkbox08 = React.forwardRef(function Checkbox08(props, ref) {
  return <SelectionGroup {...props} specification={CHECKBOX08_SLOTS} componentId="checkbox-08" kind="checkbox" accessibleName="团队角色" defaultLabel="团队角色" forwardedRef={ref} />;
});
export const Switch05 = React.forwardRef(function Switch05(props, ref) {
  return <SelectionGroup {...props} specification={SWITCH05_SLOTS} componentId="switch-05" kind="switch" accessibleName="描边开关" forwardedRef={ref} />;
});
export const Switch06 = React.forwardRef(function Switch06({ label = null, 'aria-label': ariaLabel, ...props }, ref) {
  return <div className="fr7-third-selection fr7-switch-06" data-component-id="switch-06"><Switch01 {...props} label={label} aria-label={ariaLabel ?? (label != null && label !== '' ? undefined : '迷你开关')} ref={ref} /></div>;
});
export const Switch07 = React.forwardRef(function Switch07(props, ref) {
  return <SelectionGroup {...props} specification={SWITCH07_SLOTS} componentId="switch-07" kind="switch" accessibleName="开关尺寸" forwardedRef={ref} />;
});
export const Switch08 = React.forwardRef(function Switch08({ label = null, 'aria-label': ariaLabel, defaultChecked = true, ...props }, ref) {
  return <div className="fr7-third-selection fr7-switch-08" data-component-id="switch-08">
    <div className="fr7-icon-switch-wrap">
      <Switch01 {...props} label={label} aria-label={ariaLabel ?? (label != null && label !== '' ? undefined : '带勾叉指示的开关')} defaultChecked={defaultChecked} ref={ref} />
      <span className="fr7-switch-icons" aria-hidden="true">
        <svg className="fr7-switch-icon fr7-switch-icon-check" data-icon="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        <svg className="fr7-switch-icon fr7-switch-icon-x" data-icon="x" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
      </span>
    </div>
  </div>;
});
