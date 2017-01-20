"use strict";
const fs = require('fs');
const util = require('../util/main');

let Visitors, visitors_count;
global.mongodb_ready.push((err, db) => {
    Visitors = db.collection('visitors');
    Visitors.find({$or: [
        {count: {$type: 16}},
        {count: {$type: 18}},
    ]}).toArray((e, d) => {
        if (!d.length) {
            Visitors.insertOne({count: 1});
            visitors_count = 1;
            return;
        }
        visitors_count = d[0].count;
    });
});

module.exports = router => {
    router.get('/tool/view_part', function* () {
        let part = this.query.part;
        let html = util.render(`main/${part}.ejs`, {nav: 'index'});
        this.body = html;
    });
    router.get('/tool/music_info', function* () {
        let static_path = `${__dirname}/../static`,
            file_path = `/music/mp3`;
        let path = static_path + file_path;
        let file_list = fs.readdirSync(path);
        let list = [];
        file_list.forEach((name) => {
            let [author, title] = name.slice(0, name.lastIndexOf('.')).split(' - ');
            list.push({
                src: file_path + '/' + name,
                author: author,
                title: title,
                cover: `/music/cover/${author}.jpg`,
                lrc: `/music/lrc/${title}.lrc`,
            });
        });
        this.response.set('Access-Control-Allow-Origin', '*'); // 允许跨域
        this.body = list
    });
    router.get('/tool/visitors', function* () {
        visitors_count++;
        Visitors.updateOne({$or: [
            {count: {$type: 16}},
            {count: {$type: 18}},
        ]}, {$set: {count: visitors_count}});
        this.body = visitors_count;
    });
};