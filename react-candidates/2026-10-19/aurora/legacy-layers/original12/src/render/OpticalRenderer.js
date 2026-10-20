import { vertex, fragment } from './shaders.js';
/** Owns all GPU resources and the only render loop. React updates values, never remounts inputs. */
export class OpticalRenderer {
  constructor(canvas, onStatus) {
    this.canvas=canvas;this.onStatus=onStatus;this.time=0;this.frame=0;this.props=null;this.inView=true;this.dead=false;this.last=0;this.frames=0;
    this.loss=e=>{e.preventDefault();this.stop();this.onStatus('lost');};
    this.restore=()=>{this.setup();this.update(this.props);};
    this.visibility=()=>this.schedule();
    canvas.addEventListener('webglcontextlost',this.loss);canvas.addEventListener('webglcontextrestored',this.restore);
    document.addEventListener('visibilitychange',this.visibility);
    this.resizeObserver=new ResizeObserver(()=>{this.resize();this.schedule();});this.resizeObserver.observe(canvas);
    this.intersection=new IntersectionObserver(entries=>{this.inView=entries[0].isIntersecting;this.schedule();},{threshold:0});this.intersection.observe(canvas);
    this.setup();
  }
  setup(){
    try{
      const gl=this.canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power',preserveDrawingBuffer:false});
      if(!gl)throw new Error('WebGL unavailable');this.gl=gl;
      const compile=(type,text)=>{const s=gl.createShader(type);gl.shaderSource(s,text);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){gl.deleteShader(s);throw new Error('Shader compile failed');}return s;};
      const vs=compile(gl.VERTEX_SHADER,vertex),fs=compile(gl.FRAGMENT_SHADER,fragment);const program=gl.createProgram();
      gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);
      if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('Shader link failed');
      this.program=program;gl.useProgram(program);this.buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
      const at=gl.getAttribLocation(program,'aPosition');gl.enableVertexAttribArray(at);gl.vertexAttribPointer(at,2,gl.FLOAT,false,0,0);
      this.uniforms={};['Resolution','Time','Ior','Frost','Dispersion','Energy','Preset','Lens'].forEach(k=>this.uniforms[k]=gl.getUniformLocation(program,'u'+k));
      this.onStatus('webgl');this.resize();
    }catch(_){this.gl=null;this.onStatus('fallback');}
  }
  resize(){if(!this.gl)return;const r=this.canvas.getBoundingClientRect();const ratio=this.props?.quality === 'economy' ? 0.65 : Math.min(window.devicePixelRatio||1,1.25);const w=Math.max(1,Math.round(r.width*ratio)),h=Math.max(1,Math.round(r.height*ratio));if(this.canvas.width!==w||this.canvas.height!==h){this.canvas.width=w;this.canvas.height=h;this.gl.viewport(0,0,w,h);}}
  update(props){this.props=props;this.resize();this.schedule();}
  active(){return !this.dead && this.gl && !this.gl.isContextLost() && this.props && this.props.motion && !this.props.reduced && this.inView && !document.hidden;}
  stop(){if(this.frame)cancelAnimationFrame(this.frame);this.frame=0;this.last=0;}
  schedule(){this.stop();if(this.dead||!this.props||!this.gl||this.gl.isContextLost())return;this.draw();if(this.active())this.frame=requestAnimationFrame(t=>this.tick(t));}
  tick(t){if(!this.active()){this.stop();return;}if(!this.last)this.last=t;const dt=t-this.last;if(dt>=1000/30){this.time+=Math.min(dt,80)/1000;this.last=t;this.draw();}this.frame=requestAnimationFrame(t=>this.tick(t));}
  draw(){const gl=this.gl,p=this.props,u=this.uniforms;if(!gl||!p||gl.isContextLost())return;gl.useProgram(this.program);gl.uniform2f(u.Resolution,this.canvas.width,this.canvas.height);gl.uniform1f(u.Time,this.time);gl.uniform1f(u.Ior,p.ior);gl.uniform1f(u.Frost,p.frost/80);gl.uniform1f(u.Dispersion,p.dispersion/100);gl.uniform1f(u.Energy,p.energy/100);gl.uniform1f(u.Preset,{violet:0,cyan:1,blue:2}[p.preset]||0);gl.uniform2f(u.Lens,p.x/100,p.y/100);gl.drawArrays(gl.TRIANGLES,0,6);this.frames++;this.canvas.dataset.frames=String(this.frames);this.canvas.dataset.time=this.time.toFixed(3);}
  destroy(){this.dead=true;this.stop();this.resizeObserver.disconnect();this.intersection.disconnect();document.removeEventListener('visibilitychange',this.visibility);this.canvas.removeEventListener('webglcontextlost',this.loss);this.canvas.removeEventListener('webglcontextrestored',this.restore);if(this.gl){this.gl.deleteBuffer(this.buffer);this.gl.deleteProgram(this.program);}this.onStatus=()=>{};}
}
