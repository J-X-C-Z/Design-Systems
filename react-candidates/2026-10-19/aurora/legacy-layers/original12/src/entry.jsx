import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App.jsx';
import { Specimens } from './Specimens.jsx';
import * as Controls from './components/Controls.jsx';
import * as Disclosure from './components/Disclosure.jsx';
const owners = new WeakMap();
/** Mount only into a dedicated empty host. Repeated mounts return the same owner. */
export function mountAurora(host, options = {}) {
  if (!(host instanceof HTMLElement)) throw new TypeError('A dedicated HTMLElement host is required.');
  if (options.signal?.aborted) return { destroyed:true, destroy(){} };
  if (owners.has(host)) return owners.get(host);
  if (host.childNodes.length) throw new Error('Refusing to replace existing host content. Use an empty, dedicated container.');
  let app, alive=true;
  ReactDOM.render(<App ref={instance=>app=instance}/>,host);
  const controller={
    getState(){return alive?JSON.parse(JSON.stringify(app.state)):null;},
    updateDisplay(patch={}){if(!alive)return;const display={};['motion','opaque','quality'].forEach(key=>{if(Object.prototype.hasOwnProperty.call(patch,key))display[key]=patch[key];});app.change(display);},
    destroy(){if(!alive)return;alive=false;options.signal?.removeEventListener('abort',controller.destroy);ReactDOM.unmountComponentAtNode(host);owners.delete(host);}
  };
  owners.set(host,controller);options.signal?.addEventListener('abort',controller.destroy,{once:true});return controller;
}
window.MG12Aurora={ mount:mountAurora, components:{...Controls,...Disclosure}, ReactVersion:React.version };
const host=document.getElementById('mg-12-aurora-glass-app');
if(host){if(document.documentElement.dataset.view==='specimens')ReactDOM.render(<Specimens/>,host);else window.MG12Aurora.instance=mountAurora(host);}
