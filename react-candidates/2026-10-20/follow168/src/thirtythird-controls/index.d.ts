import * as React from 'react';
type Tabs33Owner<V extends string>={value:V|null;defaultValue?:never}|{value?:never;defaultValue?:V|null};
type Tabs33Trigger=Omit<React.ComponentPropsWithRef<'button'>,'children'|'dangerouslySetInnerHTML'|'type'|'role'|'id'|'aria-controls'|'aria-selected'|'tabIndex'>;
type Tabs33Panel=Omit<React.ComponentPropsWithRef<'div'>,'children'|'dangerouslySetInnerHTML'|'role'|'id'|'aria-labelledby'|'hidden'|'tabIndex'>;
type Tabs33List=Omit<React.ComponentPropsWithRef<'div'>,'children'|'dangerouslySetInnerHTML'|'role'|'aria-label'|'aria-orientation'>;
interface Tabs33Details<I extends string,V extends string>{id:I;previousValue:V|null;reason:'click'|'focus'|'keyboard';event:React.MouseEvent<HTMLButtonElement>|React.FocusEvent<HTMLButtonElement>|React.KeyboardEvent<HTMLButtonElement>;button:HTMLButtonElement;cancel():void;}
type Tabs33Props<I extends string,V extends string>=Omit<React.HTMLAttributes<HTMLDivElement>,'children'|'dangerouslySetInnerHTML'|'onChange'|'defaultValue'|'dir'>&Tabs33Owner<V>&{disabled?:boolean;activationMode?:'automatic'|'manual';orientation?:'horizontal'|'vertical';dir?:'ltr'|'rtl';loop?:boolean;label?:string;triggerProps?:Partial<Record<V,Tabs33Trigger>>;listProps?:Tabs33List;panelProps?:Partial<Record<V,Tabs33Panel>>;onValueChange?:(value:V|null,details:Tabs33Details<I,V>)=>void|boolean;};
type Tabs33ActionButton=Omit<React.ComponentPropsWithRef<'button'>,'children'|'dangerouslySetInnerHTML'|'type'|'role'|'id'>;
interface Tabs33ActionDetails<I extends string,V extends string>{id:I;value:V;event:React.MouseEvent<HTMLButtonElement>;button:HTMLButtonElement;}
export type Tabs18Value='todo'|'in-progress'|'done';
export type Tabs18ChangeDetails=Tabs33Details<'tabs-18',Tabs18Value>;
export type Tabs18Action='view-tasks';
export type Tabs18ActionDetails=Tabs33ActionDetails<'tabs-18',Tabs18Value>;
export type Tabs18Props=Tabs33Props<'tabs-18',Tabs18Value>&{actionProps?:Partial<Record<Tabs18Value,Partial<Record<Tabs18Action,Tabs33ActionButton>>>>;onAction?:(action:Tabs18Action,details:Tabs18ActionDetails)=>void;};
export const Tabs18:React.ForwardRefExoticComponent<Tabs18Props&React.RefAttributes<HTMLDivElement>>;
export type Tabs19Value='stays'|'flights'|'experiences';
export type Tabs19ChangeDetails=Tabs33Details<'tabs-19',Tabs19Value>;
export type Tabs19Action='explore';
export type Tabs19ActionDetails=Tabs33ActionDetails<'tabs-19',Tabs19Value>;
export type Tabs19Props=Tabs33Props<'tabs-19',Tabs19Value>&{actionProps?:Partial<Record<Tabs19Value,Partial<Record<Tabs19Action,Tabs33ActionButton>>>>;onAction?:(action:Tabs19Action,details:Tabs19ActionDetails)=>void;};
export const Tabs19:React.ForwardRefExoticComponent<Tabs19Props&React.RefAttributes<HTMLDivElement>>;
export type Tabs20Value='playlists'|'podcasts'|'radio';
export type Tabs20ChangeDetails=Tabs33Details<'tabs-20',Tabs20Value>;
export type Tabs20Props=Tabs33Props<'tabs-20',Tabs20Value>;
export const Tabs20:React.ForwardRefExoticComponent<Tabs20Props&React.RefAttributes<HTMLDivElement>>;
export type Tabs21Value='installation'|'config'|'deployment';
export type Tabs21ChangeDetails=Tabs33Details<'tabs-21',Tabs21Value>;
export interface Tabs21TooltipChangeDetails{id:'tabs-21';previousValue:Tabs21Value|null;reason:'pointer'|'focus'|'leave'|'blur'|'escape'|'press';event:React.PointerEvent<HTMLElement>|React.FocusEvent<HTMLButtonElement>|React.MouseEvent<HTMLButtonElement>|React.KeyboardEvent<HTMLButtonElement>|KeyboardEvent;button:HTMLButtonElement;cancel():void;}
export type Tabs21TooltipProps=Tabs33Owner<Tabs21Value>&{disabled?:boolean;delayDuration?:number;onValueChange?:(value:Tabs21Value|null,details:Tabs21TooltipChangeDetails)=>void|boolean;};
export type Tabs21Props=Tabs33Props<'tabs-21',Tabs21Value>&{tooltipProps?:Tabs21TooltipProps};
export const Tabs21:React.ForwardRefExoticComponent<Tabs21Props&React.RefAttributes<HTMLDivElement>>;
