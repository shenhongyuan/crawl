/**
 * Created by hongyuan on 2017/2/5.
 */

let {Category,Movie} = require('../model');
let debug = require('debug')('crawl:write');
exports.category = function(categoires,callback){
    debug(`保存分类:${categoires}`);
    Category.create(categoires,callback);
}

exports.movie = function(movies,callback){
    debug(`保存电影:${movies}`);
    Movie.create(movies,callback);
}

