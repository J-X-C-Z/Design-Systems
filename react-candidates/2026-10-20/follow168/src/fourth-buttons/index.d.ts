import * as React from 'react';

export interface FourthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Blocks click/default actions without removing the native button's Tab stop. */
  readOnly?: boolean;
}
export interface Button25Props extends FourthButtonProps {
  /** Fixed 1000ms Math.random() demo. It does not save or submit application data. */
  loadingLabel?: React.ReactNode;
  successLabel?: React.ReactNode;
  errorLabel?: React.ReactNode;
  /** Object.is change cancels pending simulation and clears status. Never restarts. */
  resetKey?: unknown;
}
export interface FourthToggleButtonProps extends Omit<FourthButtonProps, 'aria-pressed'> {
  /** Present means controlled; releasing to undefined retains the last accepted value. */
  pressed?: boolean;
  /** Initial uncontrolled value and form-reset baseline; later default changes are ignored. */
  defaultPressed?: boolean;
  /** Called only for a user activation, before local commit; preventDefault cancels it. */
  onPressedChange?: (pressed: boolean, event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Resets uncontrolled state to initial defaultPressed; controlled value stays owned by host. */
  resetKey?: unknown;
}
export type Button26Props = FourthToggleButtonProps;
export type Button27Props = FourthToggleButtonProps;
export type Button29Props = FourthToggleButtonProps;
export interface Button28Props extends FourthButtonProps {
  /** Noninteractive plain tooltip content. Default: 添加新项目. */
  tooltip?: React.ReactNode;
  shellClassName?: string;
  /** Dismisses transient focus/hover tooltip until a new interaction. */
  resetKey?: unknown;
}
export type Button30Props = FourthButtonProps;
export type Button31Props = FourthButtonProps;
export type Button32Props = FourthButtonProps;
export interface Button33Props extends FourthButtonProps { count?: React.ReactNode; }
export interface Button34Props extends Omit<FourthButtonProps, 'onCopy'> {
  /** Passed to navigator.clipboard.writeText only on uncancelled activation. */
  text?: string;
  copyingLabel?: React.ReactNode;
  copiedLabel?: React.ReactNode;
  errorLabel?: React.ReactNode;
  /** Notification after actual clipboard Promise fulfillment. Replaces the native onCopy prop; use onCopyCapture for native clipboard-event capture. Does not receive an event. */
  onCopy?: (text: string) => void;
  /** Synchronous error, missing API/secure context, invalid return, or rejected clipboard Promise. */
  onCopyError?: (error: unknown) => void;
  /** Invalidates in-flight results/feedback timers; cannot undo a system clipboard write. */
  resetKey?: unknown;
}
export type Button35Props = FourthButtonProps;
export interface Button36Props extends FourthButtonProps { count?: React.ReactNode; }
export const Button25: React.ForwardRefExoticComponent<Button25Props & React.RefAttributes<HTMLButtonElement>>;
export const Button26: React.ForwardRefExoticComponent<Button26Props & React.RefAttributes<HTMLButtonElement>>;
export const Button27: React.ForwardRefExoticComponent<Button27Props & React.RefAttributes<HTMLButtonElement>>;
export const Button28: React.ForwardRefExoticComponent<Button28Props & React.RefAttributes<HTMLButtonElement>>;
export const Button29: React.ForwardRefExoticComponent<Button29Props & React.RefAttributes<HTMLButtonElement>>;
export const Button30: React.ForwardRefExoticComponent<Button30Props & React.RefAttributes<HTMLButtonElement>>;
export const Button31: React.ForwardRefExoticComponent<Button31Props & React.RefAttributes<HTMLButtonElement>>;
export const Button32: React.ForwardRefExoticComponent<Button32Props & React.RefAttributes<HTMLButtonElement>>;
export const Button33: React.ForwardRefExoticComponent<Button33Props & React.RefAttributes<HTMLButtonElement>>;
export const Button34: React.ForwardRefExoticComponent<Button34Props & React.RefAttributes<HTMLButtonElement>>;
export const Button35: React.ForwardRefExoticComponent<Button35Props & React.RefAttributes<HTMLButtonElement>>;
export const Button36: React.ForwardRefExoticComponent<Button36Props & React.RefAttributes<HTMLButtonElement>>;
