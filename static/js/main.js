(()=>{
    const server = 'http://localhost:7869';

    const fns = {
        init_nav: () => {
            let nav_items = [].slice.call(document.querySelectorAll('nav .nav-item'));
            nav_items.forEach((item, index) => {
                if(item.classList.contains('at')){
                    let href = item.getAttribute('href'),
                        name = href.replace('/','');
                    fns.set_theme(item.getAttribute('data-theme'));
                    history.replaceState({
                        nav: name
                    }, name, href)
                }
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    if(item.classList.contains('at')) return;
                    fns.set_theme(item.getAttribute('data-theme'));

                    nav_items.forEach((item) => {
                        item.classList.remove('at');
                    });
                    item.classList.add('at');
                    let href = item.getAttribute('href'),
                        name = href.replace('/','');
                    fns.render_part(name, () => {
                        history.pushState({
                            nav: name
                        }, name, href)
                    });
                });
                item.addEventListener('mouseenter', (e) => {
                    console.log(e.target,1)
                });
                item.addEventListener('mouseleave', (e) => {
                    console.log(e.target,2)
                });

            });
            window.addEventListener('popstate', (e) => {
                let state = e.state;
                fns.render_part(state.nav);
            });
        },
        set_theme: (theme) => {
            document.body.style.backgroundColor = theme;
            if(FloatUtil){
                let [r, g, b] = [255,255,255]||Util.hex_to_rgb(theme);
                FloatUtil.set_style({
                    line: {r:r,g:g,b:b},
                    dot: {r:r,g:g,b:b,a:1},
                })
            }
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
                    let temp_html = document.createElement('div');
                    temp_html.innerHTML = data;
                    let scripts = [];
                    [].slice.call(temp_html.querySelectorAll('script')).forEach((script) => {
                        scripts.push(script.innerText);
                        script.parentNode.removeChild(script);
                    });
                    container.innerHTML = temp_html.innerHTML;
                    scripts.forEach((script) => {
                        eval(script);
                    });
                    (cb||function(){})(status);
                }
            });
        },
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

    setTimeout(()=>{
        fns.init_nav();
    },0);

    let nav = document.querySelector('#nav');
    let nav_canvas = document.querySelector('#nav_canvas');
    nav.addEventListener('click', (e) => {
        if(e.target === nav_canvas) return;
        FloatUtil.canvas_click({
            offsetX: e.layerX,
            offsetY: e.layerY
        })
    });
    nav.addEventListener('mousemove', (e) => {
        if(e.target === nav_canvas) return;
        FloatUtil.canvas_mousemove({
            offsetX: e.layerX,
            offsetY: e.layerY
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





