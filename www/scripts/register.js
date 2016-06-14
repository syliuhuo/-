/**
 * Created by hama on 2016/6/14.
 */
//我们要在这里面，将用户注册的信息发送给服务器
//收集表单的数据

$('form').submit(function(e){
    //第一步,阻止下默认行为
    //禁止表单的自动提交
    e.preventDefault();
    //第二步，使用post提交，将表单的数据传递给node后台express脑子接收
    var data = $(this).serialize();
    //第三步,使用post AJAX操作
    $.post('/register',data,function(data){
        $('.modal-body').text(data.message);
        $('.modal').modal('show').on('hidden.bs.modal',function(){
            if(data.code == 'success'){
                location.href = 'signin.html';
            }
        })
    })
})