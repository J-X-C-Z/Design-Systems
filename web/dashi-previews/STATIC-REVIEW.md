# Static review · 2026-10-11

Repository: https://github.com/chuspeeism/dashi-ppt-skill
Revision: 21dc7e5fc8c3a0d7f6a94948153dd1ee954f4e64

## Examined source

- `skills/dashi-ppt/SKILL.md`: canonical PageContentPack; schema v2; three structure-distinct templates plus one constrained bespoke; no freely authored HTML slides; visible-copy checks and final browser review.
- `skills/dashi-ppt/references/options.md`: 12 theme identities and audiences.
- All 12 `metadata.js`: page registry and public controls; metadata is data and has not been evaluated as JavaScript.
- `src/components/bespoke/theme-profiles.mjs`: this is the bespoke branch, not a promise that all templates share its palette. For example, theme08's first template metadata mentions electric-yellow/pale-lavender surfaces while its bespoke profile uses black/gold. Theme10 uses blue/copper. Theme12 includes light/dark template controls beyond the dark cyan/magenta bespoke profile.
- `dist/theme-runtime/theme01.module.mjs`: minified React component registry, exports runtimePages. Retrieved as text only, never imported or executed.
- `scripts/goal-scaffold.mjs`: filesystem plus workflow modules; canonical projection and allocation; not run.
- `src/deckComposer.jsx`, `src/view-model/index.jsx`, `scripts/render-goal-deck.jsx`, `src/renderDeck.jsx`, `src/runtime-assets.mjs`: rendering chain inspected as text, not run.
- `scripts/start-preview-server.mjs`, `scripts/serve-preview-https.mjs`: server startup and export route coupling; not run.
- Root AGPL-3.0 license and proprietary export package license read.

## Concrete export isolation requirement

`render-goal-deck.jsx` → `renderDeck` → `copyRuntimeAssets` → every `RUNTIME_ASSET_PATHS` item.

`RUNTIME_ASSET_PATHS` includes `assets/vendor/editable-pptx-browser.js`. Therefore avoiding the export command alone is insufficient. The default HTML generation path copies a bundled export runtime.

That asset, packages/html-deck-to-pptx, and export endpoints must remain excluded. No proprietary code was retrieved, copied, modified, or run; only its license was read.

## Proposed auditable HTML-only adapter, not yet implemented or executed

1. Preserve upstream canonical planning, layout selection, projection, template components, and constrained bespoke composition.
2. Retain the three templates' visual structures and only bind original content. Do not substitute generic lookalike layouts.
3. Replace the outer rendering/delivery shell with a read-only HTML-only wrapper, using the genuine rendered components. The wrapper is not a new freely authored slide layout.
4. Remove all export actions, proprietary asset copying, editor/autosave servers, unrelated vendor animation assets, and external requests from the output surface. Verify this with dependency graph and browser network checks.
5. Scale a fixed slide canvas on desktop/mobile rather than reshuffling its internal structure. Offer readable content separately for narrow screens.
6. Preserve 3+1 variants and canonical JSON. Document precisely which standard Skill features are intentionally absent: editor persistence, full original preview server, PDF/PPTX export. Never call the altered workflow a complete unmodified upstream workflow.
7. Include notices, license, own modifications, actual used source, and third-party dependencies' notices. Resolve preferred-source availability before redistributing compiled modules or making a source-compliance assertion. Private hosting by itself is not used as a compliance shortcut.

## Verification status

No generation, install, layout query, scaffold, runtime import, server launch, screenshots, or browser QA has occurred. Preview and thumbnail fields are null. The 12 original content plans are preparation only.

## Execution update · 2026-10-11 14:41 UTC

The preceding verification-status paragraph records the earlier pre-authorization checkpoint, not current status. The user subsequently authorized fixed-version isolated HTML generation and SP adaptation. Four named npm build dependencies were installed from the official registry with --ignore-scripts after authorization evidence was supplied. No install scripts ran.

The permitted layout/scaffold/projection/template modules were executed for theme01. It now has 3 logical pages and 12 genuine component-rendered variants. Upstream schema and goal-copy validation passed. This is not visual acceptance. Local Chromium failed at process startup with socket EPERM; existing Firefox failed to launch within its timeout. Neither produced screenshots. The agreed QA route is the supported cloud browser and a private static staging route.

Published staging excludes all upstream minified JS runtime, node_modules, vendor-work, and proprietary export code. It includes only generated presentation HTML, canonical content/goal JSON, metadata, license/notice and the HTML-only adapter source. Upstream preferred-source availability remains explicitly unverified; no complete-runtime redistribution claim is made.

## Execution and browser update · 2026-10-11 15:11 UTC

Theme01 HTML revision4 passed scoped cloud Chromium visual inspection on 12 desktop pages and 12 narrow-iframe states (390px outer viewport, 375px content area with scrollbar). The final report and 24 screenshots are in theme01/qa/rev4. No physical mobile, upstream editor, export or SP product-integration claim is made.

Theme02 has now been scaffolded and rendered. Initial cloud QA identified CSS injected only by an upstream React style effect, plus reading-shell selector leakage into template header/main elements. The former is resolved by static extraction of the reviewed literal; the latter by reader-specific wrapper classes. Theme02 final visual acceptance remains pending. The first eleven old statements above describe initial nonexecution review, not current status.

SP theme01 canonical structure samples were separately validated against fixed main and PR3 candidate source and DOM geometry, but SP root README expressly withholds an open-source license. Accordingly SP original code ZIP/official-renderer HTML are withheld from publication. Only original sample JSON, conversion code and reports are intended for delivery; native deployed-SP UI verification is separately pending.

## Execution and browser update · 2026-10-11 16:06 UTC

Themes01–06 are now component-rendered and have scoped desktop + 390px iframe QA (12 slides × two contexts per theme), with actual screenshot evidence. DOM checks include internal overflow ancestors rather than only slide bounds. The 01 decorative quotation and06 giant watermark/index bleed were distinguished from factual text. Theme07 revision1 did not pass: visible central quotation text was missing despite copy validation, and unsuitable fixed-percent/line structures were identified. Revision2 selects different genuine structures and is awaiting browser reinspection. Themes08–12 remain ungenerated at this checkpoint.

SP v4 samples01–06 have independently passed fixed main and PR3 candidate schema/adapter/Core tests with final source-DOM geometry. Theme07 is still pending geometry. The deployed native-SP import has no success evidence, and an outstanding approval/timeout is not treated as completed import. Prior text-only review statements above are historical.

## Static completion and browser boundary · 2026-10-11 16:43 UTC
All12 themes now have3 logical pages ×4 variants=144 genuine generated HTML variants. All12 pass schema/copy. Themes01–08 have final scoped browser QA. Theme09 had two real QA iterations and then a newer correction whose final browser inspection remains pending; themes10–12 have no browser screenshot acceptance. Three cloud browser calls (QA, troubleshooting documentation, read-only connection state) timed out after300s. No browser reset or SP project retry occurred. A separate read-only connection attempt may establish whether a fresh QA session is usable; until evidence exists the four themes remain pending.

The theme11 navigation classification patch preserves nav defaults and template code. Regression comparison of candidate/projection JSON shows all other11 themes unchanged. 12 SP structure samples pass fixed main/PR3 pure tests, but only01–08 have final DOM geometry, and none has native deployed-SP UI acceptance.

## Final scoped acceptance · 2026-10-11 17:02 UTC
A fresh independent read-only cloud browser session connected normally. The old-session timeout did not represent a global browser outage. Themes09–12 were then inspected and iterated:09 background/blank-template projections;10 effect-only style literals, misleading fixed decorative charts and ticker capacity;11 long circle labels/low contrast;12 media placeholders. All12 themes now have12 desktop plus12 narrow-frame final screenshots. Reports are indexed inQA-SUMMARY.json. No physical-phone or comprehensive accessibility certification is claimed.

The final SP data-only package has36 slides,752 editable primitives and no rasterized slides.490 source text objects match browser DOM; maximum grid error0.015625 source pixels.13 JSON files independently rebuild byte-identically without SP code. Source-DOM acceptance does not prove deployed-editor compatibility. Read-only follow-up produced no new import conclusion; private browser inventory is withheld.
