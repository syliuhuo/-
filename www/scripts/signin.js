/**
 * Created by hama on 2016/6/14.
 */
//登录的提交

//已经登录了，就不能在访问登录页面了吧
if($.cookie('petname')){
    location.href = '/';
}

$('form').submit(function(e){
    //第一步，还是阻止一下默认行为
    e.preventDefault();
    //第二步,收集一下表单的数据
    var data = $(this).serialize();
    //第三步,开始发送,ajax
    $.post('/signin',data,function(res){
        //data是后端返回的信息
        if(res.code == 'success'){
            location.href = '/';
        }else{
            $('.modal-body').text(res.message);
            $('.modal').modal('show');
        }
    })
})