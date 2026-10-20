import type * as React from 'react';
type Textarea19Owner={value:string;defaultValue?:never}|{value?:undefined;defaultValue?:string};
export type Textarea19FieldProps=Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>,'value'|'defaultValue'|'children'|'dangerouslySetInnerHTML'>&Textarea19Owner&{ref?:React.Ref<HTMLTextAreaElement>;label?:React.ReactNode;children?:never;dangerouslySetInnerHTML?:never};
export type Textarea19Props=Omit<React.HTMLAttributes<HTMLDivElement>,'children'|'dangerouslySetInnerHTML'>&{fields?:Partial<Record<'compact'|'standard'|'expanded',Textarea19FieldProps>>;children?:never;dangerouslySetInnerHTML?:never};
export declare const Textarea19:React.ForwardRefExoticComponent<Textarea19Props&React.RefAttributes<HTMLDivElement>>;
type Breadcrumb03Visual={label:React.ReactNode;symbol?:'home'|'folder'|'document';icon?:React.ReactNode};
export type Breadcrumb03Segment=Breadcrumb03Visual&(
 (Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>,'children'|'dangerouslySetInnerHTML'|'href'|'aria-current'>&{href:string;current?:false;disabled?:boolean;ref?:React.Ref<HTMLAnchorElement>;children?:never;dangerouslySetInnerHTML?:never})|
 {current:true;href?:never;id?:string;title?:string;className?:string;'aria-label'?:string;onClick?:never;disabled?:never;ref?:never});
export type Breadcrumb03Props=Omit<React.HTMLAttributes<HTMLElement>,'children'|'dangerouslySetInnerHTML'>&{segments?:readonly Breadcrumb03Segment[];children?:never;dangerouslySetInnerHTML?:never};
export declare const Breadcrumb03:React.ForwardRefExoticComponent<Breadcrumb03Props&React.RefAttributes<HTMLElement>>;
