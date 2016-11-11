const util = require('../util/main');

module.exports = (router) => {
    router.get('/about', function* (){
        let html = util.render('main.ejs', {nav: 'about'});
        this.body = html;
    })
};