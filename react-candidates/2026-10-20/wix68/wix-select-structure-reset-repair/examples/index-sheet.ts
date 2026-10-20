/** Full-source local document example, not a package runtime export. */
export const columnValues = ['1', '2', '3', '4', '5'] as const;
export const labelValues = ['hex', 'rgb', 'hsl', 'ordinal'] as const;
export const headingValues = ['studio', 'archive', 'proof', 'handoff'] as const;
export const densityValues = ['airy', 'comfortable', 'compact', 'micro'] as const;
export type IndexColumns = typeof columnValues[number];
export type IndexLabels = typeof labelValues[number];
export type IndexHeading = typeof headingValues[number];
export type IndexDensity = typeof densityValues[number];
export interface IndexSettings { readonly columns: IndexColumns; readonly labels: IndexLabels; readonly heading: IndexHeading; readonly density: IndexDensity }
export interface IndexSheet { readonly filename: string; readonly mime: 'text/html;charset=utf-8'; readonly html: string; readonly title: string; readonly settings: Readonly<IndexSettings>; readonly colors: readonly string[]; readonly labels: readonly string[]; readonly gap: number; readonly padding: number; readonly swatchHeight: number }
const headings: Record<IndexHeading, string> = { studio: 'Studio color index', archive: 'Archive color index', proof: 'Print proof index', handoff: 'Design handoff index' };
const metrics: Record<IndexDensity, { gap: number; padding: number; swatchHeight: number }> = { airy: { gap: 24, padding: 24, swatchHeight: 100 }, comfortable: { gap: 16, padding: 18, swatchHeight: 76 }, compact: { gap: 10, padding: 12, swatchHeight: 54 }, micro: { gap: 6, padding: 8, swatchHeight: 36 } };
const has = <T extends string>(values: readonly T[], value: unknown): value is T => typeof value === 'string' && values.includes(value as T);
export function isIndexColumns(value: unknown): value is IndexColumns { return has(columnValues, value); }
export function isIndexLabels(value: unknown): value is IndexLabels { return has(labelValues, value); }
export function isIndexHeading(value: unknown): value is IndexHeading { return has(headingValues, value); }
export function isIndexDensity(value: unknown): value is IndexDensity { return has(densityValues, value); }
function colorLabel(color: string, mode: IndexLabels, index: number): string {
  const [r, g, b] = [1, 3, 5].map(offset => Number.parseInt(color.slice(offset, offset + 2), 16));
  if (mode === 'hex') return color;
  if (mode === 'rgb') return `rgb(${r}, ${g}, ${b})`;
  if (mode === 'ordinal') return `Swatch ${String(index + 1).padStart(2, '0')}`;
  const R = r / 255, G = g / 255, B = b / 255, high = Math.max(R, G, B), low = Math.min(R, G, B), delta = high - low, lightness = (high + low) / 2;
  let hue = 0;
  if (delta) hue = high === R ? ((G - B) / delta) % 6 : high === G ? (B - R) / delta + 2 : (R - G) / delta + 4;
  hue = (hue * 60 + 360) % 360;
  const saturation = delta ? delta / (1 - Math.abs(2 * lightness - 1)) : 0;
  return `hsl(${Math.round(hue) % 360} ${Math.round(saturation * 100)}% ${Math.round(lightness * 100)}%)`;
}
export function buildIndexSheet(settings: IndexSettings, sourceColors: readonly string[]): IndexSheet {
  if (!settings || !isIndexColumns(settings.columns) || !isIndexLabels(settings.labels) || !isIndexHeading(settings.heading) || !isIndexDensity(settings.density)) throw new TypeError('Choose supported index columns, labels, heading and density.');
  if (!Array.isArray(sourceColors) || !sourceColors.length || sourceColors.length > 24) throw new TypeError('The index needs 1–24 six-digit hex colors.');
  const denseColors = Array.from(sourceColors);
  if (!denseColors.every(value => typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value))) throw new TypeError('The index needs 1–24 six-digit hex colors.');
  const colors = Object.freeze(denseColors.map(value => value.toUpperCase()));
  const labels = Object.freeze(colors.map((color, index) => colorLabel(color, settings.labels, index)));
  const chosen = Object.freeze({ columns: settings.columns, labels: settings.labels, heading: settings.heading, density: settings.density });
  const { gap, padding, swatchHeight } = metrics[chosen.density]; const title = headings[chosen.heading];
  // Every interpolation is a validated enum, integer, exact hex color or derived text.
  const cells = colors.map((color, index) => `    <li class="swatch"><span class="color" style="background-color:${color}" role="img" aria-label="Color ${color}"></span><code>${labels[index]}</code><small>${String(index + 1).padStart(2, '0')} · ${color}</small></li>`).join('\n');
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'">
<title>${title}</title>
<style>
:root{color-scheme:light;--columns:${chosen.columns};--gap:${gap}px;--padding:${padding}px;--swatch-height:${swatchHeight}px}
*{box-sizing:border-box}body{max-width:1120px;margin:0 auto;padding:32px 20px;background:#fffaf4;color:#30231e;font:16px/1.5 system-ui,sans-serif}h1{margin:0 0 6px;font-size:28px}p{margin:0 0 24px;color:#6d5548}.index{display:grid;grid-template-columns:repeat(var(--columns),minmax(0,1fr));gap:var(--gap);margin:0;padding:0;list-style:none}.swatch{min-width:0;padding:var(--padding);border:1px solid #9b7866;border-radius:8px;background:#ffffff}.color{display:block;height:var(--swatch-height);margin-bottom:10px;border:1px solid #9b7866}code,small{display:block;overflow-wrap:anywhere}code{font:600 13px/1.5 ui-monospace,monospace}small{margin-top:4px;color:#6d5548;font-size:11px}footer{margin-top:24px;border-top:1px solid #9b7866;padding-top:12px;font-size:12px;color:#6d5548}@media print{body{max-width:none;padding:12mm}.swatch{break-inside:avoid}.color{print-color-adjust:exact;-webkit-print-color-adjust:exact}}
</style>
</head>
<body>
<main aria-labelledby="index-title"><h1 id="index-title">${title}</h1><p>${colors.length} local swatches · ${chosen.columns} columns · ${chosen.labels} labels · ${chosen.density} density</p>
<ol class="index">
${cells}
</ol></main>
<footer>Local static color reference. No scripts, remote fonts or network resources.</footer>
</body>
</html>
`;
  return Object.freeze({ filename: `wix-index-${chosen.heading}-${chosen.columns}-${chosen.labels}-${chosen.density}.html`, mime: 'text/html;charset=utf-8' as const, html, title, settings: chosen, colors, labels, gap, padding, swatchHeight });
}
export function indexSheetFromForm(data: FormData, colors: readonly string[]): IndexSheet {
  const keys = ['columns', 'labels', 'heading', 'density'];
  for (const key of data.keys()) if (!keys.includes(key)) throw new TypeError('Unexpected index form field.');
  const read = (name: string) => { const values = data.getAll(name); if (values.length !== 1 || typeof values[0] !== 'string') throw new TypeError('Each index setting must have exactly one text value.'); return values[0]; };
  const columns = read('columns'), labels = read('labels'), heading = read('heading'), density = read('density');
  if (!isIndexColumns(columns) || !isIndexLabels(labels) || !isIndexHeading(heading) || !isIndexDensity(density)) throw new TypeError('Choose supported index settings.');
  return buildIndexSheet({ columns, labels, heading, density }, colors);
}
