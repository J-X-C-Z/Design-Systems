import * as React from 'react';
import type { BooleanFieldProps, Textarea01Props } from '../scalar/index.js';
export interface MixedCheckboxValue { checked: boolean; indeterminate: boolean }
export interface Checkbox02Props extends Omit<BooleanFieldProps, 'checked' | 'defaultChecked' | 'onCheckedChange' | 'value' | 'defaultValue'> {
  /** Atomic ownership: null owns false/false; undefined releases last effective pair. */
  value?: MixedCheckboxValue | null;
  /** Mount-only reset pair; omitted defaults false/true. Runtime missing fields normalize false. */
  defaultValue?: MixedCheckboxValue;
  /** Proposal always clears indeterminate; controlled parents must accept with a render. */
  onValueChange?: (value: MixedCheckboxValue, event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Native successful-control string, distinct from the paired React value. Default "on". */
  submissionValue?: string;
}
export const Checkbox02: React.ForwardRefExoticComponent<Checkbox02Props & React.RefAttributes<HTMLInputElement>>;
export const Checkbox03: React.ForwardRefExoticComponent<BooleanFieldProps & React.RefAttributes<HTMLInputElement>>;
/** Source starts checked; the effective native checked state controls the label strike-through. */
export const Checkbox04: React.ForwardRefExoticComponent<BooleanFieldProps & React.RefAttributes<HTMLInputElement>>;
export const Switch02: React.ForwardRefExoticComponent<BooleanFieldProps & React.RefAttributes<HTMLInputElement>>;
export type Switch03Slot = 'destructive' | 'success' | 'info' | 'warning';
export const SWITCH03_SLOTS: ReadonlyArray<Readonly<{ key: Switch03Slot; label: string; defaultChecked: true }>>;
export interface Switch03Props extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children'> {
  /** Whole-composition safety gates, ORed with member props. Member false cannot bypass. */
  disabled?: boolean;
  readOnly?: boolean;
  ownerRevision?: string | number;
  /** Default association; any named member may explicitly use a different form. */
  form?: string;
  /** After member.onChange and only if it did not cancel; original native React event. */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  /** Four independent members. Missing/null member = source defaults, checked true. */
  destructive?: BooleanFieldProps | null;
  success?: BooleanFieldProps | null;
  info?: BooleanFieldProps | null;
  warning?: BooleanFieldProps | null;
  destructiveRef?: React.Ref<HTMLInputElement>;
  successRef?: React.Ref<HTMLInputElement>;
  infoRef?: React.Ref<HTMLInputElement>;
  warningRef?: React.Ref<HTMLInputElement>;
}
/** No aggregate value/defaultValue/values/defaultValues/onValueChange API. Ref is the group div. */
export const Switch03: React.ForwardRefExoticComponent<Switch03Props & React.RefAttributes<HTMLDivElement>>;
export const Switch04: React.ForwardRefExoticComponent<BooleanFieldProps & React.RefAttributes<HTMLInputElement>>;
export const Textarea02: React.ForwardRefExoticComponent<Textarea01Props & React.RefAttributes<HTMLTextAreaElement>>;
