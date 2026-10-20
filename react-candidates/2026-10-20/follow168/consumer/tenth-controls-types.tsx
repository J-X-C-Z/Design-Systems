import * as React from 'react';
import {Textarea19,Breadcrumb03,type Breadcrumb03Segment,type Textarea19FieldProps} from '@follow-ui/react-seven';
<Textarea19 ref={React.createRef<HTMLDivElement>()} fields={{compact:{value:'a',onChange:e=>e.currentTarget.value,ref:React.createRef<HTMLTextAreaElement>(),name:'short',form:'outside'},standard:{defaultValue:'b',label:'Standard'},expanded:{readOnly:true,required:true,maxLength:500}}}/>;
<Breadcrumb03 ref={React.createRef<HTMLElement>()} segments={[{label:'Home',href:'#local',ref:React.createRef<HTMLAnchorElement>(),onClick:e=>e.preventDefault(),symbol:'home'},{label:<b>Here</b>,current:true,icon:null}]}/>;
// @ts-expect-error composite no direct value
<Textarea19 value="x"/>;
// @ts-expect-error field ownership exclusive
<Textarea19 fields={{standard:{value:'x',defaultValue:'y'}}}/>;
// @ts-expect-error exact three member keys
<Textarea19 fields={{large:{defaultValue:'x'}}}/>;
// @ts-expect-error children not composite content
<Textarea19>child</Textarea19>;
// @ts-expect-error native textarea field ref
<Textarea19 fields={{compact:{ref:React.createRef<HTMLInputElement>()}}}/>;
// @ts-expect-error current cannot navigate
<Breadcrumb03 segments={[{label:'Here',current:true,href:'#bad'}]}/>;
// @ts-expect-error current cannot carry click action
<Breadcrumb03 segments={[{label:'Here',current:true,onClick:()=>{}}]}/>;
// @ts-expect-error noncurrent needs href
<Breadcrumb03 segments={[{label:'Missing'}]}/>;
