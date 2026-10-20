import type * as React from 'react';
export interface SelectionState{readonly checked:boolean;readonly indeterminate:boolean}
export interface CheckedChangeDetails{readonly event:React.MouseEvent<HTMLInputElement>;readonly previousState:SelectionState;readonly nextState:SelectionState;readonly canceled:boolean;cancel():void}
type CheckedOwnership={checked:boolean;defaultChecked?:never}|{checked?:undefined;defaultChecked?:boolean};
type MixedOwnership={indeterminate:boolean;defaultIndeterminate?:never}|{indeterminate?:undefined;defaultIndeterminate?:boolean};
type Native=Omit<React.InputHTMLAttributes<HTMLInputElement>,'type'|'role'|'size'|'children'|'checked'|'defaultChecked'|'onChange'|'aria-checked'>;
export type FollowSelectionItemProps=Native&CheckedOwnership&MixedOwnership&{
 label?:React.ReactNode;description?:React.ReactNode;onChange?:never;onCheckedChange?:(checked:boolean,details:CheckedChangeDetails)=>void;
};
type WithoutMixed<T> = T extends unknown ? Omit<T,'indeterminate'|'defaultIndeterminate'> : never;
export type FollowSwitchItemProps=WithoutMixed<FollowSelectionItemProps>&{indeterminate?:never;defaultIndeterminate?:never};
export interface Checkbox13Props extends Omit<React.HTMLAttributes<HTMLDivElement>,'children'>{
 children?:never;items?:Partial<Record<'auto-start'|'auto-update',FollowSelectionItemProps&{ref?:React.Ref<HTMLInputElement>}>>;
}
export interface Checkbox14Props extends Omit<React.HTMLAttributes<HTMLUListElement>,'children'>{
 children?:never;items?:Partial<Record<'frontend-engineering'|'business-insights'|'visual-branding',FollowSelectionItemProps&{ref?:React.Ref<HTMLInputElement>}>>;
}
export type FollowSwitchProps=FollowSwitchItemProps;
