define('atmanlib-provider/confirm',["at_app", "atmanlib-provider/popover"], function (app) {
    app.lazy.provider('$ATConfirm', function() {
        var defaults = this.defaults = {
            template: '/atmanlib/provider/template/confirm.tpl.html',
            show: true,
            trigger: "manual"
        };
        this.$get = ["$ATPopover", function($ATPopover) {
            function ConfirmFactory(element, config) {
                var options = angular.extend({}, defaults, config);
                var $ATConfirm = $ATPopover(element, options);
                if(options.content) {
                    $ATConfirm.$scope.content = options.content;
                }
                $ATConfirm.$scope.popoverContainerClick = function($event){
                    if($event && $event.stopPropagation){
                        $event.stopPropagation();
                    }
                    else{
                        window.event.cancelBubble = true;
                    }
                };
                return $ATConfirm;
            }
            return ConfirmFactory;
        }];
    });
});
