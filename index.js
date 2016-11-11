const koa = require('koa');
const koa_static = require('koa-static');
const koa_router = require('koa-router')();
const app = koa();
const util = require('./util/main');

app.use(koa_static(__dirname + '/static'));
app.use(koa_router.routes()).use(koa_router.allowedMethods());

let routers = util.get_routers(__dirname + '/routes/');
for(let router in routers){
    routers[router](koa_router);
}

app.use(function* (){
    this.body = util.render('main.ejs', {nav: '404'});
});

app.listen(7869,()=>{
    console.log(7869)
});
