import * as React from 'react';
import { Checkbox09, Checkbox10, Checkbox11, Checkbox12, Switch09, Switch10, Switch11, Switch12, CHECKBOX09_SLOTS, SWITCH12_SLOTS } from '@follow-ui/react-seven';
const input = React.createRef<HTMLInputElement>(), group = React.createRef<HTMLDivElement>(), fieldset = React.createRef<HTMLFieldSetElement>();
const onChange: React.ChangeEventHandler<HTMLInputElement> = e => { e.currentTarget.checked; };
const cases = <>
  <Checkbox09 ref={group} planningRef={input} planning={{ checked: true, onCheckedChange: (next, e) => { const n: boolean = next; e.currentTarget.form; void n; } }} design={null} operations={{ form: 'other' }} onChange={onChange} />
  <Checkbox10 destructive={{ label: '危险', onChange }} infoRef={input} success={{ defaultChecked: false }} />
  <Checkbox11 triangleRef={input} diamond={{ label: null }} hexagon={{ ownerRevision: -0 }} />
  <Checkbox12 destructiveRef={input} info={{ 'aria-label': '信息' }} success={{ readOnly: true }} />
  <Switch09 ref={input} name="choice" value="yes" checked={false} />
  <Switch10 ref={input} onClick={e => e.preventDefault()} />
  <Switch11 ref={input} label="同步" help="说明" onChange={onChange} />
  <Switch12 ref={fieldset} privacyRef={input} notifications={{ name: 'notifications' }} darkTheme={{ checked: true }} onFocus={e => { const f: HTMLFieldSetElement = e.currentTarget; void f; }} />
</>;
// @ts-expect-error Group does not accept a fictitious aggregate checked value.
const badAggregate = <Checkbox09 checked={true} />;
// @ts-expect-error Switch12 root is a fieldset, not an input.
const badRef = <Switch12 ref={input} />;
// @ts-expect-error Scalar switch does not expose group description; use help.
const badDescription = <Switch11 description="Use help" />;
// @ts-expect-error Member checked is boolean, not an array of labels.
const badMember = <Checkbox11 triangle={{ checked: ['triangle'] }} />;
const keys: 'planning' | 'design' | 'operations' = CHECKBOX09_SLOTS[0].key;
const setting: 'privacy' | 'notifications' | 'darkTheme' = SWITCH12_SLOTS[0].key;
void [cases, badAggregate, badRef, badDescription, badMember, keys, setting];
