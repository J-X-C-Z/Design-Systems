import * as React from 'react';
export type SettingsTabValue='profile'|'preferences'|'security';
export interface Tabs05ChangeDetails {id:'tabs-05';previousValue:SettingsTabValue|null;reason:'click'|'focus'|'keyboard';event:React.SyntheticEvent<HTMLButtonElement>;button:HTMLButtonElement;cancel():void;}
type SettingsTabs05Owner={value:SettingsTabValue|null;defaultValue?:never}|{value?:never;defaultValue?:SettingsTabValue|null};
type SettingsTabs05TriggerProps=Omit<React.ComponentPropsWithRef<'button'>,'children'|'dangerouslySetInnerHTML'|'type'|'role'|'id'|'aria-controls'|'aria-selected'|'tabIndex'>;
export type Tabs05Props=Omit<React.HTMLAttributes<HTMLDivElement>,'children'|'dangerouslySetInnerHTML'|'defaultValue'|'onChange'> & SettingsTabs05Owner & {onValueChange?:(value:SettingsTabValue,details:Tabs05ChangeDetails)=>void|boolean;disabled?:boolean;activationMode?:'automatic'|'manual';orientation?:'horizontal'|'vertical';loop?:boolean;label?:string;triggerProps?:Partial<Record<SettingsTabValue,SettingsTabs05TriggerProps>>;};
export declare const Tabs05:React.ForwardRefExoticComponent<Tabs05Props & React.RefAttributes<HTMLDivElement>>;
type EmailAlert10Owner={open:boolean;defaultOpen?:never}|{open?:never;defaultOpen?:boolean};
export interface Alerts10CloseDetails{id:'alerts-10';reason:'close';event:React.MouseEvent<HTMLButtonElement>;button:HTMLButtonElement;localOnly:true;cancel():void;}
export type Alerts10Props=Omit<React.HTMLAttributes<HTMLDivElement>,'children'|'dangerouslySetInnerHTML'|'role'> & EmailAlert10Owner & {disabled?:boolean;onOpenChange?:(open:false,details:Alerts10CloseDetails)=>void|boolean;closeButtonProps?:Omit<React.ComponentPropsWithRef<'button'>,'children'|'dangerouslySetInnerHTML'>;};
export declare const Alerts10:React.ForwardRefExoticComponent<Alerts10Props & React.RefAttributes<HTMLDivElement>>;
