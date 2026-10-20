import * as React from 'react';
import type { Checkbox04Props, Switch02Props, SwitchItemProps, Checkbox03Props, Switch03Props, Switch03Tone, AuroraSelectionScopeProps } from './types.js';
export type {
  Checkbox04Props, Switch02Props, SwitchItemProps, Checkbox03Props, Switch03Props, Switch03Tone, SelectionProps, SelectionState,
  CheckedChangeDetails, AuroraSelectionScopeProps,
} from './types.js';
export declare const auroraSelectionIds: readonly ['checkbox-03', 'switch-03', 'checkbox-04', 'switch-02'];
export declare function AuroraSelectionScope(props: AuroraSelectionScopeProps): React.ReactElement;

export declare const Checkbox03: React.ForwardRefExoticComponent<Checkbox03Props & React.RefAttributes<HTMLInputElement>>;
export declare function Switch03(props: Switch03Props): React.ReactElement;
export declare const Checkbox04:React.ForwardRefExoticComponent<Checkbox04Props&React.RefAttributes<HTMLInputElement>>;
export declare const Switch02:React.ForwardRefExoticComponent<Switch02Props&React.RefAttributes<HTMLInputElement>>;
