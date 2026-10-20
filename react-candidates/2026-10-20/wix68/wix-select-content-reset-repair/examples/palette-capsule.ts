/** Local, pure document generation. No network or permission changes. */
export const capsuleLayouts = ['grid', 'list', 'table', 'contrast'] as const;
export const capsuleDisciplines = ['dev', 'creative', 'data', 'global'] as const;
export const capsuleDialects = ['css', 'js', 'json', 'csv'] as const;
export const capsuleStages = ['draft', 'active', 'archived', 'deprecated'] as const;
export type CapsuleLayout = typeof capsuleLayouts[number];
export type CapsuleDiscipline = typeof capsuleDisciplines[number];
export type CapsuleDialect = typeof capsuleDialects[number];
export type CapsuleStage = typeof capsuleStages[number];
export interface CapsuleSettings { readonly layout: CapsuleLayout; readonly discipline: CapsuleDiscipline; readonly dialect: CapsuleDialect; readonly stage: CapsuleStage }
export const capsuleDefaults: CapsuleSettings = Object.freeze({ layout: 'grid', discipline: 'dev', dialect: 'css', stage: 'active' });
export const isCapsuleLayout = (v: unknown): v is CapsuleLayout => typeof v === 'string' && (capsuleLayouts as readonly string[]).includes(v);
export const isCapsuleDiscipline = (v: unknown): v is CapsuleDiscipline => typeof v === 'string' && (capsuleDisciplines as readonly string[]).includes(v);
export const isCapsuleDialect = (v: unknown): v is CapsuleDialect => typeof v === 'string' && (capsuleDialects as readonly string[]).includes(v);
export const isCapsuleStage = (v: unknown): v is CapsuleStage => typeof v === 'string' && (capsuleStages as readonly string[]).includes(v);
const disciplines = { dev: { label: 'Engineering', icon: 'code' }, creative: { label: 'Creative Arts', icon: 'camera' }, data: { label: 'Analytics', icon: 'database' }, global: { label: 'Network Ops', icon: 'globe' } } as const;
const stages = { draft: { label: 'Unpublished Draft', color: '#6D5548' }, active: { label: 'Live Deployment', color: '#296443' }, archived: { label: 'Archived Record', color: '#8C531B' }, deprecated: { label: 'Legacy System', color: '#953E4E' } } as const;
const layoutTitles = { grid: 'Compact color cards', list: 'Spacious color list', table: 'Token reference table', contrast: 'Contrast reference ledger' } as const;
const dialectTitles = { css: 'CSS custom properties', js: 'JavaScript object', json: 'JSON tokens', csv: 'CSV rows' } as const;
const escape = (value: string) => value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
export function normalizeCapsuleColors(input: readonly string[]): readonly string[] {
  if (!Array.isArray(input) || input.length < 1 || input.length > 24) throw new TypeError('Provide 1–24 six-digit hex colors.');
  const dense: unknown[] = Array.from(input);
  if (!dense.every((value): value is string => typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value))) throw new TypeError('Every color must be a six-digit hex string; sparse arrays are not supported.');
  return Object.freeze(dense.map(value => value.toUpperCase()));
}
export function validateCapsuleSettings(input: CapsuleSettings): CapsuleSettings {
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length !== 4 || !Object.keys(input).every(key => ['layout', 'discipline', 'dialect', 'stage'].includes(key)) || !isCapsuleLayout(input.layout) || !isCapsuleDiscipline(input.discipline) || !isCapsuleDialect(input.dialect) || !isCapsuleStage(input.stage)) throw new TypeError('Choose one supported layout, discipline, dialect and stage.');
  return Object.freeze({ layout: input.layout, discipline: input.discipline, dialect: input.dialect, stage: input.stage });
}
export function capsuleSettingsFromForm(form: FormData): CapsuleSettings {
  const record: Record<string, FormDataEntryValue> = {};
  for (const [key, value] of form.entries()) {
    if (!['layout', 'discipline', 'dialect', 'stage'].includes(key) || Object.hasOwn(record, key) || typeof value !== 'string') throw new TypeError('The capsule form contains an unknown, duplicate or nontext field.');
    record[key] = value;
  }
  return validateCapsuleSettings(record as unknown as CapsuleSettings);
}
export function capsuleLuminance(hex: string): number {
  const color = normalizeCapsuleColors([hex])[0]!;
  const channels = [1, 3, 5].map(start => parseInt(color.slice(start, start + 2), 16) / 255).map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
  return channels[0]! * .2126 + channels[1]! * .7152 + channels[2]! * .0722;
}
export interface CapsuleSwatch { readonly token: string; readonly color: string; readonly rgb: string; readonly blackContrast: number; readonly whiteContrast: number; readonly recommendedText: '#000000' | '#FFFFFF' }
export interface PaletteCapsule { readonly settings: CapsuleSettings; readonly colors: readonly string[]; readonly swatches: readonly CapsuleSwatch[]; readonly tokens: string; readonly title: string; readonly filename: string; readonly mime: 'text/html;charset=utf-8'; readonly html: string }
function svgIcon(icon: string): string {
  const paths: Record<string, string> = {
    code: '<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18"/>',
    camera: '<path d="M4 7h4l2-3h4l2 3h4a1 1 0 0 1 1 1v11H3V8a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13" r="3"/>',
    database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>',
    globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
  };
  return `<svg aria-hidden="true" focusable="false" data-icon="${icon}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${paths[icon]!}</svg>`;
}
export function buildPaletteCapsule(input: CapsuleSettings, inputColors: readonly string[]): PaletteCapsule {
  const settings = validateCapsuleSettings(input), colors = normalizeCapsuleColors(inputColors);
  const swatches = Object.freeze(colors.map((color, i): CapsuleSwatch => {
    const luminance = capsuleLuminance(color), blackContrast = (luminance + .05) / .05, whiteContrast = 1.05 / (luminance + .05);
    return Object.freeze({ token: `color-${String(i + 1).padStart(2, '0')}`, color, rgb: [1, 3, 5].map(start => parseInt(color.slice(start, start + 2), 16)).join(', '), blackContrast, whiteContrast, recommendedText: blackContrast >= whiteContrast ? '#000000' : '#FFFFFF' });
  }));
  const discipline = disciplines[settings.discipline], stage = stages[settings.stage];
  const metadata = `${discipline.label} | ${stage.label}`;
  let tokens: string;
  if (settings.dialect === 'css') tokens = `/* ${metadata} */\n:root {\n${swatches.map(s => `  --${s.token}: ${s.color};`).join('\n')}\n}\n`;
  else if (settings.dialect === 'js') tokens = `// ${metadata}\nexport const palette = Object.freeze(${JSON.stringify(Object.fromEntries(swatches.map(s => [s.token, s.color])), null, 2)});\n`;
  else if (settings.dialect === 'json') tokens = JSON.stringify({ discipline: settings.discipline, stage: settings.stage, colors: Object.fromEntries(swatches.map(s => [s.token, s.color])) }, null, 2) + '\n';
  else tokens = `discipline,stage,token,color\r\n${swatches.map(s => `${settings.discipline},${settings.stage},${s.token},${s.color}`).join('\r\n')}\r\n`;
  const title = `${discipline.label} palette capsule`;
  const patch = (s: CapsuleSwatch) => `<span class="color" role="img" aria-label="Color ${s.color}" style="background-color:${s.color};color:${s.recommendedText}">${s.color}</span>`;
  let content: string;
  if (settings.layout === 'grid' || settings.layout === 'list') content = `<ol class="swatches ${settings.layout}">${swatches.map(s => `<li>${patch(s)}<div><strong>${s.token}</strong><p>RGB ${s.rgb}</p></div></li>`).join('')}</ol>`;
  else if (settings.layout === 'table') content = `<div class="table-scroll"><table><caption>Ordered palette tokens</caption><thead><tr><th scope="col">Token</th><th scope="col">Color</th><th scope="col">RGB</th></tr></thead><tbody>${swatches.map(s => `<tr><th scope="row">${s.token}</th><td>${patch(s)}</td><td>${s.rgb}</td></tr>`).join('')}</tbody></table></div>`;
  else content = `<div class="table-scroll"><table><caption>Contrast with opaque black and white text</caption><thead><tr><th scope="col">Token / color</th><th scope="col">Black text</th><th scope="col">White text</th><th scope="col">Higher-contrast text</th></tr></thead><tbody>${swatches.map(s => `<tr><th scope="row">${s.token}${patch(s)}</th><td>${s.blackContrast.toFixed(2)}:1</td><td>${s.whiteContrast.toFixed(2)}:1</td><td>${s.recommendedText}</td></tr>`).join('')}</tbody></table></div><p>Ratios use opaque sRGB colors and relative luminance. They do not certify an entire interface or account for transparency.</p>`;
  const style = `:root{color-scheme:light;font:16px/1.5 system-ui,sans-serif;color:#30231e;background:#fffaf4}*{box-sizing:border-box}body{margin:0;padding:clamp(16px,4vw,40px)}main{max-width:1000px;margin:auto}header{border-block-end:3px solid #a47864;padding-block-end:20px}h1{display:flex;gap:12px;align-items:center;font-size:clamp(24px,4vw,36px);line-height:1.2}.status{display:inline-flex;gap:8px;align-items:center;padding:6px 12px;border:1px solid #9b7866;border-radius:20px;font-weight:650}.dot{height:8px;width:8px;border-radius:50%;background:currentColor}.meta{color:#6d5548}.swatches{list-style:none;padding:0;display:grid;gap:16px}.swatches.grid{grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr))}.swatches li{border:1px solid #9b7866;padding:12px;min-width:0}.swatches.list li{display:grid;grid-template-columns:minmax(100px,1fr) 2fr;gap:20px;align-items:center}.color{display:block;min-height:70px;padding:12px;border:1px solid #6d5548;overflow-wrap:anywhere;font-family:monospace;font-weight:700}.table-scroll{overflow:auto}table{width:100%;border-collapse:collapse}caption{text-align:start;font-weight:650;padding:12px 0}th,td{text-align:start;padding:12px;border:1px solid #9b7866}td .color,th .color{min-height:48px;margin-block-start:6px}p{overflow-wrap:anywhere}pre{white-space:pre-wrap;overflow-wrap:anywhere;border:1px solid #9b7866;padding:16px;background:#f4ede3}footer{margin-block-start:24px;border-block-start:1px solid #9b7866;padding-block-start:12px;color:#6d5548}@media(forced-colors:active){.color{forced-color-adjust:none}.dot{border:2px solid CanvasText}.status{color:CanvasText!important}}@media print{body{padding:0}.swatches li,tr{break-inside:avoid}}`;
  const html = `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src 'none'; font-src 'none'; base-uri 'none'; form-action 'none'"><title>${escape(title)}</title><style>${style}</style></head><body><main data-layout="${settings.layout}" data-discipline="${settings.discipline}" data-dialect="${settings.dialect}" data-stage="${settings.stage}"><header><p class="meta">LOCAL DESIGN HANDOFF · ${colors.length} ${colors.length === 1 ? 'color' : 'colors'}</p><h1>${svgIcon(discipline.icon)}${escape(title)}</h1><p class="status" style="color:${stage.color}"><span class="dot" aria-hidden="true"></span>${escape(stage.label)}</p><p>Lifecycle is a document label; it does not change a deployment or permission.</p></header><section aria-labelledby="layout-title"><h2 id="layout-title">${layoutTitles[settings.layout]}</h2>${content}</section><section aria-labelledby="token-title"><h2 id="token-title">Token dialect: ${dialectTitles[settings.dialect]}</h2><pre><code>${escape(tokens)}</code></pre></section><footer>Self-contained local palette reference. Color order and duplicate entries are preserved.</footer></main></body></html>\n`;
  return Object.freeze({ settings, colors, swatches, tokens, title, filename: `palette-capsule-${settings.layout}-${settings.discipline}-${settings.dialect}-${settings.stage}.html`, mime: 'text/html;charset=utf-8', html });
}
export function capsuleFromForm(form: FormData, colors: readonly string[]): PaletteCapsule { return buildPaletteCapsule(capsuleSettingsFromForm(form), colors); }
