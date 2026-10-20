// Original real-time optical illustration. No textures, fonts or movie frames.
// The MG reference informs the visual rules, not a physically calibrated lens model.
export const vertex = `attribute vec2 aPosition; void main(){gl_Position=vec4(aPosition,0.0,1.0);}`;
export const fragment = `
precision highp float;
uniform vec2 uResolution;
uniform float uTime,uIor,uFrost,uDispersion,uEnergy,uPreset;
uniform vec2 uLens;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
mat2 rotate(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
vec3 field(vec2 p){
  float t=uTime*.13;
  vec2 q=p;
  q.x+=.09*sin(q.y*4.+t);q.y+=.065*cos(q.x*4.-t*.7);
  vec3 a=vec3(.43,.20,.95),b=vec3(.09,.71,.82),c=vec3(.19,.22,.74);
  if(uPreset>.5 && uPreset<1.5){a=vec3(.19,.38,.88);b=vec3(.17,.85,.76);c=vec3(.12,.24,.66);}
  if(uPreset>1.5){a=vec3(.30,.20,.69);b=vec3(.40,.47,.87);c=vec3(.18,.17,.54);}
  float f1=exp(-dot(q-vec2(.29+.07*sin(t),.25),q-vec2(.29+.07*sin(t),.25))*5.8);
  float f2=exp(-dot(q-vec2(.83,.69+.07*cos(t)),q-vec2(.83,.69+.07*cos(t)))*7.5);
  float f3=exp(-dot(q-vec2(.85,.15),q-vec2(.85,.15))*5.0);
  vec3 col=vec3(.025,.021,.064)+(a*f1+b*f2+c*f3)*(.23+uEnergy*.75);
  float curve=.49+.07*sin(p.x*5.1+t)+.05*sin(p.x*2.3-t*.4);
  float curtain=exp(-pow((p.y-curve)/.12,2.));
  col+=mix(a,b,smoothstep(.2,.9,p.x))*curtain*.14;
  float thin=exp(-pow((p.y-curve)/.0022,2.));
  col+=vec3(.62,.82,.98)*thin*.23;
  // Behind-glass contour rings make the actual sampling displacement visible.
  vec2 ring=(p-vec2(.63,.47))*vec2(1.0,1.23);
  float r=length(ring);
  float ringLine=exp(-pow((r-.31)/.0012,2.))+.5*exp(-pow((r-.37)/.001,2.));
  col+=vec3(.67,.71,1.)*ringLine*.26;
  return col;
}
float sdf(vec2 p){vec2 q=abs(p)-vec2(.215,.279)+.076;return min(max(q.x,q.y),0.0)+length(max(q,0.0))-.076;}
vec3 blurred(vec2 p,float spread){return (field(p)*2.+field(p+vec2(spread,0.))+field(p-vec2(spread,0.))+field(p+vec2(0.,spread))+field(p-vec2(0.,spread)))/6.;}
void main(){
  vec2 uv=vec2(gl_FragCoord.x/uResolution.x,1.-gl_FragCoord.y/uResolution.y);
  float aspect=uResolution.x/uResolution.y;
  vec2 pos=(uv-uLens)*vec2(aspect,1.);
  vec2 local=rotate(.19)*pos;
  float d=sdf(local);
  vec3 base=field(uv);
  float shadow=1.-smoothstep(-.02,.105,sdf(rotate(.19)*(pos-vec2(.035,.045))));
  base*=1.-shadow*.48;
  float glow=exp(-abs(d)*14.);base+=vec3(.25,.26,.65)*glow*.04;
  if(d<.004){
    float e=.001;
    vec2 g=vec2(sdf(local+vec2(e,0.))-sdf(local-vec2(e,0.)),sdf(local+vec2(0.,e))-sdf(local-vec2(0.,e)))/(2.*e);
    vec2 outward=rotate(-.19)*g;
    float bevel=exp(-max(0.,-d)*28.);
    vec3 normal=normalize(vec3(outward*bevel*2.7,1.0));
    vec3 ray=refract(vec3(0.,0.,-1.),normal,1./uIor);
    vec2 shift=ray.xy*.14;shift.x/=aspect;
    vec2 sampleUV=uLens+(uv-uLens)/(1.+(uIor-1.)*.17)+shift;
    float chroma=uDispersion*.014*bevel;
    vec2 rgbShift=outward*chroma;
    vec3 col=vec3(blurred(sampleUV+rgbShift,uFrost*.026).r,blurred(sampleUV,uFrost*.026).g,blurred(sampleUV-rgbShift,uFrost*.026).b);
    col=mix(col,col*.72+vec3(.12,.10,.18),uFrost*.38);
    col+=vec3(.022,.025,.058);
    float fres=pow(1.-normal.z,2.);
    col+=vec3(.35,.39,.72)*fres*.75;
    float sk=pow(max(dot(reflect(normalize(vec3(-.5,-.7,-1.)),normal),vec3(0.,0.,1.)),0.),20.);
    col+=vec3(.80,.91,1.)*sk*.85;
    float inner=exp(-pow((d+.014)/.006,2.));col+=vec3(.45,.44,.87)*inner*.13;
    float facing=max(0.,dot(normalize(outward+vec2(.0001)),normalize(vec2(-.6,-.8))));
    float rim=exp(-pow((d+.001)/.0018,2.));
    col+=vec3(.73,.86,1.)*rim*(.18+.7*facing);
    col=mix(col,vec3(.96,.96,1.),exp(-pow((local.y+.14+local.x*.9)/.18,2.))*.06);
    base=mix(base,col,1.-smoothstep(-.001,.003,d));
  }
  float grain=(hash(gl_FragCoord.xy)-.5)/170.;
  float vignette=1.-.27*pow(length((uv-.5)*vec2(1.,.8)),1.5);
  gl_FragColor=vec4(max(base*vignette+grain,0.),1.);
}`;
