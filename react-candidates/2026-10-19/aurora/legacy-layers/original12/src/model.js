/** Local-only optical model. Rendering controls are illustrative, not measurements. */
import presets from './assets/presets.json';
export const NS = 'mg-12-aurora-glass';
export const STORAGE_KEY = NS + ':v1';
export const clamp = (x, a, b) => Math.min(b, Math.max(a, Number.isFinite(+x) ? +x : a));
export const initial = { preset: 'violet', ior: 1.46, frost: 18, dispersion: 36, energy: 68, x: 55, y: 47, note: '', name: '一束紫潮', motion: true, opaque: false, quality: 'balanced', favoriteOnly: false };
export function sanitizeDraft(value = {}) {
  if(!value || typeof value !== 'object') value = {};
  return { ...initial,
    preset: ['violet', 'cyan', 'blue'].includes(value.preset) ? value.preset : initial.preset,
    ior: clamp(value.ior ?? initial.ior, 1.02, 1.85), frost: clamp(value.frost ?? initial.frost, 0, 80),
    dispersion: clamp(value.dispersion ?? initial.dispersion, 0, 100), energy: Math.round(clamp(value.energy ?? initial.energy, 0, 100)),
    x: clamp(value.x ?? initial.x, 22, 78), y: clamp(value.y ?? initial.y, 28, 72),
    name: typeof value.name === 'string' ? value.name.slice(0, 40) : initial.name,
    note: typeof value.note === 'string' ? value.note.slice(0, 600) : '',
    motion: typeof value.motion === 'boolean' ? value.motion : true,
    opaque: value.opaque === true, favoriteOnly: value.favoriteOnly === true,
    quality: ['balanced','economy'].includes(value.quality) ? value.quality : 'balanced'
  };
}
export function readLocal(storage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { draft: { ...initial }, samples: [], error: '' };
    const data = JSON.parse(raw);
    if (data.version !== 1 || !Array.isArray(data.samples)) throw new Error('version');
    const samples = data.samples.slice(0, 40).filter(x => x && typeof x.id === 'string').map(x => ({ id: x.id.slice(0, 80), draft: sanitizeDraft(x.draft), favorite: x.favorite === true }));
    return { draft: sanitizeDraft(data.draft), samples, error: '' };
  } catch (_) { return { draft: { ...initial }, samples: [], error: '本地记录无法读取，已启用临时会话；不会覆盖原记录。' }; }
}
export function saveLocal(storage, draft, samples) {
  storage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, draft: sanitizeDraft(draft), samples: samples.slice(0, 40) }));
}
export function tokensFor(d) {
  const [a,b,c] = (presets.find(x=>x.id===d.preset) || presets[0]).palette;
  return { '--mg-12-aurora-glass-light-a': a, '--mg-12-aurora-glass-light-b': b, '--mg-12-aurora-glass-light-c': c,
    '--mg-12-aurora-glass-frost': `${Math.round(d.frost * .35 + 8)}px`, '--mg-12-aurora-glass-ior': d.ior.toFixed(2), '--mg-12-aurora-glass-energy': String(.6+d.energy*.004), '--mg-12-aurora-glass-dispersion': `${d.dispersion*.055}px` };
}
export function cssExport(d) {
  return `.mg-12-aurora-glass {\n${Object.entries(tokensFor(d)).map(([k,v]) => `  ${k}: ${v};`).join('\n')}\n}\n`;
}
export function downloadText(name, text, mime) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a'); link.href = url; link.download = name;
  document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1500);
}
export function knobFromPoint(x, y, cx, cy, min = 0, max = 100) {
  let angle = Math.atan2(y-cy, x-cx) * 180 / Math.PI + 90;
  if (angle < 0) angle += 360;
  return Math.round(Math.round(angle / 5) * 5 / 360 * (max - min) + min);
}
