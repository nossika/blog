const koa = require('koa');
const koa_static = require('koa-static');
const koa_router = require('koa-router');
const api = koa_router();
const app = koa();
const ejs = require('ejs');
const fs = require('fs');



app.use(koa_static(__dirname + '/static'));
app.use(api.routes()).use(api.allowedMethods());

api.get('/', function* (){
    let html = ejs.render(fs.readFileSync(__dirname + '/views/index.ejs','utf-8'),{
        aaa: 111154,
        filename: __dirname + '/views/parts/'
    });
    this.body = html;
});
console.log(ejs)

app.listen(7869);
