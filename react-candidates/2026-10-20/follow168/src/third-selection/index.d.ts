import * as React from 'react';
import type { BooleanFieldProps } from '../scalar/index.js';

export interface SelectionGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children'> {
  /** Every member is disabled/read-only if the group or that member requests it. */
  disabled?: boolean;
  readOnly?: boolean;
  /** Together with each member's ownerRevision, explicitly retires old event/reset work. */
  ownerRevision?: string | number;
  /** Default native form association; explicit member.form wins, including empty string. */
  form?: string;
  /** Member onChange first, then this callback unless canceled, then member proposal.
   * Observers may finish after synchronous unmount; scalar proposals never do. */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
}
export interface Checkbox05Props extends SelectionGroupProps {
  standard?: BooleanFieldProps | null;
  medium?: BooleanFieldProps | null;
  large?: BooleanFieldProps | null;
  standardRef?: React.Ref<HTMLInputElement>;
  mediumRef?: React.Ref<HTMLInputElement>;
  largeRef?: React.Ref<HTMLInputElement>;
}
export interface Checkbox06Props extends SelectionGroupProps {
  salad?: BooleanFieldProps | null;
  wrap?: BooleanFieldProps | null;
  juice?: BooleanFieldProps | null;
  saladRef?: React.Ref<HTMLInputElement>;
  wrapRef?: React.Ref<HTMLInputElement>;
  juiceRef?: React.Ref<HTMLInputElement>;
}
export interface Checkbox08Props extends SelectionGroupProps {
  design?: BooleanFieldProps | null;
  marketing?: BooleanFieldProps | null;
  product?: BooleanFieldProps | null;
  designRef?: React.Ref<HTMLInputElement>;
  marketingRef?: React.Ref<HTMLInputElement>;
  productRef?: React.Ref<HTMLInputElement>;
}
export interface Switch05Props extends SelectionGroupProps {
  destructive?: BooleanFieldProps | null;
  success?: BooleanFieldProps | null;
  info?: BooleanFieldProps | null;
  warning?: BooleanFieldProps | null;
  destructiveRef?: React.Ref<HTMLInputElement>;
  successRef?: React.Ref<HTMLInputElement>;
  infoRef?: React.Ref<HTMLInputElement>;
  warningRef?: React.Ref<HTMLInputElement>;
}
export interface Switch07Props extends SelectionGroupProps {
  small?: BooleanFieldProps | null;
  medium?: BooleanFieldProps | null;
  large?: BooleanFieldProps | null;
  smallRef?: React.Ref<HTMLInputElement>;
  mediumRef?: React.Ref<HTMLInputElement>;
  largeRef?: React.Ref<HTMLInputElement>;
}
export interface SelectionSlot<Key extends string> {
  readonly key: Key;
  readonly label: string | null;
  readonly ariaLabel?: string;
  readonly defaultChecked: boolean;
  readonly size?: number;
}
export const CHECKBOX05_SLOTS: ReadonlyArray<SelectionSlot<'standard' | 'medium' | 'large'>>;
export const CHECKBOX06_SLOTS: ReadonlyArray<SelectionSlot<'salad' | 'wrap' | 'juice'>>;
export const CHECKBOX08_SLOTS: ReadonlyArray<SelectionSlot<'design' | 'marketing' | 'product'>>;
export const SWITCH05_SLOTS: ReadonlyArray<SelectionSlot<'destructive' | 'success' | 'info' | 'warning'>>;
export const SWITCH07_SLOTS: ReadonlyArray<SelectionSlot<'small' | 'medium' | 'large'>>;
/** Fixed three members; source initial checked true/true/true. Ref addresses the group div. */
export const Checkbox05: React.ForwardRefExoticComponent<Checkbox05Props & React.RefAttributes<HTMLDivElement>>;
/** Fixed snack badges, checked true/true/false. Label activation and focus remain native. */
export const Checkbox06: React.ForwardRefExoticComponent<Checkbox06Props & React.RefAttributes<HTMLDivElement>>;
/** Scalar source initial checked true; label and help are separately customizable. */
export const Checkbox07: React.ForwardRefExoticComponent<BooleanFieldProps & React.RefAttributes<HTMLInputElement>>;
/** Fixed role fields; source initial all false; group label defaults 团队角色. */
export const Checkbox08: React.ForwardRefExoticComponent<Checkbox08Props & React.RefAttributes<HTMLDivElement>>;
/** Fixed four independent outline switches, source initial all true. */
export const Switch05: React.ForwardRefExoticComponent<Switch05Props & React.RefAttributes<HTMLDivElement>>;
/** Scalar thin track and overhanging thumb, source initial false. */
export const Switch06: React.ForwardRefExoticComponent<BooleanFieldProps & React.RefAttributes<HTMLInputElement>>;
/** Fixed three independent sizes, source initial all false. */
export const Switch07: React.ForwardRefExoticComponent<Switch07Props & React.RefAttributes<HTMLDivElement>>;
/** Scalar default true. Source keeps both icons visible; checked highlights right X. */
export const Switch08: React.ForwardRefExoticComponent<BooleanFieldProps & React.RefAttributes<HTMLInputElement>>;
