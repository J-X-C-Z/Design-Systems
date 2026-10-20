import {React,ReactDOM} from '../vendor/react-runtime.js';
import {App} from './App.js';
const instances=new WeakMap();
/** Additive mounting: never clears host children or changes existing inputs. */
export function mountBauhaus(host,options={}) {
  if(!(host instanceof HTMLElement))throw new TypeError('mountBauhaus requires an HTMLElement.');
  if(options.signal?.aborted)return {update(){},destroy(){},getDocument(){return null},focusTitle(){}};
  if(instances.has(host))throw new Error('An active mg-09-bauhaus instance already owns this host.');
  const wrapper=document.createElement('div');wrapper.dataset.mg09Owned='true';host.append(wrapper);
  const scope=options.shadow?wrapper.attachShadow({mode:'open'}):wrapper;
  const sheets=options.stylesheets??['tokens.css','bauhaus.css'].map(name=>new URL('../styles/'+name,import.meta.url).href);
  for(const href of sheets){const link=document.createElement('link');link.rel='stylesheet';link.href=href;scope.append(link)}
  if(typeof options.cssText==='string'){const style=document.createElement('style');style.textContent=options.cssText;scope.append(style)}
  const target=document.createElement('div');scope.append(target);const ref=React.createRef();let active=true,props={embedded:true,...options};delete props.shadow;delete props.signal;delete props.stylesheets;delete props.cssText;
  const root=ReactDOM.createRoot(target,{identifierPrefix:'mg-09-bauhaus-'});
  const render=()=>root.render(<App {...props} ref={ref}/>);render();
  const api={
    update(patch={}){if(!active)return;const {shadow,signal,stylesheets,cssText,...rest}=patch;props={...props,...rest};render()},
    getDocument(){return active?ref.current?.getDocument()??null:null},
    focusTitle(){if(active)ref.current?.focusTitle()},
    destroy(){if(!active)return;active=false;root.unmount();wrapper.remove();instances.delete(host);options.signal?.removeEventListener('abort',api.destroy)}
  };
  instances.set(host,api);options.signal?.addEventListener('abort',api.destroy,{once:true});return api;
}
