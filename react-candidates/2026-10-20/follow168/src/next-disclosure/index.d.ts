import type {ReactElement,KeyboardEventHandler,SyntheticEvent} from 'react';
import type {DisclosureItem,NormalizedDisclosureItem} from '../disclosure/index.js';
export type NextDisclosureIcon='search'|'flame'|'broadcast'|'wallet'|'shield'|'warning';
export interface NextDisclosureItem extends DisclosureItem{icon?:NextDisclosureIcon|null}
export interface NextDisclosureDetails<T>{id:'tabs-02'|'tabs-03'|'accordion-02'|'accordion-03';previousValue:T;controlled:boolean;reason:'click'|'keyboard'|'focus';event?:SyntheticEvent|Event}
export interface NextDisclosureProps<T>{items?:readonly NextDisclosureItem[];value?:T;defaultValue?:T;onValueChange?:(next:T,details:NextDisclosureDetails<T>)=>void|boolean;disabled?:boolean;label?:string;className?:string;onKeyDownCapture?:KeyboardEventHandler<HTMLElement>}
export interface NextTabsProps extends NextDisclosureProps<string|null>{dir?:'ltr'|'rtl';activationMode?:'automatic'|'manual'}
export interface NextAccordionProps extends NextDisclosureProps<readonly string[]>{}
export declare const tabs02Items:readonly NextDisclosureItem[];
export declare const tabs03Items:readonly NextDisclosureItem[];
export declare const accordion02Items:readonly NextDisclosureItem[];
export declare const accordion03Items:readonly NextDisclosureItem[];
export declare function normalizeNextDisclosureItems(input:unknown):(NormalizedDisclosureItem&{icon:NextDisclosureIcon|null})[];
export declare function Tabs02(props:NextTabsProps):ReactElement;
export declare function Tabs03(props:NextTabsProps):ReactElement;
export declare function Accordion02(props:NextAccordionProps):ReactElement;
export declare function Accordion03(props:NextAccordionProps):ReactElement;
