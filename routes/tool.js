"use strict";
const fs = require('fs');
const util = require('../util/main');

module.exports = (router) => {
    router.get('/tool/view_part', function* (){
        let part = this.query.part;
        let html = util.render(`_main/${part}.ejs`, {nav: 'index'});
        this.body = html;
    });
    router.get('/tool/music_info', function* (){
        let static_path = `${__dirname}/../static`,
            file_path = `/music/mp3`;
        let path = static_path + file_path;
        let file_list = fs.readdirSync(path);
        let list = [];
        file_list.forEach((file_name) => {
            let [author, name] = file_name.split('.')[0].split('---');
            list.push({
                path: file_path + '/' + file_name,
                author: author,
                name: name,
                cover: `/music/cover/${author}.jpg`
            })
        });
        this.body = list
    });
};