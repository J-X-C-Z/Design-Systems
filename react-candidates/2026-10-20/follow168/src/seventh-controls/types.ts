import type * as React from 'react';

type NativeTextarea = React.TextareaHTMLAttributes<HTMLTextAreaElement>;
type TextareaValue = NonNullable<NativeTextarea['value']>;
type TextareaOwner =
  | { value: TextareaValue; defaultValue?: never }
  | { value?: undefined; defaultValue?: NativeTextarea['defaultValue'] };
/** Native onChange is observational; preventDefault does not undo native text editing. */
export type FollowTextareaProps = Omit<NativeTextarea,
  'value' | 'defaultValue' | 'children' | 'dangerouslySetInnerHTML'> & TextareaOwner & {
  label?: React.ReactNode;
  description?: React.ReactNode;
  /** className styles the textarea; wrapperClassName styles its label/description group. */
  wrapperClassName?: string;
  children?: never;
  dangerouslySetInnerHTML?: never;
  onValueChange?: never;
};
export type Textarea03Props = FollowTextareaProps;
export type Textarea04Props = FollowTextareaProps;

type LinkAttributes = Omit<React.ComponentPropsWithRef<'a'>,
  'children' | 'href' | 'aria-current' | 'aria-disabled' | 'dangerouslySetInnerHTML'>;
export type BreadcrumbSegment =
  | (LinkAttributes & { label: React.ReactNode; href: string; current?: false })
  | { label: React.ReactNode; current: true; href?: never; className?: string; title?: string; id?: string };
export type FollowBreadcrumbSegment = BreadcrumbSegment;
type NavAttributes = Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'dangerouslySetInnerHTML'>;
export type Breadcrumb02Props = NavAttributes & {
  segments?: readonly BreadcrumbSegment[];
  children?: never;
  dangerouslySetInnerHTML?: never;
};
export type FollowBreadcrumbProps = Breadcrumb02Props;

export interface PageChangeDetails {
  /** Runs synchronously in the originating anchor's React onClick handler. */
  readonly event: React.MouseEvent<HTMLAnchorElement>;
  readonly previousPage: number;
  readonly page: number;
  readonly canceled: boolean;
  /** Call synchronously to cancel both this page proposal and native link navigation. */
  cancel(): void;
}
export type FollowPageChangeDetails = PageChangeDetails;
type PageOwner =
  | { page: number; defaultPage?: never }
  | { page?: undefined; defaultPage?: number };
export type Pagination02Props = NavAttributes & PageOwner & {
  /** Positive integer, default 3. Out-of-range integer page values are clamped. */
  pageCount?: number;
  /** Default: #. Native navigation is retained unless the originating event is canceled. */
  getPageHref?: (page: number) => string;
  disabled?: boolean;
  /** Synchronous proposal; uncontrolled state commits after bubbling if still uncanceled. */
  onPageChange?: (page: number, details: PageChangeDetails) => void;
  children?: never;
  dangerouslySetInnerHTML?: never;
};
export type FollowPaginationProps = Pagination02Props;
