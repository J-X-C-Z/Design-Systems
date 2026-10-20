import type * as React from 'react';

export interface FlatVectorSelectionScopeProps extends React.HTMLAttributes<HTMLDivElement> {
  mode?: 'light' | 'dark';
  paused?: boolean;
  reducedMotion?: boolean;
}
export interface SelectionState {
  readonly checked: boolean;
  readonly indeterminate: boolean;
}
export interface CheckedChangeDetails {
  readonly event: React.MouseEvent<HTMLInputElement>;
  readonly previousState: SelectionState;
  readonly nextState: SelectionState;
  readonly canceled: boolean;
  cancel(): void;
}
type CheckedOwnership =
  | { checked: boolean; defaultChecked?: never }
  | { checked?: undefined; defaultChecked?: boolean };
type MixedOwnership =
  | { indeterminate: boolean; defaultIndeterminate?: never }
  | { indeterminate?: undefined; defaultIndeterminate?: boolean };
type NativeProps = Omit<React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'role' | 'size' | 'children' | 'checked' | 'defaultChecked' | 'onChange' | 'aria-checked'>;
export type SelectionProps = NativeProps & CheckedOwnership & {
  /** Applied to the field wrapper. Other native input attributes reach the real input. */
  className?: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  onChange?: never;
  onCheckedChange?: (checked: boolean, details: CheckedChangeDetails) => void;
};
export type SwitchItemProps = SelectionProps & {
  size?: 'default' | 'sm';
  indeterminate?: never;
  defaultIndeterminate?: never;
};

export type Checkbox03Props = SelectionProps & MixedOwnership;
export type Switch03Tone = 'destructive' | 'success' | 'info' | 'warning';
export interface Switch03Props extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children?: never;
  /** Individual input state, callbacks, labels, form attributes and refs; defaults checked. */
  items?: Partial<Record<Switch03Tone, SwitchItemProps & React.RefAttributes<HTMLInputElement>>>;
}

export type Checkbox04Props=SelectionProps & {children?:never;indeterminate?:never;defaultIndeterminate?:never};
export type Switch02Props=SwitchItemProps & {children?:never};
