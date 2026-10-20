import React from 'react';
import {createRoot} from 'react-dom/client';
import {CelBoilStudio} from './App.jsx';
const element=document.getElementById('cel-boil-root');
if(!element)throw new Error('Missing #cel-boil-root');
const root=createRoot(element);
root.render(<CelBoilStudio/>);
// This isolated root never mounts onto the seven-theme host's content nodes.
window.StudioCelBoil={version:'1.0.0-react-candidate',unmount(){root.unmount();delete window.StudioCelBoil;}};
