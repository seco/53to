'use strict';
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
})