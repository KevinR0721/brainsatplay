var F=Object.defineProperty;var k=(c,s,l)=>(typeof s!="symbol"&&(s+=""),s in c?F(c,s,{enumerable:!0,configurable:!0,writable:!0,value:l}):c[s]=l);import{brainsatplay as B}from"../../brainsatplay.js";import{DOMFragment as I}from"../../frontend/utils/DOMFragment.js";import*as e from"../../../../_snowpack/pkg/three.js";import{OrbitControls as N}from"../../../../_snowpack/pkg/three/examples/jsm/controls/OrbitControls.js";import"../../../../_snowpack/pkg/three/examples/jsm/libs/stats.module.js";import D from"./shaders/enso/vertex.js";import U from"./shaders/enso/fragment.js";import{EffectComposer as O}from"../../../../_snowpack/pkg/three/examples/jsm/postprocessing/EffectComposer.js";import{RenderPass as q}from"../../../../_snowpack/pkg/three/examples/jsm/postprocessing/RenderPass.js";import"../../../../_snowpack/pkg/three/examples/jsm/postprocessing/ShaderPass.js";import{SMAAPass as $}from"../../../../_snowpack/pkg/three/examples/jsm/postprocessing/SMAAPass.js";import"../../../../_snowpack/pkg/three/examples/jsm/shaders/RGBShiftShader.js";import{UnrealBloomPass as V}from"../../../../_snowpack/pkg/three/examples/jsm/postprocessing/UnrealBloomPass.js";import{gsap as X}from"../../../../_snowpack/pkg/gsap.js";import"../../../../_snowpack/pkg/three/examples/jsm/libs/dat.gui.module.js";import J from"./img/dummyTexture.jpeg.proxy.js";export class EnsoApplet{constructor(s=document.body,l=new B,p=[]){this.parentNode=s,this.settings=p,this.bci=l,this.AppletHTML=null,this.props={id:String(Math.floor(Math.random()*1e6))}}init(){let s=(t=this.props)=>`
            <div id='${t.id}' class="enso-wrapper" style='height:${t.height}; width:${t.width};'>
                <div id="enso-renderer-container"><canvas class="enso-webgl"></canvas></div>
                <div class="enso-gui-container"></div>
            </div>
            `,l=(t=this.props)=>{document.getElementById(t.id)};this.AppletHTML=new I(s,this.parentNode,this.props,l,void 0,"NEVER"),this.settings.length>0&&this.configure(this.settings);const p=new e.LoadingManager(()=>{X.delayedCall(.1,()=>{u.style.opacity="1",this.resizeEnso()})},(t,d,w)=>{});new e.TextureLoader(p).load(J);const r=document.getElementById(this.props.id);let u=document.querySelector("canvas.enso-webgl");const y=new e.Scene;let b=100;const n=new e.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.01,1e3);n.position.z=b*2;const i=new e.WebGLRenderer({canvas:u,alpha:!0});let L=1200,T=600;const Q=400,j=L/T;let S=n.position.z*n.getFilmHeight()/n.getFocalLength(),f=(S-1)*n.aspect,C=f/j;i.setSize(r.clientWidth,r.clientHeight),i.setPixelRatio(Math.min(window.devicePixelRatio,2)),document.getElementById("enso-renderer-container").appendChild(i.domElement),u=document.querySelector("canvas.enso-webgl");let P=null;i.getPixelRatio()===1&&i.capabilities.isWebGL2?P=e.WebGLMultisampleRenderTarget:P=e.WebGLRenderTarget;const E=new P(window.innerWidth,window.innerHeight,{minFilter:e.LinearFilter,maxFilter:e.LinearFilter,format:e.RGBAFormat,encoding:e.sRGBEncoding,type:e.HalfFloatType}),a=new O(i,E);a.setPixelRatio(Math.min(window.devicePixelRatio,2)),a.setSize(r.clientWidth,r.clientHeight);const H=new q(y,n);a.addPass(H);const v=new V;if(v.enabled=!0,v.radius=1,a.addPass(v),i.getPixelRatio()===1&&!i.capabilities.isWebGL2){const t=new $;a.addPass(t),console.log("Using SMAA")}const h=new N(n,i.domElement);h.screenSpacePanning=!0,h.enableDamping=!0,h.enabled=!1;const R=()=>new e.TorusGeometry(b,3,10,100),W=R();let G=Date.now();var o=new function(){this.rPower=0,this.gPower=.85,this.bPower=1,this.alpha=1,this.noiseIntensity=.5,this.updateColor=function(){m.uniforms.uColor.value=[o.rPower,o.gPower,o.bPower,o.alpha]},this.updateNoise=function(){m.uniforms.uNoiseIntensity.value=o.noiseIntensity}};const m=new e.ShaderMaterial({vertexShader:D,fragmentShader:U,uniforms:{uTime:{value:0},aspectRatio:{value:window.innerWidth/window.innerHeight},uColor:{value:[o.rPower,o.gPower,o.bPower,o.alpha]},uNoiseIntensity:{value:o.noiseIntensity}}}),x=new e.Mesh(W,m);y.add(x),this.resizeEnso=()=>{n.aspect=window.innerWidth/window.innerHeight,n.updateProjectionMatrix(),f=(S-1)*n.aspect,C=f/j,A(),i.setSize(r.clientWidth,r.clientHeight),i.setPixelRatio(Math.min(window.devicePixelRatio,2)),a.setPixelRatio(Math.min(window.devicePixelRatio,2)),a.setSize(r.clientWidth,r.clientHeight)},window.addEventListener("resize",this.resizeEnso,!1);function A(){let t=R();x.geometry.dispose(),x.geometry=t}const _=(t="alpha1")=>{let d=null;if(this.bci.atlas.settings.coherence){let w=this.bci.atlas.data.coherence[0].means[t];w.length>0&&(d=1e3*w[w.length-1])}return d!=null?d:.5+Math.sin(Date.now()/1e4)/2};let z=.01,g=1;var M=()=>{setTimeout(function(){requestAnimationFrame(M)},1e3/60),m.uniforms.uTime.value=Date.now()-G;let d=_()-g;g=g+z*d,m.uniforms.uNoiseIntensity.value=1-g,h.update(),a.render()};M()}deinit(){this.AppletHTML.deleteNode()}responsive(){this.resizeEnso()}configure(s=[]){s.forEach((l,p)=>{})}}k(EnsoApplet,"devices",["eeg"]);
