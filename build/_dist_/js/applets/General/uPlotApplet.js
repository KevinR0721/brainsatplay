var b=Object.defineProperty;var y=(D,n,l)=>(typeof n!="symbol"&&(n+=""),n in D?b(D,n,{enumerable:!0,configurable:!0,writable:!0,value:l}):D[n]=l);import{brainsatplay as C}from"../../brainsatplay.js";import{DOMFragment as x}from"../../frontend/utils/DOMFragment.js";import{uPlotMaker as I}from"../../bciutils/visuals/eegvisuals.js";import{eegmath as v}from"../../bciutils/eegmath.js";import{genBandviewSelect as B,addChannelOptions as T,addCoherenceOptions as E}from"../../frontend/menus/selectTemplates.js";document.head.insertAdjacentHTML("beforeend",'<link rel="stylesheet" href="./_dist_/styles/css/uPlot.min.css" />');export class uPlotApplet{constructor(n=document.body,l=new C,t=[]){y(this,"setPlotDims",()=>{this.plotWidth=this.AppletHTML.node.clientWidth,this.plotHeight=this.AppletHTML.node.clientHeight});y(this,"updateLoop",()=>{this.looping===!0&&(this.onUpdate(),setTimeout(()=>{this.loop=requestAnimationFrame(this.updateLoop)},16))});y(this,"onUpdate",()=>{var n=document.getElementById(this.props.id+"mode").value,l=document.getElementById(this.props.id+"channel").value;let t=null,s=this.bci.atlas,e;if(l!=="All"&&(t=parseInt(l)),s.settings.heg&&n==="HEG"){let c=this.xrange*1e3,d=s.data.heg[0],i=0;if(d.count>2){for(let a=d.count-2;a>0;a--)if(d.times[d.count-1]-d.times[a]>c){i=a;break}this.class.uPlotData=[d.times.slice(i),d.red.slice(i),d.ir.slice(i),d.ratio.slice(i)],d.ambient.length>0&&this.class.uPlotData.push(d.ambient.slice(i))}}else if(s.settings.eeg){if(e=s.getDeviceDataByTag("eeg",s.data.eegshared.eegChannelTags[0].ch),e.fftCount>0){if(n==="FFT")this.class.uPlotData=[[...s.data.eegshared.frequencies]],s.data.eegshared.eegChannelTags.forEach((c,d)=>{c.analyze===!0&&c.tag!=="other"&&c.tag!==null&&(l==="All"||c.ch===t)&&s.data.eeg.find((i,a)=>{(i.tag===c.tag||i.tag===c.ch)&&this.class.uPlotData.push(i.ffts[i.fftCount-1])})});else if(n==="Coherence")l==="All"?(this.class.uPlotData=[[...s.data.eegshared.frequencies]],s.data.coherence.forEach((c,d)=>{this.class.uPlotData.push(c.ffts[c.fftCount-1])})):s.data.coherence.find((c,d)=>{if(c.tag===l)return this.class.uPlotData=[[...s.data.eegshared.frequencies],c.ffts[c.fftCount-1]],!0});else if(n==="CoherenceTimeSeries"){var r=document.getElementById(this.props.id+"bandview").value,u=s.data.coherence[0].fftCount;this.class.uPlotData[0][this.class.uPlotData[0].length-1]-this.class.uPlotData[0][0]>=this.xrange*1e3&&this.class.uPlotData[0].shift(),this.class.uPlotData[0].push(s.data.coherence[0].fftTimes[u-1]),s.data.coherence.forEach((c,d)=>{l==="All"?(this.class.uPlotData[d+1].push(v.sma(c.means[r].slice(u-20,s.data.coherence[0].count),20)[19]),this.class.uPlotData[d+1].length>this.class.uPlotData[0].length&&this.class.uPlotData[d+1].shift()):c.tag===l&&(this.class.uPlotData[d+1].push(v.sma(c.means[r].slice(u-20,s.data.coherence[0].count),20)[19]),this.class.uPlotData[d+1].length>this.class.uPlotData[0].length&&this.class.uPlotData[d+1].shift())})}}if(n==="TimeSeries"||n==="Stacked"){var g=Math.floor(s.data.eegshared.sps*this.xrange);if(g>e.count&&(g=e.count-1),n==="TimeSeries"){var g=Math.floor(s.data.eegshared.sps*this.xrange);g>e.count&&(g=e.count-1),this.class.uPlotData=[e.times.slice(e.count-g,e.count)],s.data.eegshared.eegChannelTags.forEach((d,i)=>{s.data.eeg.find((a,o)=>{(a.tag==d.tag||a.tag===a.ch)&&(a.filtered.length>0?this.class.uPlotData.push(a.filtered.slice(a.count-g)):this.class.uPlotData.push(a.raw.slice(a.count-g)))})})}else if(n==="Stacked"){if(e.count>0){var g=Math.floor(s.data.eegshared.sps*this.xrange);g>e.count&&(g=e.count-1),this.class.uPlotData=[e.times.slice(e.count-g,e.count)],s.data.eegshared.eegChannelTags.forEach((d,i)=>{s.data.eeg.find((a,o)=>{(a.tag===d.tag||a.tag===d.ch)&&(a.filtered.length>0?this.class.uPlotData.push(a.filtered.slice(a.filtered.length-g,a.filtered.length)):this.class.uPlotData.push(a.raw.slice(a.count-g,a.count)))})})}else this.class.uPlotData=[[...s.data.eegshared.frequencies]],s.data.eegshared.eegChannelTags.forEach((c,d)=>{this.class.uPlotData.push([...s.data.eegshared.frequencies])});this.yrange!==!0?this.class.updateStackedData(this.class.uPlotData):this.class.updateStackedData(this.class.uPlotData,!0)}}}n!=="Stacked"&&this.class.uPlotData.length>1&&this.class.plot.setData(this.class.uPlotData)});y(this,"setuPlot",()=>{let n=document.getElementById(this.props.id+"mode").value,l=document.getElementById(this.props.id+"channel").value,t=[{}],s=null,e=this.bci.atlas,r;if(l!=="All"&&(s=parseInt(l)),e.settings.heg&&n==="HEG"){document.getElementById(this.props.id+"title").innerHTML="HEG";let i=this.xrange*1e3,a=e.data.heg[0];console.log(a);let o=0;if(a.count>2){for(let m=a.count-2;m>0;m--)if(a.times[a.count-1]-a.times[m]>i){o=m;break}this.class.uPlotData=[a.times.slice(o),a.red.slice(o),a.ir.slice(o),a.ratio.slice(o)],a.ambient.length>0&&this.class.uPlotData.push(a.ambient.slice(o))}else{let m=new Array(100).fill(0).map((p,P)=>{p=P});this.class.uPlotData=[m,m,m,m,m]}let h=[{}];this.class.uPlotData.forEach((m,p)=>{p===0?h[0].label="t":p===1?h.push({label:"Red",value:(P,f)=>f==null?"-":f.toFixed(1),stroke:"rgb(155,0,0)"}):p===2?h.push({label:"IR",value:(P,f)=>f==null?"-":f.toFixed(1),stroke:"rgb(0,155,155)"}):p===3?h.push({label:"Ratio",value:(P,f)=>f==null?"-":f.toFixed(1),stroke:"rgb(0,0,0)"}):p===4&&h.push({label:"Ambient",value:(P,f)=>f==null?"-":f.toFixed(1),stroke:"rgb(0,0,0)"})}),this.class.makeuPlot(h,this.class.uPlotData,this.plotWidth,this.plotHeight,void 0,this.yrange),this.class.plot.axes[0].values=(m,p,P)=>p.map(f=>Math.floor((f-e.data.heg[0].startTime)*1666667e-11)+"m:"+((f-e.data.heg[0].startTime)*.001-60*Math.floor((f-e.data.heg[0].startTime)*1666667e-11)).toFixed(1)+"s")}else if(e.settings.eeg){if(r=e.getDeviceDataByTag("eeg",e.data.eegshared.eegChannelTags[0].ch),n==="TimeSeries"){if(document.getElementById(this.props.id+"title").innerHTML="ADC signals",r.count>0){var u=Math.floor(e.data.eegshared.sps*this.xrange);u>r.count&&(u=r.count-1),this.class.uPlotData=[r.times.slice(r.count-u,r.count)],e.data.eegshared.eegChannelTags.forEach((i,a)=>{(l==="All"||i.ch===s)&&e.data.eeg.find((o,h)=>{(o.tag==i.tag||o.tag===o.ch)&&(o.filtered.length>0?this.class.uPlotData.push(o.filtered.slice(o.count-u)):this.class.uPlotData.push(o.raw.slice(o.count-u)))})})}else this.class.uPlotData=[[...e.data.eegshared.frequencies]],e.data.eegshared.eegChannelTags.forEach((i,a)=>{(l==="All"||i.ch===parseInt(l))&&(this.class.uPlotData.push([...e.data.eegshared.frequencies]),console.log(this.class.uPlotData))});l!=="All"?t=this.class.makeSeriesFromChannelTags(e.data.eegshared.eegChannelTags,!1,s):t=this.class.makeSeriesFromChannelTags(e.data.eegshared.eegChannelTags,!1),t[0].label="t",this.class.makeuPlot(t,this.class.uPlotData,this.plotWidth,this.plotHeight,void 0,this.yrange),this.class.plot.axes[0].values=(i,a,o)=>a.map(h=>Math.floor((h-e.data.eegshared.startTime)*1666667e-11)+"m:"+((h-e.data.eegshared.startTime)*.001-60*Math.floor((h-e.data.eegshared.startTime)*1666667e-11)).toFixed(1)+"s")}else if(n==="FFT")document.getElementById(this.props.id+"title").innerHTML="Fast Fourier Transforms",this.class.uPlotData=[[...e.data.eegshared.frequencies]],r.fftCount>0?e.data.eegshared.eegChannelTags.forEach((i,a)=>{i.analyze===!0&&i.tag!=="other"&&i.tag!==null?(l==="All"||i.ch===s)&&e.data.eeg.find((o,h)=>{(o.tag===i.tag||o.tag===i.ch)&&this.class.uPlotData.push(o.ffts[o.fftCount-1])}):(l==="All"||i.ch===s)&&this.class.uPlotData.push([...e.data.eegshared.frequencies])}):e.data.eegshared.eegChannelTags.forEach((i,a)=>{(l==="All"||i.ch===s)&&this.class.uPlotData.push([...e.data.eegshared.frequencies])}),l!=="All"?t=this.class.makeSeriesFromChannelTags(e.data.eegshared.eegChannelTags,!0,s):t=this.class.makeSeriesFromChannelTags(e.data.eegshared.eegChannelTags,!0),t[0].label="Hz",this.class.makeuPlot(t,this.class.uPlotData,this.plotWidth,this.plotHeight,void 0,this.yrange);else if(n==="Stacked"){if(document.getElementById(this.props.id+"title").innerHTML="ADC signals Stacked",r.count>0){var u=Math.floor(e.data.eegshared.sps*this.xrange);u>r.count&&(u=r.count-1),this.class.uPlotData=[r.times.slice(r.count-u,r.count)],e.data.eegshared.eegChannelTags.forEach((a,o)=>{e.data.eeg.find((h,m)=>{(h.tag===a.tag||h.tag===a.ch)&&(h.filtered.length>0?this.class.uPlotData.push(h.filtered.slice(h.filtered.length-u,h.filtered.length)):this.class.uPlotData.push(h.raw.slice(h.count-u,h.count)))})})}else this.class.uPlotData=[[...e.data.eegshared.frequencies]],e.data.eegshared.eegChannelTags.forEach((i,a)=>{this.class.uPlotData.push([...e.data.eegshared.frequencies])});t[0].label="t",this.class.makeStackeduPlot(void 0,this.class.uPlotData,void 0,e.data.eegshared.eegChannelTags,this.plotWidth,this.plotHeight,this.yrange),this.class.plot.axes[0].values=(i,a,o)=>a.map(h=>Math.floor((h-e.data.eegshared.startTime)*1666667e-11)+"m:"+((h-e.data.eegshared.startTime)*.001-60*Math.floor((h-e.data.eegshared.startTime)*1666667e-11)).toFixed(1)+"s")}else if(n==="Coherence"){if(e.data.coherence.forEach((i,a)=>{(l==="All"||i.tag===l)&&t.push({label:i.tag,value:(o,h)=>h==null?"-":h.toFixed(1),stroke:"rgb("+Math.random()*255+","+Math.random()*255+","+Math.random()*255+")"})}),e.data.coherence[0].ffts.length>0)if(l==="All"){if(this.class.uPlotData=[[...e.data.eegshared.frequencies]],e.data.coherence.forEach((i,a)=>{this.class.uPlotData.push(i.ffts[i.fftCount-1])}),this.class.uPlotData.length<e.data.coherence.length+1)for(var g=this.class.uPlotData.length;g<e.data.coherence.length+1;g++)this.class.uPlotData.push(e.data.eegshared.frequencies)}else e.data.coherence.find((i,a)=>{if(i.tag===l)return this.class.uPlotData=[[...e.data.eegshared.frequencies],i.ffts[i.fftCount-1]],!0});else this.class.uPlotData=[[...e.data.eegshared.frequencies]],e.data.coherence.forEach((i,a)=>{(l==="All"||i.tag===l)&&this.class.uPlotData.push(e.data.eegshared.frequencies)});t[0].label="Hz",console.log(this.class.uPlotData),this.class.makeuPlot(t,this.class.uPlotData,this.plotWidth,this.plotHeight,void 0,this.yrange),document.getElementById(this.props.id+"title").innerHTML="Coherence from tagged signals"}else if(n==="CoherenceTimeSeries"){var c=document.getElementById(this.props.id+"bandview").value,d=e.data.coherence[0].count-1;if(d>1){for(;e.data.coherence[0].times[e.data.coherence[0].count-1]-e.data.coherence[0].times[d-1]<this.xrange*1e3&&d>0;)d-=1;this.class.uPlotData=[e.data.coherence[0].times.slice(d,e.data.coherence[0].count)],e.data.coherence.forEach((i,a)=>{(l==="All"||i.tag===l)&&(t.push({label:i.tag,value:(o,h)=>h==null?"-":h.toFixed(1),stroke:"rgb("+Math.random()*255+","+Math.random()*255+","+Math.random()*255+")"}),this.class.uPlotData.push(v.sma(i.means[c].slice(d,e.data.coherence[0].count),20)))}),t[0].label="t",this.class.makeuPlot(t,this.class.uPlotData,this.plotWidth,this.plotHeight,void 0,this.yrange)}document.getElementById(this.props.id+"title").innerHTML="Mean Coherence over time",this.class.plot.axes[0].values=(i,a,o)=>a.map(h=>Math.floor((h-e.data.eegshared.startTime)*1666667e-11)+"m:"+((h-e.data.eegshared.startTime)*.001-60*Math.floor((h-e.data.eegshared.startTime)*1666667e-11)).toFixed(1)+"s")}}this.setLegend(),this.looping!==!0&&(this.looping=!0,this.updateLoop())});y(this,"setLegend",()=>{document.getElementById(this.props.id+"legend").innerHTML="";let n="";this.class.plot.series.forEach((l,t)=>{t>0&&(n+="<div id='"+this.props.id+l.label+"' style='color:"+l.stroke+"; cursor:pointer;'>"+l.label+"</div>")}),document.getElementById(this.props.id+"legend").innerHTML=n,this.class.plot.series.forEach((l,t)=>{t>0&&(document.getElementById(this.props.id+l.label).onclick=()=>{this.class.plot.series[t].show===!0?(document.getElementById(this.props.id+l.label).style.opacity=.3,this.class.plot.setSeries(t,{show:!1})):(this.class.plot.setSeries(t,{show:!0}),document.getElementById(this.props.id+l.label).style.opacity=1)})})});this.bci=l,this.parentNode=n,this.settings=t,this.AppletHTML=null,this.props={id:String(Math.floor(Math.random()*1e6))},this.class=null,this.loop=null,this.looping=!1,this.xrange=10,this.yrange=!0,this.plotWidth=500,this.plotHeight=300}init(){let n=(t=this.props)=>`
            <div id='`+t.id+`'>    
                <div id='`+t.id+`menu' style='position:absolute; float:right; z-index:4;'>
                  <table style='position:absolute; transform:translateX(40px);'>
                    <tr>
                      <td>
                        Channel:
                        <select id="`+t.id+`channel" style='width:80px'></select>
                      </td> 
                      <td>  
                        Graph:
                        <select id='`+t.id+`mode' style='width:98px'>
                          <option value="FFT" selected="selected">FFTs</option>
                          <option value="Coherence">Coherence</option>
                          <option value="CoherenceTimeSeries">Mean Coherence</option>
                          <option value="TimeSeries">Raw</option>
                          <option value="Stacked">Stacked Raw</option>
                        </select>
                      </td>
                      <td id='`+t.id+`yrangetd' style='width:98px'>
                        Y scale <button id='`+t.id+"yrangeset' style='position:absolute; transform:translateX(21px); height:13px;'><div style='transform:translateY(-3px);'>Set</div></button><input type='text' id='"+t.id+`yrange' placeholder='0,100 or auto' style='width:90px'>
                      </td>
                      <td id='`+t.id+`xrangetd' style='width:98px'>
                        Time: <button id='`+t.id+"xrangeset' style='position:absolute; transform:translateX(30px); height:13px;'><div style='transform:translateY(-3px);'>Set</div></button><input type='text' id='"+t.id+`xrange' placeholder='10 (sec)' style='width:90px'>
                      </td>
                      
                    </tr>
                    <tr>
                    <td colSpan=2 style='display:table-row;' id='`+t.id+`legend'></td>
                      <td>
                      `+B(t.id+"bandview")+`
                      </td>
                      <td colSpan=2>
                        <div id='`+t.id+`title' style='font-weight:bold; width:200px;'>Fast Fourier Transforms</div>
                      </td>
                    </tr>
                  </table>
                </div>
                <div id='`+t.id+`canvas' style='z-index:3; position:absolute; background-color:white; min-height:100px; min-width:100px;'></div>
            </div>
            `,l=(t=this.props)=>{document.getElementById(t.id+"bandview").style.display="none",document.getElementById(t.id+"xrangetd").style.display="none",document.getElementById(t.id+"mode").onchange=()=>{let s=this.bci.atlas;this.yrange=!0,document.getElementById(t.id+"mode").value==="CoherenceTimeSeries"||document.getElementById(t.id+"mode").value==="Coherence"?E(t.id+"channel",s.data.coherence,!0,["All"]):document.getElementById(t.id+"mode").value==="TimeSeries"||document.getElementById(t.id+"mode").value==="Stacked"?T(t.id+"channel",s.data.eegshared.eegChannelTags,!1,["All"]):T(t.id+"channel",s.data.eegshared.eegChannelTags,!0,["All"]),document.getElementById(t.id+"mode").value==="CoherenceTimeSeries"?(document.getElementById(t.id+"xrangetd").style.display="",document.getElementById(t.id+"bandview").style.display=""):document.getElementById(t.id+"mode").value==="TimeSeries"?(document.getElementById(t.id+"xrangetd").style.display="",document.getElementById(t.id+"bandview").style.display="none"):(document.getElementById(t.id+"xrangetd").style.display="none",document.getElementById(t.id+"bandview").style.display="none"),this.setuPlot()},document.getElementById(t.id+"bandview").style.width="98px",document.getElementById(t.id+"bandview").onchange=()=>{document.getElementById(t.id+"mode").value==="CoherenceTimeSeries"&&this.setuPlot()},document.getElementById(t.id+"channel").onchange=()=>{this.setuPlot()},T(t.id+"channel",this.bci.atlas.data.eegshared.eegChannelTags,!0,["All"]),document.getElementById(t.id+"xrangeset").onclick=()=>{let s=parseInt(document.getElementById(t.id+"xrange").value);isNaN(s)||(s<1&&(s=1),s>300&&(s=300),this.xrange=s)},document.getElementById(t.id+"yrangeset").onclick=()=>{let s=document.getElementById(t.id+"yrange").value,e=s.split(",");if(e.length===2){let r=parseInt(e[0]),u=parseInt(e[1]);!isNaN(r)&&!isNaN(u)&&(this.yrange=[r,u],this.setuPlot())}else s==="auto"&&(this.yrange=!0,this.setuPlot())}};this.AppletHTML=new x(n,this.parentNode,this.props,l,void 0,"NEVER"),this.settings.length>0&&this.configure(this.settings),this.bci.atlas.data.eegshared.frequencies.length===0&&(this.bci.atlas.data.eegshared.frequencies=this.bci.atlas.bandpassWindow(0,this.bci.atlas.data.eegshared.sps)),this.setPlotDims(),this.class=new I(this.props.id+"canvas")}deinit(){this.stop(),this.class.deInit(),this.class=null,this.AppletHTML.deleteNode()}responsive(){let n=this.bci.atlas;if(this.bci.info.nDevices>0&&(n.settings.eeg&&(document.getElementById(this.props.id+"mode").value==="CoherenceTimeSeries"||document.getElementById(this.props.id+"mode").value==="Coherence"?E(this.props.id+"channel",n.data.coherence,!0,["All"]):document.getElementById(this.props.id+"mode").value==="TimeSeries"||document.getElementById(this.props.id+"mode").value==="Stacked"?T(this.props.id+"channel",n.data.eegshared.eegChannelTags,!1,["All"]):T(this.props.id+"channel",n.data.eegshared.eegChannelTags,!0,["All"])),n.settings.heg)){let s=[],e=document.getElementById(this.props.id+"mode");for(var l=0,t=e.options.length;l<t;l++)e.options[l].value&&s.push(e.options[l].value);s.indexOf("HEG")<0&&(e.innerHTML=`
              <option value="HEG" selected="selected">HEG</option>
              <option value="FFT">FFTs</option>
              <option value="Coherence">Coherence</option>
              <option value="CoherenceTimeSeries">Mean Coherence</option>
              <option value="TimeSeries">Raw</option>
              <option value="Stacked">Stacked Raw</option>
            `)}this.setPlotDims(),this.plotWidth===0||this.plotHeight===0?setTimeout(()=>{this.setPlotDims(),(this.plotWidth===0||this.plotHeight===0)&&(this.plotWidth=400,this.plotHeight=300),this.setuPlot(),this.looping||this.start()},100):(this.setuPlot(),this.looping||this.start())}configure(n=[]){n.forEach((l,t)=>{})}stop(){this.looping=!1,cancelAnimationFrame(this.loop)}start(){this.looping=!1,setTimeout(()=>{this.looping=!0,this.updateLoop()},100)}}y(uPlotApplet,"devices",["eeg","heg"]);
