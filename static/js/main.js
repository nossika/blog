(()=>{
    const server = 'http://45.119.127.193';

    const FN = {
        init_nav: () => {
            [document.querySelector('#nav'), document.querySelector('#nav2')].forEach((nav, nav_index) => {
                let at = nav.getAttribute('data-at');
                let nav_items = [].slice.call(nav.querySelectorAll('.nav-item'));
                nav_items.forEach((item, index) => {
                    let href = item.getAttribute('href'),
                        name = item.getAttribute('data-nav');
                    let theme = item.getAttribute('data-theme');

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
                        FN.switch_nav(name);
                        FN.render_part(name, () => {
                            history.pushState({
                                nav: name
                            }, name, href)
                        });
                    });

                    if(name === at) {
                        setTimeout(() => {
                            FN.switch_nav(name);
                            history.replaceState({
                                nav: name
                            }, name, href)
                        }, 0)
                    }
                });
            });

            window.addEventListener('popstate', (e) => {
                let state = e.state;
                FN.switch_nav(state.nav);
                FN.render_part(state.nav);
            });
        },
        switch_nav: (nav_name) => {
            if(window.game_socket) window.game_socket.close();
            [document.querySelector('#nav'), document.querySelector('#nav2')].forEach((nav, nav_index) => {
                [].slice.call(nav.querySelectorAll('.nav-item')).forEach((item) => {
                    item.classList.remove('at');
                    if(nav_name === item.getAttribute('data-nav')){
                        item.classList.add('at');
                        if (nav_index === 1) return;
                        let theme = item.getAttribute('data-theme');
                        document.body.style.backgroundColor = theme;
                        if(typeof Float !== 'undefined'){
                            let [r, g, b] = [255,255,255]||Util.hex_to_rgb(theme);
                            Float.set_style({
                                line: {r:r,g:g,b:b},
                                dot: {r:r,g:g,b:b,a:1},
                            })
                        }
                    }
                });
            });

        },
        render_part: (part, cb) => {
            let container = document.querySelector('#main-container');
            // todo: loading animation;
            container.innerHTML = '<div class="loading">loading...</div>';
            Util.ajax({
                url: `/tool/view_part`,
                data: {
                    part: part
                },
                callback: (data, status)=>{
                    if (!data) return;
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
                    cb && cb(status);
                }
            });
        },
        init_main_event: () => {
            document.body.addEventListener('click', (e) => {
                let top = e.target;
                while(top && top !== document && !top.classList.contains('popup')){
                    top = top.parentNode;
                }
                if(top !== document) return;
                [].slice.call(document.querySelectorAll('.popup')).forEach((list) => {
                    list.parentNode.removeChild(list);
                });
            });
            window.addEventListener('scroll', () => {
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
        PlayerUtil.play('random');

    });

    Float.init(document.querySelector('#nav_canvas'),{
    });
    window.addEventListener('resize', Float.set_size);

    FN.init_main_event();
    setTimeout(()=>{
        FN.init_nav();
    },0);

    let nav = document.querySelector('#nav');
    let nav_canvas = document.querySelector('#nav_canvas');

    nav.addEventListener('click', (e) => {
        Float.on_click({
            offsetX: e.offsetX + e.target.offsetLeft,
            offsetY: e.offsetY + e.target.offsetTop
        })
    });
    nav.addEventListener('mousemove', (e) => {
        Float.on_mousemove({
            offsetX: e.offsetX + e.target.offsetLeft,
            offsetY: e.offsetY + e.target.offsetTop
        })
    });
    nav.addEventListener('mouseleave', (e) => {
        Float.on_mouseleave();
    });
})();



