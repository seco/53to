/**
 * Created by Administrator on 14-7-25.
 */
define('directive/float-widget',["at_app", 'atmanlib-provider/modal'], function (app) {
    app.lazy.directive("floatWidget", ["$rootScope","$window","$ATModal", function($rootScope, $window,$ATModal) {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: '/common/template/float-widget.html',
            link: function(scope, element, attr) {
                var returnTop = element.find(".return-top");
                scope.animating = false;
                angular.element($window).scroll(function() {
                    if(!scope.animating){
                        var st = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                        if(st > 100){
                            if(returnTop.is(":hidden")){
                                returnTop.fadeIn();
                            }
                        }
                        else if(!returnTop.is(":hidden")){
                            returnTop.fadeOut();
                        }
                    }
                });
                scope.returnToTop = function(){
                    scope.animating = true;
                    $("html,body").animate({scrollTop: 0}, "fast", function(){
                        scope.animating = false;
                        returnTop.fadeOut();
                    });
                };
                var ATModal;
                //创建APP下载接口
                scope.appShow=function(){
                    ATModal = $ATModal({show: true, template: "/common/template/float-widget-app.html"});
                }
            }
        };
    }]);
});