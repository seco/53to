'use strict';
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
})