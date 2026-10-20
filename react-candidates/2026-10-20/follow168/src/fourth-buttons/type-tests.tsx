import * as React from 'react';
import { Button25, Button26, Button27, Button28, Button29, Button30, Button31, Button32, Button33, Button34, Button35, Button36 } from './index';
const button = React.createRef<HTMLButtonElement>();
const all = <><Button25 ref={button} resetKey={1} loadingLabel="等待" /><Button26 pressed onPressedChange={(value, event) => { const typed: boolean = value; event.currentTarget.focus(); void typed; }} /><Button27 defaultPressed /><Button28 title="创建条目" tooltip="说明" /><Button29 readOnly /><Button30 /><Button31 type="submit" name="action" value="go" /><Button32 ref={button} /><Button33 count="99+" /><Button34 text="文本" onCopy={value => value.toUpperCase()} onCopyError={error => { void error; }} /><Button35 /><Button36 count={4} /></>;
// @ts-expect-error native button ref, never a wrapper div
const wrongRef = <Button28 ref={React.createRef<HTMLDivElement>()} />;
// @ts-expect-error async state is not externally simulated with a generic action API
const wrongAction = <Button25 action={() => Promise.resolve()} />;
// @ts-expect-error copied text is string, never an object to serialize silently
const wrongText = <Button34 text={{ secret: true }} />;
// @ts-expect-error controlled value is boolean
const wrongPressed = <Button26 pressed="yes" />;
void [all, wrongRef, wrongAction, wrongText, wrongPressed];
