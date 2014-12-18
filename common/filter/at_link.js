define('filter/at_link',['at_app','directive/at_user_popover'], function(app) {
    app.lazy.filter('atLink',function() {
        return function (args) {
            result = args.replace(/@([(\u4e00-\u9fA5A-Za-z0-9\-_)]+[^((https|http|ftp):\/\/)])/g,'<a class=\"lk-primary\" href="/weibo/#/user/$1" at-user-popover="\'$1\'" title="$1">@$1</a>');
            result = result.replace(/((https|http|ftp):\/\/[\x00-\xff^(\u4e00-\u9fA5)]+)/g,'<a class=\"lk-primary\" target="_blank" href="$1" title="$1">$1</a>');
            return result;
        }
    });
    app.lazy.filter('atLink2',function() {
        return function (args) {
            result = args.replace(/@([(\u4e00-\u9fA5A-Za-z0-9\-_)]+[^((https|http|ftp):\/\/)])/g,'<a class=\"lk-primary\" href="/weibo/#/user/$1" at-user-popover="\'$1\'" title="$1">@$1</a>');
            return result;
        }
    });
});
