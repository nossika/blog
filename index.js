"use strict";
const koa = require('koa');
const koa_static = require('koa-static');
const koa_parser = require('koa-bodyparser');
const koa_router = require('koa-router')();
const app = koa();
const util = require('./util/main');
const config = require('./config');

global.mongodb_ready = [];
require('mongodb').MongoClient.connect('mongodb://localhost/nossika', (err, db) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log('mongodb://localhost/nossika', '-connected');
    global.mongodb_ready.forEach(fn => fn(err, db));
});


app.use(koa_parser());
app.use(koa_static(__dirname + '/static'));
app.use(koa_router.routes()).use(koa_router.allowedMethods());

let routers = util.get_routers(__dirname + '/routes/');
for(let router in routers){
    routers[router](koa_router);
}

app.use(function* (){
    this.body = util.render('main.ejs', {nav: '404'});
});

process.on('uncaughtException', function(err) {
    console.log('-x- Caught exception: ' , err.stack);
});

app.listen(config.port,()=>{
    console.log(`listen at localhost:${config.port} !`)
});
