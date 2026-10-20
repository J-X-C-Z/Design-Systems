import type * as React from 'react';

/** The alert is initially visible unless defaultOpen is false. A controlled owner must accept a close request. */
type FourteenthOpenOwner = { open: boolean; defaultOpen?: never } | { open?: undefined; defaultOpen?: boolean };

export interface AlertCloseDetail {
  id: 'alerts-07' | 'alerts-08';
  reason: 'close';
  /** Retained React click event. currentTarget is null after dispatch; use button instead. */
  event: React.MouseEvent<HTMLButtonElement>;
  button: HTMLButtonElement;
  localOnly: true;
  /** Veto dismissal. This runs after native form activation and cannot undo a submit. */
  cancel(): void;
}

/** Native button props, including ref, form and submitter name/value. Children stay source-owned.
 * type is deliberately omitted by default, preserving native submit behavior inside a form.
 * Set type:'button' for local demo actions. Native onClick.preventDefault() can cancel submit and close.
 */
export type AlertButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'dangerouslySetInnerHTML'> & {
  ref?: React.Ref<HTMLButtonElement>;
  children?: never;
  dangerouslySetInnerHTML?: never;
};

/** Source Upload another is always disabled; consumers cannot enable it. */
export type Alerts07UploadAnotherButtonProps = Omit<AlertButtonProps, 'disabled'> & { disabled?: true };

type FourteenthAlertNative = Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'dangerouslySetInnerHTML' | 'role'> & FourteenthOpenOwner & {
  children?: never;
  dangerouslySetInnerHTML?: never;
  /** Disables all action buttons, including Close. */
  disabled?: boolean;
  /** Runs after click bubbling, if it was not canceled. Return false or call detail.cancel() to veto. */
  onOpenChange?: (open: false, detail: AlertCloseDetail) => void | boolean;
  closeButtonProps?: AlertButtonProps;
};

export type Alerts07Props = FourteenthAlertNative & {
  /** Optional displayed value, finite 0–100; invalid values throw RangeError.
   * Omitted: source demo 0→50 once, 100 ms after mount. The bounded demo timeline also runs while hidden
   * or overridden; reopening does not restart it. This is demonstration state, never an upload service.
   * aria-valuenow is repaired to expose the displayed numeric value (the source primitive lost value).
   */
  progress?: number;
  cancelButtonProps?: AlertButtonProps;
  /** Always disabled, preserving the source placeholder action. */
  uploadAnotherButtonProps?: Alerts07UploadAnotherButtonProps;
};
export declare const Alerts07: React.ForwardRefExoticComponent<Alerts07Props & React.RefAttributes<HTMLDivElement>>;

export type Alerts08Props = FourteenthAlertNative & {
  laterButtonProps?: AlertButtonProps;
  updateNowButtonProps?: AlertButtonProps;
};
export declare const Alerts08: React.ForwardRefExoticComponent<Alerts08Props & React.RefAttributes<HTMLDivElement>>;
