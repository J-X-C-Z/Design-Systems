export const defaultColors: readonly string[] = Object.freeze(['#FFF9F0', '#A47864', '#E9D5C5', '#45352D', '#BDA28E']);
export function paletteOptions(colors: readonly string[]) {
  if (!Array.isArray(colors)) throw new TypeError('colors must be a dense array of six-digit hex colors.');
  const options: {readonly value: string; readonly label: string}[] = [];
  for (let index = 0; index < colors.length; index++) {
    const descriptor = Object.getOwnPropertyDescriptor(colors, index);
    if (!descriptor || !('value' in descriptor) || typeof descriptor.value !== 'string' || !/^#[0-9a-f]{6}$/i.test(descriptor.value)) {
      throw new TypeError('colors must be a dense array of six-digit hex colors.');
    }
    options.push(Object.freeze({value: 'swatch-' + (index + 1), label: 'Swatch ' + (index + 1) + ' · ' + descriptor.value.toUpperCase()}));
  }
  return Object.freeze(options);
}
/** CSS export from known options only; arbitrary selection strings are never interpolated. */
export function preparePaletteCss(colors: readonly string[], selected: readonly string[]): string {
  const options = paletteOptions(colors), wanted = new Set(selected);
  return ':root {\n' + options.filter(option => wanted.has(option.value)).map(option => `  --palette-${option.value}: ${option.label.slice(-7)};`).join('\n') + '\n}\n';
}
