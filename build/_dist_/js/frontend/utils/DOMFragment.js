var a=Object.defineProperty;var d=(r,e,t)=>(typeof e!="symbol"&&(e+=""),e in r?a(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t);import{ObjectListener as m}from"./ObjectListener.js";export class DOMFragment{constructor(e=this.templateStringGen,t=document.body,n={},s=()=>{},o=()=>{},h="NEVER"){d(this,"onRender",()=>{});this.onRender=s,this.parentNode=t,typeof t=="string"&&(this.parentNode=document.getElementById(t)),this.renderSettings={templateStringGen:e,onchange:o,props:n},this.templateString="",typeof e=="function"?this.templateString=e(n):this.templateString=e;var i=h;if(this.renderSettings.props==={}&&(i="NEVER"),this.node=null,this.listener=new m,Object.keys(this.renderSettings.props).length>0&&!(i==null||i==="NEVER")){console.log("making listeners for ",e);const l=()=>{this.updateNode()};this.listener.addListener("templateChange",this.renderSettings,"templateStringGen",l,i);const p=()=>{this.updateNode(),this.renderSettings.onchange()};this.listener.addListener("props",this.renderSettings,"props",p,i)}this.renderNode()}appendFragment(e,t){var n=document.createElement("template");n.innerHTML=e;var s=n.content;return t.appendChild(s),t.children[t.children.length-1]}deleteFragment(e,t){var n=document.getElementById(t);e.removeChild(n)}removeParent(e){var t=document.getElementById(e);t.parentNode.parentNode.removeChild(t.parentNode)}renderNode(e=this.parentNode){this.node=this.appendFragment(this.templateString,e),this.onRender()}updateNode(e=this.parentNode,t=this.node,n=this.props){e.removeChild(t),typeof this.renderSettings.templateStringGen=="function"?this.templateString=this.renderSettings.templateStringGen(this.props):this.templateString=this.renderSettings.templateStringGen,this.renderNode(e,n)}deleteNode(e=this.node){typeof e=="string"?(thisNode=document.getElementById(e),thisNode.parentNode.removeChild(thisNode),this.node=null):typeof e=="object"&&(e.parentNode.removeChild(e),this.node=null)}}
