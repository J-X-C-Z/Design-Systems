import * as React from 'react';
import {SevenThemeProvider,RadioGroup11,RadioGroup12,RadioGroup13,Switch19,type RadioGroup13Value} from '@follow-ui/react-seven';
import '@follow-ui/react-seven/styles.css';

export function RelayExample(){
 const formId=React.useId();
 const [device,setDevice]=React.useState<RadioGroup13Value|null>('1');
 const [sync,setSync]=React.useState(true);
 const [receipt,setReceipt]=React.useState('Nothing read yet.');
 return <SevenThemeProvider theme="follow" mode="light">
  <form id={formId} onSubmit={event=>{event.preventDefault();setReceipt(JSON.stringify([...new FormData(event.currentTarget)]));}}>
   <RadioGroup11 name="plan"/>
   <RadioGroup12 name="membership"/>
   <Switch19 name="sync" value="enabled" checked={sync} onCheckedChange={next=>setSync(next)}/>
   <button type="reset">Reset native fields</button>
   <button type="submit">Read fields locally</button>
  </form>
  <RadioGroup13 form={formId} name="device" value={device} onValueChange={next=>setDevice(next)}/>
  <p role="status">{receipt}</p>
 </SevenThemeProvider>;
}
