import * as React from 'react';
import { Checkbox02, Checkbox03, Checkbox04, Switch02, Switch03, Switch04, Textarea02, SWITCH03_SLOTS } from './index.jsx';

/** Genuine React form; state previews are local to the fixture, never logged or stored. */
export function NextSelectionExamples() {
  const [pair, setPair] = React.useState({ checked: false, indeterminate: true });
  const [controlled, setControlled] = React.useState(true);
  const [scalars, setScalars] = React.useState({ subscription: false, weekly: true, square: false, gradient: false });
  const scalar = key => ({ checked: controlled ? scalars[key] : undefined, onCheckedChange: value => { if (accept) setScalars(current => ({ ...current, [key]: value })); } });
  const [accept, setAccept] = React.useState(true), [disabled, setDisabled] = React.useState(false), [readOnly, setReadOnly] = React.useState(false);
  const [values, setValues] = React.useState({ destructive: true, success: true, info: true, warning: true });
  const [note, setNote] = React.useState('');
  const slots = Object.fromEntries(SWITCH03_SLOTS.map(({ key }) => [key, {
    checked: controlled ? values[key] : undefined, name: `tone-${key}`, value: key,
    onCheckedChange: checked => { if (accept) setValues(current => ({ ...current, [key]: checked })); }
  }]));
  return <section aria-label="第二批选择字段交互示例">
    <fieldset><legend>夹具控制</legend>
      <label><input type="checkbox" checked={controlled} onChange={e => setControlled(e.target.checked)} />父级受控（关闭后为非受控，接受开关不再阻止编辑）</label>
      <label><input type="checkbox" checked={accept} onChange={e => setAccept(e.target.checked)} />父级接受提案</label>
      <label><input type="checkbox" checked={disabled} onChange={e => setDisabled(e.target.checked)} />禁用</label>
      <label><input type="checkbox" checked={readOnly} onChange={e => setReadOnly(e.target.checked)} />只读</label>
    </fieldset>
    <form onSubmit={event => event.preventDefault()}>
      <Checkbox02 name="beta" value={controlled ? pair : undefined} onValueChange={value => { if (accept) setPair(value); }} disabled={disabled} readOnly={readOnly} />
      <Checkbox03 {...scalar("subscription")} name="updates" disabled={disabled} readOnly={readOnly} />
      <Checkbox04 {...scalar("weekly")} name="weekly" disabled={disabled} readOnly={readOnly} />
      <Switch02 {...scalar("square")} name="square" disabled={disabled} readOnly={readOnly} />
      <Switch03 {...slots} disabled={disabled} readOnly={readOnly} aria-label="四个独立语义色开关" />
      <Switch04 {...scalar("gradient")} name="gradient" disabled={disabled} readOnly={readOnly} />
      <Textarea02 name="thoughts" value={controlled ? note : undefined} onValueChange={value => { if (accept) setNote(value); }} disabled={disabled} readOnly={readOnly}
        help="可尝试长文、中文输入法与原生重置；受控字段继续使用父级值。" />
      <button type="reset">HTML 重置</button>
      <button type="button" onClick={() => setNote("长文与换行测试。\n".repeat(80))}>父级加载长文（受控模式）</button>
      <button type="button" onClick={() => { setPair({ checked: false, indeterminate: true }); setValues({ destructive: true, success: true, info: true, warning: true }); setNote(''); setScalars({ subscription: false, weekly: true, square: false, gradient: false }); }}>父级恢复默认</button>
    </form>
  </section>;
}
