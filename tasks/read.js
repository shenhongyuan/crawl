/**
 * Created by hongyuan on 2017/2/5.
 */
//传入url地址，返回此地址下面的分类列表
let url = 'http://top.baidu.com/category?c=1&fr=topindex';
/**
 * 1. 读取url地址中的内容 request
 * 2. 把响应体进行转码，转成utf8编码
 * 3. 把转码后的字符串转成$对象
 * 4. 转完后提取需要数组,数组由分类对象组成，每个有对象有三个属性，分别是 名称 ID url,url
 * 地址可以用来获取分类下面的电影列表
 * @param url 代表分类的URL地址
 * @param callback 回调，当读完转完之后调用callback并传入此数组
 */
let request = require('request');
let iconv = require('iconv-lite');
let cheerio = require('cheerio');
let debug = require('debug')('crawl:read');
exports.category = function(url,callback){
    //encoding为null表示不需要request帮我们把Buffer转成字符串
    request({url,encoding:null},function(err,response,body){
        //当没有错误并且响应的状态码为200的时候
        if(!err && response.statusCode == 200){
            //把gbk格式的字符串转成utf8的字符串
            body = iconv.decode(body,'gbk');
            //把此HTML字符串转成jquery对象
            let $ = cheerio.load(body);
            //声明一个空的分类列表
            let categories = [];
            //查找a标签的集合并进行循环
            $('.hd .title a').each(function(index,item){
                //把item转成jquery对象
                let $this = $(item);
                //构建一个分类对象
                let category = {
                    //id就是此分类的ID
                    id:$this.parent().attr('data'),
                    name:$this.text(),//分类的名称
                    //url地址，用来获取分类下面的电影列表
                    url:`http://top.baidu.com${$this.attr('href').slice(1)}`,
                }
                debug(`读取到分类:${category.name}`);
                //把此分类对象添加到数组中去
                categories.push(category);
            });
            callback(null,categories);
        }else{
            callback(err);
        }
    });
}

/*exports.category(url,function(err,categoires){
 console.log(categoires);
 //[{id:26,name:'全部电影',url:'http://top.baidu.com/buzz?b=26&c=1&fr=topcategory_c1'}]
 });*/

exports.movie = function(cid,url,callback){
    request({url,encoding:null},function(err,response,body){
        if(!err && response.statusCode == 200){
            body = iconv.decode(body,'gbk');
            let $ = cheerio.load(body);
            let movies=[];
            $('.keyword .list-title').each(function(index,item){
                let $this = $(item);
                let movie = {
                    cid,
                    name:$this.text(),
                    url:$this.attr('href')
                }
                debug(`读取到电影:${movie.name}`);
                movies.push(movie);
            });
            callback(null,movies);
        }
    })
}
/*
 exports.movie(26,'http://top.baidu.com/buzz?b=26&c=1',function(err,movies){
 console.log(movies);
 //[{cid:26,name:'西游伏妖篇',url:'https://www.baidu.com/baidu?cl=3&tn=SE_baiduhomet8_jmjb7mjw&fr=top1000&wd=%CE%F7%D3%CE%B7%FC%D1%FD%C6%AA'}]
 });*/
