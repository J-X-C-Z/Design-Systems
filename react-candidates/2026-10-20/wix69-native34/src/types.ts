import type * as React from 'react';

/** Flat, dense descriptors only. Own data fields, unique string values. No groups. */
export interface NativeMultipleOption {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
  readonly options?: never;
  readonly children?: never;
  readonly selected?: never;
}

type NativeAttributes = Omit<React.SelectHTMLAttributes<HTMLSelectElement>,
  'value' | 'defaultValue' | 'multiple' | 'size' | 'children' | 'dangerouslySetInnerHTML' | 'role' |
  'aria-expanded' | 'aria-haspopup' | 'aria-controls' | 'aria-multiselectable'>;

export interface NativeMultipleCommonProps extends NativeAttributes {
  readonly options?: readonly NativeMultipleOption[];
  readonly label?: string | null;
  readonly helper?: string | null;
  readonly wrapperClassName?: string;
  /** Always true. This component never becomes a single-select or a popup. */
  readonly multiple?: true;
  /** Native visible row hint; integer >= 2. Omitted means the browser's multiple default. */
  readonly size?: number;
  readonly children?: never;
  readonly dangerouslySetInnerHTML?: never;
  readonly readOnly?: never;
  readonly role?: never;
  readonly open?: never;
  readonly defaultOpen?: never;
  readonly onOpenChange?: never;
  readonly onValueChange?: never;
  readonly placeholder?: never;
  readonly 'aria-expanded'?: never;
  readonly 'aria-haspopup'?: never;
  readonly 'aria-controls'?: never;
  readonly 'aria-multiselectable'?: never;
}
/** Dense, unique string arrays; unknown strings remain latent only for controlled values. */
export type NativeMultipleValueState =
  | { readonly value: readonly string[]; readonly defaultValue?: never }
  | { readonly value?: undefined; readonly defaultValue?: readonly string[] | undefined };
export type NativeMultipleProps = NativeMultipleCommonProps & NativeMultipleValueState;
export type Select34Props = NativeMultipleProps;
export type WixNativeMultipleId = 'select-34';
