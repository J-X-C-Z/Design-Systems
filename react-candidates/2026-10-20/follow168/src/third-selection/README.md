# Follow React: checkbox05–08 / switch05–08

Eight exact Watermelon IDs, nineteen real native React fields. These are JSX compositions of this package's independently implemented React scalar core, not wrappers around an imperative DOM adapter. Source identity: Watermelon 424fe703d19b39e86bef90c4ba0a76ef8c1fb260. The canonical 849-item file has SHA-256 5889ad208f21613a098b697ac4fd8d879068a9b2801264d9983e71a39a05fe6a.

## Import and styling

Import named components from `./index.jsx` (types in `./index.d.ts`). Load the existing token/base/scalar styles, then this directory's `styles.css`. `examples.jsx` contains all eight concrete examples plus parent refusal and split-form ownership. Existing provider settings supply Follow and six other theme modes; no fonts, icons or source dependencies are fetched at runtime.

## Exact source compositions

| Export | Native fields and initial state | Distinct source feature |
| --- | --- | --- |
| Checkbox05 | standard=true, medium=true, large=true | 16/20/24px check squares |
| Checkbox06 | salad=true, wrap=true, juice=false | Snack badges; unchecked mark and its label indentation disappear |
| Checkbox07 | checked=true | Adjacent label and terms-and-conditions help column |
| Checkbox08 | design=false, marketing=false, product=false | Team roles heading, independent wrap-capable row |
| Switch05 | destructive/success/info/warning=true | Four outlined shallow-tone tracks with colored thumbs |
| Switch06 | checked=false | 32×12px track, 18px thumb overhanging by 3px |
| Switch07 | small/medium/large=false | 32×18.4, 40×24, 48×28 tracks; 16/20/24px thumbs |
| Switch08 | checked=true | 56×28 track, 26px white thumb, both check/X icons always visible |

Switch08 intentionally preserves the source's right-side X emphasis while checked and left check emphasis while unchecked. It does not reinterpret the source as “check means on.” All strings are localized, and translated source-only names are added only when the field lacks a visible label. A caller-provided aria-label always has explicit priority.

## Composite API

Each named member takes `BooleanFieldProps | null`; null/missing means source defaults. Each has a corresponding input ref: standardRef, saladRef, designRef, destructiveRef, smallRef, etc. The composite's forwarded ref addresses its group div. Group `label`, `description`, and `error` are separate ReactNode props. Checkbox08 defaults its label to “团队角色”; the other groups do not invent visible titles. Members separately accept `label`, `help`, and `error`.

There is no aggregate checked/value API. Top-level checked/defaultChecked/onCheckedChange/value/defaultValue/values/defaultValues/onValueChange/name are outside the types and ignored at runtime. This avoids silently treating a three/four-field source as one scalar.

Group disabled/readOnly are ORed with each member; member false cannot bypass a group safety gate. Member form, including an empty string, wins over the group default. Group and member ownerRevision tokens combine without collapsing numeric -0 or undefined.

## Scalar model and event order

- Defined checked owns the Boolean model; undefined releases the last effective model. Runtime null normalizes to controlled false.
- defaultChecked is the mount-time reset baseline. Later default changes do not rewrite that baseline. Explicit false always beats a source default of true.
- onChange observes the original React event before onCheckedChange proposes a value. Composite order is member onChange, group onChange unless canceled, then member proposal.
- Synthetic onClick cancellation, nativeEvent.preventDefault, or a native input-target click cancellation suppress the proposal and restore the current model after native rollback. Original React onChange can still be observed.
- onClick/onChange/onCheckedChange exceptions propagate; failed proposals do not commit and redraw the current model.
- Controlled parents accept by committing checked. Synchronous committed acceptance, refusal with ownerRevision, control takeover/release, disabled/readOnly, keyed replacement, or unmount supersedes the older event. A batched setState request becomes ownership only when committed.
- Callback return values are ignored. Preventing default in onCheckedChange is after the veto boundary. Ordinary event observers can finish after synchronous unmount, but internal scalar proposals cannot commit after it.

## Native forms and reset

Every member is its own real input. name/value/required/form/ref are native. FormData includes checked enabled members, omits unchecked or disabled members, and keeps checked read-only members. Repeated names are supported without hidden aggregate inputs.

Native form.reset is silent. After the default action, current controlled values or uncontrolled mount baselines are reconciled. Canceled reset events, valid/canceled double reset sequences, same-model post-return clicks, edits during reset dispatch, committed owner/revision commands, replacements, unmounts, and changed form ownership are explicitly covered. Different members can belong to different forms and reset independently. Same-family replacements mounted during an observed active reset can join it.

Outside the guarantee: post-dispatch cancellation, earlier stopImmediatePropagation that prevents reset observation, direct DOM property writes without edit events, or a late ancestor click listener trying to retract a proposal already emitted by React.

## Accessibility and explicit visual adaptations

Stable native nodes and generated id prefixes support labels and helper/error associations. Groups have associated titles/descriptions. Switch inputs expose role=switch; browser Space behavior remains native. The shared Enter extension checks modifiers, repeat, composition, veto, and safety gates.

Visual controls preserve source dimensions but have at-least-44px native targets. Snack badges have at-least-48px height and 44px width; the actual input covers the whole badge even when label=null. Their focus outline remains visible when the check glyph is hidden. Long labels wrap rather than following the source badge's no-wrap restriction. Switch08 anchors its icons to a top-aligned 44px control row even when an external label wraps.

Colors follow semantic Follow/seven-theme tokens. The fixed-white Switch08 thumb has fixed #151515 active icon ink rather than inheriting light dark-mode text. Static sRGB validation checks external text, helper/error text, badge text, focus, outlines, checkmarks, and both icon surfaces across fourteen theme/modes. This is not rendered contrast or browser hit-testing proof.

## Evidence and limits

`source-hashes.json` records the eight official component blobs and four primitive blobs, freshly rehashed against the pinned catalog/tree. Exact read-only source copies and the verified MIT LICENSE notice are included. Upstream source files are not executed.

`author-evidence.json` binds author test evidence to implementation/test bytes. `static-color-pairs.json` binds 378 successful color checks plus long-label and label-null target CSS assertions. `file-hashes.json` freezes this slice's deliverables.

Real React/JSDOM tests cover all nineteen members individually. They do not demonstrate trusted browser Space, real hit-testing, rendered clipping, forced-colors behavior, screen readers, or OS/browser behavior. Independent review and actual browser acceptance remain separate. No formal accepted-ID count is claimed; these eight React candidates do not add Flutter or native coverage.
