'use strict';
define('common-ctrl/user/at.user.info.ctrl', ['at_app', 'service/weibo'], function(app) {
    app.lazy.controller('ctrl.user-info', ['$scope', '$element', '$compile', '$rootScope', '$timeout', 'weibo', 'Notice', 'GetStockBrief', 'BuyerAccountmyself',
        function($scope, $element, $compile, $rootScope, $timeout, weibo, Notice, GetStockBrief, BuyerAccountmyself) {
            $element.html('<div ng-include="template" onload="htmlLoad()" class="scale-animate" ></div>');
            $scope.template = '/common/template/user/user-info.html';
            $compile($element.contents())($scope);

            $scope.htmlLoad = function() {
                var obj = {};
                $rootScope.$on('OAuth:login', function(e, data) {
                    if (data) {
                        getWbUI();
                        getStockBrief();
                    }
                });

                function getWbUI() {
                    weibo.getWbUser({
                        name: $rootScope.userInfo.nickName//,
                        //uuid: new Date().getTime()
                    }).then(function(data) {
                        $scope.wbUserInfo = data;
                    })
                }

                function getStockBrief() {
                    //BUG 查询还是原用户的股票首页
                    GetStockBrief.get({
                        brief: 'brief'//,
                        //uuid: new Date().getTime()
                    }, function(data) {
                        $scope.stockbrief = data;
                    })
                }

                getWbUI();
                getStockBrief();
                $scope.buyerAccountInfo = BuyerAccountmyself.get();
            }
        }
    ]);
})