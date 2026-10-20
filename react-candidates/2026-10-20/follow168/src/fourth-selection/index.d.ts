import * as React from 'react';
import type { BooleanFieldProps } from '../scalar/index.js';

export interface FourthSelectionGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children'> {
  disabled?: boolean;
  readOnly?: boolean;
  ownerRevision?: string | number;
  /** Member form takes precedence, including an explicit empty string. */
  form?: string;
  /** Member onChange, group onChange unless canceled, then member onCheckedChange proposal. */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
}
export interface Checkbox09Props extends FourthSelectionGroupProps {
  planning?: BooleanFieldProps | null;
  design?: BooleanFieldProps | null;
  operations?: BooleanFieldProps | null;
  planningRef?: React.Ref<HTMLInputElement>;
  designRef?: React.Ref<HTMLInputElement>;
  operationsRef?: React.Ref<HTMLInputElement>;
}
export interface Checkbox10Props extends FourthSelectionGroupProps {
  destructive?: BooleanFieldProps | null;
  info?: BooleanFieldProps | null;
  success?: BooleanFieldProps | null;
  destructiveRef?: React.Ref<HTMLInputElement>;
  infoRef?: React.Ref<HTMLInputElement>;
  successRef?: React.Ref<HTMLInputElement>;
}
export interface Checkbox11Props extends FourthSelectionGroupProps {
  triangle?: BooleanFieldProps | null;
  diamond?: BooleanFieldProps | null;
  hexagon?: BooleanFieldProps | null;
  triangleRef?: React.Ref<HTMLInputElement>;
  diamondRef?: React.Ref<HTMLInputElement>;
  hexagonRef?: React.Ref<HTMLInputElement>;
}
export interface Checkbox12Props extends Checkbox10Props {}
/** Fieldset events carry HTMLFieldSetElement; onChange remains the member input event.
 * disabled/form reflect on the native root and are independently forwarded as member defaults. */
export interface Switch12Props extends Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, 'onChange' | 'defaultValue' | 'children' | 'name'> {
  readOnly?: boolean;
  ownerRevision?: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  privacy?: BooleanFieldProps | null;
  notifications?: BooleanFieldProps | null;
  darkTheme?: BooleanFieldProps | null;
  privacyRef?: React.Ref<HTMLInputElement>;
  notificationsRef?: React.Ref<HTMLInputElement>;
  darkThemeRef?: React.Ref<HTMLInputElement>;
}
export interface FourthSelectionSlot<Key extends string> {
  readonly key: Key;
  readonly label: string | null;
  readonly ariaLabel: string;
  readonly defaultChecked: boolean;
  readonly icon?: string;
}
export const CHECKBOX09_SLOTS: ReadonlyArray<FourthSelectionSlot<'planning' | 'design' | 'operations'>>;
export const CHECKBOX10_SLOTS: ReadonlyArray<FourthSelectionSlot<'destructive' | 'info' | 'success'>>;
export const CHECKBOX11_SLOTS: ReadonlyArray<FourthSelectionSlot<'triangle' | 'diamond' | 'hexagon'>>;
export const CHECKBOX12_SLOTS: ReadonlyArray<FourthSelectionSlot<'destructive' | 'info' | 'success'>>;
export const SWITCH12_SLOTS: ReadonlyArray<FourthSelectionSlot<'privacy' | 'notifications' | 'darkTheme'>>;
/** Focus rows, false/false/false. Each member has its own native form field. */
export const Checkbox09: React.ForwardRefExoticComponent<Checkbox09Props & React.RefAttributes<HTMLDivElement>>;
/** Colored rounded squares, true/true/true. */
export const Checkbox10: React.ForwardRefExoticComponent<Checkbox10Props & React.RefAttributes<HTMLDivElement>>;
/** Triangle/diamond/hexagon, true/true/true; off retains outline. */
export const Checkbox11: React.ForwardRefExoticComponent<Checkbox11Props & React.RefAttributes<HTMLDivElement>>;
/** Persistent colored circles, true/true/true; off removes inset circle/check. */
export const Checkbox12: React.ForwardRefExoticComponent<Checkbox12Props & React.RefAttributes<HTMLDivElement>>;
/** Initially true. Checked shows left X; unchecked shows right check. */
export const Switch09: React.ForwardRefExoticComponent<BooleanFieldProps & React.RefAttributes<HTMLInputElement>>;
/** Initially true. Square track: checked sun, unchecked moon. Does not change application theme. */
export const Switch10: React.ForwardRefExoticComponent<BooleanFieldProps & React.RefAttributes<HTMLInputElement>>;
/** Initially true. Whole-card native target, title label and associated help. Does not sync data. */
export const Switch11: React.ForwardRefExoticComponent<BooleanFieldProps & React.RefAttributes<HTMLInputElement>>;
/** Native fieldset/legend/list, false/false/false; each member may own its form. */
export const Switch12: React.ForwardRefExoticComponent<Switch12Props & React.RefAttributes<HTMLFieldSetElement>>;
