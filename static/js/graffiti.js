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
