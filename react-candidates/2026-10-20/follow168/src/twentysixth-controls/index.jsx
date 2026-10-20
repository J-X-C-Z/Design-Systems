import React, { forwardRef, useId } from 'react';
export { Accordion06 } from './accordion.jsx';

/** Native field; ownership, input, validity and reset remain React/HTML semantics. */
export const Textarea20 = forwardRef(function Textarea20({
  label = 'Project details', labelProps = {}, wrapperClassName = '',
  id: suppliedId, className = '', placeholder = 'Describe your project requirements...',
  'aria-describedby': describedBy, children: _children, dangerouslySetInnerHTML: _html,
  ...native
}, ref) {
  const generated = useId();
  const id = suppliedId ?? generated;
  const helpId = `${generated}-project-help`;
  const description = [...new Set(`${describedBy || ''} ${helpId}`.trim().split(/\s+/))].join(' ');
  const { children: _labelChildren, dangerouslySetInnerHTML: _labelHtml, ...labelAttributes } = labelProps;
  return <div className={`fr7 fr7-twentysixth fr7-project-field ${wrapperClassName}`} data-component-id="textarea-20">
    {label !== null && label !== false && <label {...labelAttributes} htmlFor={id} data-slot="label">{label}</label>}
    <textarea {...native} ref={ref} id={id} placeholder={placeholder} aria-describedby={description}
      className={`fr7-project-textarea ${className}`} data-slot="textarea" />
    <p id={helpId} className="fr7-project-help">Include key goals, constraints, or expectations.</p>
  </div>;
});
