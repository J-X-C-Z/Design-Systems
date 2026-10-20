import * as React from 'react';
type Tabs35Owner<V extends string>={value:V|null;defaultValue?:never}|{value?:never;defaultValue?:V|null};
type Tabs35Trigger=Omit<React.ComponentPropsWithRef<'button'>,'children'|'dangerouslySetInnerHTML'|'type'|'role'|'id'|'aria-controls'|'aria-selected'|'tabIndex'>;
type Tabs35Panel=Omit<React.ComponentPropsWithRef<'div'>,'children'|'dangerouslySetInnerHTML'|'role'|'id'|'aria-labelledby'|'hidden'|'tabIndex'>;
type Tabs35List=Omit<React.ComponentPropsWithRef<'div'>,'children'|'dangerouslySetInnerHTML'|'role'|'aria-label'|'aria-orientation'>;
interface Tabs35Details<I extends string,V extends string>{id:I;previousValue:V|null;reason:'click'|'focus'|'keyboard';event:React.MouseEvent<HTMLButtonElement>|React.FocusEvent<HTMLButtonElement>|React.KeyboardEvent<HTMLButtonElement>;button:HTMLButtonElement;cancel():void;}
type Tabs35Props<I extends string,V extends string>=Omit<React.HTMLAttributes<HTMLDivElement>,'children'|'dangerouslySetInnerHTML'|'onChange'|'defaultValue'|'dir'>&Tabs35Owner<V>&{disabled?:boolean;activationMode?:'automatic'|'manual';orientation?:'horizontal'|'vertical';dir?:'ltr'|'rtl';loop?:boolean;label?:string;triggerProps?:Partial<Record<V,Tabs35Trigger>>;listProps?:Tabs35List;panelProps?:Partial<Record<V,Tabs35Panel>>;onValueChange?:(value:V|null,details:Tabs35Details<I,V>)=>void|boolean;};
export type Tabs26Value='specs'|'dimensions'|'box';
export type Tabs26ChangeDetails=Tabs35Details<'tabs-26',Tabs26Value>;
export type Tabs26Props=Tabs35Props<'tabs-26',Tabs26Value>;
export const Tabs26:React.ForwardRefExoticComponent<Tabs26Props&React.RefAttributes<HTMLDivElement>>;
type Textarea21Owner={value:string|number|readonly string[];defaultValue?:never}|{value?:never;defaultValue?:string|number|readonly string[]};
export type Textarea21Props=Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>,'children'|'dangerouslySetInnerHTML'|'value'|'defaultValue'>&Textarea21Owner&{label?:React.ReactNode;labelProps?:Omit<React.ComponentPropsWithRef<'label'>,'children'|'dangerouslySetInnerHTML'|'htmlFor'>;wrapperClassName?:string;};
export const Textarea21:React.ForwardRefExoticComponent<Textarea21Props&React.RefAttributes<HTMLTextAreaElement>>;
type IconButton35Props=Omit<React.ButtonHTMLAttributes<HTMLButtonElement>,'children'|'dangerouslySetInnerHTML'>&{label?:string;};
export type Button37Props=IconButton35Props;
export type Button38Props=IconButton35Props;
export const Button37:React.ForwardRefExoticComponent<Button37Props&React.RefAttributes<HTMLButtonElement>>;
export const Button38:React.ForwardRefExoticComponent<Button38Props&React.RefAttributes<HTMLButtonElement>>;
