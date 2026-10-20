import * as React from 'react';

type Simple28ItemValue = 'item-1' | 'item-2' | 'item-3';
type Simple28Owner<Value extends string> =
  | { value: readonly Value[]; defaultValue?: never }
  | { value?: never; defaultValue?: readonly Value[] };
interface Simple28ChangeDetails<Id extends string, Value extends string> {
  id: Id;
  itemId: Value;
  open: boolean;
  /** Independent snapshot in source order. */
  previousValue: Value[];
  /** Originating click; currentTarget is cleared after bubbling. Use button. */
  event: React.MouseEvent<HTMLButtonElement>;
  button: HTMLButtonElement;
  /** Synchronously reject this proposal. */
  cancel(): void;
}
type Simple28TriggerProps = Omit<React.ComponentPropsWithRef<'button'>,
  'children' | 'dangerouslySetInnerHTML' | 'type' | 'id' | 'aria-expanded' | 'aria-controls'>;
type Simple28AccordionProps<Id extends string, Value extends string> = Omit<React.HTMLAttributes<HTMLDivElement>,
  'children' | 'dangerouslySetInnerHTML' | 'defaultValue' | 'onChange'> & Simple28Owner<Value> & {
  disabled?: boolean;
  orientation?: 'vertical' | 'horizontal';
  loop?: boolean;
  triggerProps?: Partial<Record<Value, Simple28TriggerProps>>;
  /**
   * Synchronous proposal after click bubbling. Return false, call cancel(), or
   * preventDefault() on the originating synthetic/native event to reject it.
   * Controlled selection changes only when its owner supplies a new value.
   */
  onValueChange?: (value: Value[], details: Simple28ChangeDetails<Id, Value>) => void | boolean;
};

/**
 * Fixed-content multiple-open accordions; defaultValue is ['item-1']. Values
 * are deduplicated into source order; invalid items throw RangeError. Releasing
 * value preserves the last committed owner selection. Native form reset leaves
 * selection unchanged, and triggers never submit. Root and trigger refs support
 * React 19 callback cleanup. Neither root nor trigger children are replaceable.
 */
export type Accordion12Value = Simple28ItemValue;
export type Accordion12ChangeDetails = Simple28ChangeDetails<'accordion-12', Accordion12Value>;
export type Accordion12TriggerProps = Simple28TriggerProps;
export type Accordion12Props = Simple28AccordionProps<'accordion-12', Accordion12Value>;
export declare const Accordion12: React.ForwardRefExoticComponent<Accordion12Props & React.RefAttributes<HTMLDivElement>>;

export type Accordion14Value = Simple28ItemValue;
export type Accordion14ChangeDetails = Simple28ChangeDetails<'accordion-14', Accordion14Value>;
export type Accordion14TriggerProps = Simple28TriggerProps;
export type Accordion14Props = Simple28AccordionProps<'accordion-14', Accordion14Value>;
export declare const Accordion14: React.ForwardRefExoticComponent<Accordion14Props & React.RefAttributes<HTMLDivElement>>;

