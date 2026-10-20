import * as React from 'react';
import { Checkbox09, Checkbox10, Checkbox11, Checkbox12, Switch09, Switch10, Switch11, Switch12 } from './index.jsx';
import '../scalar/styles.css';
import './styles.css';

/** Local-only examples: these controls never create network requests or persist settings. */
export function FourthSelectionExamples() {
  const [planning, setPlanning] = React.useState(false);
  const [sync, setSync] = React.useState(true);
  const privacy = React.useRef(null);
  return <form>
    <Checkbox09 label="关注领域" planning={{ name: 'focus', value: 'planning', checked: planning, onCheckedChange: setPlanning }} design={{ name: 'focus', value: 'design' }} operations={{ name: 'focus', value: 'operations' }} />
    <Checkbox10 label="语义颜色" destructive={{ name: 'color', value: 'destructive' }} info={{ name: 'color', value: 'info' }} success={{ name: 'color', value: 'success' }} />
    <Checkbox11 label="选择形状" triangle={{ label: '三角形', name: 'shape', value: 'triangle' }} diamond={{ label: '菱形', name: 'shape', value: 'diamond' }} hexagon={{ label: '六边形', name: 'shape', value: 'hexagon' }} />
    <Checkbox12 label="圆形色标" destructive={{ label: '危险', name: 'circle', value: 'destructive' }} info={{ label: '信息', name: 'circle', value: 'info' }} success={{ label: '成功', name: 'circle', value: 'success' }} />
    <Switch09 label="保留原版勾叉方向" name="indicator" />
    <Switch10 label="日月状态示例" help="此示例只切换字段，不改变主题。" name="sun" />
    <Switch11 checked={sync} onCheckedChange={setSync} name="autoSync" help="本地状态示例，不会连接设备或同步任何数据。" />
    <Switch12 privacyRef={privacy} privacy={{ name: 'preference', value: 'privacy' }} notifications={{ name: 'preference', value: 'notifications' }} darkTheme={{ name: 'preference', value: 'darkTheme' }} description="三个独立设置，支持单独控制与表单归属。" />
    <button type="reset">重置未受控字段</button>
  </form>;
}
