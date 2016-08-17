/**
 * Created by hama on 2016/6/14.
 */
//我们要在这里面，将用户注册的信息发送给服务器
//收集表单的数据



//设置一下表单提交的事件，当我点击submit的时候，这个事件触发了,回调函数执行.

$('form').submit(function(e){
    //第一步,阻止下默认行为
    //禁止表单的自动提交
    //禁止了表单跳转的默认行为，默认的情况下，它会跳转到action属性的地址中去.
    e.preventDefault();
    //第二步，使用post提交，将表单的数据传递给node后台express脑子接收
    //表单当中的所有的数据都已经放在了这个data里面.
    //serialze收集一下表单上所有表单的数据.
    var data = $(this).serialize();

    if($('input[name=password]').val() === $('input[name=rpassword]').val()){
        //第三步,使用post AJAX操作
        //$.post后边跟三个参数，第一个参数是发送的地址，第二个参数是发送的数据,
        //第三个参数是用来处理数据的这个回调函数.在这个回调函数当中，会返回三个数据
        //status,reponse.... 在回调函数当中，我们可以接收到服务器给我们返回的数据内容
        //也就说data是后端服务器返回给我们的数据.
        console.log(data);
        $.post('/register',data,function(data){
            //data里面message是一个返回的信息,例如说注册成功啊，注册失败啦。
            $('.modal-body').text(data.message);
            //我们使用JS将带有返回信息的模态框打开
            //hidden.bs.modal关闭弹出框的时候，执行一个回调函数
            //当返回的code是success的时候，也就说，用户已经注册成功了，
            //我们就跳转到signin.html页面当中去.
            $('.modal').modal('show').on('hidden.bs.modal',function(){
                if(data.code == 'success'){
                    //当用户注册成功之后，跳转到signin.html页面当中去.
                    location.href = '/signin';
                }
            })
        })

    }else{
        $('.modal-body').text('密码不一样');
        $('.modal').modal('show');
    }
})