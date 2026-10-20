/** Example-only local SVG generator. Not part of the public npm runtime exports. */
export type ProofSource = 'palette' | 'archive';
export type ProofTemplate = 'cards' | 'bands' | 'tokens';
export type ProofSize = 'small' | 'medium' | 'large';
export type ProofLabels = 'hex' | 'ordinal' | 'none';
export interface ProofSettings { readonly source: ProofSource; readonly template: ProofTemplate; readonly size: ProofSize; readonly labels: ProofLabels }
export interface ProofFile { readonly content: string; readonly filename: string; readonly mime: 'image/svg+xml'; readonly width: number; readonly height: number; readonly colors: readonly string[] }
const member = <T extends string>(value: unknown, allowed: readonly T[], name: string): T => {
  if (typeof value !== 'string' || !allowed.includes(value as T)) throw new TypeError(`Invalid ${name}.`);
  return value as T;
};
function textInk(hex: string): string {
  const channels = [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16) / 255).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  const luminance = channels[0]! * 0.2126 + channels[1]! * 0.7152 + channels[2]! * 0.0722;
  return (luminance + 0.05) / 0.05 >= 1.05 / (luminance + 0.05) ? '#000000' : '#FFFFFF';
}
export function createProofSheet(input: readonly string[], options: ProofSettings): ProofFile {
  const snapshot: unknown[] = Array.isArray(input) ? Array.from(input) : [];
  if (!Array.isArray(input) || snapshot.length < 1 || snapshot.length > 15 || snapshot.some(color => typeof color !== 'string' || !/^#[\da-f]{6}$/i.test(color))) throw new TypeError('Provide one to fifteen six-digit hex colors.');
  if (!options || typeof options !== 'object') throw new TypeError('Proof settings are required.');
  const source = member(options.source, ['palette', 'archive'], 'source');
  const template = member(options.template, ['cards', 'bands', 'tokens'], 'template');
  const size = member(options.size, ['small', 'medium', 'large'], 'size');
  const labels = member(options.labels, ['hex', 'ordinal', 'none'], 'labels');
  const colors = [...new Set((snapshot as string[]).map(color => color.toUpperCase()))];
  const width = {small: 480, medium: 720, large: 960}[size];
  const columns = template === 'bands' ? 1 : {small: 3, medium: 4, large: 6}[size];
  const gap = 12, padding = 24, start = 72, cellWidth = (width - padding * 2 - gap * (columns - 1)) / columns;
  const cellHeight = template === 'bands' ? 44 : template === 'tokens' ? 100 : labels === 'none' ? 80 : 104;
  const rows = Math.ceil(colors.length / columns), height = start + rows * cellHeight + (rows - 1) * gap + padding;
  const format = (number: number) => Number(number.toFixed(3)).toString();
  const title = source === 'palette' ? 'Palette proof' : 'Archive proof';
  const parts = [`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title description">`, `<title id="title">${title}</title>`, `<desc id="description">${colors.length} colors; ${template}; ${size}; ${labels} labels. Local design proof only.</desc>`, `<rect width="${width}" height="${height}" fill="#FFFAF4"/>`, `<text x="24" y="34" font-family="system-ui, sans-serif" font-size="18" font-weight="700" fill="#30231E">${title}</text>`, `<text x="24" y="54" font-family="system-ui, sans-serif" font-size="11" fill="#6D5548">${colors.length} colors / ${template} / ${size}</text>`];
  colors.forEach((color, index) => {
    const x = padding + (index % columns) * (cellWidth + gap), y = start + Math.floor(index / columns) * (cellHeight + gap);
    const label = labels === 'hex' ? color : labels === 'ordinal' ? `Color ${String(index + 1).padStart(2, '0')}` : '';
    parts.push(`<g data-color="${color}">`);
    if (template === 'tokens') {
      const radius = 28, cx = x + cellWidth / 2;
      parts.push(`<circle cx="${format(cx)}" cy="${y + radius + 2}" r="${radius}" fill="${color}" stroke="#9B7866" stroke-width="1"/>`);
      if (label) parts.push(`<text x="${format(cx)}" y="${y + 82}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="#30231E">${label}</text>`);
    } else if (template === 'bands') {
      parts.push(`<rect x="${format(x)}" y="${y}" width="${format(cellWidth)}" height="${cellHeight}" rx="5" fill="${color}"/>`);
      if (label) parts.push(`<text x="${format(x + 14)}" y="${y + 27}" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="${textInk(color)}">${label}</text>`);
    } else {
      const swatchHeight = labels === 'none' ? cellHeight : cellHeight - 28;
      parts.push(`<rect x="${format(x)}" y="${y}" width="${format(cellWidth)}" height="${cellHeight}" rx="8" fill="#F4EDE3" stroke="#9B7866" stroke-width="1"/>`, `<rect x="${format(x + 5)}" y="${y + 5}" width="${format(cellWidth - 10)}" height="${swatchHeight - 10}" rx="4" fill="${color}"/>`);
      if (label) parts.push(`<text x="${format(x + 10)}" y="${y + cellHeight - 10}" font-family="system-ui, sans-serif" font-size="12" fill="#30231E">${label}</text>`);
    }
    parts.push('</g>');
  });
  parts.push('</svg>');
  return {content: parts.join('\n') + '\n', filename: `studio-proof-${source}-${template}-${size}-${labels}.svg`, mime: 'image/svg+xml', width, height, colors: Object.freeze(colors)};
}
