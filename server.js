/**
 * Created by hongyuan on 2017/2/5.
 */
let express = require('express');
let path = require('path');
let app = express();
app.set('view engine','html');
app.set('views',path.resolve('views'));
app.engine('html',require('ejs').__express);

let {Category,Movie} = require('./model');
app.get('/',function (req, res) {
    let cid = req.query.cid;
    Category.find({},function (err, categories) {
        if(categories){
            cid =cid?cid:categories[0].id;
            Movie.find({cid},function (err, movies) {
                res.render('index',{categories,movies,cid});
            })
        }
    })
});

app.listen(8080);