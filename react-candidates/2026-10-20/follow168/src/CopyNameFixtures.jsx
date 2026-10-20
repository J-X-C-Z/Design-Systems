import * as React from 'react';
import { Button25, Button34 } from './fourth-buttons/index.jsx';
import './fourth-buttons/styles.css';

// Integration-ready visible fixture. It uses real Clipboard API and source timers.
// No API replacement, hidden prop injection, forced random outcome or fake success.
export default function CopyNameFixtures() {
  const [id, setId] = React.useState('34');
  const [mode, setMode] = React.useState('default');
  const [metadata, setMetadata] = React.useState(0);
  const [reset, setReset] = React.useState(0);
  const [disabled, setDisabled] = React.useState(false);
  const [copyNotice, setCopyNotice] = React.useState('尚未操作复制。');
  const [refNotice, setRefNotice] = React.useState('等待挂载。');
  const buttonRef = React.useRef(null), beforeRender = React.useRef(null);
  const nodeRef = React.useCallback(node => {
    buttonRef.current = node;
    if (node) setRefNotice('已持有原生 button。');
  }, []);
  React.useLayoutEffect(() => {
    if (beforeRender.current) {
      setRefNotice(buttonRef.current === beforeRender.current ? '元数据重绘后仍为同一个原生 button。' : '元数据重绘后原生 button 发生替换。');
      beforeRender.current = null;
    }
  });
  const Component = id === '25' ? Button25 : Button34;
  const defaultLabel = id === '25' ? '点击演示' : '复制';
  const longLabel = <><strong>{defaultLabel}</strong><span>完整的长中文标签，用于复验原始 ReactNode 子内容与换行是否保留，不得被固定名称遮盖。</span></>;
  const naming = mode === 'aria-label' ? {'aria-label':'调用者指定名称'} : mode === 'aria-labelledby' ? {'aria-labelledby':'copy-name-external-label'} : {};
  const common = {ref:nodeRef,title:`元数据版本 ${metadata}`,resetKey:reset,disabled,...naming};
  const customStates = mode === 'custom' ? id === '25' ? {
    loadingLabel:<span>正在处理自定义内容</span>,successLabel:<strong>自定义处理完成</strong>,errorLabel:<em>自定义处理失败</em>
  } : {
    copyingLabel:<span>正在复制自定义内容</span>,copiedLabel:<strong>自定义内容已复制</strong>,errorLabel:<em>自定义内容复制失败</em>
  } : {};
  return <main data-react-ready="true" data-react-candidate-count="70" data-fixture-kind="copy-name" lang="zh-CN" style={{fontFamily:'system-ui, sans-serif',maxWidth:760,margin:'24px auto',padding:16,lineHeight:1.6}}>
    <h1>Button25 / Button34 可访问名称隔离复验</h1>
    <p>这是两项名称关系修复的可见夹具。只通过下方真实控件切换场景，不替换浏览器 API。当前候选的 Chrome 可访问树与屏幕阅读器结果需要另行记录。</p>
    <p>Button25 是 1000ms 随机演示，没有保存后台数据。Button34 实际请求写入公开示例文本；Promise 完成不等于已经核实系统剪贴板内容。</p>
    <section aria-labelledby="copy-name-controls">
      <h2 id="copy-name-controls">复验场景</h2>
      <label>精确组件 ID <select value={id} onChange={event=>{setId(event.target.value);setCopyNotice('尚未操作复制。');}}>
        <option value="25">button-25</option><option value="34">button-34</option>
      </select></label>{' '}
      <label>名称来源 <select value={mode} onChange={event=>setMode(event.target.value)}>
        <option value="default">默认文本</option><option value="custom">长中文 ReactNode</option>
        <option value="aria-label">显式 aria-label</option><option value="aria-labelledby">显式 aria-labelledby</option>
      </select></label>
      <p><label><input type="checkbox" checked={disabled} onChange={event=>setDisabled(event.target.checked)}/>外部禁用</label></p>
      <p><button type="button" onClick={()=>{beforeRender.current=buttonRef.current;setMetadata(value=>value+1);}}>仅重绘元数据</button>{' '}
        <button type="button" onClick={()=>setReset(value=>value+1)}>重置当前反馈</button>{' '}
        <button type="button" onClick={()=>buttonRef.current?.focus()}>通过持有的 ref 聚焦组件</button></p>
      <label>外部焦点核对 <input placeholder="在这里保持焦点，再观察父级重绘" onInput={()=>{beforeRender.current=buttonRef.current;setMetadata(value=>value+1);}}/></label>
    </section>
    <section aria-labelledby="copy-name-component">
      <h2 id="copy-name-component">当前组件</h2>
      <p id="copy-name-external-label">调用者关联名称</p>
      <Component {...common} {...customStates} {...(id==='34'?{
        text:'Follow React 可访问名称修复公开样例 A',
        onCopy:()=>setCopyNotice('Clipboard Promise 已完成；请手动粘贴核实系统内容。'),
        onCopyError:()=>setCopyNotice('Clipboard 调用失败；组件应显示失败反馈，且可再次尝试。')
      }:{})}>{mode==='custom'?longLabel:defaultLabel}</Component>
      <p data-ref-audit="true">{refNotice} 元数据版本：{metadata}。</p>
      <p>默认与长标签模式：按钮名称应跟随可见反馈。显式命名模式：按钮名称应保持调用者名称，原有 polite live 反馈仍应保留。</p>
    </section>
    {id==='34'&&<section aria-labelledby="copy-name-clipboard">
      <h2 id="copy-name-clipboard">单独核对真实剪贴板</h2>
      <p role="status">{copyNotice}</p>
      <label>请使用原生粘贴 <textarea placeholder="这里不会自动读取剪贴板" style={{display:'block',width:'100%',minHeight:80,boxSizing:'border-box'}}/></label>
      <p>预期内容：Follow React 可访问名称修复公开样例 A。若仍出现旧文本，请单独记录桥接／系统剪贴板未决，不能用名称修复代替剪贴板验收。</p>
    </section>}
    <p><a href="../index.html#follow/components">返回工作台</a></p>
  </main>;
}
