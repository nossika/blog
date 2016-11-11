window.Util = (()=>{
    const server = 'http://localhost:7869';
    let Util = {
        init_nav: () => {
            let nav_items = [].slice.call(document.querySelectorAll('nav .nav-item'));
            nav_items.forEach((item) => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    let target = e.target;
                    if(target.classList.contains('at')) return;
                    nav_items.forEach((item) => {
                        item.classList.remove('at');
                    });
                    target.classList.add('at');
                    let href = target.getAttribute('href'),
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
            // container.innerHTML = 'waiting';
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
