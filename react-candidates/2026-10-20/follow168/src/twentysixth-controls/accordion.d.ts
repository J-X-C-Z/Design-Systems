import * as React from 'react';

export type Accordion06Value = 'item-1' | 'item-2' | 'item-3';
type Accordion06Owner =
  | { value: readonly Accordion06Value[]; defaultValue?: never }
  | { value?: never; defaultValue?: readonly Accordion06Value[] };
export interface Accordion06ChangeDetails {
  id: 'accordion-06';
  itemId: Accordion06Value;
  open: boolean;
  /** Independent snapshot in source order. */
  previousValue: Accordion06Value[];
  /** The originating click; currentTarget is cleared after bubbling. Use button. */
  event: React.MouseEvent<HTMLButtonElement>;
  button: HTMLButtonElement;
  /** Synchronously reject this proposal. */
  cancel(): void;
}
export type Accordion06TriggerProps = Omit<React.ComponentPropsWithRef<'button'>,
  'children' | 'dangerouslySetInnerHTML' | 'type' | 'id' | 'aria-expanded' | 'aria-controls'>;
export type Accordion06Props = Omit<React.HTMLAttributes<HTMLDivElement>,
  'children' | 'dangerouslySetInnerHTML' | 'defaultValue' | 'onChange'> & Accordion06Owner & {
  disabled?: boolean;
  orientation?: 'vertical' | 'horizontal';
  loop?: boolean;
  triggerProps?: Partial<Record<Accordion06Value, Accordion06TriggerProps>>;
  /**
   * Synchronous proposal after click bubbling. Return false, call cancel(), or
   * preventDefault() on the originating synthetic/native event to reject it.
   * A controlled instance changes only when its owner supplies a new value.
   */
  onValueChange?: (value: Accordion06Value[], details: Accordion06ChangeDetails) => void | boolean;
};
/**
 * Source-preserving multiple-open FAQ; defaultValue is ['item-1']. Values are
 * deduplicated into source order and invalid items throw RangeError. Releasing
 * value preserves the last committed owner selection. Native form reset leaves
 * the selection unchanged; its buttons do not submit a form.
 */
export declare const Accordion06: React.ForwardRefExoticComponent<Accordion06Props & React.RefAttributes<HTMLDivElement>>;
