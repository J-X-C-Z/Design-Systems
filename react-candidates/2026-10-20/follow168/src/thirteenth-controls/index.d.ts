import type * as React from 'react';
type ThirteenthOwner={value:string;defaultValue?:never}|{value?:undefined;defaultValue?:string};
type ThirteenthNative=Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>,'value'|'defaultValue'|'children'|'dangerouslySetInnerHTML'>&ThirteenthOwner&{label?:React.ReactNode;wrapperClassName?:string;children?:never;dangerouslySetInnerHTML?:never};
export type Textarea13Props=ThirteenthNative;
export declare const Textarea13:React.ForwardRefExoticComponent<Textarea13Props&React.RefAttributes<HTMLTextAreaElement>>;
export type Textarea17ButtonProps=Omit<React.ButtonHTMLAttributes<HTMLButtonElement>,'children'|'dangerouslySetInnerHTML'>&{ref?:React.Ref<HTMLButtonElement>;children?:never;dangerouslySetInnerHTML?:never};
export type Textarea17Props=ThirteenthNative&{buttonLabel?:React.ReactNode;buttonProps?:Textarea17ButtonProps};
export declare const Textarea17:React.ForwardRefExoticComponent<Textarea17Props&React.RefAttributes<HTMLTextAreaElement>>;
