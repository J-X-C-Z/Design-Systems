import React,{useId,useRef} from 'react';
import {normalizeDisclosureItems,accordion01Items} from '../disclosure/index.jsx';
import {useRequestedState,useCollectionFocus} from './core.jsx';

export const tabs02Items=[
 {value:'deploy',title:'部署',before:'以',emphasis:'信心与速度',after:'交付代码。自动化交付流程，更快触达用户，同时保持可靠性。'},
 {value:'builds',title:'构建',before:'观察你的',emphasis:'编译流程',after:'。追踪构建耗时、依赖和产物，让每一次发布都经过优化和检查。'},
 {value:'infrastructure',title:'基础设施',before:'管理你的',emphasis:'云端资源',after:'。在同一控制台规划扩缩容规则、数据库和网络配置。'}
];
export const tabs03Items=[
 {value:'discovery',title:'发现',icon:'search',before:'探索全球的',emphasis:'原创内容',after:'、新创作者与特色社群。在兴趣和互动形成的信息流中寻找灵感。'},
 {value:'trending',title:'热门',icon:'flame',before:'了解此刻的',emphasis:'热门话题',after:'。浏览有趣讨论、最新对话与正在发生的精彩片段。'},
 {value:'live',title:'直播',icon:'broadcast',before:'加入',emphasis:'实时直播',after:'。通过讨论、互动投票和线上活动，与喜爱的创作者交流。'}
];
export const accordion02Items=accordion01Items.map(item=>({...item}));
export const accordion03Items=[
 {value:'item-1',title:'为什么结算进度会有延迟？',icon:'wallet',content:'演示说明：多个处理环节、截止时间和核对步骤可能影响进度。界面应清楚区分等待、处理中和已完成等状态，让用户了解下一步。'},
 {value:'item-2',title:'怎样减少不必要的风险提醒？',icon:'shield',content:'演示说明：过于固定的提醒规则可能忽略使用情境。通过清楚的状态说明与复核流程，可以帮助用户理解提醒并继续处理。'},
 {value:'item-3',title:'怎样清楚解释失败的转移操作？',icon:'warning',content:'演示说明：只有失败消息往往不够。具体原因、适用的重试提示与状态更新，能帮助用户理解问题并决定下一步。'}
];
const ignoredKey=e=>e.defaultPrevented||e.isComposing||e.nativeEvent?.isComposing||e.keyCode===229||e.nativeEvent?.keyCode===229||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey;
const icons=new Set(['search','flame','broadcast','wallet','shield','warning']);
export function normalizeNextDisclosureItems(input){const source=new Map();for(const x of Array.isArray(input)?input:[])if(x&&x.value!=null&&!source.has(String(x.value)))source.set(String(x.value),x);return normalizeDisclosureItems(input).map(x=>({...x,icon:icons.has(source.get(x.value)?.icon)?source.get(x.value).icon:null}));}
function Icon({kind,expanded}){return <svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{kind==='search'?<><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/></>:kind==='flame'?<path d="M13 3c2 6-3 6-1 10 3-1 3-4 3-4 5 6 3 12-3 12S3 15 7 10c0 3 2 3 2 3-1-4 2-6 4-10Z"/>:kind==='broadcast'?<><circle cx="12" cy="12" r="2"/><path d="M8 8a6 6 0 0 0 0 8m8-8a6 6 0 0 1 0 8M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14"/></>:kind==='wallet'?<><rect x="3" y="6" width="18" height="14" rx="1"/><path d="M3 9V4h15v2m-3 6h6v5h-6Z"/></>:kind==='shield'?<><path d="m12 3 8 4v5c0 4-4 7-8 9-4-2-8-5-8-9V7Z"/><path d="M12 8v5m0 3h.01"/></>:kind==='warning'?<><path d="m12 3 10 18H2Z"/><path d="M12 9v5m0 3h.01"/></>:<path d={expanded?'m6 15 6-6 6 6':'m6 9 6 6 6-6'}/>}</svg>}
function Prose({item}){return item.content!==null?item.content:<>{item.before}{item.emphasis&&<strong>{item.emphasis}</strong>}{item.after}</>}
function useIds(){const uid=useId(),map=useRef(new Map());return key=>{if(!map.current.has(key))map.current.set(key,map.current.size+1);return `${uid}-${map.current.get(key)}`;};}

function NextTabs({variant,items,value,defaultValue,onValueChange,disabled=false,label='内容导航',dir='ltr',activationMode='automatic',className='',onKeyDownCapture}){
 const normalized=normalizeNextDisclosureItems(items),id=`tabs-${String(variant).padStart(2,'0')}`,normalize=value=>normalized.some(x=>x.value===value&&!x.disabled)?value:normalized.find(x=>!x.disabled)?.value??null;
 const state=useRequestedState({id,value,defaultValue,normalize,disabled,onChange:onValueChange,validProposal:next=>normalized.some(x=>x.value===next&&!x.disabled)}),root=useRef(null),keyId=useIds(),focus=useCollectionFocus(root,disabled?[]:normalized.filter(x=>!x.disabled).map(x=>x.value),state.value);
 function keydown(e){if(ignoredKey(e)||e.currentTarget.disabled)return;const buttons=[...root.current.querySelectorAll('[role=tab]:not(:disabled)')],i=buttons.indexOf(e.currentTarget);let target;
  if(e.key==='Home')target=buttons[0];else if(e.key==='End')target=buttons.at(-1);else if(e.key===(dir==='rtl'?'ArrowLeft':'ArrowRight'))target=buttons[(i+1)%buttons.length];else if(e.key===(dir==='rtl'?'ArrowRight':'ArrowLeft'))target=buttons[(i-1+buttons.length)%buttons.length];else if(e.key==='Enter'||e.key===' '){e.preventDefault();if(!e.repeat)state.request(e.currentTarget.dataset.value,'keyboard',e);return;}else return;e.preventDefault();target?.focus();
 }
 return <section ref={root} className={`fr7 fr7-nd fr7-nd-tabs fr7-nd-tabs${variant} ${className}`} data-component-id={id} dir={dir} onKeyDownCapture={onKeyDownCapture}><div role="tablist" className="fr7-nd-track" aria-label={label} aria-orientation="horizontal">{normalized.map(item=>{const key=keyId(item.value);return <button key={item.value} className="fr7-nd-tab" type="button" role="tab" data-value={item.value} id={`${key}-tab`} aria-controls={`${key}-panel`} aria-selected={state.value===item.value} tabIndex={focus.roving===item.value?0:-1} disabled={disabled||item.disabled} onFocus={e=>{focus.focus(e);if(!e.currentTarget.disabled&&e.currentTarget.ownerDocument.activeElement===e.currentTarget&&activationMode!=='manual')state.request(item.value,'focus',e);}} onKeyDown={keydown} onClick={e=>{if(!e.defaultPrevented)state.request(item.value,'click',e);}}>{variant===3&&<Icon kind={item.icon||'search'}/>}<span className="fr7-nd-tab-name">{item.title}</span></button>;})}</div>{normalized.map(item=>{const key=keyId(item.value);return <div key={item.value} className="fr7-nd-panel" role="tabpanel" id={`${key}-panel`} aria-labelledby={`${key}-tab`} hidden={state.value!==item.value} tabIndex={0}><p><Prose item={item}/></p></div>;})}{!normalized.length&&<p className="fr7-nd-note">暂无可用项目。</p>}</section>;
}
export function Tabs02({items=tabs02Items,defaultValue='deploy',...props}){return <NextTabs {...props} variant={2} items={items} defaultValue={defaultValue}/>;}
export function Tabs03({items=tabs03Items,defaultValue='discovery',...props}){return <NextTabs {...props} variant={3} items={items} defaultValue={defaultValue}/>;}

function NextAccordion({variant,items,value,defaultValue=['item-1'],onValueChange,disabled=false,label='常见问题',className='',onKeyDownCapture}){
 const normalized=normalizeNextDisclosureItems(items),id=`accordion-${String(variant).padStart(2,'0')}`,normalize=value=>normalized.filter(x=>Array.isArray(value)&&value.includes(x.value)).map(x=>x.value);
 const state=useRequestedState({id,value,defaultValue,normalize,disabled,onChange:onValueChange,validProposal:(next,current)=>[...new Set([...next,...current])].filter(key=>next.includes(key)!==current.includes(key)).every(key=>normalized.some(x=>x.value===key&&!x.disabled))}),root=useRef(null),keyId=useIds(),focus=useCollectionFocus(root,disabled?[]:normalized.filter(x=>!x.disabled).map(x=>x.value),state.value[0]);
 function toggle(key,reason,event){if(normalized.some(x=>x.value===key&&!x.disabled))state.request(state.value.includes(key)?state.value.filter(x=>x!==key):[...state.value,key],reason,event);}
 function keydown(e){if(ignoredKey(e)||e.currentTarget.disabled)return;if(e.key==='Enter'||e.key===' '){e.preventDefault();if(!e.repeat)toggle(e.currentTarget.dataset.value,'keyboard',e);return;}const buttons=[...root.current.querySelectorAll('button[data-value]:not(:disabled)')],i=buttons.indexOf(e.currentTarget);let target;if(e.key==='Home')target=buttons[0];else if(e.key==='End')target=buttons.at(-1);else if(e.key==='ArrowDown')target=buttons[(i+1)%buttons.length];else if(e.key==='ArrowUp')target=buttons[(i-1+buttons.length)%buttons.length];else return;e.preventDefault();target?.focus();}
 return <section ref={root} className={`fr7 fr7-nd fr7-nd-accordion fr7-nd-accordion${variant} ${className}`} data-component-id={id} aria-label={label} onKeyDownCapture={onKeyDownCapture}>{normalized.map(item=>{const key=keyId(item.value),expanded=state.value.includes(item.value);return <div key={item.value} className="fr7-nd-accordion-item" data-state={expanded?'open':'closed'}><h3><button className="fr7-nd-accordion-trigger" type="button" id={`${key}-trigger`} data-value={item.value} aria-controls={`${key}-content`} aria-expanded={expanded} disabled={disabled||item.disabled} onFocus={focus.focus} onKeyDown={keydown} onClick={e=>{if(!e.defaultPrevented)toggle(item.value,'click',e);}}>{variant===3&&<Icon kind={item.icon||'warning'}/>}<span>{item.title}</span><Icon kind="chevron" expanded={expanded}/></button></h3><div className="fr7-nd-accordion-content" role="region" id={`${key}-content`} aria-labelledby={`${key}-trigger`} hidden={!expanded}><Prose item={item}/></div></div>;})}{!normalized.length&&<p className="fr7-nd-note">暂无可用项目。</p>}</section>;
}
export function Accordion02({items=accordion02Items,...props}){return <NextAccordion {...props} variant={2} items={items}/>;}
export function Accordion03({items=accordion03Items,...props}){return <NextAccordion {...props} variant={3} items={items}/>;}
