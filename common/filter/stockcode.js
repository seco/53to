'use strict';
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
})