import {SevenThemeProvider,Tabs01,Checkbox01,Dialog01,Button02} from '@follow-ui/react-seven';
// @ts-expect-error Unsupported theme is not silently typed as arbitrary string.
<SevenThemeProvider theme="unknown"/>;
// @ts-expect-error Tabs value is string/null, not an array.
<Tabs01 value={['overview']}/>;
// @ts-expect-error Checkbox checked is boolean.
<Checkbox01 checked="true"/>;
// @ts-expect-error Native trigger reference must be a button.
<Dialog01 triggerRef={{current:document.createElement('input')}}/>;
// @ts-expect-error Secondary button onClick still uses a real React click handler.
<Button02 nextProps={{onClick:'not a handler'}}/>;

import {Button05,Button09,Checkbox02,Switch03,Textarea02,Tabs02} from '@follow-ui/react-seven';
// @ts-expect-error Fixed source disabled is not enabled by false.
<Button05 disabled={false}/>;
// @ts-expect-error Fixed loading source remains disabled.
<Button09 disabled={false}/>;
// @ts-expect-error Paired mixed value is atomic, not a boolean.
<Checkbox02 value={true}/>;
// @ts-expect-error Mixed pair fields must be booleans.
<Checkbox02 value={{checked:'yes',indeterminate:true}}/>;
// @ts-expect-error Four independent slots do not accept a fabricated aggregate.
<Switch03 values={[true,false]}/>;
// @ts-expect-error Native field name is a string.
<Textarea02 name={123}/>;
// @ts-expect-error Next tabs are string/null selections.
<Tabs02 value={['deploy']}/>;

import {Button18,Button20,Button21,Checkbox05,Checkbox08,Switch07} from '@follow-ui/react-seven';
// @ts-expect-error Composite actions have native button callbacks, not string names.
<Button18 confirmProps={{onClick:'confirm'}}/>;
// @ts-expect-error Link href is a string, not a number.
<Button20 href={123}/>;
// @ts-expect-error Unknown social slot cannot silently produce an extra button.
<Button21 providerProps={{unknown:{}}}/>;
// @ts-expect-error Composite checkboxes have explicit members, not aggregate checked.
<Checkbox05 checked/>;
// @ts-expect-error Each selected member has boolean checked.
<Checkbox08 design={{checked:'yes'}}/>;
// @ts-expect-error Three sizes are real member fields, no synthetic aggregate values.
<Switch07 values={[true,false,true]}/>;

import {Button26,Button28,Button34,Checkbox09,Checkbox11,Switch12} from '@follow-ui/react-seven';
// @ts-expect-error Pressed value is boolean, not a string.
<Button26 pressed="true"/>;
// @ts-expect-error Tooltip readOnly is boolean.
<Button28 readOnly="yes"/>;
// @ts-expect-error Clipboard payload is text.
<Button34 text={123}/>;
// @ts-expect-error Named fields do not take fabricated aggregate selection.
<Checkbox09 checked/>;
// @ts-expect-error Geometric member ref is a native input, not a button.
<Checkbox11 triangleRef={{current:document.createElement('button')}}/>;
// @ts-expect-error Settings root is a fieldset, not a native input.
<Switch12 ref={{current:document.createElement('input')}}/>;
