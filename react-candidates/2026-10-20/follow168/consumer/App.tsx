import {useRef,useState} from 'react';
import {SevenThemeProvider,useSevenTheme,Button01,Button02,Button03,Checkbox01,Switch01,InputMask01,Textarea01,Tabs01,Accordion01,Dialog01,tabs01Items,normalizeDisclosureItems,Button04,Button05,Button06,Button07,Button08,Button09,Button10,Button11,Button12,Checkbox02,Checkbox03,Checkbox04,Switch02,Switch03,Switch04,Textarea02,Tabs02,Tabs03,Accordion02,Accordion03,Button13,Button14,Button15,Button16,Button17,Button18,Button19,Button20,Button21,Button22,Button23,Button24,Checkbox05,Checkbox06,Checkbox07,Checkbox08,Switch05,Switch06,Switch07,Switch08,Button25,Button26,Button27,Button28,Button29,Button30,Button31,Button32,Button33,Button34,Button35,Button36,Checkbox09,Checkbox10,Checkbox11,Checkbox12,Switch09,Switch10,Switch11,Switch12,type MixedCheckboxValue,type SevenTheme} from '@follow-ui/react-seven';
import '@follow-ui/react-seven/styles.css';
function ThemeReadout(){const state=useSevenTheme();return <p>{state.theme} / {state.mode}</p>}
export function App(){
 const [theme,setTheme]=useState<SevenTheme>('follow'),[count,setCount]=useState(0),[checked,setChecked]=useState(false),[value,setValue]=useState(''),[tab,setTab]=useState<string|null>('overview'),[expanded,setExpanded]=useState<readonly string[]>(['item-1']),[open,setOpen]=useState(false);
 const [mixed,setMixed]=useState<MixedCheckboxValue>({checked:false,indeterminate:true});
 const button=useRef<HTMLButtonElement>(null),field=useRef<HTMLTextAreaElement>(null),trigger=useRef<HTMLButtonElement>(null);
 return <SevenThemeProvider theme={theme} mode="light"><main style={{padding:24,maxWidth:900,margin:'auto'}}><h1>独立消费者 / Follow React 70</h1><ThemeReadout/>
 <label>主题<select value={theme} onChange={event=>setTheme(event.target.value as SevenTheme)}>{(['echo','bloom','neuro','follow','wix','maigawara','goons'] as const).map(x=><option key={x}>{x}</option>)}</select></label>
 <Button01 ref={button} onClick={event=>{event.currentTarget.focus();setCount(n=>n+1)}}>本地动作 {count}</Button01>
 <Button02 onClick={()=>setCount(n=>n-1)} nextProps={{onClick:()=>setCount(n=>n+1),'aria-label':'下一步'}}/>
 <Button03 onClick={()=>setValue('')} saveProps={{onClick:()=>setCount(n=>n+1)}}/>
 <form onSubmit={event=>event.preventDefault()}><Checkbox01 name="demo-check" checked={checked} onCheckedChange={(next,event)=>{event.currentTarget.focus();setChecked(next)}}/><Switch01 name="demo-switch" defaultChecked/>
 <InputMask01 label="公开车牌示例" defaultValue="AB12 CDE"/><Textarea01 ref={field} label="公开备注" value={value} onValueChange={setValue} help="只保存在当前React状态"/><button type="reset">原生重置</button></form>
 <Tabs01 items={normalizeDisclosureItems(tabs01Items)} value={tab} onValueChange={(next,details)=>{if(details.id==='tabs-01')setTab(next)}}/>
 <Accordion01 value={expanded} onValueChange={setExpanded}/><Dialog01 triggerRef={trigger} open={open} onOpenChange={setOpen} onConfirm={()=>setCount(n=>n+1)}/>
 <section><h2>新增20个精确ID</h2><Button04 onClick={()=>setCount(n=>n+1)}/><Button05/><Button06/><Button07/><Button08/><Button09/><Button10/><Button11/><Button12/>
 <form onSubmit={event=>event.preventDefault()}><Checkbox02 value={mixed} onValueChange={setMixed}/><Checkbox03/><Checkbox04/><Switch02/><Switch03 destructive={{checked,onCheckedChange:setChecked}} success={{name:'success-switch'}}/><Switch04/><Textarea02 name="notes02"/><button type="reset">重置新增字段</button></form>
 <Tabs02 onValueChange={(next,details)=>{if(details.id==='tabs-02')console.log(next)}}/><Tabs03 activationMode="manual"/><Accordion02/><Accordion03/>
 </section> <section><h2>第三切片20个独立导出</h2>
 <Button13 onClick={()=>setCount(n=>n+1)}/><Button14/><Button15 url="公开演示地址" onClick={()=>setCount(n=>n+1)}/><Button16/><Button17/><Button18 cancelProps={{onClick:()=>setCount(n=>n-1)}} confirmProps={{onClick:()=>setCount(n=>n+1)}}/><Button19/><Button20 href="#local-sample" onClick={event=>event.preventDefault()}/><Button21 providerProps={{google:{onClick:()=>setCount(n=>n+1)}}}/><Button22 providerLabels={{github:'公开GitHub演示'}}/><Button23 count={8}/><Button24 avatarFallback="VP"/>
 <form onSubmit={event=>event.preventDefault()}><Checkbox05 standard={{checked,onCheckedChange:setChecked}}/><Checkbox06 salad={{name:'salad'}}/><Checkbox07/><Checkbox08 design={{checked,onCheckedChange:setChecked}}/><Switch05 success={{name:'success'}}/><Switch06/><Switch07 small={{checked,onCheckedChange:setChecked}}/><Switch08/><button type="reset">重置第三切片字段</button></form>
 </section>
<section><h2>第四切片：本地动作、复制与18个字段</h2><Button25/><Button26 pressed={checked} onPressedChange={setChecked}/><Button27/><Button28 tooltip="完整的公开提示"/><Button29/><Button30/><Button31/><Button32/><Button33 count="99+"/><Button34 text="Follow React 公开复制样例" onCopy={text=>setValue(text)} onCopyError={()=>setValue('复制不可用')}/><Button35/><Button36 count={3}/><form onSubmit={event=>event.preventDefault()}><Checkbox09 planning={{checked,onCheckedChange:setChecked}}/><Checkbox10 destructive={{name:'danger'}}/><Checkbox11 triangle={{defaultChecked:false}}/><Checkbox12 success={{'aria-label':'公开成功选择'}}/><Switch09/><Switch10/><Switch11 help="此例不启动真实数据同步"/><Switch12 privacy={{checked,onCheckedChange:setChecked}}/><button type="reset">重置第四切片字段</button></form></section>
<p>此独立工程从本地 npm tgz 导入组件，不依赖工作台源码或DOM适配器。</p></main></SevenThemeProvider>
}
