define('directive-common/tiny-shop-car',['at_app'], function(app) {
    app.lazy.directive('tinyShopCar', ['$rootScope', 'SmallShoppingCar',
        function($rootScope, SmallShoppingCar) {
            return {
                restrict: 'EA',
                templateUrl: '/common/template/common/tiny-shopping-car.html',
                replace: true,
                scope: {},
                link: function(scope, iElement, iAttrs) {

                    scope.isLogged = $rootScope.isLogged;

                    //小购物车请求数据
                    function getCar() {
                        scope.smallShoppingCarData = SmallShoppingCar.get();
                    }
                    getCar();
                    $rootScope.$on('at.getsmallshopingcar', function(e, data) {
                        if (data) {
                            getCar();
                        }
                    });
                    $rootScope.$on('OAuth:login', function(e, data) {
                        if(data){
                            getCar();
                            scope.isLogged = 1;
                        }
                    });
                    $rootScope.$on('OAuth:logout', function(e, data) {
                        getCar();
                        scope.isLogged = 0;
                    });
                }
            };
        }
    ]);
})