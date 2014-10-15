define('directive-common/follow-now-info',['at_app', 'service/goods','filter/stockcode'], function(app) {
    app.lazy.directive('followNowInfo', ['$rootScope', 'goods',
        function($rootScope, goods) {
            return {
                restrict: 'EA',
                templateUrl: '/common/template/common/follow-now-info.html',
                scope: {},
                controller: ['$scope', '$element', '$location',
                    function($scope, $element, $location) {
                        $scope.GoodsType = goods.getGoodsType();
                        $scope.$watch(function() {
                            return $location.path();
                        }, function(news, olds) {
                            $scope.path = news;
                        })
                        $scope.getStockItemsByGoodsType = function(goodsTypeId,i){
                            $scope.idIndex = i;
                            window.location.href="/home/#/channel/"+goodsTypeId;
                        }
                    }
                ]
            }
        }
    ]);
})