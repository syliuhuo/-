/**
 * Created by hama on 2016/6/13.
 */
//加载依赖项
//加载web框架
var express = require('express');
//加载路由文件
var routes = require('./routes/index');
//加载模板文件
var template = require('./template');
//创建一个应用
var app = express();
//设置静态资源
app.use(express.static('www'));
//把所有的路由文件都放在routes文件夹下的index.js中去
routes(app);
template(app);
//启动
app.listen(4000,function(){
    console.log('node 4000 is OK');
});

