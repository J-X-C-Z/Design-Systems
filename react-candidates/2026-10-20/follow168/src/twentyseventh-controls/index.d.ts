import * as React from 'react';

type ItemValue = 'item-1' | 'item-2' | 'item-3';
type Owner<Value extends string> =
  | { value: readonly Value[]; defaultValue?: never }
  | { value?: never; defaultValue?: readonly Value[] };
interface ChangeDetails<Id extends string, Value extends string> {
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
type TriggerProps = Omit<React.ComponentPropsWithRef<'button'>,
  'children' | 'dangerouslySetInnerHTML' | 'type' | 'id' | 'aria-expanded' | 'aria-controls'>;
type AccordionProps<Id extends string, Value extends string> = Omit<React.HTMLAttributes<HTMLDivElement>,
  'children' | 'dangerouslySetInnerHTML' | 'defaultValue' | 'onChange'> & Owner<Value> & {
  disabled?: boolean;
  orientation?: 'vertical' | 'horizontal';
  loop?: boolean;
  triggerProps?: Partial<Record<Value, TriggerProps>>;
  /**
   * Synchronous proposal after click bubbling. Return false, call cancel(), or
   * preventDefault() on the originating synthetic/native event to reject it.
   * Controlled selection changes only when its owner supplies a new value.
   */
  onValueChange?: (value: Value[], details: ChangeDetails<Id, Value>) => void | boolean;
};

/**
 * Fixed-content multiple-open accordions; defaultValue is ['item-1']. Values
 * are deduplicated into source order; invalid items throw RangeError. Releasing
 * value preserves the last committed owner selection. Native form reset leaves
 * selection unchanged, and triggers never submit. Root and trigger refs support
 * React 19 callback cleanup. Neither root nor trigger children are replaceable.
 */
export type Accordion08Value = ItemValue;
export type Accordion08ChangeDetails = ChangeDetails<'accordion-08', Accordion08Value>;
export type Accordion08TriggerProps = TriggerProps;
export type Accordion08Props = AccordionProps<'accordion-08', Accordion08Value>;
export declare const Accordion08: React.ForwardRefExoticComponent<Accordion08Props & React.RefAttributes<HTMLDivElement>>;

export type Accordion09Value = ItemValue;
export type Accordion09ChangeDetails = ChangeDetails<'accordion-09', Accordion09Value>;
export type Accordion09TriggerProps = TriggerProps;
export type Accordion09Props = AccordionProps<'accordion-09', Accordion09Value>;
export declare const Accordion09: React.ForwardRefExoticComponent<Accordion09Props & React.RefAttributes<HTMLDivElement>>;

export type Accordion10Value = ItemValue;
export type Accordion10ChangeDetails = ChangeDetails<'accordion-10', Accordion10Value>;
export type Accordion10TriggerProps = TriggerProps;
export type Accordion10Props = AccordionProps<'accordion-10', Accordion10Value>;
export declare const Accordion10: React.ForwardRefExoticComponent<Accordion10Props & React.RefAttributes<HTMLDivElement>>;

export type Accordion11Value = ItemValue;
export type Accordion11ChangeDetails = ChangeDetails<'accordion-11', Accordion11Value>;
export type Accordion11TriggerProps = TriggerProps;
export type Accordion11Props = AccordionProps<'accordion-11', Accordion11Value>;
export declare const Accordion11: React.ForwardRefExoticComponent<Accordion11Props & React.RefAttributes<HTMLDivElement>>;

