'use strict';
define('service/goods',['at_app'], function(app) {
    app.lazy.factory('goods', ['$resource',
        function($resource) {

            var GP =  $resource('/restful/rest/common/goodsPromotion', {}, {
                'get': {
                    method: 'GET'
                }
            });
            var GD =  $resource('/restful/rest/goods/:id/detail');
            var GT =  $resource('/restful/rest/common/goodsType', {}, {
                'get': {
                    method: 'GET',
                    isArray: !0
                }
            });
            var GTbyId =  $resource('/restful/rest/common/goodsType/:id', {}, {
                'get': {
                    method: 'GET',
                    params:{
                        id:'@id'
                    }
                }
            });
            var GB =  $resource('/restful/rest/goods/buyer', {}, {
                'get': {
                    method: 'GET',
                    isArray: !0
                }
            });

            var GR =  $resource('/restful/rest/common/goodsRecommend/:id', {}, {
                'get': {
                    method: 'GET',
                    isArray: !0
                }
            });

            var goods ={};

            goods.getGoodsRecommend = function(data) {
                return GR.get(data);
            }
            goods.getGoodsPromotion = function(data) {
                return GP.get(data);
            }
            goods.getGoodsDetail = function(data) {
                return GD.get(data);
            }
            goods.getGoodsType = function(data) {
                return GT.get(data);
            }
            goods.getGoodsTypeById = function(data) {
                return GTbyId.get(data);
            }
            goods.getGoodsBuyer = function(data) {
                return GB.get(data);
            }


            return goods;
        }
    ]);
})