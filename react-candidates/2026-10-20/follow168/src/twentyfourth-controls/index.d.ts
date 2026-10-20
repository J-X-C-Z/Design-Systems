import * as React from 'react';
export type Breadcrumb07Option='Updates'|'Changelog'|'Archive';
export type Breadcrumb07Reason='trigger'|'keyboard'|'escape'|'tab'|'select'|'pointer-outside'|'focus-outside';
export interface Breadcrumb07OpenDetails{id:'breadcrumb-07';reason:Breadcrumb07Reason;event:React.SyntheticEvent|Event;previousOpen:boolean;cancel():void;}
export interface Breadcrumb07SelectDetails{id:'breadcrumb-07';option:Breadcrumb07Option;event:React.MouseEvent<HTMLButtonElement>;cancel():void;}
type PathMenu07Owner={open:boolean;defaultOpen?:never}|{open?:never;defaultOpen?:boolean};
type PathMenu07Trigger=Omit<React.ComponentPropsWithRef<'button'>,'children'|'dangerouslySetInnerHTML'|'type'|'id'|'aria-haspopup'|'aria-expanded'|'aria-controls'>;
type PathMenu07Item=Omit<React.ComponentPropsWithRef<'button'>,'children'|'dangerouslySetInnerHTML'|'type'|'role'|'tabIndex'>;
export type Breadcrumb07Props=Omit<React.HTMLAttributes<HTMLElement>,'children'|'dangerouslySetInnerHTML'|'onSelect'> & PathMenu07Owner & {disabled?:boolean;onOpenChange?:(open:boolean,details:Breadcrumb07OpenDetails)=>void|boolean;onSelect?:(option:Breadcrumb07Option,details:Breadcrumb07SelectDetails)=>void|boolean;triggerProps?:PathMenu07Trigger;itemProps?:Partial<Record<Breadcrumb07Option,PathMenu07Item>>;linkProps?:Partial<Record<'home',Omit<React.ComponentPropsWithRef<'a'>,'children'|'dangerouslySetInnerHTML'>>>;};
export declare const Breadcrumb07:React.ForwardRefExoticComponent<Breadcrumb07Props & React.RefAttributes<HTMLElement>>;
type ResponseTextarea15Owner={value:string|number|readonly string[];defaultValue?:never}|{value?:never;defaultValue?:string|number|readonly string[]};
export type Textarea15Props=Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>,'children'|'dangerouslySetInnerHTML'|'value'|'defaultValue'> & ResponseTextarea15Owner & {label?:React.ReactNode;labelProps?:Omit<React.ComponentPropsWithRef<'label'>,'children'|'dangerouslySetInnerHTML'|'htmlFor'>;wrapperClassName?:string;};
export declare const Textarea15:React.ForwardRefExoticComponent<Textarea15Props & React.RefAttributes<HTMLTextAreaElement>>;
