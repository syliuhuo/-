/**
 * Created by hama on 2016/6/13.
 */

//加载依赖项
//加载web框架
var express = require('express');
//加载POST提交支持
var bodyParser = require('body-parser');
//加载cookie支持
var cookieParser = require('cookie-parser');
//加载文件读写支持
var fs = require('fs');
//加载文件的上传下载支持
var multer = require('multer');

//创建一个应用
var app = express();

//使用某些插件
//文件下载的配置
var storage = multer.diskStorage({
    destination:'www/uploads',
    filename:function(req,file,callback){
        var petname = req.cookies.petname;
        callback(null,`${petname}.jpg`);
    }
})
//应用这个配置
var uploads = multer({storage});
//设置下post提交
app.use(bodyParser.urlencoded({extended:true}));
//应用cookie
app.use(cookieParser());
//设置静态资源
app.use(express.static('www'));


//启动
app.listen(3000,function(){
    console.log('node is OK');
})

