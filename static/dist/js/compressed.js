"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _toConsumableArray(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _toConsumableArray(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}();window.Util=function(){var e=function(){function e(t){var n=this,a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};_classCallCheck(this,e),this._value=a.default||0,this._ori=t.offsetHeight>t.offsetWidth?"y":"x",this._non_overflow=a.non_overflow||!1,this._hide_dot=a.hide_dot||!1,this._hide_bar=a.hide_bar||!1,this._disabled=a.disabled||!1;var i=document.createElement("div"),o=document.createElement("div");i.appendChild(o);var r=document.createElement("div");i.appendChild(r),t.appendChild(i);var l={client:0,value:0},s=function(e){if(!n._disabled)return l.client="x"===n._ori?e.clientX:e.clientY,l.value=n._value,document.addEventListener("mousemove",c),document.addEventListener("mouseup",d),(n.event.begin||function(){})(),e.preventDefault(),e.stopPropagation(),!1},c=function(e){var t=l.value+("x"===n._ori?e.clientX-l.client:l.client-e.clientY)/(n._bar_len-(n._non_overflow?2*n._dot_rad:0));n.set_value(t),(n.event.drag||function(){})()},d=function e(t){document.removeEventListener("mousemove",c),document.removeEventListener("mouseup",e),(n.event.end||function(){})()};r.addEventListener("mousedown",s),i.addEventListener("mousedown",function(e){if(!n._disabled){var t=[e.offsetX,n._bar_len-e.offsetY],a=t[0],o=t[1],r=e.target;r!==i&&(a+=r.offsetLeft,o-=r.offsetTop);var l="x"===n._ori?a:o,c=n._non_overflow?(l-n._dot_rad)/(n._bar_len-2*n._dot_rad):l/n._bar_len;n.set_value(c),s(e),(n.event.click||function(){})()}}),this.elem={dot:r,bar_container:i,bar:o},this.event={begin:null,drag:null,end:null,click:null,change:null},this.update()}return _createClass(e,[{key:"set_value",value:function(e,t){"[object Number]"===Object.prototype.toString.call(e)&&(e=e>1?1:e<0?0:e,this.elem.dot.style["x"===this._ori?"left":"bottom"]="calc("+100*e*(this._non_overflow?1-2*this._dot_rad/this._bar_len:1)+"% - "+(this._non_overflow?0:this._dot_rad)+"px)",this.elem.bar.style["x"===this._ori?"width":"height"]=100*e+"%",this._value!==e&&(this.event.change||function(){})(e,t),this._value=e)}},{key:"update",value:function(){this._ori=this.elem.bar_container.offsetHeight>this.elem.bar_container.offsetWidth?"y":"x";var e=this.elem.bar_container.style;e.position="relative",e.height="100%",e.width="100%";var t=this.elem.bar.style;t.position="absolute",t.height="100%",t.width="100%",t.left="0",t.bottom="0",t.display=this._hide_bar?"none":"block";var n=this.elem.dot.style;n.position="absolute",n.left="calc(50% - "+this.elem.dot.offsetWidth/2+"px)",n.bottom="calc(50% - "+this.elem.dot.offsetHeight/2+"px)",n.display=this._hide_dot?"none":"block",this._dot_rad=("x"===this._ori?this.elem.dot.offsetWidth:this.elem.dot.offsetHeight)/2,this._bar_len="x"===this._ori?this.elem.bar_container.offsetWidth:this.elem.bar_container.offsetHeight,this.set_value(this._value)}},{key:"enable",value:function(){this._disabled=!1}},{key:"disable",value:function(){this._disabled=!0}},{key:"hide_dot",value:function(){this._hide_dot=!0}},{key:"show_dot",value:function(){this._hide_dot=!1}},{key:"hide_bar",value:function(){this._hide_bar=!0}},{key:"show_bar",value:function(){this._hide_bar=!1}},{key:"value",set:function(e){this.set_value(e,"manual")},get:function(){return this._value}}]),e}(),t={Bar:e,hex_to_rgb:function(e){return e=(e+"").replace("#",""),[parseInt(e.slice(0,2),16),parseInt(e.slice(2,4),16),parseInt(e.slice(4,6),16)]},ajax:function(e){var t=(e.method||"GET").toUpperCase(),n=e.url,a=e.data||{},i=e.header||{},o=e.callback||function(){};try{!function(){var e=new XMLHttpRequest,r=[];for(var l in a)r.push(l+"="+a[l]);var s=r.join("&"),c=void 0;if("GET"===t)n+="?"+s,c=null;else{if("POST"!==t)throw"only get/post available";c=s}e.onreadystatechange=function(){4===e.readyState&&o(e.responseText,e.status)},e.open(t,n);for(var d in i)e.setRequestHeader(d,i[d]);e.send(c)}()}catch(e){console.log(e)}},shuffle_arr:function(e){e=e.slice();for(var t=[];e.length;)t.push(e.splice(Math.floor(Math.random()*e.length),1)[0]);return t},btn_popup:function(e,t){var n=t.w||100,a=t.h||100,i=t.mode||0,o=t.offset||0,r=document.createElement("div");r.className="popup default";var l=e.clientX-e.offsetX,s=e.clientY-e.offsetY,c=[e.target.offsetWidth,e.target.offsetHeight],d=c[0],u=c[1];switch(i){case 0:s+u+o+a>document.body.clientHeight?s-=o+a:s+=u+o,l+n>document.body.clientWidth&&(l-=n-d);break;case 1:l+d+o+n>document.body.clientWidth?l-=o+n:l+=d+o,s+a>document.body.clientHeight&&(s-=a-u)}return r.style.cssText="position: fixed; top: "+s+"px; left: "+l+"px; width: "+n+"px; height: "+a+"px",r},sync:function(e){var t=e(),n=function e(n){n&&n.then(function(n){e(t.next(n).value)})};n(t.next().value)},sync_fn:function(e){return new Promise(function(t){e(t)})},sync_timeout:function(e){return new Promise(function(t){setTimeout(function(){t(+new Date)},e)})},sync_test:function(){t.sync(regeneratorRuntime.mark(function e(){var n,a,i;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return console.log(1),e.next=3,t.sync_timeout(3222);case 3:return n=e.sent,console.log(2,n),e.next=7,t.sync_timeout(2222);case 7:return a=e.sent,console.log(3,a),e.next=11,t.sync_timeout(3222);case 11:return console.log(4,n-a),e.next=14,t.sync_fn(function(e){setTimeout(function(){e("haha")},2e3)});case 14:i=e.sent,console.log(i);case 16:case"end":return e.stop()}},e,this)}))}};return t}(),window.ColorPicker=function(){var e=void 0,t={},n={container:function e(){var e=document.createElement("div");return e.className="color-picker",e},color_block:function e(t,n,a,i){var e=document.createElement("div");return e.className="color-block",e.style.backgroundColor="rgba("+t+", "+n+", "+a+", "+(void 0===i?1:i)+")",e.rgba=[t,n,a,i],e},color_getter:regeneratorRuntime.mark(function e(t){var n,a,i;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:n=0;case 1:if(!(n<=256)){e.next=17;break}a=0;case 3:if(!(a<=256)){e.next=14;break}i=0;case 5:if(!(i<=256)){e.next=11;break}return e.next=8,[n,a,i];case 8:i+=t,e.next=5;break;case 11:a+=t,e.next=3;break;case 14:n+=t,e.next=1;break;case 17:case"end":return e.stop()}},e,this)}),init:function(){var a=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};e=n.container(),t=a.callbacks||t,n.event();for(var i=[],o=n.color_getter(64),r=o.next().value;r;)i.push(r),r=o.next().value;if(a.color_none){var l=n.color_block(255,255,255,0);l.innerText="X",l.classList.add("none"),e.appendChild(l)}return i.sort(function(e,t){return e[0]+e[1]+e[2]<t[0]+t[1]+t[2]?1:-1}).forEach(function(t){e.appendChild(n.color_block.apply(n,_toConsumableArray(t)))}),e},event:function(){e.addEventListener("click",function(n){for(var a=n.target;a!==e&&!a.classList.contains("color-block");)a=a.parentNode;a.classList.contains("color-block")&&(t.onpick||function(){})(a.rgba)})}};return n}(),window.FloatUtil=function(){var e=new Set,t={link_dis:100,click_dot:3,v_max:6,max_dot:20,border_extend:30,r:1.2};Object.seal(t);var n={line:{r:1,g:2,b:100},line_w:.4,dot:{r:100,g:50,b:50,a:1}},a=null,i=0,o=0,r=null,l=function e(t){_classCallCheck(this,e),this.x=t.x||0,this.y=t.y||0,this.v_x=t.v_x||0,this.v_y=t.v_y||0,this.r=t.r||0},s={init_float:function(e){arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};a=e,s.set_size(),s.canvas_event(),s.auto_add_dot(),s.animate()},canvas_event:function(){["mousemove","mouseleave","click"].forEach(function(e){a.canvas.removeEventListener(e,s["canvas_"+e]),a.canvas.addEventListener(e,s["canvas_"+e])})},canvas_mousemove:function(t){var n=[t.offsetX,t.offsetY],a=n[0],i=n[1];return r?(r.x=a,void(r.y=i)):(r=new l({x:a,y:i}),void e.add(r))},canvas_mouseleave:function(t){e.delete(r),r=null},canvas_click:function(n){for(var a=[n.offsetX,n.offsetY],i=a[0],o=a[1],r=0;r<t.click_dot;r++)e.add(new l({x:i,y:o,v_x:s.random_num(t.v_max,2)*(Math.random()>.5?-1:1)/10,v_y:s.random_num(t.v_max,2)*(Math.random()>.5?-1:1)/10,r:t.r}))},animate:function(){var e=function e(){s.clear(),s.update(),s.render(),requestAnimationFrame(e)};requestAnimationFrame(e)},update:function(){var n=0-t.border_extend,a=i+t.border_extend,r=o+t.border_extend,l=0-t.border_extend;e.forEach(function(i){if(i.x=i.x+i.v_x,i.y=i.y+i.v_y,i.x<l||i.x>a||i.y<n||i.y>r){if(e.delete(i),e.size>t.max_dot)return;s.add_random_dot()}})},render:function(){var i=new Set;e.forEach(function(e){a.beginPath(),a.moveTo(e.x,e.y),a.arc(e.x,e.y,e.r,0,2*Math.PI),a.closePath(),a.fillStyle="rgba("+n.dot.r+","+n.dot.g+","+n.dot.b+",1)",a.fill(),i.add(e),i.forEach(function(i){if(i!==e){var o=Math.pow(Math.pow(e.x-i.x,2)+Math.pow(e.y-i.y,2),.5);o>t.link_dis||(a.beginPath(),a.moveTo(e.x,e.y),a.lineTo(i.x,i.y),a.closePath(),a.strokeStyle="rgba("+n.line.r+","+n.line.g+","+n.line.b+","+2*(1-o/t.link_dis)+")",a.lineWidth=n.line_w,a.stroke())}})})},random_num:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return Math.floor(t+Math.random()*(e+1))},auto_add_dot:function(){setInterval(function(){e.size>t.max_dot||s.add_random_dot()},500)},add_random_dot:function(){var n=[s.random_num(i),s.random_num(o),s.random_num(t.v_max,1)*(Math.random()>.5?-1:1)/10,s.random_num(t.v_max,1)*(Math.random()>.5?-1:1)/10],a=n[0],r=n[1],c=n[2],d=n[3];switch(s.random_num(3)){case 0:r=0,d=Math.abs(d);break;case 1:a=i,c=-Math.abs(c);break;case 2:r=o,d=-Math.abs(d);break;case 3:a=0,c=Math.abs(c)}e.add(new l({x:a,y:r,v_x:c,v_y:d,r:t.r}))},set_style:function(e){e=JSON.parse(JSON.stringify(e));for(var t in e)n[t]=e[t]},set_size:function(e){a&&(i=a.canvas.offsetWidth,o=a.canvas.offsetHeight,a.canvas.width=i,a.canvas.height=o)},clear:function(){a.clearRect(0,0,i,o)},Dot:l,dot_list:e};return window.addEventListener("resize",s.set_size),window.requestAnimationFrame=window.requestAnimationFrame||function(e){setTimeout(e,1e3/60)},s}(),window.addEventListener("keyup",function(){});var _slicedToArray=function(){function e(e,t){var n=[],a=!0,i=!1,o=void 0;try{for(var r,l=e[Symbol.iterator]();!(a=(r=l.next()).done)&&(n.push(r.value),!t||n.length!==t);a=!0);}catch(e){i=!0,o=e}finally{try{!a&&l.return&&l.return()}finally{if(i)throw o}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}();window.GraffitiUtil=function(){var e=[],t=null,n=null,a=0,i=0,o="line",r=2,l="rgba(33,33,33,0.5)",s="rgba(55,33,222,0)",c={init_editor:function(e){n=e,c.set_size(),c.canvas_event()},set_size:function(){n&&(a=n.canvas.offsetWidth,i=n.canvas.offsetHeight,n.canvas.width=a,n.canvas.height=i,c.draw_canvas(e,n))},canvas_event:function(){n.canvas.addEventListener("mousedown",function(e){e.preventDefault(),t={shape:o,width:r,stroke:l,fill:s,points:[]},c.painting(e),n.canvas.addEventListener("mousemove",c.painting),document.addEventListener("mouseup",c.stop_painting)})},painting:function(a){t.points.push([a.offsetX,a.offsetY]),c.draw_canvas(e.concat([t]),n,!0)},stop_painting:function(a){t.points=d[t.shape].pick(t.points),e.push(t),c.draw_canvas(e,n),n.canvas.removeEventListener("mousemove",c.painting),document.removeEventListener("mouseup",c.stop_painting)},undo_paint:function(){e.pop(),c.draw_canvas(e,n)},draw_canvas:function(e,t,a){t.clearRect(0,0,n.canvas.width,n.canvas.height),e.forEach(function(n,i){d[n.shape].draw(n,t,a&&i===e.length-1)})},download_png:function(){var e=n.canvas.toDataURL(),t=document.createElement("a");t.setAttribute("href",e),t.setAttribute("download","canvas.png"),t.click()},get_point_range:function(e){var t=[],n=t[0],a=t[1],i=t[2],o=t[3];return e.forEach(function(e){e.points.forEach(function(e){var t=_slicedToArray(e,2),r=t[0],l=t[1];void 0===n?(n=a=r,i=o=l):(n=r<n?r:n,i=l<i?l:i,a=r>a?r:a,o=l>o?l:o)})}),[n,i,a,o]},get_data:function(){return e},get_size:function(){return{w:a,h:i}},set_shape:function(e){o=e},set_width:function(e){r=e},set_stroke:function(e){l=e},set_fill:function(e){s=e}},d={line:{draw:function(e,t){t.beginPath(),e.points.forEach(function(e){var n=_slicedToArray(e,2),a=n[0],i=n[1];t.lineTo(a,i)}),t.lineWidth=e.width,t.strokeStyle=e.stroke,t.stroke()},pick:function(e){return e}},straight:{draw:function(e,t){var n=d.straight.pick(e.points),a=_slicedToArray(n,2),i=a[0],o=a[1];t.beginPath(),t.moveTo.apply(t,_toConsumableArray(i)),t.lineTo.apply(t,_toConsumableArray(o)),t.lineWidth=e.width,t.strokeStyle=e.stroke,t.stroke()},pick:function(e){return[e[0],e[e.length-1]]}},circle:{draw:function(e,t,n){var a=d.circle.pick(e.points),i=_slicedToArray(a,2),o=i[0],r=i[1];n&&d.line.draw({points:[o,r],width:1,stroke:"rgba(0,0,0,0.3)"},t);var l=[o[0],o[1],r[0]-o[0],r[1]-o[1]],s=l[0],c=l[1],u=l[2],f=l[3],v=Math.abs(Math.min(u,f)),h=u/v,p=f/v;t.beginPath(),t.save(),t.scale(h,p),t.arc(s/h,c/p,v,0,2*Math.PI),t.closePath(),t.restore(),t.lineWidth=e.width,t.strokeStyle=e.stroke,t.fillStyle=e.fill,t.stroke(),t.fill()},pick:function(e){return[e[0],e[e.length-1]]}},rectangle:{draw:function(e,t,n){var a=d.rectangle.pick(e.points),i=_slicedToArray(a,2),o=i[0],r=i[1];n&&d.line.draw({points:[o,r],width:1,stroke:"rgba(0,0,0,0.3)"},t),t.beginPath(),t.rect(o[0],o[1],r[0]-o[0],r[1]-o[1]),t.closePath(),t.lineWidth=e.width,t.strokeStyle=e.stroke,t.fillStyle=e.fill,t.stroke(),t.fill()},pick:function(e){return[e[0],e[e.length-1]]}},triangle:{draw:function(e,t,n){var a=d.triangle.pick(e.points),i=_slicedToArray(a,3),o=i[0],r=i[1],l=i[2];n&&d.line.draw({points:e.points,width:1,stroke:"rgba(0,0,0,0.3)"},t),t.beginPath(),[o,r,l].forEach(function(e){var n=_slicedToArray(e,2),a=n[0],i=n[1];t.lineTo(a,i)}),t.closePath(),t.lineWidth=e.width,t.strokeStyle=e.stroke,t.fillStyle=e.fill,t.stroke(),t.fill()},pick:function(e){var t=[e[0],e[0],e[e.length-1]],n=t[0],a=t[1],i=t[2],o=(i[1]-n[1])/(i[0]-n[0]),r=0;return e.forEach(function(e){var t=_slicedToArray(e,2),i=t[0],l=t[1],s=Math.abs(i-n[0]+-1/o*(l-n[1]));s>r&&(r=s,a=[i,l])}),[n,a,i]}},eraser:{draw:function(e,t,n){t.beginPath(),e.points.forEach(function(e){var n=_slicedToArray(e,2),a=n[0],i=n[1];t.clearRect(a-5,i-5,10,10)})},pick:function(e){return e}}};return window.addEventListener("resize",c.set_size),c}(),window.PlayerUtil=function(e){var t="http://localhost:7869",n={mode:"",current:0,list:null},a=null,i=null,o={},r={init_player:function(e){r.player_render(e),r.player_events(e),r.switch_mode("normal"),r.set_volume(.8),n.list.length&&r.play("random")},player_render:function(e){a=document.createElement("section"),a.id=e.id||"player",a.className="collapse",a.innerHTML=r.player_html(),n.list=e.list||[],i=a.querySelector('[data-part="audio"]'),document.body.appendChild(a)},player_events:function(e){r.init_bars();var t=void 0;a.addEventListener("mouseenter",function(){clearTimeout(t),a.classList.remove("collapse")}),a.addEventListener("mouseleave",function(){a.fixed||(t=setTimeout(function(){a.classList.add("collapse");var e=a.querySelector(".volume");e&&e.parentNode.removeChild(e);var t=a.querySelector(".list");t&&t.parentNode.removeChild(t)},3e3))}),a.querySelector('[data-control="next"]').addEventListener("click",function(e){r.play("random"!==n.mode?"next":"random")}),a.querySelector('[data-control="play"]').addEventListener("click",function(e){r[i.paused?"audio_play":"audio_pause"]()}),a.querySelector('[data-control="pre"]').addEventListener("click",function(e){r.play("random"!==n.mode?"pre":"random")}),a.querySelector("[data-mode]").addEventListener("click",function(e){r.switch_mode()}),a.querySelector('[data-control="toggle_volume"]').addEventListener("click",function(e){setTimeout(function(){r.create_volume()},0)}),a.querySelector('[data-control="toggle_list"]').addEventListener("click",function(e){setTimeout(function(){r.create_list()},0)}),i.addEventListener("loadstart",function(e){r.onbegin(e)}),i.addEventListener("loadedmetadata",function(e){r.onloaded(e)}),i.addEventListener("timeupdate",function(e){r.onplay(e)}),i.addEventListener("progress",function(e){r.onbuffer(e)}),i.addEventListener("ended",function(e){r.onend(e)})},init_bars:function(){o.buffered=new e.Bar(a.querySelector('[data-bar="buffered_bar"]'),{hide_dot:!0,disabled:!0}),o.buffered.elem.bar.className="buffered-bar",o.buffered.update(),o.progress=new e.Bar(a.querySelector('[data-bar="progress_bar"]'),{hide_dot:!0,disabled:!0}),o.progress.elem.bar.className="progress-bar",o.progress.update()},play:function(e){var t=void 0;!function(){switch(e){case"next":t=n.current+1,t=t>=n.list.length?0:t;break;case"pre":t=n.current-1,t=t<0?n.list.length-1:t;break;case"again":t=n.current;break;case"random":var a=function e(a){t=Math.floor(Math.random()*n.list.length),a&&t===n.current&&e(a)};a(n.list.length>1)}}(),r.play_index(t)},play_index:function(e){n.current=e,["innerText","title"].forEach(function(e){a.querySelector('[data-info="title"]')[e]=n.list[n.current].title,a.querySelector('[data-info="author"]')[e]=n.list[n.current].author});var t=a.querySelector('[data-info="cover"]');t.src=n.list[n.current].cover,t.onerror=function(e){t.src="/img/default.png",t.onerror=null},i.src=n.list[e].path,o.buffered.value=0,i.load()},audio_play:function(){var e=a.querySelector('[data-control="play"] use');e.setAttribute("xlink:href","#svgpath-audio-pause"),i.play()},audio_pause:function(){var e=a.querySelector('[data-control="play"] use');e.setAttribute("xlink:href","#svgpath-audio-play"),i.pause()},onbegin:function(e){r.update_progress()},onloaded:function(e){r.audio_play(),r.update_progress()},onplay:function(e){r.update_progress()},onbuffer:function(e){for(var t=i.buffered,n=[],a=0;a<t.length;a++)n.push([t.start(a),t.end(a)]);n.length&&(o.buffered.value=n[0][1]/i.duration)},onend:function(e){switch(n.mode){case"normal":r.play("next");break;case"loop":r.play("again");break;case"random":r.play("random")}},switch_mode:function(e){var t=["normal","loop","random"],i=["顺序播放","单曲循环","随机播放"],o=a.querySelector("[data-mode]"),r=o.querySelector("use");e||(e=t[t.indexOf(n.mode)+1],e||(e=t[0])),n.mode=e,r.setAttribute("xlink:href","#svgpath-audio-"+e),o.setAttribute("title",i[t.indexOf(n.mode)])},set_volume:function(e){i.volume=e},update_progress:function(){var e=a.querySelector('[data-info="progress_text"]');e.innerText=r.convert_sec(i.currentTime)+" / "+r.convert_sec(i.duration),o.progress.value=i.duration?i.currentTime/i.duration:0},convert_sec:function(e){e||(e=0),e=parseInt(e);var t=e%60;t=t<10?"0"+t:t;var n=(e-t)/60;return n=n<10?"0"+n:n,n+":"+t},get_list:function(n){e.ajax({url:t+"/tool/music_info",callback:function(e,t){if(200===t){var a=JSON.parse(e);(n||function(){})(a)}}})},player_html:function(){var e='\n            <div class="container">\n                <div data-part="control">\n                    <div class="control-btn pre" data-control="pre" title="上一首 (ctrl + ←)">\n                        <svg viewbox="0 0 1024 1024">\n                            <use xlink:href="#svgpath-audio-pre"/>\n                        </svg>\n                    </div>\n                    <div id="player-play" class="control-btn" data-control="play" title="播放/暂停 (P)">\n                        <svg viewbox="0 0 1024 1024">\n                            <use xlink:href="#svgpath-audio-play"/>\n                        </svg>\n                    </div>\n                    <div class="control-btn next" data-control="next" title="下一首 (ctrl + →)">\n                        <svg viewbox="0 0 1024 1024">\n                            <use xlink:href="#svgpath-audio-next"/>\n                        </svg>\n                    </div>\n                </div>\n                <div data-part="cover">\n                    <div class="cover-blank"></div>\n                    <div id="player-cover">\n                        <img data-info="cover" src=""/>\n                    </div>\n                </div>\n                <div data-part="main">\n                    <div id="player-info">\n                        <span data-info="title"></span>\n                        <span data-info="author"></span>\n                    </div>\n                    <div>\n                        <div class="info-bar">\n                            <div class="bar" data-bar="buffered_bar"></div>\n                            <div class="bar" data-bar="progress_bar"></div>\n                        </div>\n                        <div id="player-progress" data-info="progress_text"></div>\n                    </div>\n                </div>\n                <div data-part="control2">\n                    <div data-action="toggle_volume" title="音量">\n                        <div class="audio-btn" data-control="toggle_volume">\n                            <svg viewbox="0 0 1024 1024">\n                                <use xlink:href="#svgpath-audio-volume"/>\n                            </svg>\n                        </div>\n                    </div>\n                    <div data-action="mode">\n                        <div class="audio-btn" data-mode="" title="">\n                            <svg viewbox="0 0 1024 1024">\n                                <use xlink:href="#svgpath-audio-normal"/>\n                            </svg>\n                        </div>\n                    </div>\n                    <div data-action="toggle_list" title="播放列表">\n                        <div class="audio-btn" data-control="toggle_list">\n                            <svg viewbox="0 0 1024 1024">\n                                <use xlink:href="#svgpath-audio-list"/>\n                            </svg>\n                        </div>\n                    </div> \n                </div>\n                \n                  \n                <audio data-part="audio"></audio>\n            </div>\n            <svg width="0" height="0">\n                <defs>\n                    <path id="svgpath-audio-next" d="M581.5 512l-273.1-273.1c-25-25-25-65.5 0-90.5s65.5-25 90.5 0l316.7 316.7c12.9 12.9 19.2 30 18.7 47 0.4 16.9-5.8 33.9-18.699 46.8l-316.8 316.8c-25 25-65.5 25-90.5 0s-25-65.5 0-90.5l273.2-273.2z"></path>\n                    <path id="svgpath-audio-pre" d="M442.5 512l273.1 273.1c25 25 25 65.5 0 90.5s-65.5 25-90.5 0L308.4 558.9c-12.9-12.9-19.2-30-18.7-47-0.4-16.9 5.8-33.9 18.7-46.8l316.8-316.8c25-25 65.5-25 90.5 0s25 65.5 0 90.5L442.5 512z"></path>\n                    <path id="svgpath-audio-play" d="M851.2 460.8 224 96c-6.4 0-19.2-6.4-25.6-6.4-12.8 0-19.2 0-32 6.4C147.2 108.8 134.4 128 134.4 153.6l0 729.6c0 19.2 12.8 44.8 32 51.2 6.4 6.4 19.2 6.4 32 6.4 12.8 0 19.2 0 32-6.4l627.2-358.4c19.2-12.8 32-32 32-51.2C883.2 492.8 870.4 467.2 851.2 460.8L851.2 460.8zM851.2 460.8"></path>\n                    <path id="svgpath-audio-pause" d="M740.5967 162.5743c33.9282 0 61.698 34.1053 61.698 75.7924v547.971072c0 41.686-27.7699 75.7821-61.698 75.7821h-30.839808c-33.9292 0-61.6929-34.0961-61.6929-75.7821V238.36672000000002c0-41.687 27.7637-75.7924 61.6929-75.7924H740.596736z M314.2922 162.5743c33.9313 0 61.696 34.1053 61.696 75.7924v547.971072c0 41.686-27.7658 75.7821-61.696 75.7821H283.45651200000003c-33.9343 0-61.698-34.0961-61.698-75.7821V238.36672000000002c0-41.687 27.7637-75.7924 61.698-75.7924H314.29222400000003z"></path>\n                    <path id="svgpath-audio-normal" d="M902.836453 788.242532l0.002047-0.027629 0-0.001023c0-8.088212-3.349281-16.187681-9.06547-21.903869l-85.375459-85.375459c-28.250414-28.250414-72.058153 15.556301-43.806715 43.806715l32.484855 32.492018L153.287175 757.233284c-39.953967 0-39.953967 61.959144 0 61.959144l718.571752 0C888.637056 819.193451 902.821103 805.01759 902.836453 788.242532z M759.588935 271.402293l112.271016 0c26.963095 0 41.037648-33.758871 21.914102-52.883441l-85.375459-85.375459c-28.274974-28.227901-72.061222 15.572674-43.806715 43.827181l32.472576 32.472576-37.474496 0C719.632921 209.44315 719.632921 271.402293 759.588935 271.402293z M636.084063 271.402293l22.448268 0c39.956014 0 39.956014-61.959144 0-61.959144l-22.448268 0C596.128049 209.44315 596.128049 271.402293 636.084063 271.402293z M153.287175 271.402293l392.973116 0c39.956014 0 39.956014-61.959144 0-61.959144L153.287175 209.44315C113.332185 209.44315 113.332185 271.402293 153.287175 271.402293z M902.839523 514.317789c0-8.092305-3.347235-16.184611-9.06547-21.903869l-85.375459-85.375459c-28.274974-28.227901-72.061222 15.572674-43.806715 43.827181l32.472576 32.472576L153.287175 483.338217c-39.956014 0-39.952944 61.959144 0 61.959144l718.571752 0c16.785292 0 30.979572-14.192234 30.979572-30.978549L902.838499 514.317789z"></path>\n                    <path id="svgpath-audio-loop" d="M997.970784 537.255904C997.970784 716.297771 871.695112 895.339639 639.887048 895.339639 534.175614 895.339639 318.66036 895.339639 217.859789 895.339639 213.486052 895.339639 208.984428 895.339639 205.071084 895.339639L182.818737 895.339639 245.176462 957.671787C260.215979 972.736881 260.215979 997.112152 245.176462 1012.151669 230.111368 1027.191186 205.736097 1027.191186 190.69658 1012.151669L63.602431 885.05752C63.346657 884.827324 63.295502 884.494817 63.039728 884.239043 56.00594 877.281988 51.606626 867.639304 51.606626 856.973525 51.606626 846.282167 56.00594 836.665061 63.039728 829.708006 63.295502 829.452232 63.346657 829.119726 63.602431 828.863951L190.69658 701.769803C205.736097 686.730286 230.111368 686.730286 245.176462 701.769803 260.215979 716.80932 260.215979 741.210168 245.176462 756.249685L182.818737 818.60741 205.071084 818.60741C208.779808 818.60741 213.153545 818.60741 217.859789 818.60741 277.941124 818.60741 416.775304 818.60741 588.732229 818.60741 817.317539 818.60741 921.238555 687.523186 921.238555 460.523675L923.821873 460.523675C922.363961 456.482444 921.238555 452.262171 921.238555 447.73497L921.238555 396.580151C921.238555 375.376478 938.426574 358.214036 959.604669 358.214036 980.782765 358.214036 997.970784 375.376478 997.970784 396.580151L997.970784 447.73497C997.970784 452.262171 996.845378 456.482444 995.387465 460.523675L997.970784 460.523675 997.970784 537.255904ZM489.005909 358.214036C494.300433 343.379138 508.137811 332.636626 524.788705 332.636626 545.9668 332.636626 563.154819 349.799068 563.154819 371.002741L563.154819 677.931657C563.154819 699.109752 545.9668 716.297771 524.788705 716.297771 503.61061 716.297771 486.42259 699.109752 486.42259 677.931657L486.42259 434.946265 473.633885 434.946265C452.45579 434.946265 435.267771 417.758246 435.267771 396.580151 435.267771 375.376478 452.45579 358.214036 473.633885 358.214036L489.005909 358.214036ZM960.397569 194.467459 833.30342 321.561608C818.263903 336.601125 793.888632 336.601125 778.849115 321.561608 763.784021 306.522091 763.784021 282.14682 778.849115 267.107303L841.181263 204.749578 818.928916 204.749578C815.220192 204.749578 810.846455 204.749578 806.140211 204.749578 746.058876 204.749578 607.224696 204.749578 435.267771 204.749578 206.682461 204.749578 102.761445 335.833803 102.761445 562.833313L100.178127 562.833313C101.636039 566.874544 102.761445 571.069239 102.761445 575.622018L102.761445 626.776838C102.761445 647.954933 85.573426 665.142952 64.395331 665.142952 43.217235 665.142952 26.029216 647.954933 26.029216 626.776838L26.029216 575.622018C26.029216 571.069239 27.154622 566.874544 28.612535 562.833313L26.029216 562.833313 26.029216 486.101084C26.029216 307.059217 152.330465 128.017349 384.112952 128.017349 489.824386 128.017349 705.33964 128.017349 806.140211 128.017349 810.513948 128.017349 815.015572 128.017349 818.928916 128.017349L841.181263 128.017349 778.849115 65.659624C763.784021 50.620107 763.784021 26.219258 778.849115 11.179742 793.888632-3.859775 818.263903-3.859775 833.30342 11.179742L960.397569 138.299468C960.653343 138.529664 960.704498 138.862171 960.960272 139.117945 967.99406 146.075 972.393374 155.692106 972.393374 166.383463 972.393374 177.049243 967.99406 186.691927 960.960272 193.648982 960.730075 193.904756 960.653343 194.237263 960.397569 194.467459Z"></path>\n                    <path id="svgpath-audio-random" d="M537.728 382.016c55.552-55.04 127.04-79.616 231.808-79.616l5.312 0 0 59.712c0 19.072 13.056 26.24 29.12 15.872l143.68-92.8c16-10.368 15.808-27.072-0.32-37.056l-143.04-88.64c-16.192-10.048-29.44-2.624-29.44 16.448l0 59.392-5.312 0c-122.176 0-210.816 31.424-278.976 99.072C422.208 402.112 420.416 464.896 419.008 515.328c-0.64 21.696-1.152 40.384-6.592 57.472-12.16 38.4-44.032 73.92-89.728 99.904-57.472 32.896-135.04 49.728-224.32 48.768-0.128 0-0.256 0-0.384 0-18.368 0-33.344 14.72-33.536 33.152-0.192 18.496 14.656 33.728 33.152 33.856 2.816 0 5.568 0.128 8.32 0.128 49.408 0 95.872-4.992 138.112-14.72 41.536-9.728 79.168-24.128 111.936-42.752 60.352-34.624 103.104-83.52 120.384-137.984 8.256-26.112 8.96-51.392 9.664-75.84C487.36 470.912 488.448 430.784 537.728 382.016zM98.432 302.464c112.192-1.216 206.016 26.048 264.128 76.8 6.336 5.568 14.208 8.256 22.016 8.256 9.344 0 18.624-3.904 25.28-11.456 12.16-13.952 10.752-35.072-3.2-47.296-33.728-29.504-76.032-52.48-125.504-68.352-54.016-17.344-115.776-25.728-183.488-24.96-18.496 0.192-33.344 15.36-33.152 33.92C64.704 287.808 79.872 302.72 98.432 302.464zM947.328 734.272l-143.04-88.512c-16.192-10.112-29.44-2.624-29.44 16.384l0 59.392-5.312 0c-93.696 0-165.632-28.032-226.368-88.256-13.12-12.992-34.368-12.864-47.36 0.256-13.056 13.12-12.992 34.368 0.128 47.488 73.152 72.384 162.688 107.648 273.6 107.648l5.312 0 0 59.776c0 19.008 13.056 26.24 29.12 15.744l143.68-92.736C963.648 761.024 963.456 744.384 947.328 734.272z"></path>\n                    <path id="svgpath-audio-list" d="M672 625.109333 672 192.085333c0-17.749333 14.421333-32.085333 31.701333-32.085333l128.597333 0c17.493333 0 31.701333 14.208 31.701333 32 0 17.664-14.421333 32-31.701333 32L736 224l0 514.218667c0 0 0 0 0 0-1.194667 69.674667-58.026667 125.781333-128 125.781333-70.698667 0-128-57.301333-128-128s57.301333-128 128-128C631.296 608 653.184 614.229333 672 625.109333L672 625.109333zM160 640c0-17.664 14.506667-32 32.426667-32l191.146667 0c17.92 0 32.426667 14.208 32.426667 32 0 17.664-14.506667 32-32.426667 32L192.426667 672C174.506667 672 160 657.792 160 640zM160 480c0-17.664 14.378667-32 32.213333-32l383.573333 0c17.792 0 32.213333 14.208 32.213333 32 0 17.664-14.378667 32-32.213333 32l-383.573333 0C174.421333 512 160 497.792 160 480zM160 320c0-17.664 14.378667-32 32.213333-32l383.573333 0c17.792 0 32.213333 14.208 32.213333 32 0 17.664-14.378667 32-32.213333 32l-383.573333 0C174.421333 352 160 337.792 160 320z"></path>\n                    <path id="svgpath-audio-volume" d="M838.733994 895.65489l-51.130518-50.346665c79.672574-90.010013 128.306224-207.370954 128.306224-336.173482 0-128.800481-48.632627-246.162446-128.306224-336.172459l51.130518-50.347688c92.624561 102.901625 148.982126 238.20624 148.982126 386.519124C987.71612 657.44865 931.357532 792.753265 838.733994 895.65489zM698.726264 757.852384l-51.103912-50.346665c44.223201-54.354955 70.817905-123.283838 70.817905-198.370976 0-75.085092-26.594705-144.016021-70.817905-198.428282l51.103912-50.28936c57.111742 67.420529 91.51939 154.062841 91.51939 248.717641C790.245653 603.790566 755.838006 690.432879 698.726264 757.852384zM485.05379 791.882432c-11.846816 0-22.675442-3.89061-31.590486-10.279111l-0.086981 0.116657L270.075577 650.479935 90.113879 650.479935c-29.733185 0-53.831023-23.692608-53.831023-53.019541L36.282856 420.809091c0-29.267581 24.040533-52.960189 53.715389-53.018517l0-0.173962 178.539302 0 182.429913-146.919141 0.145309 0.173962c9.29162-7.491625 20.993127-12.136412 33.942043-12.136412 29.761837 0 53.860698 23.691585 53.860698 52.960189l0 159.113881 0 123.692137 0 52.960189 0 53.019541 0 88.382956C538.915511 768.131495 514.81665 791.882432 485.05379 791.882432z"></path>\n                </defs>\n            </svg>\n            ';
return e},list_html:function(e){var t="";return e.list.forEach(function(e,n){t+='\n                <li data-index="'+n+'"><span class="title">'+e.title+'</span> <span class="author">'+e.author+"</span></li>\n                "}),t},create_list:function(){var t=document.createElement("div");t.innerHTML='\n                <div data-part="list" class="list popup">\n                    <div class="list-title">\n                        <span>播放列表</span>\n                    </div>\n                    <div class="list-content">\n                        <div class="list-view">\n                            <ul class="list-ul"></ul>\n                        </div>\n                        <div data-bar="list_bar" class="list-bar"></div> \n                    </div>\n                </div>\n                ';var i=t.querySelector(".list-ul");i.innerHTML=r.list_html({list:n.list});var l=function(e){[].slice.call(i.querySelectorAll("[data-index]")).forEach(function(t){t.classList.remove("at"),+t.getAttribute("data-index")===e&&t.classList.add("at")})};l(n.current),i.addEventListener("click",function(e){for(var t=e.target;"UL"!==t.tagName&&!t.getAttribute("data-index");)t=t.parentNode;var n=t.getAttribute("data-index");n&&(n=+n,l(n),r.play_index(n))}),a.querySelector(".container").appendChild(t),o.list=new e.Bar(a.querySelector('[data-bar="list_bar"]'),{default:1,hide_bar:!0,non_overflow:!0}),o.list.elem.dot.className="list-dot",o.list.update();var s=a.querySelector(".list-view");if(i.addEventListener("mousewheel",function(e){if(!(i.offsetHeight<=s.offsetHeight)){var t=e.deltaY>0?50:-50;o.list.value-=t/(i.offsetHeight-s.offsetHeight)}}),o.list.event.change=function(e,t){var n=(1-e)*(i.offsetHeight-s.offsetHeight);i.style.top=-n+"px"},!o.list.elem.dot.style.height){var c=a.querySelector(".list-view").offsetHeight,d=a.querySelector(".list-ul").offsetHeight;o.list.elem.dot.style.height=c/d*100+"%",d<=c&&o.list.hide_dot()}o.list.update()},create_volume:function(){var t=document.createElement("div");t.innerHTML='\n                <div data-part="volume" class="volume popup">\n                    <div data-bar="volume_bar"></div>\n                </div>\n            ',a.querySelector(".container").appendChild(t),o.volume=new e.Bar(a.querySelector('[data-bar="volume_bar"]'),{default:i.volume}),o.volume.elem.dot.className="volume-dot",o.volume.elem.bar.className="volume-bar",o.volume.update(),o.volume.event.change=function(e){i.volume=e}},fix_player:function(e){a.fixed=e}};return r}(window.Util),window.Waterfall=function(){var e=null,t=[20,20],n=void 0,a=void 0,i=void 0,o={init:function(a,r){var l=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};e=a,i=r,t=l.space||t;var s=a.querySelector(i);n=s.offsetWidth+2*t[1],o.resize()},resize:function(o){if(!o){a=[],a.count=0;for(var r=e.offsetWidth,l=Math.floor(r/n),s=(r-n*l)/2,c=0;c<l;c++){var d={left:s+c*n,top:0};a.push(d)}}var u=[].slice.call(e.querySelectorAll(i));u.forEach(function(e,n){if(!(n<a.count)){var i=void 0,o=void 0;a.forEach(function(e,t){(void 0===i||e.top<i)&&(i=e.top,o=t)});var r=a[o];a.count++,e.style.top=r.top+t[0]+"px",e.style.left=r.left+t[1]+"px",r.top+=e.offsetHeight+2*t[1]}})}};return o}();