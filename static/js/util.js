"use strict";
window.Util = (()=>{
    class Bar {
        constructor(container, config = {}) {
            this._value = config.default || 0;
            this._ori = container.offsetHeight > container.offsetWidth ? 'y' : 'x';
            this._non_overflow = config.non_overflow || false;
            this._hide_dot = config.hide_dot || false;
            this._hide_bar = config.hide_bar || false;
            this._disabled = config.disabled || false;

            let bar_container = document.createElement('div');

            let bar = document.createElement('div');
            bar_container.appendChild(bar);

            let dot = document.createElement('div');

            bar_container.appendChild(dot);
            container.appendChild(bar_container);

            let _origin = {
                client: 0,
                value: 0,
            };

            let dot_mdown = (e) => {
                if(this._disabled) return;
                _origin.client = this._ori === 'x' ? e.clientX : e.clientY;
                _origin.value = this._value;
                document.addEventListener('mousemove', dot_mmove);
                document.addEventListener('mouseup', dot_mup);
                (this.event.begin||function(){})();
                e.preventDefault();
                e.stopPropagation();
                return false;
            };
            let dot_mmove = (e) => {
                let value = _origin.value + ((this._ori === 'x' ? e.clientX  - _origin.client : _origin.client - e.clientY)) / (this._bar_len - (!this._non_overflow ? 0 : this._dot_rad * 2));
                this.set_value(value);
                (this.event.drag||function(){})();
            };
            let dot_mup = (e) => {
                document.removeEventListener('mousemove', dot_mmove);
                document.removeEventListener('mouseup', dot_mup);
                (this.event.end||function(){})();
            };

            dot.addEventListener('mousedown', dot_mdown);
            bar_container.addEventListener('mousedown', (e) => {
                if(this._disabled) return;
                let [offset_x, offset_y] = [e.offsetX, this._bar_len - e.offsetY];
                let target = e.target;
                if(target !== bar_container){
                    offset_x += target.offsetLeft;
                    offset_y -= target.offsetTop;
                }
                let e_offset = this._ori === 'x' ? offset_x : offset_y;
                let value = !this._non_overflow ? e_offset / this._bar_len : (e_offset - this._dot_rad) / (this._bar_len - this._dot_rad * 2);
                this.set_value(value);
                dot_mdown(e);
                (this.event.click||function(){})();
            });

            this.elem = {
                dot: dot,
                bar_container: bar_container,
                bar: bar,
            };
            this.event = {
                begin: null,
                drag: null,
                end: null,
                click: null,
                change: null
            };
            this.update();
        }
        set_value(value, type) {
            if(Object.prototype.toString.call(value) !== '[object Number]') return;
            value = value > 1 ? 1 : (value < 0 ? 0 : value);
            this.elem.dot.style[this._ori === 'x' ? 'left' : 'bottom'] = `calc(${value * 100 * (!this._non_overflow ? 1 : (1 - this._dot_rad * 2 / this._bar_len))}% - ${!this._non_overflow ? this._dot_rad : 0}px)`;
            this.elem.bar.style[this._ori === 'x' ? 'width' : 'height'] = `${value*100}%`;
            if(this._value !== value) {
                (this.event.change||function(){})(value, type)
            };
            this._value = value;
        };
        update() {
            this._ori = this.elem.bar_container.offsetHeight > this.elem.bar_container.offsetWidth ? 'y' : 'x';
            let bar_container_style = this.elem.bar_container.style;
            bar_container_style.position = 'relative';
            bar_container_style.height = '100%';
            bar_container_style.width = '100%';
            let bar_style = this.elem.bar.style;
            bar_style.position = 'absolute';
            bar_style.height = '100%';
            bar_style.width = '100%';
            bar_style.left = '0';
            bar_style.bottom = '0';
            bar_style.display = this._hide_bar ? 'none' : 'block';
            let dot_style = this.elem.dot.style;
            dot_style.position = 'absolute';
            dot_style.left = `calc(50% - ${this.elem.dot.offsetWidth / 2}px)`;
            dot_style.bottom = `calc(50% - ${this.elem.dot.offsetHeight / 2}px)`;
            dot_style.display = this._hide_dot ? 'none' : 'block';
            this._dot_rad = (this._ori === 'x' ? this.elem.dot.offsetWidth : this.elem.dot.offsetHeight) / 2;
            this._bar_len = (this._ori === 'x' ? this.elem.bar_container.offsetWidth : this.elem.bar_container.offsetHeight);
            this.set_value(this._value);
        }
        enable() {
            this._disabled = false;
        }
        disable() {
            this._disabled = true;
        }
        hide_dot() {
            this._hide_dot = true;
        }
        show_dot() {
            this._hide_dot = false;
        }
        hide_bar() {
            this._hide_bar = true;
        }
        show_bar() {
            this._hide_bar = false;
        }
        set value(value) {
            this.set_value(value, 'manual')
        }
        get value() {
            return this._value;
        }
    }

    let Util = {
        Bar: Bar,
        hex_to_rgb: (hex) => {
            hex = (hex + '').replace('#','');
            return [parseInt(hex.slice(0,2),16), parseInt(hex.slice(2,4),16), parseInt(hex.slice(4,6),16)]
        },
        ajax: (config) => {
            let method = (config.method || 'GET').toUpperCase();
            let url = config.url;
            let data = config.data || {};
            let header = config.header || {};
            let callback = config.callback || function(){};

            try{
                let XHR = new XMLHttpRequest();
                let data_arr = [];
                for(let key in data){
                    data_arr.push(key+'='+data[key]);
                }
                let data_str = data_arr.join('&');

                let body;
                if(method === 'GET'){
                    url += '?' + data_str;
                    body = null;
                }else if(method === 'POST'){
                    body = data_str;
                }else{
                    throw 'only get/post available';
                }

                XHR.onreadystatechange = function(){
                    if(XHR.readyState === 4){
                        callback(XHR.responseText,XHR.status);
                    }
                };
                XHR.open(method,url);
                for(let i in header){
                    XHR.setRequestHeader(i, header[i]);
                }
                XHR.send(body);
            }catch (e){
                console.log(e);
            }
        },
        view_load:(source, container, call_back) => {
            var regText = function(d) {
                var bodyTag = new RegExp("<body[^>]*?>([\\s\\S]*?)<\/body>", "gm");
                d.match(bodyTag);
                if (container) {
                    container.innerHTML = RegExp.$1;
                    var scriptTag = new RegExp("<script[^>]*?>([\\s\\S]*?)<\/script>", "gm");
                    try {
                        (d.match(scriptTag)||[]).forEach(function(i) {
                            i.match(scriptTag);
                            eval(RegExp.$1);
                        });
                    } catch (e) {
                        console.error('【加载html脚本错误:' + source + '】' + e.stack);
                    }
                } else {
                    console.log("加载容器不存在")
                }
            };
            Util.ajax({
                url:source,
                callback:function(data){
                    regText(data);
                    (call_back || function() {})();
                }
            })
        },
        sync: (generator) => {
            let g = generator();
            let run = (promise) => {
                if(!promise) return;
                promise.then((value)=>{
                    run(g.next(value).value);
                });
            };
            run(g.next().value);
        },
        sync_fn: (fn) => {
            return new Promise((res) => {
                fn(res);
            });
        },
        sync_timeout: (ms) => {
            return new Promise((res) => {
                setTimeout(()=>{
                    res(+new Date())
                }, ms);
            });
        },
        sync_test: () => {
            Util.sync(function*(){
                console.log(1);
                let a = yield Util.sync_timeout(3222);
                console.log(2, a);
                let b = yield Util.sync_timeout(2222);
                console.log(3, b);
                yield Util.sync_timeout(3222);
                console.log(4, a - b);
                let c = yield Util.sync_fn((next)=>{
                    setTimeout(()=>{
                        next('haha')
                    },2000)
                });
                console.log(c);
            });
        }
    };
    return Util;
})();

