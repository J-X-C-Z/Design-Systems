import * as React from 'react';
export interface FlatActionScopeProps extends React.HTMLAttributes<HTMLDivElement> { mode?: 'light'|'dark'; reducedMotion?: boolean; }
export declare function FlatActionScope(props: FlatActionScopeProps): React.ReactElement;
export type FlatActionProps = Omit<React.ComponentPropsWithRef<'button'>, 'children'>;
export interface FlatButton02Props extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> { previousLabel?: React.ReactNode; nextLabel?: React.ReactNode; previousProps?: FlatActionProps; nextProps?: FlatActionProps; }
export interface FlatButton03Props extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> { discardLabel?: React.ReactNode; saveLabel?: React.ReactNode; discardProps?: FlatActionProps; saveProps?: FlatActionProps; }
export declare const FlatButton02: React.ForwardRefExoticComponent<FlatButton02Props & React.RefAttributes<HTMLDivElement>>;
export declare const FlatButton03: React.ForwardRefExoticComponent<FlatButton03Props & React.RefAttributes<HTMLDivElement>>;
export declare const FlatButton04: React.ForwardRefExoticComponent<React.ButtonHTMLAttributes<HTMLButtonElement> & React.RefAttributes<HTMLButtonElement>>;
export type FlatButton05Props = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>,'disabled'> & { disabled?: true };
export declare const FlatButton05: React.ForwardRefExoticComponent<FlatButton05Props & React.RefAttributes<HTMLButtonElement>>;
export declare const flatActionIds: readonly ['button-02','button-03','button-04','button-05'];
