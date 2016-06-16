/**
 * Created by hama on 2016/6/16.
 */
function formatDate(t){
    var year = t.getFullYear();
    var month = t.getMonth() + 1;
    var day = t.getDate();
    var hour = t.getHours();
    var minutes = t.getMinutes();
    minutes = minutes<10 ? '0' + minutes : minutes;
    var resule = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes;
    return resule;
}
//回答
var petname = $.cookie('petname');
$('.questions').delegate('[question]','click',function(){
    if(petname){
        $.cookie('question',$(this).attr('question'));
        location.href = '/answer.html';
    }else{
        location.href = '/signin.html';
    }
});
$.getJSON('/questions',function(res){
    var html = '';
    for(var i = 0;i<res.data.length;i++){
        var q = res.data[i];
        html += '<div class="media" question="' + new Date(q.time).getTime() + '">';
        html += '<div class="media-left">';
        html += '<a>';
        html += '<img class="media-object" src="uploads/'+ q.petname + '.jpg">';
        html += '</a>';
        html += '</div>';
        html += '<div class="media-body media-l">';
        html += '<h4 class="media-heading">' + q.petname + '</h4>';
        html += q.content;
        html += '<div class=media-footer>';
        html += formatDate(new Date(q.time));
        html += '</div>';
        html += '</div>';
        html += '</div>';

        //遍历回答

        if(q.answers){
            for(var j = 0;j<q.answers.length;j++){
                var a = q.answers[j];
                html += '<div class="media" question="' + new Date(q.time).getTime() + '">';
                html += '<div class="media-body media-r">';
                html += '<h4 class="media-heading">'+a.petname + '</h4>';
                html += a.content;
                html += '<div class="media-footing">';
                html += formatDate(new Date(q.time));
                html += '</div>';
                html += '</div>';
                html += '<div class="media-right">';
                html += '<a>';
                html += '<img class="media-object" src="uploads/' + a.petname + '.jpg">';
                html += '</a>';
                html += '</div>';
                html += '</div>';
            }
        }
    }
    $('.questions').html(html);
});

/*
<div class="media">
    <div class="media-left">
    <a href="#">
    <img class="media-object" src="..." alt="...">
    </a>
    </div>
    <div class="media-body">
    <h4 class="media-heading">Media heading</h4>
...
</div>
</div>*/
