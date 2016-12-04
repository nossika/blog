(()=>{
    const server = 'http://localhost:7869';

    const fns = {
        init_nav: () => {
            let nav = document.querySelector('#nav'),
                at = nav.getAttribute('data-at');
            let nav_items = [].slice.call(document.querySelectorAll('#nav .nav-item'));
            nav_items.forEach((item, index) => {
                let href = item.getAttribute('href'),
                    name = item.getAttribute('data-nav');
                let theme = item.getAttribute('data-theme');
                if(name === at) {
                    fns.switch_nav(name);
                    history.replaceState({
                        nav: name
                    }, name, href)
                }

                let theme_preview = item.querySelector('.color');
                theme_preview.style.background = theme;

                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    let target = e.target;
                    while(!target.getAttribute('data-nav')){
                        target = target.parentNode;
                    }
                    if(target.classList.contains('at')) return;
                    let href = item.getAttribute('href'),
                        name = item.getAttribute('data-nav');
                    fns.switch_nav(name);
                    fns.render_part(name, () => {
                        history.pushState({
                            nav: name
                        }, name, href)
                    });
                });
            });
            window.addEventListener('popstate', (e) => {
                let state = e.state;
                fns.switch_nav(state.nav);
                fns.render_part(state.nav);
            });
        },
        switch_nav: (nav_name) => {
            [].slice.call(document.querySelectorAll('#nav .nav-item')).forEach((item) => {
                item.classList.remove('at');
                if(nav_name === item.getAttribute('data-nav')){
                    item.classList.add('at');
                    let theme = item.getAttribute('data-theme');
                    document.body.style.backgroundColor = theme;
                    if(FloatUtil){
                        let [r, g, b] = [255,255,255]||Util.hex_to_rgb(theme);
                        FloatUtil.set_style({
                            line: {r:r,g:g,b:b},
                            dot: {r:r,g:g,b:b,a:1},
                        })
                    }
                }
            });
        },
        render_part: (part, cb) => {
            let container = document.querySelector('#content');
            // waiting animation;
            Util.ajax({
                url: `${server}/tool/view_part`,
                data: {
                    part: part
                },
                callback: (data, status)=>{
                    let temp_html = document.createElement('div');
                    temp_html.innerHTML = data;
                    let scripts = [];
                    [].slice.call(temp_html.querySelectorAll('script')).forEach((script) => {
                        if(script.getAttribute('src')){
                            scripts.push({
                                type: 'src',
                                data: script.getAttribute('src')
                            });
                        }else {
                            scripts.push({
                                type: 'text',
                                data: script.innerText
                            });
                        }
                        script.parentNode.removeChild(script);
                    });
                    container.innerHTML = temp_html.innerHTML;
                    scripts.forEach((s) => {
                        let script = document.createElement('script');
                        if(s.type === 'src') {
                            script.setAttribute('src', s.data);
                        }else {
                            script.innerText = s.data;
                        }
                        container.appendChild(script);
                    });
                    (cb||function(){})(status);
                }
            });
        },
        init_popup: ()=> {
            document.body.addEventListener('click', (e) => {
                let top = e.target;
                while(top !== document.body && !top.classList.contains('popup')){
                    top = top.parentNode;
                }
                if(top !== document.body) return;
                [].slice.call(document.querySelectorAll('.popup')).forEach((list) => {
                    list.parentNode.removeChild(list);
                });
            });
        }
    };
    const _themes = [
        '#81C7D4',
        '#7DB9DE',
        '#FFFFFB',
        '#BDC0BA',
        '#A5DEE4',
        '#66BAB7',
        '#808F7C',
        '#A8D8B9',
        '#B5CAA0',
        '#91AD70',
        '#B1B479',
        '#D9CD90',
        '#ECB88A',
        '#554236',
        '#F0A986',
        '#947A6D',
        '#4A225D',
        '#B9887D',
    ];

    PlayerUtil.get_list((list) => {
        PlayerUtil.init_player({
            id: 'player',
            list: list
        });
    });

    FloatUtil.init_float(document.querySelector('#nav_canvas').getContext('2d'),{

    });
    fns.init_popup();
    setTimeout(()=>{
        fns.init_nav();
    },0);
    let nav = document.querySelector('#nav');
    // nav.style.display ='none'
    let nav_canvas = document.querySelector('#nav_canvas');
    nav.addEventListener('click', (e) => {
        FloatUtil.canvas_click({
            offsetX: e.offsetX + e.target.offsetLeft,
            offsetY: e.offsetY + e.target.offsetTop
        })
    });
    nav.addEventListener('mousemove', (e) => {
        FloatUtil.canvas_mousemove({
            offsetX: e.offsetX + e.target.offsetLeft,
            offsetY: e.offsetY + e.target.offsetTop
        })
    });
    nav.addEventListener('mouseleave', (e) => {
        FloatUtil.canvas_mouseleave();
    });

})();


document.addEventListener('keyup', (e) => {
    if(e.keyCode === 37){
        let canvas = document.querySelector('#nav_canvas');
        let data = canvas.toDataURL();
        let div = document.createElement('div');
        div.innerHTML = '<a id="a" href="'+data+'" download>fwefew</a>'
        document.body.appendChild(div);
        let a = document.querySelector('#a');
        a.click();
        a.parentNode.removeChild(a);
    }
});





