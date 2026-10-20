import * as React from 'react';

/** Native attributes/events target the one native button, never the visual face. */
export interface NextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Adapter addition: suppress activation while keeping the button focusable.
   * Native buttons have no readOnly attribute; this maps to aria-disabled. */
  readOnly?: boolean;
}
/** Exact source sample is permanently disabled; disabled=false cannot enable it. */
export interface FixedDisabledButtonProps extends Omit<NextButtonProps, 'disabled'> {
  disabled?: true;
}
export type Button04Props = NextButtonProps;
export type Button05Props = FixedDisabledButtonProps;
export type Button06Props = NextButtonProps;
export type Button07Props = NextButtonProps;
export type Button08Props = NextButtonProps;
/** Fixed loading presentation, not an async or promise-handling component. */
export type Button09Props = Omit<FixedDisabledButtonProps, 'aria-busy'> & { 'aria-busy'?: true | 'true' };
export type Button10Props = NextButtonProps;
export type Button11Props = NextButtonProps;
/** Ordinary action, no internal favorite/toggle state. */
export type Button12Props = NextButtonProps;
export const Button04: React.ForwardRefExoticComponent<Button04Props & React.RefAttributes<HTMLButtonElement>>;
export const Button05: React.ForwardRefExoticComponent<Button05Props & React.RefAttributes<HTMLButtonElement>>;
export const Button06: React.ForwardRefExoticComponent<Button06Props & React.RefAttributes<HTMLButtonElement>>;
export const Button07: React.ForwardRefExoticComponent<Button07Props & React.RefAttributes<HTMLButtonElement>>;
export const Button08: React.ForwardRefExoticComponent<Button08Props & React.RefAttributes<HTMLButtonElement>>;
export const Button09: React.ForwardRefExoticComponent<Button09Props & React.RefAttributes<HTMLButtonElement>>;
export const Button10: React.ForwardRefExoticComponent<Button10Props & React.RefAttributes<HTMLButtonElement>>;
export const Button11: React.ForwardRefExoticComponent<Button11Props & React.RefAttributes<HTMLButtonElement>>;
export const Button12: React.ForwardRefExoticComponent<Button12Props & React.RefAttributes<HTMLButtonElement>>;
