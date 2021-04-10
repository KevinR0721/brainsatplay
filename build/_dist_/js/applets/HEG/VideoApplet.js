var r=Object.defineProperty;var l=(a,t,i)=>(typeof t!="symbol"&&(t+=""),t in a?r(a,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):a[t]=i);import{brainsatplay as v}from"../../brainsatplay.js";import{DOMFragment as g}from"../../frontend/utils/DOMFragment.js";export class VideoApplet{constructor(t=document.body,i=new v,e=[]){l(this,"startVideo",()=>{this.playRate<.1?this.vidQuery.playbackRate=0:this.vidQuery.playbackRate=this.playRate});l(this,"stopVideo",()=>{this.vidQuery.playbackRate=0});l(this,"animateRect",()=>{if(this.sliderfocus==!1&&(this.timeSlider.value=Math.floor(1e3*this.vidQuery.currentTime/this.vidQuery.duration)),this.bci.atlas.settings.heg){let t=this.bci.atlas.data.heg[0].count,i=40;t<i&&(i=t);let e=this.bci.atlas.data.heg[0].ratio.slice(t-i),s=this.bci.atlas.data.heg[0].ratio[t-1]-this.mean(e);this.onData(s)}this.gl.clearColor(0,0,.1,this.alpha),this.gl.clear(this.gl.COLOR_BUFFER_BIT),setTimeout(()=>{this.animationId=requestAnimationFrame(this.animateRect)},15)});this.bci=i,this.parentNode=t,this.settings=e,this.AppletHTML=null,this.props={id:String(Math.floor(Math.random()*1e6))},this.playRate=1,this.alpha=0,this.volume=.5,this.useAlpha=!0,this.useRate=!0,this.useVol=!0,this.useTime=!1,this.ampScore=0,this.ampThreshold=0,this.diff=0,this.enableControls=!1,this.animationId=null,this.vidQuery,this.c,this.gl,this.sliderfocus=!1,this.hidden=!1}init(){let t=(e=this.props)=>`
            <div id="`+e.id+`">
                <div id="`+e.id+`menu" style='position:absolute; z-index:2;'>
                    <input id="`+e.id+`fs" type="file" accept="video/*"/>
                    <div id="`+e.id+'timeDiv"><input id="'+e.id+`timeSlider" type="range" min="0" max="1000" value="0"><br><br> 
                    <div id="`+e.id+'vidbar"><button id="'+e.id+'minus1min">--</button><button id="'+e.id+'minus10sec">-</button><button id="'+e.id+'play">||</button><button id="'+e.id+'plus10sec">+</button><button id="'+e.id+`plus1min">++</button></div></div> 
                    <div id="`+e.id+`vidbuttons">
                        <table> 
                                <tr><td>Feedback:</td></tr> 
                                <tr><td><button id="`+e.id+`useAlpha">Fade</button></td></tr> 
                                <tr><td><button id="`+e.id+`useRate">Speed</button></td></tr> 
                                <tr><td><button id="`+e.id+`useVol">Volume</button></td></tr> 
                                <tr><td><button id="`+e.id+`useTime">Time</button></td></tr> 
                        </table>
                    </div> 
                </div>
                <button id="`+e.id+`showhide" style='float:right;' >Hide UI</button> 
                <video id="`+e.id+`video" src="https://vjs.zencdn.net/v/oceans.mp4" style="z-index:1;" type="video/mp4" height=100% width=100% autoplay loop muted></video> 
                <canvas id="`+e.id+`canvas"></canvas>
            </div> 
          `,i=(e=this.props)=>{this.vidQuery=document.getElementById(this.props.id+"video"),this.c=document.getElementById(this.props.id+"canvas"),this.gl=this.c.getContext("webgl"),this.timeSlider=document.getElementById(e.id+"timeSlider"),document.getElementById(e.id+"play").onclick=()=>{this.vidQuery.playbackRate==0?(this.useRate==!0?this.vidQuery.playbackRate=this.playRate:(this.playRate=1,this.vidQuery.playbackRate=1),document.getElementById(e.id+"play").innerHTML="||"):(this.vidQuery.playbackRate=0,document.getElementById(e.id+"play").innerHTML=">")},document.getElementById(e.id+"useAlpha").onclick=()=>{this.useAlpha==!0?(this.useAlpha=!1,this.alpha=0,document.getElementById(e.id+"useAlpha").style.opacity="0.3"):(this.useAlpha=!0,document.getElementById(e.id+"useAlpha").style.opacity="1.0")},document.getElementById(e.id+"useRate").onclick=()=>{this.useRate==!0?(this.useRate=!1,this.playRate=1,this.vidQuery.playbackRate=1,document.getElementById(e.id+"useRate").style.opacity="0.3"):(this.useTime=!1,this.useRate=!0,this.playRate=1,this.vidQuery.playbackRate=1,document.getElementById(e.id+"useRate").style.opacity="1.0",document.getElementById(e.id+"useTime").style.opacity="0.3")},document.getElementById(e.id+"useVol").onclick=()=>{this.useVol==!0?(this.vidQuery.muted=!0,this.useVol=!1,this.volume=0,this.vidQuery.volume=0,document.getElementById(e.id+"useVol").style.opacity="0.3"):(this.useVol=!0,this.vidQuery.muted=!1,this.volume=.5,this.vidQuery.volume=.5,document.getElementById(e.id+"useVol").style.opacity="1.0")},document.getElementById(e.id+"useTime").onclick=()=>{this.useTime==!0?(this.useTime=!1,this.playRate=1,this.vidQuery.playbackRate=1,document.getElementById(e.id+"useTime").style.opacity="0.3"):(this.useRate=!1,this.useTime=!0,this.playRate=0,this.vidQuery.playbackRate=0,document.getElementById(e.id+"useRate").style.opacity="0.3",document.getElementById(e.id+"useTime").style.opacity="1.0")},this.timeSlider.addEventListener("change",()=>{var s=this.vidQuery.duration*(this.timeSlider.value/1e3);this.vidQuery.currentTime=s}),this.timeSlider.onmousedown=()=>{this.sliderfocus=!0},this.timeSlider.ontouchstart=()=>{this.sliderfocus=!0},this.timeSlider.onchange=()=>{this.sliderfocus=!1},document.getElementById(e.id+"minus1min").onclick=()=>{this.vidQuery.currentTime-=60},document.getElementById(e.id+"plus1min").onclick=()=>{this.vidQuery.currentTime+=60},document.getElementById(e.id+"minus10sec").onclick=()=>{this.vidQuery.currentTime-=10},document.getElementById(e.id+"plus10sec").onclick=()=>{this.vidQuery.currentTime+=10},document.getElementById(e.id+"showhide").onclick=()=>{this.hidden==!1?(this.hidden=!0,document.getElementById(e.id+"showhide").innerHTML="Show UI",document.getElementById(e.id+"vidbuttons").style.display="none",document.getElementById(e.id+"timeDiv").style.display="none",document.getElementById(e.id+"fs").style.display="none"):(this.hidden=!1,document.getElementById(e.id+"showhide").innerHTML="Hide UI",document.getElementById(e.id+"vidbuttons").style.display="",document.getElementById(e.id+"timeDiv").style.display="",document.getElementById(e.id+"fs").style.display="")}};this.AppletHTML=new g(t,this.parentNode,this.props,i,void 0,"NEVER"),this.settings.length>0&&this.configure(this.settings),this.initVideo()}deinit(){this.stopVideo(),cancelAnimationFrame(this.animationId),this.AppletHTML.deleteNode()}responsive(){this.vidQuery.width=this.AppletHTML.node.clientWidth,this.vidQuery.height=this.AppletHTML.node.clientHeight,this.c.width=this.AppletHTML.node.clientWidth,this.c.height=this.AppletHTML.node.clientHeight}configure(t=[]){t.forEach((i,e)=>{})}localFileVideoPlayer(){"use strict";var t=window.URL||window.webkitURL,i=function(u,h){var d=document.querySelector("#message");d.innerHTML=u,d.className=h?"error":"info"},e=function(u){var h=this.files[0],d=h.type,y=document.getElementById(this.props.id+"video"),n=y.canPlayType(d);n===""&&(n="no");var o='Can play type "'+d+'": '+n,m=n==="no";if(i(o,m),!m){var c=t.createObjectURL(h);y.src=c}},s=document.getElementById(this.props.id+"fs");s.addEventListener("change",e,!1)}onData(t){this.useAlpha==!0&&(this.alpha<.8||t>0)&&(this.alpha>0||t<0)&&(this.alpha-t<0?this.alpha=0:this.alpha-t>.8?this.alpha=.8:this.alpha-=t),this.useRate==!0&&(this.vidQuery.playbackRate<3||t<0)&&(this.vidQuery.playbackRate>0||t>0)&&(this.playRate=this.vidQuery.playbackRate+t*.5,this.playRate<.05&&this.playRate>0?this.vidQuery.playbackRate=0:this.playRate<0?this.vidQuery.currentTime+=t:this.playRate>.05&&this.playRate<.1?this.vidQuery.playbackRate=.1:this.vidQuery.playbackRate=this.playRate),this.useVol==!0&&(this.vidQuery.volume<1||t<0)&&(this.vidQuery.volume>0||t>0)&&(this.volume=this.vidQuery.volume+t*.5,this.volume<0?this.vidQuery.volume=0:this.volume>1?this.vidQuery.volume=1:this.vidQuery.volume=this.volume),this.useTime==!0&&(this.vidQuery.currentTime+=t*10)}initVideo(){this.useVol==!0&&(this.vidQuery.muted=!1,this.vidQuery.volume=.5,this.volume=.5),this.c.width=this.vidQuery.width,this.c.height=this.vidQuery.height;var t=this.vidQuery.getBoundingClientRect();this.c.style.top=t.top+"px",this.c.style.height=t.bottom-t.top+"px",this.gl.clearColor(0,0,.1,0),this.gl.clear(this.gl.COLOR_BUFFER_BIT),this.animateRect()}}l(VideoApplet,"devices",["heg"]);
