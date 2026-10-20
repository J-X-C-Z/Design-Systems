import * as React from 'react';
export type Accordion05Value='item-1'|'item-2'|'item-3';
type Accordion05Owner={value:readonly Accordion05Value[];defaultValue?:never}|{value?:never;defaultValue?:readonly Accordion05Value[]};
export interface Accordion05ChangeDetails{id:'accordion-05';itemId:Accordion05Value;open:boolean;previousValue:Accordion05Value[];event:React.MouseEvent<HTMLButtonElement>;button:HTMLButtonElement;cancel():void;}
type Accordion05TriggerProps=Omit<React.ComponentPropsWithRef<'button'>,'children'|'dangerouslySetInnerHTML'|'type'|'id'|'aria-expanded'|'aria-controls'>;
export type Accordion05Props=Omit<React.HTMLAttributes<HTMLDivElement>,'children'|'dangerouslySetInnerHTML'|'defaultValue'|'onChange'> & Accordion05Owner & {disabled?:boolean;orientation?:'vertical'|'horizontal';loop?:boolean;triggerProps?:Partial<Record<Accordion05Value,Accordion05TriggerProps>>;onValueChange?:(value:Accordion05Value[],details:Accordion05ChangeDetails)=>void|boolean;};
export declare const Accordion05:React.ForwardRefExoticComponent<Accordion05Props & React.RefAttributes<HTMLDivElement>>;
type StyledTextarea09Owner={value:string|number|readonly string[];defaultValue?:never}|{value?:never;defaultValue?:string|number|readonly string[]};
export type Textarea09Props=Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>,'children'|'dangerouslySetInnerHTML'|'value'|'defaultValue'> & StyledTextarea09Owner & {label?:React.ReactNode;labelProps?:Omit<React.ComponentPropsWithRef<'label'>,'children'|'dangerouslySetInnerHTML'|'htmlFor'>;wrapperClassName?:string;};
export declare const Textarea09:React.ForwardRefExoticComponent<Textarea09Props & React.RefAttributes<HTMLTextAreaElement>>;
