import type * as React from 'react';
export interface SelectionState{readonly checked:boolean;readonly indeterminate:boolean}
export interface CheckedChangeDetails{readonly event:React.MouseEvent<HTMLInputElement>;readonly previousState:SelectionState;readonly nextState:SelectionState;readonly canceled:boolean;cancel():void}
export type FollowToggleChangeDetails=CheckedChangeDetails;
type Owner={checked:boolean;defaultChecked?:never}|{checked?:undefined;defaultChecked?:boolean};
type Native=Omit<React.InputHTMLAttributes<HTMLInputElement>,'type'|'role'|'size'|'children'|'checked'|'defaultChecked'|'onChange'|'aria-checked'>;
export type FollowToggleProps=Native&Owner&{
 label?:React.ReactNode;description?:React.ReactNode;size?:'default'|'sm';onChange?:never;indeterminate?:never;defaultIndeterminate?:never;
 onCheckedChange?:(checked:boolean,details:FollowToggleChangeDetails)=>void;
};
