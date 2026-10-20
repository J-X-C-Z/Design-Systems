import type * as React from 'react';

export interface CelSelectionScopeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Warm paper by default; light changes the surrounding reading surface. */
  mode?: 'light' | 'dark';
  /** Finish and stop decorative feedback; inputs stay interactive. No replay on resume. */
  paused?: boolean;
  /** Also respects system reduced-motion and document visibility. */
  reducedMotion?: boolean;
}
export interface SelectionState {
  readonly checked: boolean;
  readonly indeterminate: boolean;
}
export interface CheckedChangeDetails {
  /** Native checkbox activation represented by React's click event, including Space/Enter. */
  readonly event: React.MouseEvent<HTMLInputElement>;
  readonly previousState: SelectionState;
  readonly nextState: SelectionState;
  readonly canceled: boolean;
  /** Cancel this activation. Newer explicit parent-controlled values still win. */
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
  /** One proposal per permitted activation; reset and prop updates do not invoke it. */
  onCheckedChange?: (checked: boolean, details: CheckedChangeDetails) => void;
};
export type Checkbox05Size = 'default' | 'medium' | 'large';
export type CheckboxItemProps = SelectionProps & MixedOwnership;
export interface Checkbox05Props extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
 children?: never;
 items?: Partial<Record<Checkbox05Size, CheckboxItemProps & {ref?: React.Ref<HTMLInputElement>}>>;
}
export type Switch05Tone = 'destructive' | 'success' | 'info' | 'warning';
export interface Switch05Props extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
 children?: never;
 items?: Partial<Record<Switch05Tone, SwitchItemProps & {ref?: React.Ref<HTMLInputElement>}>>;
}
export type SwitchItemProps = SelectionProps & {size?: 'default' | 'sm';indeterminate?:never;defaultIndeterminate?:never};

export type Checkbox06Snack='Salad'|'Wrap'|'Juice';
export type Checkbox06ItemProps=SelectionProps & {children?:never;indeterminate?:never;defaultIndeterminate?:never};
export interface Checkbox06Props extends Omit<React.HTMLAttributes<HTMLDivElement>,'children'>{children?:never;items?:Partial<Record<Checkbox06Snack,Checkbox06ItemProps & React.RefAttributes<HTMLInputElement>>>;}
export type Switch06Props=SwitchItemProps & {children?:never};
