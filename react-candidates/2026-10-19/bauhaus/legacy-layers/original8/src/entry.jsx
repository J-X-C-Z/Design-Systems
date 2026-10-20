import {mountBauhaus} from './mount.js';
const host=document.getElementById('mg09-app');
if(host)globalThis.MG09Preview=mountBauhaus(host,{embedded:false});
