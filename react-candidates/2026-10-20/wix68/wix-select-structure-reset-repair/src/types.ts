import type * as React from 'react';

export interface SelectOption { readonly value: string; readonly label: string; readonly disabled?: boolean; readonly options?: never; readonly separator?: never }
export interface SelectGroup { readonly label: string; readonly options: readonly SelectOption[]; readonly disabled?: boolean; readonly value?: never; readonly separator?: never }
/** Decorative, nonselectable division. It is omitted from the native form bridge. */
export interface SelectSeparator { readonly separator: true; readonly value?: never; readonly label?: never; readonly options?: never; readonly disabled?: never }
export type SelectItem = SelectOption | SelectGroup | SelectSeparator;
export type SelectValueChangeReason = 'pointer' | 'keyboard';
export type SelectOpenChangeReason = 'trigger' | 'keyboard' | 'selection' | 'escape' | 'tab' | 'outside-pointer' | 'focus-out';
export interface SelectChangeDetail<Reason extends string> {
  readonly reason: Reason;
  readonly originalEvent: Event;
  readonly cancelable: true;
  readonly defaultPrevented: boolean;
  /** Synchronous cancellation of this proposal only; does not cancel the DOM event. */
  preventDefault(): void;
}
export type SelectValueChangeDetail = SelectChangeDetail<SelectValueChangeReason>;
export type SelectOpenChangeDetail = SelectChangeDetail<SelectOpenChangeReason>;
export type SelectValueChangeHandler = (value: string, detail: SelectValueChangeDetail) => void;
export type SelectOpenChangeHandler = (open: boolean, detail: SelectOpenChangeDetail) => void;
/** Only these button props are supported. Structural/selection/native-form props are owned by the component. */
export type SelectTriggerProps = Pick<React.ButtonHTMLAttributes<HTMLButtonElement>,
  'title' | 'tabIndex' | 'autoFocus' | 'onClick' | 'onClickCapture' |
  'onKeyDown' | 'onKeyDownCapture' | 'onPointerDown' | 'onPointerDownCapture' |
  'onFocus' | 'onFocusCapture' | 'onBlur' | 'onBlurCapture'>;
export interface SelectStructureCommonProps {
  readonly options?: readonly SelectItem[];
  readonly label?: string;
  readonly placeholder?: string;
  readonly helper?: string;
  readonly error?: string;
  readonly id?: string;
  readonly disabled?: boolean;
  readonly readOnly?: boolean;
  readonly required?: boolean;
  readonly name?: string;
  readonly form?: string;
  readonly dir?: 'ltr' | 'rtl';
  readonly motion?: 'system' | 'on' | 'off';
  readonly className?: string;
  readonly style?: React.CSSProperties;
  readonly triggerProps?: SelectTriggerProps;
  readonly 'aria-label'?: string;
  readonly 'aria-labelledby'?: string;
  readonly 'aria-describedby'?: string;
  readonly 'aria-invalid'?: React.AriaAttributes['aria-invalid'];
  readonly onValueChange?: SelectValueChangeHandler;
  readonly onOpenChange?: SelectOpenChangeHandler;
}
export type SelectValueState = { readonly value: string; readonly defaultValue?: never } | { readonly value?: never; readonly defaultValue?: string };
export type SelectOpenState = { readonly open: boolean; readonly defaultOpen?: never } | { readonly open?: never; readonly defaultOpen?: boolean };
export type SelectStructureProps = SelectStructureCommonProps & SelectValueState & SelectOpenState;
export type Select22Props = SelectStructureProps;
export type Select23Props = SelectStructureProps;
export type Select24Props = SelectStructureProps;
export type Select25Props = SelectStructureProps;
export type WixSelectStructureId = 'select-22' | 'select-23' | 'select-24' | 'select-25';
