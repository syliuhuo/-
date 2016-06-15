/**
 * Created by hama on 2016/6/15.
 */

var petname = $.cookie('petname');
//登录的判断
if(petname){
    //如果存在的话，是不是说明用户已经登录啦？
    $('.out').css('display','none');
    $('.in').find('.dropdown-toggle').html(petname + '<span class="caret"></span>');
    $('.in').css('display','block');
}else{
    //那如果不存在的话，是不是说明用户没有登录啊？
    $('.in').css('display','none');
    $('.out').css('display','block');
}
//退出
$('.dropdown-menu li:nth-child(3)').click(function(){
    $.get('/signout',null,function(data){
        if(data.code == 'success'){
            location.href = '/';
        }
    })
})
