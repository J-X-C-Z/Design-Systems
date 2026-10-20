import * as React from 'react';
import {Switch15,Switch16,Switch17,Switch18,Checkbox13,SevenThemeProvider} from '@follow-ui/react-seven';
const ref=React.createRef<HTMLInputElement>();
const good=<SevenThemeProvider theme="follow"><Switch15 ref={ref} name="note" defaultChecked/><Switch16 checked onCheckedChange={(v,d)=>d.cancel()} size="sm"/><Switch17 description="说明" label="标签"/><Switch18 form="f" readOnly/><Checkbox13/></SevenThemeProvider>;
// @ts-expect-error exclusive ownership
const bad1=<Switch15 checked defaultChecked/>;
// @ts-expect-error switch no mixed
const bad2=<Switch16 indeterminate/>;
// @ts-expect-error native callback unsupported
const bad3=<Switch17 onChange={()=>{}}/>;
// @ts-expect-error wrong ref
const bad4=<Switch18 ref={React.createRef<HTMLDivElement>()}/>;
// @ts-expect-error children cannot be consumed
const bad5=<Switch15>child</Switch15>;
// @ts-expect-error invalid size
const bad6=<Switch16 size="large"/>;
// @ts-expect-error caller cannot change native role
const bad7=<Switch17 role="checkbox"/>;
// @ts-expect-error boolean required
const bad8=<Switch18 checked="false"/>;
void [good,bad1,bad2,bad3,bad4,bad5,bad6,bad7,bad8];
