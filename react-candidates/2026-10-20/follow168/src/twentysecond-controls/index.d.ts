import * as React from 'react';
export type Pagination07Page=1|2|3;
export type Pagination07Link='first'|'previous'|'1'|'2'|'3'|'next'|'last';
type Pagination07AnchorProps=Omit<React.ComponentPropsWithRef<'a'>,'children'|'dangerouslySetInnerHTML'|'aria-current'|'aria-disabled'|'role'>;
export type Pagination07Props=Omit<React.HTMLAttributes<HTMLElement>,'children'|'dangerouslySetInnerHTML'|'role'> & {page?:Pagination07Page;disabled?:boolean;disabledLinks?:readonly Pagination07Link[];linkProps?:Partial<Record<Pagination07Link,Pagination07AnchorProps>>;};
export declare const Pagination07:React.ForwardRefExoticComponent<Pagination07Props & React.RefAttributes<HTMLElement>>;
type DisabledSummary12Owner={value:string|number|readonly string[];defaultValue?:never}|{value?:never;defaultValue?:string|number|readonly string[]};
export type Textarea12Props=Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>,'children'|'dangerouslySetInnerHTML'|'value'|'defaultValue'|'disabled'> & DisabledSummary12Owner & {disabled?:true;label?:React.ReactNode;labelProps?:Omit<React.ComponentPropsWithRef<'label'>,'children'|'dangerouslySetInnerHTML'|'htmlFor'>;wrapperClassName?:string;};
export declare const Textarea12:React.ForwardRefExoticComponent<Textarea12Props & React.RefAttributes<HTMLTextAreaElement>>;
