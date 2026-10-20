import type * as React from 'react';
type Textarea11Owner={value:string;defaultValue?:never}|{value?:undefined;defaultValue?:string};
export type Textarea11Props=Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>,'value'|'defaultValue'|'children'|'dangerouslySetInnerHTML'>&Textarea11Owner&{label?:React.ReactNode;wrapperClassName?:string;children?:never;dangerouslySetInnerHTML?:never};
export declare const Textarea11:React.ForwardRefExoticComponent<Textarea11Props&React.RefAttributes<HTMLTextAreaElement>>;
export interface Pagination05ChangeDetails{event:React.MouseEvent<HTMLAnchorElement>;previousPage:number;page:number;readonly canceled:boolean;cancel():void}
type Pagination05Owner={page:number;defaultPage?:never}|{page?:undefined;defaultPage?:number};
export type Pagination05Props=Omit<React.HTMLAttributes<HTMLElement>,'children'|'dangerouslySetInnerHTML'|'onChange'>&Pagination05Owner&{pageCount?:number;disabled?:boolean;getPageHref?:(page:number,kind:'previous'|'page'|'next')=>string;onPageChange?:(page:number,details:Pagination05ChangeDetails)=>void;children?:never;dangerouslySetInnerHTML?:never};
export declare const Pagination05:React.ForwardRefExoticComponent<Pagination05Props&React.RefAttributes<HTMLElement>>;
