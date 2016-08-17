/**
 * Created by hama on 2016/6/15.
 */
//还是如果不登录，不让它访问，提示它登录

$('form').submit(function(e){
    e.preventDefault();
    //通过formData来进行传递
    var data = new FormData(this);
    $.ajax({
        //地址
        url:'/user',
        //类型
        type:'post',
        //数据
        data:data,
        // 告诉jQuery不要去设置Content-Type请求头
        contentType:false,
        // 告诉jQuery不要去处理发送的数据
        processData:false,
        success:function(res){
            //如果是成功了，则让它跳转到首页
            if(res.code == 'success'){
                location.href = '/';
            }else{
                //如果失败了，则让它显示失败信息.
                $('.modal-body').text(res.message);
                $('#myModal').modal('show');
            }
        }
    })
});