# Four canonical FAQ components

Accordion08, Accordion09, Accordion10 and Accordion11 are independent named forwardRef components with fixed per-ID content in data.json. Their root has the matching data-component-id. No public content/item renderer or replacement children/HTML is accepted.

Each accepts exclusive `value` or `defaultValue`, an array of item-1/item-2/item-3. Default is item-1; arrays are deduplicated into original order. Invalid values/orientations throw RangeError. defaultValue is read at mount. Releasing a controlled value retains the last committed owner value.

`onValueChange(next, details)` runs synchronously within an after-bubbling proposal. details has exact canonical `id`, itemId, open, an independent previousValue snapshot, originating React click event, the stable button, and cancel(). Return false, call cancel(), or preventDefault on synthetic/native event to reject. Button and ancestor cancellation is honored, including explicit prevention on non-cancelable test events. Parent update/unmount/disable invalidates stale proposals. CurrentTarget is cleared after bubbling; use details.button.

`disabled`, per-item `triggerProps` and native disabled fieldsets are honored (including first-legend exception). Root div and native button refs support React19 callback cleanup. triggerProps may add handlers and ARIA description/name but cannot replace generated type/id/expanded/controls or children. All buttons are type=button and contribute no FormData. Native form reset does not change this non-form state; update owner state or remount to reset.

ArrowUp/Down default, optional horizontal ArrowLeft/Right with dir, Home/End, loop=false and disabled skipping move focus without activation. Modified/composing events are ignored. Deferred navigation never takes focus back after a bubbling handler deliberately moves it outside or to a different item. Enter/Space use native button behavior; tests do not synthesize trusted browser defaults.

08 keeps academic icon tiles/subtitles and a trailing plus rotated45°;09 keeps separated8px cards, leading right/down marker and expanded shadow;10 keeps grouped rounded12px border, plus/minus and blue expanded title;11 keeps separated padded cards, down/up marker and neutral open surface. Icons are local outline SVG alternatives. CSS finite fade replaces Radix measured-height animation. Follow colors adapt the source styling, without claiming pixel equivalence. Closed region bodies are unmounted while their hidden labelled region containers remain.

Reduced-motion and forced-colors rules are included. Browser geometry, trusted activation, real IME, touch and screen-reader behavior still require real device acceptance. Fixed education/property/travel/hospitality prose is illustrative source content, not a working service.
