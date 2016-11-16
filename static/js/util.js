"use strict";
window.Util = (()=>{
    const server = 'http://localhost:7869';
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

            let dot_dragging = false;
            let dot_mdown = (e) => {
                if(this._disabled) return;
                dot_dragging = true;
                _origin.client = this._ori === 'x' ? e.clientX : e.clientY;
                _origin.value = this._value;
                document.addEventListener('mousemove', dot_mmove);
                document.addEventListener('mouseup', dot_mup);
                (this.event.begin||function(){})();
            };
            let dot_mmove = (e) => {
                let value = _origin.value + ((this._ori === 'x' ? e.clientX : e.clientY) - _origin.client) / (this._bar_len - (!this._non_overflow ? 0 : this._dot_rad * 2));
                this.set_value(value);
                (this.event.drag||function(){})();
            };
            let dot_mup = (e) => {
                dot_dragging = false;
                document.removeEventListener('mousemove', dot_mmove);
                document.removeEventListener('mouseup', dot_mup);
                (this.event.end||function(){})();
            };

            dot.addEventListener('mousedown', dot_mdown);
            bar_container.addEventListener('mousedown', (e) => {
                if(this._disabled || dot_dragging) return;
                let value = !this._non_overflow ? e.offsetX / this._bar_len : (e.offsetX - this._dot_rad) / (this._bar_len - this._dot_rad * 2);
                this.set_value(value);
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
            };
            this.update();
        }
        set_value(value, callback) {
            if(Object.prototype.toString.call(value) !== '[object Number]') return;
            value = value > 1 ? 1 : (value < 0 ? 0 : value);
            this.elem.dot.style[this._ori === 'x' ? 'left' : 'bottom'] = `calc(${value * 100 * (!this._non_overflow ? 1 : (1 - this._dot_rad * 2 / this._bar_len))}% - ${!this._non_overflow ? this._dot_rad : 0}px)`;
            this.elem.bar.style[this._ori === 'x' ? 'width' : 'height'] = `${value*100}%`;
            this._value = value;
            (callback||function(){})();
        };
        update() {
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
            this.set_value(value)
        }
        get value() {
            return this._value;
        }
    }
    let Util = {
        init_nav: () => {
            let nav_items = [].slice.call(document.querySelectorAll('nav .nav-item'));
            nav_items.forEach((item) => {
                if(item.classList.contains('at')){
                    let href = item.getAttribute('href'),
                        name = href.replace('/','');
                    history.replaceState({
                        nav: name
                    }, name, href)
                }
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    if(item.classList.contains('at')) return;
                    nav_items.forEach((item) => {
                        item.classList.remove('at');
                    });
                    item.classList.add('at');
                    let href = item.getAttribute('href'),
                        name = href.replace('/','');
                    Util.render_part(name, () => {
                        history.pushState({
                            nav: name
                        }, name, href)
                    });
                });

            });
            window.addEventListener('popstate', (e) => {
                let state = e.state;
                Util.render_part(state.nav);
            });
        },
        render_part: (part, cb) => {
            part = part || 'index';
            let container = document.querySelector('#content');
            // waiting animation;
            Util.ajax({
                url: `${server}/tool/view_part`,
                data: {
                    part: part
                },
                callback: (data, status)=>{
                    container.innerHTML = data;
                    (cb||function(){})(status);
                }
            });
        },
        Bar: Bar,
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
    };
    return Util;
})();
