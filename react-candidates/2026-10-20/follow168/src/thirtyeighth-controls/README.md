# Follow168 · three radio cards and Auto sync

Four independently pending canonical identities: radio-group-11, radio-group-12, radio-group-13 and switch-19. Target cumulative168/849,681 pending. Nine nested radio choices are constituent content, not extra IDs. Radio-group family coverage12 of13 and switch family coverage19 of22 are source-inventory counts, not official equivalence or browser acceptance. Frozen164 remains delivered; current verification status is recorded separately.

## Per-ID contracts and original differences

- RadioGroup11: Basic/Premium with Free/$5.00 and full source descriptions, including the original Basic grammar “Get 1 project with 1 teams members.” Two max384px full-width12px-padded text cards with6px corners and8px gap. Native radios are visually clipped, focusable and linked to the whole visible label. There is no invented visible circle. Generic plan-radio labels are replaced with visible Basic/Premium names; prices/descriptions are separate references.
- RadioGroup12: Starter/Pro, exact descriptions and user/crown meaning. Centered icon cards have16px padding,8px corners,12px gap and max200px each inside max384px. Native20px radios sit below their copy. The pinned source selects svg for its enlarged indicator, but the pinned primitive renders span.size-2; an explicit12px mark implements the size intention rather than claiming the upstream DOM produced it. One column becomes two at640px. Locally authored outline icons replace react-icons filled artwork, preserving meaning and placement without adding a dependency.
- RadioGroup13: actual fieldset and “Select Device:” legend; Mobile/Tablet/Laptop/Desktop/Hybrid in three columns. Native radios are visually clipped and focusable;20px outline device symbols and visible labels remain. Tablet is permanently disabled, including when itemProps attempts disabled:false. Type declarations reject that override; JavaScript runtime ignores it. Explicit parent value '2' is permitted and can stay visibly checked, but is not interactive, a keyboard stop or a successful native form field. Names replace generic device-radio-N strings.
- Switch19: defaults on. Auto sync is the visible native switch name, with “Changes sync instantly” / “Manual updates only” and a separate polite “Auto sync is enabled/disabled” status. The source32×18.4px track and16px thumb are retained in a rounded12px muted card with16px horizontal/12px vertical padding,24px gap and layered shadow. A narrow-safe min256px intent avoids overflow. Native checkbox role=switch replaces the Radix button internals. Its description reference points to the visible explanation, while polite state stays independent to avoid duplicate naming. Authored boundary/unchecked-track colors are contrast adjusted; no real synchronization or settings service runs.

## State, form and keyboard

Radio value/defaultValue are exclusive exact unions or null. Switch checked/defaultChecked are exclusive booleans, default true; invalid runtime owners throw. Controlled parents may refuse a proposal. Release retains the last committed controlled owner. Mount defaults remain stable. Same-task accepted intent is ordered using logical state, not transient browser checkedness; owner/config/unmount epochs invalidate stale work.

Radio onValueChange and switch onCheckedChange are proposals. Return false, call details.cancel(), or prevent details.event to veto. Detail ids are exact; reasons select/keyboard/reset carry the actual event. Radio reset input is null; switch reset input is the actual HTMLInputElement. Native caller onClick/onInput/onChange retain native meanings and are not semantic substitutes. Original native and synthetic preventDefault property descriptors are restored after all overlapping observers finish.

Inputs support native names, external form association, required, disabled and FormData. ReadOnly applies to Switch19 selection and Space; reset remains a native form operation. Controlled owners survive reset; uncontrolled state returns to mount defaults. Reset snapshots input.form membership during dispatch, including reassociation in onReset; a later form change after reset returns cannot retroactively join or leave that reset. Cancellation, first mount and key replacement remain guarded. Radio defaultChecked writes precede all checked writes. Independent native radio groups should use different names; DOM-level same-name exclusion does not merge logical owners.

Radio directional keys support optional axis, RTL and loop. Nonmoving edge arrows do not activate, Home/End focus only, Space performs one native click, Enter suppresses implicit submit, and Tab stays native. Destination bubble SyntheticEvent onFocus.preventDefault vetoes later activation; noncancelable native focusin semantics remain native. Caller external focus moves are retained. Switch Space invokes one native click and suppresses duplicate default activation, Enter suppresses submit, directional keys do not operate it, and focus is never moved by the component.

Forwarded RadioGroup11/12 refs point to div, RadioGroup13 to fieldset, Switch19 to the native input. Item/label refs and switch rootProps.ref support React19 cleanup. Input ids and names are linked and instance-unique unless callers supply their own switch id. Explicit caller aria-labelledby is supported; generic aria-label and owned checked/type/role slots are protected. Switch rootProps className styles the card; direct className styles the input. Native defaultValue controls the input submission value, not checked ownership.

## Integration, visual and verification boundaries

New38 radio renderer is derived from repaired36 with356 prior source files byte-identical,5 additive entries/registry/Studio integrations and one authorized minimal36 repair. New fieldset/device structure, fixed disable, icons and styles are explicit differences. Shared30 cancellation helpers are reused unchanged. True SevenThemeProvider data-mode=dark and .dark/data-theme aliases are covered. Whole-card focus outlines, forced-colors and reduced-motion declarations are authored. Ordinary text target4.5:1 and essential marks/boundaries target3:1 are fixed-source sRGB checks, not real rendered browser acceptance.

Relay Workshop is a new cool-blue ruled workbench: open numbered plates, an external device fieldset, an actual native form record, controlled/refused/released/null device ownership, independently controlled sync and disabled/readOnly/unmount/reset flows. All previous original sections remain. It never sends requests, changes accounts, purchases, configures devices or starts synchronization. Source prices and hardware names are fixed illustrative examples, not current offers or verified hardware facts.

Real browser layout, trusted physical input, browser validity UI, accessibility tree/AT and formal acceptance remain0. Light-DOM form/availability semantics do not promise arbitrary CSSOM observation, full native Tab-order, shadow roots, portals or cross-document behavior. JSDOM30 does not resolve var() color/border shorthands; those styles are checked through authored declarations, actual provider tokens and static color calculations, with separate computed geometry checks.

## Reproduce

Use existing LOCAL_DEPENDENCIES, LOCAL_TYPESCRIPT and LOCAL_REACT_TYPES. Run bash tools/thirtyeighth/verify-all.sh from a clean extraction; no install/download occurs. Current actual consumer is qa/consumer168-c1 and package artifacts/follow-ui-react-seven-0.38.0-candidate.1.tgz. Historical root consumer/package.json is not current installation evidence. New94 illegal API fixtures are rejected under strict Bundler/NodeNext with exactOptionalPropertyTypes and no skipLibCheck. Actual package README example keeps its typed CSS import; source-only NodeNext adapter removes only that relative CSS side-effect import, with CSS built/tested independently.

The final chain inherits164's explicit Specification Room automatic End terminal-state gate: selected=box, focus=box and parent-owner text=box, bounded2500ms with unchanged semantic assertions. It never retries an action or globally enlarges sleeps. Earlier original scripts/failure evidence remain in frozen164. Its three minimal traces establish early observation before controlled commit; the first untraced observation and the separate156 occurrence remain of unconfirmed cause. Current routing is independently recorded for168, not silently substituted.

Current results belong to CURRENT-VERIFICATION.json and the independent final report. An exact-ZIP fresh run follows sealing; its external log/receipt bind the actual result. Passing-check counts never substitute for per-ID content and behavior completion.

## Example

```tsx
import * as React from 'react';
import {SevenThemeProvider,RadioGroup11,RadioGroup12,RadioGroup13,Switch19,type RadioGroup13Value} from '@follow-ui/react-seven';
import '@follow-ui/react-seven/styles.css';

export function RelayExample(){
 const formId=React.useId();
 const [device,setDevice]=React.useState<RadioGroup13Value|null>('1');
 const [sync,setSync]=React.useState(true);
 const [receipt,setReceipt]=React.useState('Nothing read yet.');
 return <SevenThemeProvider theme="follow" mode="light">
  <form id={formId} onSubmit={event=>{event.preventDefault();setReceipt(JSON.stringify([...new FormData(event.currentTarget)]));}}>
   <RadioGroup11 name="plan"/>
   <RadioGroup12 name="membership"/>
   <Switch19 name="sync" value="enabled" checked={sync} onCheckedChange={next=>setSync(next)}/>
   <button type="reset">Reset native fields</button>
   <button type="submit">Read fields locally</button>
  </form>
  <RadioGroup13 form={formId} name="device" value={device} onValueChange={next=>setDevice(next)}/>
  <p role="status">{receipt}</p>
 </SevenThemeProvider>;
}
```

## Explicit backward repair in168

The independent exact164 package reproduced a native canceled-click rollback in all RadioGroup03–10 variants: an item onClick synchronously installs a target/null controlled owner and prevents default, but the later native cancellation step restores old checked/FormData. Sixteen target/null historical cases failed.164 remains frozen and those failures are retained without rewriting its earlier bounded conclusion.168 adds post-default queueMicrotask(reconcile) to the old36 click nonqueued cleanup plus the public capture snapshot described below; new38 has both protections. It restores the latest logical owner, not a captured old value. The reverse-transform SHA proof is in reference/baseline164-source-sha256.json and verify-preservation.py. No extra canonical ID is credited.

### Public capture ownership boundary
Click/key ownership is captured at this component's root capture boundary, before its exposed root, item and label capture callbacks, and reused in bubble. Synchronous owner takeover/release inside those handlers invalidates that gesture. Capture listeners on external ancestors/document/window run before that boundary and establish the owner presented to the component. A prevented or stopped event still receives a post-default native field reconciliation, without a semantic change callback.

The additional historical exact164 capture-owner oracle confirmed138 failures among372 cases for RadioGroup03–10.168 therefore also carries the explicitly authorized same public-capture entry snapshot into shared36; old164 is untouched. All localized native rollback, capture-entry and reset-association text transforms have an inverse-transform SHA proof to frozen164. The source-file exception remains one old36 file; there is no additional completed ID.

### Reset observer boundary
Reset is observed at the owning window capture boundary. Membership is then observed along the remaining event path and during React commits while eventPhase is nonzero, and frozen for deferred semantic notification. A form-only public prop commit changes association without changing value ownership, so it does not revoke a reset already dispatched. Reset has a distinct ownership epoch that still rejects value/checked, controlled-mode and other configuration takeovers; click/key requests retain their normal configuration guard.

External native listeners can hide a reset entirely by stopping immediate propagation before the entry observer. Direct DOM form reassociation can also be hidden if propagation is stopped before the subsequent association observer, with no React commit to reveal the change. These event-route limits are reported separately from supported paths; they are not counted as full native equivalence. Ordinary observed direct-DOM reassociation during dispatch, after-return changes and public React prop updates are separately verified. The implementation does not replace event methods or DOM attribute setters to intercept arbitrary caller writes.

The independent representative route audit records28 known direct-DOM/blocked-observer native-equivalence failures, plus4 native/React-state mismatches when a pre-registered window stopImmediatePropagation hides the reset entirely. These are explicitly not passed and not counted as native equivalence. Public form-only updates, ordinary observed paths and pre-registered window stopPropagation are separate supported paths. The source archive includes KNOWN-LIMITS168.md and the unchanged initial/final independent route observations.
