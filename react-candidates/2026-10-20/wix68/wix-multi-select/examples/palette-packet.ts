/** Pure local export: no browser, filesystem, network, clock or download side effects. */
export const sectionOptions = Object.freeze([
  Object.freeze({ value: 'swatches', label: 'Color swatches' }),
  Object.freeze({ value: 'tokens', label: 'CSS tokens' }),
  Object.freeze({ value: 'contrast', label: 'Contrast checks' }),
  Object.freeze({ value: 'metadata', label: 'Palette metadata' }),
] as const);
export const formatOptions = Object.freeze([
  Object.freeze({ value: 'html', label: 'HTML reference' }),
  Object.freeze({ value: 'json', label: 'JSON data' }),
  Object.freeze({ value: 'css', label: 'CSS variables' }),
  Object.freeze({ value: 'csv', label: 'CSV records' }),
  Object.freeze({ value: 'svg', label: 'SVG sheet' }),
] as const);

export type PacketSection = typeof sectionOptions[number]['value'];
export type PacketFormat = typeof formatOptions[number]['value'];
export interface PacketSettings {
  readonly sections: readonly PacketSection[];
  readonly formats: readonly PacketFormat[];
}
export interface PacketFile {
  readonly name: string;
  readonly mime: string;
  readonly text: string;
  readonly bytes: Uint8Array;
}
export interface PalettePacket extends PacketSettings {
  readonly colors: readonly string[];
  readonly files: readonly PacketFile[];
  readonly bytes: Uint8Array;
  readonly filename: string;
}

const encoder = new TextEncoder();
const own = (value: object, key: PropertyKey) => Object.prototype.hasOwnProperty.call(value, key);
const id = (index: number) => String(index + 1).padStart(2, '0');
const round = (value: number, places = 4) => Number(value.toFixed(places));
const escapeMarkup = (value: unknown) => String(value).replace(/[&<>"']/g, (character) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);
const cssComment = (value: unknown) => String(value).replace(/\\/g, '\\\\').replace(/\*\//g, '* /').replace(/[\r\n]/g, ' ');
const csvCell = (value: unknown) => `"${String(value).replace(/"/g, '""')}"`;

/** Reject holes (including inherited indices) and non-index properties rather than filtering. */
function denseArray(value: unknown, name: string, maximum: number): unknown[] {
  if (!Array.isArray(value) || value.length < 1 || value.length > maximum) {
    throw new TypeError(`${name} must be a nonempty array with at most ${maximum} entries.`);
  }
  const snapshot: unknown[] = [];
  for (let i = 0; i < value.length; i += 1) {
    const property = Object.getOwnPropertyDescriptor(value, i);
    if (!property || !own(property, 'value')) throw new TypeError(`${name} must contain dense data entries.`);
    snapshot.push(property.value);
  }
  if (Reflect.ownKeys(value).some((key) => key !== 'length' &&
    (typeof key !== 'string' || !/^(0|[1-9]\d*)$/.test(key) || Number(key) >= value.length))) {
    throw new TypeError(`${name} has an unknown array property.`);
  }
  return snapshot;
}

function selection<T extends string>(value: unknown, name: string, known: readonly T[]): readonly T[] {
  const result: T[] = [];
  for (const entry of denseArray(value, name, known.length)) {
    if (typeof entry !== 'string' || !known.includes(entry as T)) {
      throw new TypeError(`${name} contains an unknown value.`);
    }
    if (result.includes(entry as T)) throw new TypeError(`${name} contains a duplicate value.`);
    result.push(entry as T);
  }
  return Object.freeze(result);
}

function validateSettings(value: PacketSettings): PacketSettings {
  if (!value || typeof value !== 'object' || Array.isArray(value) ||
    (Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) ||
    Reflect.ownKeys(value).length !== 2 || !own(value, 'sections') || !own(value, 'formats')) {
    throw new TypeError('Settings must contain exactly sections and formats.');
  }
  const sections = Object.getOwnPropertyDescriptor(value, 'sections')!;
  const formats = Object.getOwnPropertyDescriptor(value, 'formats')!;
  if (!own(sections, 'value') || !own(formats, 'value')) throw new TypeError('Settings must contain data fields, not accessors.');
  return Object.freeze({
    sections: selection(sections.value, 'sections', sectionOptions.map((option) => option.value)),
    formats: selection(formats.value, 'formats', formatOptions.map((option) => option.value)),
  });
}

/** Canonical uppercase hex; duplicates and input order are intentionally retained. */
export function canonicalizePaletteColors(colors: readonly string[]): readonly string[] {
  return Object.freeze(denseArray(colors, 'colors', 24).map((color) => {
    if (typeof color !== 'string' || color.length !== 7 || !/^#[\da-f]{6}$/i.test(color)) {
      throw new TypeError('Each color must be exactly #RRGGBB.');
    }
    return color.toUpperCase();
  }));
}

/**
 * Only repeated sections/formats fields are accepted; Blobs and duplicates are errors.
 * Retains requested order within each field. A native multiple select supplies DOM
 * option order, which may differ from the control's state insertion order.
 */
export function parsePacketFormData(form: FormData): PacketSettings {
  const sections: string[] = [];
  const formats: string[] = [];
  // Native iteration performs the FormData brand check instead of trusting a lookalike.
  for (const [name, value] of FormData.prototype.entries.call(form)) {
    if (name !== 'sections' && name !== 'formats') throw new TypeError(`Unknown form field: ${name}.`);
    if (typeof value !== 'string') throw new TypeError(`${name} must contain strings, not files.`);
    (name === 'sections' ? sections : formats).push(value);
  }
  return validateSettings({ sections: sections as PacketSection[], formats: formats as PacketFormat[] });
}

function paletteData(colors: readonly string[], settings: PacketSettings) {
  const swatches = colors.map((hex, index) => ({
    id: `color-${id(index)}`, position: index + 1, hex,
    rgb: { r: parseInt(hex.slice(1, 3), 16), g: parseInt(hex.slice(3, 5), 16), b: parseInt(hex.slice(5, 7), 16) },
  }));
  const tokens = colors.map((value, index) => ({ name: `--palette-${id(index)}`, value, swatchId: `color-${id(index)}` }));
  const contrast = swatches.map(({ id: swatchId, hex, rgb }) => {
    const linear = (channel: number) => {
      const srgb = channel / 255;
      return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
    };
    const luminance = 0.2126 * linear(rgb.r) + 0.7152 * linear(rgb.g) + 0.0722 * linear(rgb.b);
    const black = (luminance + 0.05) / 0.05;
    const white = 1.05 / (luminance + 0.05);
    const ratio = Math.max(black, white);
    return { swatchId, hex, luminance: round(luminance, 6), againstBlack: round(black), againstWhite: round(white),
      recommendedText: black >= white ? '#000000' : '#FFFFFF', contrastRatio: round(ratio),
      normalTextAA: ratio >= 4.5, normalTextAAA: ratio >= 7 };
  });
  return { swatches, tokens, contrast, metadata: {
    schema: 'palette-packet/1', generator: 'Palette Packet', colorCount: colors.length,
    uniqueColorCount: new Set(colors).size, colors: [...colors],
    sections: [...settings.sections], formats: [...settings.formats],
    contrastMethod: 'WCAG 2 relative luminance; opaque sRGB against black and white; normal-text thresholds',
  } };
}
type PaletteData = ReturnType<typeof paletteData>;

function htmlSection(section: PacketSection, data: PaletteData): string {
  switch (section) {
    case 'swatches': return `<ol>${data.swatches.map((s) => `<li><span class="swatch" style="background-color:${escapeMarkup(s.hex)}" aria-hidden="true"></span><strong>${escapeMarkup(s.id)}</strong> ${escapeMarkup(s.hex)} · rgb(${s.rgb.r}, ${s.rgb.g}, ${s.rgb.b})</li>`).join('')}</ol>`;
    case 'tokens': return `<pre>${data.tokens.map((t) => `${escapeMarkup(t.name)}: ${escapeMarkup(t.value)};`).join('\n')}</pre>`;
    case 'contrast': return '<p>Opaque sRGB on black and white. AA/AAA refer to normal text; this is not a complete accessibility audit.</p><table><thead><tr><th>Color</th><th>Black</th><th>White</th><th>Recommended text</th><th>AA</th><th>AAA</th></tr></thead><tbody>' + data.contrast.map((c) => `<tr><td>${escapeMarkup(c.hex)}</td><td>${c.againstBlack}:1</td><td>${c.againstWhite}:1</td><td>${escapeMarkup(c.recommendedText)} (${c.contrastRatio}:1)</td><td>${c.normalTextAA ? 'Pass' : 'Fail'}</td><td>${c.normalTextAAA ? 'Pass' : 'Fail'}</td></tr>`).join('') + '</tbody></table>';
    case 'metadata': return `<dl>${Object.entries(data.metadata).map(([key, value]) => `<dt>${escapeMarkup(key)}</dt><dd>${escapeMarkup(Array.isArray(value) ? value.join(', ') : value)}</dd>`).join('')}</dl>`;
  }
}

function renderHtml(data: PaletteData, sections: readonly PacketSection[]): string {
  return '<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Palette Packet</title><style>body{font:16px/1.5 system-ui,sans-serif;max-width:70rem;margin:2rem auto;padding:0 1rem;color:#172027;background:#fff}section{margin:2rem 0}li{margin:.5rem 0}.swatch{display:inline-block;vertical-align:middle;width:3rem;height:2rem;border:1px solid #777;margin-right:.7rem}table{border-collapse:collapse}th,td{text-align:left;padding:.4rem;border:1px solid #bbb}pre,dd{white-space:pre-wrap;overflow-wrap:anywhere}dt{font-weight:700}</style></head><body><main><h1>Palette Packet</h1>' + sections.map((section) => `<section data-section="${section}"><h2>${escapeMarkup(sectionOptions.find((option) => option.value === section)!.label)}</h2>${htmlSection(section, data)}</section>`).join('') + '</main></body></html>\n';
}

function renderCss(data: PaletteData, sections: readonly PacketSection[]): string {
  const blocks = sections.map((section) => {
    let lines: string[];
    switch (section) {
      case 'swatches': lines = data.swatches.map((s, index) => `  --swatch-${id(index)}: ${s.hex}; /* ${cssComment(s.id)} rgb(${s.rgb.r}, ${s.rgb.g}, ${s.rgb.b}) */`); break;
      case 'tokens': lines = data.tokens.map((t) => `  ${t.name}: ${t.value}; /* ${cssComment(t.swatchId)} */`); break;
      case 'contrast': lines = data.contrast.flatMap((c, index) => [
        `  --contrast-${id(index)}-background: ${c.hex};`, `  --contrast-${id(index)}-text: ${c.recommendedText};`,
        `  --contrast-${id(index)}-ratio: ${c.contrastRatio};`, `  --contrast-${id(index)}-black: ${c.againstBlack};`,
        `  --contrast-${id(index)}-white: ${c.againstWhite};`,
        `  /* ${cssComment(c.swatchId)}: normal-text AA ${c.normalTextAA ? 'pass' : 'fail'}, AAA ${c.normalTextAAA ? 'pass' : 'fail'}; opaque sRGB */`,
      ]); break;
      case 'metadata': lines = [
        `  --palette-color-count: ${data.metadata.colorCount};`, `  --palette-unique-color-count: ${data.metadata.uniqueColorCount};`,
        ...data.metadata.colors.map((hex, index) => `  --palette-order-${id(index)}: ${hex};`),
        ...Object.entries(data.metadata).filter(([key]) => !['colorCount', 'uniqueColorCount', 'colors'].includes(key)).map(([key, value]) => `  /* ${cssComment(key)}: ${cssComment(Array.isArray(value) ? value.join(', ') : value)} */`),
      ]; break;
    }
    return `  /* section:${section} */\n${lines.join('\n')}`;
  });
  return `/* Palette Packet: standalone CSS custom properties. */\n:root {\n${blocks.join('\n\n')}\n}\n`;
}

function renderCsv(data: PaletteData, sections: readonly PacketSection[]): string {
  const rows: unknown[][] = [['section', 'record', 'field', 'type', 'value']];
  const append = (section: PacketSection, record: number, key: string, value: unknown) => {
    rows.push([section, record, key, Array.isArray(value) ? 'array' : typeof value, Array.isArray(value) ? JSON.stringify(value) : value]);
  };
  for (const section of sections) {
    if (section === 'metadata') {
      for (const [key, value] of Object.entries(data.metadata)) append(section, 1, key, value);
    } else {
      data[section].forEach((record, index) => {
        for (const [key, value] of Object.entries(record)) {
          if (key === 'rgb' && value && typeof value === 'object') {
            for (const [channel, number] of Object.entries(value)) append(section, index + 1, `rgb.${channel}`, number);
          } else append(section, index + 1, key, value);
        }
      });
    }
  }
  return rows.map((row) => row.map(csvCell).join(',')).join('\r\n') + '\r\n';
}

function renderSvg(data: PaletteData, sections: readonly PacketSection[]): string {
  let y = 80;
  const groups = sections.map((section) => {
    const heading = `<text x="24" y="${y}" font-size="22" font-weight="700">${escapeMarkup(sectionOptions.find((option) => option.value === section)!.label)}</text>`;
    y += 32;
    let lines: string[];
    switch (section) {
      case 'swatches': lines = data.swatches.map((s) => { const row = `<rect x="24" y="${y - 18}" width="54" height="22" fill="${escapeMarkup(s.hex)}" stroke="#777777"/><text x="92" y="${y}">${escapeMarkup(s.id)}: ${escapeMarkup(s.hex)} · rgb(${s.rgb.r}, ${s.rgb.g}, ${s.rgb.b})</text>`; y += 30; return row; }); break;
      case 'tokens': lines = data.tokens.map((t) => { const row = `<text x="24" y="${y}">${escapeMarkup(t.name)}: ${escapeMarkup(t.value)};</text>`; y += 28; return row; }); break;
      case 'contrast': lines = data.contrast.map((c) => { const row = `<text x="24" y="${y}">${escapeMarkup(c.hex)} · black ${c.againstBlack}:1 · white ${c.againstWhite}:1 · text ${escapeMarkup(c.recommendedText)} · AA ${c.normalTextAA ? 'pass' : 'fail'} / AAA ${c.normalTextAAA ? 'pass' : 'fail'}</text>`; y += 28; return row; });
        lines.push(`<text x="24" y="${y}">Opaque sRGB; normal-text thresholds. Not a complete accessibility audit.</text>`); y += 28; break;
      case 'metadata': lines = Object.entries(data.metadata).flatMap(([key, value]) => {
        const values = Array.isArray(value) && key === 'colors' ? value.map((color, index) => `${key}[${index + 1}]: ${color}`) : [`${key}: ${Array.isArray(value) ? value.join(', ') : value}`];
        return values.map((line) => { const row = `<text x="24" y="${y}">${escapeMarkup(line)}</text>`; y += 26; return row; });
      }); break;
    }
    y += 24;
    return `<g data-section="${section}">${heading}${lines.join('')}</g>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="1040" height="${y}" viewBox="0 0 1040 ${y}" role="img" aria-labelledby="title description"><title id="title">Palette Packet</title><desc id="description">Selected palette sections: ${escapeMarkup(sections.join(', '))}</desc><rect width="1040" height="${y}" fill="#FFFFFF"/><g fill="#172027" font-family="system-ui,sans-serif" font-size="14"><text x="24" y="38" font-size="28" font-weight="700">Palette Packet</text>${groups.join('')}</g></svg>\n`;
}

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/** ZIP APPNOTE stored entries, UTF-8 flag, fixed 1980-01-01 DOS date, no extras. */
function zip(files: readonly PacketFile[]): Uint8Array {
  const local: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;
  for (const file of files) {
    const name = encoder.encode(file.name);
    const crc = crc32(file.bytes);
    const header = new Uint8Array(30 + name.length);
    const h = new DataView(header.buffer);
    h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true);
    h.setUint16(8, 0, true); h.setUint16(10, 0, true); h.setUint16(12, 33, true);
    h.setUint32(14, crc, true); h.setUint32(18, file.bytes.length, true); h.setUint32(22, file.bytes.length, true);
    h.setUint16(26, name.length, true); h.setUint16(28, 0, true); header.set(name, 30);
    local.push(header, file.bytes);
    const record = new Uint8Array(46 + name.length);
    const c = new DataView(record.buffer);
    c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true);
    c.setUint16(8, 0x0800, true); c.setUint16(10, 0, true); c.setUint16(12, 0, true); c.setUint16(14, 33, true);
    c.setUint32(16, crc, true); c.setUint32(20, file.bytes.length, true); c.setUint32(24, file.bytes.length, true);
    c.setUint16(28, name.length, true); c.setUint32(42, offset, true); record.set(name, 46);
    central.push(record); offset += header.length + file.bytes.length;
  }
  const centralSize = central.reduce((sum, record) => sum + record.length, 0);
  const end = new Uint8Array(22);
  const e = new DataView(end.buffer);
  e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true);
  e.setUint32(12, centralSize, true); e.setUint32(16, offset, true);
  const output = new Uint8Array(offset + centralSize + end.length);
  let cursor = 0;
  for (const chunk of [...local, ...central, end]) { output.set(chunk, cursor); cursor += chunk.length; }
  return output;
}

/** Every nonempty selection is supported. Sections and formats retain requested order. */
export function buildPalettePacket(colors: readonly string[], settings: PacketSettings): PalettePacket {
  const canonicalColors = canonicalizePaletteColors(colors);
  const validated = validateSettings(settings);
  const data = paletteData(canonicalColors, validated);
  const files = Object.freeze(validated.formats.map((format): PacketFile => {
    let text: string;
    let mime: string;
    switch (format) {
      case 'html': text = renderHtml(data, validated.sections); mime = 'text/html;charset=utf-8'; break;
      case 'json': text = JSON.stringify(Object.fromEntries(validated.sections.map((section) => [section, data[section]])), null, 2) + '\n'; mime = 'application/json'; break;
      case 'css': text = renderCss(data, validated.sections); mime = 'text/css;charset=utf-8'; break;
      case 'csv': text = renderCsv(data, validated.sections); mime = 'text/csv;charset=utf-8'; break;
      case 'svg': text = renderSvg(data, validated.sections); mime = 'image/svg+xml'; break;
    }
    return Object.freeze({ name: `palette.${format}`, mime, text, bytes: encoder.encode(text) });
  }));
  return Object.freeze({ ...validated, colors: canonicalColors, files, bytes: zip(files),
    filename: `palette-packet-${validated.sections.join('-')}-${validated.formats.join('-')}.zip` });
}
