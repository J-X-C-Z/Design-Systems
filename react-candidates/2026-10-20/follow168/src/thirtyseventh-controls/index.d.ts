import * as React from 'react';

export type RadioGroup07Value = 'beginner' | 'Advanced';
export type RadioGroup08Value = 'default' | 'medium' | 'large';
export type RadioGroup09Value = 'warning' | 'positive' | 'neutral';
export type RadioGroup10Value = '1' | '2' | '3';

type Radio164Id = 'radio-group-07' | 'radio-group-08' | 'radio-group-09' | 'radio-group-10';
/** Values and details describe a proposal; a controlled owner may refuse it. */
export type Radio164ChangeDetails<V extends string, I extends Radio164Id = Radio164Id> = {
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

type Radio164Owner<V extends string> =
  | {value: V | null; defaultValue?: never}
  | {value?: undefined; defaultValue?: V | null};
/** Ownership and visible-label relationships are protected. Explicit labelledby is supported. */
export type Radio164ItemProps = Omit<React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'defaultValue' | 'checked' | 'defaultChecked' | 'name' | 'form' |
  'required' | 'id' | 'tabIndex' | 'role' | 'aria-checked' | 'children' | 'dangerouslySetInnerHTML' | 'aria-label'
> & React.RefAttributes<HTMLInputElement>;
export type Radio164LabelProps = Omit<React.LabelHTMLAttributes<HTMLLabelElement>,
  'htmlFor' | 'children' | 'dangerouslySetInnerHTML'
> & React.RefAttributes<HTMLLabelElement>;
type Radio164Props<V extends string, I extends Radio164Id> = Omit<React.HTMLAttributes<HTMLDivElement>,
  'children' | 'dangerouslySetInnerHTML' | 'defaultValue' | 'defaultChecked'
> & Radio164Owner<V> & {
  name?: string;
  form?: string;
  required?: boolean;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  loop?: boolean;
  onValueChange?: (next: V | null, details: Radio164ChangeDetails<V, I>) => void | false;
  itemProps?: Partial<Record<V, Radio164ItemProps>>;
  labelProps?: Partial<Record<V, Radio164LabelProps>>;
};
export type RadioGroup07Props = Radio164Props<RadioGroup07Value, 'radio-group-07'>;
export type RadioGroup08Props = Radio164Props<RadioGroup08Value, 'radio-group-08'>;
export type RadioGroup09Props = Radio164Props<RadioGroup09Value, 'radio-group-09'>;
export type RadioGroup10Props = Radio164Props<RadioGroup10Value, 'radio-group-10'>;
export const RadioGroup07: React.ForwardRefExoticComponent<RadioGroup07Props & React.RefAttributes<HTMLDivElement>>;
export const RadioGroup08: React.ForwardRefExoticComponent<RadioGroup08Props & React.RefAttributes<HTMLDivElement>>;
export const RadioGroup09: React.ForwardRefExoticComponent<RadioGroup09Props & React.RefAttributes<HTMLDivElement>>;
export const RadioGroup10: React.ForwardRefExoticComponent<RadioGroup10Props & React.RefAttributes<HTMLDivElement>>;
