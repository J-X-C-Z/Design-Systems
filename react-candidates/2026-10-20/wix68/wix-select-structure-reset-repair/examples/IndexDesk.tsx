import * as React from 'react';
import { Select22, Select23, Select24, Select25 } from '@studio/wix-select-structure';
import type { SelectItem } from '@studio/wix-select-structure';
import '@studio/wix-select-structure/styles.css';
import { buildIndexSheet, indexSheetFromForm, isIndexColumns, isIndexLabels, isIndexHeading, isIndexDensity } from './index-sheet.js';
import type { IndexColumns, IndexLabels, IndexHeading, IndexDensity } from './index-sheet.js';
const columnOptions: readonly SelectItem[] = [{ label: 'Reading layouts', options: [{ value: '1', label: 'One full-width column' }, { value: '2', label: 'Two balanced columns' }, { value: '3', label: 'Three-column index' }] }, { label: 'Compact layouts', options: [{ value: '4', label: 'Four-column overview' }, { value: '5', label: 'Five-column overview' }] }];
const labelOptions: readonly SelectItem[] = [{ label: 'Color codes', options: [{ value: 'hex', label: 'Hexadecimal labels' }, { value: 'rgb', label: 'RGB channel labels' }] }, { separator: true }, { label: 'Index labels', options: [{ value: 'hsl', label: 'HSL color labels' }, { value: 'ordinal', label: 'Numbered swatches' }] }];
const headingOptions = [{ value: 'studio', label: 'Studio color index' }, { value: 'archive', label: 'Archive color index' }, { value: 'proof', label: 'Print proof index' }, { value: 'handoff', label: 'Design handoff index' }] as const;
const densityOptions = [{ value: 'airy', label: 'Airy presentation' }, { value: 'comfortable', label: 'Comfortable reference' }, { value: 'compact', label: 'Compact reference' }, { value: 'micro', label: 'Micro overview' }] as const;
const sampleColors = ['#A47864', '#D9BBA2', '#F4EDE3', '#6D5548', '#30231E'] as const;
interface Settings { columns: IndexColumns; labels: IndexLabels; heading: IndexHeading | ''; density: IndexDensity }
const initial: Settings = { columns: '3', labels: 'hex', heading: '', density: 'comfortable' };
export function IndexDesk({ colors = sampleColors }: { colors?: readonly string[] }) {
  const [settings, setSettings] = React.useState<Settings>(initial), [message, setMessage] = React.useState('');
  const download = React.useRef<{ url: string; owner: typeof URL } | null>(null);
  React.useEffect(() => () => { if (download.current) download.current.owner.revokeObjectURL(download.current.url); download.current = null; }, []);
  const artifact = React.useMemo(() => { if (!settings.heading) return null; try { return buildIndexSheet({ ...settings, heading: settings.heading }, colors); } catch { return null; } }, [settings, colors]);
  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => { setSettings(previous => ({ ...previous, [key]: value })); setMessage(''); };
  return <section className="wix-index-example" aria-label="Local color index sheet">
    <form onSubmit={event => { event.preventDefault(); const form = event.currentTarget; if (!form.checkValidity()) return; try { const file = indexSheetFromForm(new FormData(form), colors), doc = form.ownerDocument, view = doc.defaultView; if (!view) throw Error('The local document is unavailable.'); const blob = new view.Blob([file.html], { type: file.mime }); if (download.current) download.current.owner.revokeObjectURL(download.current.url); const url = view.URL.createObjectURL(blob); download.current = { url, owner: view.URL }; const anchor = doc.createElement('a'); anchor.href = url; anchor.download = file.filename; doc.body.append(anchor); anchor.click(); anchor.remove(); setMessage(`Prepared ${file.filename}`); } catch (error) { setMessage(error instanceof Error ? error.message : 'The local index could not be generated.'); } }} onReset={() => { setSettings(initial); setMessage(''); }}>
      <Select22 name="columns" label="Index columns" options={columnOptions} value={settings.columns} onValueChange={value => { if (isIndexColumns(value)) update('columns', value); }} />
      <Select23 name="labels" label="Swatch labels" options={labelOptions} value={settings.labels} onValueChange={value => { if (isIndexLabels(value)) update('labels', value); }} />
      <Select24 name="heading" label="Index heading" placeholder="Choose a document heading" options={headingOptions} value={settings.heading} required onValueChange={value => { if (isIndexHeading(value)) update('heading', value); }} />
      <Select25 name="density" label="Index density" options={densityOptions} value={settings.density} onValueChange={value => { if (isIndexDensity(value)) update('density', value); }} />
      <button type="submit">Download local HTML index</button><button type="reset">Reset index</button>
    </form>
    <p role="status" aria-live="polite">{message || (artifact ? artifact.filename : 'Choose a heading to prepare the index.')}</p>
    {artifact ? <><section aria-label="Index preview"><h3>{artifact.title}</h3><ol style={{ display: 'grid', gridTemplateColumns: `repeat(${artifact.settings.columns}, minmax(0, 1fr))`, gap: artifact.gap, listStyle: 'none', padding: 0 }}>{artifact.colors.map((color, index) => <li key={index} style={{ padding: artifact.padding, border: '1px solid #9b7866', minWidth: 0 }}><span role="img" aria-label={`Color ${color}`} style={{ display: 'block', height: artifact.swatchHeight, backgroundColor: color }} /><code style={{ display: 'block', overflowWrap: 'anywhere' }}>{artifact.labels[index]}</code></li>)}</ol></section><pre aria-label="Exact inert HTML source"><code>{artifact.html}</code></pre></> : null}
  </section>;
}
