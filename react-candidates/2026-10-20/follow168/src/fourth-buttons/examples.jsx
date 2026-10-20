import * as React from 'react';
import { Button25, Button26, Button27, Button28, Button29, Button30, Button31, Button32, Button33, Button34, Button35, Button36 } from './index.jsx';
import './styles.css';

/** Place under the existing seven-theme Provider; this example never changes its theme. */
export function FourthButtonsExample() {
  const [bookmarked, setBookmarked] = React.useState(false);
  const [resetKey, reset] = React.useReducer(value => value + 1, 0);
  const [copyNotice, setCopyNotice] = React.useState('尚未复制');
  return <section aria-label="按钮25至36示例">
    <p>第25项是固定一秒后随机成功或失败的演示，不是保存结果。</p>
    <Button25 resetKey={resetKey} />
    <Button26 /><Button27 />
    <Button28 tooltip="添加新项目。较长的中文提示会在本地提示框内自动换行。" />
    <Button29 pressed={bookmarked} onPressedChange={setBookmarked}>收藏此示例</Button29>
    <Button30 onClick={() => setCopyNotice('这里只展示错误按钮，没有触发业务操作。')} />
    <Button31 /><Button32 /><Button33 count="99+" />
    <Button34 text="由使用者指定的待复制内容" resetKey={resetKey}
      onCopy={() => setCopyNotice('系统剪贴板写入已完成')}
      onCopyError={() => setCopyNotice('复制未完成，请检查浏览器剪贴板权限')}>复制示例文字</Button34>
    <Button35 /><Button36 count={3}>工作区消息</Button36>
    <button type="button" onClick={reset}>重置演示反馈</button>
    <p role="status">{copyNotice}</p>
  </section>;
}
