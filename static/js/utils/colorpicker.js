window.ColorPicker = (() => {
    let _picker;
    let _callbacks = {};
    let ColorPicker = {
        container: () => {
            let container = document.createElement('div');
            container.className = 'color-picker';
            return container;
        },
        color_block: (r, g, b, a) => {
            let color_block = document.createElement('div');
            color_block.className = `color-block`;
            color_block.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${a === undefined ? 1 : a})`;
            color_block.rgba = [r, g, b, a];
            return color_block;
        },
        color_getter: function* (step) {
            for(let r = 0; r <= 256; r += step){
                for(let g = 0; g <= 256; g += step){
                    for(let b = 0; b <= 256; b += step){
                        yield [r, g, b];
                    }
                }
            }
        },
        init: (config = {}) => {
            _picker = ColorPicker.container();
            _callbacks = config.callbacks || _callbacks;
            ColorPicker.event();
            let color_arr = [];
            let getter = ColorPicker.color_getter(64);
            let color = getter.next().value;
            while(color){
                color_arr.push(color);
                color = getter.next().value;
            }
            if(config.color_none){
                let block = ColorPicker.color_block(255,255,255,0);
                block.innerText = `X`;
                block.classList.add('none');
                _picker.appendChild(block);
            }
            color_arr.sort((a, b) => {
                return a[0] + a[1] + a[2] < b[0] + b[1] + b[2] ? 1 : -1;
            }).forEach((color) => {
                _picker.appendChild(ColorPicker.color_block(...color));
            });

            return _picker;
        },
        event: () => {
            _picker.addEventListener('click', (e) => {
                let block = e.target;
                while(block !== _picker && !block.classList.contains('color-block')){
                    block = block.parentNode;
                }
                if(!block.classList.contains('color-block')) return;
                (_callbacks.onpick || function(){})(block.rgba);
            });
        }
    };
    return ColorPicker;
})();