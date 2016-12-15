window.GraffitiUtil = (() => {
    let main_data = [];
    let paint_data = null;
    let [_ctx, _ctx_w, _ctx_h] = [null, 0, 0];
    let [_shape, _width, _stroke, _fill] = ['line', 2, 'rgba(33,33,33,0.5)', 'rgba(55,33,222,0)'];
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
                    width: _width,
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
        draw_canvas: (main_data, ctx, editing) => {
            ctx.clearRect(0,0,_ctx.canvas.width,_ctx.canvas.height);
            main_data.forEach((paint_data, index) => {
                Shapes[paint_data.shape].draw(paint_data, ctx, editing && index === main_data.length - 1);
            })
        },
        download_png: () => {
            let img_data = _ctx.canvas.toDataURL();
            let a = document.createElement('a');
            a.setAttribute('href', img_data);
            a.setAttribute('download', 'canvas.png');
            a.click();
        },
        get_point_range: (main_data) => {
            let [x_min, x_max, y_min, y_max] = [];
            main_data.forEach((paint_data) => {
                paint_data.points.forEach(([x, y]) => {
                    if(x_min === undefined) {
                        x_min = x_max = x;
                        y_min = y_max = y;
                    }
                    x_min = Math.min(x, x_min);
                    y_min = Math.min(y, y_min);
                    x_max = Math.max(x, x_max);
                    y_max = Math.max(y, y_max);
                });
            });
            return [x_min, x_max, y_min, y_max];
        },
        get_data: () => {
            return main_data;
        },
        get_size: () => {
            return {
                w: _ctx_w,
                h: _ctx_h
            }
        },
        set_shape: (shape) => {
            _shape = shape;
        },
        set_width: (width) => {
            _width = width;
        },
        set_stroke: (stroke) => {
            _stroke = stroke;
        },
        set_fill: (fill) => {
            _fill = fill;
        },
    };


    let Shapes = {
        line: {
            draw: (data, ctx) => {
                ctx.beginPath();
                data.points.forEach(([x, y]) => {
                    ctx.lineTo(x, y);
                });
                ({
                    width: ctx.lineWidth,
                    stroke: ctx.strokeStyle
                } = data);
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
                ({
                    width: ctx.lineWidth,
                    stroke: ctx.strokeStyle
                } = data);
                ctx.stroke();
            },
            pick: points => [points[0], points[points.length - 1]]
        },
        circle: {
            draw: (data, ctx, editing) => {
                let [a, b] = Shapes.circle.pick(data.points);
                if(editing){
                    Shapes.line.draw({
                        points: [a, b],
                        width: 1,
                        stroke: 'rgba(0,0,0,0.3)'
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
                ({
                    width: ctx.lineWidth,
                    stroke: ctx.strokeStyle,
                    fill: ctx.fillStyle
                } = data);
                ctx.stroke();
                ctx.fill();
            },
            pick: points => [points[0], points[points.length - 1]]
        },
        rectangle: {
            draw: (data, ctx, editing) => {
                let [a, b] = Shapes.rectangle.pick(data.points);
                if(editing){
                    Shapes.line.draw({
                        points: [a, b],
                        width: 1,
                        stroke: 'rgba(0,0,0,0.3)'
                    }, ctx)
                }
                ctx.beginPath();
                ctx.rect(a[0], a[1], b[0] - a[0], b[1] - a[1]);
                ctx.closePath();
                ({
                    width: ctx.lineWidth,
                    stroke: ctx.strokeStyle,
                    fill: ctx.fillStyle
                } = data);
                ctx.stroke();
                ctx.fill();
            },
            pick: points => [points[0], points[points.length - 1]]
        },
        triangle: {
            draw: (data, ctx, editing) => {
                let [a, b, c] = Shapes.triangle.pick(data.points);
                if(editing){
                    Shapes.line.draw({
                        points: data.points,
                        width: 1,
                        stroke: 'rgba(0,0,0,0.3)'
                    }, ctx)
                }
                ctx.beginPath();
                [a, b, c].forEach(([x, y]) => {
                    ctx.lineTo(x, y);
                });
                ctx.closePath();
                ({
                    width: ctx.lineWidth,
                    stroke: ctx.strokeStyle,
                    fill: ctx.fillStyle
                } = data);
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
            draw: (data, ctx, editing) => {
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
