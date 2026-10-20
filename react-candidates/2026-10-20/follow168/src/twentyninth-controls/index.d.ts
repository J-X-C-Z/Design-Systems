import * as React from 'react';
import type {BooleanFieldProps}from'../scalar/index.js';
type Disclosure29Owner<T extends string>={expanded:readonly T[];defaultExpanded?:never}|{expanded?:never;defaultExpanded?:readonly T[]};
type Disclosure29Trigger=Omit<React.ComponentPropsWithRef<'button'>,'children'|'dangerouslySetInnerHTML'|'type'|'id'|'aria-expanded'|'aria-controls'>;
interface Disclosure29Details<I extends string,T extends string>{id:I;sectionId:T;open:boolean;previousExpanded:T[];event:React.MouseEvent<HTMLButtonElement>;button:HTMLButtonElement;cancel():void;}
type Disclosure29Props<I extends string,T extends string>=Omit<React.HTMLAttributes<HTMLDivElement>,'children'|'dangerouslySetInnerHTML'|'onChange'>&Disclosure29Owner<T>&{disabled?:boolean;triggerProps?:Partial<Record<T,Disclosure29Trigger>>;onExpandedChange?:(expanded:T[],details:Disclosure29Details<I,T>)=>void|boolean;};
type Disclosure29ValueOwner={value:string|number|readonly string[];defaultValue?:never}|{value?:never;defaultValue?:string|number|readonly string[]};
type Disclosure29Input=Omit<React.ComponentPropsWithRef<'input'>,'children'|'dangerouslySetInnerHTML'|'id'|'type'|'value'|'defaultValue'|'checked'|'defaultChecked'>&Disclosure29ValueOwner;
type Disclosure29Textarea=Omit<React.ComponentPropsWithRef<'textarea'>,'children'|'dangerouslySetInnerHTML'|'id'|'value'|'defaultValue'>&Disclosure29ValueOwner;
type Disclosure29Checkbox=Omit<BooleanFieldProps,'label'|'help'|'error'|'children'|'dangerouslySetInnerHTML'|'id'|'type'|'checked'|'defaultChecked'>&({checked:boolean;defaultChecked?:never}|{checked?:never;defaultChecked?:boolean})&React.RefAttributes<HTMLInputElement>;
export type Collapsible05Section='price'|'ratings'|'brand'|'battery';
export type Collapsible05Checkbox='rating-4'|'rating-3'|'rating-2'|'brand-apple'|'brand-samsung'|'brand-google'|'brand-oneplus'|'brand-xiaomi'|'battery-3500'|'battery-4000'|'battery-5000'|'battery-6000';
export type Collapsible05ChangeDetails=Disclosure29Details<'collapsible-05',Collapsible05Section>;
export type Collapsible05Props=Disclosure29Props<'collapsible-05',Collapsible05Section>&{inputProps?:Partial<Record<'min-price'|'max-price',Disclosure29Input>>;checkboxProps?:Partial<Record<Collapsible05Checkbox,Disclosure29Checkbox>>;};
export const Collapsible05:React.ForwardRefExoticComponent<Collapsible05Props&React.RefAttributes<HTMLDivElement>>;
export type Collapsible06Section='faq-1'|'faq-2';
export type Collapsible06ChangeDetails=Disclosure29Details<'collapsible-06',Collapsible06Section>;
export type Collapsible06Props=Disclosure29Props<'collapsible-06',Collapsible06Section>;
export const Collapsible06:React.ForwardRefExoticComponent<Collapsible06Props&React.RefAttributes<HTMLDivElement>>;
export type Collapsible09Section='address'|'delivery'|'payment';
export type Collapsible09ChangeDetails=Disclosure29Details<'collapsible-09',Collapsible09Section>;
export type Collapsible09DeliveryValue='1'|'2'|'3'|null;
export interface Collapsible09DeliveryChangeDetails{id:'collapsible-09';fieldId:'delivery';reason:'select'|'keyboard'|'reset';event:React.MouseEvent<HTMLInputElement>|React.KeyboardEvent<HTMLInputElement>|Event;input:HTMLInputElement|null;previousValue:Collapsible09DeliveryValue;cancel():void;}
type Disclosure29RadioItem=Omit<React.ComponentPropsWithRef<'input'>,'children'|'dangerouslySetInnerHTML'|'id'|'type'|'value'|'defaultValue'|'checked'|'defaultChecked'|'name'|'form'|'required'|'tabIndex'|'aria-label'|'aria-describedby'>;
export type Collapsible09DeliveryProps=Omit<React.HTMLAttributes<HTMLDivElement>,'children'|'dangerouslySetInnerHTML'|'role'|'defaultValue'|'onChange'>&({value:Collapsible09DeliveryValue;defaultValue?:never}|{value?:never;defaultValue?:Collapsible09DeliveryValue})&{ref?:React.Ref<HTMLDivElement>;disabled?:boolean;required?:boolean;name?:string;form?:string;itemProps?:Partial<Record<'1'|'2'|'3',Disclosure29RadioItem>>;labelProps?:Partial<Record<'1'|'2'|'3',Omit<React.LabelHTMLAttributes<HTMLLabelElement>,'children'|'dangerouslySetInnerHTML'|'htmlFor'>>>;onValueChange?:(value:Collapsible09DeliveryValue,details:Collapsible09DeliveryChangeDetails)=>void|boolean;};
export type Collapsible09Props=Disclosure29Props<'collapsible-09',Collapsible09Section>&{fieldProps?:Partial<Record<'full-name'|'pin-code'|'city-name'|'landmark'|'card-number'|'expiry'|'cvc',Disclosure29Input>>&{address?:Disclosure29Textarea};deliveryProps?:Collapsible09DeliveryProps;};
export const Collapsible09:React.ForwardRefExoticComponent<Collapsible09Props&React.RefAttributes<HTMLDivElement>>;
export type Collapsible08Section='settings'|'workspace';
export type Collapsible08Action='profile'|'appearance'|'notifications'|'billing'|'members'|'teams'|'projects'|'logout';
export type Collapsible08SectionChangeDetails=Disclosure29Details<'collapsible-08',Collapsible08Section>;
export type Collapsible08SectionsProps=Disclosure29Props<'collapsible-08',Collapsible08Section>&React.RefAttributes<HTMLDivElement>;
export interface Collapsible08OpenChangeDetails{id:'collapsible-08';reason:'trigger'|'keyboard'|'escape'|'tab'|'outside-pointer'|'outside-focus'|'action';previousOpen:boolean;event:React.MouseEvent<HTMLButtonElement>|React.KeyboardEvent<HTMLElement>|PointerEvent|FocusEvent;button:HTMLButtonElement;cancel():void;}
export interface Collapsible08ActionDetails{id:'collapsible-08';action:Collapsible08Action;event:React.MouseEvent<HTMLButtonElement>;button:HTMLButtonElement;cancel():void;}
export type Collapsible08Props=Omit<React.HTMLAttributes<HTMLDivElement>,'children'|'dangerouslySetInnerHTML'|'onChange'>&({open:boolean;defaultOpen?:never}|{open?:never;defaultOpen?:boolean})&{
 disabled?:boolean;onOpenChange?:(open:boolean,details:Collapsible08OpenChangeDetails)=>void|boolean;onAction?:(action:Collapsible08Action,details:Collapsible08ActionDetails)=>void|boolean;
 triggerProps?:Omit<Disclosure29Trigger,'aria-haspopup'>;
 menuProps?:Omit<React.ComponentPropsWithRef<'div'>,'children'|'dangerouslySetInnerHTML'|'id'|'role'|'tabIndex'|'aria-labelledby'>;
 sections?:Collapsible08SectionsProps;
 itemProps?:Partial<Record<Collapsible08Action,Omit<Disclosure29Trigger,'role'|'tabIndex'>>>;
};
export const Collapsible08:React.ForwardRefExoticComponent<Collapsible08Props&React.RefAttributes<HTMLDivElement>>;
