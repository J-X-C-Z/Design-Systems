import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import App from './App.jsx';
import { registry, implementedIds } from './registry.jsx';
import { diagnostics } from './core.jsx';
export { registry, implementedIds, diagnostics, App };
export const version = '1.0.0-react';
const roots = new WeakMap();
class Boundary extends React.Component {
    constructor(props) { super(props); this.state = { error: null }; }
    static getDerivedStateFromError(error) { return { error }; }
    componentDidCatch(error) { this.props.onError?.(error); }
    render() { return this.state.error ? <div className="fv18 fv-island" role="alert"><h2>组件未能加载</h2><p>{String(this.state.error.message)}</p><p>请查看本地控制台与测试报告。</p></div> : this.props.children; }
}
// Separate React root; never calls the Follow849 native registry. No user text is injected as HTML.
export function mount(container, id = 'app', initial = {}) {
    if (!(container instanceof HTMLElement))
        throw new TypeError('FlatVectorReact.mount requires an HTMLElement');
    if (roots.has(container))
        throw new Error('This container already has a FlatVectorReact root. Call destroy() first.');
    if (id !== 'app' && !registry[id])
        throw new RangeError('Unimplemented canonical ID: ' + id);
    const root = createRoot(container, { identifierPrefix: 'fv18-' + id + '-' });
    let props = { ...initial }, dead = false;
    diagnostics.roots++;
    const render = () => { const Component = id === 'app' ? App : registry[id].Component; flushSync(() => root.render(<StrictMode><Boundary onError={props.onError}>{id === 'app' ? <Component {...props}/> : <div className="fv18" data-mode={props.mode === 'dark' ? 'dark' : 'light'} data-motion={props.reducedMotion ? 'off' : 'on'}><div className="fv-island" data-component-id={id}><Component {...props}/></div></div>}</Boundary></StrictMode>)); };
    const api = { update(patch = {}) { if (dead)
            return false; if (patch === null || typeof patch !== 'object')
            throw new TypeError('update requires a props object'); props = { ...props, ...patch }; render(); return true; }, getState() { return { id, destroyed: dead, props: { ...props } }; }, destroy() { if (dead)
            return; dead = true; flushSync(() => root.unmount()); roots.delete(container); diagnostics.roots--; } };
    roots.set(container, api);
    try {
        render();
    }
    catch (e) {
        api.destroy();
        throw e;
    }
    return api;
}
export const list = () => implementedIds.map(id => ({ id, title: registry[id].title, category: registry[id].category, framework: 'react' }));
const target = document.getElementById('flat-vector-app');
if (target)
    window.__flatVectorApp = mount(target, 'app', { assetBase: target.dataset.assetBase || './', legacyBase: target.dataset.legacyBase || '../echo-latest/follow-catalog-r11-seven/' });
