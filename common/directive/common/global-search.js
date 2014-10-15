define('directive-common/global-search',['at_app','atmanlib-lib/EMAIL','service/oauth'], function(app,EMAIL) {
    app.lazy.directive('globalSearch', ['$timeout',
        function($timeout) {
            return {
                restrict: 'EA',
                templateUrl: '/common/template/common/global-search.html',
                link: function(scope, element, attrs) {
                    scope.showTip = false;
                    scope.selectedIndex = -1;
                    scope.search = function () {
                        if(scope.searchContent){
                            window.location.href="/home/#/item/search/" + scope.searchContent;
                        }
                    };

                    scope.subSearchContent = function() {
                        if(scope.searchContent && scope.searchContent.length > 12){
                            return scope.searchContent.substring(0, 12) + "...";
                        }
                        return scope.searchContent;
                    };

                    scope.inputFocus = function() {
                        scope.showTip = true;
                    };

                    scope.inputBlur = function() {
                        $timeout(function(){
                            scope.showTip = false;
                        }, 200);
                    };

                    scope.inputKeyDown = function($event){
                        if($event.keyCode == 13){
                            if(scope.selectedIndex < 1) {
                                window.location.href="/home/#/item/search/" + scope.searchContent;
                            }
                            else if(scope.selectedIndex == 1){
                                window.location.href="/home/#/user/search/" + scope.searchContent;
                            }
                            else if(scope.selectedIndex == 2){
                                window.location.href="/home/#/weibo/search/" + scope.searchContent;
                            }
                        }
                        else if($event.keyCode == 38){
                            if(scope.searchContent && scope.showTip && scope.selectedIndex > 0) {
                                scope.selectedIndex--;
                            }
                        }
                        else if($event.keyCode == 40){
                            if(scope.searchContent && scope.showTip && scope.selectedIndex < 2) {
                                scope.selectedIndex++;
                            }
                        }
                        return false;
                    }
                }
            }
        }
    ]);
});