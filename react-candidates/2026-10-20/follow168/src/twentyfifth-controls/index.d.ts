import * as React from 'react';
export type Breadcrumb08Props=Omit<React.HTMLAttributes<HTMLElement>,'children'|'dangerouslySetInnerHTML'> & {linkProps?:Partial<Record<'home'|'workspace',Omit<React.ComponentPropsWithRef<'a'>,'children'|'dangerouslySetInnerHTML'>>>;};
export declare const Breadcrumb08:React.ForwardRefExoticComponent<Breadcrumb08Props & React.RefAttributes<HTMLElement>>;
type Note16Owner={value:string|number|readonly string[];defaultValue?:never}|{value?:never;defaultValue?:string|number|readonly string[]};
export type Textarea16Props=Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>,'children'|'dangerouslySetInnerHTML'|'value'|'defaultValue'> & Note16Owner & {label?:React.ReactNode;labelProps?:Omit<React.ComponentPropsWithRef<'label'>,'children'|'dangerouslySetInnerHTML'|'htmlFor'>;wrapperClassName?:string;};
export declare const Textarea16:React.ForwardRefExoticComponent<Textarea16Props & React.RefAttributes<HTMLTextAreaElement>>;
