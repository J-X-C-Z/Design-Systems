import React,{useEffect,useRef} from 'react';
import {useCel,resources,listen} from './core.jsx';

export function phaseAt(seconds,fps=12){return Math.floor(Math.max(0,seconds)*fps)%4;}
export function noise(seed){let x=(seed+0x6d2b79f5)|0;x=Math.imul(x^(x>>>15),x|1);x^=x+Math.imul(x^(x>>>7),x|61);return ((x^(x>>>14))>>>0)/4294967296;}
/** Original product illustration. Four deterministic drawings, not the original MG film or a video. */
export function drawScene(ctx,phase,{ink='#1c1613',red='#e5402b',yellow='#ffc425',paper='#fff6e2',amplitude=1,registration=true,onion=false}={}){
 const W=800,H=650;ctx.clearRect(0,0,W,H);ctx.lineCap='round';ctx.lineJoin='round';
 const j=(i,a=1)=>(noise(i*71+phase*37)-.5)*2.5*amplitude*a;
 function path(points,fill=null,closed=true,width=4,seed=1){ctx.beginPath();points.forEach(([x,y],i)=>{const px=x+j(seed+i),py=y+j(seed+i+36);i?ctx.lineTo(px,py):ctx.moveTo(px,py);});if(closed)ctx.closePath();if(fill){ctx.save();if(registration)ctx.translate(3+j(seed),2+j(seed+1));ctx.fillStyle=fill;ctx.fill();ctx.restore();}ctx.strokeStyle=ink;ctx.lineWidth=width;ctx.stroke();}
 function ellipse(x,y,rx,ry,fill,seed=1,width=4){const p=[];for(let i=0;i<50;i++){const a=i*Math.PI/25;p.push([x+Math.cos(a)*rx,y+Math.sin(a)*ry]);}path(p,fill,true,width,seed);}
 function star(x,y,r,seed){const p=[];for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,rr=i%2?r*.38:r;p.push([x+Math.cos(a)*rr,y+Math.sin(a)*rr]);}path(p,yellow,true,3,seed);}
 // Warm flat colour plate deliberately extends beyond the fine registration outline.
 ellipse(399,307,229,242,yellow,41,0.8);
 ctx.save();ctx.globalAlpha=.2;for(let i=0;i<19;i++)path([[180+i*22,546],[220+i*22,579]],null,false,1.5,70+i);ctx.restore();
 // Match box: deliberately separate ink plate and colour plate.
 ctx.save();ctx.translate(390,467);ctx.rotate(-.14);
 path([[-185,-24],[99,-24],[163,20],[-117,20]],red,true,4,100);
 path([[-185,-24],[-117,20],[-117,107],[-185,56]],yellow,true,4,101);
 path([[-117,20],[163,20],[163,105],[-117,107]],paper,true,4,102);
 path([[-84,40],[132,40],[132,86],[-84,88]],red,true,3,103);
 for(let i=0;i<6;i++)path([[-176+i*8,-7+i*5],[-176+i*8,40+i*5]],null,false,1.5,201+i);
 ctx.fillStyle=ink;ctx.font='bold 27px system-ui,sans-serif';ctx.textAlign='center';ctx.fillText('ONE MORE TRY.',27,72);ctx.restore();
 // The match stem and variable-width ink strokes.
 ctx.save();ctx.translate(385,454);ctx.rotate(.26+j(40)*.007);path([[-11,-25],[-5,-233],[11,-233],[8,-25]],paper,true,4,180);ellipse(3,-230,17,25,red,220,4);ctx.restore();
 const flame=[[407,405],[376,383],[362,350],[371,309],[365,271],[391,291],[401,251],[437,205],[451,161],[468,190],[474,231],[509,254],[527,290],[521,330],[499,364],[470,388],[438,406]];
 if(onion){ctx.save();ctx.globalAlpha=.2;ctx.translate(-12,6);path(flame,null,true,3,450);ctx.restore();}
 path(flame,red,true,5,450);
 path([[412,369],[395,345],[409,314],[424,322],[447,286],[468,272],[463,310],[484,329],[475,350],[449,372]],yellow,true,3,470);
 ctx.fillStyle=ink;ctx.beginPath();ctx.ellipse(408+j(4),295,3.8,8,0,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(451+j(5),288,3.8,8,0,0,7);ctx.fill();
 path([[414,315],[427,320],[438,313]],null,false,3,511);
 // Scribbled limbs and cel sparks, never UI controls.
 path([[370,332],[340,313],[335,286],[323,280]],null,false,4,550);
 path([[518,310],[547,288],[552,267],[566,254]],null,false,4,560);
 path([[415,397],[397,421],[375,425]],null,false,4,570);
 path([[456,395],[476,417],[499,410]],null,false,4,580);
 star(241,205,35,620);star(595,379,26,630);star(559,130,17,640);
 path([[274,362],[236,349],[217,354]],null,false,3,660);path([[592,226],[622,207]],null,false,3,661);path([[601,247],[644,241]],null,false,2,662);
 ellipse(211,297,8,7,red,670,2);ellipse(574,478,7,7,red,671,2);
 ctx.save();ctx.translate(140,143);ctx.rotate(-.17);ctx.fillStyle=ink;ctx.font='italic 22px serif';ctx.fillText('a little alive.',0,0);path([[2,9],[63,15],[112,6]],null,false,1.5,710);ctx.restore();
 ctx.save();ctx.translate(627,528);ctx.rotate(.12);ctx.fillStyle=ink;ctx.font='16px monospace';ctx.fillText('NO. 0'+(phase+1),0,0);ctx.restore();
}
export function CelScene({playing=true,frame=0,fps=12,amplitude=1,registration=true,onion=false}){
 const ref=useRef(null),{motion,theme}=useCel();
 useEffect(()=>{
  const canvas=ref.current,ctx=canvas.getContext('2d');const dpr=Math.min(devicePixelRatio||1,2);canvas.width=800*dpr;canvas.height=650*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
  const s=getComputedStyle(canvas),ink=s.getPropertyValue('--cb-ink').trim(),red=s.getPropertyValue('--cb-tomato').trim(),yellow=s.getPropertyValue('--cb-sun').trim(),paper=s.getPropertyValue('--cb-sheet').trim();
  let disposed=false,visible=true,raf=null,start=performance.now(),last=-1;const enabled=playing&&motion;
  function render(p){if(disposed)return;drawScene(ctx,p,{ink,red,yellow,paper,amplitude,registration,onion});canvas.dataset.frame=String(p);}
  function cancel(){if(raf!==null){cancelAnimationFrame(raf);raf=null;resources.raf--;}}
  function queue(){if(raf===null&&!disposed&&enabled&&visible&&!document.hidden){resources.raf++;raf=requestAnimationFrame(loop);}}
  function loop(t){raf=null;resources.raf--;if(disposed||!enabled||!visible||document.hidden)return;const next=phaseAt((t-start)/1000,fps);if(next!==last){render(next);last=next;}queue();}
  render(frame%4);queue();
  const off=listen(document,'visibilitychange',()=>{if(document.hidden)cancel();else queue();});
  let observer;if('IntersectionObserver'in window){observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting!==false;if(visible)queue();else cancel();},{threshold:.05});observer.observe(canvas);resources.observers++;}
  return()=>{disposed=true;cancel();off();if(observer){observer.disconnect();resources.observers--;}};
 },[playing,frame,fps,amplitude,registration,onion,motion,theme]);
 return <canvas ref={ref} className="cb-scene" role="img" aria-label="原创手绘火焰与火柴盒，四张微差线稿按逐帧节奏循环。关闭动态后显示静态画稿。"/>;
}
