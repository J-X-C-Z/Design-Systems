import * as React from 'react';
import { flushSync } from 'react-dom';
import { Select32, Select33 } from '@studio/wix-multi-select';
import '@studio/wix-multi-select/styles.css';
import { buildPalettePacket, parsePacketFormData, canonicalizePaletteColors, sectionOptions, formatOptions } from './palette-packet.js';
import type { PacketSettings, PacketSection, PacketFormat } from './palette-packet.js';

const sample = ['#A47864', '#D9BBA2', '#F4EDE3', '#6D5548', '#30231E'] as const;
const defaults: PacketSettings = { sections: ['swatches'], formats: [] };
const isSection = (value: string): value is PacketSection => sectionOptions.some(item => item.value === value);
const isFormat = (value: string): value is PacketFormat => formatOptions.some(item => item.value === value);

/** Cancel browser navigation while still observing later consumer cancellation. */
function scheduleSubmit(event: React.FormEvent<HTMLFormElement>, run: () => void) {
  if (event.defaultPrevented || event.nativeEvent.defaultPrevented) return;
  const native = event.nativeEvent, original = native.preventDefault, own = Object.getOwnPropertyDescriptor(native, 'preventDefault');
  let canceled = false;
  const wrapped = function(this: Event) { canceled = true; original.call(this); };
  try { Object.defineProperty(native, 'preventDefault', { configurable: true, writable: true, value: wrapped }); }
  catch { event.preventDefault(); return; }
  original.call(native);
  queueMicrotask(() => {
    try { if (!canceled) run(); }
    finally { if (native.preventDefault === wrapped) { if (own) Object.defineProperty(native, 'preventDefault', own); else Reflect.deleteProperty(native, 'preventDefault'); } }
  });
}

/** A local archive generator; it never configures services or sends notifications. */
export function PacketDesk({ colors = sample, motion = 'system' }: { colors?: readonly string[]; motion?: 'system' | 'on' | 'off' }) {
  const [settings, setSettings] = React.useState<PacketSettings>(defaults), [message, setMessage] = React.useState('');
  const live = React.useRef(true), epoch = React.useRef(0), download = React.useRef<{ url: string; owner: typeof URL } | null>(null);
  const currentColors = React.useRef(colors); currentColors.current = colors;
  const eventSequence = React.useRef(0), resets = React.useRef<{ sequence: number; event: Event }[]>([]);
  const releaseDownload = () => { if (download.current) download.current.owner.revokeObjectURL(download.current.url); download.current = null; };
  React.useEffect(() => { live.current = true; return () => { live.current = false; epoch.current++; releaseDownload(); }; }, []);
  const palette = React.useMemo(() => { try { return { colors: canonicalizePaletteColors(colors), error: '' }; } catch (error) { return { colors: null, error: error instanceof Error ? error.message : 'The palette is invalid.' }; } }, [colors]);
  const preview = React.useMemo(() => {
    if (!palette.colors) return { artifact: null, error: palette.error };
    if (!settings.sections.length) return { artifact: null, error: 'Choose at least one packet section.' };
    if (!settings.formats.length) return { artifact: null, error: 'Choose at least one output format.' };
    // Native multiple-select FormData is in option DOM order, irrespective of callback insertion order.
    const ordered: PacketSettings = {
      sections: sectionOptions.filter(option => settings.sections.includes(option.value)).map(option => option.value),
      formats: formatOptions.filter(option => settings.formats.includes(option.value)).map(option => option.value),
    };
    try { return { artifact: buildPalettePacket(palette.colors, ordered), error: '' }; }
    catch (error) { return { artifact: null, error: error instanceof Error ? error.message : 'The packet is invalid.' }; }
  }, [settings, palette]);
  const update = <K extends keyof PacketSettings>(key: K, value: PacketSettings[K]) => {
    epoch.current++; setSettings(previous => ({ ...previous, [key]: value })); setMessage('');
  };
  const html = preview.artifact?.files.find(file => file.name.endsWith('.html'));
  return <section className="wix-packet-example" aria-label="Local palette packet">
    <p>Choose several sections and file formats, then create one local ZIP. These controls describe document contents only.</p>
    <form onSubmit={event => {
      const form = event.currentTarget, ticket = epoch.current, intent = ++eventSequence.current;
      scheduleSubmit(event, () => {
        if (!live.current || !form.isConnected || ticket !== epoch.current || resets.current.some(reset => reset.sequence > intent && !reset.event.defaultPrevented) || !form.checkValidity()) return;
        try {
          const doc = form.ownerDocument, view = doc.defaultView;
          if (!view) throw new Error('The local document is unavailable.');
          const file = buildPalettePacket(currentColors.current, parsePacketFormData(new view.FormData(form)));
          const blob = new view.Blob([new Uint8Array(file.bytes).buffer], { type: 'application/zip' });
          const url = view.URL.createObjectURL(blob); releaseDownload(); download.current = { url, owner: view.URL };
          const anchor = doc.createElement('a'); anchor.href = url; anchor.download = file.filename; doc.body.append(anchor);
          try { anchor.click(); } finally { anchor.remove(); }
          setMessage(`Prepared ${file.filename}: ${file.files.length} files, ${file.bytes.length} bytes.`);
        } catch (error) { setMessage(error instanceof Error ? error.message : 'The local packet could not be generated.'); }
      });
    }} onReset={event => {
      const native = event.nativeEvent, form = event.currentTarget;
      const reset = { sequence: ++eventSequence.current, event: native }; resets.current.push(reset);
      queueMicrotask(() => {
        if (!native.defaultPrevented && live.current && form.isConnected) {
          flushSync(() => { setSettings(defaults); setMessage(''); }); releaseDownload();
        }
        queueMicrotask(() => { resets.current = resets.current.filter(item => item !== reset); });
      });
    }}>
      <Select32 motion={motion} name="sections" label="Packet sections" placeholder="Choose packet contents" pluralLabel="sections included" options={sectionOptions} value={settings.sections} onValueChange={values => { if (values.every(isSection)) update('sections', values); }} required clearable showSelectedItems helper="Choose one or more sections. Removing a chip removes only that section." />
      <Select33 motion={motion} name="formats" label="Output formats" placeholder="Choose export formats" pluralLabel="formats selected" options={formatOptions} value={settings.formats} onValueChange={values => { if (values.every(isFormat)) update('formats', values); }} required clearable showSelectedItems helper="Each selected format becomes a real file in one ZIP archive." />
      <button type="submit" disabled={!palette.colors}>Download palette ZIP</button><button type="reset">Reset packet</button>
    </form>
    <p role="status" aria-live="polite">{message || preview.error || (preview.artifact ? `${preview.artifact.files.length} files ready: ${preview.artifact.filename}` : '')}</p>
    {preview.artifact ? <div className="wix-packet-preview">
      <p className="wix-packet-file-count">{preview.artifact.files.length} files · {preview.artifact.bytes.length} ZIP bytes</p>
      {html ? <iframe title="Inert palette packet HTML preview" sandbox="" srcDoc={html.text} style={{ display: 'block', width: '100%', minHeight: 400, border: '1px solid #9b7866', background: '#fffaf4' }} /> : null}
      <ul aria-label="Exact packet files">{preview.artifact.files.map(file => <li key={file.name}><details><summary>{file.name} · {file.bytes.length} bytes</summary><pre aria-label={`Exact ${file.name} source`}><code>{file.text}</code></pre></details></li>)}</ul>
    </div> : null}
  </section>;
}
