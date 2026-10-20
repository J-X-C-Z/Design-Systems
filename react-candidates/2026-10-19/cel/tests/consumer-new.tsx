import * as React from 'react';import {Checkbox06,Switch06,CelSelectionScope} from '../src/index.js';
const ref=React.createRef<HTMLInputElement>();<CelSelectionScope><Checkbox06 items={{Salad:{ref,name:'salad',checked:true,onCheckedChange:(v,d)=>d.cancel()},Juice:{defaultChecked:false}}}/><Switch06 ref={ref} size="sm" checked={false}/></CelSelectionScope>;
// @ts-expect-error snack keys exact
<Checkbox06 items={{salad:{}}}/>;
// @ts-expect-error no group children
<Checkbox06>ignored</Checkbox06>;
// @ts-expect-error no mixed
<Checkbox06 items={{Wrap:{indeterminate:true}}}/>;
// @ts-expect-error exclusive ownership
<Checkbox06 items={{Salad:{checked:true,defaultChecked:true}}}/>;
// @ts-expect-error no mixed switch
<Switch06 indeterminate/>;
// @ts-expect-error no switch children
<Switch06>ignored</Switch06>;
// @ts-expect-error size contract
<Switch06 size="large"/>;
// @ts-expect-error exclusive switch
<Switch06 checked defaultChecked/>;
