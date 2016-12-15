(()=>{
    GraffitiUtil.init_editor(document.querySelector('#graffiti-editor').getContext('2d'));

    let controller = document.querySelector('.graffiti-controller');
    controller.querySelector('[data-action="shape"]').addEventListener('click', (e) => {
        setTimeout(() => {
            let popup = Util.btn_popup(e, {w: 100, h: 200, mode: 1, offset: 5});
            let shape_block = (shape) => {
                return `
                    <div class="shape-block" data-shape="${shape}">
                        <svg viewbox="0 0 1024 1024">
                            <use xlink:href="#svgpath_shape_${shape}"/>
                        </svg>
                    </div>
                `
            };
            ['line', 'straight', 'circle', 'rectangle', 'triangle', 'eraser'].forEach((shape) => {
                popup.innerHTML += shape_block(shape);
            });

            popup.addEventListener('click', (e) => {
                let block = e.target;
                while(block !== popup && !block.getAttribute('data-shape')){
                    block = block.parentNode;
                }
                let shape = block.getAttribute('data-shape');
                if(!shape) return;
                GraffitiUtil.set_shape(shape);
                popup.parentNode.removeChild(popup);
            });
            document.body.appendChild(popup);
        }, 0);
    });

    controller.querySelector('[data-action="stroke"]').addEventListener('click', (e) => {
        setTimeout(() => {
            let popup = Util.btn_popup(e, {w: 226, h: 346, mode: 1, offset: 5});
            popup.appendChild(ColorPicker.init({
                color_none: true,
                callbacks: {
                    onpick: (color) => {
                        GraffitiUtil.set_stroke(`rgba(${color[0]},${color[1]},${color[2]},${color[3] === undefined ? 0.8 : color[3]})`);
                        popup.parentNode.removeChild(popup);
                    }
                }
            }));
            document.body.appendChild(popup);
        }, 0);
    });
    controller.querySelector('[data-action="fill"]').addEventListener('click', (e) => {
        setTimeout(() => {
            let popup = Util.btn_popup(e, {w: 226, h: 346, mode: 1, offset: 5});
            popup.appendChild(ColorPicker.init({
                color_none: true,
                callbacks: {
                    onpick: (color) => {
                        GraffitiUtil.set_fill(`rgba(${color[0]},${color[1]},${color[2]},${color[3] === undefined ? 0.8 : color[3]})`);
                        popup.parentNode.removeChild(popup);
                    }
                }
            }));
            document.body.appendChild(popup);
        }, 0);
    });
    controller.querySelector('[data-action="line"]').addEventListener('click', (e) => {
        setTimeout(() => {
            let popup = Util.btn_popup(e, {w: 80, h: 210, mode: 1, offset: 5});
            let width_block = (width) => {
                return `
                    <div class="line-block" style="position: relative" data-width="${width}">
                        <div style="height: ${width + "px"}; width: 100%"></div>
                    </div>
                `
            };
            [1, 2, 4, 6 ,8].forEach((width) => {
                popup.innerHTML += width_block(width);
            });

            popup.addEventListener('click', (e) => {
                let block = e.target;
                while(block !== popup && !block.getAttribute('data-width')){
                    block = block.parentNode;
                }
                let width = block.getAttribute('data-width');
                if(!width) return;
                GraffitiUtil.set_width(width);
                popup.parentNode.removeChild(popup);
            });
            document.body.appendChild(popup);
        }, 0);
    });
    controller.querySelector('[data-action="download"]').addEventListener('click', () => {
        GraffitiUtil.download_png();
    });
    controller.querySelector('[data-action="undo"]').addEventListener('click', () => {
        GraffitiUtil.undo_paint();
    });
    controller.querySelector('[data-action="submit"]').addEventListener('click', () => {
        Util.ajax({
            url: '/graffiti/submit',
            data: {
                data: JSON.stringify(GraffitiUtil.get_data())
            },
            method: 'post',
            callback: (d) => {
                console.log(d)
            }
        })
    });

    Waterfall.init(document.querySelector('.graffiti-board'), 'canvas', {
        space: [20, 20]
    });
    let get_graffiti = (config, cb) => {
        Util.ajax({
            url: '/graffiti/list',
            data: {
                limit: config.limit,
                skip: config.skip
            },
            method: 'get',
            callback: (d) => {
                try {
                    d = JSON.parse(d);
                } catch (e) {
                    d = null;
                }
                if(!d) return;
                let canvas_board = document.querySelector('.graffiti-board');
                d.forEach((canvas_data) => {
                    let main_data = canvas_data.data;
                    if(!main_data) return;
                    let canvas = document.createElement('canvas'),
                        ctx = canvas.getContext('2d');
                    let [x_min, x_max, y_min, y_max] = GraffitiUtil.get_point_range(main_data);
                    let padding = 30;
                    x_min -= padding;
                    x_max += padding;
                    y_min -= padding;
                    y_max += padding;
                    let width = 300;
                    let scale = width / (x_max - x_min);
                    scale = Math.min(scale, 1.2);
                    canvas.width = width;
                    canvas.height = scale * (y_max - y_min);
                    ctx.scale(scale, scale);
                    ctx.translate(-x_min, -y_min);
                    GraffitiUtil.draw_canvas(main_data, ctx);
                    canvas_board.appendChild(canvas);
                });
                Waterfall.fall(true);
                (cb || function(){})();
            }
        });
    };
    get_graffiti(30, 0);
    window.scroll_fn['graffiti'] = () => {
        if(!document.querySelector('.graffiti-board')) return;
        if(window.scroll_fn['graffiti'].locked) return;
        let body = document.body;
        if(body.scrollTop + document.documentElement.clientHeight > body.scrollHeight - 150) {
            window.scroll_fn['graffiti'].locked = true;
            let lock_timer = setTimeout(() => {
                window.scroll_fn['graffiti'].locked = false;
            }, 3000);
            get_graffiti({
                limit: 30,
                skip: 0
            }, () => {
                window.scroll_fn['graffiti'].locked = false;
                clearTimeout(lock_timer);
            });
        }
    };
    Reflect.defineProperty(window.scroll_fn['graffiti'], 'locked', {
        value: false,
        writable: true
    });
    window.resize_fn['graffiti'] = () => {
        if(!document.querySelector('.graffiti-board')) return;
        Waterfall.fall();
    };
})();
