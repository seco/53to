define('filter/at_link',['at_app','directive/at_user_popover'], function(app) {
    app.lazy.filter('atLink',function() {
        return function (args) {
            if(args&&args.indexOf('管理员')==-1){
                args = args.replace(/@([\u4e00-\u9fA5A-Za-z0-9\-_]+)/g,'<a class=\"lk-primary\" href="/weibo/#/user/$1" at-user-popover="\'$1\'" title="$1">@$1</a>');
            }
            return args;
        }
    })
});
define('filter/email',['at_app'], function(app) {
    app.lazy.filter('emailFr', function() {
        return function(input, args) {
            var reg = [];
            var list = {};
            var len = 0;
            reg = args.match(/.*@(.+)/)||[];
            if (reg.length>1) {
                len = reg[1].length
                angular.forEach(input, function(data, i) {
                    if (reg[1]==i.substr(0,len)) {
                        list[i.substr(len)] = data;
                    }
                })
                return list;
            } else {
                return input;
            }

        }
    });
});
define('filter/emojis',['at_app','service/EMOJIS'], function(app) {
    app.lazy.filter('emojisFr', ['EMOJIS',
        function(EMOJIS) {
            return function(args) {
                if (args) {
                    angular.forEach(EMOJIS, function(data, i) {
                        args = args.replace(data.phrase, '<img class="lazy" src="'+data.url+'" data-original="' + data.url + '" title="' + data.value + '" alt="' + data.value + '">');
                    });
                }
                return args;
            }
        }
    ])
});
define('filter/forbidden',['at_app'], function(app) {
    app.lazy.filter('forbidden', function() {
        return function(input,reg) {
            if(input){
                reg = reg||/\{*\}*/g;
                return input.replace(reg,'');
            }
            return input;
        }
    });
});
define('filter/goodstype2name',['at_app','service/GOODSTYPE'], function(app) {
    app.lazy.filter('goodstype2nameFr',['GOODSTYPE', function(GOODSTYPE) {
        return function(input) {
            var pId = GOODSTYPE[input][1];
            return GOODSTYPE[pId][0];
        }
    }]);
})
define('filter/stockcode',['at_app'], function(app) {
    app.lazy.filter('stockcode', function() {
        return function(input,reg) {
            var tmp = '',len=0;
            if(input){
                reg = reg||6;
                len = (input+'').length;
                for (var i = reg - 1; i >= 0; i--) {
                    if(i<len){
                        tmp = tmp + input;
                        break;
                    }else{
                        tmp = tmp+'0';
                    }
                };
            }else{
                tmp = input;
            }
            return tmp;
        }
    });
});