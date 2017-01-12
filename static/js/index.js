(() => {

    let welcome = document.querySelector('#welcome');

    let dt = new DotText(welcome);

    let config = (() => {
        let obj;
        if (window.innerWidth < 768) {
            obj = {
                text_size: 60,
                dot_gap: 6,
                dot_size: 2
            }
        } else if (window.innerWidth < 1100) {
            obj = {
                text_size: 150,
                dot_gap: 10,
                dot_size: 4
            }
        } else {
            obj = {}
        }
        return obj;
    })();

    let texts = ['Welcome', 'to', 'NossiKa\'s', 'home', 'Hi~'];
    let text_i = 0;
    let dt_timer = setInterval(() => {
        if (!texts[text_i]) {
            clearInterval(dt_timer);
            return;
        }
        dt.text(texts[text_i++], config);
    }, 2000);

    window.resize_fn['index'] = () => {
        let index = document.querySelector('#index');
        if(!index) return;
        dt.resize();
    };

})();