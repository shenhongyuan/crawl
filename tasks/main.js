/**
 * Created by hongyuan on 2017/2/5.
 */
let {category:readCategory,movie:readMovie} = require('./read');
let {category:writeCategory,movie:writeMovie} = require('./write');
let url = 'http://top.baidu.com/category?c=1&fr=topindex';
let async = require('async');
let {Category,Movie} = require('../model');
/**
 * 1. 读取分类数组
 * 2. 从分类对象的url属性读取电影数组
 * 3. 保存分类数组
 * 4. 保存电影数组
 */
let debug = require('debug')('crawl:main');
async.waterfall([
    function(callback){
        async.parallel([
            function(cb){
                Category.remove({},cb);
            },
            function(cb){
                Movie.remove({},cb);
            }
        ],callback);
    },
    function(data,callback){
        //读取分类列表，向callback传入分类的数组
        readCategory(url,callback);
    },
    function(categories,callback){
        //把上面获取到的分类数组保存到数据库中，并调用回调函数
        writeCategory(categories,callback);
    },
    //categories是保存之后的文档数组
    function(categories,callback){
        //迭代循环分类数组，针对数组中的每一个元素执行对应的函数 调用cb代表本函数执行完毕
        let movies = [];
        async.forEach(categories,function(category,cb){
            readMovie(category.id,category.url,function(err,items){
                movies = movies.concat(items);
                cb();
            });
        },function(){
            callback(null,movies);
        });
    },
    function(movies,callback){
        writeMovie(movies,callback)
    }
],function(err,result){
    debug('任务执行完毕!');
});
