"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _toConsumableArray(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _toConsumableArray(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}var _slicedToArray=function(){function e(e,t){var n=[],r=!0,o=!1,i=void 0;try{for(var a,l=e[Symbol.iterator]();!(r=(a=l.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{!r&&l.return&&l.return()}finally{if(o)throw i}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),_createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();window.Util=function(){var e=function(){function e(t){var n=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(_classCallCheck(this,e),!(t instanceof HTMLElement))return{};this._value=r.default||0,this._ori=t.offsetHeight>t.offsetWidth?"y":"x",this._inner_mode=r.inner_mode||!1,this._hide_dot=r.hide_dot||!1,this._hide_fill=r.hide_fill||!1,this._disabled=r.disabled||!1;var o=document.createElement("div"),i=document.createElement("div");o.appendChild(i);var a=document.createElement("div");o.appendChild(a),t.appendChild(o);var l={client:0,value:0},s=function(e){if(!n._disabled)return l.client="x"===n._ori?e.clientX:e.clientY,l.value=n._value,document.addEventListener("mousemove",c),document.addEventListener("mouseup",d),e.preventDefault(),e.stopPropagation(),!1},c=function(e){var t=l.value+("x"===n._ori?e.clientX-l.client:l.client-e.clientY)/(n._bar_len-(n._inner_mode?2*n._dot_r:0));n.set_value(t,"drag")},d=function e(t){document.removeEventListener("mousemove",c),document.removeEventListener("mouseup",e)};a.addEventListener("mousedown",s),o.addEventListener("mousedown",function(e){if(!n._disabled){for(var t=[e.offsetX,n._bar_len-e.offsetY],r=t[0],i=t[1],a=e.target;a!==o;)r+=a.offsetLeft,i-=a.offsetTop,a=a.parentNode;var l="x"===n._ori?r:i,c=n._inner_mode?(l-n._dot_r)/(n._bar_len-2*n._dot_r):l/n._bar_len;n.set_value(c,"click"),s(e)}}),this.elem={dot:a,wrapper:o,fill:i},this.on_change=null,this.render()}return _createClass(e,[{key:"set_value",value:function(e,t){"[object Number]"===Object.prototype.toString.call(e)&&(e=e>1?1:e<0?0:e,this.elem.dot.style["x"===this._ori?"left":"bottom"]="calc("+100*e*(this._inner_mode?1-2*this._dot_r/this._bar_len:1)+"% - "+(this._inner_mode?0:this._dot_r)+"px)",this.elem.fill.style["x"===this._ori?"width":"height"]=100*e+"%",this._value!==e&&this.on_change&&this.on_change(e,t),this._value=e)}},{key:"render",value:function(){this._ori=this.elem.wrapper.offsetHeight>this.elem.wrapper.offsetWidth?"y":"x";var e=this.elem.wrapper.style;e.position="relative",e.width=e.height="100%",e.padding=e.margin="0";var t=this.elem.fill.style;t.position="absolute",t.width=t.height="100%",t.left=t.bottom="0",t.padding=t.margin="0",t.display=this._hide_fill?"none":"block";var n=this.elem.dot.style;n.position="absolute",n.left="calc(50% - "+this.elem.dot.offsetWidth/2+"px)",n.bottom="calc(50% - "+this.elem.dot.offsetHeight/2+"px)",n.display=this._hide_dot?"none":"block",this._dot_r=("x"===this._ori?this.elem.dot.offsetWidth:this.elem.dot.offsetHeight)/2,this._bar_len="x"===this._ori?this.elem.wrapper.offsetWidth:this.elem.wrapper.offsetHeight,this.set_value(this._value,"render")}},{key:"enable",value:function(){this._disabled=!1}},{key:"disable",value:function(){this._disabled=!0}},{key:"hide_dot",value:function(){this._hide_dot=!0,this.render()}},{key:"show_dot",value:function(){this._hide_dot=!1,this.render()}},{key:"hide_fill",value:function(){this._hide_fill=!0,this.render()}},{key:"show_fill",value:function(){this._hide_fill=!1,this.render()}},{key:"value",set:function(e){this.set_value(e,"set")},get:function(){return this._value}}]),e}(),t={Bar:e,hex_to_rgb:function(e){return e=(e+"").replace("#",""),[parseInt(e.slice(0,2),16),parseInt(e.slice(2,4),16),parseInt(e.slice(4,6),16)]},ajax:function(e){var t=(e.method||"GET").toUpperCase(),n=e.url,r=e.data||{},o=e.header||{},i=e.callback||function(){};try{!function(){var e=new XMLHttpRequest,a=[];for(var l in r)a.push(l+"="+r[l]);var s=a.join("&"),c=void 0;if("GET"===t)n+="?"+s,c=null;else{if("POST"!==t)throw"only get/post available";c=s}e.open(t,n);for(var d in o)e.setRequestHeader(d,o[d]);"POST"===t&&e.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),e.onreadystatechange=function(){4===e.readyState&&i(e.responseText,e.status)},e.send(c)}()}catch(e){console.log(e)}},shuffle_arr:function(e){e=e.slice();for(var t=[];e.length;)t.push(e.splice(Math.floor(Math.random()*e.length),1)[0]);return t},format_date:function(e){e=new Date(e);var t=[e.getFullYear(),e.getMonth()+1,e.getDate()],n=t[0],r=t[1],o=t[2],i=[e.getHours(),e.getMinutes(),e.getSeconds()],a=i[0],l=i[1],s=i[2];return n+"-"+(r<10?"0"+r:r)+"-"+(o<10?"0"+o:o)+" "+(a<10?"0"+a:a)+":"+(l<10?"0"+l:l)+":"+(s<10?"0"+s:s)},parse_rgba:function(e){var t=e.match(/\(.*\)/g)[0].replace(/[\(\)]/g,"").split(",").map(function(e){return+e.trim()}),n=_slicedToArray(t,4),r=n[0],o=n[1],i=n[2],a=n[3];return[r,o,i,a]},btn_popup:function(e,t){var n=t.w||100,r=t.h||100,o=t.mode||0,i=t.offset||0,a=document.createElement("div");a.className="popup default";for(var l=e.target;!l.classList.contains("btn");)l=l.parentNode;var s=e.clientX-e.layerX,c=e.clientY-e.layerY,d=[l.offsetWidth,l.offsetHeight],u=d[0],f=d[1];switch(o){case 0:c+f+i+r>document.documentElement.clientHeight?c-=i+r:c+=f+i,s+n>document.documentElement.clientHeight&&(s-=n-u);break;case 1:s+u+i+n>document.documentElement.clientHeight?s-=i+n:s+=u+i,c+r>document.documentElement.clientHeight&&(c-=r-f)}return a.style.cssText="position: fixed; top: "+c+"px; left: "+s+"px; width: "+n+"px; height: "+r+"px",a},sync:function(e){var t=e(),n=function e(n){n&&n.then(function(n){e(t.next(n).value)})};n(t.next().value)},sync_fn:function(e){return new Promise(function(t){e(t)})},sync_timeout:function(e){return new Promise(function(t){setTimeout(function(){t(+new Date)},e)})},sync_test:function(){t.sync(regeneratorRuntime.mark(function e(){var n,r,o;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return console.log(1),e.next=3,t.sync_timeout(3222);case 3:return n=e.sent,console.log(2,n),e.next=7,t.sync_timeout(2222);case 7:return r=e.sent,console.log(3,r),e.next=11,t.sync_timeout(3222);case 11:return console.log(4,n-r),e.next=14,t.sync_fn(function(e){setTimeout(function(){e("haha")},2e3)});case 14:o=e.sent,console.log(o);case 16:case"end":return e.stop()}},e,this)}))}};return t}(),window.ColorPicker=function(){var e=void 0,t={},n={container:function e(){var e=document.createElement("div");return e.className="color-picker",e},color_block:function e(t,n,r,o){o=void 0===o?1:o;var e=document.createElement("div");return e.className="color-block",e.style.backgroundColor="rgba("+t+", "+n+", "+r+", "+o+")",e.rgba=[t,n,r,o],e},color_getter:regeneratorRuntime.mark(function e(t){var n,r,o;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:n=0;case 1:if(!(n<=256)){e.next=17;break}r=0;case 3:if(!(r<=256)){e.next=14;break}o=0;case 5:if(!(o<=256)){e.next=11;break}return e.next=8,[n,r,o];case 8:o+=t,e.next=5;break;case 11:r+=t,e.next=3;break;case 14:n+=t,e.next=1;break;case 17:case"end":return e.stop()}},e,this)}),init:function(){var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};e=n.container(),t=r.callbacks||t,n.event();for(var o=[],i=n.color_getter(64),a=i.next().value;a;)o.push(a),a=i.next().value;if(r.color_none){var l=n.color_block(255,255,255,0);l.innerText="X",l.classList.add("none"),e.appendChild(l)}return o.sort(function(e,t){return e[0]+e[1]+e[2]<t[0]+t[1]+t[2]?1:-1}).forEach(function(t){e.appendChild(n.color_block.apply(n,_toConsumableArray(t)))}),e},event:function(){e.addEventListener("click",function(n){for(var r=n.target;r!==e&&!r.classList.contains("color-block");)r=r.parentNode;r.classList.contains("color-block")&&t.onpick&&t.onpick(r.rgba)})}};return n}();var _slicedToArray=function(){function e(e,t){var n=[],r=!0,o=!1,i=void 0;try{for(var a,l=e[Symbol.iterator]();!(r=(a=l.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{!r&&l.return&&l.return()}finally{if(o)throw i}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};!function(e){var t="object"==("undefined"==typeof self?"undefined":_typeof(self))&&self.self===self&&self||"object"==("undefined"==typeof global?"undefined":_typeof(global))&&global.global===global&&global;"function"==typeof define&&define.amd?define([],function(){t.Float=e()}):"object"===("undefined"==typeof exports?"undefined":_typeof(exports))?module.exports=e():t.Float=e()}(function(){var e=Object.seal({dot_link:100,dot_v:[1,6],dot_click:[2,4],dot_max:20,dot_create:500,dot_r:[.3,1.5],on_mousemove:!0,on_click:!0,extend_border:30,style:Object.seal({line:{r:255,g:255,b:255},width:.6,dot:{r:255,g:255,b:255,a:1}})}),t=e.style,n=void 0,r=void 0,o=void 0,i=void 0,a=void 0,l=void 0,s=void 0,c=function e(t){_classCallCheck(this,e),this.x=t.x||0,this.y=t.y||0,this.v_x=t.v_x||0,this.v_y=t.v_y||0,this.r=t.r||0},d=function e(t,n){for(var r in n)n[r]instanceof Object?(t[r]=t[r]instanceof Object?t[r]:"[object Array]"===Object.prototype.toString.call(n[r])?[]:{},e(t[r],n[r])):t[r]=n[r]},u=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;return e instanceof Array?e[0]+Math.floor(Math.random()*((e[1]-e[0])*t+1))/t:e},f={init:function(t){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};n=t.getContext("2d"),i=null,a=new Set,d(e,r),f.set_size(),f.bind_event(),f.auto_add_dot(e.dot_max),f.suspend(),f.resume()},bind_event:function(){var t=[];e.on_click&&t.push("click"),e.on_mousemove&&t.push("mousemove","mouseleave"),t.forEach(function(e){n.canvas.removeEventListener(e,f["on_"+e]),n.canvas.addEventListener(e,f["on_"+e])})},on_mousemove:function(e){var t=[e.offsetX,e.offsetY],n=t[0],r=t[1];return i?(i.x=n,void(i.y=r)):(i=new c({x:n,y:r}),void a.add(i))},on_mouseleave:function(e){a.delete(i),i=null},on_click:function(t){for(var n=[t.offsetX,t.offsetY],r=n[0],o=n[1],i=u(e.dot_click),l=0;l<i;l++)a.add(new c({x:r,y:o,v_x:u(e.dot_v,100)*(Math.random()>.5?-1:1)/10,v_y:u(e.dot_v,100)*(Math.random()>.5?-1:1)/10,r:u(e.dot_r,100)}))},resume:function(){cancelAnimationFrame(l);var e=function e(){f.clear(),f.render(),l=requestAnimationFrame(e)};l=requestAnimationFrame(e)},suspend:function(){cancelAnimationFrame(l)},update:function(t){var n=s,r=_slicedToArray(n,4),o=r[0],i=r[1],l=r[2],c=r[3];if(t.x=t.x+t.v_x,t.y=t.y+t.v_y,t.x<c||t.x>i||t.y<o||t.y>l){if(a.delete(t),a.size>e.dot_max)return;f.add_dot()}},render:function(){var r=new Set;a.forEach(function(o){f.update(o),a.has(o)&&(n.beginPath(),n.moveTo(o.x,o.y),n.arc(o.x,o.y,o.r,0,2*Math.PI),n.closePath(),n.fillStyle="rgba("+t.dot.r+","+t.dot.g+","+t.dot.b+",1)",n.fill(),r.forEach(function(r){var i=Math.pow(Math.pow(o.x-r.x,2)+Math.pow(o.y-r.y,2),.5);i>e.dot_link||(n.beginPath(),n.moveTo(o.x,o.y),n.lineTo(r.x,r.y),n.closePath(),n.strokeStyle="rgba("+t.line.r+","+t.line.g+","+t.line.b+","+2*(1-i/e.dot_link)+")",n.lineWidth=t.width,n.stroke())}),r.add(o))})},auto_add_dot:function(t){var n=setInterval(function(){return a.size>t?void clearInterval(n):void f.add_dot()},e.dot_create)},add_dot:function(){var t=[u([0,r]),u([0,o]),u(e.dot_v,100)*(Math.random()>.5?-1:1)/10,u(e.dot_v,100)*(Math.random()>.5?-1:1)/10],n=t[0],i=t[1],l=t[2],s=t[3];switch(u([0,3])){case 0:i=0,s=Math.abs(s);break;case 1:n=r,l=-Math.abs(l);break;case 2:i=o,s=-Math.abs(s);break;case 3:n=0,l=Math.abs(l)}a.add(new c({x:n,y:i,v_x:l,v_y:s,r:u(e.dot_r,100)}))},set_style:function(e){e=JSON.parse(JSON.stringify(e));for(var n in e)t[n]=e[n]},set_size:function(){n&&(r=n.canvas.offsetWidth,o=n.canvas.offsetHeight,n.canvas.width=r,n.canvas.height=o,s=[0-e.extend_border,r+e.extend_border,o+e.extend_border,0-e.extend_border])},clear:function(){n.clearRect(0,0,r,o)}};return f});var _slicedToArray=function(){function e(e,t){var n=[],r=!0,o=!1,i=void 0;try{for(var a,l=e[Symbol.iterator]();!(r=(a=l.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{!r&&l.return&&l.return()}finally{if(o)throw i}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}();window.GraffitiUtil=function(){var e=[],t=null,n=null,r=0,o=0,i="line",a=2,l="rgba(33,33,33,0.8)",s="rgba(55,33,222,0)",c={init_editor:function(e){n=e,c.set_size(),c.canvas_event()},set_size:function(){n&&(r=n.canvas.offsetWidth,o=n.canvas.offsetHeight,n.canvas.width=r,n.canvas.height=o,c.draw(e,n))},canvas_event:function(){n.canvas.addEventListener("mousedown",function(e){e.preventDefault(),t={shape:i,width:a,stroke:l,fill:s,points:[]},c.painting(e),n.canvas.addEventListener("mousemove",c.painting),document.addEventListener("mouseup",c.stop_painting)})},painting:function(r){t.points.push([r.offsetX,r.offsetY]),c.draw(e.concat([t]),n,!0)},stop_painting:function(r){t.points=d[t.shape].pick(t.points),e.push(t),c.draw(e,n),n.canvas.removeEventListener("mousemove",c.painting),document.removeEventListener("mouseup",c.stop_painting)},undo_paint:function(){e.pop(),c.draw(e,n)},draw:function(e,t,r){t.clearRect(0,0,n.canvas.width,n.canvas.height),e.forEach(function(n,o){d[n.shape].draw(n,t,r&&o===e.length-1)})},download_png:function(){var e=n.canvas.toDataURL(),t=document.createElement("a");t.setAttribute("href",e),t.setAttribute("download","canvas.png"),t.click()},get_point_range:function(e){var t=[],n=t[0],r=t[1],o=t[2],i=t[3];return e.forEach(function(e){e.points.forEach(function(e){var t=_slicedToArray(e,2),a=t[0],l=t[1];void 0===n&&(n=r=a,o=i=l),n=Math.min(a,n),o=Math.min(l,o),r=Math.max(a,r),i=Math.max(l,i)})}),[n,r,o,i]},get_data:function(){return e},get_size:function(){return{w:r,h:o}},draw_shape:function(e){return i=void 0===e?i:e},draw_width:function(e){return a=void 0===e?a:e},draw_stroke:function(e){return l=void 0===e?l:e},draw_fill:function(e){return s=void 0===e?s:e}},d={line:{draw:function(e,t){t.beginPath(),e.points.forEach(function(e){var n=_slicedToArray(e,2),r=n[0],o=n[1];t.lineTo(r,o)}),t.lineWidth=e.width,t.strokeStyle=e.stroke,t.stroke()},pick:function(e){return e}},straight:{draw:function(e,t){var n=d.straight.pick(e.points),r=_slicedToArray(n,2),o=r[0],i=r[1];t.beginPath(),t.moveTo.apply(t,_toConsumableArray(o)),t.lineTo.apply(t,_toConsumableArray(i)),t.lineWidth=e.width,t.strokeStyle=e.stroke,t.stroke()},pick:function(e){return[e[0],e[e.length-1]]}},circle:{draw:function(e,t,n){var r=d.circle.pick(e.points),o=_slicedToArray(r,2),i=o[0],a=o[1];n&&d.line.draw({points:[i,a],width:1,stroke:"rgba(0,0,0,0.3)"},t);var l=[i[0],i[1],a[0]-i[0],a[1]-i[1]],s=l[0],c=l[1],u=l[2],f=l[3],v=Math.abs(Math.min(u,f)),h=u/v,p=f/v;t.beginPath(),t.save(),t.scale(h,p),t.arc(s/h,c/p,v,0,2*Math.PI),t.closePath(),t.restore(),t.lineWidth=e.width,t.strokeStyle=e.stroke,t.fillStyle=e.fill,t.stroke(),t.fill()},pick:function(e){return[e[0],e[e.length-1]]}},rectangle:{draw:function(e,t,n){var r=d.rectangle.pick(e.points),o=_slicedToArray(r,2),i=o[0],a=o[1];n&&d.line.draw({points:[i,a],width:1,stroke:"rgba(0,0,0,0.3)"},t),t.beginPath(),t.rect(i[0],i[1],a[0]-i[0],a[1]-i[1]),t.closePath(),t.lineWidth=e.width,t.strokeStyle=e.stroke,t.fillStyle=e.fill,t.stroke(),t.fill()},pick:function(e){return[e[0],e[e.length-1]]}},triangle:{draw:function(e,t,n){var r=d.triangle.pick(e.points),o=_slicedToArray(r,3),i=o[0],a=o[1],l=o[2];n&&d.line.draw({points:e.points,width:1,stroke:"rgba(0,0,0,0.3)"},t),t.beginPath(),[i,a,l].forEach(function(e){var n=_slicedToArray(e,2),r=n[0],o=n[1];t.lineTo(r,o)}),t.closePath(),t.lineWidth=e.width,t.strokeStyle=e.stroke,t.fillStyle=e.fill,t.stroke(),t.fill()},pick:function(e){var t=[e[0],e[0],e[e.length-1]],n=t[0],r=t[1],o=t[2],i=(o[1]-n[1])/(o[0]-n[0]),a=0;return e.forEach(function(e){var t=_slicedToArray(e,2),o=t[0],l=t[1],s=Math.abs(o-n[0]+-1/i*(l-n[1]));s>a&&(a=s,r=[o,l])}),[n,r,o]}},eraser:{draw:function(e,t,n){t.beginPath(),e.points.forEach(function(e){var n=_slicedToArray(e,2),r=n[0],o=n[1];t.clearRect(r-5,o-5,10,10)})},pick:function(e){return e}}};return window.addEventListener("resize",c.set_size),c}(),window.PlayerUtil=function(e){var t="http://localhost:7869",n={mode:"",current:0,list:null},r=null,o=null,i={},a={init_player:function(e){a.player_render(e),a.player_events(e),a.switch_mode("normal"),a.set_volume(.8),n.list.length&&a.play("random")},player_render:function(e){r=document.createElement("section"),r.id=e.id||"player",r.className="collapse",r.innerHTML=a.player_html(),n.list=e.list||[],o=r.querySelector('[data-part="audio"]'),document.body.appendChild(r)},player_events:function(e){a.init_bars();var t=void 0;r.addEventListener("mouseenter",function(){clearTimeout(t),r.classList.remove("collapse")}),r.addEventListener("mouseleave",function(){r.fixed||(t=setTimeout(function(){r.classList.add("collapse");var e=r.querySelector(".volume");e&&e.parentNode.removeChild(e);var t=r.querySelector(".list");t&&t.parentNode.removeChild(t)},3e3))}),r.querySelector('[data-control="next"]').addEventListener("click",function(e){a.play("random"!==n.mode?"next":"random")}),r.querySelector('[data-control="play"]').addEventListener("click",function(e){a[o.paused?"audio_play":"audio_pause"]()}),r.querySelector('[data-control="pre"]').addEventListener("click",function(e){a.play("random"!==n.mode?"pre":"random")}),r.querySelector("[data-mode]").addEventListener("click",function(e){a.switch_mode()}),r.querySelector('[data-control="toggle_volume"]').addEventListener("click",function(e){setTimeout(function(){a.create_volume()},0)}),r.querySelector('[data-control="toggle_list"]').addEventListener("click",function(e){setTimeout(function(){a.create_list()},0)}),o.addEventListener("loadstart",function(e){a.onbegin(e)}),o.addEventListener("loadedmetadata",function(e){a.onloaded(e)}),o.addEventListener("timeupdate",function(e){a.onplay(e)}),o.addEventListener("progress",function(e){a.onbuffer(e)}),o.addEventListener("ended",function(e){a.onend(e)})},init_bars:function(){i.buffered=new e.Bar(r.querySelector('[data-bar="buffered_bar"]'),{hide_dot:!0,disabled:!0}),i.buffered.elem.fill.className="buffered-fill",i.buffered.render(),i.progress=new e.Bar(r.querySelector('[data-bar="progress_bar"]'),{hide_dot:!0,disabled:!0}),i.progress.elem.fill.className="progress-fill",i.progress.render()},play:function(e){var t=void 0;!function(){switch(e){case"next":t=n.current+1,t=t>=n.list.length?0:t;break;case"pre":t=n.current-1,t=t<0?n.list.length-1:t;break;case"again":t=n.current;break;case"random":var r=function e(r){t=Math.floor(Math.random()*n.list.length),r&&t===n.current&&e(r)};r(n.list.length>1)}}(),a.play_index(t)},play_index:function(e){n.current=e,["innerText","title"].forEach(function(e){r.querySelector('[data-info="title"]')[e]=n.list[n.current].title,r.querySelector('[data-info="author"]')[e]=n.list[n.current].author});var t=r.querySelector('[data-info="cover"]');t.src=n.list[n.current].cover,t.onerror=function(e){t.src="/img/default.png",t.onerror=null},o.src=n.list[e].path,i.buffered.value=0,o.load()},audio_play:function(){var e=r.querySelector('[data-control="play"] use');e.setAttribute("xlink:href","#svgpath-audio-pause"),o.play()},audio_pause:function(){var e=r.querySelector('[data-control="play"] use');e.setAttribute("xlink:href","#svgpath-audio-play"),o.pause()},onbegin:function(e){a.update_progress()},onloaded:function(e){a.audio_play(),a.update_progress()},onplay:function(e){a.update_progress()},onbuffer:function(e){for(var t=o.buffered,n=[],r=0;r<t.length;r++)n.push([t.start(r),t.end(r)]);n.length&&(i.buffered.value=n[0][1]/o.duration)},onend:function(e){switch(n.mode){case"normal":a.play("next");break;case"loop":a.play("again");break;case"random":a.play("random")}},switch_mode:function(e){var t=["normal","loop","random"],o=["顺序播放","单曲循环","随机播放"],i=r.querySelector("[data-mode]"),a=i.querySelector("use");e||(e=t[t.indexOf(n.mode)+1],e||(e=t[0])),n.mode=e,a.setAttribute("xlink:href","#svgpath-audio-"+e),i.setAttribute("title",o[t.indexOf(n.mode)])},set_volume:function(e){o.volume=e},update_progress:function(){var e=r.querySelector('[data-info="progress_text"]');e.innerText=a.convert_sec(o.currentTime)+" / "+a.convert_sec(o.duration),i.progress.value=o.duration?o.currentTime/o.duration:0},convert_sec:function(e){e||(e=0),e=parseInt(e);var t=e%60;t=t<10?"0"+t:t;var n=(e-t)/60;return n=n<10?"0"+n:n,n+":"+t},get_list:function(n){e.ajax({url:t+"/tool/music_info",callback:function(e,t){if(200===t){var r=JSON.parse(e);n&&n(r)}}})},player_html:function(){var e='\n            <div class="container">\n                <div data-part="control">\n                    <div class="control-btn pre" data-control="pre" title="上一首 (ctrl + ←)">\n                        <svg viewbox="0 0 1024 1024">\n                            <use xlink:href="#svgpath-audio-pre"/>\n                        </svg>\n                    </div>\n                    <div id="player-play" class="control-btn" data-control="play" title="播放/暂停 (P)">\n                        <svg viewbox="0 0 1024 1024">\n                            <use xlink:href="#svgpath-audio-play"/>\n                        </svg>\n                    </div>\n                    <div class="control-btn next" data-control="next" title="下一首 (ctrl + →)">\n                        <svg viewbox="0 0 1024 1024">\n                            <use xlink:href="#svgpath-audio-next"/>\n                        </svg>\n                    </div>\n                </div>\n                <div data-part="cover">\n                    <div class="cover-blank"></div>\n                    <div id="player-cover">\n                        <img data-info="cover" src=""/>\n                    </div>\n                </div>\n                <div data-part="main">\n                    <div id="player-info">\n                        <span data-info="title"></span>\n                        <span data-info="author"></span>\n                    </div>\n                    <div>\n                        <div class="info-bar">\n                            <div class="bar" data-bar="buffered_bar"></div>\n                            <div class="bar" data-bar="progress_bar"></div>\n                        </div>\n                        <div id="player-progress" data-info="progress_text"></div>\n                    </div>\n                </div>\n                <div data-part="control2">\n                    <div data-action="toggle_volume" title="音量">\n                        <div class="audio-btn" data-control="toggle_volume">\n                            <svg viewbox="0 0 1024 1024">\n                                <use xlink:href="#svgpath-audio-volume"/>\n                            </svg>\n                        </div>\n                    </div>\n                    <div data-action="mode">\n                        <div class="audio-btn" data-mode="" title="">\n                            <svg viewbox="0 0 1024 1024">\n                                <use xlink:href="#svgpath-audio-normal"/>\n                            </svg>\n                        </div>\n                    </div>\n                    <div data-action="toggle_list" title="播放列表">\n                        <div class="audio-btn" data-control="toggle_list">\n                            <svg viewbox="0 0 1024 1024">\n                                <use xlink:href="#svgpath-audio-list"/>\n                            </svg>\n                        </div>\n                    </div> \n                </div>\n                \n                  \n                <audio data-part="audio"></audio>\n            </div>\n            <svg width="0" height="0">\n                <defs>\n                    <path id="svgpath-audio-next" d="M581.5 512l-273.1-273.1c-25-25-25-65.5 0-90.5s65.5-25 90.5 0l316.7 316.7c12.9 12.9 19.2 30 18.7 47 0.4 16.9-5.8 33.9-18.699 46.8l-316.8 316.8c-25 25-65.5 25-90.5 0s-25-65.5 0-90.5l273.2-273.2z"></path>\n                    <path id="svgpath-audio-pre" d="M442.5 512l273.1 273.1c25 25 25 65.5 0 90.5s-65.5 25-90.5 0L308.4 558.9c-12.9-12.9-19.2-30-18.7-47-0.4-16.9 5.8-33.9 18.7-46.8l316.8-316.8c25-25 65.5-25 90.5 0s25 65.5 0 90.5L442.5 512z"></path>\n                    <path id="svgpath-audio-play" d="M851.2 460.8 224 96c-6.4 0-19.2-6.4-25.6-6.4-12.8 0-19.2 0-32 6.4C147.2 108.8 134.4 128 134.4 153.6l0 729.6c0 19.2 12.8 44.8 32 51.2 6.4 6.4 19.2 6.4 32 6.4 12.8 0 19.2 0 32-6.4l627.2-358.4c19.2-12.8 32-32 32-51.2C883.2 492.8 870.4 467.2 851.2 460.8L851.2 460.8zM851.2 460.8"></path>\n                    <path id="svgpath-audio-pause" d="M740.5967 162.5743c33.9282 0 61.698 34.1053 61.698 75.7924v547.971072c0 41.686-27.7699 75.7821-61.698 75.7821h-30.839808c-33.9292 0-61.6929-34.0961-61.6929-75.7821V238.36672000000002c0-41.687 27.7637-75.7924 61.6929-75.7924H740.596736z M314.2922 162.5743c33.9313 0 61.696 34.1053 61.696 75.7924v547.971072c0 41.686-27.7658 75.7821-61.696 75.7821H283.45651200000003c-33.9343 0-61.698-34.0961-61.698-75.7821V238.36672000000002c0-41.687 27.7637-75.7924 61.698-75.7924H314.29222400000003z"></path>\n                    <path id="svgpath-audio-normal" d="M902.836453 788.242532l0.002047-0.027629 0-0.001023c0-8.088212-3.349281-16.187681-9.06547-21.903869l-85.375459-85.375459c-28.250414-28.250414-72.058153 15.556301-43.806715 43.806715l32.484855 32.492018L153.287175 757.233284c-39.953967 0-39.953967 61.959144 0 61.959144l718.571752 0C888.637056 819.193451 902.821103 805.01759 902.836453 788.242532z M759.588935 271.402293l112.271016 0c26.963095 0 41.037648-33.758871 21.914102-52.883441l-85.375459-85.375459c-28.274974-28.227901-72.061222 15.572674-43.806715 43.827181l32.472576 32.472576-37.474496 0C719.632921 209.44315 719.632921 271.402293 759.588935 271.402293z M636.084063 271.402293l22.448268 0c39.956014 0 39.956014-61.959144 0-61.959144l-22.448268 0C596.128049 209.44315 596.128049 271.402293 636.084063 271.402293z M153.287175 271.402293l392.973116 0c39.956014 0 39.956014-61.959144 0-61.959144L153.287175 209.44315C113.332185 209.44315 113.332185 271.402293 153.287175 271.402293z M902.839523 514.317789c0-8.092305-3.347235-16.184611-9.06547-21.903869l-85.375459-85.375459c-28.274974-28.227901-72.061222 15.572674-43.806715 43.827181l32.472576 32.472576L153.287175 483.338217c-39.956014 0-39.952944 61.959144 0 61.959144l718.571752 0c16.785292 0 30.979572-14.192234 30.979572-30.978549L902.838499 514.317789z"></path>\n                    <path id="svgpath-audio-loop" d="M997.970784 537.255904C997.970784 716.297771 871.695112 895.339639 639.887048 895.339639 534.175614 895.339639 318.66036 895.339639 217.859789 895.339639 213.486052 895.339639 208.984428 895.339639 205.071084 895.339639L182.818737 895.339639 245.176462 957.671787C260.215979 972.736881 260.215979 997.112152 245.176462 1012.151669 230.111368 1027.191186 205.736097 1027.191186 190.69658 1012.151669L63.602431 885.05752C63.346657 884.827324 63.295502 884.494817 63.039728 884.239043 56.00594 877.281988 51.606626 867.639304 51.606626 856.973525 51.606626 846.282167 56.00594 836.665061 63.039728 829.708006 63.295502 829.452232 63.346657 829.119726 63.602431 828.863951L190.69658 701.769803C205.736097 686.730286 230.111368 686.730286 245.176462 701.769803 260.215979 716.80932 260.215979 741.210168 245.176462 756.249685L182.818737 818.60741 205.071084 818.60741C208.779808 818.60741 213.153545 818.60741 217.859789 818.60741 277.941124 818.60741 416.775304 818.60741 588.732229 818.60741 817.317539 818.60741 921.238555 687.523186 921.238555 460.523675L923.821873 460.523675C922.363961 456.482444 921.238555 452.262171 921.238555 447.73497L921.238555 396.580151C921.238555 375.376478 938.426574 358.214036 959.604669 358.214036 980.782765 358.214036 997.970784 375.376478 997.970784 396.580151L997.970784 447.73497C997.970784 452.262171 996.845378 456.482444 995.387465 460.523675L997.970784 460.523675 997.970784 537.255904ZM489.005909 358.214036C494.300433 343.379138 508.137811 332.636626 524.788705 332.636626 545.9668 332.636626 563.154819 349.799068 563.154819 371.002741L563.154819 677.931657C563.154819 699.109752 545.9668 716.297771 524.788705 716.297771 503.61061 716.297771 486.42259 699.109752 486.42259 677.931657L486.42259 434.946265 473.633885 434.946265C452.45579 434.946265 435.267771 417.758246 435.267771 396.580151 435.267771 375.376478 452.45579 358.214036 473.633885 358.214036L489.005909 358.214036ZM960.397569 194.467459 833.30342 321.561608C818.263903 336.601125 793.888632 336.601125 778.849115 321.561608 763.784021 306.522091 763.784021 282.14682 778.849115 267.107303L841.181263 204.749578 818.928916 204.749578C815.220192 204.749578 810.846455 204.749578 806.140211 204.749578 746.058876 204.749578 607.224696 204.749578 435.267771 204.749578 206.682461 204.749578 102.761445 335.833803 102.761445 562.833313L100.178127 562.833313C101.636039 566.874544 102.761445 571.069239 102.761445 575.622018L102.761445 626.776838C102.761445 647.954933 85.573426 665.142952 64.395331 665.142952 43.217235 665.142952 26.029216 647.954933 26.029216 626.776838L26.029216 575.622018C26.029216 571.069239 27.154622 566.874544 28.612535 562.833313L26.029216 562.833313 26.029216 486.101084C26.029216 307.059217 152.330465 128.017349 384.112952 128.017349 489.824386 128.017349 705.33964 128.017349 806.140211 128.017349 810.513948 128.017349 815.015572 128.017349 818.928916 128.017349L841.181263 128.017349 778.849115 65.659624C763.784021 50.620107 763.784021 26.219258 778.849115 11.179742 793.888632-3.859775 818.263903-3.859775 833.30342 11.179742L960.397569 138.299468C960.653343 138.529664 960.704498 138.862171 960.960272 139.117945 967.99406 146.075 972.393374 155.692106 972.393374 166.383463 972.393374 177.049243 967.99406 186.691927 960.960272 193.648982 960.730075 193.904756 960.653343 194.237263 960.397569 194.467459Z"></path>\n                    <path id="svgpath-audio-random" d="M537.728 382.016c55.552-55.04 127.04-79.616 231.808-79.616l5.312 0 0 59.712c0 19.072 13.056 26.24 29.12 15.872l143.68-92.8c16-10.368 15.808-27.072-0.32-37.056l-143.04-88.64c-16.192-10.048-29.44-2.624-29.44 16.448l0 59.392-5.312 0c-122.176 0-210.816 31.424-278.976 99.072C422.208 402.112 420.416 464.896 419.008 515.328c-0.64 21.696-1.152 40.384-6.592 57.472-12.16 38.4-44.032 73.92-89.728 99.904-57.472 32.896-135.04 49.728-224.32 48.768-0.128 0-0.256 0-0.384 0-18.368 0-33.344 14.72-33.536 33.152-0.192 18.496 14.656 33.728 33.152 33.856 2.816 0 5.568 0.128 8.32 0.128 49.408 0 95.872-4.992 138.112-14.72 41.536-9.728 79.168-24.128 111.936-42.752 60.352-34.624 103.104-83.52 120.384-137.984 8.256-26.112 8.96-51.392 9.664-75.84C487.36 470.912 488.448 430.784 537.728 382.016zM98.432 302.464c112.192-1.216 206.016 26.048 264.128 76.8 6.336 5.568 14.208 8.256 22.016 8.256 9.344 0 18.624-3.904 25.28-11.456 12.16-13.952 10.752-35.072-3.2-47.296-33.728-29.504-76.032-52.48-125.504-68.352-54.016-17.344-115.776-25.728-183.488-24.96-18.496 0.192-33.344 15.36-33.152 33.92C64.704 287.808 79.872 302.72 98.432 302.464zM947.328 734.272l-143.04-88.512c-16.192-10.112-29.44-2.624-29.44 16.384l0 59.392-5.312 0c-93.696 0-165.632-28.032-226.368-88.256-13.12-12.992-34.368-12.864-47.36 0.256-13.056 13.12-12.992 34.368 0.128 47.488 73.152 72.384 162.688 107.648 273.6 107.648l5.312 0 0 59.776c0 19.008 13.056 26.24 29.12 15.744l143.68-92.736C963.648 761.024 963.456 744.384 947.328 734.272z"></path>\n                    <path id="svgpath-audio-list" d="M672 625.109333 672 192.085333c0-17.749333 14.421333-32.085333 31.701333-32.085333l128.597333 0c17.493333 0 31.701333 14.208 31.701333 32 0 17.664-14.421333 32-31.701333 32L736 224l0 514.218667c0 0 0 0 0 0-1.194667 69.674667-58.026667 125.781333-128 125.781333-70.698667 0-128-57.301333-128-128s57.301333-128 128-128C631.296 608 653.184 614.229333 672 625.109333L672 625.109333zM160 640c0-17.664 14.506667-32 32.426667-32l191.146667 0c17.92 0 32.426667 14.208 32.426667 32 0 17.664-14.506667 32-32.426667 32L192.426667 672C174.506667 672 160 657.792 160 640zM160 480c0-17.664 14.378667-32 32.213333-32l383.573333 0c17.792 0 32.213333 14.208 32.213333 32 0 17.664-14.378667 32-32.213333 32l-383.573333 0C174.421333 512 160 497.792 160 480zM160 320c0-17.664 14.378667-32 32.213333-32l383.573333 0c17.792 0 32.213333 14.208 32.213333 32 0 17.664-14.378667 32-32.213333 32l-383.573333 0C174.421333 352 160 337.792 160 320z"></path>\n                    <path id="svgpath-audio-volume" d="M838.733994 895.65489l-51.130518-50.346665c79.672574-90.010013 128.306224-207.370954 128.306224-336.173482 0-128.800481-48.632627-246.162446-128.306224-336.172459l51.130518-50.347688c92.624561 102.901625 148.982126 238.20624 148.982126 386.519124C987.71612 657.44865 931.357532 792.753265 838.733994 895.65489zM698.726264 757.852384l-51.103912-50.346665c44.223201-54.354955 70.817905-123.283838 70.817905-198.370976 0-75.085092-26.594705-144.016021-70.817905-198.428282l51.103912-50.28936c57.111742 67.420529 91.51939 154.062841 91.51939 248.717641C790.245653 603.790566 755.838006 690.432879 698.726264 757.852384zM485.05379 791.882432c-11.846816 0-22.675442-3.89061-31.590486-10.279111l-0.086981 0.116657L270.075577 650.479935 90.113879 650.479935c-29.733185 0-53.831023-23.692608-53.831023-53.019541L36.282856 420.809091c0-29.267581 24.040533-52.960189 53.715389-53.018517l0-0.173962 178.539302 0 182.429913-146.919141 0.145309 0.173962c9.29162-7.491625 20.993127-12.136412 33.942043-12.136412 29.761837 0 53.860698 23.691585 53.860698 52.960189l0 159.113881 0 123.692137 0 52.960189 0 53.019541 0 88.382956C538.915511 768.131495 514.81665 791.882432 485.05379 791.882432z"></path>\n                </defs>\n            </svg>\n            ';
return e},list_html:function(e){var t="";return e.list.forEach(function(e,n){t+='\n                <li data-index="'+n+'"><span class="title">'+e.title+'</span> <span class="author">'+e.author+"</span></li>\n                "}),t},create_list:function(){var t=document.createElement("div");t.innerHTML='\n                <div data-part="list" class="list popup">\n                    <div class="list-title">\n                        <span>播放列表</span>\n                    </div>\n                    <div class="list-content">\n                        <div class="list-view">\n                            <ul class="list-ul"></ul>\n                        </div>\n                        <div data-bar="list_bar" class="list-bar"></div> \n                    </div>\n                </div>\n                ';var o=t.querySelector(".list-ul");o.innerHTML=a.list_html({list:n.list});var l=function(e){[].slice.call(o.querySelectorAll("[data-index]")).forEach(function(t){t.classList.remove("at"),+t.getAttribute("data-index")===e&&t.classList.add("at")})};l(n.current),o.addEventListener("click",function(e){for(var t=e.target;"UL"!==t.tagName&&!t.getAttribute("data-index");)t=t.parentNode;var n=t.getAttribute("data-index");n&&(n=+n,l(n),a.play_index(n))}),r.querySelector(".container").appendChild(t),i.list=new e.Bar(r.querySelector('[data-bar="list_bar"]'),{default:1,hide_fill:!0,inner_mode:!0}),i.list.elem.dot.className="list-dot",i.list.render();var s=r.querySelector(".list-view");if(o.addEventListener("mousewheel",function(e){if(e.stopPropagation(),e.preventDefault(),!(o.offsetHeight<=s.offsetHeight)){var t=e.deltaY>0?50:-50;i.list.value-=t/(o.offsetHeight-s.offsetHeight)}}),i.list.on_change=function(e,t){var n=(1-e)*(o.offsetHeight-s.offsetHeight);o.style.top=-n+"px"},!i.list.elem.dot.style.height){var c=r.querySelector(".list-view").offsetHeight,d=r.querySelector(".list-ul").offsetHeight;i.list.elem.dot.style.height=c/d*100+"%",d<=c&&i.list.hide_dot()}i.list.render()},create_volume:function(){var t=document.createElement("div");t.innerHTML='\n                <div data-part="volume" class="volume popup">\n                    <div data-bar="volume_bar"></div>\n                </div>\n            ',r.querySelector(".container").appendChild(t),i.volume=new e.Bar(r.querySelector('[data-bar="volume_bar"]'),{default:o.volume}),i.volume.elem.dot.className="volume-dot",i.volume.elem.fill.className="volume-fill",i.volume.render(),i.volume.on_change=function(e){o.volume=e}},fix_player:function(e){r.fixed=e}};return a}(window.Util),window.Waterfall=function(){var e=null,t=[20,20],n=void 0,r=void 0,o={init:function(i,a){var l=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};e=i,l.no_css||(i.style.position="relative"),r=a,t=l.space||t,n=null,o.fall()},fall:function(o){if(e){var i=e.querySelector(r);if(i){var a=i.offsetWidth+2*t[1];if(!o||!n){n=[],n.count=0;var l=e.offsetWidth;l=Math.max(l,a);for(var s=Math.floor(l/a),c=(l-a*s)/2,d=0;d<s;d++){var u={left:c+d*a,top:0};n.push(u)}}var f=[].slice.call(e.querySelectorAll(r));f.forEach(function(e,r){if(!(r<n.count)){var o=void 0,i=void 0;n.forEach(function(e,t){(void 0===o||e.top<o)&&(o=e.top,i=t)});var a=n[i];n.count++,e.style.position="absolute",e.style.top=a.top+t[0]+"px",e.style.left=a.left+t[1]+"px",a.top+=e.offsetHeight+2*t[1]}});var v=void 0;n.forEach(function(e){(void 0===v||e.top>v)&&(v=e.top)}),e.style.height=v+"px"}}},reset:function(){n=null,e.innerHTML=""}};return o}();