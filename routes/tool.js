const util = require('../util/main');



module.exports = (router) => {
    router.get('/tool/view_part', function* (){
        let part = this.query.part;
        let html = util.render(`_main/${part}.ejs`, {nav: 'index'});
        this.body = html;
    });
};