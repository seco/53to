'use strict';
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
})