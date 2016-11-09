const koa = require('koa');
const koa_static = require('koa-static');
const koa_router = require('koa-router');
const api = koa_router();
const app = koa();

app.use(koa_static(__dirname + '/static'));
app.use(api.routes()).use(api.allowedMethods());

api.get('/', function* (){
    this.body = 'aaa';
});

app.listen(7869);
