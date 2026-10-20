import * as React from 'react';

export type RadioGroup11Value = '1' | '2';
export type RadioGroup12Value = 'starter' | 'pro';
export type RadioGroup13Value = '1' | '2' | '3' | '4' | '5';
type Radio168Id = 'radio-group-11' | 'radio-group-12' | 'radio-group-13';
/** Values and details describe a proposal; a controlled owner may refuse it. */
export type Radio168ChangeDetails<V extends string, I extends Radio168Id = Radio168Id> = {
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

type Radio168Owner<V extends string> =
  | {value: V | null; defaultValue?: never}
  | {value?: undefined; defaultValue?: V | null};
/** Ownership and visible-label relationships are protected. Explicit labelledby is supported. */
export type Radio168ItemProps = Omit<React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'defaultValue' | 'checked' | 'defaultChecked' | 'name' | 'form' |
  'required' | 'id' | 'tabIndex' | 'role' | 'aria-checked' | 'children' | 'dangerouslySetInnerHTML' | 'aria-label'
> & React.RefAttributes<HTMLInputElement>;
export type Radio168LabelProps = Omit<React.LabelHTMLAttributes<HTMLLabelElement>,
  'htmlFor' | 'children' | 'dangerouslySetInnerHTML'
> & React.RefAttributes<HTMLLabelElement>;
type Radio168Props<V extends string, I extends Radio168Id, E extends HTMLElement = HTMLDivElement, P = Partial<Record<V, Radio168ItemProps>>> = Omit<React.HTMLAttributes<E>,
  'children' | 'dangerouslySetInnerHTML' | 'defaultValue' | 'defaultChecked'
> & Radio168Owner<V> & {
  name?: string;
  form?: string;
  required?: boolean;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  loop?: boolean;
  onValueChange?: (next: V | null, details: Radio168ChangeDetails<V, I>) => void | false;
  itemProps?: P;
  labelProps?: Partial<Record<V, Radio168LabelProps>>;
};
export type RadioGroup11Props = Radio168Props<RadioGroup11Value, 'radio-group-11'>;
export type RadioGroup12Props = Radio168Props<RadioGroup12Value, 'radio-group-12'>;
export type RadioGroup13Props = Radio168Props<RadioGroup13Value, 'radio-group-13', HTMLFieldSetElement, Partial<Record<Exclude<RadioGroup13Value,'2'>,Radio168ItemProps>> & {'2'?: Omit<Radio168ItemProps,'disabled'> & {disabled?:true}}>;
export const RadioGroup11: React.ForwardRefExoticComponent<RadioGroup11Props & React.RefAttributes<HTMLDivElement>>;
export const RadioGroup12: React.ForwardRefExoticComponent<RadioGroup12Props & React.RefAttributes<HTMLDivElement>>;
export const RadioGroup13: React.ForwardRefExoticComponent<RadioGroup13Props & React.RefAttributes<HTMLFieldSetElement>>;

export type Switch19ChangeDetails = {
 readonly id: 'switch-19'; readonly previousChecked: boolean; readonly input: HTMLInputElement; cancel(): void;
} & ({readonly reason:'reset'; readonly event: Event; readonly input: HTMLInputElement} |
 {readonly reason:'select'; readonly event: React.MouseEvent<HTMLInputElement>; readonly input:HTMLInputElement} |
 {readonly reason:'keyboard'; readonly event:React.KeyboardEvent<HTMLInputElement>; readonly input:HTMLInputElement});
type Switch19Owner = {checked:boolean;defaultChecked?:never} | {checked?:undefined;defaultChecked?:boolean};
export type Switch19Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'|'role'|'checked'|'defaultChecked'|'children'|'dangerouslySetInnerHTML'|'aria-checked'|'aria-label'> & Switch19Owner & {
 'aria-checked'?:never; 'aria-label'?:never;
 onCheckedChange?: (next:boolean, details:Switch19ChangeDetails)=>void|false;
 rootProps?: Omit<React.HTMLAttributes<HTMLDivElement>,'children'|'dangerouslySetInnerHTML'> & React.RefAttributes<HTMLDivElement>;
};
export const Switch19:React.ForwardRefExoticComponent<Switch19Props & React.RefAttributes<HTMLInputElement>>;
