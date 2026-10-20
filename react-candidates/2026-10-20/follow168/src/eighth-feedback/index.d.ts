import type * as React from 'react';
type NativeTextarea=React.TextareaHTMLAttributes<HTMLTextAreaElement>;
type TextOwner={value:NonNullable<NativeTextarea['value']>;defaultValue?:never}|{value?:undefined;defaultValue?:NativeTextarea['defaultValue']};
export type Textarea08Props=Omit<NativeTextarea,'value'|'defaultValue'|'children'|'dangerouslySetInnerHTML'>&TextOwner&{label?:React.ReactNode;description?:React.ReactNode;wrapperClassName?:string;children?:never;dangerouslySetInnerHTML?:never};
export declare const Textarea08:React.ForwardRefExoticComponent<Textarea08Props&React.RefAttributes<HTMLTextAreaElement>>;
export interface Dialog02ChangeDetails{id:'dialog-02';previousValue:boolean;controlled:boolean;reason:'trigger'|'escape'|'native-close'|'confirm'|'cancel';event?:React.SyntheticEvent|Event}
export interface Dialog02ActionDetails{id:'dialog-02';event:React.SyntheticEvent;localOnly:true}
type OpenOwner={open:boolean;defaultOpen?:never}|{open?:undefined;defaultOpen?:boolean};
export type Dialog02Props=OpenOwner&{onOpenChange?:(open:boolean,details:Dialog02ChangeDetails)=>void|boolean;triggerRef?:React.Ref<HTMLButtonElement>;dialogRef?:React.Ref<HTMLDialogElement>;disabled?:boolean;confirmDisabled?:boolean;title?:React.ReactNode;description?:React.ReactNode;triggerLabel?:React.ReactNode;cancelLabel?:React.ReactNode;confirmLabel?:React.ReactNode;onConfirm?:(details:Dialog02ActionDetails)=>void|boolean;onCancel?:(details:Dialog02ActionDetails)=>void|boolean;onNativeError?:(error:Error)=>void;className?:string;onKeyDownCapture?:React.KeyboardEventHandler<HTMLElement>;children?:never};
export declare function Dialog02(props:Dialog02Props):React.ReactElement;
