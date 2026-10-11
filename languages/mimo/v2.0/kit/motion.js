/* MiMo-inspired Motion 2.0.0. Original authoring; no third-party runtime.
 * Optional resource vocabulary, not a mandatory design pipeline.
 * API: MimoMotion.play(root, id, {autoplay,duration,reduced,onUpdate}).
 * root contains data-part hooks. Returns pause/play/seek/reset/cancel/finish.
 */
(function (global) {
  'use strict';
  const current = new WeakMap();
  const ease = 'cubic-bezier(.22,.75,.2,1)';
  const durations = {'index-trace':520,'type-unfold':520,'evidence-flow':900,'focus-aperture':520,'quiet-reframe':520,'directional-hint':160,'surface-resolve':280,'command-confirm':280,'state-relay':900,'data-reconcile':520};
  const q = (root, part) => root.querySelector('[data-part="'+part+'"]');
  function reduced(root, explicit) {
    return explicit === true || root.closest('[data-mimo-motion="reduced"]') !== null || (global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  function play(root, id, options={}) {
    if (!(root instanceof Element)) throw new TypeError('A root Element is required.');
    if (!Object.hasOwn(durations,id)) throw new RangeError('Unknown motion resource: '+id);
    if (current.has(root)) current.get(root).cancel();
    const total = Math.max(1, Math.min(5000, Number(options.duration)||durations[id]));
    const requestedAmplitude = Number(options.amplitude);
    const amp = Number.isFinite(requestedAmplitude) ? Math.max(0, Math.min(2, requestedAmplitude)) : 1;
    const dir = options.direction === 'reverse' ? -1 : 1;
    const animations=[];
    function add(part, keyframes, start=0, end=1, easing=ease) {
      const element=q(root,part); if(!element) return;
      const a=element.animate(keyframes,{duration:total*(end-start),delay:total*start,fill:'both',easing});
      a.pause(); a.currentTime=0; animations.push(a);
    }
    switch(id){
      case 'index-trace':
        add('rule',[{transform:'scaleX(0)'},{transform:'scaleX(1)'}],0,.8);
        add('index',[{transform:`translateX(${-12*amp*dir}px)`,opacity:.3},{transform:'translateX(0)',opacity:1}],.08,.72);break;
      case 'type-unfold':
        add('headline',[{clipPath:'inset(0 100% 0 0)',transform:`translateY(${14*amp}px)`},{clipPath:'inset(0 0% 0 0)',transform:'translateY(0)'}],0,1);break;
      case 'evidence-flow':
        add('trace',[{strokeDashoffset:'1'},{strokeDashoffset:'0'}],0,.86,'linear');
        ['node1','node2','node3'].forEach((p,i)=>add(p,[{transform:'scale(.72)',opacity:.2},{transform:'scale(1)',opacity:1}],i*.28,Math.min(1,i*.28+.30)));break;
      case 'focus-aperture':
        add('aperture',[{clipPath:'circle(10% at 50% 50%)'},{clipPath:'circle(75% at 50% 50%)'}]);break;
      case 'quiet-reframe':
        add('reframe',[{transform:`translateX(${-38*amp*dir}px) scale(.84)`,borderRadius:'12px'},{transform:'translateX(0) scale(1)',borderRadius:'4px'}]);
        add('context',[{transform:`translateX(${28*amp*dir}px)`},{transform:'translateX(0)'}]);break;
      case 'directional-hint':
        add('arrow',[{transform:'translateX(0)'},{transform:`translateX(${5*amp*dir}px)`}]);break;
      case 'surface-resolve':
        add('surface',[{transform:`translateY(${8*amp}px) scale(.97)`,opacity:0},{transform:'translateY(0) scale(1)',opacity:1}]);break;
      case 'command-confirm':
        add('check',[{strokeDashoffset:'1'},{strokeDashoffset:'0'}],0,.82,'linear');
        add('confirmation',[{transform:`translateY(${6*amp}px)`,opacity:0},{transform:'translateY(0)',opacity:1}],.12,1);break;
      case 'state-relay':
        add('progress',[{transform:'scaleX(0)'},{transform:'scaleX(1)'}],0,1,'linear');
        ['state1','state2','state3'].forEach((p,i)=>add(p,[{opacity:.35},{opacity:1}],i*.3,Math.min(1,i*.3+.25)));break;
      case 'data-reconcile':
        ['bar1','bar2','bar3'].forEach((p,i)=>add(p,[{transform:'scaleX(.35)'},{transform:'scaleX(1)'}],i*.1,Math.min(1,.7+i*.1)));break;
    }
    let t=0, playing=false, last=0, raf=0, disposed=false;
    const emit=()=>{if(typeof options.onUpdate==='function') options.onUpdate({progress:t/total,playing,duration:total,id});};
    const apply=()=>{animations.forEach(a=>a.currentTime=t); emit();};
    function frame(now){if(disposed||!playing)return; if(last)t=Math.min(total,t+now-last);last=now;
      if(t>=total){t=total;playing=false;} apply(); if(playing)raf=requestAnimationFrame(frame);}
    const controller={id,duration:total,get progress(){return t/total;},get playing(){return playing;},
      play(){if(disposed)return; if(reduced(root,options.reduced)){controller.finish();return;} if(t>=total)t=0; playing=true;last=0;cancelAnimationFrame(raf);raf=requestAnimationFrame(frame);emit();},
      pause(){playing=false;last=0;cancelAnimationFrame(raf);emit();},
      seek(value){if(disposed)return;controller.pause();t=Math.max(0,Math.min(1,Number(value)||0))*total;apply();},
      reset(){controller.seek(0);if(reduced(root,options.reduced))controller.finish();},
      finish(){controller.pause();t=total;apply();},
      cancel(){if(disposed)return;disposed=true;playing=false;cancelAnimationFrame(raf);animations.forEach(a=>a.cancel());if(current.get(root)===controller)current.delete(root);}
    };
    current.set(root,controller);
    apply();
    if(reduced(root,options.reduced))controller.finish();else if(options.autoplay!==false)controller.play();
    return controller;
  }
  global.MimoMotion={version:'2.0.0',play,ids:Object.freeze(Object.keys(durations)),isReduced:reduced,cancel(root){current.get(root)?.cancel();}};
})(typeof window!=='undefined'?window:globalThis);
