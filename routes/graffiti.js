"use strict";
const util = require('../util/main');
let Graffiti;
setTimeout(() => {
    Graffiti = global.db.collection('graffiti')
}, 5000);

module.exports = (router) => {
    router.get('/graffiti', function* (){
        let html = util.render('main.ejs', {nav: 'graffiti'});
        this.body = html;
    });
    router.post('/graffiti/submit', function* (){
        console.log(this)
    });
    router.get('/graffiti/list', function* (){
        Graffiti.find({}).toArray((e, d) => {
            console.log(d)
        });
        console.log(this)
    });
};