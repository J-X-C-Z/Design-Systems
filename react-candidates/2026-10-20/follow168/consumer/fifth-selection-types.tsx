import * as React from 'react';
import {Checkbox13,Checkbox14,Switch13,Switch14,SevenThemeProvider,Button25,Button34} from '@follow-ui/react-seven';
const ref=React.createRef<HTMLInputElement>();
const good=<SevenThemeProvider theme="follow"><Checkbox13 items={{'auto-start':{checked:false,ref,name:'a',onCheckedChange:(v,d)=>d.cancel()},'auto-update':{defaultChecked:true,form:'f'}}}/><Checkbox14 items={{'visual-branding':{indeterminate:true,label:'艺术',description:'描述'}}}/><Switch13 ref={ref} checked={true} onCheckedChange={(v,d)=>d.cancel()}/><Switch14 defaultChecked={false}/><Button25>保留旧API</Button25><Button34 text="local">复制</Button34></SevenThemeProvider>;
// @ts-expect-error group children prohibited
const bad1=<Checkbox13>ignored</Checkbox13>;
// @ts-expect-error group children prohibited
const bad2=<Checkbox14>ignored</Checkbox14>;
// @ts-expect-error exclusive ownership
const bad3=<Checkbox13 items={{'auto-start':{checked:true,defaultChecked:false}}}/>;
// @ts-expect-error mixed ownership
const bad4=<Checkbox14 items={{'visual-branding':{indeterminate:true,defaultIndeterminate:false}}}/>;
// @ts-expect-error invalid key
const bad5=<Checkbox13 items={{startup:{checked:true}}}/>;
// @ts-expect-error switch mixed prohibited
const bad6=<Switch13 indeterminate/>;
// @ts-expect-error onChange not callback API
const bad7=<Switch14 onChange={()=>{}}/>;
// @ts-expect-error wrong ref
const bad8=<Switch14 ref={React.createRef<HTMLDivElement>()}/>;
void [good,bad1,bad2,bad3,bad4,bad5,bad6,bad7,bad8];

// @ts-expect-error switch exclusive ownership must survive mixed omission
const bad9=<Switch13 checked={true} defaultChecked={false}/>;
void bad9;
