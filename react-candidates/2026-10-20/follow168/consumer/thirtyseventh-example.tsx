import * as React from 'react';
import {SevenThemeProvider,RadioGroup07,RadioGroup08,RadioGroup09,RadioGroup10,type RadioGroup10Value} from '@follow-ui/react-seven';
import '@follow-ui/react-seven/styles.css';

export function DecisionExample(){
 const [plan,setPlan]=React.useState<RadioGroup10Value|null>('2');
 const [receipt,setReceipt]=React.useState('No record yet');
 return <SevenThemeProvider theme="follow" mode="light"><form onSubmit={event=>{event.preventDefault();setReceipt(JSON.stringify([...new FormData(event.currentTarget)]));}}>
  <RadioGroup07 name="experience" defaultValue="Advanced"/>
  <RadioGroup08 name="size" defaultValue="medium"/>
  <RadioGroup09 name="tone" defaultValue="positive"/>
  <RadioGroup10 name="plan" value={plan} onValueChange={next=>setPlan(next)}/>
  <button type="reset">Reset local fields; parent plan stays</button>
  <button type="submit">Read native fields locally</button>
  <p role="status">{receipt}</p>
 </form></SevenThemeProvider>;
}
