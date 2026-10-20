import * as React from 'react';

export interface Button01Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Explicit adapter addition: stops activation; remains focusable. */
  readOnly?: boolean;
}
export interface Button02Props extends Button01Props {
  nextLabel?: React.ReactNode;
  /** Attributes/events belong only to the second native button. */
  nextProps?: Button01Props;
  nextRef?: React.Ref<HTMLButtonElement>;
  groupProps?: React.HTMLAttributes<HTMLDivElement>;
}
export interface Button03Props extends Button01Props {
  saveLabel?: React.ReactNode;
  saveProps?: Button01Props;
  saveRef?: React.Ref<HTMLButtonElement>;
  groupProps?: React.HTMLAttributes<HTMLDivElement>;
}
export const Button01: React.ForwardRefExoticComponent<Button01Props & React.RefAttributes<HTMLButtonElement>>;
/** Top-level native props and the forwarded ref address the first/previous button. */
export const Button02: React.ForwardRefExoticComponent<Button02Props & React.RefAttributes<HTMLButtonElement>>;
/** Top-level native props and the forwarded ref address the first/discard button. */
export const Button03: React.ForwardRefExoticComponent<Button03Props & React.RefAttributes<HTMLButtonElement>>;

interface FieldPresentation {
  label?: React.ReactNode;
  help?: React.ReactNode;
  error?: React.ReactNode;
  /** Change this token to assert an owner command even when value is unchanged.
   * Same-value ordinary renders preserve IME drafts and pending edit intent. */
  ownerRevision?: string | number;
}
export interface BooleanFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked' | 'defaultChecked' | 'children'>, FieldPresentation {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
}
export const Checkbox01: React.ForwardRefExoticComponent<BooleanFieldProps & React.RefAttributes<HTMLInputElement>>;
export const Switch01: React.ForwardRefExoticComponent<BooleanFieldProps & React.RefAttributes<HTMLInputElement>>;

export type ValueEvent<E extends HTMLInputElement | HTMLTextAreaElement> = React.SyntheticEvent<E> | InputEvent;
interface ValueProps<E extends HTMLInputElement | HTMLTextAreaElement> extends FieldPresentation {
  /** Defined value owns the field; null is controlled empty. undefined releases the last effective value. */
  value?: string | number | null;
  /** Mount-only reset baseline; subsequent changes do not reset edits. */
  defaultValue?: string | number;
  /** Proposal callback. Controlled fields require an owner render to accept it.
   * Return values are ignored. preventDefault here does not veto; use onChange/
   * onNativeBeforeInput before a proposal, or controlled ownership. */
  onValueChange?: (value: string, event: ValueEvent<E>) => void;
  /** Real modern beforeinput hook. React's ordinary onBeforeInput is also forwarded
   * with its native React synthetic-event behavior. Runs before internal editing. */
  onNativeBeforeInput?: (event: InputEvent) => void;
}
export interface InputMask01Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'children'>, ValueProps<HTMLInputElement> {}
export interface Textarea01Props extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'defaultValue' | 'children'>, ValueProps<HTMLTextAreaElement> {}
export const InputMask01: React.ForwardRefExoticComponent<InputMask01Props & React.RefAttributes<HTMLInputElement>>;
export const Textarea01: React.ForwardRefExoticComponent<Textarea01Props & React.RefAttributes<HTMLTextAreaElement>>;
