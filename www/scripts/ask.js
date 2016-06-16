/**
 * Created by hama on 2016/6/16.
 */
/* 提问*/

if(!$.cookie('petname')){
    location.href = 'signin.html';
}
//提问的事件
$('form').submit(function(e){
    e.preventDefault();
    //接收一下数据
    var data = $(this).serialize();
    $.post('/ask',data,function(res){
        $('.modal-body').text(res.message);
        $('#myModal').modal('show').on('hidden.bs.modal',function(){
            if(res.code == 'success'){
                location.href = '/';
            }
        })
    })
})