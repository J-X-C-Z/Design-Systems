import * as React from 'react';
export type Breadcrumb06Option='Tokens'|'Components'|'Patterns';
export type Breadcrumb06Reason='trigger'|'keyboard'|'escape'|'tab'|'select'|'pointer-outside'|'focus-outside';
export interface Breadcrumb06OpenDetails{id:'breadcrumb-06';reason:Breadcrumb06Reason;event:React.SyntheticEvent|Event;previousOpen:boolean;cancel():void;}
export interface Breadcrumb06SelectDetails{id:'breadcrumb-06';option:Breadcrumb06Option;event:React.MouseEvent<HTMLButtonElement>;cancel():void;}
type PathMenu06Owner={open:boolean;defaultOpen?:never}|{open?:never;defaultOpen?:boolean};
type PathMenu06Trigger=Omit<React.ComponentPropsWithRef<'button'>,'children'|'dangerouslySetInnerHTML'|'type'|'id'|'aria-haspopup'|'aria-expanded'|'aria-controls'>;
type PathMenu06Item=Omit<React.ComponentPropsWithRef<'button'>,'children'|'dangerouslySetInnerHTML'|'type'|'role'|'tabIndex'>;
export type Breadcrumb06Props=Omit<React.HTMLAttributes<HTMLElement>,'children'|'dangerouslySetInnerHTML'|'onSelect'> & PathMenu06Owner & {disabled?:boolean;onOpenChange?:(open:boolean,details:Breadcrumb06OpenDetails)=>void|boolean;onSelect?:(option:Breadcrumb06Option,details:Breadcrumb06SelectDetails)=>void|boolean;triggerProps?:PathMenu06Trigger;itemProps?:Partial<Record<Breadcrumb06Option,PathMenu06Item>>;linkProps?:Partial<Record<'home'|'projects',Omit<React.ComponentPropsWithRef<'a'>,'children'|'dangerouslySetInnerHTML'>>>;};
export declare const Breadcrumb06:React.ForwardRefExoticComponent<Breadcrumb06Props & React.RefAttributes<HTMLElement>>;
type LiveTextarea14Owner={value:string|number|readonly string[];defaultValue?:never}|{value?:never;defaultValue?:string|number|readonly string[]};
export type Textarea14Props=Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>,'children'|'dangerouslySetInnerHTML'|'value'|'defaultValue'> & LiveTextarea14Owner & {label?:React.ReactNode;labelProps?:Omit<React.ComponentPropsWithRef<'label'>,'children'|'dangerouslySetInnerHTML'|'htmlFor'>;wrapperClassName?:string;};
export declare const Textarea14:React.ForwardRefExoticComponent<Textarea14Props & React.RefAttributes<HTMLTextAreaElement>>;
