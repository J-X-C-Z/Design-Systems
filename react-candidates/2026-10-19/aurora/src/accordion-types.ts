import type * as React from 'react';

export interface Accordion02Item {
  /** Unique, stable identity. Duplicate item values throw before rendering. */
  value: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface Accordion02ChangeDetails {
  readonly event: React.MouseEvent<HTMLButtonElement>;
  /** Immutable snapshot. Unknown keys are retained; repeated keys are normalized. */
  readonly previousValue: readonly string[];
  readonly canceled: boolean;
  /** Cancel synchronously, or call event.preventDefault(), inside onValueChange. */
  cancel(): void;
}

type Accordion02Ownership =
  | { value: readonly string[]; defaultValue?: never }
  | { value?: undefined; defaultValue?: readonly string[] };

/** Multiple-open accordion. Omitted defaultValue opens the first configured item. */
export type Accordion02Props = Omit<
  React.HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue' | 'onChange'
> & Accordion02Ownership & {
  children?: never;
  items?: readonly Accordion02Item[];
  disabled?: boolean;
  reducedMotion?: boolean;
  onValueChange?: (value: string[], details: Accordion02ChangeDetails) => void;
};
