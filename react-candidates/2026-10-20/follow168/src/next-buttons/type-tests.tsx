import * as React from 'react';
import { Button04, Button05, Button06, Button07, Button08, Button09, Button10, Button11, Button12 } from './index';

export function TypedConsumer() {
  const ref = React.useRef<HTMLButtonElement>(null);
  const [count, setCount] = React.useState(0);
  const onClick: React.MouseEventHandler<HTMLButtonElement> = event => {
    event.currentTarget.name.toUpperCase();
    setCount(value => value + 1);
  };
  return <>
    <Button04 ref={ref} name="explore" onClick={onClick} />
    <Button05 disabled aria-label="Unavailable" />
    <Button06 type="submit" form="external-form" name="intent" value="small" />
    <Button07 readOnly title="Owner controlled lock" />
    <Button08 onKeyDown={event => event.currentTarget.focus()} />
    <Button09 disabled aria-busy="true">Working</Button09>
    <Button10 style={{ margin: 4 }} onClick={onClick} />
    <Button11 type="reset" />
    <Button12 onClick={onClick} aria-describedby="help">Favorite</Button12>
    <p id="help">{count} host-owned click events</p>
  </>;
}
// @ts-expect-error The exact disabled source sample cannot be enabled.
const disabledSourceCannotBeEnabled = <Button05 disabled={false} />;
// @ts-expect-error The exact loading source remains busy.
const loadingSourceCannotBeCleared = <Button09 aria-busy={false} />;
void disabledSourceCannotBeEnabled;
void loadingSourceCannotBeCleared;
