import * as React from 'react';
type Tabs34Owner<V extends string>={value:V|null;defaultValue?:never}|{value?:never;defaultValue?:V|null};
type Tabs34Trigger=Omit<React.ComponentPropsWithRef<'button'>,'children'|'dangerouslySetInnerHTML'|'type'|'role'|'id'|'aria-controls'|'aria-selected'|'tabIndex'>;
type Tabs34Panel=Omit<React.ComponentPropsWithRef<'div'>,'children'|'dangerouslySetInnerHTML'|'role'|'id'|'aria-labelledby'|'hidden'|'tabIndex'>;
type Tabs34List=Omit<React.ComponentPropsWithRef<'div'>,'children'|'dangerouslySetInnerHTML'|'role'|'aria-label'|'aria-orientation'>;
interface Tabs34Details<I extends string,V extends string>{id:I;previousValue:V|null;reason:'click'|'focus'|'keyboard';event:React.MouseEvent<HTMLButtonElement>|React.FocusEvent<HTMLButtonElement>|React.KeyboardEvent<HTMLButtonElement>;button:HTMLButtonElement;cancel():void;}
type Tabs34Props<I extends string,V extends string>=Omit<React.HTMLAttributes<HTMLDivElement>,'children'|'dangerouslySetInnerHTML'|'onChange'|'defaultValue'|'dir'>&Tabs34Owner<V>&{disabled?:boolean;activationMode?:'automatic'|'manual';orientation?:'horizontal'|'vertical';dir?:'ltr'|'rtl';loop?:boolean;label?:string;triggerProps?:Partial<Record<V,Tabs34Trigger>>;listProps?:Tabs34List;panelProps?:Partial<Record<V,Tabs34Panel>>;onValueChange?:(value:V|null,details:Tabs34Details<I,V>)=>void|boolean;};
export type Tabs22Value='v4'|'v3.2'|'v3';
export type Tabs22ChangeDetails=Tabs34Details<'tabs-22',Tabs22Value>;
export type Tabs22Props=Tabs34Props<'tabs-22',Tabs22Value>;
export const Tabs22:React.ForwardRefExoticComponent<Tabs22Props&React.RefAttributes<HTMLDivElement>>;
export type Tabs23Value='mentions'|'direct'|'system';
export type Tabs23ChangeDetails=Tabs34Details<'tabs-23',Tabs23Value>;
export type Tabs23Props=Tabs34Props<'tabs-23',Tabs23Value>;
export const Tabs23:React.ForwardRefExoticComponent<Tabs23Props&React.RefAttributes<HTMLDivElement>>;
export type Tabs24Value='traffic'|'sales'|'acquisition';
export type Tabs24ChangeDetails=Tabs34Details<'tabs-24',Tabs24Value>;
export type Tabs24Props=Tabs34Props<'tabs-24',Tabs24Value>;
export const Tabs24:React.ForwardRefExoticComponent<Tabs24Props&React.RefAttributes<HTMLDivElement>>;
export type Tabs25Value='engineering'|'design'|'marketing';
export type Tabs25ChangeDetails=Tabs34Details<'tabs-25',Tabs25Value>;
type Tabs34MemberButton=Omit<React.ComponentPropsWithRef<'button'>,'children'|'dangerouslySetInnerHTML'|'type'|'role'|'id'|'aria-label'|'aria-labelledby'|'aria-hidden'|'aria-haspopup'|'aria-expanded'>;
export interface Tabs25MemberIds{engineering:'alice-chen'|'bob-smith'|'charlie-davis';design:'diana-prince'|'evan-wright';marketing:'fiona-gallagher'|'george-miller'|'hannah-lee';}
export type Tabs25MemberId=Tabs25MemberIds[Tabs25Value];
export type Tabs25Action='email'|'more';
export type Tabs25ActionDetails={[V in Tabs25Value]:{readonly id:'tabs-25';readonly value:V;readonly memberId:Tabs25MemberIds[V];readonly memberName:string;readonly memberRole:string;readonly memberStatus:'Online'|'Busy'|'Offline';readonly event:React.MouseEvent<HTMLButtonElement>;readonly button:HTMLButtonElement;}}[Tabs25Value];
export type Tabs25ActionProps={[V in Tabs25Value]?:{[M in Tabs25MemberIds[V]]?:Partial<Record<Tabs25Action,Tabs34MemberButton>>}};
export type Tabs25Props=Tabs34Props<'tabs-25',Tabs25Value>&{actionProps?:Tabs25ActionProps;onAction?:(action:Tabs25Action,details:Tabs25ActionDetails)=>void;};
export const Tabs25:React.ForwardRefExoticComponent<Tabs25Props&React.RefAttributes<HTMLDivElement>>;
