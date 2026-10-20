import type * as React from 'react';
type Textarea06Owner={value:string;defaultValue?:never}|{value?:undefined;defaultValue?:string};
export type Textarea06Props=Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>,'value'|'defaultValue'|'children'|'dangerouslySetInnerHTML'>&Textarea06Owner&{label?:React.ReactNode;wrapperClassName?:string;children?:never;dangerouslySetInnerHTML?:never};
export declare const Textarea06:React.ForwardRefExoticComponent<Textarea06Props&React.RefAttributes<HTMLTextAreaElement>>;
export interface Dialog04ChangeDetails{id:'dialog-04';previousValue:boolean;controlled:boolean;reason:'trigger'|'escape'|'native-close'|'back'|'close-button'|'outside';event?:React.SyntheticEvent|Event}
export interface Dialog04ActionDetails{id:'dialog-04';event:React.SyntheticEvent;localOnly:true}
export interface Dialog04DismissDetails extends Dialog04ActionDetails{reason:'back'|'close-button'|'outside'}
type Dialog04Owner={open:boolean;defaultOpen?:never}|{open?:undefined;defaultOpen?:boolean};
export type Dialog04Props=Dialog04Owner&{onOpenChange?:(open:boolean,details:Dialog04ChangeDetails)=>void|boolean;triggerRef?:React.Ref<HTMLButtonElement>;dialogRef?:React.Ref<HTMLDialogElement>;scrollRef?:React.Ref<HTMLDivElement>;disabled?:boolean;readMoreDisabled?:boolean;title?:React.ReactNode;description?:React.ReactNode;triggerLabel?:React.ReactNode;backLabel?:React.ReactNode;readMoreLabel?:React.ReactNode;onReadMore?:(details:Dialog04ActionDetails)=>void;onDismiss?:(details:Dialog04DismissDetails)=>void|boolean;onNativeError?:(error:Error)=>void;className?:string;onKeyDownCapture?:React.KeyboardEventHandler<HTMLElement>;children?:never};
export declare function Dialog04(props:Dialog04Props):React.ReactElement;
