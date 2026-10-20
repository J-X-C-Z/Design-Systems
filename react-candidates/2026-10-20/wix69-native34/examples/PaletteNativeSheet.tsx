import * as React from 'react';
import { Select34 } from '@studio/wix-native-multiple';
import '@studio/wix-native-multiple/styles.css';
import { defaultColors, paletteOptions, preparePaletteCss } from './palette-css.js';
import './palette-native-sheet.css';
export interface PaletteNativeSheetProps { readonly colors?: readonly string[] }
/** Custom palette example; the no-props Select34 dietary specimen is unchanged. */
export function PaletteNativeSheet({colors = defaultColors}: PaletteNativeSheetProps) {
  const options = paletteOptions(colors);
  // Normalize from the validated render snapshot, not a mutable caller array.
  const palette = options.map(option => option.label.slice(-7));
  const paletteKey = palette.join('|');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [prepared, setPrepared] = React.useState<{paletteKey: string; css: string | null}>(() => ({paletteKey, css: null}));
  // Adjust dependent state before commit. A content change must clear an
  // export permanently, including when an earlier palette is later restored.
  // Normalized content, not array identity, detects in-place edits + rerender.
  if (prepared.paletteKey !== paletteKey) setPrepared({paletteKey, css: null});
  const active = options.filter(option => selected.includes(option.value));
  return <form className="wix-native-palette-example" aria-label="Native palette export" onSubmit={event => {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) return;
    const values = new FormData(event.currentTarget).getAll('swatches').map(String);
    setPrepared({paletteKey, css: preparePaletteCss(palette, values)});
  }} onReset={() => {setSelected([]); setPrepared({paletteKey, css: null});}}>
    <h3>Custom palette export example</h3>
    <Select34 name="swatches" required options={options} label="Choose palette swatches" helper="Hold Cmd/Ctrl to choose swatches. Shift uses your browser’s native range selection."
      value={selected} onChange={event => {setSelected(Array.from(event.currentTarget.selectedOptions, option => option.value)); setPrepared({paletteKey, css: null});}} />
    <ul aria-label="Selected swatch preview">{active.map(option => <li key={option.value}>
      <span aria-hidden="true" style={{backgroundColor:option.label.slice(-7)}} />{option.label}
    </li>)}</ul>
    <p aria-live="polite">{active.length} swatches in the preview</p>
    <button type="submit">Prepare CSS export</button>{' '}<button type="reset">Clear selection</button>
    <label>Prepared CSS<textarea readOnly rows={7} value={prepared.paletteKey === paletteKey ? prepared.css ?? '' : ''} placeholder="Choose swatches and prepare a local CSS export." /></label>
  </form>;
}
