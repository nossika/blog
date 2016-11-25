window.GraffitiUtil = (() => {
    let main_data = [];
    let paint_data = null;
    let [_ctx, _ctx_w, _ctx_h] = [null, 0, 0];
    let [_type, width, _stroke, _fill] = ['line', 1, 'rgba(33,33,33,0.5)', 'rgba(55,33,222,0.6)'];
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
                    type: _type,
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
            paint_data.points = Shapes[paint_data.type].pick(paint_data.points);
            main_data.push(paint_data);
            GraffitiUtil.draw_canvas(main_data, _ctx);
            _ctx.canvas.removeEventListener('mousemove', GraffitiUtil.painting);
            document.removeEventListener('mouseup', GraffitiUtil.stop_painting);
        },
        undo_paint: () => {
            main_data.pop();
            GraffitiUtil.draw_canvas(main_data, _ctx);
        },
        draw_canvas: (main_data, ctx, preview) => {
            ctx.clearRect(0,0,_ctx.canvas.width,_ctx.canvas.height);
            main_data.forEach((paint_data, index) => {
                Shapes[paint_data.type].draw(paint_data, ctx, preview && index === main_data.length - 1);
            })
        },
        set_type: (type) => {
            _type = type;
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
        circle: {
            draw: (data, ctx) => {
                ctx.beginPath();
                let [begin, end] = Shapes.circle.pick(data.points);
                let [x, y, a, b] = [begin[0], begin[1], end[0] - begin[0], end[1] - begin[1]];
                let r = Math.abs(Math.min(a, b));
                let [scale_x, scale_y] = [a / r, b / r];
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
        triangle: {
            draw: (data, ctx, preview) => {
                if(preview){
                    ctx.beginPath();
                    data.points.forEach(([x, y]) => {
                        ctx.lineTo(x, y);
                    });
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
                    ctx.stroke();
                }
                let [a, b, c] = Shapes.triangle.pick(data.points);
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
                console.log([a, b, c])
            },
            pick: points => {
                let [a, b, c] = [points[0],points[0],points[points.length-1]];
                let k = (c[1] - c[0])/(a[1] - a[0]);
                let max = 0;
                points.forEach(point => {
                    let dis = Math.abs(1 * point[0] - (1/k) * point[1]);
                    if(dis > max){
                        max = dis;
                        b = point;
                    }
                });
                return [a, b, c];
            }
        }
    };
    window.addEventListener('resize', GraffitiUtil.set_size);
    window.main_data = main_data;
    return GraffitiUtil;
})();

