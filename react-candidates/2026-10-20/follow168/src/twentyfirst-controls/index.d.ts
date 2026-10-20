import * as React from 'react';
export type Breadcrumb05Props=Omit<React.HTMLAttributes<HTMLElement>,'children'|'dangerouslySetInnerHTML'> & {linkProps?:Partial<Record<'workspace'|'campaigns',Omit<React.ComponentPropsWithRef<'a'>,'children'|'dangerouslySetInnerHTML'>>>;};
export declare const Breadcrumb05:React.ForwardRefExoticComponent<Breadcrumb05Props & React.RefAttributes<HTMLElement>>;
type FloatingTextarea10Owner={value:string|number|readonly string[];defaultValue?:never}|{value?:never;defaultValue?:string|number|readonly string[]};
export type Textarea10Props=Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>,'children'|'dangerouslySetInnerHTML'|'value'|'defaultValue'> & FloatingTextarea10Owner & {label?:React.ReactNode;labelProps?:Omit<React.ComponentPropsWithRef<'label'>,'children'|'dangerouslySetInnerHTML'|'htmlFor'>;wrapperClassName?:string;};
export declare const Textarea10:React.ForwardRefExoticComponent<Textarea10Props & React.RefAttributes<HTMLTextAreaElement>>;
