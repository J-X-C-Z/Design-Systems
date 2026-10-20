import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import type {
  BauhausActionScopeProps,
  BauhausButton02Props,
  BauhausButton03Props,
  BauhausButton05Props,
} from './types.js';

export type {
  BauhausActionId,
  BauhausActionTheme,
  BauhausActionMemberProps,
  BauhausActionScopeProps,
  BauhausButton02Props,
  BauhausButton03Props,
  BauhausButton05Props,
} from './types.js';

export declare const bauhausActionIds: readonly ['button-02', 'button-03', 'button-05'];
export declare const BauhausActionScope: ForwardRefExoticComponent<
  PropsWithoutRef<BauhausActionScopeProps> & RefAttributes<HTMLDivElement>
>;
export declare const BauhausButton02: ForwardRefExoticComponent<
  PropsWithoutRef<BauhausButton02Props> & RefAttributes<HTMLDivElement>
>;
export declare const BauhausButton03: ForwardRefExoticComponent<
  PropsWithoutRef<BauhausButton03Props> & RefAttributes<HTMLDivElement>
>;
export declare const BauhausButton05: ForwardRefExoticComponent<
  PropsWithoutRef<BauhausButton05Props> & RefAttributes<HTMLButtonElement>
>;
