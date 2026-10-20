import type * as React from 'react';

export type SelectIconName = 'code' | 'camera' | 'database' | 'globe';
export type SelectStatusTone = 'draft' | 'active' | 'archived' | 'deprecated';
/** Decorative content shared by the selected value and its listbox option. */
export type SelectDecoration =
  | { readonly kind: 'icon'; readonly name: SelectIconName; readonly tone?: never }
  | { readonly kind: 'status'; readonly tone: SelectStatusTone; readonly name?: never };
export interface SelectOption { readonly decoration?: SelectDecoration; readonly value: string; readonly label: string; readonly disabled?: boolean; readonly options?: never; readonly separator?: never }
export interface SelectGroup { readonly decoration?: never; readonly label: string; readonly options: readonly SelectOption[]; readonly disabled?: boolean; readonly value?: never; readonly separator?: never }
/** Decorative, nonselectable division. It is omitted from the native form bridge. */
export interface SelectSeparator { readonly decoration?: never; readonly separator: true; readonly value?: never; readonly label?: never; readonly options?: never; readonly disabled?: never }
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
export interface SelectContentCommonProps {
  readonly options?: readonly SelectItem[];
  readonly label?: string;
  readonly placeholder?: string;
  /** Independent visible trigger prefix; Select28 defaults to "Project Stack:". */
  readonly prefix?: string;
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
export type SelectContentProps = SelectContentCommonProps & SelectValueState & SelectOpenState;
export type Select26Props = SelectContentProps;
export type Select27Props = SelectContentProps;
export type Select28Props = SelectContentProps;
export type Select29Props = SelectContentProps;
export type WixSelectContentId = 'select-26' | 'select-27' | 'select-28' | 'select-29';
