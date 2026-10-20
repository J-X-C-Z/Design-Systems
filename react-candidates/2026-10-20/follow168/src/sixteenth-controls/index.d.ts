import * as React from 'react';
export type StockTabValue='inventory'|'pending'|'shipped';
export interface Tabs04ChangeDetails {id:'tabs-04';previousValue:StockTabValue|null;reason:'click'|'focus'|'keyboard';event:React.SyntheticEvent<HTMLButtonElement>;button:HTMLButtonElement;cancel():void;}
type StockTabs04Owner={value:StockTabValue|null;defaultValue?:never}|{value?:never;defaultValue?:StockTabValue|null};
type StockTabs04TriggerProps=Omit<React.ComponentPropsWithRef<'button'>,'children'|'dangerouslySetInnerHTML'|'type'|'role'|'id'|'aria-controls'|'aria-selected'|'tabIndex'>;
export type Tabs04Props=Omit<React.HTMLAttributes<HTMLDivElement>,'children'|'dangerouslySetInnerHTML'|'defaultValue'|'onChange'> & StockTabs04Owner & {onValueChange?:(value:StockTabValue,details:Tabs04ChangeDetails)=>void|boolean;disabled?:boolean;activationMode?:'automatic'|'manual';orientation?:'horizontal'|'vertical';loop?:boolean;label?:string;triggerProps?:Partial<Record<StockTabValue,StockTabs04TriggerProps>>;};
export declare const Tabs04:React.ForwardRefExoticComponent<Tabs04Props & React.RefAttributes<HTMLDivElement>>;
export type Breadcrumb04Props=Omit<React.HTMLAttributes<HTMLElement>,'children'|'dangerouslySetInnerHTML'> & {linkProps?:Partial<Record<'library'|'resources',Omit<React.ComponentPropsWithRef<'a'>,'children'|'dangerouslySetInnerHTML'>>>;};
export declare const Breadcrumb04:React.ForwardRefExoticComponent<Breadcrumb04Props & React.RefAttributes<HTMLElement>>;
