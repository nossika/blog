const fs = require('fs');
const ejs = require('ejs');
const util = require('../util/main');

module.exports = (app) => {
    app.get('/', function* (){
        let html = util.render('index.ejs', {aaa: 1112342535453});
        this.body = html;
    })
};