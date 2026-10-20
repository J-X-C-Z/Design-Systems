import * as React from 'react';

/** All attributes and events address the actual native button. No async action is simulated. */
export interface ThirdButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Suppresses click/default action with aria-disabled while retaining keyboard focusability. */
  readOnly?: boolean;
}
export type Button13Props = ThirdButtonProps;
export type Button14Props = ThirdButtonProps;
export interface Button15Props extends ThirdButtonProps {
  /** Display text only, never navigated to or copied automatically. */
  url?: string;
  /** The icon button's visually-hidden accessible label; default: 复制网址. */
  children?: React.ReactNode;
  shellClassName?: string;
}
export type Button16Props = ThirdButtonProps;
export type Button17Props = ThirdButtonProps;
/** A member's onClick overrides the group default; callbacks are never chained. */
export type ThirdMemberProps = Omit<ThirdButtonProps, 'children'> & React.RefAttributes<HTMLButtonElement>;
export interface ThirdButtonGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'onClick'> {
  /** Native disabled on every member; members cannot override the group lock. */
  disabled?: boolean;
  /** Locks every member while keeping native buttons focusable. */
  readOnly?: boolean;
  /** Default native button click handler for members without their own onClick. */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}
export interface Button18Props extends ThirdButtonGroupProps {
  cancelLabel?: React.ReactNode;
  confirmLabel?: React.ReactNode;
  cancelProps?: ThirdMemberProps;
  confirmProps?: ThirdMemberProps;
}
export const BUTTON18_MEMBERS: readonly ['cancel', 'confirm'];
export type Button19Props = ThirdButtonProps;
export interface Button20Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Anchor keeps href and native link semantics; click/default navigation is cancelled. */
  disabled?: boolean;
  readOnly?: boolean;
}
export const BUTTON_PROVIDERS: readonly ['google', 'x', 'facebook', 'github'];
export type ButtonProvider = typeof BUTTON_PROVIDERS[number];
export interface SocialButtonProps extends ThirdButtonGroupProps {
  /** All four names are configurable, including icon-only Button21 accessible names. */
  providerLabels?: Partial<Record<ButtonProvider, string>>;
  /** Per-provider native attributes, refs and handlers. Order is fixed to BUTTON_PROVIDERS. */
  providerProps?: Partial<Record<ButtonProvider, ThirdMemberProps>>;
}
export type Button21Props = SocialButtonProps;
export type Button22Props = SocialButtonProps;
export interface Button23Props extends ThirdButtonProps {
  /** Host-owned displayed count. No local unread model or request. Default: 8. */
  count?: React.ReactNode;
}
export interface Button24Props extends ThirdButtonProps {
  /** Default is an original local SVG data URL. null/empty uses fallback. Supplying an external URL permits the browser image request. */
  avatarSrc?: string | null;
  /** Empty by default to avoid repeating the nickname; set if the picture conveys independent meaning. */
  avatarAlt?: string;
  avatarFallback?: React.ReactNode;
}
export const Button13: React.ForwardRefExoticComponent<Button13Props & React.RefAttributes<HTMLButtonElement>>;
export const Button14: React.ForwardRefExoticComponent<Button14Props & React.RefAttributes<HTMLButtonElement>>;
export const Button15: React.ForwardRefExoticComponent<Button15Props & React.RefAttributes<HTMLButtonElement>>;
export const Button16: React.ForwardRefExoticComponent<Button16Props & React.RefAttributes<HTMLButtonElement>>;
export const Button17: React.ForwardRefExoticComponent<Button17Props & React.RefAttributes<HTMLButtonElement>>;
export const Button18: React.ForwardRefExoticComponent<Button18Props & React.RefAttributes<HTMLDivElement>>;
export const Button19: React.ForwardRefExoticComponent<Button19Props & React.RefAttributes<HTMLButtonElement>>;
export const Button20: React.ForwardRefExoticComponent<Button20Props & React.RefAttributes<HTMLAnchorElement>>;
export const Button21: React.ForwardRefExoticComponent<Button21Props & React.RefAttributes<HTMLDivElement>>;
export const Button22: React.ForwardRefExoticComponent<Button22Props & React.RefAttributes<HTMLDivElement>>;
export const Button23: React.ForwardRefExoticComponent<Button23Props & React.RefAttributes<HTMLButtonElement>>;
export const Button24: React.ForwardRefExoticComponent<Button24Props & React.RefAttributes<HTMLButtonElement>>;
