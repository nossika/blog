(()=>{
    GraffitiUtil.init_editor(document.querySelector('#graffiti-canvas').getContext('2d'));
    let controller = document.querySelector('.graffiti-controller');
    let canvas_board = document.querySelector('.graffiti-board');
    let status = document.querySelector('.graffiti-status');
    const FN = {
        update_btns: () => {
            let [stroke, fill, width, shape] = [
                GraffitiUtil.draw_stroke(),
                GraffitiUtil.draw_fill(),
                GraffitiUtil.draw_width(),
                GraffitiUtil.draw_shape(),
            ];

            let stroke_btn = controller.querySelector('[data-action="stroke"]');
            let stroke_none = Util.parse_rgba(stroke)[3] === 0;
            stroke_btn.style.backgroundColor = stroke_none ? '#fff' : stroke;
            stroke_btn.innerText = stroke_none ? 'X' : '';

            let fill_btn = controller.querySelector('[data-action="fill"]');
            let fill_none = Util.parse_rgba(fill)[3] === 0;
            fill_btn.style.backgroundColor = fill_none ? '#fff' : fill;
            fill_btn.innerText = fill_none ? 'X' : '';

            controller.querySelector('[data-action="width"]').innerHTML
                = FN.width_block_html(width);
            controller.querySelector('[data-action="shape"]').innerHTML
                = FN.shape_block_html(shape);

        },
        shape_block_html: (shape) => {
            return `
                <div class="shape-block" data-shape="${shape}">
                    <svg viewbox="0 0 1024 1024">
                        <use xlink:href="#svgpath_shape_${shape}"/>
                    </svg>
                </div>
            `
        },
        width_block_html: (width) => {
            return `
                <div class="line-block" style="position: relative" data-width="${width}">
                    <div style="height: ${width + "px"}; width: 100%"></div>
                </div>
            `
        },
        get_graffiti: (config, cb) => {
            Util.ajax({
                url: '/graffiti/list',
                data: {
                    limit: config.limit,
                    skip: config.skip || 0
                },
                method: 'get',
                callback: (d) => {
                    try {
                        d = JSON.parse(d);
                    } catch (e) {
                        d = null;
                    }
                    if(!d) return;
                
                    d.forEach((canvas_data) => {
                        let main_data = canvas_data.data,
                            time = Util.format_date(canvas_data.time);
                        if(!main_data) return;
                        let canvas = document.createElement('canvas'),
                            ctx = canvas.getContext('2d');
                        let text_h = 14;
                        let padding = 30;
                        let width = 300;

                        let [x_min, x_max, y_min, y_max] = GraffitiUtil.get_point_range(main_data);

                        x_min -= padding;
                        x_max += padding;
                        y_min -= padding;
                        y_max += padding;
                        let scale = width / (x_max - x_min);
                        scale = Math.min(scale, 1.2);
                        canvas.width = width;
                        canvas.height = scale * (y_max - y_min) + text_h + 10;
                        ctx.save();
                        ctx.scale(scale, scale);
                        ctx.translate(-x_min, -y_min);
                        GraffitiUtil.draw(main_data, ctx);
                        ctx.restore();
                        ctx.font = `${text_h}px/${text_h}px Microsoft YaHei`;
                        ctx.fillStyle = 'rgba(0,0,0,0.3)';
                        ctx.fillText(time, (+canvas.width - ctx.measureText(time).width) / 2, +canvas.height - 10);
                        canvas_board.appendChild(canvas);
                    });
                    Waterfall.fall(true);
                    cb && cb(d.length);
                }
            });
        },
        window_event: () => {
            window.scroll_fn['graffiti'] = () => {
                if(!document.querySelector('.graffiti-board')) return;
                if(window.scroll_fn['graffiti'].locked) return;
                let body = document.body;
                let list_count = canvas_board.querySelectorAll('canvas').length;
                if(!list_count || body.scrollTop + document.documentElement.clientHeight > body.scrollHeight - 150) {
                    window.scroll_fn['graffiti'].locked = true;
                    let lock_timer = setTimeout(() => {
                        window.scroll_fn['graffiti'].locked = false;
                    }, 3000);
                    status.innerText = 'loading...';
                    FN.get_graffiti({
                        limit: 30,
                        skip: list_count
                    }, (len) => {
                        if(len < 30) status.innerText = 'end';
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
        }
    };
    (() => {//控制相关
        controller.querySelector('[data-action="shape"]').addEventListener('click', (e) => {
            let popup = Util.btn_popup(e, {w: 40, h: 240, mode: 0, offset: 5});

            ['line', 'straight', 'circle', 'rectangle', 'triangle', 'eraser'].forEach((shape) => {
                popup.innerHTML += FN.shape_block_html(shape);
            });

            popup.addEventListener('click', (e) => {
                let block = e.target;
                while(block !== popup && !block.getAttribute('data-shape')){
                    block = block.parentNode;
                }
                let shape = block.getAttribute('data-shape');
                if(!shape) return;
                GraffitiUtil.draw_shape(shape);
                FN.update_btns();
                popup.parentNode.removeChild(popup);
            });
            setTimeout(() => {
                document.body.appendChild(popup);
            }, 0);
        });

        controller.querySelector('[data-action="stroke"]').addEventListener('click', (e) => {
            let popup = Util.btn_popup(e, {w: 226, h: 346, mode: 0, offset: 5});
            popup.appendChild(ColorPicker.init({
                color_none: true,
                callbacks: {
                    onpick: (color) => {
                        GraffitiUtil.draw_stroke(`rgba(${color[0]},${color[1]},${color[2]},${color[3] === 0 ? 0 : 0.8})`);
                        FN.update_btns();
                        popup.parentNode.removeChild(popup);
                    }
                }
            }));
            setTimeout(() => {
                document.body.appendChild(popup);
            }, 0);
        });
        controller.querySelector('[data-action="fill"]').addEventListener('click', (e) => {
            let popup = Util.btn_popup(e, {w: 226, h: 346, mode: 0, offset: 5});
            popup.appendChild(ColorPicker.init({
                color_none: true,
                callbacks: {
                    onpick: (color) => {
                        GraffitiUtil.draw_fill(`rgba(${color[0]},${color[1]},${color[2]},${color[3] === 0 ? 0 : 0.8})`);
                        FN.update_btns();
                        popup.parentNode.removeChild(popup);
                    }
                }
            }));
            setTimeout(() => {
                document.body.appendChild(popup);
            }, 0);
        });
        controller.querySelector('[data-action="width"]').addEventListener('click', (e) => {
            let popup = Util.btn_popup(e, {w: 40, h: 200, mode: 0, offset: 5});

            [1, 2, 4, 6 ,8].forEach((width) => {
                popup.innerHTML += FN.width_block_html(width);
            });

            popup.addEventListener('click', (e) => {
                let block = e.target;
                while(block !== popup && !block.getAttribute('data-width')){
                    block = block.parentNode;
                }
                let width = block.getAttribute('data-width');
                if(!width) return;
                GraffitiUtil.draw_width(width);
                FN.update_btns();
                popup.parentNode.removeChild(popup);
            });
            setTimeout(() => {
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
                    Waterfall.reset();
                    window.scroll_fn['graffiti']();
                }
            })
        });

        FN.update_btns();
    })();

    Waterfall.init(document.querySelector('.graffiti-board'), 'canvas', {
        space: [20, 20]
    });

    FN.window_event();
    window.scroll_fn['graffiti']();
})();
