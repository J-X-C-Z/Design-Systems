import type * as React from 'react';
type AckOwner={checked:boolean;defaultChecked?:never}|{checked?:undefined;defaultChecked?:boolean};
export type Dialog03AcknowledgmentProps=Omit<React.InputHTMLAttributes<HTMLInputElement>,'type'|'children'|'checked'|'defaultChecked'|'dangerouslySetInnerHTML'>&AckOwner&{ref?:React.Ref<HTMLInputElement>;type?:never;children?:never;dangerouslySetInnerHTML?:never};
export interface Dialog03ChangeDetails{id:'dialog-03';previousValue:boolean;controlled:boolean;reason:'trigger'|'escape'|'native-close'|'confirm'|'cancel';event?:React.SyntheticEvent|Event}
export interface Dialog03ActionDetails{id:'dialog-03';event:React.SyntheticEvent;localOnly:true;acknowledged:boolean}
type Dialog03OpenOwner={open:boolean;defaultOpen?:never}|{open?:undefined;defaultOpen?:boolean};
export type Dialog03Props=Dialog03OpenOwner&{onOpenChange?:(open:boolean,details:Dialog03ChangeDetails)=>void|boolean;triggerRef?:React.Ref<HTMLButtonElement>;dialogRef?:React.Ref<HTMLDialogElement>;disabled?:boolean;confirmDisabled?:boolean;title?:React.ReactNode;description?:React.ReactNode;triggerLabel?:React.ReactNode;cancelLabel?:React.ReactNode;confirmLabel?:React.ReactNode;onConfirm?:(details:Dialog03ActionDetails)=>void|boolean;onCancel?:(details:Dialog03ActionDetails)=>void|boolean;onNativeError?:(error:Error)=>void;className?:string;onKeyDownCapture?:React.KeyboardEventHandler<HTMLElement>;acknowledgment?:Dialog03AcknowledgmentProps;acknowledgmentLabel?:React.ReactNode;children?:never};
export declare function Dialog03(props:Dialog03Props):React.ReactElement;
