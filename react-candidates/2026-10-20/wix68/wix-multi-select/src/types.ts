import type * as React from 'react';

/** Flat descriptors only. Values are unique, nonempty strings; labels are plain text. */
export interface MultiSelectOption {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
  readonly options?: never;
  readonly separator?: never;
  readonly decoration?: never;
  readonly image?: never;
  readonly children?: never;
}
export type MultiSelectValueChangeReason = 'pointer' | 'keyboard' | 'clear' | 'remove';
export type MultiSelectOpenChangeReason = 'trigger' | 'keyboard' | 'escape' | 'tab' | 'outside-pointer' | 'focus-out';
export interface MultiSelectChangeDetail<Reason extends string> {
  readonly reason: Reason;
  readonly originalEvent: Event;
  readonly cancelable: true;
  readonly defaultPrevented: boolean;
  /** Synchronous cancellation of this proposal only; does not cancel the DOM event. */
  preventDefault(): void;
}
export type MultiSelectValueChangeDetail = MultiSelectChangeDetail<MultiSelectValueChangeReason>;
export type MultiSelectOpenChangeDetail = MultiSelectChangeDetail<MultiSelectOpenChangeReason>;
export type MultiSelectValueChangeHandler = (value: readonly string[], detail: MultiSelectValueChangeDetail) => void;
export type MultiSelectOpenChangeHandler = (open: boolean, detail: MultiSelectOpenChangeDetail) => void;
/** Structural, accessibility and form attributes are supplied through the component. */
export type MultiSelectTriggerProps = Pick<React.ButtonHTMLAttributes<HTMLButtonElement>,
  'title' | 'tabIndex' | 'autoFocus' | 'onClick' | 'onClickCapture' |
  'onKeyDown' | 'onKeyDownCapture' | 'onPointerDown' | 'onPointerDownCapture' |
  'onFocus' | 'onFocusCapture' | 'onBlur' | 'onBlurCapture'>;
export interface MultiSelectCommonProps {
  readonly options?: readonly MultiSelectOption[];
  readonly label?: string;
  /** Empty-selection summary. Single and plural summaries retain the source wording. */
  readonly placeholder?: string;
  /** Plain-text suffix after the selected count. */
  readonly pluralLabel?: string;
  readonly helper?: string;
  readonly error?: string;
  readonly clearable?: boolean;
  readonly showSelectedItems?: boolean;
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
  readonly triggerProps?: MultiSelectTriggerProps;
  readonly 'aria-label'?: string;
  readonly 'aria-labelledby'?: string;
  readonly 'aria-describedby'?: string;
  readonly 'aria-invalid'?: React.AriaAttributes['aria-invalid'];
  readonly onValueChange?: MultiSelectValueChangeHandler;
  readonly onOpenChange?: MultiSelectOpenChangeHandler;
}
export type MultiSelectValueState =
  | { readonly value: readonly string[]; readonly defaultValue?: never }
  | { readonly value?: never; readonly defaultValue?: readonly string[] };
export type MultiSelectOpenState =
  | { readonly open: boolean; readonly defaultOpen?: never }
  | { readonly open?: never; readonly defaultOpen?: boolean };
export type MultiSelectProps = MultiSelectCommonProps & MultiSelectValueState & MultiSelectOpenState;
export type Select32Props = MultiSelectProps;
export type Select33Props = MultiSelectProps;
export type WixMultiSelectId = 'select-32' | 'select-33';
