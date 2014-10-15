define('directive-common/notice', ['at_app'], function(app) {
    app.lazy.directive('notice', ['$rootScope', 'Notice', '$timeout',
        function($rootScope, Notice, $timeout) {
            return {
                restrict: 'EA',
                templateUrl: '/common/template/common/notice.html',
                replace: true,
                scope: {},
                link: function(scope, iElement, iAttrs) {
                    getNotice();

                    function getNotice() {
                        Notice.get().$promise.then(function(data) {
                            scope.noticeData = data;
                            scope.noticeAmount = (scope.noticeData.atNew || 0) + (scope.noticeData.fansNew || 0) + (scope.noticeData.newpm || 0);
                            var _title = document.title;
                            /*titile动态提示效果*/
                            if (scope.noticeAmount > 0) {
                                if (!$rootScope.timer) {
                                    var step = 0;
                                    $rootScope.timer = setInterval(function() {
                                        step++;
                                        if (step == 3) {
                                            step = 1;
                                        }
                                        if (step == 1) {
                                            document.title = '【　　　】' + _title;
                                        }
                                        if (step == 2) {
                                            document.title = '【新消息】' + _title;
                                        }
                                    }, 1000);
                                }

                            } else {
                                if ($rootScope.timer) {
                                    clearInterval($rootScope.timer);
                                    document.title = '吾商--上自家的商城购物';
                                }

                            }
                            /*titile动态提示效果*/
                        });
                        setTimeout(getNotice, 60000);
                        //不刷新页面的情况，新消息提醒一分钟查询一次哦~
                    }
                    /*$rootScope.$on('OAuth:login', function(e, data) {
                     if (data) {
                     getNotice();
                     }
                     })*/
                    //消息的手动推送请求：送
                    $rootScope.$on('getNotice:remind', function(e, data) {
                        if (data) {
                            getNotice();
                        }
                    })
                }
            };
        }
    ]);
});