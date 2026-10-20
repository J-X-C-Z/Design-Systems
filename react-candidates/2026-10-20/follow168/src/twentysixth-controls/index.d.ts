import * as React from 'react';
export * from './accordion.js';
type Textarea20Owner =
  | { value: string | number | readonly string[]; defaultValue?: never }
  | { value?: never; defaultValue?: string | number | readonly string[] };
export type Textarea20Props = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'children' | 'dangerouslySetInnerHTML' | 'value' | 'defaultValue'> & Textarea20Owner & {
  label?: React.ReactNode;
  labelProps?: Omit<React.ComponentPropsWithRef<'label'>, 'children' | 'dangerouslySetInnerHTML' | 'htmlFor'>;
  wrapperClassName?: string;
};
export declare const Textarea20: React.ForwardRefExoticComponent<Textarea20Props & React.RefAttributes<HTMLTextAreaElement>>;
