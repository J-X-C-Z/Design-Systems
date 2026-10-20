import * as React from 'react';
import { Button13, Button14, Button15, Button16, Button17, Button18, Button19, Button20,
  Button21, Button22, Button23, Button24, BUTTON_PROVIDERS } from './index.jsx';
import './styles.css';

/** Mount inside the unchanged SevenThemeProvider. These examples record intent;
 * real clipboard/download/authentication/navigation belongs to the host. */
export function ThirdButtonsExample() {
  const [last, setLast] = React.useState('尚未操作');
  const [count, setCount] = React.useState(8);
  const log = label => () => setLast(label);
  const providerProps = Object.fromEntries(BUTTON_PROVIDERS.map(provider => [provider, { onClick: log(`选择 ${provider}`) }]));
  const providerLabels = { google: '使用 Google 账户继续查看完整内容', x: '使用 X 账户继续查看完整内容', facebook: '使用 Facebook 账户继续查看完整内容', github: '使用 GitHub 账户继续查看完整内容' };
  return <section aria-label="Follow 按钮 13–24 使用例">
    <Button13 onClick={log('复制意图')}>复制当前段落的分享信息</Button13>
    <Button14 onClick={log('下载意图')}>下载当前工作区中的完整文件</Button14>
    <Button15 url="https://watermelon-ui.com/components/button" onClick={log('复制网址意图')}>复制当前展示的网址</Button15>
    <Button16 onClick={log('保存意图')}>保存本次编辑的所有变更</Button16>
    <Button17 onClick={log('警告意图')}>查看此操作的重要警告说明</Button17>
    <Button18 cancelLabel="取消并保留当前草稿" confirmLabel="确认并继续下一步"
      cancelProps={{ onClick: log('取消') }} confirmProps={{ onClick: log('确认') }} />
    <Button19 onClick={log('返回意图')}>返回上一步继续编辑</Button19>
    <Button20 href="#follow-contact" onClick={event => { event.preventDefault(); setLast('联系意图'); }}>联系我们了解完整服务信息</Button20>
    <Button21 providerProps={providerProps} providerLabels={providerLabels} aria-label="选择账户提供商（图标）" />
    <Button22 providerProps={providerProps} providerLabels={providerLabels} aria-label="选择账户提供商（文字）" />
    <Button23 count={count} onClick={() => { setLast('查看收件箱'); setCount(0); }}>查看工作区全部通知</Button23>
    <Button24 onClick={log('账户意图')}>@Follow_演示工作区管理员</Button24>
    <output aria-live="polite">{last}</output>
  </section>;
}
