import * as React from 'react';
type Tabs30Owner<V extends string>={value:V|null;defaultValue?:never}|{value?:never;defaultValue?:V|null};
type Tabs30Trigger=Omit<React.ComponentPropsWithRef<'button'>,'children'|'dangerouslySetInnerHTML'|'type'|'role'|'id'|'aria-controls'|'aria-selected'|'tabIndex'>;
type Tabs30Panel=Omit<React.ComponentPropsWithRef<'div'>,'children'|'dangerouslySetInnerHTML'|'role'|'id'|'aria-labelledby'|'hidden'|'tabIndex'>;
type Tabs30List=Omit<React.ComponentPropsWithRef<'div'>,'children'|'dangerouslySetInnerHTML'|'role'|'aria-label'|'aria-orientation'>;
interface Tabs30Details<I extends string,V extends string>{id:I;previousValue:V|null;reason:'click'|'focus'|'keyboard';event:React.MouseEvent<HTMLButtonElement>|React.FocusEvent<HTMLButtonElement>|React.KeyboardEvent<HTMLButtonElement>;button:HTMLButtonElement;cancel():void;}
type Tabs30Props<I extends string,V extends string>=Omit<React.HTMLAttributes<HTMLDivElement>,'children'|'dangerouslySetInnerHTML'|'onChange'|'defaultValue'|'dir'>&Tabs30Owner<V>&{disabled?:boolean;activationMode?:'automatic'|'manual';orientation?:'horizontal'|'vertical';dir?:'ltr'|'rtl';loop?:boolean;label?:string;triggerProps?:Partial<Record<V,Tabs30Trigger>>;listProps?:Tabs30List;panelProps?:Partial<Record<V,Tabs30Panel>>;onValueChange?:(value:V|null,details:Tabs30Details<I,V>)=>void|boolean;};
export type Tabs06Value='conversions'|'engagement'|'bounce';
export type Tabs07Value='home'|'identity'|'preferences';
export type Tabs08Value='illustrate'|'design'|'animate';
export type Tabs09Value='standard'|'premium'|'ultimate';
export type Tabs06ChangeDetails=Tabs30Details<'tabs-06',Tabs06Value>;
export type Tabs07ChangeDetails=Tabs30Details<'tabs-07',Tabs07Value>;
export type Tabs08ChangeDetails=Tabs30Details<'tabs-08',Tabs08Value>;
export type Tabs09ChangeDetails=Tabs30Details<'tabs-09',Tabs09Value>;
export interface Tabs07TooltipChangeDetails{id:'tabs-07';previousValue:Tabs07Value|null;reason:'pointer'|'focus'|'leave'|'blur'|'escape'|'press';event:React.PointerEvent<HTMLElement>|React.FocusEvent<HTMLButtonElement>|React.MouseEvent<HTMLButtonElement>|React.KeyboardEvent<HTMLButtonElement>|KeyboardEvent;button:HTMLButtonElement;cancel():void;}
export type Tabs07TooltipProps=Tabs30Owner<Tabs07Value>&{disabled?:boolean;delayDuration?:number;onValueChange?:(value:Tabs07Value|null,details:Tabs07TooltipChangeDetails)=>void|boolean;};
export type Tabs06Props=Tabs30Props<'tabs-06',Tabs06Value>;
export type Tabs07Props=Tabs30Props<'tabs-07',Tabs07Value>&{tooltipProps?:Tabs07TooltipProps};
export type Tabs08Props=Tabs30Props<'tabs-08',Tabs08Value>;
export type Tabs09Props=Tabs30Props<'tabs-09',Tabs09Value>;
export const Tabs06:React.ForwardRefExoticComponent<Tabs06Props&React.RefAttributes<HTMLDivElement>>;
export const Tabs07:React.ForwardRefExoticComponent<Tabs07Props&React.RefAttributes<HTMLDivElement>>;
export const Tabs08:React.ForwardRefExoticComponent<Tabs08Props&React.RefAttributes<HTMLDivElement>>;
export const Tabs09:React.ForwardRefExoticComponent<Tabs09Props&React.RefAttributes<HTMLDivElement>>;
