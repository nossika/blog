"use strict";
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const Util = {
    get_routers: (file_path, excepts = []) => {
        let routers = {};
        let files = fs.readdirSync(file_path);
        files.sort().forEach((file_name) => {
            if(excepts.includes(file_name)) return;
            routers[file_name.split('.')[0]] = require(file_path + file_name);
        });
        return routers;
    },
    render: (view_path, params = {}) => {
        let ejs_path = __dirname + '/../views';
        params.filename = ejs_path + '/_parts/';
        let tpl;
        try{
            tpl = fs.readFileSync(ejs_path+'/'+view_path,'utf-8');
        }catch (e){
            tpl = '';
        }
        return ejs.render(tpl, params);
    }
};

module.exports = Util;