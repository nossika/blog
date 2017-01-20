(() => {

    let welcome = document.querySelector('#welcome');

    let dt = new DotText(welcome);

    console.log(window.innerWidth)
    let config = window.innerWidth < 768
        ? {text_size: 60, dot_gap: 5, dot_size: 2}
        : window.innerWidth < 1400
            ? {text_size: 150, dot_gap: 9, dot_size: 4}
            : {};

    Util.ajax({
        url: '/tool/visitors',
        method: 'get',
        callback: d => {
            let texts = [`Welcome`, `You're`, `No.${d}`, `visitor`, `Hi~`];
            let text_i = 0;
            let dt_timer = setInterval(() => {
                if (!texts[text_i]) {
                    clearInterval(dt_timer);
                    return;
                }
                dt.text(texts[text_i++], config);
            }, 2000);
        }
    });

    window.resize_fn['index'] = () => {
        let index = document.querySelector('#index');
        if(!index) return;
        dt.resize();
    };

})();