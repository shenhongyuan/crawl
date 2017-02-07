/**
 * Created by hongyuan on 2017/2/5.
 */
/**
 * 1.引入mongoose
 * 2.连接数据库
 * 3.定义Schema
 * 4.定义并导出model
 * Category（name,url,id）
 * Movie(name,cid,url)
 * */
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/201612crawl');
let CategorySchema = new mongoose.Schema({
    name:String,
    url:String,
    id:Number
});

exports.Category = mongoose.model('Category',CategorySchema);
let MovieSchema = new mongoose.Schema({
    name:String,
    url:String,
    cid:Number
});
exports.Movie = mongoose.model('Movie',MovieSchema);


