const koa = require('koa');
const koa_static = require('koa-static');
const koa_router = require('koa-router');
const api = koa_router();
const app = koa();
const util = require('./util/main');
// const router = require('./routes/index');

app.use(koa_static(__dirname + '/static'));
app.use(api.routes()).use(api.allowedMethods());

let routers = util.get_routers(__dirname + '/routes/');
for(let router in routers){
    routers[router](api);
}

app.listen(7869,()=>{
    console.log(7869)
});
