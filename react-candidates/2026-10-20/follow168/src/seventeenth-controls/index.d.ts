import * as React from 'react';
export type Accordion04Value='item-1'|'item-2'|'item-3';
type Accordion04Owner={value:readonly Accordion04Value[];defaultValue?:never}|{value?:never;defaultValue?:readonly Accordion04Value[]};
export interface Accordion04ChangeDetails{id:'accordion-04';itemId:Accordion04Value;open:boolean;previousValue:Accordion04Value[];event:React.MouseEvent<HTMLButtonElement>;button:HTMLButtonElement;cancel():void;}
type Accordion04TriggerProps=Omit<React.ComponentPropsWithRef<'button'>,'children'|'dangerouslySetInnerHTML'|'type'|'id'|'aria-expanded'|'aria-controls'>;
export type Accordion04Props=Omit<React.HTMLAttributes<HTMLDivElement>,'children'|'dangerouslySetInnerHTML'|'defaultValue'|'onChange'> & Accordion04Owner & {disabled?:boolean;orientation?:'vertical'|'horizontal';loop?:boolean;triggerProps?:Partial<Record<Accordion04Value,Accordion04TriggerProps>>;onValueChange?:(value:Accordion04Value[],details:Accordion04ChangeDetails)=>void|boolean;};
export declare const Accordion04:React.ForwardRefExoticComponent<Accordion04Props & React.RefAttributes<HTMLDivElement>>;
type StyledTextarea05Owner={value:string|number|readonly string[];defaultValue?:never}|{value?:never;defaultValue?:string|number|readonly string[]};
export type Textarea05Props=Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>,'children'|'dangerouslySetInnerHTML'|'value'|'defaultValue'> & StyledTextarea05Owner & {label?:React.ReactNode;labelProps?:Omit<React.ComponentPropsWithRef<'label'>,'children'|'dangerouslySetInnerHTML'|'htmlFor'>;wrapperClassName?:string;};
export declare const Textarea05:React.ForwardRefExoticComponent<Textarea05Props & React.RefAttributes<HTMLTextAreaElement>>;
