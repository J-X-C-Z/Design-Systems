import * as React from 'react';
import { Button13, Button15, Button18, Button20, Button21, Button22, Button23, Button24 } from './index';
const button = React.createRef<HTMLButtonElement>();
const group = React.createRef<HTMLDivElement>();
const anchor = React.createRef<HTMLAnchorElement>();
export const valid = <>
  <Button13 ref={button} type="submit" onClick={event => event.currentTarget.disabled} readOnly />
  <Button15 url="https://example.test/" ref={button}>复制网址</Button15>
  <Button18 ref={group} cancelLabel="取消" confirmLabel="确定" cancelProps={{ ref: button, type:'reset' }} confirmProps={{ onClick: event => event.currentTarget.form }} />
  <Button20 ref={anchor} href="#content" onClick={event => event.preventDefault()} />
  <Button21 providerLabels={{ google:'Google 继续' }} providerProps={{ github: { ref:button, disabled:true } }} />
  <Button22 providerLabels={{ facebook:'Facebook 继续' }} onClick={event => event.currentTarget.form} />
  <Button23 count={4} /><Button24 avatarSrc={null} avatarFallback="AB" />
</>;
// @ts-expect-error A group ref is not the individual button ref.
const wrongRef = <Button18 ref={button} />;
// @ts-expect-error Every provider must be a declared identity.
const wrongProvider = <Button21 providerLabels={{ unknown:'Not a provider' }} />;
// @ts-expect-error Icon accessible label is a string, not an arbitrary element.
const wrongLabel = <Button22 providerLabels={{ google:<strong>Google</strong> }} />;
// @ts-expect-error Groups use explicit per-member labels, never ambiguous children.
const wrongChildren = <Button18>Ambiguous shared label</Button18>;
// @ts-expect-error Anchor keeps an anchor ref, never a button ref.
const wrongAnchorRef = <Button20 ref={button} />;
void [wrongRef, wrongProvider, wrongLabel, wrongChildren, wrongAnchorRef];
