(()=>{
    Util.init_nav();
    PlayerUtil.get_list((list) => {
        PlayerUtil.init_player({
            id: 'player',
            list: list
        });
    });
    FloatUtil.init_canvas(document.querySelector('#nav_canvas').getContext('2d'),{
        
    });
    let nav = document.querySelector('#nav');
    let nav_canvas = document.querySelector('#nav_canvas');
    nav.addEventListener('click', (e) => {
        if(e.target === nav_canvas) return;
        FloatUtil.canvas_click({
            offsetX: e.layerX,
            offsetY: e.layerY
        })
    });
    nav.addEventListener('mousemove', (e) => {
        if(e.target === nav_canvas) return;
        FloatUtil.canvas_mousemove({
            offsetX: e.layerX,
            offsetY: e.layerY
        })
    });
    nav.addEventListener('mouseleave', (e) => {
        FloatUtil.canvas_mouseleave();
    })
})();

