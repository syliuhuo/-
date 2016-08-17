/**
 * Created by Administrator on 2016/6/16.
 */

$('form').submit(function(e){
    e.preventDefault();
    var data = $(this).serialize();
    $.post('/answer',data,function(res){
        $('.modal-body').text(res.message);
        $('#myModal').modal('show').on('hidden.bs.modal',function(){
            if(res.code == 'success'){
                location.href = '/';
            }
        })
    })
});