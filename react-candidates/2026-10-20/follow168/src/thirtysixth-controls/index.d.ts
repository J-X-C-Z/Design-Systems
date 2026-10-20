import * as React from 'react';

export type RadioGroup03Value = 'light' | 'dark' | 'system';
export type RadioGroup04Value = 'starter' | 'team' | 'premium';
export type RadioGroup05Value = '1' | '2' | '3';
export type RadioGroup06Value = 'starter' | 'pro';

type Radio160Id = 'radio-group-03' | 'radio-group-04' | 'radio-group-05' | 'radio-group-06';
/** Values and details describe a proposal; a controlled owner may refuse it. */
export type Radio160ChangeDetails<V extends string, I extends Radio160Id = Radio160Id> = {
  readonly id: I;
  readonly previousValue: V | null;
  cancel(): void;
} & ({
  readonly reason: 'reset';
  readonly event: Event;
  readonly input: null;
} | {
  readonly reason: 'select';
  readonly event: React.MouseEvent<HTMLInputElement>;
  readonly input: HTMLInputElement;
} | {
  readonly reason: 'keyboard';
  readonly event: React.KeyboardEvent<HTMLInputElement>;
  readonly input: HTMLInputElement;
});

type Radio160Owner<V extends string> =
  | {value: V | null; defaultValue?: never}
  | {value?: undefined; defaultValue?: V | null};
/** Ownership and visible-label relationships are protected. Explicit labelledby is supported. */
export type Radio160ItemProps = Omit<React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'defaultValue' | 'checked' | 'defaultChecked' | 'name' | 'form' |
  'required' | 'id' | 'tabIndex' | 'role' | 'aria-checked' | 'children' | 'dangerouslySetInnerHTML' | 'aria-label'
> & React.RefAttributes<HTMLInputElement>;
export type Radio160LabelProps = Omit<React.LabelHTMLAttributes<HTMLLabelElement>,
  'htmlFor' | 'children' | 'dangerouslySetInnerHTML'
> & React.RefAttributes<HTMLLabelElement>;
type Radio160Props<V extends string, I extends Radio160Id> = Omit<React.HTMLAttributes<HTMLDivElement>,
  'children' | 'dangerouslySetInnerHTML' | 'defaultValue' | 'defaultChecked'
> & Radio160Owner<V> & {
  name?: string;
  form?: string;
  required?: boolean;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  loop?: boolean;
  onValueChange?: (next: V | null, details: Radio160ChangeDetails<V, I>) => void | false;
  itemProps?: Partial<Record<V, Radio160ItemProps>>;
  labelProps?: Partial<Record<V, Radio160LabelProps>>;
};
export type RadioGroup03Props = Radio160Props<RadioGroup03Value, 'radio-group-03'>;
export type RadioGroup04Props = Radio160Props<RadioGroup04Value, 'radio-group-04'>;
export type RadioGroup05Props = Radio160Props<RadioGroup05Value, 'radio-group-05'>;
export type RadioGroup06Props = Radio160Props<RadioGroup06Value, 'radio-group-06'>;
export const RadioGroup03: React.ForwardRefExoticComponent<RadioGroup03Props & React.RefAttributes<HTMLDivElement>>;
export const RadioGroup04: React.ForwardRefExoticComponent<RadioGroup04Props & React.RefAttributes<HTMLDivElement>>;
export const RadioGroup05: React.ForwardRefExoticComponent<RadioGroup05Props & React.RefAttributes<HTMLDivElement>>;
export const RadioGroup06: React.ForwardRefExoticComponent<RadioGroup06Props & React.RefAttributes<HTMLDivElement>>;
