(()=>{
    Util.init_nav();

    return;
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


document.addEventListener('keyup', (e) => {
    if(e.keyCode === 37){
        let canvas = document.querySelector('#nav_canvas');
        let data = canvas.toDataURL();
        let div = document.createElement('div');
        div.innerHTML = '<a id="a" href="'+data+'" download>fwefew</a>'
        document.body.appendChild(div);
        let a = document.querySelector('#a');
        a.click();
        a.parentNode.removeChild(a);
    }
});




