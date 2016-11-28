"use strict";
const util = require('../util/main');

module.exports = (router) => {
    router.get('/graffiti', function* (){
        let html = util.render('main.ejs', {nav: 'graffiti'});
        this.body = html;
    });
    router.post('/graffiti/submit', function* (){
        console.log(this)
    });
    router.get('/graffiti/list', function* (){
        console.log(this)
    });
};