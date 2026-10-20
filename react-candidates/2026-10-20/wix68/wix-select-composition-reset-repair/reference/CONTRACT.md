# Wix54 exact-source and adapter contract: select14–17

## Scope and evidence interpretation

This is the authorized isolated React candidate for four canonical IDs: select-14, select-15, select-16 and select-17. Select15 contains three independently owned controls but counts as one canonical ID. Select18 is only a historical proposal reserve and is not implemented or counted by this batch. The target ledger has 54 implemented, 396 pending adaptation, 399 historical blocked, and 795 unadapted out of 849. Formal accepted remains 0.

CONTRACT-PROPOSAL.json and CONTRACT-PROPOSAL.md are byte-exact historical read-only proposal snapshots, including their historical “not approved / not implemented” status and 50/400/399 ledger. Those statuses describe the proposal at preparation time, not current authorization. Their baseline file identities pin the repaired Wix50 engine. The appendix below is the same historical source analysis for convenient reading. The current adapter additions below resolve proposal alternatives; proposal-only recommendations are not a claim that an API shipped exactly as suggested.

The four TSX references, five upstream wrapper/util/manifest/LICENSE references and UPSTREAM-SOURCE-PROOF.json are byte-pinned cached upstream originals. The upstream revision is 424fe703d19b39e86bef90c4ba0a76ef8c1fb260. Original wrappers use radix-ui; no original Radix runtime was executed. Shared dependencies are not installed or fetched. The local React/ReactDOM-only engine is an adaptation, not a claim of Radix runtime parity or source-pixel equivalence.

## Current adapter additions and intentional deviations

- The visible controls are custom combobox buttons with portaled listboxes, independent highlighted and committed values, groups, selection indicators, arrow/Home/End movement, typeahead, selection, dismissal, focus restoration, and explicit value/open ownership. Selection/open callbacks, cancelation, ownership races, disabled options/groups/fieldset, readOnly, and optional native name/form/required/reset/FormData handling are added adapter contracts beyond the fixed parameterless originals. The native bridge is hidden and does not replace the visible trigger/listbox.
- Select14 defaults to persistent aria-invalid=true and the exact amber warning “Production environment is currently locked for maintenance tasks.” in role=alert with explicit aria-live=polite. Its prod/Production Main initial selection and all four enabled option choices remain source-authored. The warning/invalid presentation is independent of transient required-validation failure; choosing a different environment or resetting cannot silently remove the default warning. The optional warning string uses the exact default sentence when undefined; warning="" hides only the warning. An explicit aria-invalid prop overrides the persistent true default. These customizations are adapter API, not source features. The trigger's composed aria-describedby association with the warning is an intentional accessibility addition.
- Select15 has independent small/standard/large child-prop slots, independent value/open ownership, callbacks, options, optional form names and HTMLButtonElement trigger refs. The outer component forward ref is an HTMLDivElement; each slot exposes triggerRef?: React.Ref<HTMLButtonElement>, never an aggregate button/select ref. Outer role=group uses the default accessible name Memory configuration unless explicit aria-label/aria-labelledby overrides it. Outer id derives per-slot IDs unless a slot explicitly supplies its own id. Each slot begins with the exact source placeholder and no selected value. No aggregate value, aggregate form name or computed memory total is implied. Independent state does not imply every combination of simultaneously open portals is source-authored.
- Select15 supplies explicit visually hidden labels based on the source placeholders: System memory, Standard memory and High-performance memory. The optional slot label changes that visually hidden text. No additional visible label rows or JSX-comment headings are introduced. Explicit accessible naming is an accessibility addition, not a claim that the original had no accessible names. Source size tokens imply 28/32/40px at a 16px root; the deliberate Wix theme mapping is 36/44/52px for small/standard/large. These are authored CSS targets, not measured browser geometry.
- Select16 retains its source label, default/options and focus treatment. Select17 retains its source label/default/group/options and muted shadowless trigger distinction. No leading desktop icon leaks from Select12. Business actions such as environment locking, provisioning, incident dispatch or live UI zoom are not implied by demo labels.

The source/API and acceptance evidence have separate authority. Presence and exact-source preservation do not prove behavior tests complete. This document makes no browser, assistive-technology, original-runtime or formal-acceptance claim. Actual source/packed-consumer/model checks must be read from the separately generated current reports, and independent review remains separate. Browser=0 and formal accepted=0 for this preservation evidence.

## Historical archive classification

All copied Wix50 files are preserved except the five explicitly allowed existing edit paths. Historical component distributions, compact review fixture archives and known-defect reproduction archives remain separately classified in BASELINE-PRESERVATION.json and TARBALL-INVENTORY.json; they are not all release packages. In particular the b6f7a910 initial fieldset package and its matching review/types fixture are pre-repair reproduction evidence, not the repaired Wix50 package. Failed historical reports remain unedited and do not establish failures of the new implementation.

## Historical read-only source analysis (unaltered appendix)

# Wix54 只读合同提案：select-14–17

状态：只读核对完成；仅建议，未批准下一批、未实现、未改任何候选目录、台账、包或公开站点。

## 建议与当前台账

建议下一独立 React 批为 select-14、15、16、17：4 个 canonical ID，共 6 个可见选择器。select-15 的三个控件合计只计 1 个 ID。额外核对 select-18，作为后续备选，不纳入本次 +4。

当前 849 行：Wix implemented=50、pending_adaptation=400、blocked=399、formal accepted=0；CSV 与 catalog 身份一致。select 家族共 36 项，01–13 已实现，14–36 共 23 项 pending，家族未结束，无须转入其他家族。

若未来获准且实际完成 +4，才可形成 54 / 396 / 399；本报告没有作此台账变更。

只读基线：`source originals retained in this reference directory`
原件缓存：`source originals retained in this reference directory`
锁定上游 revision：`424fe703d19b39e86bef90c4ba0a76ef8c1fb260`

## 逐项原件与完整合同

### select-14

- canonical ID：`watermelon:components:select-14`
- 台账：`pending_adaptation`；React `not_adapted`；独审 pending；formal accepted=false；blocker 为空。
- 原件相对路径：`src/data/contents/components/select/variant-14.tsx`
- 字节：1751；Git blob：`a503f9555db06da4cb8885c8bb60f0b8c8f1926f`
- SHA-256：`681bb076db2d4719d49eee9c371ba811cc4d4c0f4917e080403d2434021f09b2`
- 来源：https://github.com/WatermelonCorp/watermelon-platform/blob/424fe703d19b39e86bef90c4ba0a76ef8c1fb260/src/data/contents/components/select/variant-14.tsx
- 计算结果与 ledger、catalog、CSV、已缓存 source-proof 全部一致，无原件缺失阻塞。
- 控件数量：1；Moderate: persistent invalid-state presentation distinct from transient form validation.

#### 子控件 environment
- 可见标签：Active Environment
- Placeholder：Identify environment
- 默认值：`prod` → Production Main
- 分组标题：无分组
- 尺寸：default
- 选项（原顺序，全部未声明 disabled）：
  - `dev` → Development Sandbox
  - `staging` → Staging Cluster
  - `qa` → QA Validation
  - `prod` → Production Main

持久状态：Trigger has literal aria-invalid="true". It is unconditional, including after selecting any non-production value.

静态文案：Production environment is currently locked for maintenance tasks.
原件语义：`p`、`role=alert`、`aria-live=polite`；无描述 ID/aria-describedby 关联。

**原件状态与交互事实**
- All four options remain enabled; neither Select nor its options is disabled. The maintenance sentence is static copy, not an enforced lock.
- No validation handler, conditional maintenance check, backend action, network request, callback, or form exists.
- Selected/default value is prod; changing it is delegated to the same Radix primitive as Select10–13. The alert and invalid attribute remain mounted independently of selection.

**原件样式差异**
- Outer w-full max-w-xs space-y-2; label text-zinc-600/dark:text-zinc-400.
- Trigger w-full rounded-xl, white/zinc-950, subtle border/shadow and hover transition.
- Invalid border is amber-500 with amber-500/20 ring; dark amber-900 / amber-900/40. Text is 12px amber-600/dark:amber-500.
- Popup rounded-xl, p-1, shadow-lg, position=popper, sideOffset=4; options rounded-lg.

**可复用 Wix50 合同**
- Existing single-select value/open ownership, grouped/ungrouped data, refs, pointer/keyboard/typeahead, portal, dismissal, focus, form-bridge additions may be retained as adapter contract.
- Existing aria-invalid override can express persistent true; an explicit constant warning message can reuse described-by ID composition after an intentional accessibility correction.

**不能直接复用 / 需要新合同**
- Existing helper renders role=region/aria-live=polite, so it is not the source alert contract.
- Existing error renders role=alert with no explicit aria-live and uses red error styling. It cannot reproduce the exact source role=alert + aria-live=polite amber warning by passing only error text.
- Do not drive this warning from the transient required-validation invalid flag: selection/reset must not silently clear the authored persistent warning.
- Proposed source-default invalid=true + persistent warning presentation must be independent of optional required-validation errors. Any ability to override/suppress the authored warning is a documented added API.

**后续最低检查**
- Assert prod/Production Main on first render and all option value/labels/order.
- Choose dev, qa, staging, and prod by pointer/keyboard; warning and aria-invalid=true persist; no disabled state appears.
- If form/reset API is offered, reset restores prod for uncontrolled state and preserves the static warning; controlled owner still wins.
- Exact alert text, role=alert, explicit aria-live=polite; any aria-describedby addition is documented as an accessibility correction.

### select-15

- canonical ID：`watermelon:components:select-15`
- 台账：`pending_adaptation`；React `not_adapted`；独审 pending；formal accepted=false；blocker 为空。
- 原件相对路径：`src/data/contents/components/select/variant-15.tsx`
- 字节：3272；Git blob：`72d1915cf5c1f3d01fe12653089f542e18ef7947`
- SHA-256：`e17025ae60bdd61319b1b005dbc2b0e177c1b0102256cb8e288e21791fed7036`
- 来源：https://github.com/WatermelonCorp/watermelon-platform/blob/424fe703d19b39e86bef90c4ba0a76ef8c1fb260/src/data/contents/components/select/variant-15.tsx
- 计算结果与 ledger、catalog、CSV、已缓存 source-proof 全部一致，无原件缺失阻塞。
- 控件数量：3；Highest in this batch: one canonical component composes three independent roots, three placeholders, three groups and three trigger sizes.

#### 子控件 small
- 可见标签：无显式可见 Label；不得把 JSX 注释当标题
- Placeholder：System memory
- 默认值：未提供 defaultValue；初始保持 placeholder，不能擅选第一项
- 分组标题：Small Instance
- 尺寸：sm
- 选项（原顺序，全部未声明 disabled）：
  - `2gb` → 2 GB RAM
  - `4gb` → 4 GB RAM
  - `8gb` → 8 GB RAM

#### 子控件 standard
- 可见标签：无显式可见 Label；不得把 JSX 注释当标题
- Placeholder：Standard memory
- 默认值：未提供 defaultValue；初始保持 placeholder，不能擅选第一项
- 分组标题：Standard Nodes
- 尺寸：default
- 选项（原顺序，全部未声明 disabled）：
  - `16gb` → 16 GB RAM
  - `32gb` → 32 GB RAM
  - `64gb` → 64 GB RAM

#### 子控件 large
- 可见标签：无显式可见 Label；不得把 JSX 注释当标题
- Placeholder：High-performance memory
- 默认值：未提供 defaultValue；初始保持 placeholder，不能擅选第一项
- 分组标题：Performance Cluster
- 尺寸：large-class-override
- 选项（原顺序，全部未声明 disabled）：
  - `128gb` → 128 GB RAM
  - `256gb` → 256 GB RAM
  - `512gb` → 512 GB RAM

**原件状态与交互事实**
- There are exactly three sibling Select roots. None has value, defaultValue, open, defaultOpen, onValueChange or onOpenChange. Each starts with an unselected placeholder under the primitive contract; no first option is explicitly selected.
- Each root owns a separate dataset and selection. There is no aggregate memory total, cross-selector sync, dependency, minimum/maximum validation, or automatic opening of the next control.
- Small Select / Default Select / Large Select are JSX comments, not visible headings. There are no Label imports/elements, useId calls, explicit trigger IDs, aria-label or aria-labelledby attributes.
- Actual accessible naming is delegated to primitive/trigger content and was not executed. Do not claim these controls have no accessible name; only absence of explicit authored labels is established.

**原件样式差异**
- Outer w-full max-w-xs space-y-4; each of three inner wrappers space-y-1.
- Small trigger explicitly size=sm and !rounded-xl. Standard trigger omits size, so wrapper default=default. Large trigger omits size and uses !h-10 plus px-3.
- Shared wrapper data-[size=sm]:h-7 and data-[size=default]:h-8 imply 1.75rem/2rem; !h-10 is 2.5rem. At a 16px root these correspond to 28/32/40 CSS px, a source-token interpretation, not measured runtime geometry.
- All trigger widths fill their wrapper, use rounded-xl and compact popup style; each group has its own heading; Small Instance also explicitly text-xs.

**可复用 Wix50 合同**
- Use three independent instances of the Wix50 popup behavior, each with its own IDs, owner revisions, value/open state, option refs, reset observation and callback details.
- Reuse SelectItem/SelectGroup data shape and per-slot value/defaultValue and open/defaultOpen exclusivity, event-reason types and HTMLButtonElement refs.

**不能直接复用 / 需要新合同**
- The existing one-value SelectMenuProps cannot describe the composite as a whole. A single shared value/open/defaultValue/name/ref would conflate three controls.
- Propose named small/standard/large child-prop slots, with per-slot options, value/defaultValue, open/defaultOpen, callbacks, disabled/readOnly/required, name/form and button ref; outer props cover only layout/container metadata. This is an adapter proposal, not an upstream API.
- Forward a composite outer ref only with an explicit HTMLDivElement contract, or expose three explicit trigger refs. Never advertise the composite ref as HTMLButtonElement/HTMLSelectElement.
- Core currently always renders a visible label and its variants are only select10–13. label="" still emits the label/grid row. Need an explicit non-visible-label presentation with stable aria-label (prefer exact placeholder text) as documented accessibility improvement.
- Current CSS has minimum 48px triggers and no size API. Need distinct compact/standard/large style mapping, not three visually identical controls. Preserve source 28/32/40 sizing or explicitly document chosen Wix-theme remapping and test all three dimensions; do not claim source-pixel equivalence for a remap.
- Use one outer canonical data-component=select-15 and separate data-control=small/standard/large identities. Do not count its three controls as three catalog additions.
- No shared form name, synthetic total, aggregate callback or forced one-popup policy is source-authored. Any such API is separate new work; document only the existing outside-focus/pointer interaction if reused.

**后续最低检查**
- Initial render shows all three exact placeholders and no selected option in any list.
- Assert three groups and all nine option values/labels/order; commit 4gb/32gb/256gb independently and verify siblings do not change.
- Three distinct measured trigger heights; source comments must not leak as visible headings.
- Unique trigger/listbox/group/option/description IDs across three slots and multiple composite mounts; tab order small→standard→large and reverse.
- If slot APIs are offered: one controlled slot can reject/cancel while another uncontrolled slot commits; disabled/fieldset/readOnly applies at intended scope; reset/form owner transitions affect only intended instances.
- Per-slot named FormData entries are optional adapter API, not upstream requirement; no name by default and no invented field names.

### select-16

- canonical ID：`watermelon:components:select-16`
- 台账：`pending_adaptation`；React `not_adapted`；独审 pending；formal accepted=false；blocker 为空。
- 原件相对路径：`src/data/contents/components/select/variant-16.tsx`
- 字节：1526；Git blob：`d54d46e21558a07f72921d90443f57f996127a88`
- SHA-256：`e3030e1cd4b1f822ebb7cce20a344b0784d108d01cd503109af7f28842ce7608`
- 来源：https://github.com/WatermelonCorp/watermelon-platform/blob/424fe703d19b39e86bef90c4ba0a76ef8c1fb260/src/data/contents/components/select/variant-16.tsx
- 计算结果与 ledger、catalog、CSV、已缓存 source-proof 全部一致，无原件缺失阻塞。
- 控件数量：1；Low: single custom popup with distinct focus treatment and exact data.

#### 子控件 criticality
- 可见标签：System Criticality
- Placeholder：Set level
- 默认值：`p2` → P2 - Priority Ops
- 分组标题：无分组
- 尺寸：default
- 选项（原顺序，全部未声明 disabled）：
  - `p1` → P1 - Highest Attention
  - `p2` → P2 - Priority Ops
  - `p3` → P3 - Regular Flow
  - `p4` → P4 - Informational

**原件状态与交互事实**
- Single uncontrolled root defaultValue=p2. No alert, helper, group, disabled item or callback.
- Selecting a priority changes only local primitive selection; it does not trigger incident handling, notifications, persistence or a network request.

**原件样式差异**
- Outer w-full max-w-xs space-y-2; trigger rounded-xl, white/zinc-950, shadow-xs and hover transition.
- Focus-visible border-zinc-400 and ring-zinc-400/20; dark focus-visible border-zinc-600 and ring-zinc-500/20.
- Ungrouped rounded-lg items in rounded-xl p-1 shadow-lg popup with position=popper/sideOffset=4.

**可复用 Wix50 合同**
- Existing single-select SelectMenuProps and button-ref shape fit once a new variant definition/identity and style hooks exist.
- Reuse ungrouped options, selection/open event contracts and popup behavior without importing native-select contracts.

**不能直接复用 / 需要新合同**
- Need actual select-16 canonical identity/default data and focus-theme recipe. Passing new labels/options through Select10/11 while retaining their data-component and variant styling is not a genuine select-16 adaptation.
- No business priority callback or system-write behavior is source-required.

**后续最低检查**
- Initial p2/P2 - Priority Ops; all four exact labels/order.
- Keyboard focus is visible under normal/dark/forced-colors presentation; no alert/helper is added by default.
- Selection works independently from adjacent instances and has no business-side effects.

### select-17

- canonical ID：`watermelon:components:select-17`
- 台账：`pending_adaptation`；React `not_adapted`；独审 pending；formal accepted=false；blocker 为空。
- 原件相对路径：`src/data/contents/components/select/variant-17.tsx`
- 字节：1676；Git blob：`0b747440f26253ef0f566d8b5dbf3fe6552733ff`
- SHA-256：`13da94f73b6aec9ed6428c6ed5b2e038522cbdf76c458ff4c62a56cfc1ee490f`
- 来源：https://github.com/WatermelonCorp/watermelon-platform/blob/424fe703d19b39e86bef90c4ba0a76ef8c1fb260/src/data/contents/components/select/variant-17.tsx
- 计算结果与 ledger、catalog、CSV、已缓存 source-proof 全部一致，无原件缺失阻塞。
- 控件数量：1；Low: single grouped custom popup with a muted, shadowless trigger.

#### 子控件 operation
- 可见标签：Operation Type
- Placeholder：System category
- 默认值：`internal` → Internal Operations
- 分组标题：Resource Categories
- 尺寸：default
- 选项（原顺序，全部未声明 disabled）：
  - `internal` → Internal Operations
  - `client` → Client Interaction
  - `rd` → Research & Develop
  - `maint` → System Maintenance

**原件状态与交互事实**
- Single uncontrolled root defaultValue=internal and one labeled group. No helper, error, explicit disabled item or callback.
- Resource Categories is a non-selectable group heading; selecting System Maintenance performs no maintenance action.

**原件样式差异**
- Outer w-full max-w-xs space-y-2.
- Trigger rounded-xl; border-zinc-300/50 bg-zinc-100/50 shadow-none; hover:bg-zinc-100; focus-visible:ring-zinc-400/20; px-3.
- Dark trigger border-zinc-700/50 bg-zinc-900/50 hover:bg-zinc-900, focus-visible:ring-zinc-500/20.
- Group heading text-zinc-500; popup remains white/zinc-950 with rounded-xl p-1 shadow-lg, position=popper/sideOffset=4.

**可复用 Wix50 合同**
- Existing grouped options and single-select value/open/option/trigger-ref contracts fit.
- Reuse group roles/non-selectability, pointer/keyboard/typeahead and portal behavior.

**不能直接复用 / 需要新合同**
- Muted filled trigger must remain distinguishable from Select16 white trigger and Select14 warning state; remove trigger shadow deliberately without removing popup shadow.
- A new identity/definition is required; old Select10/11 grouped ornamentation must not leak in by aliasing exports.

**后续最低检查**
- Initial internal/Internal Operations; exact Resource Categories heading and all four exact labels/order including Research & Develop.
- Heading cannot be selected or reached as an option; keyboard/typeahead operate only on the four values.
- Default trigger is muted/filled and shadowless; popup still has its own shadow.

### select-18（备选，不含于建议 +4）

- canonical ID：`watermelon:components:select-18`
- 台账：`pending_adaptation`；React `not_adapted`；独审 pending；formal accepted=false；blocker 为空。
- 原件相对路径：`src/data/contents/components/select/variant-18.tsx`
- 字节：1464；Git blob：`658979ece3b2de549d7bc3481ef1cc2632d319e2`
- SHA-256：`6a1ac078fbd4d204b13220fbc7f04f2b851a43672a519e090ed5339f996d24b7`
- 来源：https://github.com/WatermelonCorp/watermelon-platform/blob/424fe703d19b39e86bef90c4ba0a76ef8c1fb260/src/data/contents/components/select/variant-18.tsx
- 计算结果与 ledger、catalog、CSV、已缓存 source-proof 全部一致，无原件缺失阻塞。
- 控件数量：1；Low: single ungrouped transparent-borderless trigger.

#### 子控件 scale
- 可见标签：UI Scaling Factor
- Placeholder：Display scale
- 默认值：`100` → Standard Scale (100%)
- 分组标题：无分组
- 尺寸：default
- 选项（原顺序，全部未声明 disabled）：
  - `80` → Compact View (80%)
  - `100` → Standard Scale (100%)
  - `125` → Cozy Desktop (125%)
  - `150` → Accessible (150%)

**原件状态与交互事实**
- Single uncontrolled defaultValue=100; no helper, callback, disabled item, form or side effect.
- Choosing a scale does not actually zoom the page, change font sizing or update OS/browser settings.

**原件样式差异**
- Label additionally font-medium.
- Trigger rounded-xl border-none bg-transparent shadow-none, hover:bg-zinc-100/80, focus-visible:ring-zinc-400/20; dark transparent/hover:zinc-800/80 and ring-zinc-500/20; px-3.
- Same custom rounded popup, position=popper/sideOffset=4 and ungrouped rounded-lg items.

**可复用 Wix50 合同**
- Existing single-select ownership, popup, options and button-ref contract fit after new definition/identity.

**不能直接复用 / 需要新合同**
- Do not implement actual UI zoom based on demo label alone.
- Needs transparent/borderless/shadowless trigger presentation, not an alias of existing Select10–13 styles.

**后续最低检查**
- Initial 100/Standard Scale (100%); all four exact values/labels/order; selection changes displayed value only.

## 共用原件边界

- All inspected originals are parameterless React components, importing local base-ui/select; select14/16/17/18 also import useId and base-ui/label. select15 imports only select wrapper symbols.
- The wrapper filename base-ui/select does not mean @base-ui/react is used: it imports Select from radix-ui. Label also uses radix-ui. @base-ui/react is in the application manifest but not this transitive source path.
- Root is pure props forwarding. Trigger/Value/Content/Group/Label/Item behavior is delegated to Radix; the local wrapper contains no state hooks, selection callbacks, custom keyboard handler or reset implementation.
- Wrapper explicitly includes Portal > Content > Viewport, scroll up/down controls, chevron trigger glyph, and selected item CheckIcon. All candidates request position=popper and sideOffset=4; wrapper additionally applies side translate utility classes. Exact original runtime position/collision/Tab behavior was not executed.
- No inspected variant authors disabled roots/items, readOnly, required, name, form, submit/reset behavior, external callbacks or network writes. A warning sentence does not imply a disabled root. Numeric option strings do not imply numeric business actions.
- Wrapper forwards primitive props and includes disabled styling. Those capability paths are not exercised by the fixed candidate datasets. Runtime Radix implementation and its exact hidden form/keyboard/focus semantics are unavailable in the checked toolchain.
- The proposed adapter should keep a visible custom combobox trigger/listbox, independent highlighted versus selected state, selection indication, grouping, popup dismissal and focus handling. Precise keyboard/focus/reset choices below are a reused Wix adapter contract, not verified original Radix equivalence.

## 实际依赖与替代边界

- variant14/16/17/18 -> react useId + base-ui/label + base-ui/select
- variant15 -> base-ui/select
- base-ui/select -> react + radix-ui Select + lucide-react ChevronDownIcon/CheckIcon/ChevronUpIcon + lib/utils
- base-ui/label -> react + radix-ui Label + lib/utils
- lib/utils -> clsx + tailwind-merge

上游声明范围（仅清单范围，不是本机已安装版本）：
- react: ^19.3.0
- react-dom: ^19.3.0
- radix-ui: ^1.6.7
- lucide-react: ^0.577.0
- clsx: ^2.1.1
- tailwind-merge: ^3.7.0
- tailwindcss: ^4.3.3

现有本地工具链核对：
- react: 19.3.0
- react-dom: 19.3.0
- radix-ui: 未在所检查工具链中找到
- @radix-ui/react-select: 未在所检查工具链中找到
- @radix-ui/react-label: 未在所检查工具链中找到
- lucide-react: 未在所检查工具链中找到
- clsx: 未在所检查工具链中找到
- tailwind-merge: 未在所检查工具链中找到
- tailwindcss: 未在所检查工具链中找到
- esbuild: 0.28.2
- typescript: 7.0.2
- jsdom: 30.1.2

@base-ui/react, @tabler/icons-react, @floating-ui/react and application packages are not direct imports in these five variants or the inspected select/label/utils wrappers. Do not treat the whole application manifest as per-component requirements. Radix internal transitives were not available to audit.

Current vendor PROVENANCE declares React/ReactDOM18.2.0 extracted from locally installed JupyterLab. Local package toolchain declares React/ReactDOM19.3.0. This proposal inspected metadata/code only; it did not execute either UI or upstream Radix.

- Reuse current React/ReactDOM-only custom popup behavior; keep React and ReactDOM peer/external as existing package does.
- Replace Radix Select/Label behavior with explicit Wix React engine and native label semantics; this is an adapter substitution, not Radix runtime parity.
- Translate Tailwind/cn recipes into locally scoped Wix CSS. Preserve content/state distinctions and explicitly document theme and size remapping.
- Existing original simple SVG chevron/check can replace lucide geometry with attribution/deviation disclosure. No variant14–18 adds a leading icon; no desktop icon should leak from Select12.
- A hidden native form bridge is an optional adapter mechanism, not a visible native replacement or an upstream form requirement.

## 共享原件身份

- `src/components/base-ui/select.tsx`：6679 bytes；Git blob `f09dfb489ab62e3ea68d640f2c345753f5277110`；SHA-256 `c1295c1404b67895549b89225885eba08198a5d6224c733fbb8964eaaa2edff4`。
- `src/components/base-ui/label.tsx`：592 bytes；Git blob `f752f82ba6be3cf9a1015c1d61df5de00a1eaf66`；SHA-256 `a9e5ce00e4809f1f6804d0e48de09bf364bddc424947c25d2a276c2fc6514c50`。
- `src/lib/utils.ts`：196 bytes；Git blob `649b3921a8dcbefd43d3cd9182867c8bc8783e73`；SHA-256 `7dc23d640d1cd4b716abd100b4ef57279bb15406ab860c6717c742b9512db019`。
- `package.json`：4203 bytes；Git blob `5f0416b5f7425a8cd3374fc6f5b1e9dc7249301b`；SHA-256 `bb874d7ca4b1b87f8957ef4c996c607656f63ba489ddb9f916a9bd65f4da474a`。
- `LICENSE`：1089 bytes；Git blob `c76bf56983389c53194eecc9d088ac8de34debe1`；SHA-256 `53acf7b74b1e84b858c3340dbc2bcb809491eea857986132873041166ffcdfe0`。

## Wix50 API 复用精确边界

### Data
SelectOption, SelectGroup, SelectItem; unique nonempty string values, string labels, optional disabled and flat groups
All six controls; select15 has separate options for each slot. Preserve authored option order and empty placeholders.

### Selection ownership
value XOR defaultValue; onValueChange(value, detail); pointer/keyboard reasons; synchronous detail.preventDefault; independent controlled owner authority
Per single trigger, including each select15 slot. Added adapter API beyond parameterless originals.

### Open ownership
open XOR defaultOpen; onOpenChange(open, detail); trigger/keyboard/selection/escape/tab/outside-pointer/focus-out reasons
Per trigger; never one shared open bit for all select15 controls. External owner changes produce no business callbacks.

### Keyboard and focus
Roving option focus; Arrow/Home/End, 700ms prefix typeahead, Enter/Space commit, Escape restore, outside focus/pointer dismissal, documented light-DOM Tab semantics
Reuse implementation contract and its explicit limits; repeat tests for new variants, three-slot composition and current repaired fieldset observer.

### Portal and identity
ownerDocument.body portal; useId/unique IDs; fixed placement, resize/scroll handling; cleanup; React18/19 SSR constraints
Reuse for each trigger; add select14–17 canonical data identities and select15 child keys. No native HTMLSelectElement visible-control refs.

### Presentation metadata
id, dir, motion, className/style root, supported aria naming/description/invalid props, restricted triggerProps, HTMLButtonElement ref
Fits select14/16/17 per-control; select15 needs a separate outer/slot API and non-visible-label/size presentation.

### Optional form API
disabled, readOnly, required, name, form; hidden native select bridge, FormData, canceled reset and controlled/reset ordering rules
Can retain as an explicitly added adapter API, with separate tests. No invented default names, required flags, form submission contract or upstream reset-parity claims.

### 不得直接沿用的合同

- Current Core is private, definitions/types/exports are limited to select10–13, and public exports lock their variant. Do not import a nonexistent generic public Core or rename Select10/11 at runtime as select14–17.
- Wix50 SelectMenuProps is a one-trigger contract. Select15 requires explicit composition, separate defaults/owner revisions/callbacks/refs/form names and a documented outer component interface.
- Current visible label is unconditional; helper is role=region + polite; error is role=alert without explicit aria-live. Select14 requires a persistent amber alert with explicit polite override, and select15 requires no added visible label rows unless documented as a design change.
- Current minimum trigger height is 48px and existing per-variant ornaments/desktop icon/helper belong only to select10–13. New variant data, size rules and styling are required; sharing engine is not sharing all visual contracts.
- Existing native-select packages/tests (select1–9) cannot prove custom popup refs, keyboard, portal, focus or dismissal. Existing Wix50 test results likewise are not independent acceptance of unimplemented new variants.
- No source search field, multi-select, combobox input, async loading, hierarchical menu, auto-save, environment locking, incident dispatch, memory provisioning or live UI scaling is required. Do not add these from semantic labels.
- Retain all Wix50 evidence/source/dist/package artifacts untouched. If later authorized, derive a new isolated package from the final repaired/frozen engine snapshot with provenance and new styles/contracts; do not modify frozen engine or count reuse as a newly completed ID.

## 后续验收门槛（本次未运行）

1. Before implementation, re-read the final Wix50 freeze manifest and hashes: this read-only proposal records the current repaired candidate snapshot, not certification that its independent review has passed.
2. Preserve the full 849-row ledger, all source identities and all other styles. Only proposed select14–17 Wix status/implementation fields may later change after actual implementation; select15 is one ID despite three triggers.
3. Verify exact source Git blobs/SHA256/bytes and MIT attribution; check four canonical IDs and six source controls with exact strings/options/groups/defaults.
4. Test pointer, keyboard/typeahead, Escape/Tab/outside dismissal, IME/modifier/auto-repeat, no phantom callbacks, callback cancellation/owner races and fieldset-disabled transitions per trigger and across the three-slot composite.
5. If the full Wix50 API is retained, exercise disabled options/groups, readOnly, empty/all-disabled options, required validation, FormData, external forms, canceled reset, same-value reset, control acquisition/release, unmount and remount at each slot. These are adapter-added tests.
6. Require source-facing special cases: select14 warning/aria-invalid stay after selection/reset; select15 all three placeholders initially and independent values/sizes; select16 focus treatment; select17 muted shadowless trigger with grouped popup.
7. Require actual browser checks for popup geometry/clipping/scroll/zoom/narrow widths/touch, accessible names and focus in the new six-control composition. Static/JSDOM inspection cannot establish browser or assistive-tech equivalence.
8. Build and test fresh packed consumer ESM/CJS/strict types/SSR using existing local toolchain; check React18 showcase and React19 package scope separately. Do not install dependencies or fetch source.
9. Independent review/formal acceptance remains separate; current formal accepted count stays 0. No GitHub push, upload, public-site change, native/Flutter implementation, or implementation claim is part of this proposal.

## 当前快照与限制

本提案仅进行了读取、字节/散列重算、代码合同检查和输出文件生成。没有执行原件或新控件，没有运行浏览器/打包/独审。Wix50 独审/封档结论应以父任务的最新结论为准；开下一批前重新核对最终修复版本。

- `public/data/coverage-matrix.json`：4815936 bytes；SHA-256 `9779ce2c585509b6a683e0e0d2ddad0071a9e4a3b1594dd7bc8601895dd78d4b`。
- `docs/coverage/wix-849.csv`：641286 bytes；SHA-256 `8dd4360cb2a60e6ac98306e1404824a29c5fe7f42130fc8636c51f8970743bdd`。
- `references/catalog-849.json`：2562472 bytes；SHA-256 `5889ad208f21613a098b697ac4fd8d879068a9b2801264d9983e71a39a05fe6a`。
- `wix-select-menu/src/index.tsx`：43812 bytes；SHA-256 `f20fe4fbd37ae6cf096dc22f16d7bba7fe54143bd6797beca19f9fe3d16513f1`。
- `wix-select-menu/src/types.ts`：3141 bytes；SHA-256 `d0ef205a02e1f2eed6c4c3443b0385ebd7123bdf591c26fa0d7b245eaa4f1c81`。
- `wix-select-menu/src/index.d.ts`：711 bytes；SHA-256 `d3338ca11fc3dfff1f6047ac8e6712458e6df42560cd715ba2a79ec033dcc966`。
- `wix-select-menu/src/styles.css`：10561 bytes；SHA-256 `0497dead8eeefb7cc3e79725e4d293d7368586b20697298975339537a1cc8a09`。
- `wix-select-menu/README.md`：18426 bytes；SHA-256 `2afc9fececda629571c096c6ffe03feb3a4a34accaa65859f3ffb7373777bbc7`。
- `wix-select-menu/package.json`：749 bytes；SHA-256 `6be18cf390cb3f5b67f03f3c8ae0b0e32b3a4386163654d44b9a15211e8f8f14`。
- `vendor/PROVENANCE.json`：4690 bytes；SHA-256 `ef871361f5f557e78b9679a4e8fa973c02dd9c98a4201a0fe4893c92b0c5c7d5`。

JSON 附有每个候选的完整台账状态、身份匹配结果、全部默认文案/选项/分组/交互事实、共用原件身份、依赖清单与逐项 API 复用分析。
