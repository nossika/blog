"use strict";
const util = require('../util/main');

module.exports = (router) => {
    router.get('/board', function* (){
        let html = util.render('main.ejs', {nav: 'board'});
        this.body = html;
    })
};