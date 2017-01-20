"use strict";
const util = require('../util/main');

let route_index = (me)=>{
    let html = util.render('main.ejs', {nav: 'index'});
    me.body = html;
};

module.exports = router => {
    router.get('/', function* (){
        route_index(this);
    });
    router.get('/index', function* (){
        route_index(this);
    });
};