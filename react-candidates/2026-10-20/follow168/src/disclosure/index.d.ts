import type { ReactElement, Ref, KeyboardEventHandler, SyntheticEvent } from 'react';
export interface DisclosureItem {
  value: string;
  title?: string;
  name?: string;
  /** Missing/null uses before/emphasis/after. Explicit undefined or '' means empty content. */
  content?: string | null;
  before?: string;
  emphasis?: string;
  after?: string;
  disabled?: boolean;
}
export interface NormalizedDisclosureItem { value: string; title: string; content: string | null; before: string; emphasis: string; after: string; disabled: boolean }
export interface ChangeDetails<T> { id: 'tabs-01' | 'accordion-01' | 'dialog-01'; previousValue: T; controlled: boolean; reason: 'click' | 'keyboard' | 'focus' | 'trigger' | 'escape' | 'native-close' | 'confirm' | 'cancel'; event?: SyntheticEvent | Event }
export type ChangeRequest<T> = (next: T, details: ChangeDetails<T>) => void | boolean;
export interface CollectionProps<T> {
  items?: readonly DisclosureItem[];
  /** undefined releases control, preserving the last effective accepted value. */
  value?: T;
  /** Initial uncontrolled value only. */
  defaultValue?: T;
  onValueChange?: ChangeRequest<T>;
  disabled?: boolean;
  label?: string;
  className?: string;
  onKeyDownCapture?: KeyboardEventHandler<HTMLElement>;
}
export interface Tabs01Props extends CollectionProps<string | null> { dir?: 'ltr' | 'rtl'; activationMode?: 'automatic' | 'manual' }
/** Source semantics are multiple expansion; it is deliberately not a single/multiple union. */
export interface Accordion01Props extends CollectionProps<readonly string[]> {}
export interface DialogActionDetails { id: 'dialog-01'; event: SyntheticEvent; localOnly: true }
export interface Dialog01Props {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: ChangeRequest<boolean>;
  /** Ref to the one rendered trigger button; never a second/nested trigger. */
  triggerRef?: Ref<HTMLButtonElement>;
  /** Prevents opening and confirmation; cancellation remains reachable while open. */
  disabled?: boolean;
  confirmDisabled?: boolean;
  title?: string;
  description?: string;
  triggerLabel?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  onConfirm?: (details: DialogActionDetails) => void | boolean;
  onCancel?: (details: DialogActionDetails) => void | boolean;
  onNativeError?: (error: Error) => void;
  className?: string;
  onKeyDownCapture?: KeyboardEventHandler<HTMLElement>;
}
export declare const tabs01Items: readonly DisclosureItem[];
export declare const accordion01Items: readonly DisclosureItem[];
export declare function normalizeDisclosureItems(input: unknown): NormalizedDisclosureItem[];
export declare function Tabs01(props: Tabs01Props): ReactElement;
export declare function Accordion01(props: Accordion01Props): ReactElement;
export declare function Dialog01(props: Dialog01Props): ReactElement;
