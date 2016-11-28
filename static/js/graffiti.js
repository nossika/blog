(()=>{
    let GraffitiUtil = (() => {
        let main_data = [];
        let paint_data = null;
        let [_ctx, _ctx_w, _ctx_h] = [null, 0, 0];
        let [_shape, width, _stroke, _fill] = ['line', 1, 'rgba(33,33,33,0.5)', 'rgba(55,33,222,0.6)'];
        let GraffitiUtil = {
            init_editor: (ctx) => {
                _ctx = ctx;
                GraffitiUtil.set_size();
                GraffitiUtil.canvas_event();
            },
            set_size: () => {
                if(!_ctx) return;
                _ctx_w = _ctx.canvas.offsetWidth;
                _ctx_h = _ctx.canvas.offsetHeight;
                _ctx.canvas.width = _ctx_w;
                _ctx.canvas.height = _ctx_h;
                GraffitiUtil.draw_canvas(main_data, _ctx)
            },
            canvas_event: () => {
                _ctx.canvas.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    paint_data = {
                        shape: _shape,
                        width: width,
                        stroke: _stroke,
                        fill: _fill,
                        points: []
                    };
                    GraffitiUtil.painting(e);
                    _ctx.canvas.addEventListener('mousemove', GraffitiUtil.painting);
                    document.addEventListener('mouseup', GraffitiUtil.stop_painting);
                });
            },
            painting: (e) => {
                paint_data.points.push([e.offsetX, e.offsetY]);
                GraffitiUtil.draw_canvas(main_data.concat([paint_data]), _ctx, true);
            },
            stop_painting: (e) => {
                paint_data.points = Shapes[paint_data.shape].pick(paint_data.points);
                main_data.push(paint_data);
                GraffitiUtil.draw_canvas(main_data, _ctx);
                _ctx.canvas.removeEventListener('mousemove', GraffitiUtil.painting);
                document.removeEventListener('mouseup', GraffitiUtil.stop_painting);
            },
            undo_paint: () => {
                main_data.pop();
                GraffitiUtil.draw_canvas(main_data, _ctx);
            },
            draw_canvas: (main_data, ctx, show_path) => {
                ctx.clearRect(0,0,_ctx.canvas.width,_ctx.canvas.height);
                main_data.forEach((paint_data, index) => {
                    Shapes[paint_data.shape].draw(paint_data, ctx, show_path && index === main_data.length - 1);
                })
            },
            set_shape: (shape) => {
                _shape = shape;
            },
            download_png: () => {
                let img_data = _ctx.canvas.toDataURL();
                let a = document.createElement('a');
                a.setAttribute('href', img_data);
                a.setAttribute('download', 'canvas.png');
                a.click();
            },
            get_data: () => {
                return main_data;
            },
            get_size: () => {
                return {
                    w: _ctx_w,
                    h: _ctx_h
                }
            }

        };


        let Shapes = {
            line: {
                draw: (data, ctx) => {
                    ctx.beginPath();
                    data.points.forEach(([x, y]) => {
                        ctx.lineTo(x, y);
                    });
                    ctx.lineWidth = data.width;
                    ctx.strokeStyle = data.stroke;
                    ctx.stroke();
                },
                pick: points => points
            },
            straight: {
                draw: (data, ctx) => {
                    let [a, b] = Shapes.straight.pick(data.points);
                    ctx.beginPath();
                    ctx.moveTo(...a);
                    ctx.lineTo(...b);
                    ctx.lineWidth = data.width;
                    ctx.strokeStyle = data.stroke;
                    ctx.stroke();
                },
                pick: points => [points[0], points[points.length - 1]]
            },
            circle: {
                draw: (data, ctx, show_path) => {
                    let [a, b] = Shapes.circle.pick(data.points);
                    if(show_path){
                        Shapes.line.draw({
                            points: [a, b],
                            width: 1,
                            stroke: 'rgba(0,0,0,0.1)'
                        }, ctx)
                    }
                    let [x, y, rx, ry] = [a[0], a[1], b[0] - a[0], b[1] - a[1]];
                    let r = Math.abs(Math.min(rx, ry));
                    let [scale_x, scale_y] = [rx / r, ry / r];
                    ctx.beginPath();
                    ctx.save();
                    ctx.scale(scale_x, scale_y);
                    ctx.arc(x / scale_x, y / scale_y, r, 0, 2 * Math.PI);
                    ctx.closePath();
                    ctx.restore();
                    ctx.lineWidth = data.width;
                    ctx.strokeStyle = data.stroke;
                    ctx.fillStyle = data.fill;
                    ctx.stroke();
                    ctx.fill();
                },
                pick: points => [points[0], points[points.length - 1]]
            },
            rectangle: {
                draw: (data, ctx, show_path) => {
                    let [a, b] = Shapes.rectangle.pick(data.points);
                    if(show_path){
                        Shapes.line.draw({
                            points: [a, b],
                            width: 1,
                            stroke: 'rgba(0,0,0,0.1)'
                        }, ctx)
                    }
                    ctx.beginPath();
                    ctx.rect(a[0], a[1], b[0] - a[0], b[1] - a[1]);
                    ctx.closePath();
                    ctx.lineWidth = data.width;
                    ctx.strokeStyle = data.stroke;
                    ctx.fillStyle = data.fill;
                    ctx.stroke();
                    ctx.fill();
                },
                pick: points => [points[0], points[points.length - 1]]
            },
            triangle: {
                draw: (data, ctx, show_path) => {
                    let [a, b, c] = Shapes.triangle.pick(data.points);
                    if(show_path){
                        Shapes.line.draw({
                            points: data.points,
                            width: 1,
                            stroke: 'rgba(0,0,0,0.1)'
                        }, ctx)
                    }
                    ctx.beginPath();
                    [a, b, c].forEach(([x, y]) => {
                        ctx.lineTo(x, y);
                    });
                    ctx.closePath();
                    ctx.lineWidth = data.width;
                    ctx.strokeStyle = data.stroke;
                    ctx.fillStyle = data.fill;
                    ctx.stroke();
                    ctx.fill();
                },
                pick: points => {
                    let [a, b, c] = [points[0], points[0], points[points.length - 1]];
                    let k = (c[1] - a[1]) / (c[0] - a[0]);
                    let max = 0;
                    points.forEach(([x, y]) => {
                        let dis = Math.abs((x - a[0]) + (-1 / k) * (y - a[1]));
                        if(dis > max){
                            max = dis;
                            b = [x, y];
                        }
                    });
                    return [a, b, c];
                }
            },
            eraser: {
                draw: (data, ctx, show_path) => {
                    ctx.beginPath();
                    data.points.forEach(([x, y]) => {
                        ctx.clearRect(x - 5, y - 5, 10, 10);
                    });
                },
                pick: points => points
            }
        };
        window.addEventListener('resize', GraffitiUtil.set_size);
        return GraffitiUtil;
    })();
    let ColorPicker = (() => {
        let _data = {
            hsl: [0,100,100],
            a: 0.8
        };
        let _picker, _list, _opacity, _preview;
        let ColorPicker = {
            container: () => {
                let container = document.createElement('div');
                container.innerHTML = `
                            <div>
                                <div data-part="list"></div>
                                <div data-part="opacity"></div>
                                <div data-part="preview"></div>
                            </div>
                        `;
                return container;
            },
            color_block: (h, s, l) => {
                let color_block = document.createElement('div');
                color_block.className = `color_block`;
                color_block.style.backgroundColor = `hsl(${h}, ${s}%, ${l}%)`;
                color_block.hsl = [h, s, l];
                return color_block;
            },
            init: (config) => {
                _picker = ColorPicker.container();
                _list = _picker.querySelector('[data-part="list"]');
                _opacity = _picker.querySelector('[data-part="opacity"]');
                _preview = _picker.querySelector('[data-part="preview"]');
                ColorPicker.update_preview();
                ColorPicker.event();
                for(let l = 90; l > 10; l-= 10){
                    for(let h = 0; h < 360; h += 16){
                        _list.appendChild(ColorPicker.color_block(h,80,l));
                    }
                }
                return _picker;
            },
            event: () => {
                _list.addEventListener('click', (e) => {
                    let block = e.target;
                    while(block !== _list && !block.classList.contains('color_block')){
                        block = block.parentNode;
                    }
                    if(!block.classList.contains('color_block')) return;
                    _data.hsl = block.hsl;
                    ColorPicker.update_preview();
                });
            },

            update_preview: () => {
                let [h, s, l, a] = [_data.hsl[0], _data.hsl[1], _data.hsl[2], _data.a];
                _preview.style.backgroundColor = `hsla(${h}, ${s}%, ${l}%, ${a})`;
            }
        };
        return ColorPicker;
    })();

    GraffitiUtil.init_editor(document.querySelector('#graffiti-editor').getContext('2d'));

    let controller = document.querySelector('.graffiti-controller');
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
                data: GraffitiUtil.get_data(),
                size: GraffitiUtil.get_size()
            },
            type: 'post',
            callback: (d) => {
                console.log(d)
            }
        })
    });
})();