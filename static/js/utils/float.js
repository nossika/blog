(factory => {
    let root = (typeof self == 'object' && self.self === self && self) ||
        (typeof global == 'object' && global.global === global && global);
    if (typeof define === 'function' && define.amd) {
        define([], ()=> {
            root.FloatUtil = factory();
        });
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.FloatUtil = factory();
    }
})(() => {
    let dot_list = new Set();
    let _config = Object.seal({
        link_dis: 100,
        click_dot: 3,
        v_max: 6,
        max_dot: 20,
        border_extend: 30,
        r: 1.2
    });
    let _style = {
        line: {
            r: 1,
            g: 2,
            b: 100
        },
        line_w: 0.4,
        dot: {
            r: 100,
            g: 50,
            b: 50,
            a: 1
        },
    };
    let [_ctx, _ctx_w, _ctx_h] = [null, 0, 0];
    let animating;
    let _mouse_dot = null;
    class Dot {
        constructor(config){
            this.x = config.x || 0;
            this.y = config.y || 0;
            this.v_x = config.v_x || 0;
            this.v_y = config.v_y || 0;
            this.r = config.r || 0;
        }
    }
    let FloatUtil = {
        init_float: (ctx, config = {}) => {
            _ctx = ctx;
            FloatUtil.set_size();
            FloatUtil.canvas_event();
            FloatUtil.auto_add_dot();
            FloatUtil.animate();
        },
        canvas_event: () => {
            ['mousemove', 'mouseleave', 'click'].forEach((event) => {
                _ctx.canvas.removeEventListener(event, FloatUtil[`canvas_${event}`]);
                _ctx.canvas.addEventListener(event, FloatUtil[`canvas_${event}`]);
            });
        },
        canvas_mousemove: (e) => {
            let [x, y] = [e.offsetX, e.offsetY];
            if(!_mouse_dot){
                _mouse_dot = new Dot({
                    x: x,
                    y: y,
                });
                dot_list.add(_mouse_dot);
                return;
            }
            _mouse_dot.x = x;
            _mouse_dot.y = y;
        },
        canvas_mouseleave: (e) => {
            dot_list.delete(_mouse_dot);
            _mouse_dot = null;
        },
        canvas_click: (e) => {
            let [x, y] = [e.offsetX, e.offsetY];
            for(let i = 0; i < _config.click_dot; i++) {
                dot_list.add(new Dot({
                    x: x,
                    y: y,
                    v_x: FloatUtil.random_num(_config.v_max, 2) * (Math.random() > 0.5 ? -1 : 1) / 10,
                    v_y:FloatUtil.random_num(_config.v_max, 2) * (Math.random() > 0.5 ? -1 : 1) / 10,
                    r: _config.r
                }))
            }
        },
        animate: () => {
            let animation = () => {
                FloatUtil.clear();
                FloatUtil.update();
                FloatUtil.render();
                if(!animating) return;
                requestAnimationFrame(animation)
            };
            animating = true;
            requestAnimationFrame(animation)
        },
        suspend: () => {
            animating = false;
        },
        update: () => {
            let [top, right, bottom, left] = [
                0 - _config.border_extend,
                _ctx_w + _config.border_extend,
                _ctx_h + _config.border_extend,
                0 - _config.border_extend,
            ];

            dot_list.forEach((dot) => {
                dot.x = dot.x + dot.v_x;
                dot.y = dot.y + dot.v_y;
                if(dot.x < left || dot.x > right || dot.y < top || dot.y > bottom){
                    dot_list.delete(dot);
                    if(dot_list.size > _config.max_dot) return;
                    FloatUtil.add_random_dot();
                }
            });
        },
        render: () => {
            let temp_list = new Set();
            dot_list.forEach((dot) => {
                _ctx.beginPath();
                _ctx.moveTo(dot.x, dot.y);
                _ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
                _ctx.closePath();
                _ctx.fillStyle = `rgba(${_style.dot.r},${_style.dot.g},${_style.dot.b},${1})`;
                _ctx.fill();
                temp_list.forEach((other_dot) => {
                    let dis = Math.pow(Math.pow(dot.x - other_dot.x, 2) + Math.pow(dot.y - other_dot.y, 2), 1/2)
                    if(dis > _config.link_dis) return;
                    _ctx.beginPath();
                    _ctx.moveTo(dot.x, dot.y);
                    _ctx.lineTo(other_dot.x, other_dot.y);
                    _ctx.closePath();
                    _ctx.strokeStyle = `rgba(${_style.line.r},${_style.line.g},${_style.line.b},${(1 - dis/_config.link_dis)*2})`;
                    _ctx.lineWidth = _style.line_w;
                    _ctx.stroke();
                });
                temp_list.add(dot);
            });
        },
        random_num:(max, min = 0) => {
            return Math.floor(min + Math.random() * (max + 1));
        },
        auto_add_dot: () => {
            let interval = setInterval(() => {
                if(dot_list.size > _config.max_dot) {
                    clearInterval(interval);
                    return;
                }
                FloatUtil.add_random_dot();
            }, 500)
        },
        add_random_dot: () => {
            let [x, y, v_x, v_y] = [
                FloatUtil.random_num(_ctx_w),
                FloatUtil.random_num(_ctx_h),
                FloatUtil.random_num(_config.v_max, 1) * (Math.random() > 0.5 ? -1 : 1) / 10,
                FloatUtil.random_num(_config.v_max, 1) * (Math.random() > 0.5 ? -1 : 1) / 10
            ];
            switch (FloatUtil.random_num(3)) {
                case 0:
                    y = 0;
                    v_y = Math.abs(v_y);
                    break;
                case 1:
                    x = _ctx_w;
                    v_x = -Math.abs(v_x);
                    break;
                case 2:
                    y = _ctx_h;
                    v_y = -Math.abs(v_y);
                    break;
                case 3:
                    x = 0;
                    v_x = Math.abs(v_x);
                    break;
            }

            dot_list.add(new Dot({
                x: x,
                y: y,
                v_x: v_x,
                v_y: v_y,
                r: _config.r
            }));
        },
        set_style: (style) => {
            style = JSON.parse(JSON.stringify(style));
            for(let prop in style){
                _style[prop] = style[prop];
            }
        },
        set_size: (e) => {
            if(!_ctx) return;
            _ctx_w = _ctx.canvas.offsetWidth;
            _ctx_h = _ctx.canvas.offsetHeight;
            _ctx.canvas.width = _ctx_w;
            _ctx.canvas.height = _ctx_h;
        },
        clear: () => {
            _ctx.clearRect(0, 0, _ctx_w, _ctx_h);
        },
        Dot: Dot,
        dot_list: dot_list
    };
    return FloatUtil;
});



