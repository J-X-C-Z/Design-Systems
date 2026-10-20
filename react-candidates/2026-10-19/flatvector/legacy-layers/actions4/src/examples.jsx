import React, {useState} from 'react';
import {FlatActionScope,FlatButton02,FlatButton03,FlatButton04,FlatButton05} from './index.jsx';
export function FlatActionExamples(){
  const [last,setLast]=useState('还未操作'),[disabled,setDisabled]=useState(false),[reduce,setReduce]=useState(false),[dark,setDark]=useState(false),[long,setLong]=useState(false);
  const request=label=>()=>setLast(label);
  return <FlatActionScope mode={dark?'dark':'light'} reducedMotion={reduce}>
    <header><p>POPWISE · ACTION STUDY</p><h1>一组按钮，四种明确用途。</h1><p>原 24 项之外的 4 项独立候选。真实浏览器、原生键盘和布局尚未验证。</p></header>
    <fieldset><legend>可见测试条件</legend>{[['禁用',disabled,setDisabled],['减少动效',reduce,setReduce],['深色',dark,setDark],['长中文',long,setLong]].map(([label,value,set])=><label key={label}><input type="checkbox" checked={value} onChange={e=>set(e.target.checked)}/>{label}</label>)}</fieldset>
    <section aria-label="前后操作"><h2>02 · 前后各自处理</h2><FlatButton02 previousLabel={long?'返回上一个需要仔细阅读的中文步骤':'上一步'} nextLabel={long?'继续查看下一项完整的中文内容':'下一步'} previousProps={{disabled,onClick:request('上一步请求')}} nextProps={{disabled,onClick:request('下一步请求')}}/></section>
    <section aria-label="编辑操作"><h2>03 · 丢弃与保存</h2><FlatButton03 discardLabel="丢弃" saveLabel="保存" discardProps={{disabled,onClick:request('丢弃请求')}} saveProps={{disabled,onClick:request('保存请求')}}/></section>
    <section><h2>04 · 尾箭头</h2><FlatButton04 disabled={disabled} onClick={request('了解更多请求')}>{long?'了解更多关于这个原创纯色矢量组件的完整说明':'了解更多'}</FlatButton04></section>
    <section><h2>05 · 固定禁用</h2><FlatButton05>已禁用</FlatButton05></section>
    <output aria-live="polite">{last}；这里只记录本地请求，不执行跳转或保存服务。</output>
  </FlatActionScope>;
}
