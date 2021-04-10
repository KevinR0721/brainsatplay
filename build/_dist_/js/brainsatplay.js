var p=Object.defineProperty;var u=(d,t,e)=>(typeof t!="symbol"&&(t+=""),t in d?p(d,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):d[t]=e);var h=(d,t,e)=>new Promise((s,i)=>{var n=r=>{try{l(e.next(r))}catch(a){i(a)}},o=r=>{try{l(e.throw(r))}catch(a){i(a)}},l=r=>r.done?s(r.value):Promise.resolve(r.value).then(n,o);l((e=e.apply(d,t)).next())});import"../../_snowpack/pkg/regenerator-runtime/runtime.js";import{StateManager as b}from"./frontend/utils/StateManager.js";import{DataAtlas as y}from"./bciutils/DataAtlas.js";import{eeg32Plugin as v}from"./bciutils/devicePlugins/freeeeg32Plugin.js";import{musePlugin as k}from"./bciutils/devicePlugins/musePlugin.js";import{hegduinoPlugin as S}from"./bciutils/devicePlugins/hegduinoPlugin.js";import{cytonPlugin as D}from"./bciutils/devicePlugins/cytonPlugin.js";import{webgazerPlugin as T}from"./bciutils/devicePlugins/webgazerPlugin.js";export class brainsatplay{constructor(t="",e="",s="",i="public",n="http://localhost:8000",o="http://127.0.0.1:8000"){u(this,"onconnected",()=>{});u(this,"ondisconnected",()=>{});u(this,"getDeviceData",(t="eeg",e="all",s=0)=>{this.devices.forEach((i,n)=>{if(console.log("get"),i.info.deviceType.indexOf(t)>-1&&i.info.deviceNum===s)return e==="all"?i.atlas.data[t]:i.atlas.getDeviceDataByTag(t,e)})});u(this,"subscribe",(t="eeg",e="FP1",s=null,i=n=>{})=>{let n,o=e,l=null;if(t.indexOf("eeg")>-1||t.indexOf("muse")>-1||t.indexOf("notion")>-1?(l="eeg",o==="shared"&&(o="eeghared")):t.indexOf("heg")>-1&&(l="heg",o==="shared"&&(o="hegshared")),l!==null){let r=this.devices.find((a,c)=>{if(a.info.deviceName.indexOf(t)>-1&&a.info.useAtlas===!0){let f;return o.indexOf("shared")>-1?f=a.atlas.getDeviceDataByTag(o,null):o===null||o==="all"?f=a.atlas.data[l]:f=a.atlas.getDeviceDataByTag(l,o),f!==void 0&&(s===null||Array.isArray(f)||typeof f[s]!="object"?n=this.state.addToState(o,f,i):typeof f[s]=="object"&&(n=this.state.addToState(o+"_"+s,f[s],i))),!0}})}return n});u(this,"unsubscribe",(t="FP1",e)=>{this.state.unsubscribe(t,e)});u(this,"unsubscribeAll",(t="FP1")=>{this.state.unsubscribeAll(t)});u(this,"makeGameBrowser",(t,e,s=n=>{},i=n=>{})=>{let n=Math.floor(Math.random()*1e6)+t,o="<div id='"+n+"'><button id='"+n+"search'>Search</button><table id='"+n+"browser'></table></div>";e.insertAdjacentHTML("afterbegin",o),document.getElementById(n+"search").onclick=()=>{this.getGames(t,l=>{let r="";l.gameInfo.forEach(a=>{r+="<tr><td>"+a.id+"</td><td>"+a.usernames.length+"</td><td><button id='"+a.id+"connect'>Connect</button>Spectate:<input id='"+n+"spectate' type='checkbox'></td></tr>"}),document.getElementById(n+"browser").insertAdjacentHTML("afterbegin",r),l.gameInfo.forEach(a=>{document.getElementById(a.id+"connect").onclick=()=>{this.subscribeToGame(a.id,document.getElementById(n+"spectate").checked,c=>{s(a),document.getElementById(n).insertAdjacentHTML("afterbegin","<button id='"+n+"disconnect'>Disconnect</button>"),document.getElementById(n+"disconnect").onclick=()=>{this.unsubscribeFromGame(a.id,()=>{i(a);let f=document.getElementById(n+"disconnect");f.parentNode.removeChild(f)})}})}})})}});u(this,"kickPlayerFromGame",(t,e,s=i=>{})=>{if(this.socket!==null&&this.socket.readyState===1){this.socket.send({cmd:["leaveGame",t,e],username:this.info.auth.username});let i=this.state.subscribe("commandResult",n=>{if(n.msg==="leftGame"&&n.appname===t){for(const o in this.state.data)o.indexOf(e)>-1&&(this.state.unsubscribeAll(o),this.state.data[o]=void 0);s(n),this.state.unsubscribe("commandResult",i)}})}});this.devices=[],this.state=new b({commandResult:{}}),this.atlas=new y("atlas",void 0,void 0,!0,!1),this.info={nDevices:0,auth:{url:new URL(n),username:t,password:e,access:i,appname:s.toLowerCase().split(" ").join("").replace(/^[^a-z]+|[^\w]+/gi,""),authenticated:!1},subscribed:!1,connections:[],localHostURL:o},this.socket=null}setLoginInfo(t="",e="",s="public",i=""){this.info.auth.username=t,this.info.auth.password=e,this.info.auth.access=s,this.info.auth.appname=i}connect(t="freeeeg32_2",e=["eegfft"],s=()=>{},i=()=>{},n=!1,o=[["eegch","FP1","all"]],l=!0,r=!0){if(n===!0&&(console.log(this.socket),this.socket==null||this.socket.readyState!==1))return console.error("Server connection not found, please run login() first"),!1;this.devices.length>0&&(t.indexOf("eeg")>-1||t.indexOf("muse")>-1)&&(this.devices.find((f,m)=>{if(f.deviceType==="eeg")return!0})||(r=this.devices[0].atlas)),this.devices.push(new O(t,e,l,r,n,this.socket,o,this.info.auth));let a=this.devices.length-1;this.devices[a].onconnect=()=>{this.info.nDevices++,s(),this.onconnected()},this.devices[a].ondisconnect=()=>{i(),this.ondisconnected(),Array.isArray(this.devices[a].info.analysis)&&this.devices[a].info.analysis.length>0&&(this.devices[a].info.analyzing=!1),this.devices[a].info.streaming=!1,this.devices.splice(a,1),this.info.nDevices--},this.devices[a].init(),this.devices.length===1&&(this.atlas=this.devices[0].atlas),this.state.addToState("device"+a,this.devices[a].info),this.devices[a].connect()}reconnect(t=this.devices.length-1,e=()=>{}){t>-1?(this.devices[t].connect(),e()):console.log("No devices connected")}disconnect(t=this.devices.length-1,e=()=>{}){t>-1?(this.devices[t].info.streaming=!1,this.devices[t].disconnect(),e()):console.log("No devices connected")}makeConnectOptions(t=document.body,e=()=>{},s=()=>{}){let i=Math.floor(Math.random()*1e4)+"devicemenu",n='<div><span style="font-size: 80%;">Device Selection</span><hr></div><div class="device-gallery">',o=["muse","freeeeg32_2","freeeeg32_19","hegduinousb","hegduinobt","cyton","cyton_daisy"];o.forEach((l,r)=>{n+=`
			<div id='brainsatplay-${l}' value='${l}' class='device-card'>
			${l}
			</div>`}),n+="</div>",t.insertAdjacentHTML("afterbegin",n),t.insertAdjacentHTML("beforeend","<button id='"+i+"disconnect'>Disconnect</button>"),o.forEach((l,r)=>{document.getElementById(`brainsatplay-${l}`).onclick=()=>{l==="muse"?this.connect("muse",["eegcoherence"],e,s):l==="freeeeg32_2"?this.connect("freeeeg32_2",["eegcoherence"],e,s):l==="freeeeg32_19"?this.connect("freeeeg32_19",["eegfft"],e,s):l==="hegduinousb"?this.connect("hegduinousb",[],e,s):l==="hegduinobt"?this.connect("hegduinobt",[],e,s):l==="hegduinowifi"?this.connect("hegduinowifi",[],e,s):l==="cyton"?this.connect("cyton",["eegfft"],e,s):l==="cyton_daisy"&&this.connect("cyton_daisy",["eegfft"],e,s)}}),document.getElementById(i+"disconnect").onclick=()=>{this.disconnect()}}beginStream(t=0,e=null){this.devices[t].info.streaming&&(this.devices[t].info.streaming=!0,e!==null&&(this.devices[t].info.streamParams=e),this.devices[t].streamLoop())}endStream(t=0){this.devices[t].info.streaming=!1}getDevice(t="freeeeg32_2",e=0){let s;return this.devices.find((i,n)=>{if(i.info.deviceName.indexOf(t)>-1&&i.info.deviceNum===e)return s=i,!0;if(i.info.deviceType.indexOf(t)>-1&&i.info.deviceNum===e)return s=i,!0}),s}addAnalysisMode(t=""){this.devices.length>0?this.atlas.settings.analysis.find((s,i)=>{if(t===s)return!0})===void 0&&(this.atlas.settings.analysis.push(t),this.atlas.settings.analyzing===!1&&(this.atlas.settings.analyzing=!0,this.atlas.analyzer())):console.error("no devices connected")}stopAnalysis(t=""){if(this.devices.length>0)if(t!==""&&typeof t=="string"){let e=this.atlas.settings.analysis.find((s,i)=>{if(t===s)return this.atlas.settings.analysis.splice(i,1),!0})}else this.atlas.settings.analyzing=!1;else console.error("no devices connected")}getStreamData(t="",e=null){let s={};for(const i in this.state.data)e===null?i.indexOf(t)>-1&&(s[i]=this.state.data[i]):i.indexOf(t)>-1&&i.indexOf(e)>-1&&(s[i]=this.state.data[i]);return s}addAnalysisMode(t="",e=this.state.data.device0.deviceName,s=0){let i=this.getDevice(e,s);i.info.analysis.find((o,l)=>{if(o===t)return!0})||i.info.analysis.push(t),i.atlas.settings.analyzing||(i.atlas.settings.analyzing=!0,i.atlas.analyzer())}addAnalyzerFunc(t=null,e=()=>{}){this.devices.forEach((s,i)=>{s.atlas!==null&&t!==null&&(s.atlas.analyzerOpts.indexOf(t)<0?(s.atlas.analyzerOpts.push(t),s.atlas.analyzerFuncs.push(e)):console.error("property "+t+" exists"))})}streamAppData(t="",e={}){if(this.info.nDevices>0){let s=t+Math.floor(Math.random()*1e4),i=Object.assign({[s+"newData"]:!0},e);this.state.addToState(s,i,o=>{this.state.data[s][s+"newData"]||(this.state.data[s][s+"newData"]=!0)});let n=()=>{if(this.state.data[s][s+"newData"]===!0)return this.state.data[s][s+"newData"]=!1,this.state.data[s]};this.addStreamFunc(s,n),this.addStreamParam(["key"])}}addStreamFunc(t,e,s=0){typeof t=="string"&&typeof e=="function"&&this.devices[s]!==void 0?this.devices[s].addStreamFunc(t,e):console.error("addStreamFunc error")}addStreamParam(t=[],e=0){t.forEach((s,i)=>{Array.isArray(s)&&this.devices[e].info.streamParams.push(s)})}login(){return h(this,arguments,function*(t=!1,e=this.info.auth,s=this.info.auth.url.toString()){(this.socket==null||this.socket.readyState!==1)&&(this.socket=this.setupWebSocket(e),this.info.auth.authenticated=!0,this.subscribed=!0,this.info.nDevices++),this.socket!==null&&this.socket.readyState===1&&t===!0&&this.devices.forEach((i,n)=>{this.beginStream(n)})})}signup(){return h(this,arguments,function*(t={},e=this.info.auth.url.toString()){e=this.checkURL(e);let s=JSON.stringify(t);return yield fetch(e.toString()+"signup",{method:"POST",mode:"cors",headers:new Headers({Accept:"application/json","Content-Type":"application/json"}),body:s}).then(n=>n.json().then(o=>o)).then(n=>(console.log(`
`+n),n)).catch(function(n){console.error(`
`+n.message)})})}request(n){return h(this,arguments,function*(t,e="POST",s="",i=this.info.auth.url.toString()){if(s!==""){i=this.checkURL(i),s=this.checkPathname(s);let o={method:e,mode:"cors",headers:{Accept:"application/json","Content-Type":"application/json"}};return e==="POST"&&(o.body=JSON.stringify(t)),yield fetch(i+s,o).then(l=>l.json().then(r=>r.message)).catch(function(l){console.error(`
`+l.message)})}else{console.error("You must provide a valid pathname to request resources from "+i);return}})}processSocketMessage(t=""){let e=JSON.parse(t);if(!e.msg){console.log(t);return}if(e.msg==="userData")for(const s in e.userData)this.state.data[e.username+"_userData"][s]=e.userData[s];else e.msg==="gameData"?(this.state.data[e.appname+"_userData"]?e.userData.forEach((s,i)=>{this.state.data[e.appname+"_userData"].find((o,l)=>{if(o.username===s.username)for(const r in s)s[r],o[r]})||this.state.data[e.appname+"_userData"].push(s)}):this.state.data[e.appname+"_userData"]=e.userData,this.state.data[e.appname+"_spectators"]=e.spectators):e.msg==="getUserDataResult"?this.state.data.commandResult=e:e.msg==="getUsersResult"?this.state.data.commandResult=e:e.msg==="getGameDataResult"?this.state.data.commandResult=e:e.msg==="getGameInfoResult"?this.state.data.commandResult=e:e.msg==="getGamesResult"?this.state.data.commandResult=e:e.msg==="subscribedToUser"?this.state.data.commandResult=e:e.msg==="userNotFound"?this.state.data.commandResult=e:e.msg==="subscribedToGame"?this.state.data.commandResult=e:e.msg==="leftGame"?this.state.data.commandResult=e:e.msg==="gameDeleted"?this.state.data.commandResult=e:e.msg==="unsubscribed"?this.state.data.commandResult=e:e.msg==="gameNotFound"?this.state.data.commandResult=e:e.msg==="resetUsername"?this.info.auth.username=e.username:e.msg==="ping"||console.log(e)}setupWebSocket(t=this.info.auth){let e=null,s=["username&"+t.username,"password&"+t.password,"appname&"+t.appname];if(t.url.protocol==="http:")e=new WebSocket("ws://"+t.url.host,s);else if(t.url.protocol==="https:")e=new WebSocket("wss://"+t.url.host,s);else{console.log("invalid protocol");return}return e.onerror=()=>{console.log("error")},e.onopen=()=>{console.log("socket opened")},e.onmessage=i=>{console.log("Message recieved: "+i.data),this.processSocketMessage(i.data)},e.onclose=i=>{console.log("close")},e}subscribeToUser(t="",e=[],s=i=>{}){if(this.socket!==null&&this.socket.readyState===1){this.socket.send(JSON.stringify({username:this.info.auth.username,cmd:["getUserData",t]})),e.forEach(n=>{let o=n;Array.isArray(o)&&(o=n.join("_")),this.state.data[t+"_"+o]=null});let i=this.state.subscribe("commandResult",n=>{typeof n=="object"&&(n.msg==="getUserDataResult"?(n.username===t&&this.socket.send(JSON.stringify({username:this.info.auth.username,cmd:["subscribeToUser",t,e]})),s(n),this.state.unsubscribe("commandResult",i)):n.msg==="userNotFound"&&n.username===t&&(this.state.unsubscribe("commandResult",i),console.log("User not found: ",t)))})}}unsubscribeFromUser(t="",e=null,s=i=>{}){if(this.socket!==null&&this.socket.readyState===1){this.socket.send(JSON.stringify({cmd:["unsubscribeFromUser",t,e],username:this.info.auth.username}));let i=this.state.subscribe("commandResult",n=>{if(n.msg==="unsubscribed"&&n.username===t){for(const o in this.state.data)o.indexOf(t)>-1&&(this.state.unsubscribeAll(o),this.state.data[o]=void 0);s(n),this.state.unsubscribe("commandResult",i)}})}}getGames(t=this.info.auth.appname,e=s=>{}){if(this.socket!==null&&this.socket.readyState===1){this.socket.send(JSON.stringify({username:this.info.auth.username,cmd:["getGames",gameid]}));let s=this.state.subscribe("commandResult",i=>{typeof i=="object"?i.msg==="getGamesResult"&&i.appname===t&&(console.log(i.gameInfo),e(i),this.state.unsubscribe("commandResult",s)):i.msg==="gameNotFound"&i.appname===t&&(this.state.unsubscribe("commandResult",s),console.log("Game not found: ",t))})}}subscribeToGame(t="",e=!1,s=i=>{}){if(this.socket!==null&&this.socket.readyState===1){this.socket.send(JSON.stringify({username:this.info.auth.username,cmd:["getGameInfo",t]}));let i=this.state.subscribe("commandResult",n=>{if(typeof n=="object")if(n.msg==="getGameInfoResult"&&n.gameInfo.id===t){let o=!0;if(e===!1){let l=[];n.gameInfo.propnames.forEach(r=>{console.log(r),l.push(r.split("_"))}),o=this.configureStreamForGame(n.gameInfo.devices,l)}o===!0&&(this.socket.send(JSON.stringify({username:this.info.auth.username,cmd:["subscribeToGame",this.info.auth.username,appname,e]})),n.gameInfo.usernames.forEach(l=>{n.gameInfo.propnames.forEach(r=>{this.state.data[n.gameInfo.id+"_"+l+"_"+r]=null})}),s(n)),this.state.unsubscribe("commandResult",i)}else n.msg==="gameNotFound"&n.appname===appname&&(this.state.unsubscribe("commandResult",i),console.log("Game not found: ",appname))})}}unsubscribeFromGame(t="",e=s=>{}){if(this.socket!==null&&this.socket.readyState===1){this.socket.send({cmd:["leaveGame",t],username:this.info.auth.username});let s=this.state.subscribe("commandResult",i=>{if(i.msg==="leftGame"&&i.appname===t){for(const n in this.state.data)n.indexOf(t)>-1&&(this.state.unsubscribeAll(n),this.state.data[n]=void 0);e(i),this.state.unsubscribe("commandResult",s)}})}}configureStreamForGame(t=[],e=[]){let s=[];e.forEach((n,o)=>{n[2]===void 0?s.push([n[0],n[1],"all"]):s.push([...n])});let i;return t.forEach((n,o)=>{i=this.devices.find((l,r)=>{if(l.info.deviceName.indexOf(n)>-1){l.socket===null&&(l.socket=this.socket);let a=[];return s.forEach((c,f)=>{c[0].indexOf(l.info.deviceType)>-1&&a.push(c)}),l.info.streamParams=a,l.info.streaming=!0,l.info.streamCt===0&&l.streamLoop(),!0}})}),i===void 0?(console.error("Compatible device not found"),!1):!0}sendWSCommand(t="",e={}){if(this.socket!=null&&this.socket.readyState===1){let s={cmd:t,username:this.info.auth.username};Object.assign(s,e);let i=JSON.stringify(s);console.log("Message sent: ",i),this.socket.send(i)}}closeSocket(){this.socket.close()}onconnectionLost(t){let e=!1,s=0,i=this.info.connections.find((n,o)=>{if(n.username===t.username)return e=!0,!0});e===!0&&(this.info.connections.splice(s,1),this.info.nDevices--)}checkURL(t){return t.slice(-1)!=="/"&&(t+="/"),t}checkPathname(t){return t.slice(0)==="/"&&t.splice(0,1),t}}class O{constructor(t="freeeeg32_2",e=["eegfft"],s=!0,i=!0,n=!1,o=null,l=[],r={username:"guest"}){u(this,"init",(t=this.info,e=this.pipeToAtlas)=>{this.deviceConfigs.find((s,i)=>{if(t.deviceName.indexOf(s.name)>-1)return this.device=new s.cls(t.deviceName,this.onconnect,this.ondisconnect),this.device.init(t,e),this.atlas=this.device.atlas,this.filters=this.device.filters,this.atlas!==null&&(this.pipeToAtlas=!0,this.configureDefaultStreamTable(),this.info.streaming===!0&&this.streamLoop()),!0})});u(this,"connect",()=>{this.device.connect()});u(this,"disconnect",()=>{this.device.disconnect()});u(this,"sendDataToSocket",(t=[["prop","tag","arg1"]],e={})=>{let s={username:this.info.auth.username,userData:{}};Object.assign(s.userData,e),t.forEach((i,n)=>{this.streamTable.find((o,l)=>{if(i[0].indexOf(o.prop)>-1){let r=i.slice(1),a=o.callback(...r);if(a!==void 0){let c="";s.userData[i.join("_")]=a}return!0}})}),Object.keys(s.userData).length>0&&this.socket.send(JSON.stringify(s))});u(this,"streamLoop",(t={})=>{if(this.info.streaming===!0){let e=[];if(this.info.streamParams.length===0)return console.error("No stream parameters set"),!1;this.info.streamParams.forEach((s,i)=>{let n=this.streamTable.find((o,l)=>{if(o.prop===s[0])return e.push(s),!0})}),e.length>0&&this.sendDataToSocket(e),this.info.streamCt++,setTimeout(()=>{this.streamLoop()},this.info.streamLoopTiming)}else this.info.streamCt=0});this.info={deviceName:t,deviceType:null,streaming:n,streamParams:l,analysis:e,deviceNum:0,streamLoopTiming:100,streamCt:0,auth:r,sps:null,useFilters:s,useAtlas:!1,simulating:!1},this.device=null,this.deviceConfigs=[{name:"freeeeg32",cls:v},{name:"muse",cls:k},{name:"hegduino",cls:S},{name:"cyton",cls:D},{name:"webgazer",cls:T}],this.socket=o,this.streamTable=[],this.filters=[],this.atlas=null,this.pipeToAtlas=i}onconnect(t=""){}ondisconnect(t=""){}configureDefaultStreamTable(t=[]){let e=(o,l="all")=>{let r=l;if(this.info.useAtlas===!0){let a=!1;if(typeof o=="number"?a=this.atlas.getEEGDataByChannel(o):a=this.atlas.getEEGDataByTag(o),a!==void 0){if(r==="all"&&(a.count===0||(r=a.count-a.lastRead,a.lastRead=a.count,r===0)))return;if(a.filtered.length>0){let c=a.times.slice(a.times.length-r,a.times.length),f=a.filtered.slice(a.filtered.length-r,a.filtered.length);return{times:c,samples:f}}else if(a.raw.length>0){let c=a.times.slice(a.times.length-r,a.times.length),f=a.raw.slice(a.raw.length-r,a.raw.length);return{times:c,samples:f}}else return}else return}},s=(o,l="all")=>{let r=l;if(this.info.useAtlas===!0){let a=!1;if(typeof o=="number"?a=this.atlas.getEEGFFTData(o):a=this.atlas.getEEGDataByTag(o),a!==void 0){if(r==="all"&&(a.fftCount===0||(r=a.fftCount-a.lastReadFFT,a.lastReadFFT=a.fftCount,r===0)))return;let c=a.fftTimes.slice(a.fftTimes.length-r,a.fftTimes.length),f=a.ffts.slice(a.ffts.length-r,a.ffts.length);return{times:c,ffts:f}}else return}},i=(o,l="all")=>{let r=l;if(this.info.useAtlas===!0){let a=this.atlas.getCoherenceByTag(o);if(r==="all"&&(a.fftCount===0||(r=a.fftCount-a.lastRead,a.lastRead=a.fftCount,r===0)))return;if(a!==void 0){let c=a.times.slice(a.fftTimes.length-r,a.fftTimes.length),f=a.ffts.slice(a.ffts.length-r,a.ffts.length);return{times:c,ffts:f}}else return}},n=(o=0,l="all",r=null)=>{let a=l;if(this.info.useAtlas===!0){let c=this.atlas.getDeviceDataByTag("heg",o);if(a==="all"&&(a=c.count-c.lastRead,c.lastRead=c.count,a<=0))return;if(c!==void 0)if(r!==null){let f=c.times.slice(c.times.length-a,c.times.length),m=c[r].slice(c.ffts.length-a,c.ffts.length),g={times:f};return g[r]=m,g}else return c;else return}};this.streamTable=[{prop:"eegch",callback:e},{prop:"eegfft",callback:s},{prop:"eegcoherence",callback:i},{prop:"hegdata",callback:n}],t.length>0&&this.streamTable.push(...t)}addStreamFunc(t="",e=()=>{}){this.streamtable.push({prop:t,callback:e})}configureStreamParams(t=[["prop","tag"]]){let e=[];t.forEach((s,i)=>{e.push(s.join("_"))}),this.socket.send(JSON.stringify({cmd:["addProps",e],username:this.info.auth.username}))}simulateData(){let t=100;if(this.info.simulating===!0){let e=Math.floor(this.info.sps*t/1e3);for(let s=0;s<e;s++);setTimeout(requestAnimationFrame(this.simulateData),t)}}}
