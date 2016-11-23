window.GraffitiUtil = (() => {
    let main_data = [];
    let paint_data = {};
    let [_ctx, _ctx_w, _ctx_h] = [null, 0, 0];
    let [_type, width, _stroke, _fill] = ['line', 2, 'rgba(33,33,33,0.01)', '#adadad'];
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
        },
        canvas_event: () => {
            _ctx.canvas.addEventListener('mousedown', (e) => {
                e.preventDefault();
                paint_data.type = _type;
                paint_data.width = width;
                paint_data.stroke = _stroke;
                paint_data.fill = _fill;
                paint_data.points = [];
                GraffitiUtil.painting(e);
                _ctx.canvas.addEventListener('mousemove', GraffitiUtil.painting);
                document.addEventListener('mouseup', GraffitiUtil.stop_painting);
            });
        },
        painting: (e) => {
            paint_data.points.push([e.offsetX, e.offsetY]);
            GraffitiUtil.draw_canvas(main_data.concat([paint_data]), _ctx);
        },
        stop_painting: (e) => {
            main_data.push(paint_data);
            GraffitiUtil.draw_canvas(main_data, _ctx);
            _ctx.canvas.removeEventListener('mousemove', GraffitiUtil.painting);
            document.removeEventListener('mouseup', GraffitiUtil.stop_painting);
        },
        draw_canvas: (main_data, ctx) => {
            main_data.forEach((paint_data) => {
                _draw_fn[paint_data.type](paint_data, ctx);
            })
        },


    };

    let _draw_fn = {
        line: (data, ctx) => {
            ctx.beginPath();

            data.points.forEach(([x, y]) => {
                ctx.lineTo(x, y);
            });
            ctx.lineWidth = data.width;
            ctx.strokeStyle = data.stroke;
            ctx.stroke();
        }
    };
    window.addEventListener('resize', GraffitiUtil.set_size);
    window.main_data = main_data;
    return GraffitiUtil;
})();