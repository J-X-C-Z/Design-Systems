import * as React from 'react';
type IdeaTextarea07Owner={value:string|number|readonly string[];defaultValue?:never}|{value?:never;defaultValue?:string|number|readonly string[]};
export type Textarea07Props=Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>,'children'|'dangerouslySetInnerHTML'|'value'|'defaultValue'> & IdeaTextarea07Owner & {label?:React.ReactNode;labelProps?:Omit<React.ComponentPropsWithRef<'label'>,'children'|'dangerouslySetInnerHTML'|'htmlFor'>;wrapperClassName?:string;};
export declare const Textarea07:React.ForwardRefExoticComponent<Textarea07Props & React.RefAttributes<HTMLTextAreaElement>>;
export type Pagination06Page=1|2|3;
export type Pagination06Link='previous'|'1'|'2'|'3'|'next';
type Pagination06AnchorProps=Omit<React.ComponentPropsWithRef<'a'>,'children'|'dangerouslySetInnerHTML'|'aria-current'|'aria-disabled'|'role'>;
export type Pagination06Props=Omit<React.HTMLAttributes<HTMLElement>,'children'|'dangerouslySetInnerHTML'|'role'> & {page?:Pagination06Page;disabled?:boolean;disabledLinks?:readonly Pagination06Link[];linkProps?:Partial<Record<Pagination06Link,Pagination06AnchorProps>>;};
export declare const Pagination06:React.ForwardRefExoticComponent<Pagination06Props & React.RefAttributes<HTMLElement>>;
