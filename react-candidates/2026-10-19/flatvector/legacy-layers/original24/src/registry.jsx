import {FlatButton,FlatBadge,FlatAvatar,FlatCheckbox,FlatSwitch,FlatRadio,FlatSelect,FlatTextarea,FloatingInput,AdaptiveSlider,FlatOTP,FlatForm,FlatButtonGroup} from './components/inputs.jsx';
import {FlatTabs,FlatAccordion,FlatCollapsible,FlatDialog,FlatSheet,FlatPopover,FlatTooltip,FlatDropdown} from './components/disclosure.jsx';
import {FlatAlert,FlatBreadcrumb,FlatPagination} from './components/display.jsx';
export const entries=[
 ['button-01','行动按钮','行动',FlatButton,'纯色胶囊 / 原生按键 / 按压回弹'],
 ['checkbox-01','订阅勾选','输入',FlatCheckbox,'可触达的整行标签 / 勾选明确可见'],
 ['switch-01','通知开关','输入',FlatSwitch,'圆点平移表示二态 / 键盘 Space 与 Enter'],
 ['radio-group-01','通知方式','输入',FlatRadio,'3 项互斥 / 默认电子邮件 / 原生方向键'],
 ['select-01','角色选择','输入',FlatSelect,'保留 4 个角色 / 操作系统原生选择器'],
 ['textarea-01','自由书写','输入',FlatTextarea,'多行编辑 / 禁用与只读 / 清晰焦点'],
 ['floating-input','浮动标签','输入',FloatingInput,'标签上浮 / 非空初值修复 / 关联标签'],
 ['adaptive-slider','能量滑块','输入',AdaptiveSlider,'六个刻度点 / 三段纯色 / 可访问数值'],
 ['input-otp-01','四位验证码','输入',FlatOTP,'4 位数字 / 单一真实输入 / 本地编辑'],
 ['form-01','六位校验表单','输入',FlatForm,'6 位文本 / 错误与加载 / 取消异步与重置'],
 ['tabs-01','项目页签','导航',FlatTabs,'3 个独立面板 / 方向键 / 稳定焦点'],
 ['breadcrumb-01','层级路径','导航',FlatBreadcrumb,'两级链接 / 当前页语义 / 自然折行'],
 ['pagination-01','页码选择','导航',FlatPagination,'默认第 2 页 / 边界禁用 / 页码回调'],
 ['accordion-01','展开式问答','展开',FlatAccordion,'多项同时展开 / 默认首项 / 非虚构业务说明'],
 ['collapsible-01','团队笔记','展开',FlatCollapsible,'始终可见主笔记 / 展开剩余两份'],
 ['dialog-01','重要确认','浮层',FlatDialog,'取消优先 / 真正模态 / 关闭后归还焦点'],
 ['sheet-01','偏好侧栏','浮层',FlatSheet,'三项受控表单 / 抽屉 / 重开保留草稿'],
 ['popover-01','评价气泡','浮层',FlatPopover,'保留 300 条静态分布 / 4.55 分 / 可关闭'],
 ['tooltip-01','即时提示','浮层',FlatTooltip,'悬停与焦点 / Escape 消隐 / 可停留气泡'],
 ['dropdown-menu-01','操作菜单','浮层',FlatDropdown,'5 种操作 / 菜单语义 / 方向键与返回焦点'],
 ['alerts-01','消息提示','状态',FlatAlert,'图标和标题 / 语义提示 / 非纯颜色反馈'],
 ['badge-01','状态徽章','状态',FlatBadge,'静态文本标识 / 不制造虚假可交互状态'],
 ['avatar-01','字母头像','状态',FlatAvatar,'32px 圆形 / MC 原始姓名映射 / 不加载照片'],
 ['button-group-01','上传按钮组','行动',FlatButtonGroup,'动作与 24 静态计数分区 / 不假装上传']
];
export const registry=Object.fromEntries(entries.map(([id,title,category,Component,description])=>[id,{id,title,category,Component,description}]));
export const implementedIds=entries.map(e=>e[0]);
