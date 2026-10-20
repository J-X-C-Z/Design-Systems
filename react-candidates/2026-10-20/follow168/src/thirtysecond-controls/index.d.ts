import * as React from 'react';
type Tabs32Owner<V extends string>={value:V|null;defaultValue?:never}|{value?:never;defaultValue?:V|null};
type Tabs32Trigger=Omit<React.ComponentPropsWithRef<'button'>,'children'|'dangerouslySetInnerHTML'|'type'|'role'|'id'|'aria-controls'|'aria-selected'|'tabIndex'>;
type Tabs32Panel=Omit<React.ComponentPropsWithRef<'div'>,'children'|'dangerouslySetInnerHTML'|'role'|'id'|'aria-labelledby'|'hidden'|'tabIndex'>;
type Tabs32List=Omit<React.ComponentPropsWithRef<'div'>,'children'|'dangerouslySetInnerHTML'|'role'|'aria-label'|'aria-orientation'>;
interface Tabs32Details<I extends string,V extends string>{id:I;previousValue:V|null;reason:'click'|'focus'|'keyboard';event:React.MouseEvent<HTMLButtonElement>|React.FocusEvent<HTMLButtonElement>|React.KeyboardEvent<HTMLButtonElement>;button:HTMLButtonElement;cancel():void;}
type Tabs32Props<I extends string,V extends string>=Omit<React.HTMLAttributes<HTMLDivElement>,'children'|'dangerouslySetInnerHTML'|'onChange'|'defaultValue'|'dir'>&Tabs32Owner<V>&{disabled?:boolean;activationMode?:'automatic'|'manual';orientation?:'horizontal'|'vertical';dir?:'ltr'|'rtl';loop?:boolean;label?:string;triggerProps?:Partial<Record<V,Tabs32Trigger>>;listProps?:Tabs32List;panelProps?:Partial<Record<V,Tabs32Panel>>;onValueChange?:(value:V|null,details:Tabs32Details<I,V>)=>void|boolean;};
type Tabs32ActionButton=Omit<React.ComponentPropsWithRef<'button'>,'children'|'dangerouslySetInnerHTML'|'type'|'role'|'id'>;
interface Tabs32ActionDetails<I extends string,V extends string>{id:I;value:V;event:React.MouseEvent<HTMLButtonElement>;button:HTMLButtonElement;}
export type Tabs14Value='electronics'|'apparel'|'home'|'sports'|'beauty'|'auto'|'books'|'toys';
export type Tabs14ChangeDetails=Tabs32Details<'tabs-14',Tabs14Value>;
export type Tabs14Props=Tabs32Props<'tabs-14',Tabs14Value>;
export const Tabs14:React.ForwardRefExoticComponent<Tabs14Props&React.RefAttributes<HTMLDivElement>>;
export type Tabs15Value='residential'|'commercial'|'industrial';
export type Tabs15ChangeDetails=Tabs32Details<'tabs-15',Tabs15Value>;
export type Tabs15Props=Tabs32Props<'tabs-15',Tabs15Value>;
export const Tabs15:React.ForwardRefExoticComponent<Tabs15Props&React.RefAttributes<HTMLDivElement>>;
export type Tabs16Value='compute'|'storage'|'database';
export type Tabs16ChangeDetails=Tabs32Details<'tabs-16',Tabs16Value>;
export type Tabs16Action='deploy';
export type Tabs16ActionDetails=Tabs32ActionDetails<'tabs-16',Tabs16Value>;
export type Tabs16Props=Tabs32Props<'tabs-16',Tabs16Value>&{actionProps?:Partial<Record<Tabs16Value,Partial<Record<Tabs16Action,Tabs32ActionButton>>>>;onAction?:(action:Tabs16Action,details:Tabs16ActionDetails)=>void;};
export const Tabs16:React.ForwardRefExoticComponent<Tabs16Props&React.RefAttributes<HTMLDivElement>>;
export type Tabs17Value='telehealth'|'therapy'|'nutrition';
export type Tabs17ChangeDetails=Tabs32Details<'tabs-17',Tabs17Value>;
export type Tabs17Action='book'|'profile';
export type Tabs17ActionDetails=Tabs32ActionDetails<'tabs-17',Tabs17Value>;
export type Tabs17Props=Tabs32Props<'tabs-17',Tabs17Value>&{actionProps?:Partial<Record<Tabs17Value,Partial<Record<Tabs17Action,Tabs32ActionButton>>>>;onAction?:(action:Tabs17Action,details:Tabs17ActionDetails)=>void;};
export const Tabs17:React.ForwardRefExoticComponent<Tabs17Props&React.RefAttributes<HTMLDivElement>>;
