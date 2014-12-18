'use strict';
define('common-ctrl/at.follow.now.info.ctrl', ['at_app', 'service/goods', 'filter/stockcode'], function(app) {
    app.lazy.controller('ctrl.follow-now-info', ['$scope', '$element', '$compile', '$rootScope', '$location', 'goods',
        function($scope, $element, $compile, $rootScope, $location, goods) {
            $element.html('<div ng-include="template" onload="htmlLoad()" class="scale-animate" ></div>');
            $scope.template = '/common/template/common/follow-now-info.html';
            $compile($element.contents())($scope);

            function getGoodsType() {
                goods.getGoodsType(function(datas) {
                    angular.forEach(datas, function(data, i) {
                        if (data.name == '首发') {
                            datas.splice(i, 1);
                            datas.unshift(data);
                        }
                    })
                    $scope.GoodsType = datas;
                });
            }
            $rootScope.$on('OAuth:login', function(e, data) {
                if (data) {
                    getGoodsType();
                }
            })

            $scope.$watch(function() {
                return $location.path();
            }, function(news, olds) {
                $scope.path = news;
            })
            $scope.getStockItemsByGoodsType = function(goodsTypeId, i) {
                $scope.idIndex = i;
                window.location.href = "/home/#/channel/" + goodsTypeId;
            }
            /*$scope.toHelp1=function(){
             window.open('/common/template/serviceClause/consumer-finance.html');
             }
             $scope.toHelp=function(){
             window.open('/common/template/serviceClause/consumer-finance.html#perTenThousand');
             }*/
        }
    ]);
})