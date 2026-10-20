import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
  Ref,
} from 'react';

export type BauhausActionId = 'button-02' | 'button-03' | 'button-05';
export type BauhausActionTheme = 'light' | 'dark';

/** Nested scopes inherit theme; a child cannot re-enable paused/reduced motion. */
export interface BauhausActionScopeProps extends HTMLAttributes<HTMLDivElement> {
  theme?: BauhausActionTheme;
  paused?: boolean;
  /** Adds to, never overrides, the operating system's reduced-motion preference. */
  reducedMotion?: boolean;
}

/** The ref always points to the actual, stable native button. */
export interface BauhausActionMemberProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>;
}

export interface BauhausButton02Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  previousProps?: BauhausActionMemberProps;
  nextProps?: BauhausActionMemberProps;
  previousLabel?: ReactNode;
  nextLabel?: ReactNode;
}

export interface BauhausButton03Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  discardProps?: BauhausActionMemberProps;
  saveProps?: BauhausActionMemberProps;
  discardLabel?: ReactNode;
  saveLabel?: ReactNode;
}

/** Canonical 05 is permanently disabled, including when called from plain JS. */
export interface BauhausButton05Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  disabled?: true;
}
