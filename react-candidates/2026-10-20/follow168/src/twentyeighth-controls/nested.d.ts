import * as React from 'react';
type Nested28Item='item-1'|'item-2'|'item-3';
type Nested28Faq='faq-1'|'faq-2'|'faq-3';
type Nested28Owner<T extends string>={value:readonly T[];defaultValue?:never}|{value?:never;defaultValue?:readonly T[]};
type Nested28Trigger=Omit<React.ComponentPropsWithRef<'button'>,'children'|'dangerouslySetInnerHTML'|'type'|'id'|'aria-controls'|'aria-expanded'>;
interface Nested28Details<Id extends string,T extends string>{id:Id;open:boolean;previousValue:T[];event:React.MouseEvent<HTMLButtonElement>;button:HTMLButtonElement;cancel():void;}
type Nested28OuterDetails<Id extends string>=Nested28Details<Id,Nested28Item>&{itemId:Nested28Item};
type Nested28FaqDetails<Id extends string>=Nested28Details<Id,Nested28Faq>&{categoryId:Nested28Item;faqId:Nested28Faq};
/** Per-category owner; uncontrolled FAQ state resets when its category unmounts. */
type Nested28FaqProps<Id extends string>=Omit<React.HTMLAttributes<HTMLDivElement>,'children'|'dangerouslySetInnerHTML'|'defaultValue'|'onChange'>&Nested28Owner<Nested28Faq>&{
 disabled?:boolean;ref?:React.Ref<HTMLDivElement>;triggerProps?:Partial<Record<Nested28Faq,Nested28Trigger>>;
 onValueChange?:(value:Nested28Faq[],details:Nested28FaqDetails<Id>)=>void|boolean;
};
type Nested28Props<Id extends string>=Omit<React.HTMLAttributes<HTMLDivElement>,'children'|'dangerouslySetInnerHTML'|'defaultValue'|'onChange'>&Nested28Owner<Nested28Item>&{
 disabled?:boolean;orientation?:'vertical'|'horizontal';loop?:boolean;
 triggerProps?:Partial<Record<Nested28Item,Nested28Trigger>>;
 faqProps?:Partial<Record<Nested28Item,Nested28FaqProps<Id>>>;
 onValueChange?:(value:Nested28Item[],details:Nested28OuterDetails<Id>)=>void|boolean;
};
/** Fixed3 categories ×3 FAQs; default category item-1 and default first FAQ per mounted category. All triggers type=button; native reset is non-mutating. */
export type Accordion15Value=Nested28Item;
export type Accordion15ChangeDetails=Nested28OuterDetails<'accordion-15'>;
export type Accordion15TriggerProps=Nested28Trigger;
export type Accordion15FaqValue=Nested28Faq;
export type Accordion15FaqChangeDetails=Nested28FaqDetails<'accordion-15'>;
export type Accordion15FaqProps=Nested28FaqProps<'accordion-15'>;
export type Accordion15Props=Nested28Props<'accordion-15'>;
export declare const Accordion15:React.ForwardRefExoticComponent<Accordion15Props&React.RefAttributes<HTMLDivElement>>;
export type Accordion16Value=Nested28Item;
export type Accordion16ChangeDetails=Nested28OuterDetails<'accordion-16'>;
export type Accordion16TriggerProps=Nested28Trigger;
export type Accordion16FaqValue=Nested28Faq;
export type Accordion16FaqChangeDetails=Nested28FaqDetails<'accordion-16'>;
export type Accordion16FaqProps=Nested28FaqProps<'accordion-16'>;
export type Accordion16Props=Nested28Props<'accordion-16'>;
export declare const Accordion16:React.ForwardRefExoticComponent<Accordion16Props&React.RefAttributes<HTMLDivElement>>;
