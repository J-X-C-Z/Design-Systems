import * as React from 'react';
import { Button01, Button02, Button03, Checkbox01, Switch01, InputMask01, Textarea01 } from './index.jsx';

/* Optional visible author fixture; not an authentication or persistence workflow. */
export function ScalarExamples() {
  const [disabled, setDisabled] = React.useState(false);
  const [readOnly, setReadOnly] = React.useState(false);
  const [controlled, setControlled] = React.useState(false);
  const [accept, setAccept] = React.useState(true);
  const [revision, setRevision] = React.useState(0);
  const [values, setValues] = React.useState({ code: 'AB12 CDE', note: '公开示例文本', check: false, switch: false });
  const [actions, setActions] = React.useState(0);
  const [cancelReset, setCancelReset] = React.useState(false);
  const [mounted, setMounted] = React.useState(true);
  const options = { disabled, readOnly, ownerRevision: revision };
  const change = key => value => { if (accept) setValues(current => ({ ...current, [key]: value })); };
  return <section className="fr7" aria-label="七项 React 控件参数示例">
    <p>仅本地公开样例。不会发送、保存或打印输入内容。真实浏览器输入法、原生撤销和像素仍需实测。</p>
    <fieldset><legend>参数</legend>
      {[['禁用', disabled, setDisabled], ['只读', readOnly, setReadOnly], ['受控', controlled, setControlled], ['接受受控提案', accept, setAccept], ['取消 reset', cancelReset, setCancelReset]].map(([label, checked, setter]) =>
        <label key={label}><input type="checkbox" checked={checked} onChange={event => setter(event.target.checked)} />{label} </label>)}
      <Button01 onClick={() => setRevision(n => n + 1)}>同值 ownerRevision 命令</Button01>
      <Button01 onClick={() => setMounted(v => !v)}>{mounted ? '卸载字段' : '重新挂载字段'}</Button01>
    </fieldset>
    <form onSubmit={event => { event.preventDefault(); setActions(n => n + 1); }} onReset={event => { if (cancelReset) event.preventDefault(); }}>
      {mounted ? <>
        <Button01 disabled={disabled} readOnly={readOnly} onClick={() => setActions(n => n + 1)} />
        <Button02 disabled={disabled} readOnly={readOnly} onClick={() => setActions(n => n + 1)} nextProps={{ onClick: () => setActions(n => n + 1) }} />
        <Button03 disabled={disabled} readOnly={readOnly} onClick={() => setActions(n => n + 1)} saveProps={{ onClick: () => setActions(n => n + 1) }} />
        <Checkbox01 {...options} name="updates" checked={controlled ? values.check : undefined} onCheckedChange={change('check')} help="只读仍参与表单；禁用不参与。" />
        <Switch01 {...options} name="notifications" checked={controlled ? values.switch : undefined} onCheckedChange={change('switch')} />
        <InputMask01 {...options} name="demoCode" value={controlled ? values.code : undefined} defaultValue="AB12 CDE" onValueChange={change('code')} />
        <Textarea01 {...options} name="demoNote" value={controlled ? values.note : undefined} defaultValue="公开示例文本" onValueChange={change('note')} help="384px 是宽度上限；多行输入不拦截 Enter。" />
      </> : <p>字段已卸载。重新挂载重新建立默认值。</p>}
      <Button01 type="reset">HTML reset</Button01><Button01 type="submit">本地提交事件</Button01>
    </form>
    <p role="status">本地动作次数：{actions}。ownerRevision：{revision}。</p>
  </section>;
}
