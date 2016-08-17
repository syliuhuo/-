/**
 * Created by Administrator on 2016/6/22.
 */
module.exports = function(app){
    //加载模板
    var template = require('art-template');
    //把模板的配置写一下
    app.engine('.html',template.__express);
    app.set('view engine','html');
    //模板过滤器放在这里
    template.helper('ms',function(time){
        var time = new Date(time);
        return time.getTime();
    });
    template.helper('formatTime',function(time){
        return formatDate(time);
    });
    function formatDate(t){
        var t = new Date(t);
        var year = t.getFullYear();
        var month = t.getMonth() + 1;
        var day = t.getDate();
        var hour = t.getHours();
        var second = t.getMinutes();
        hour = hour < 10 ? '0' + hour : hour ;
        second = second < 10 ? '0' + second : second;
        return `${year}-${month}-${day} ${hour}:${second}`;
    }
}