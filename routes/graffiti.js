"use strict";
const util = require('../util/main');
let Graffiti;
setTimeout(() => {
    Graffiti = global.db.collection('graffiti');
}, 5000);

module.exports = (router) => {
    router.get('/graffiti', function* (){
        let html = util.render('main.ejs', {nav: 'graffiti'});
        this.body = html;
    });
    router.post('/graffiti/submit', function* (){
        let req_body = this.request.body;
        let data;
        try{
            data = JSON.parse(req_body.data);
        }catch (e){
            data = null;
        }
        let body;
        if(data){
            body = yield new Promise((res, rej) => {
                Graffiti.insertMany([{
                    data: data,
                    time: +new Date()
                }], (e, d) => {
                    if(e) { rej(null); return; }
                    res('ok');
                });
            });
        }
        this.body = body;
    });
    router.get('/graffiti/list', function* () {
        let query = this.request.query;
        let [limit, skip] = [+query.limit, +query.skip];
        let list = yield new Promise((res, rej) => {
            Graffiti.find({}).limit(limit).skip(skip).toArray((e, d) => {
                if(e) { rej(null); return; }
                res(d);
            });
        });
        this.body = list;
    });
};