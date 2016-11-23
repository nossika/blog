"use strict";
const util = require('../util/main');

module.exports = (router) => {
    router.get('/graffiti', function* (){
        let html = util.render('main.ejs', {nav: 'graffiti'});
        this.body = html;
    })
};