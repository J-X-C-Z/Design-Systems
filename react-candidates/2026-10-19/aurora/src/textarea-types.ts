import type * as React from 'react';
type TextOwnership={value:string;defaultValue?:never}|{value?:undefined;defaultValue?:string};
export type Textarea03Props=Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>,'value'|'defaultValue'|'children'> & TextOwnership & {children?:never;label?:React.ReactNode;description?:React.ReactNode;error?:React.ReactNode;reducedMotion?:boolean;};
