define('atmanlib-provider/popover',['at_app', 'atmanlib-provider/tooltip'], function(app) {
    app.lazy.provider('$ATPopover', function() {
        var defaults = this.defaults = {
            animation: 'am-fade',
            placement: 'right',
            template: '/src/template/popover.tpl.html',
            contentTemplate: false,
            trigger: 'hover',
            keyboard: true,
            html: false,
            title: '',
            content: '',
            delay: {
                show: 200,
                hide: 200
            },
            container: false
        };
        this.$get = ["$ATTooltip", function($ATTooltip) {
            function PopoverFactory(element, config) {
                var options = angular.extend({}, defaults, config);
                var $ATPopover = $ATTooltip(element, options);
                if(options.content) {
                    $ATPopover.$scope.content = options.content;
                }
                $ATPopover.target = element;
                return $ATPopover;
            }
            return PopoverFactory;
        }];
    });
});