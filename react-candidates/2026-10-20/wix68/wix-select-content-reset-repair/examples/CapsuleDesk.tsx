import * as React from 'react';
import { flushSync } from 'react-dom';
import { Select26, Select27, Select28, Select29 } from '@studio/wix-select-content';
import type { SelectItem } from '@studio/wix-select-content';
import '@studio/wix-select-content/styles.css';
import { buildPaletteCapsule, capsuleFromForm, capsuleDefaults, isCapsuleLayout, isCapsuleDiscipline, isCapsuleDialect, isCapsuleStage } from './palette-capsule.js';
import type { CapsuleSettings } from './palette-capsule.js';
const layouts: readonly SelectItem[] = [{ label: 'Color cards', options: [{ value: 'grid', label: 'Compact card grid' }, { value: 'list', label: 'Spacious color list' }] }, { label: 'Reference formats', options: [{ value: 'table', label: 'Token reference table' }, { value: 'contrast', label: 'Contrast reference ledger' }] }];
const dialects = [{ value: 'css', label: 'CSS custom properties' }, { value: 'js', label: 'JavaScript object' }, { value: 'json', label: 'JSON tokens' }, { value: 'csv', label: 'CSV rows' }] as const;
const sample = ['#A47864', '#D9BBA2', '#F4EDE3', '#6D5548', '#30231E'] as const;
/** Prevent browser navigation while preserving later consumer submit cancellation. */
function scheduleSubmit(event: React.FormEvent<HTMLFormElement>, run: () => void) {
  if (event.defaultPrevented || event.nativeEvent.defaultPrevented) return;
  const native = event.nativeEvent, original = native.preventDefault, own = Object.getOwnPropertyDescriptor(native, 'preventDefault');
  let canceled = false;
  const wrapped = function(this: Event) { canceled = true; original.call(this); };
  try { Object.defineProperty(native, 'preventDefault', { configurable: true, writable: true, value: wrapped }); }
  catch { event.preventDefault(); return; } // No export if late cancellation cannot be observed.
  original.call(native);
  queueMicrotask(() => {
    try { if (!canceled) run(); }
    finally { if (native.preventDefault === wrapped) { if (own) Object.defineProperty(native, 'preventDefault', own); else Reflect.deleteProperty(native, 'preventDefault'); } }
  });
}
export function CapsuleDesk({ colors = sample, motion = 'system' }: { colors?: readonly string[]; motion?: 'system' | 'on' | 'off' }) {
  const [settings, setSettings] = React.useState<CapsuleSettings>(capsuleDefaults), [message, setMessage] = React.useState('');
  const live = React.useRef(true), epoch = React.useRef(0), download = React.useRef<{ url: string; owner: typeof URL } | null>(null);
  const currentColors = React.useRef(colors); currentColors.current = colors;
  const eventSequence = React.useRef(0), resets = React.useRef<{ sequence: number; event: Event }[]>([]);
  React.useEffect(() => { live.current = true; return () => { live.current = false; epoch.current++; if (download.current) download.current.owner.revokeObjectURL(download.current.url); download.current = null; }; }, []);
  const preview = React.useMemo(() => { try { return { artifact: buildPaletteCapsule(settings, colors), error: '' }; } catch (error) { return { artifact: null, error: error instanceof Error ? error.message : 'The palette is invalid.' }; } }, [settings, colors]);
  const update = <K extends keyof CapsuleSettings>(key: K, value: CapsuleSettings[K]) => { epoch.current++; setSettings(previous => ({ ...previous, [key]: value })); setMessage(''); };
  return <section className="wix-capsule-example" aria-label="Local palette capsule">
    <p>Prepare a self-contained palette handoff. Category and lifecycle labels describe this local document only.</p>
    <form onSubmit={event => {
      const form = event.currentTarget, ticket = epoch.current, intent = ++eventSequence.current;
      scheduleSubmit(event, () => {
        if (!live.current || !form.isConnected || ticket !== epoch.current || resets.current.some(reset => reset.sequence > intent && !reset.event.defaultPrevented) || !form.checkValidity()) return;
        try {
          const doc = form.ownerDocument, view = doc.defaultView;
          if (!view) throw new Error('The local document is unavailable.');
          const file = capsuleFromForm(new view.FormData(form), currentColors.current), blob = new view.Blob([file.html], { type: file.mime });
          const url = view.URL.createObjectURL(blob);
          if (download.current) download.current.owner.revokeObjectURL(download.current.url);
          download.current = { url, owner: view.URL };
          const anchor = doc.createElement('a'); anchor.href = url; anchor.download = file.filename; doc.body.append(anchor);
          try { anchor.click(); } finally { anchor.remove(); }
          setMessage(`Prepared ${file.filename}`);
        } catch (error) { setMessage(error instanceof Error ? error.message : 'The local capsule could not be generated.'); }
      });
    }} onReset={event => {
      const native = event.nativeEvent, form = event.currentTarget;
      const reset = { sequence: ++eventSequence.current, event: native }; resets.current.push(reset);
      queueMicrotask(() => {
        if (!native.defaultPrevented && live.current && form.isConnected) flushSync(() => { setSettings(capsuleDefaults); setMessage(''); });
        // Keep this completed event until older queued submit work has observed
        // its final cancellation state; later submit intents remain eligible.
        queueMicrotask(() => { resets.current = resets.current.filter(item => item !== reset); });
      });
    }}>
      <Select26 motion={motion} name="layout" label="Capsule layout" options={layouts} value={settings.layout} onValueChange={value => { if (isCapsuleLayout(value)) update('layout', value); }} />
      <Select27 motion={motion} name="discipline" value={settings.discipline} onValueChange={value => { if (isCapsuleDiscipline(value)) update('discipline', value); }} />
      <Select28 motion={motion} name="dialect" label="Token format" prefix="Token dialect:" options={dialects} value={settings.dialect} onValueChange={value => { if (isCapsuleDialect(value)) update('dialect', value); }} />
      <Select29 motion={motion} name="stage" value={settings.stage} onValueChange={value => { if (isCapsuleStage(value)) update('stage', value); }} />
      <button type="submit" disabled={!preview.artifact}>Download local HTML capsule</button><button type="reset">Reset capsule</button>
    </form>
    <p role="status" aria-live="polite">{message || preview.error || preview.artifact?.filename}</p>
    {preview.artifact ? <><iframe title="Inert palette capsule preview" sandbox="" srcDoc={preview.artifact.html} style={{ display: 'block', width: '100%', minHeight: 560, border: '1px solid #9b7866', background: '#fffaf4' }} /><details><summary>Exact HTML source</summary><pre aria-label="Exact inert capsule HTML"><code>{preview.artifact.html}</code></pre></details></> : null}
  </section>;
}
