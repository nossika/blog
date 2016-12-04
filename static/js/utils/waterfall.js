window.Waterfall = (() => {
    let _ctn = null, _space = [20, 20], _box_w, _data, _selector;
    let Waterfall = {
        init: (container, selector, config = {}) => {
            _ctn = container;
            _selector = selector;
            _space = config.space || _space;
            let box = container.querySelector(_selector);
            _box_w = box.offsetWidth + _space[1] * 2;
            Waterfall.resize();
        },
        resize: (cache) => {
            if(!cache) {
                _data = [];
                _data.count = 0;
                let _ctn_w = _ctn.offsetWidth;
                let _cols = Math.floor(_ctn_w / _box_w);
                let _margin = (_ctn_w - _box_w * _cols) / 2;
                for(let i = 0; i < _cols; i++){
                    let _col_data = {
                        left: _margin + i * _box_w,
                        top: 0,
                    };
                    _data.push(_col_data);
                }
            }
            let boxs = [].slice.call(_ctn.querySelectorAll(_selector));
            boxs.forEach((box, index) => {
                if(index < _data.count) return;
                let min_top, col_index;
                _data.forEach((_col_data, col) => {
                    if(min_top === undefined || _col_data.top < min_top){
                        min_top = _col_data.top;
                        col_index = col;
                    }
                });
                let col_data = _data[col_index];
                _data.count++;
                box.style.top = col_data.top + _space[0] + 'px';
                box.style.left = col_data.left + _space[1] + 'px';
                col_data.top += box.offsetHeight + _space[1] * 2;
            });
        }
    };
    return Waterfall;
})();