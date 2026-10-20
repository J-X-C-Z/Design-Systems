import type * as React from 'react';
type Owner={value:string;defaultValue?:never}|{value?:undefined;defaultValue?:string};
export type Textarea18Props=Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>,'value'|'defaultValue'|'maxLength'|'children'|'dangerouslySetInnerHTML'>&Owner&{label?:React.ReactNode;wrapperClassName?:string;maxLength?:never;children?:never;dangerouslySetInnerHTML?:never};
export declare const Textarea18:React.ForwardRefExoticComponent<Textarea18Props&React.RefAttributes<HTMLTextAreaElement>>;
