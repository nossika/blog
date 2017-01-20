"use strict";
const util = require('../util/main');

module.exports = router => {
    router.get('/game', function* (){
        let html = util.render('main.ejs', {nav: 'game'});
        this.body = html;
    })
};
