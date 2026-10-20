import type * as React from 'react';

export type RadioGroup02Value = 'monthly' | 'quarterly' | 'yearly';
export type RadioGroup02Selection = RadioGroup02Value | null;
export type Collapsible02FolderId = 'src' | 'src/sections' | 'content' | 'styles';

type RadioOwner = { value: RadioGroup02Selection; defaultValue?: never } | { value?: undefined; defaultValue?: RadioGroup02Selection };
type ExpandedOwner = { expanded: readonly Collapsible02FolderId[]; defaultExpanded?: never } | { expanded?: undefined; defaultExpanded?: readonly Collapsible02FolderId[] };

/** Input values, grouping, ownership, labels and roving focus stay component-owned.
 * Native onClick and React radio onChange may prevent the activation. Native onInput
 * is observational: input events are not cancelable. Use onValueChange for state vetoes.
 * React 19 callback-ref cleanup functions are preserved.
 */
export type RadioGroup02ItemProps = Omit<React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'name' | 'form' | 'checked' | 'defaultChecked' | 'defaultValue' | 'required' | 'id' | 'tabIndex' | 'children' | 'dangerouslySetInnerHTML'> & {
  ref?: React.Ref<HTMLInputElement>;
  children?: never;
  dangerouslySetInnerHTML?: never;
};
export type RadioGroup02LabelProps = Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'htmlFor' | 'children' | 'dangerouslySetInnerHTML'> & {
  ref?: React.Ref<HTMLLabelElement>;
  children?: never;
  dangerouslySetInnerHTML?: never;
};
export interface RadioGroup02ChangeDetail {
  id: 'radio-group-02';
  reason: 'select' | 'keyboard' | 'reset';
  /** Retained React activation event or native reset event. currentTarget is not retained. */
  event: React.MouseEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement> | Event;
  /** Stable input node, null for a form reset. */
  input: HTMLInputElement | null;
  previousValue: RadioGroup02Selection;
  cancel(): void;
}
export type RadioGroup02Props = Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'dangerouslySetInnerHTML' | 'role' | 'defaultValue'> & RadioOwner & {
  children?: never;
  dangerouslySetInnerHTML?: never;
  /** Omitted: no successful form field, matching the source. Explicit names opt into
   * native radio grouping and submission. Use distinct names for independent groups.
   * Unnamed instances use local React exclusivity and a required-validation anchor.
   */
  name?: string;
  form?: string;
  required?: boolean;
  disabled?: boolean;
  /** Source default is monthly. null requests no selection. The mounted default is
   * the uncontrolled reset baseline; later defaultValue edits do not change it.
   * Controlled resets keep the current value and do not emit a proposal.
   * A selected disabled option stays selected and contributes no successful field;
   * it does not force choosing an enabled replacement. Clear value to null to do so.
   * Reset vetoes restore only this group; they cannot undo other native form resets.
   * Same-turn reset/selection operations retain native dispatch order: a canceled
   * later choice cannot erase an allowed reset; a later accepted choice can replace
   * it. A newer explicit controlled owner update invalidates older queued work.
   * Proposals are deferred until event bubbling ends; return false, cancel(), or
   * preventDefault() to reject. Keyboard defaults are component-owned; use cancel()
   * or call preventDefault(), rather than reading defaultPrevented to infer a veto.
   * Enter suppresses the native default without selecting or submitting, preserving
   * recovered Radix behavior. Composition-confirmation Enter remains IME-owned.
   * Arrows move focus and select. Home/End move focus only, with Space selecting
   * that focused option. The focused enabled item owns the roving tab stop.
   */
  onValueChange?: (value: RadioGroup02Selection, detail: RadioGroup02ChangeDetail) => void | boolean;
  itemProps?: Partial<Record<RadioGroup02Value, RadioGroup02ItemProps>>;
  labelProps?: Partial<Record<RadioGroup02Value, RadioGroup02LabelProps>>;
};
export declare const RadioGroup02: React.ForwardRefExoticComponent<RadioGroup02Props & React.RefAttributes<HTMLDivElement>>;

/** Native button events, ref and disabled. type and disclosure ARIA are component-owned. */
export type Collapsible02TriggerProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'aria-expanded' | 'aria-controls' | 'children' | 'dangerouslySetInnerHTML'> & {
  ref?: React.Ref<HTMLButtonElement>;
  children?: never;
  dangerouslySetInnerHTML?: never;
};
export interface Collapsible02ChangeDetail {
  id: 'collapsible-02';
  folderId: Collapsible02FolderId;
  open: boolean;
  event: React.MouseEvent<HTMLButtonElement>;
  button: HTMLButtonElement;
  previousExpanded: Collapsible02FolderId[];
  cancel(): void;
}
export type Collapsible02Props = Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'dangerouslySetInnerHTML'> & ExpandedOwner & {
  children?: never;
  dangerouslySetInnerHTML?: never;
  disabled?: boolean;
  /** Deferred until bubbling ends. Return false, cancel(), or preventDefault() to veto.
   * Default: every folder closed, independent siblings. Uncontrolled src closure
   * unmounts sections and drops its state; reopening restores its mounted default.
   * A hidden default src/sections does not force src open. Controlled arrays may
   * retain hidden descendants deliberately; this is an explicit source extension.
   * Native form reset does not change this non-form disclosure.
   */
  onExpandedChange?: (expanded: Collapsible02FolderId[], detail: Collapsible02ChangeDetail) => void | boolean;
  triggerProps?: Partial<Record<Collapsible02FolderId, Collapsible02TriggerProps>>;
};
export declare const Collapsible02: React.ForwardRefExoticComponent<Collapsible02Props & React.RefAttributes<HTMLDivElement>>;
