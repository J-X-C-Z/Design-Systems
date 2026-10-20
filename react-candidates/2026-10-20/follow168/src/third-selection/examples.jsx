import * as React from 'react';
import { Checkbox05, Checkbox06, Checkbox07, Checkbox08, Switch05, Switch06, Switch07, Switch08 } from './index.jsx';

/** Every composite member has a real owned value; no aggregate checked prop. */
export function ThirdSelectionExamples() {
  const [snacks, setSnacks] = React.useState({ salad: true, wrap: true, juice: false });
  const [roles, setRoles] = React.useState({ design: false, marketing: false, product: false });
  const [accepted, setAccepted] = React.useState(true);
  const [icons, setIcons] = React.useState(true);
  const snack = key => ({ checked: snacks[key], onCheckedChange: checked => setSnacks(old => ({ ...old, [key]: checked })), name: 'snacks', value: key });
  const role = key => ({ checked: roles[key], onCheckedChange: checked => setRoles(old => ({ ...old, [key]: checked })), name: 'roles', value: key });
  return <form className="fr7-third-selection-examples" onSubmit={event => event.preventDefault()}>
    <Checkbox05 standard={{ name: 'size', value: '16' }} medium={{ name: 'size', value: '20' }} large={{ name: 'size', value: '24' }} />
    <Checkbox06 salad={snack('salad')} wrap={snack('wrap')} juice={snack('juice')} description="可分别选择；未选标签会收起勾选占位。" />
    <Checkbox07 checked={accepted} onCheckedChange={setAccepted} name="updates" value="accepted" />
    <Checkbox08 design={role('design')} marketing={role('marketing')} product={role('product')} />
    <Switch05 destructive={{ name: 'tone', value: 'danger' }} success={{ name: 'tone', value: 'success' }} info={{ name: 'tone', value: 'info' }} warning={{ name: 'tone', value: 'warning' }} />
    <Switch06 label="使用紧凑轨道" name="mini" />
    <Switch07 small={{ name: 'switch-size', value: 'small' }} medium={{ name: 'switch-size', value: 'medium' }} large={{ name: 'switch-size', value: 'large' }} />
    <Switch08 checked={icons} onCheckedChange={setIcons} name="indicators" />
    <button type="reset">重置未受控成员</button>
    <button type="button" onClick={() => { setSnacks({salad:false,wrap:false,juice:false}); setRoles({design:false,marketing:false,product:false}); setAccepted(false); setIcons(false); }}>外部父级全部关闭</button>
  </form>;
}

/** Parent refusal and per-member split-form association. */
export function ThirdSelectionOwnershipExample() {
  const id = React.useId();
  const [calls, setCalls] = React.useState(0), [revision, setRevision] = React.useState(0);
  return <>
    <form id={`${id}-main`}><Switch07 ownerRevision={revision}
      small={{ checked: false, onCheckedChange: () => setCalls(n => n + 1), name:'size', value:'small' }}
      medium={{ defaultChecked: true, name:'size', value:'medium' }}
      large={{ defaultChecked: true, form:`${id}-other`, name:'size', value:'large' }} />
      <button type="reset">仅重置本表单成员</button>
    </form>
    <form id={`${id}-other`}><button type="reset">仅重置大号开关</button></form>
    <button type="button" onClick={() => setRevision(n => n + 1)}>断言相同值的父级命令</button>
    <output aria-live="polite">父级拒绝了 {calls} 次小号开关提案</output>
  </>;
}
