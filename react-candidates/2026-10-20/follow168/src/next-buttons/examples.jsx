import * as React from 'react';
import { Button04, Button05, Button06, Button07, Button08, Button09, Button10, Button11, Button12 } from './index.jsx';
import { SevenThemeProvider } from '../provider.jsx';
import '../tokens.css';
import '../base.css';
import './styles.css';

// Host owns its data and effects. Buttons only emit ordinary React onClick events.
export function NextButtonsExample() {
  const [events, setEvents] = React.useState(0);
  const firstRef = React.useRef(null);
  const [message, setMessage] = React.useState('尚未操作');
  const record = event => { setEvents(count => count + 1); setMessage(event.currentTarget.name); };
  return <SevenThemeProvider theme="follow" reduceMotion>
    <div role="group" aria-label="精确按钮示例" style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <Button04 ref={firstRef} name="探索" onClick={record} />
      <Button05 />
      <Button06 name="小号" onClick={record} />
      <Button07 name="大号" onClick={record} />
      <Button08 name="超小号" onClick={record} />
      <Button09 />
      <Button10 name="升级演示" onClick={record} />
      <Button11 name="删除演示" onClick={record} />
      <Button12 name="收藏演示" onClick={record} />
    </div>
    <p role="status">{message}，共 {events} 次</p>
    <button type="button" onClick={() => firstRef.current?.focus()}>由宿主聚焦第一个按钮</button>
  </SevenThemeProvider>;
}
