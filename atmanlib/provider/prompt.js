define('atmanlib-provider/prompt',["at_app", "atmanlib-provider/modal"], function (app) {
    app.lazy.provider('$ATPrompt', function() {
        var defaults = this.defaults = {
            template: '/atmanlib/provider/template/prompt.tpl.html',
            show: true,
            backdrop: false
        };
        this.$get = ["$ATModal", function($ATModal) {
            function PopoverFactory(config) {
                var options = angular.extend({}, defaults, config);
                var $ATPrompt = $ATModal(options);
                if(options.content) {
                    $ATPrompt.$scope.content = options.content;
                }
                return $ATPrompt;
            }
            return PopoverFactory;
        }];
    });
});
