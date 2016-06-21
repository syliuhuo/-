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

//加载模板
var template = require('art-template');


//创建一个应用
var app = express();

//把模板的配置写一下
app.engine('.html',template.__express);
app.set('view engine','html');

//模板过滤器放在这里
template.helper('ms',function(time){
    var time = new Date(time);
    return time.getTime();
});
template.helper('formatTime',function(){
    var time = new Date(time);
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var day = time.getDate();
    var month = month < 10 ? '0' + month : month;
    var day = day < 10 ? '0' + day : day;
    return `${year}-${month}-${day}`;
});




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
//这里面的意思是，如果用户发送了一个post请求，而这个post请求的地址是register，那么
//我就用后边的这个回调函数来处理.回调函数中有两个参数,req请求.res返回
//也就是说在这个回调函数，我既可以拿到请求里面的数据req，也可以返回给用户数据res.
app.post('/register',function(req,res){
    //req.query ,req.body拿到数据,get提交的数据req.query里面，如果是post提交,那么数据就是
    //在req.body里面取得
    //首先我们先保存下用户的IP
    //我在拿到数据之前，在这个body里面新增了两个属性，第一个属性是用户的IP，第二个属性是
    //用户发送请求的当前时间，我也想记录一下，和数据放在一起，存到文件当中去.
    req.body.ip = req.ip;
    //再保存下日期
    req.body.time = new Date();
    //取一下用户名 req.body.petname
    //取一下密码 req.body.password
    //取一下email req.body.email


    //发送函数
    function send(code,message){
        res.status(200).json({code,message});
    }
    //把数据保存在一个users/用户名命名.txt的文件中
    //保存数据到文件的一个函数，将注册的用户名保存到users/用户名.txt文件当中去.
    //这样，我就能知道哪些人注册了，我才可以进行登录的判断。
    function saveFile(){
        //首先，我要确定一下保存的文件目录是在users/用户名.txt文件当中去.
        //以后，写这个文件路径的时候加`` ,先记住.
        var filename = `users/${req.body.petname}.txt`;
        //fs是不是专门来负责文件的读写的.
        //fs.exists它是用来检测文件是否存在的这么一个函数.
        //传递了检测文件的文件名，检测完文件名调用回调函数，结果就是exists
        fs.exists(filename,function(exists){
            if(exists){
                //如果存在的话，在模态框中提示用户名已经存在了
                //用户注册的信息，我查看一下，在这个文件中已经存在了，那么，我就返回给
                //前端，告诉他，用户名已经存在了,前端呢，通过modal模态框输出结果。
                send('error','用户名已经存在');
                //res.status(200).json({code:"error",message:'用户名已经存在'});
            }else{
                //如果不存在的话，保存一下
                //如果文件名不存在，说明可以进行正常的注册啦。
                //fs.appendFile是用来打开文件并写入的一个函数
                //第一个参数，要写入的文件的名称
                //第二个参数，要写入哪些数据
                //第三个参数，回调函数当中，返回错误信息，err
                //根据返回的信息，send不同的状态。
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
//登录的处理
app.post('/signin',function(req,res){
    //第一步打开对应的用户的文件夹
    var filename = `users/${req.body.petname}.txt`;
    function send(code,message){
        res.status(200).json({code,message});
    }
    //第二步,我先看一下，用户提交的用户名是否注册了
    fs.exists(filename,function(exists){
        if(exists){
            //看看密码
            fs.readFile(filename,function(err,data){
                if(err){
                    send('error','系统错误');
                }else{
                    //把它转化为JS对象
                    var user = JSON.parse(data);
                    //剩下比较密码了
                    if(user.password == req.body.password){
                        //在服务器端创建一个cookie，保存起来，里面
                        //存储的是用户名信息
                        res.cookie('petname',req.body.petname);
                        send('success','登录成功');
                    }else{
                        send('error','密码错误');
                    }
                }
            })
        }else{
            send('error','用户名不存在');
        }
    })
})
//提问的处理
app.post('/ask',function(req,res){
    var petname = req.cookies.petname;
    req.body.ip = req.ip;
    var time = new Date();
    req.body.time = time;
    //记录一下当前提问的用户
    req.body.petname = petname;
    function send(code,message){
        res.status(200).json({code,message});
    }
    function saveFile(){
        var filename = `questions/${time.getTime()}.txt`;
        fs.exists(filename,function(exists){
            if(exists){
                send('error','系统错误');
            }else{
                fs.appendFile(filename,JSON.stringify(req.body),function(err){
                    if(err){
                        send('error','系统错误');
                    }else{
                        send('success','提问成功');
                    }
                })
            }
        })
    }
    fs.exists('questions',function(exists){
        if(exists){
            saveFile();
        }else{
            fs.mkdir('questions',function(err){
                if(err){
                    send('error','系统错误')
                }else{
                    saveFile();
                }
            })
        }
    })
})

//首页展示
//首页展示
app.get('/questions',function(req,res){
    function send(code,message,data){
        res.status(200).json({code,message,data});
    }
    //读取questions里面所有的文件,将文件的信息发送给前端
    function readFiles(i,files,questions,callback){
        if(i < files.length){
            fs.readFile(`questions/${files[i]}`,function(err,data){
                questions.push(JSON.parse(data));
                readFiles(++i,files,questions,callback);
            })
        }else{
            callback();
        }
    }
    //开始读取文件
    fs.readdir('questions',function(err,file){
        if(err){
            send('error','文件读取失败');
        }else{
            file = file.reverse();
            var questions = [];
            readFiles(0,file,questions,function(){
                send('success','读取成功',questions);
            })
        }
    })
})
//回答

app.post('/answer',function(req,res){
    function send(code,message){
        res.status(200).json({code,message});
    }
    var filename = `questions/${req.cookies.question}.txt`;
    //当前登录的用户名
    var petname = req.cookies.petname;
    req.body.petname = petname;
    req.body.ip = req.ip;
    req.body.time = new Date();
    //读取文件写入文件
    fs.readFile(filename,function(err,data){
        if(err){
            send('error','读取失败');
        }else{
            var question = JSON.parse(data);
            //如果它没有数据，则创建一个空的数据
            if(!question.answers) question.answers = [];
            question.answers.push(req.body);

            fs.writeFile(filename,JSON.stringify(question),function(err){
                if(err){
                    send('error','读取失败');
                }else{
                    send('success','读取成功');
                }
            })
        }
    })

})
//图片
app.post('/user',uploads.single('photo'),function(req,res){
    res.status(200).json({code:'success',message:'发送成功'});
})

//退出
app.get('/signout',function(req,res){
    //清除一下cookie当中petname的信息
    res.clearCookie('petname');
    //返回一个成功的信息.
    res.status(200).json({code:'success'});
})
//启动
app.listen(3000,function(){
    console.log('node is OK');
})

