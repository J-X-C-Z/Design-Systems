import * as React from 'react';
export declare const celSelectionIds: readonly ['checkbox-03','switch-04'];
export interface CelSelectionScopeProps extends React.HTMLAttributes<HTMLDivElement>{mode?:'light'|'dark';paused?:boolean}
export declare function CelSelectionScope(props:CelSelectionScopeProps):React.ReactElement;
export interface CheckedChangeDetails {readonly event:React.MouseEvent<HTMLInputElement>;cancel():void;readonly canceled:boolean}
type NativeProps=Omit<React.InputHTMLAttributes<HTMLInputElement>,'type'|'children'|'size'|'checked'|'defaultChecked'|'onChange'|'role'>;
type StateProps={checked:boolean;defaultChecked?:never}|{checked?:undefined;defaultChecked?:boolean};
export type CelSelectionProps=NativeProps & StateProps & {label?:React.ReactNode;description?:React.ReactNode;onChange?:never;onCheckedChange?:(checked:boolean,details:CheckedChangeDetails)=>void};
export declare const CelCheckbox03:React.ForwardRefExoticComponent<CelSelectionProps & React.RefAttributes<HTMLInputElement>>;
export declare const CelSwitch04:React.ForwardRefExoticComponent<CelSelectionProps & React.RefAttributes<HTMLInputElement>>;
