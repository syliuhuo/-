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



//用户post提交注册页面
app.post('/register',function(req,res){
    //首先我们先保存下用户的IP
    req.body.ip = req.ip;
    //再保存下日期
    req.body.time = new Date();
    //发送函数
    function send(code,message){
        res.status(200).json({code,message});
    }
    //把数据保存在一个users/用户名命名.txt的文件中
    function saveFile(){
        //文件名
        var filename = `users/${req.body.petname}.txt`;
        //先查看下文件名是否存在
        fs.exists(filename,function(exists){
            if(exists){
                //如果存在的话，在模态框中提示用户名已经存在了
                send('error','用户名已经存在');
            }else{
                //如果不存在的话，保存一下
                fs.appendFile(filename,JSON.stringify(req.body),function(err){
                    if(err){
                        send('error','系统错误');
                    }else{
                        send('success','注册成功');
                    }
                })

            }
        })
    }
    //创建我们的users文件夹
    fs.exists('users',function(exists){
        if(exists){
            saveFile();
        }else{
            fs.mkdir('users',function(err){
                if(err){
                    send('error','系统错误');
                }else{
                    saveFile();
                }
            })
        }
    })
})

//启动
app.listen(3000,function(){
    console.log('node is OK');
})

