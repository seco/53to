define('service/oauth', ['at_app','service/weibo'], function(app) {
    app.lazy.factory('OAuth', ['$resource', '$rootScope','$q','weibo',
        function($resource, $rootScope,$q,weibo) {
            //{"buyerId":600000437,"nickName":"去你大爷","headImage":"/imageServer/0000noimg.jpg","source":"da","buyerType":0,"addTime":1413173438000,"status":2,"uid":454,"promoGoodsCount":0,"mobile":"150****8316"}
            var UserInfo = $resource('/restful/rest/buyer/brief');
            var Logout = $resource('/restful/rest/auth/logout');
            var Login = $resource('/restful/login');

            var user = {};
            user.userInfo = function(data) {
                return UserInfo.get({uuid:new Date().getTime()},function(data) {
                    $rootScope.userInfo = data;
                    $rootScope.USER = data;
                    $rootScope.isLogged = 1;
                    $rootScope.$emit('OAuth:login', 1);
                }).$promise;
            }
            user.login = function(data) {
                var deferred = $q.defer();
                $.ajax({
                    url: '/restful/login',
                    type: 'POST',
                    dataType: 'json',
                    data: data
                }).done(function(data) {
                    if (!data.code) {
                        $rootScope.isLogged = 1;
                        user.userInfo();
                    } else {
                        alert(data.message);
                        $rootScope.$emit('OAuth:login', 0);
                        $rootScope.isLogged = 0;
                    }
                    deferred.resolve(data);
                }).fail(function(err) {
                    console.log('err',err);
                    deferred.resolve(err);
                    alert(err.data);
                })
                return deferred.promise;
            }
            user.logout = function() {
                return Logout.get(function(data) {
                    $rootScope.userInfo = {};
                    $rootScope.USER = {};
                    $rootScope.isLogged = 0;
                    $rootScope.$emit('OAuth:logout', 1);
                }).$promise;
            }
            return user;
        }
    ])
})
define('service/at_url',['at_app'],function(app) {
    app.lazy.provider('getTpl',function() {
        this.user = function(fileName) {
            return '/src/modules/user/template/' + fileName;
        };
        this.weibo = function(fileName) {
            return '/src/modules/weibo/template/' + fileName;
        };
        this.channel = function(fileName) {
            return '/src/modules/channel/template/' + fileName;
        };
        this.common = function(fileName) {
            return '/common/template/' + fileName;
        };
        this.navbar = function(fileName) {
            return '/src/modules/navbar/' + fileName;
        };
        this.manage = function(fileName) {
            return '/manage/view/' + fileName;
        };
        this.trade = function(fileName) {
            return '/src/modules/trade/template/' + fileName;
        };
        this.spread = function(fileName) {
            return '/src/modules/spread/template/' + fileName;
        };
        this.postage = function(fileName) {
            return '/src/modules/postage/template/' + fileName;
        };
        this.aftersales = function(fileName) {
            return '/src/modules/aftersales/template/' + fileName;
        };
        this.settle = function(fileName) {
            return '/src/modules/fundsManagement/template/' + fileName;
        };
        this.myweibo = function(fileName) {
            return '/src/modules/weibo/template/' + fileName;
        };
        this.stock = function(fileName) {
            return '/src/modules/stock/template/' + fileName;
        };
        this.platform = function(fileName) {
            return '/src/modules/platform/template/' + fileName;
        };
        this.$get = function() {
            return {
                user: this.user,
                weibo: this.weibo,
                channel: this.channel,
                common: this.common,
                navbar: this.navbar,
                manage: this.manage,
                trade: this.trade,
                spread: this.spread,
                postage: this.postage,
                aftersales: this.aftersales,
                settle: this.settle,
                myweibo: this.myweibo,
                stock: this.stock,
                platform: this.platform
            };
        };
    });
    app.lazy.factory('SubmitOrder', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/interim');
        }
    ]);
    app.lazy.factory('OrderCartItemList', ['$resource',
        function($resource) {
            return $resource('/restful/rest/order/cartItemList/:cartItemId');
        }
    ]);
    app.lazy.factory('BuyerMoneyAccountBrief', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/account/payment');
        }
    ]);
    app.lazy.factory('GoodsReceiptAddress', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/receiptAddress/:id', {}, {
                'get': {
                    method: 'GET',
                    isArray: true
                }
            });
        }
    ]);
    app.lazy.factory('OrderCartItemList', ['$resource',
        function($resource) {
            return $resource('/restful/rest/order/cartItemList/:cartItemId');
        }
    ]);
    app.lazy.factory('Cart', ['$resource', 'UA', '$log',
        function($resource, UA, $log) {
            return $resource('/restful/rest/cart/', {}, {});
        }
    ]);
    app.lazy.factory('CartItem', ['$resource',
        function($resource) {
            return $resource('/restful/rest/cart/cartItem', {}, {
                'update': {
                    method: 'PUT'

                }
            });
        }
    ]);
    app.lazy.factory('CartItemNum', ['$resource',
        function($resource) {
            return $resource('/restful/rest/cart/cartItem/:id/quantity/:quantity', {}, {
                'update': {
                    method: 'PUT',
                    params: {
                        id: '@id',
                        quantity: '@quantity'
                    }


                }
            });
        }
    ]);
    app.lazy.factory('CartItemList', ['$resource',
        function($resource) {
            return $resource('/restful/rest/cart/cartItemList/:id', {}, {});
        }
    ]);
    app.lazy.factory('Goods', ['$resource',
        function($resource) {
            return $resource('/restful/rest/common/goods/:id/:detail', {}, {
                'updateGoods': {
                    method: 'PUT',
                    params: {
                        'detail': 'detail'
                    }
                },
                'alterGoods': {
                    method: 'PUT'
                }
            });
        }
    ]);
    app.lazy.factory('Seller', ['$resource',
        function($resource) {
            return $resource('/restful/rest/seller', {}, {
                'get': {
                    method: 'GET',
                    isArray: true
                }
            });
        }
    ]);
    app.lazy.factory('GetSellerInfo', ['$resource',
        function($resource) {
            return $resource('/restful/rest/seller/myself', {}, {
                'updateSeller': {
                    method: 'PUT'
                }
            });
        }
    ]);
    app.lazy.factory('GetSeller', ['$resource',
        function($resource) {
            return $resource('/restful/rest/seller/:id', {}, {
                'updateSeller': {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('SellerCenter', ['$resource',
        function($resource) {
            return $resource('/restful/rest/seller/myself');
        }
    ]);
    app.lazy.factory('GoodsDetail', ['$resource',
        function($resource) {
            return $resource('/restful/rest/common/goods/:id/detail');
        }
    ]);
    app.lazy.factory('UpdateAddress', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/receiptAddress/:id', {}, {
                'setAddress': {
                    method: 'PUT',
                    params: {
                        id: '@receipt_address_id'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('SetDefault', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/receiptAddress/:id/:default', {}, {
                'update': {
                    method: 'PUT'
                },
                'updateDefault': {
                    method: 'PUT',
                    params: {
                        'default': 'default',
                        id: '@id'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('OrderCartItemList', ['$resource',
        function($resource) {
            return $resource('/restful/rest/order/orderItemList/:cartItemId');
        }
    ]);
    app.lazy.factory('GetGoodsList', ['$resource',
        function($resource) {
            return $resource('/restful/rest/goods/:admin/:id/:state', {}, {
                'queryDepot': {
                    method: 'GET',
                    params: {
                        admin: 'admin'
                    }
                },
                'updateDepotGoods': {
                    method: 'PUT'
                }
            });
        }
    ]);
    app.lazy.factory('OffshelfGoodsList', ['$resource',
        function($resource) {
            return $resource('/restful/rest/goods/:id/:status/:state', {}, {
                'updateDepotGoods': {
                    method: 'PUT',
                    isArray: true
                }
            });
        }
    ]);
    app.lazy.factory('GetDepotGoods', ['$resource',
        function($resource) {
            return $resource('/restful/rest/goods/:admin/:id/:state', {}, {
                'queryDepotGoods': {
                    method: 'GET',
                    params: {
                        admin: 'admin'
                    }
                },
                'updateDepotGoods': {
                    method: 'PUT'
                }
            });
        }
    ]);
    app.lazy.factory('OnshelfDepotGoods', ['$resource',
        function($resource) {
            return $resource('/restful/rest/goods/:id/:status/:state', {}, {
                'updateDepotGoods': {
                    method: 'PUT',
                    isArray: true
                }
            });
        }
    ]);
    app.lazy.factory('GetBuyerOrder', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/order/:statistics', {}, {
                'getOrder': {
                    method: 'GET'
                }
            });
        }
    ]);
    app.lazy.factory('ConfirmBuyerOrder', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/order/:id/status/received', {}, {
                'confirmOrder': {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('GetSellerOrder', ['$resource',
        function($resource) {
            return $resource('/restful/rest/:seller/order/:statistics', {}, {
                'getOrder': {
                    method: 'GET',
                    params: {
                        seller: '@seller'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('DeliveryOrder', ['$resource',
        function($resource) {
            return $resource('/restful/rest/seller/order/:orderId/status/delivery', {}, {
                'putOrder': {
                    method: 'PUT'
                }
            });
        }
    ]);
    app.lazy.factory('GetPlatformOrder', ['$resource',
        function($resource) {
            return $resource('/restful/rest/admin/order/:statistics', {}, {
                'getOrder': {
                    method: 'GET',
                    params: {
                        platformer: '@platformer'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('CancelOrder', ['$resource',
        function($resource) {
            return $resource('/restful/rest/:role/order/:orderId/status/cancel', {}, {
                'cancelOrder': {
                    method: 'PUT'
                }
            });
        }
    ]);
    app.lazy.factory('SetDefault', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/receiptAddress/:id/:default', {}, {
                'update': {
                    method: 'PUT'
                },
                'updateDefault': {
                    method: 'PUT',
                    params: {
                        'default': 'default',
                        id: '@id'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('AddAddress', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/receiptAddress');
        }
    ]);
    app.lazy.factory('SellerBrief', ['$resource',
        function($resource) {
            return $resource('/restful/rest/seller/sellerGoods');
        }
    ]);
    app.lazy.factory('SellerState', ['$resource',
        function($resource) {
            return $resource('/restful/rest/seller/:id/:sellerState/:do', {}, {
                'updateState': {
                    method: 'PUT',
                    params: {
                        'id': '@id',
                        'sellerState': 'sellerState',
                        'do': '@do'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('UpdatePassword', ['$resource',
        function($resource) {
            return $resource('/restful/rest/seller/myself/password', {}, {
                'put': {
                    method: 'PUT'
                }
            });
        }
    ]);
    app.lazy.factory('ResetPassword', ['$resource',
        function($resource) {
            return $resource('/restful/rest/seller/:id/password/reset', {}, {
                'put': {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('PostTempOrder', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/interim/:id', {}, {
                'save': {
                    method: 'POST',
                    params: {
                        id: '@id'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('PutCaptcha', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/interim/payment', {}, {
                'updateCaptcha': {
                    method: 'PUT',
                    params: {}
                }
            });
        }
    ]);
    app.lazy.factory('SelectAddress', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/interim/address/:id', {}, {
                'address': {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('Shares', ['$resource',
        function($resource) {
            return $resource('/restful/rest/share/:id/:orderGoodsId', {}, {
                'get': {
                    method: 'GET',
                    isArray: false
                }
            });
        }
    ]);
    app.lazy.factory('SpreadUser', ['$resource',
        function($resource) {
            return $resource('/restful/rest/share/spreads', {}, {
                'get': {
                    method: 'GET',
                    isArray: true
                }
            });
        }
    ]);
    app.lazy.factory('SubmitGoodsSpread', ['$resource',
        function($resource) {
            return $resource('/restful/rest/share');
        }
    ]);
    app.lazy.factory('Shares', ['$resource',
        function($resource) {
            return $resource('/restful/rest/share/:id/:orderGoodsId', {}, {
                'get': {
                    method: 'GET',
                    isArray: false
                }
            });
        }
    ]);
    app.lazy.factory('SpreadUser', ['$resource',
        function($resource) {
            return $resource('/restful/rest/share/spreads', {}, {
                'get': {
                    method: 'GET',
                    isArray: true
                }
            });
        }
    ]);
    app.lazy.factory('SubmitGoodsSpread', ['$resource',
        function($resource) {
            return $resource('/restful/rest/share');
        }
    ]);
    app.lazy.factory('GoodsComment', ['$resource',
        function($resource) {
            return $resource('/restful/rest/common/goods/:id/goodsComment/:goodsCommentId', {}, {
                'save': {
                    method: 'POST',
                    params: {
                        id: '@id',
                        goodsCommentId: '@goodsCommentId'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('GetTempOrder', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/interim');
        }
    ]);
    app.lazy.factory('GetSellerGoodsList', ['$resource',
        function($resource) {
            return $resource('/restful/rest/goods/seller');
        }
    ]);
    app.lazy.factory('Promo', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/promo/:goodsId/:commentId/:key', {}, {
                get:{
                    method: 'GET',
                    params: {
                        goodsId: '@goodsId',
                        commentId: '@commentId',
                        key: '@key'
                    }
                },
                save:{
                    method: 'POST',
                    params: {
                        goodsId: '@goodsId',
                        commentId: '@commentId',
                        key: '@key'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('GetDeliveryCode', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/order/orderReceiptCode');
        }
    ]);
    app.lazy.factory('GetOnsaleGoodsNum', ['$resource',
        function($resource) {
            return $resource('/restful/rest/seller/myself/sellerGoods');
        }
    ]);
    app.lazy.factory('AplipayOrder', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/order/:orderId/pay', {}, {
                'payment': {
                    method: 'POST'
                }
            });
        }
    ]);
    app.lazy.factory('GetBuyerCommentByStarNum', ['$resource',
        function($resource) {
            return $resource('/restful/rest/common/goods/:goodsId/goodsComment', {}, {
                'getCommentDetail': {
                    method: 'GET',
                    params: {
                        goodsId: '@goodsId'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('GetBuyerPhone', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/brief');
        }
    ]);
    app.lazy.factory('Validation', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/interim/validatecode', {}, {
                'get': {
                    method: 'GET'
                }
            });
        }
    ]);
    app.lazy.factory('RemoveAcount', ['$resource',
        function($resource) {
            return $resource('/restful/rest/order/TempOrder/removeAcount', {}, {
                'put': {
                    method: 'PUT'
                }
            });
        }
    ]);
    app.lazy.factory('BuyerPayOrderItem', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/order/:orderId/pay', {}, {
                'getItem': {
                    method: 'GET',
                    params: {
                        orderId: '@orderId'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('RegisterBuyer', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer');
        }
    ]);
    app.lazy.factory('Email', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/valid/email');
        }
    ]);
    app.lazy.factory('NickName', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/valid/nickName');
        }
    ]);
    app.lazy.factory('CheckMobile', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/valid/mobile');
        }
    ]);
    app.lazy.factory('SmallShoppingCar', ['$resource',
        function($resource) {
            return $resource('/restful/rest/cart/small');
        }
    ]);
    app.lazy.factory('QueryOrderDetail', ['$resource',
        function($resource) {
            return $resource('/restful/rest/order/:id');
        }
    ]);
    app.lazy.factory('QueryBuyerOrderDetail', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/order/:id');
        }
    ]);
    app.lazy.factory('QuerySellerOrderDetail', ['$resource',
        function($resource) {
            return $resource('/restful/rest/seller/order/:id');
        }
    ]);
    app.lazy.factory('AdminQueryOrderDetail', ['$resource',
        function($resource) {
            return $resource('/restful/rest/admin/order/:id');
        }
    ]);
    app.lazy.factory('SendBindCaptcha', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/mobile/:mobile/bindCaptcha');
        }
    ]);
    app.lazy.factory('GetBindCaptcha', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/mobile/bindCaptcha/:captcha');
        }
    ]);
    app.lazy.factory('GetUnBindCaptcha', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/mobile/unbindCaptcha/:captcha');
        }
    ]);
    app.lazy.factory('SendUnBindCaptcha', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/mobile/unbindCaptcha');
        }
    ]);
    app.lazy.factory('SellerPostage', ['$resource',
        function($resource) {
            return $resource('/restful/rest/postageTemplate/seller');
        }
    ]);
    app.lazy.factory('Postage', ['$resource',
        function($resource) {
            return $resource('/restful/rest/postageTemplate');
        }
    ]);
    app.lazy.factory('PostageNameValidate', ['$resource',
        function($resource) {
            return $resource('/restful/rest/postageTemplate/postageTemplateName/:templateName');
        }
    ]);
    app.lazy.factory('GetPostage', ['$resource',
        function($resource) {
            return $resource('/restful/rest/postageTemplate/:id', {}, {
                'updatePostage': {
                    method: 'PUT',
                    params: {
                        id: '@postageTemplateId'
                    }
                },
                'deletePostage': {
                    method: 'DELETE',
                    params: {
                        id: '@id'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('GetPostage', ['$resource',
        function($resource) {
            return $resource('/restful/rest/postageTemplate/:id', {}, {
                'updatePostage': {
                    method: 'PUT',
                    params: {
                        id: '@postageTemplateId'
                    }
                },
                'deletePostage': {
                    method: 'DELETE',
                    params: {
                        id: '@id'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('GetPostageSF', ['$resource',
        function($resource) {
            return $resource('/restful/rest/postageTemplate/sf');
        }
    ]);
    app.lazy.factory('BuyerRebate', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/rebate');
        }
    ]);
    app.lazy.factory('AfterSaleOrder', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/order/return');
        }
    ]);
    app.lazy.factory('AfterSaleOrderGoods', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/orderGoods/:id');
        }
    ]);
    app.lazy.factory('AfterSaleBuyerReturn', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/return');
        }
    ]);
    app.lazy.factory('AfterSaleBuyerCancel', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/return/:id/status/cancel', {}, {
                cancelApply: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('AfterSaleDetailBuyer', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/return/:id');
        }
    ]);
    app.lazy.factory('AfterSaleDetailPlatform', ['$resource',
        function($resource) {
            return $resource('/restful/rest/admin/return/:id');
        }
    ]);
    app.lazy.factory('AfterSaleListPlatform', ['$resource',
        function($resource) {
            return $resource('/restful/rest/admin/return');
        }
    ]);
    app.lazy.factory('AfterSalePlatformCancel', ['$resource',
        function($resource) {
            return $resource('/restful/rest/admin/return/:id/status/cancel', {}, {
                'cancelApply': {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('AfterSaleDetailSeller', ['$resource',
        function($resource) {
            return $resource('/restful/rest/seller/return/:id');
        }
    ]);
    app.lazy.factory('AfterSaleListSeller', ['$resource',
        function($resource) {
            return $resource('/restful/rest/seller/return');
        }
    ]);
    app.lazy.factory('AfterSalePass', ['$resource',
        function($resource) {
            return $resource('/restful/rest/admin/return/:id/status/accept', {}, {
                'submit': {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('AfterSaleReject', ['$resource',
        function($resource) {
            return $resource('/restful/rest/admin/return/:id/status/reject', {}, {
                'submit': {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('AfterSaleBuyerDeliver', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/return/:id/status/delivery', {}, {
                deliver: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('AfterSaleSellerDeliver', ['$resource',
        function($resource) {
            return $resource('/restful/rest/seller/return/:id/status/delivery', {}, {
                deliver: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('AfterSaleBuyerReceived', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/return/:id/status/received', {}, {
                received: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('AfterSaleSellerReceived', ['$resource',
        function($resource) {
            return $resource('/restful/rest/seller/return/:id/status/received', {}, {
                received: {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('BuyerRebate', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/rebate');
        }
    ]);
    app.lazy.factory('SpreadDetail', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/promo/orderGoods/:id', {}, {
                'get': {
                    method: 'GET'
                }
            });
        }
    ]);
    app.lazy.filter('rever', function() {
        return function(args) {
            var val = args + "";
            return val.substring(0, val.indexOf('.') + 3);
        }
    });
    app.lazy.factory('OrderNew', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/promo/order/:orderId');
        }
    ]);
    app.lazy.factory('GoodsPromotion', ['$resource',
        function($resource) {
            return $resource('/restful/rest/goodsPromotion/:id', {}, {
                'goodsPromo': {
                    method: 'POST'
                },
                'goodsPromotionList': {
                    method: 'GET',
                    params: {
                        id: '@id'
                    }
                },
                'cancelPromotion': {
                    method: 'DELETE',
                    params: {
                        id: '@id'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('GetBuyerInfo', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/brief');
        }
    ]);
    app.lazy.factory('BuyerAccountmyself', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/account/myself');
        }
    ]);
    app.lazy.factory('Unsettle', ['$resource',
        function($resource) {
            return $resource('/restful/rest/settlement/unsettle', {}, {
                'get': {
                    method: 'GET',
                    isArray: false,
                    responseType: ''
                }
            });
        }
    ]);
    app.lazy.factory('BuyerAccountHistory', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/account/history');
        }
    ]);
    app.lazy.factory('RebateOrderDetail', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/rebate/:orderId');
        }
    ]);
    app.lazy.factory('AdditionalInfor', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/additionalInfor');
        }
    ]);
    app.lazy.factory('PutAdditionalInfor', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/additionalInfor', {}, {
                'put': {
                    method: 'PUT',
                    params: {}
                }
            });
        }
    ]);
    app.lazy.factory('BuyerPassword', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/password');
        }
    ]);
    app.lazy.factory('UpdateNickname', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/nickName/:nickName');
        }
    ]);
    app.lazy.factory('SendEmailCaptcha', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/password/email/:email/emailCaptcha');
        }
    ]);
    app.lazy.factory('EmailCaptcha', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/email/:email/emailCaptcha/:captcha', {
                captcha: '@captcha',
                email: '@email'
            });
        }
    ]);
    app.lazy.factory('AgainGetEmail', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/email/:email/emailCaptcha', {
                email: '@email'
            });
        }
    ]);
    app.lazy.factory('SubmitEmailCaptcha', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/password/email/:email/emailCaptcha/:captcha', {
                email: '@email',
                captcha: '@captcha'
            });
        }
    ]);
    app.lazy.factory('GetMembers', ['$resource',
        function($resource) {
            return $resource('/restful/rest/admin/member');
        }
    ]);
    app.lazy.factory('GetMemberByID', ['$resource',
        function($resource) {
            return $resource('/restful/rest/admin/member/:id', {
                email: '@id'
            });
        }
    ]);
    app.lazy.factory('GetMemberStatistics', ['$resource',
        function($resource) {
            return $resource('/restful/rest/admin/member/statistics');
        }
    ]);
    app.lazy.factory('LockAndUnlockUser', ['$resource',
        function($resource) {
            return $resource('/restful/rest/admin/member/:id/status/:type', {}, {
                'put': {
                    method: 'PUT',
                    params: {
                        id: "@id",
                        type: "@type"
                    }
                }
            });
        }
    ]);
    app.lazy.factory('GetSalesStatistics', ['$resource',
        function($resource) {
            return $resource('/restful/rest/seller/sales/statistics', {}, {
                'get': {
                    method: 'GET'
                }
            });
        }
    ]);
    app.lazy.factory('GetPostageTemplateBySeller', ['$resource',
        function($resource) {
            return $resource('/restful/rest/postageTemplate/goods/:sellerId', {}, {
                'postageTemp': {
                    method: 'GET',
                    isArray: true,
                    param: {
                        sellerId: '@sellerId'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('StockConfig', ['$resource',
        function($resource) {
            return $resource('/restful/rest/stock/config/:id', {}, {
                'addStock': {
                    method: 'POST'
                },
                'updateStock': {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    }
                }

            });
        }
    ]);
    app.lazy.factory('StockGive', ['$resource',
        function($resource) {
            return $resource('/restful/rest/stock/allotment/:id/:status/:cancel', {}, {
                'addGiveStock': {
                    method: 'POST'
                },
                'updateGiveStock': {
                    method: 'PUT',
                    param: {
                        id: '@id'
                    }
                },
                'cancelGiveStock': {
                    method: 'PUT',
                    params: {
                        id: '@id',
                        status: '@status',
                        cancel: '@cancel'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('StockGiveByStatus', ['$resource',
        function($resource) {
            return $resource('/restful/rest/stock/allotment');
        }
    ]);
    app.lazy.factory('SelectPackingList', ['$resource',
        function($resource) {
            return $resource('/restful/rest/seller/order/:orderIds/packinglist', {}, {
                'get': {
                    isArray: true
                }
            });
        }
    ]);
    app.lazy.factory('SelectFans', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/weibo/user/:nickname/fans', {}, {
                'get': {
                    isArray: false,
                    params:{
                        nickname:'@nickname'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('SelectFollow', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/weibo/user/:nickname/follow', {}, {
                'get': {
                    isArray: false,
                    params:{
                        nickname:'@nickname'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('PrivateMessage', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/weibo/privatemessage', {}, {
                'send': {
                    method: "POST"
                }
            });
        }
    ]);
    app.lazy.factory('GetPrivateMessage', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/weibo/privatemessage/received');
        }
    ]);
    app.lazy.factory('FollowUser', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/weibo/user/follow/:id', {}, {
                'send': {
                    method: "POST",
                    params: {
                        id: "@id"
                    }
                }
            });
        }
    ]);
    app.lazy.factory('DeleteFollow', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/weibo/user/follow/:id', {}, {
                'send': {
                    method: "delete",
                    params: {
                        id: "@id"
                    }
                }

            });
        }
    ]);
    app.lazy.factory('GetPrivateMsgByUID', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/weibo/privatemessage/other/:uid');
        }
    ]);
    app.lazy.factory('GetStockIncome', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/stock/income');
        }
    ]);
    app.lazy.factory('Notice', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/weibo/notice');
        }
    ]);
    app.lazy.factory('AdminUser', ['$resource',
        function($resource) {
            return $resource('/restful/rest/admin/:id', {}, {
                'editAU': {
                    method: "PUT",
                    params: {
                        id: "@id"
                    }
                },
                'deleteAU': {
                    method: "DELETE",
                    params: {
                        id: "@id"
                    }
                }
            });
        }
    ]);
    app.lazy.factory('GetStockBrief', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/stock/:brief/:income/:orderId', {}, {
                'get': {
                    method: "GET",
                    params: {
                        brief: "@brief",
                        income: "@income"
                    }
                }
            });
        }
    ]);
    app.lazy.factory('GetStockItem', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/stock/:brief/:detail', {}, {
                'get': {
                    method: "GET",
                    params: {
                        brief: "@brief",
                        detail: "@detail"
                    },
                    isArray: true
                }
            });
        }
    ]);
    app.lazy.factory('StockTransferList', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/stock/transferlist');
        }
    ]);
    app.lazy.factory('StockCashTransfer', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/stock/transfer', {}, {
                'transfer': {
                    method: "PUT",
                    params: {
                        amount: '@amount'
                    }

                }
            });
        }
    ]);
    app.lazy.factory('WeiboComment', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/weibo/mycomment');
        }
    ]);
    app.lazy.factory('SearchTopic', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/weibo/search/topic/:seachValue');
        }
    ]);
    app.lazy.factory('WeiboSearchUser', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/weibo/search/user/:name',{},{
                'get':{
                    method:'GET',
                    params: {
                        name: '@name'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('WeiboCommentMy', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/weibo/commentmy');
        }
    ]);
    app.lazy.factory('AtMy', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/weibo/atmy');
        }
    ]);
    app.lazy.factory('SearchUser', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/weibo/user/search');
        }
    ]);
    app.lazy.factory('StockGivenItem', ['$resource',
        function($resource) {
            return $resource('/restful/rest/admin/stock/history');
        }
    ]);
    app.lazy.factory('SellerSaleStatics', ['$resource',
        function($resource) {
            return $resource('/restful/rest/seller/sales/statistics/brief',{},{
                'getStatistics': {
                    method: "GET",
                    isArray: true
                }
            });
        }
    ]);
    app.lazy.factory('GetUserInfo', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/weibo/user/:id');
        }
    ]);
    app.lazy.factory('GetGoodsStaticForPlatform', ['$resource',
        function($resource) {
            return $resource('/restful/rest/admin/goods/statistics');
        }
    ]);
    app.lazy.factory('AdminUserInfo', ['$resource',
        function($resource) {
            return $resource('/restful/rest/admin/brief');
        }
    ]);
    app.lazy.factory('UpdateAdminUserInfo', ['$resource',
        function($resource) {
            return $resource('/restful/rest/admin/myself', {}, {
                'update': {
                    method: "PUT"
                }
            });
        }
    ]);
    app.lazy.factory('StockBonus', ['$resource',
        function($resource) {
            return $resource('/restful/rest/stock/bonus/:id');
        }
    ]);
    app.lazy.factory('AlterStockBonusAllomentMoney', ['$resource',
        function($resource) {
            return $resource('/restful/rest/stock/bonus/:stockBonusId/buyerAllomentMoney',{},{
                'update':{
                    method:'PUT'
                }
            });
        }
    ]);
    app.lazy.factory('StockBonusDistribute', ['$resource',
        function($resource) {
            return $resource('/restful/rest/stock/bonus/:stockBonusId/status/distributed',{},{
                'update':{
                    method:'PUT'
                }
            });
        }
    ]);
    app.lazy.factory('OrderLogicstics', ['$resource',
        function($resource) {
            return $resource('/restful/rest/stock/bonus/:id');
        }
    ]);
    app.lazy.factory('GetWeibo', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/weibo');
        }
    ]);
    app.lazy.factory('WeiboUser', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/weibo/user/:nickname',{},{
                'get': {
                    method: 'GET',
                    params: {
                        nickname: '@nickname'
                    }
                }
            })
        }
    ]);
    app.lazy.factory('GetTopics', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/weibo/user/:nickname/topics',{},{
                'get': {
                    method: 'GET',
                    params: {
                        nickname: '@nickname'
                    }
                }
            })
        }
    ]);
    app.lazy.factory('GetBuyerGoods', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/promo/:nickname/goods',{},{
                'get': {
                    method: 'GET',
                    isArray: true,
                    params: {
                        nickname: '@nickname'
                    }
                }
            })
        }
    ]);
    app.lazy.factory('GetUserSaleGoods', ['$resource',
        function($resource) {
            return $resource('/restful/rest/common/promo/:nickname/goods',{},{
                'get': {
                    method: 'GET',
                    params: {
                        nickname: '@nickname'
                    }
                }
            })
        }
    ]);
    app.lazy.factory('GetStockBonus', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/stock/bonus');
        }
    ]);
    app.lazy.factory('BuyerOrderLogicstics', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/order/:orderId/logistics');
        }
    ]);
    app.lazy.factory('SearchGoods', ['$resource',
        function($resource) {
            return $resource('/restful/rest/common/goods/search/:goodsName');
        }
    ]);
    app.lazy.factory('CategoryStockListForLinePic', ['$resource',
        function($resource) {
            return $resource('/restful/rest/common/stock/:categoryId',{},{
                'get': {
                    method: 'GET',
                    isArray: true,
                    params: {
                        categoryId: '@categoryId'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('StockCategoryBonusDetail', ['$resource',
        function($resource) {
            return $resource('/restful/rest/common/stock/:categoryId/bonusdetail');
        }
    ]);
    app.lazy.factory('RelatedGoods', ['$resource',
        function($resource) {
            return $resource('/restful/rest/common/goods/:id/related', {}, {
                'get': {
                    method: 'GET',
                    isArray: true
                }
            });
        }
    ]);
    app.lazy.factory('GetSpreadUser', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/promo/buyer', {}, {
                'get': {
                    method: 'GET'
                }
            });
        }
    ]);
    app.lazy.factory('GetMobileRegisterCaptcha', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/mobile/:mobile/registerCaptcha', {}, {
                'save': {
                    method: 'POST',
                    params: {
                        mobile: '@mobile'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('MobileCaptcha', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/password/mobile/:mobile/mobileCaptcha', {}, {
                'save': {
                    method: 'POST',
                    params: {
                        mobile: '@mobile'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('MobileCaptchaPassword', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/password/mobile/:mobile/mobileCaptcha/:captcha', {}, {
                'save': {
                    method: 'POST',
                    params: {
                        mobile: '@mobile',
                        captcha: '@captcha'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('RecommendUser', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/recommend/:ids', {}, {
                'save': {
                    method: 'POST',
                    params: {
                        ids: '@ids'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('Recommend', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/recommend', {}, {
                'get': {
                    method: 'GET'
                }
            });
        }
    ]);
    app.lazy.factory('CommonCodePurchase', ['$resource',
        function($resource) {
            return $resource('/restful/rest/common/code/purchase', {}, {
                'save': {
                    method: 'POST'
                }
            });
        }
    ]);
    app.lazy.factory('GetCommonCodePurchaseEmail', ['$resource',
        function($resource) {
            return $resource('/restful/rest/common/code/purchase/email/:email', {}, {
                'get': {
                    method: 'GET',
                    params: {
                        email: '@email'
                    }

                }
            });
        }
    ]);
    app.lazy.factory('CodeTradeList', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/code/trade', {}, {
                'get': {
                    method: 'GET'

                }
            });
        }
    ]);
    app.lazy.factory('CodeChannelList', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/code/channel', {}, {
                'get': {
                    method: 'GET'

                }
            });
        }
    ]);
    app.lazy.factory('UserRecommend', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/weibo/user/recommend', {}, {
                'get': {
                    method: 'GET',
                    isArray: true

                }
            });
        }
    ]);
    app.lazy.factory('CommonCodePurchaseEmail', ['$resource',
        function($resource) {
            return $resource('/restful/rest/common/code/purchase/email/:email', {}, {
                'save': {
                    method: 'POST',
                    params: {
                        email: '@email'
                    }

                }
            });
        }
    ]);
    app.lazy.factory('BindEmailSendCaptcha', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/email/:email/bindCaptcha', {}, {
                'save': {
                    method: 'POST',
                    params: {
                        email: '@email'
                    }

                }
            });
        }
    ]);
    app.lazy.factory('BindEmailCaptcha', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/email/bindCaptcha/:captcha', {}, {
                'save': {
                    method: 'POST',
                    params: {
                        captcha: '@captcha'
                    }

                }
            });
        }
    ]);
    app.lazy.factory('CodeTradeCondition', ['$resource',
        function($resource) {
            return $resource('/restful/rest/common/code/purchase');
        }
    ]);
    app.lazy.factory('buyerPromoPromoed', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/promo/promoed');
        }
    ]);
    app.lazy.factory('buyerStockBrief', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/stock/brief');
        }
    ]);
    app.lazy.factory('BuyerProfit', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/account/profit');
        }
    ]);
});
define('service/at_service',['at_app', 'require'], function(app, require) {
    app.lazy.value('UUID', function() {
        return new Date().getTime().toString(16) + Math.random(1000).toString().replace('.', '')
    })
    app.lazy.factory('getUrlParam', ['$window',
        function($window) {
            return function(name) {
                var obj = {};
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
                var r = $window.location.search.substr(1).match(reg); //匹配目标参数
                if (r != null) {
                    obj[name] = unescape(r[2]);
                    return obj
                }
                return obj;
            }
        }
    ]);
    app.lazy.service('emojisAr', function() {
        return [{
            "phrase": "[草泥马]",
            "type": "face",
            "url": "/assets/images/emojis/shenshou_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/shenshou_thumb.gif",
            "value": "[草泥马]",
            "picid": ""
        }, {
            "phrase": "[神马]",
            "type": "face",
            "url": "/assets/images/emojis/horse2_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/horse2_thumb.gif",
            "value": "[神马]",
            "picid": ""
        }, {
            "phrase": "[浮云]",
            "type": "face",
            "url": "/assets/images/emojis/fuyun_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/fuyun_thumb.gif",
            "value": "[浮云]",
            "picid": ""
        }, {
            "phrase": "[给力]",
            "type": "face",
            "url": "/assets/images/emojis/geili_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/geili_thumb.gif",
            "value": "[给力]",
            "picid": ""
        }, {
            "phrase": "[围观]",
            "type": "face",
            "url": "/assets/images/emojis/wg_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/wg_thumb.gif",
            "value": "[围观]",
            "picid": ""
        }, {
            "phrase": "[威武]",
            "type": "face",
            "url": "/assets/images/emojis/vw_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/vw_thumb.gif",
            "value": "[威武]",
            "picid": ""
        }, {
            "phrase": "[熊猫]",
            "type": "face",
            "url": "/assets/images/emojis/panda_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/panda_thumb.gif",
            "value": "[熊猫]",
            "picid": ""
        }, {
            "phrase": "[兔子]",
            "type": "face",
            "url": "/assets/images/emojis/rabbit_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/rabbit_thumb.gif",
            "value": "[兔子]",
            "picid": ""
        }, {
            "phrase": "[奥特曼]",
            "type": "face",
            "url": "/assets/images/emojis/otm_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/otm_thumb.gif",
            "value": "[奥特曼]",
            "picid": ""
        }, {
            "phrase": "[囧]",
            "type": "face",
            "url": "/assets/images/emojis/j_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/j_thumb.gif",
            "value": "[囧]",
            "picid": ""
        }, {
            "phrase": "[互粉]",
            "type": "face",
            "url": "/assets/images/emojis/hufen_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/hufen_thumb.gif",
            "value": "[互粉]",
            "picid": ""
        }, {
            "phrase": "[礼物]",
            "type": "face",
            "url": "/assets/images/emojis/liwu_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/liwu_thumb.gif",
            "value": "[礼物]",
            "picid": ""
        }, {
            "phrase": "[呵呵]",
            "type": "face",
            "url": "/assets/images/emojis/smilea_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/smilea_thumb.gif",
            "value": "[呵呵]",
            "picid": ""
        }, {
            "phrase": "[嘻嘻]",
            "type": "face",
            "url": "/assets/images/emojis/tootha_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/tootha_thumb.gif",
            "value": "[嘻嘻]",
            "picid": ""
        }, {
            "phrase": "[哈哈]",
            "type": "face",
            "url": "/assets/images/emojis/laugh.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/laugh.gif",
            "value": "[哈哈]",
            "picid": ""
        }, {
            "phrase": "[可爱]",
            "type": "face",
            "url": "/assets/images/emojis/tza_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/tza_thumb.gif",
            "value": "[可爱]",
            "picid": ""
        }, {
            "phrase": "[可怜]",
            "type": "face",
            "url": "/assets/images/emojis/kl_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/kl_thumb.gif",
            "value": "[可怜]",
            "picid": ""
        }, {
            "phrase": "[挖鼻屎]",
            "type": "face",
            "url": "/assets/images/emojis/kbsa_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/kbsa_thumb.gif",
            "value": "[挖鼻屎]",
            "picid": ""
        }, {
            "phrase": "[吃惊]",
            "type": "face",
            "url": "/assets/images/emojis/cj_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/cj_thumb.gif",
            "value": "[吃惊]",
            "picid": ""
        }, {
            "phrase": "[害羞]",
            "type": "face",
            "url": "/assets/images/emojis/shamea_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/shamea_thumb.gif",
            "value": "[害羞]",
            "picid": ""
        }, {
            "phrase": "[挤眼]",
            "type": "face",
            "url": "/assets/images/emojis/zy_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/zy_thumb.gif",
            "value": "[挤眼]",
            "picid": ""
        }, {
            "phrase": "[闭嘴]",
            "type": "face",
            "url": "/assets/images/emojis/bz_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/bz_thumb.gif",
            "value": "[闭嘴]",
            "picid": ""
        }, {
            "phrase": "[鄙视]",
            "type": "face",
            "url": "/assets/images/emojis/bs2_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/bs2_thumb.gif",
            "value": "[鄙视]",
            "picid": ""
        }, {
            "phrase": "[爱你]",
            "type": "face",
            "url": "/assets/images/emojis/lovea_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/lovea_thumb.gif",
            "value": "[爱你]",
            "picid": ""
        }, {
            "phrase": "[泪]",
            "type": "face",
            "url": "/assets/images/emojis/sada_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/sada_thumb.gif",
            "value": "[泪]",
            "picid": ""
        }, {
            "phrase": "[偷笑]",
            "type": "face",
            "url": "/assets/images/emojis/heia_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/heia_thumb.gif",
            "value": "[偷笑]",
            "picid": ""
        }, {
            "phrase": "[亲亲]",
            "type": "face",
            "url": "/assets/images/emojis/qq_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/qq_thumb.gif",
            "value": "[亲亲]",
            "picid": ""
        }, {
            "phrase": "[生病]",
            "type": "face",
            "url": "/assets/images/emojis/sb_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/sb_thumb.gif",
            "value": "[生病]",
            "picid": ""
        }, {
            "phrase": "[太开心]",
            "type": "face",
            "url": "/assets/images/emojis/mb_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/mb_thumb.gif",
            "value": "[太开心]",
            "picid": ""
        }, {
            "phrase": "[懒得理你]",
            "type": "face",
            "url": "/assets/images/emojis/ldln_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/ldln_thumb.gif",
            "value": "[懒得理你]",
            "picid": ""
        }, {
            "phrase": "[右哼哼]",
            "type": "face",
            "url": "/assets/images/emojis/yhh_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/yhh_thumb.gif",
            "value": "[右哼哼]",
            "picid": ""
        }, {
            "phrase": "[左哼哼]",
            "type": "face",
            "url": "/assets/images/emojis/zhh_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/zhh_thumb.gif",
            "value": "[左哼哼]",
            "picid": ""
        }, {
            "phrase": "[嘘]",
            "type": "face",
            "url": "/assets/images/emojis/x_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/x_thumb.gif",
            "value": "[嘘]",
            "picid": ""
        }, {
            "phrase": "[衰]",
            "type": "face",
            "url": "/assets/images/emojis/cry.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/cry.gif",
            "value": "[衰]",
            "picid": ""
        }, {
            "phrase": "[委屈]",
            "type": "face",
            "url": "/assets/images/emojis/wq_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/wq_thumb.gif",
            "value": "[委屈]",
            "picid": ""
        }, {
            "phrase": "[吐]",
            "type": "face",
            "url": "/assets/images/emojis/t_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/t_thumb.gif",
            "value": "[吐]",
            "picid": ""
        }, {
            "phrase": "[打哈欠]",
            "type": "face",
            "url": "/assets/images/emojis/k_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/k_thumb.gif",
            "value": "[打哈欠]",
            "picid": ""
        }, {
            "phrase": "[抱抱]",
            "type": "face",
            "url": "/assets/images/emojis/bba_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/bba_thumb.gif",
            "value": "[抱抱]",
            "picid": ""
        }, {
            "phrase": "[怒]",
            "type": "face",
            "url": "/assets/images/emojis/angrya_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/angrya_thumb.gif",
            "value": "[怒]",
            "picid": ""
        }, {
            "phrase": "[疑问]",
            "type": "face",
            "url": "/assets/images/emojis/yw_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/yw_thumb.gif",
            "value": "[疑问]",
            "picid": ""
        }, {
            "phrase": "[馋嘴]",
            "type": "face",
            "url": "/assets/images/emojis/cza_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/cza_thumb.gif",
            "value": "[馋嘴]",
            "picid": ""
        }, {
            "phrase": "[拜拜]",
            "type": "face",
            "url": "/assets/images/emojis/88_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/88_thumb.gif",
            "value": "[拜拜]",
            "picid": ""
        }, {
            "phrase": "[思考]",
            "type": "face",
            "url": "/assets/images/emojis/sk_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/sk_thumb.gif",
            "value": "[思考]",
            "picid": ""
        }, {
            "phrase": "[汗]",
            "type": "face",
            "url": "/assets/images/emojis/sweata_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/sweata_thumb.gif",
            "value": "[汗]",
            "picid": ""
        }, {
            "phrase": "[困]",
            "type": "face",
            "url": "/assets/images/emojis/sleepya_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/sleepya_thumb.gif",
            "value": "[困]",
            "picid": ""
        }, {
            "phrase": "[睡觉]",
            "type": "face",
            "url": "/assets/images/emojis/sleepa_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/sleepa_thumb.gif",
            "value": "[睡觉]",
            "picid": ""
        }, {
            "phrase": "[钱]",
            "type": "face",
            "url": "/assets/images/emojis/money_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/money_thumb.gif",
            "value": "[钱]",
            "picid": ""
        }, {
            "phrase": "[失望]",
            "type": "face",
            "url": "/assets/images/emojis/sw_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/sw_thumb.gif",
            "value": "[失望]",
            "picid": ""
        }, {
            "phrase": "[酷]",
            "type": "face",
            "url": "/assets/images/emojis/cool_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/cool_thumb.gif",
            "value": "[酷]",
            "picid": ""
        }, {
            "phrase": "[花心]",
            "type": "face",
            "url": "/assets/images/emojis/hsa_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/hsa_thumb.gif",
            "value": "[花心]",
            "picid": ""
        }, {
            "phrase": "[哼]",
            "type": "face",
            "url": "/assets/images/emojis/hatea_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/hatea_thumb.gif",
            "value": "[哼]",
            "picid": ""
        }, {
            "phrase": "[鼓掌]",
            "type": "face",
            "url": "/assets/images/emojis/gza_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/gza_thumb.gif",
            "value": "[鼓掌]",
            "picid": ""
        }, {
            "phrase": "[晕]",
            "type": "face",
            "url": "/assets/images/emojis/dizzya_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/dizzya_thumb.gif",
            "value": "[晕]",
            "picid": ""
        }, {
            "phrase": "[悲伤]",
            "type": "face",
            "url": "/assets/images/emojis/bs_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/bs_thumb.gif",
            "value": "[悲伤]",
            "picid": ""
        }, {
            "phrase": "[抓狂]",
            "type": "face",
            "url": "/assets/images/emojis/crazya_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/crazya_thumb.gif",
            "value": "[抓狂]",
            "picid": ""
        }, {
            "phrase": "[黑线]",
            "type": "face",
            "url": "/assets/images/emojis/h_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/h_thumb.gif",
            "value": "[黑线]",
            "picid": ""
        }, {
            "phrase": "[阴险]",
            "type": "face",
            "url": "/assets/images/emojis/yx_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/yx_thumb.gif",
            "value": "[阴险]",
            "picid": ""
        }, {
            "phrase": "[怒骂]",
            "type": "face",
            "url": "/assets/images/emojis/nm_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/nm_thumb.gif",
            "value": "[怒骂]",
            "picid": ""
        }, {
            "phrase": "[心]",
            "type": "face",
            "url": "/assets/images/emojis/hearta_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/hearta_thumb.gif",
            "value": "[心]",
            "picid": ""
        }, {
            "phrase": "[伤心]",
            "type": "face",
            "url": "/assets/images/emojis/unheart.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/unheart.gif",
            "value": "[伤心]",
            "picid": ""
        }, {
            "phrase": "[猪头]",
            "type": "face",
            "url": "/assets/images/emojis/pig.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/pig.gif",
            "value": "[猪头]",
            "picid": ""
        }, {
            "phrase": "[ok]",
            "type": "face",
            "url": "/assets/images/emojis/ok_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/ok_thumb.gif",
            "value": "[ok]",
            "picid": ""
        }, {
            "phrase": "[耶]",
            "type": "face",
            "url": "/assets/images/emojis/ye_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/ye_thumb.gif",
            "value": "[耶]",
            "picid": ""
        }, {
            "phrase": "[good]",
            "type": "face",
            "url": "/assets/images/emojis/good_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/good_thumb.gif",
            "value": "[good]",
            "picid": ""
        }, {
            "phrase": "[不要]",
            "type": "face",
            "url": "/assets/images/emojis/no_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/no_thumb.gif",
            "value": "[不要]",
            "picid": ""
        }, {
            "phrase": "[赞]",
            "type": "face",
            "url": "/assets/images/emojis/z2_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/z2_thumb.gif",
            "value": "[赞]",
            "picid": ""
        }, {
            "phrase": "[来]",
            "type": "face",
            "url": "/assets/images/emojis/come_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/come_thumb.gif",
            "value": "[来]",
            "picid": ""
        }, {
            "phrase": "[弱]",
            "type": "face",
            "url": "/assets/images/emojis/sad_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/sad_thumb.gif",
            "value": "[弱]",
            "picid": ""
        }, {
            "phrase": "[蜡烛]",
            "type": "face",
            "url": "/assets/images/emojis/lazu_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/lazu_thumb.gif",
            "value": "[蜡烛]",
            "picid": ""
        }, {
            "phrase": "[钟]",
            "type": "face",
            "url": "/assets/images/emojis/clock_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/clock_thumb.gif",
            "value": "[钟]",
            "picid": ""
        }, {
            "phrase": "[话筒]",
            "type": "face",
            "url": "/assets/images/emojis/m_org.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/m_thumb.gif",
            "value": "[话筒]",
            "picid": ""
        }, {
            "phrase": "[蛋糕]",
            "type": "face",
            "url": "/assets/images/emojis/cake.gif",
            "hot": false,
            "common": true,
            "category": "",
            "icon": "/assets/images/emojis/cake.gif",
            "value": "[蛋糕]",
            "picid": ""
        }];
    })
    app.lazy.service('emailData', function() {
        return [{
            'domain': 'qq.com',
            'url': 'http://mail.qq.com'
        }, {
            'domain': '163.com',
            'url': 'http://mail.163.com/'
        }, {
            'domain': 'sina.com',
            'url': 'http://mail.sina.com'
        }, {
            'domain': '126.com',
            'url': 'http://mail.126.com'
        }, {
            'domain': 'hotmail.com',
            'url': 'http://mail.hotmail.com'
        }, {
            'domain': 'sina.cn',
            'url': 'http://mail.sina.cn'
        }, {
            'domain': 'gmail.com',
            'url': 'http://mail.google.com'
        }, {
            'domain': 'sohu.com',
            'url': 'http://mail.sohu.com'
        }, {
            'domain': 'yahoo.com',
            'url': 'http://mail.yahoo.com'
        }, {
            'domain': '139.com',
            'url': 'http://mail.139.com'
        }, {
            'domain': '189.cn',
            'url': 'http://mail.189.cn'
        }];
    })
    app.lazy.service('at_route', function() {
        return {
            user: [{
                title: '基础信息',
                url: '/user-info'
            }, {
                title: '修改密码',
                url: '/modify-password'
            }, {
                title: '更换邮箱',
                url: '/modify-email'
            }, {
                title: '手机绑定',
                url: '/mobile-verify'
            }, {
                title: '修改头像',
                url: '/set-photo'
            }, {
                title: '用户资料',
                url: '/me'
            }],
            manage: [{
                title: '我的订单',
                url: '/buyer-order'
            }, {
                title: '发布商品',
                url: '/publish-goods'
            }, {
                title: '仓库商品',
                url: '/depot'
            }, {
                title: '在售商品',
                url: '/goods-list'
            }, {
                title: '平台订单',
                url: '/platform-order'
            }, {
                title: '收货地址管理',
                url: '/delivery-address'
            }, {
                title: '新建运费模版',
                url: '/postage'
            }, {
                title: '资金账户查询',
                url: '/fund-account'
            }, {
                title: '商家管理',
                url: '/seller-detail'
            }, {
                title: '商家信息',
                url: '/seller-center'
            }, {
                title: '添加商家',
                url: '/release-seller'
            }, {
                title: '商家订单',
                url: '/seller-order'
            }, {
                title: '商家商品',
                url: '/seller-goods-list'
            }, {
                title: '商家详情',
                url: '/seller-info'
            }, {
                title: '我的推广',
                url: '/spread/list'
            }],
            buyer: [{
                parent: {
                    title: '我的吾商',
                    url: '/buyer-center'
                },
                son: []
            }, {
                parent: {
                    title: '交易管理',
                    url: '/'
                },
                son: [{
                    title: '我的订单',
                    url: '/buyer-order'
                }, {
                    title: '我的推广',
                    url: '/spread/list'
                }, {
                    title: '获利交易',
                    url: '/buyer-rebate'
                }, {
                    title: '我的评价',
                    url: '/comment/list'
                }, {
                    title: '退款/退换货',
                    url: '/buyer-apply-list'
                }]
            }, {
                parent: {
                    title: '账户管理',
                    url: '/'
                },
                son: [{
                    title: '个人资料',
                    url: '/#/complement-buyer-info'
                }, {
                    title: '收货地址',
                    url: '/delivery-address'
                }, {
                    title: '账户安全',
                    url: '/account-security'
                }, {
                    title: '吾付通',
                    url: '/#'
                }, {
                    title: '商票',
                    url: '/#'
                }]
            }, {
                parent: {
                    title: '社区中心',
                    url: '/'
                },
                son: [{
                    title: '通用',
                    url: '/#'
                }, {
                    title: '隐私设置',
                    url: '/#'
                }, {
                    title: '黑名单',
                    url: '/#'
                }, {
                    title: '信息屏蔽',
                    url: '/#'
                }, {
                    title: '提醒设置',
                    url: '/#'
                }]
            }, {
                parent: {
                    title: '数据中心',
                    url: '/'
                },
                son: [{
                    title: '转化率',
                    url: '/#'
                }, {
                    title: ' 成交数据',
                    url: '/#'
                }]
            }],
            seller: [{
                parent: {
                    title: '我的销售',
                    url: '/seller-center'
                },
                son: []
            }, {
                parent: {
                    title: '交易管理',
                    url: '/'
                },
                son: [{
                    title: '在售商品',
                    url: '/seller-goods-list'
                }, {
                    title: '管理订单',
                    url: '/seller-order'
                }, {
                    title: '管理退货',
                    url: '/#'
                }, {
                    title: '销售统计',
                    url: '/#'
                }, {
                    title: '运费查询',
                    url: '/seller-postage'
                }]
            }, {
                parent: {
                    title: '账户管理',
                    url: '/'
                },
                son: [{
                    title: '账户信息',
                    url: '/seller-info'
                }, {
                    title: '结算信息',
                    url: '/#'
                }, {
                    title: '修改密码',
                    url: '/update-password'
                }]
            }],
            platform: [{
                parent: {
                    title: '我的平台',
                    url: '/platformer-center'
                },
                son: []
            }, {
                parent: {
                    title: '商品管理',
                    url: '/'
                },
                son: [{
                    title: '在售商品',
                    url: '/goods-list'
                }, {
                    title: '奖品库',
                    url: '/#'
                }, {
                    title: '仓库商品',
                    url: '/depot'
                }]
            }, {
                parent: {
                    title: '订单管理',
                    url: '/platform-order'
                },
                son: []
            }, {
                parent: {
                    title: '营销推广',
                    url: '/#'
                },
                son: [{
                    title: '营销数据',
                    url: '/#'
                }, {
                    title: '商品推广',
                    url: '/#'
                }]
            }, {
                parent: {
                    title: '商票交易数据',
                    url: '/#'
                },
                son: []
            }, {
                parent: {
                    title: '退换货管理',
                    url: '/#'
                },
                son: []
            }, {
                parent: {
                    title: '运费管理',
                    url: '/postage-list'
                },
                son: []
            }, {
                parent: {
                    title: '类目管理',
                    url: '/#'
                },
                son: []
            }, {
                parent: {
                    title: '会员管理',
                    url: '/#'
                },
                son: []
            }, {
                parent: {
                    title: '商家管理',
                    url: '/seller-detail'
                },
                son: []
            }, {
                parent: {
                    title: '资金管理',
                    url: '/#'
                },
                son: []
            }, {
                parent: {
                    title: '商票购设置',
                    url: '/#'
                },
                son: []
            }, {
                parent: {
                    title: '权限设置',
                    url: '/#'
                },
                son: [{
                    title: '授权登录IP',
                    url: '/#'
                }, {
                    title: '权限管理',
                    url: '/#'
                }, {
                    title: '登录帐号管理',
                    url: '/#'
                }]
            }, {
                parent: {
                    title: '操作日志',
                    url: '/#'
                },
                son: []
            }]
        }
    })
    app.lazy.factory('cks', ['$cookieStore', '$cookies',function($cookieStore, $cookies) {
        return {
            set: function(args) {
                angular.forEach(args, function(value, key) {
                    $cookies[key] = value;
                });
            },
            get: function(args) {
                return $cookieStore.get(args);
            },
            remove: function() {
                angular.forEach($cookies, function(value, key) {
                    delete $cookies[key];
                });
            }
        }
    }]);
    app.lazy.factory('loadCss',function() {
        return function(file) {
            var head = document.getElementsByTagName('head').item(0);
            var css = document.createElement('link');
            css.href = file;
            css.rel = 'stylesheet';
            css.type = 'text/css';
            head.appendChild(css);
        }
    })
    app.lazy.factory('unique',function() {
        return function(arr) {
            var ret = []
            var hash = {}
            for (var i = 0; i < arr.length; i++) {
                var item = arr[i]
                var key = typeof(item) + item
                if (hash[key] !== 1) {
                    ret.push(item)
                    hash[key] = 1
                }
            }
            return ret;
        }
    })
    app.lazy.factory('cycles',function() {
        var dates = [];
        var cyc = function(by, bm, ny, nm, nd, unsettleCycle) {
            //开始的年份by，月份bm，现在的年份ny，月份nm，日分nd，未结算的周期
            //周期列表的生成
            //开始时间
            /*var val=Date.parse('20140211');*/
            //如果开始年份少于当前年份
            if (by <= ny) {
                var bd = {};
                //得到开始时间
                var beginTime = "";
                //设置结束时间
                var endTime = "";
                //年份
                var year = "";
                //月份
                var month = "";
                //设置开始时间
                beginTime = bm < 10 ? by + "0" + bm + "11" : by + "" + bm + "11";
                //如果年份为当前年份，并且月份为当前月份并且日期少于11，结束
                //如果年份为当前年份，月份大于当前月份，结束
                if ((by == ny && bm == nm && nd < 12) || (by == ny && bm > nm)) {
                    return dates;
                }
                //如果月份少于12月，直接给月份加一
                if (bm < 12) {
                    endTime = bm < 9 ? by + "0" + (bm + 1) + "10" : by + "" + (bm + 1) + "10";
                    year = by;
                    month = bm + 1;
                } else {
                    //如果开始年份等于当前年份
                    if ((by + 1) == ny) {
                        //如果当前月份为1月
                        if (nm == 1) {
                            endTime = (by + 1) + "01" + "10";
                            year = by + 1;
                            month = 1;
                        } else {
                            if ((bm + 1) == nm && nd < 12) {
                                return dates;
                            }
                            endTime = (by + 1) + "01" + "10";
                            year = by + 1;
                            month = 1;
                        }
                    } else {
                        //如果月份等于12月，年份加一，月份设置为一月
                        endTime = (by + 1) + "01" + "10";
                        year = by + 1;
                        month = 1;
                    }
                }
                // bd.beginDate = new Date(beginTime.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1/$2/$3"));
                // bd.endDate = new Date(endTime.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1/$2/$3"));
                //周期的开始时间
                var beginDate = new Date(beginTime.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1/$2/$3"));
                //周期的结束时间
                var endDate = new Date(endTime.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1/$2/$3"));
                bd.beginTime = bm < 10 ? by + "0" + bm : by + "" + bm;
                bd.date = beginDate.toLocaleDateString() + "-" + endDate.toLocaleDateString();
                bd.ends = endDate.getTime();
                angular.forEach(unsettleCycle, function(cyc, key) {
                    if (bd.beginTime == cyc) {
                        bd.date = bd.date + "（未结）";
                        //如果当前的时间大月这一周期的最后一天
                        //得到当前的时间
                        var nowDay = nd < 9 ? "0" + nd : "" + nd;
                        var nowTime = nm < 9 ? ny + "0" + nm + nowDay : by + "" + nm + nowDay;
                        //得到当前的时间戳
                        var n = new Date(nowTime.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1/$2/$3")).getTime();
                        //得到结束时间的时间戳
                        var e = endDate.getTime();
                        //结束时间少于当前时间，将结算按钮可用
                        if (e < n) {
                            //表示可用结算结算
                            bd.isSettle = true;
                        }
                    }
                })
                bd.beginDate = beginDate.getTime();
                dates.push(bd);
                cyc(year, month, ny, nm, nd, unsettleCycle);
            }
        }
        return function(by, bm, ny, nm, nd, unsettleCycle) {
            dates = [];
            cyc(by, bm, ny, nm, nd, unsettleCycle);
            return dates;
        }
    })
    app.lazy.factory('getAddrById', ['$q',
        function($q) {
            return function(id) {
                var def = $q.defer();

                require(['json!atmanlib-lib/CITY.json'], function(CITY) {
                    var s = {
                        p: [undefined, ''],
                        c: [undefined, ''],
                        a: [undefined, '']
                    };
                    if(id){
                        var aId = CITY[id];
                        var cId = CITY[aId[1]];
                        var pId = CITY[cId[1]];

                        s['a'] = [id + '', aId[0]];

                        if (cId[1] == '1') {
                            s['p'] = [aId[1] + '', cId[0]];
                        } else {
                            s['c'] = [aId[1] + '', cId[0]];
                            s['p'] = [cId[1] + '', pId[0]];
                        }
                    }

                    def.resolve(s);
                })
                return def.promise;
            }
        }
    ])
});
define('service/CITY',['at_app'], function(app) {
    app.lazy.service('CITY', function() {
        return {
            '110000': ['北京', '1', 'bei jing'],
            '110100': ['北京市', '110000', 'bei jing shi'],
            '110101': ['东城区', '110100', 'dong cheng qu'],
            '110102': ['西城区', '110100', 'xi cheng qu'],
            '110103': ['崇文区', '110100', 'chong wen qu'],
            '110104': ['宣武区', '110100', 'xuan wu qu'],
            '110105': ['朝阳区', '110100', 'chao yang qu'],
            '110106': ['丰台区', '110100', 'feng tai qu'],
            '110107': ['石景山区', '110100', 'shi jing shan qu'],
            '110108': ['海淀区', '110100', 'hai dian qu'],
            '110109': ['门头沟区', '110100', 'men tou gou qu'],
            '110111': ['房山区', '110100', 'fang shan qu'],
            '110112': ['通州区', '110100', 'tong zhou qu'],
            '110113': ['顺义区', '110100', 'shun yi qu'],
            '110114': ['昌平区', '110100', 'chang ping qu'],
            '110115': ['大兴区', '110100', 'da xing qu'],
            '110116': ['怀柔区', '110100', 'huai rou qu'],
            '110117': ['平谷区', '110100', 'ping gu qu'],
            '110228': ['密云县', '110100', 'mi yun xian'],
            '110229': ['延庆县', '110100', 'yan qing xian'],
            '110230': ['其它区', '110100', 'qi ta qu'],
            '120000': ['天津', '1', 'tian jin'],
            '120100': ['天津市', '120000', 'tian jin shi'],
            '120101': ['和平区', '120100', 'he ping qu'],
            '120102': ['河东区', '120100', 'he dong qu'],
            '120103': ['河西区', '120100', 'he xi qu'],
            '120104': ['南开区', '120100', 'nan kai qu'],
            '120105': ['河北区', '120100', 'he bei qu'],
            '120106': ['红桥区', '120100', 'hong qiao qu'],
            '120107': ['塘沽区', '120100', 'tang gu qu'],
            '120108': ['汉沽区', '120100', 'han gu qu'],
            '120109': ['大港区', '120100', 'da gang qu'],
            '120110': ['东丽区', '120100', 'dong li qu'],
            '120111': ['西青区', '120100', 'xi qing qu'],
            '120112': ['津南区', '120100', 'jin nan qu'],
            '120113': ['北辰区', '120100', 'bei chen qu'],
            '120114': ['武清区', '120100', 'wu qing qu'],
            '120115': ['宝坻区', '120100', 'bao di qu'],
            '120116': ['滨海新区', '120100', 'bin hai xin qu'],
            '120221': ['宁河县', '120100', 'ning he xian'],
            '120223': ['静海县', '120100', 'jing hai xian'],
            '120225': ['蓟县', '120100', 'ji xian'],
            '120226': ['其它区', '120100', 'qi ta qu'],
            '130000': ['河北省', '1', 'he bei sheng'],
            '130100': ['石家庄市', '130000', 'shi jia zhuang shi'],
            '130102': ['长安区', '130100', 'chang an qu'],
            '130103': ['桥东区', '130100', 'qiao dong qu'],
            '130104': ['桥西区', '130100', 'qiao xi qu'],
            '130105': ['新华区', '130100', 'xin hua qu'],
            '130107': ['井陉矿区', '130100', 'jing xing kuang qu'],
            '130108': ['裕华区', '130100', 'yu hua qu'],
            '130121': ['井陉县', '130100', 'jing xing xian'],
            '130123': ['正定县', '130100', 'zheng ding xian'],
            '130124': ['栾城县', '130100', 'luan cheng xian'],
            '130125': ['行唐县', '130100', 'xing tang xian'],
            '130126': ['灵寿县', '130100', 'ling shou xian'],
            '130127': ['高邑县', '130100', 'gao yi xian'],
            '130128': ['深泽县', '130100', 'shen ze xian'],
            '130129': ['赞皇县', '130100', 'zan huang xian'],
            '130130': ['无极县', '130100', 'wu ji xian'],
            '130131': ['平山县', '130100', 'ping shan xian'],
            '130132': ['元氏县', '130100', 'yuan shi xian'],
            '130133': ['赵县', '130100', 'zhao xian'],
            '130181': ['辛集市', '130100', 'xin ji shi'],
            '130182': ['藁城市', '130100', 'gao cheng shi'],
            '130183': ['晋州市', '130100', 'jin zhou shi'],
            '130184': ['新乐市', '130100', 'xin le shi'],
            '130185': ['鹿泉市', '130100', 'lu quan shi'],
            '130186': ['其它区', '130100', 'qi ta qu'],
            '130200': ['唐山市', '130000', 'tang shan shi'],
            '130202': ['路南区', '130200', 'lu nan qu'],
            '130203': ['路北区', '130200', 'lu bei qu'],
            '130204': ['古冶区', '130200', 'gu ye qu'],
            '130205': ['开平区', '130200', 'kai ping qu'],
            '130207': ['丰南区', '130200', 'feng nan qu'],
            '130208': ['丰润区', '130200', 'feng run qu'],
            '130223': ['滦县', '130200', 'luan xian'],
            '130224': ['滦南县', '130200', 'luan nan xian'],
            '130225': ['乐亭县', '130200', 'le ting xian'],
            '130227': ['迁西县', '130200', 'qian xi xian'],
            '130229': ['玉田县', '130200', 'yu tian xian'],
            '130230': ['唐海县', '130200', 'tang hai xian'],
            '130281': ['遵化市', '130200', 'zun hua shi'],
            '130283': ['迁安市', '130200', 'qian an shi'],
            '130284': ['其它区', '130200', 'qi ta qu'],
            '130300': ['秦皇岛市', '130000', 'qin huang dao shi'],
            '130302': ['海港区', '130300', 'hai gang qu'],
            '130303': ['山海关区', '130300', 'shan hai guan qu'],
            '130304': ['北戴河区', '130300', 'bei dai he qu'],
            '130321': ['青龙满族自治县', '130300', 'qing long man zu zi zhi xian'],
            '130322': ['昌黎县', '130300', 'chang li xian'],
            '130323': ['抚宁县', '130300', 'fu ning xian'],
            '130324': ['卢龙县', '130300', 'lu long xian'],
            '130398': ['其它区', '130300', 'qi ta qu'],
            '130399': ['经济技术开发区', '130300', 'jing ji ji shu kai fa qu'],
            '130400': ['邯郸市', '130000', 'han dan shi'],
            '130402': ['邯山区', '130400', 'han shan qu'],
            '130403': ['丛台区', '130400', 'cong tai qu'],
            '130404': ['复兴区', '130400', 'fu xing qu'],
            '130406': ['峰峰矿区', '130400', 'feng feng kuang qu'],
            '130421': ['邯郸县', '130400', 'han dan xian'],
            '130423': ['临漳县', '130400', 'lin zhang xian'],
            '130424': ['成安县', '130400', 'cheng an xian'],
            '130425': ['大名县', '130400', 'da ming xian'],
            '130426': ['涉县', '130400', 'she xian'],
            '130427': ['磁县', '130400', 'ci xian'],
            '130428': ['肥乡县', '130400', 'fei xiang xian'],
            '130429': ['永年县', '130400', 'yong nian xian'],
            '130430': ['邱县', '130400', 'qiu xian'],
            '130431': ['鸡泽县', '130400', 'ji ze xian'],
            '130432': ['广平县', '130400', 'guang ping xian'],
            '130433': ['馆陶县', '130400', 'guan tao xian'],
            '130434': ['魏县', '130400', 'wei xian'],
            '130435': ['曲周县', '130400', 'qu zhou xian'],
            '130481': ['武安市', '130400', 'wu an shi'],
            '130482': ['其它区', '130400', 'qi ta qu'],
            '130500': ['邢台市', '130000', 'xing tai shi'],
            '130502': ['桥东区', '130500', 'qiao dong qu'],
            '130503': ['桥西区', '130500', 'qiao xi qu'],
            '130521': ['邢台县', '130500', 'xing tai xian'],
            '130522': ['临城县', '130500', 'lin cheng xian'],
            '130523': ['内丘县', '130500', 'nei qiu xian'],
            '130524': ['柏乡县', '130500', 'bai xiang xian'],
            '130525': ['隆尧县', '130500', 'long yao xian'],
            '130526': ['任县', '130500', 'ren xian'],
            '130527': ['南和县', '130500', 'nan he xian'],
            '130528': ['宁晋县', '130500', 'ning jin xian'],
            '130529': ['巨鹿县', '130500', 'ju lu xian'],
            '130530': ['新河县', '130500', 'xin he xian'],
            '130531': ['广宗县', '130500', 'guang zong xian'],
            '130532': ['平乡县', '130500', 'ping xiang xian'],
            '130533': ['威县', '130500', 'wei xian'],
            '130534': ['清河县', '130500', 'qing he xian'],
            '130535': ['临西县', '130500', 'lin xi xian'],
            '130581': ['南宫市', '130500', 'nan gong shi'],
            '130582': ['沙河市', '130500', 'sha he shi'],
            '130583': ['其它区', '130500', 'qi ta qu'],
            '130600': ['保定市', '130000', 'bao ding shi'],
            '130602': ['新市区', '130600', 'xin shi qu'],
            '130603': ['北市区', '130600', 'bei shi qu'],
            '130604': ['南市区', '130600', 'nan shi qu'],
            '130621': ['满城县', '130600', 'man cheng xian'],
            '130622': ['清苑县', '130600', 'qing yuan xian'],
            '130623': ['涞水县', '130600', 'lai shui xian'],
            '130624': ['阜平县', '130600', 'fu ping xian'],
            '130625': ['徐水县', '130600', 'xu shui xian'],
            '130626': ['定兴县', '130600', 'ding xing xian'],
            '130627': ['唐县', '130600', 'tang xian'],
            '130628': ['高阳县', '130600', 'gao yang xian'],
            '130629': ['容城县', '130600', 'rong cheng xian'],
            '130630': ['涞源县', '130600', 'lai yuan xian'],
            '130631': ['望都县', '130600', 'wang du xian'],
            '130632': ['安新县', '130600', 'an xin xian'],
            '130633': ['易县', '130600', 'yi xian'],
            '130634': ['曲阳县', '130600', 'qu yang xian'],
            '130635': ['蠡县', '130600', 'li xian'],
            '130636': ['顺平县', '130600', 'shun ping xian'],
            '130637': ['博野县', '130600', 'bo ye xian'],
            '130638': ['雄县', '130600', 'xiong xian'],
            '130681': ['涿州市', '130600', 'zhuo zhou shi'],
            '130682': ['定州市', '130600', 'ding zhou shi'],
            '130683': ['安国市', '130600', 'an guo shi'],
            '130684': ['高碑店市', '130600', 'gao bei dian shi'],
            '130698': ['高开区', '130600', 'gao kai qu'],
            '130699': ['其它区', '130600', 'qi ta qu'],
            '130700': ['张家口市', '130000', 'zhang jia kou shi'],
            '130702': ['桥东区', '130700', 'qiao dong qu'],
            '130703': ['桥西区', '130700', 'qiao xi qu'],
            '130705': ['宣化区', '130700', 'xuan hua qu'],
            '130706': ['下花园区', '130700', 'xia hua yuan qu'],
            '130721': ['宣化县', '130700', 'xuan hua xian'],
            '130722': ['张北县', '130700', 'zhang bei xian'],
            '130723': ['康保县', '130700', 'kang bao xian'],
            '130724': ['沽源县', '130700', 'gu yuan xian'],
            '130725': ['尚义县', '130700', 'shang yi xian'],
            '130726': ['蔚县', '130700', 'yu xian'],
            '130727': ['阳原县', '130700', 'yang yuan xian'],
            '130728': ['怀安县', '130700', 'huai an xian'],
            '130729': ['万全县', '130700', 'wan quan xian'],
            '130730': ['怀来县', '130700', 'huai lai xian'],
            '130731': ['涿鹿县', '130700', 'zhuo lu xian'],
            '130732': ['赤城县', '130700', 'chi cheng xian'],
            '130733': ['崇礼县', '130700', 'chong li xian'],
            '130734': ['其它区', '130700', 'qi ta qu'],
            '130800': ['承德市', '130000', 'cheng de shi'],
            '130802': ['双桥区', '130800', 'shuang qiao qu'],
            '130803': ['双滦区', '130800', 'shuang luan qu'],
            '130804': ['鹰手营子矿区', '130800', 'ying shou ying zi kuang qu'],
            '130821': ['承德县', '130800', 'cheng de xian'],
            '130822': ['兴隆县', '130800', 'xing long xian'],
            '130823': ['平泉县', '130800', 'ping quan xian'],
            '130824': ['滦平县', '130800', 'luan ping xian'],
            '130825': ['隆化县', '130800', 'long hua xian'],
            '130826': ['丰宁满族自治县', '130800', 'feng ning man zu zi zhi xian'],
            '130827': ['宽城满族自治县', '130800', 'kuan cheng man zu zi zhi xian'],
            '130828': ['围场满族蒙古族自治县', '130800', 'wei chang man zu meng gu zu zi zhi xian'],
            '130829': ['其它区', '130800', 'qi ta qu'],
            '130900': ['沧州市', '130000', 'cang zhou shi'],
            '130902': ['新华区', '130900', 'xin hua qu'],
            '130903': ['运河区', '130900', 'yun he qu'],
            '130921': ['沧县', '130900', 'cang xian'],
            '130922': ['青县', '130900', 'qing xian'],
            '130923': ['东光县', '130900', 'dong guang xian'],
            '130924': ['海兴县', '130900', 'hai xing xian'],
            '130925': ['盐山县', '130900', 'yan shan xian'],
            '130926': ['肃宁县', '130900', 'su ning xian'],
            '130927': ['南皮县', '130900', 'nan pi xian'],
            '130928': ['吴桥县', '130900', 'wu qiao xian'],
            '130929': ['献县', '130900', 'xian xian'],
            '130930': ['孟村回族自治县', '130900', 'meng cun hui zu zi zhi xian'],
            '130981': ['泊头市', '130900', 'bo tou shi'],
            '130982': ['任丘市', '130900', 'ren qiu shi'],
            '130983': ['黄骅市', '130900', 'huang hua shi'],
            '130984': ['河间市', '130900', 'he jian shi'],
            '130985': ['其它区', '130900', 'qi ta qu'],
            '131000': ['廊坊市', '130000', 'lang fang shi'],
            '131002': ['安次区', '131000', 'an ci qu'],
            '131003': ['广阳区', '131000', 'guang yang qu'],
            '131022': ['固安县', '131000', 'gu an xian'],
            '131023': ['永清县', '131000', 'yong qing xian'],
            '131024': ['香河县', '131000', 'xiang he xian'],
            '131025': ['大城县', '131000', 'da cheng xian'],
            '131026': ['文安县', '131000', 'wen an xian'],
            '131028': ['大厂回族自治县', '131000', 'da chang hui zu zi zhi xian'],
            '131051': ['开发区', '131000', 'kai fa qu'],
            '131052': ['燕郊经济技术开发区', '131000', 'yan jiao jing ji ji shu kai fa qu'],
            '131081': ['霸州市', '131000', 'ba zhou shi'],
            '131082': ['三河市', '131000', 'san he shi'],
            '131083': ['其它区', '131000', 'qi ta qu'],
            '131100': ['衡水市', '130000', 'heng shui shi'],
            '131102': ['桃城区', '131100', 'tao cheng qu'],
            '131121': ['枣强县', '131100', 'zao qiang xian'],
            '131122': ['武邑县', '131100', 'wu yi xian'],
            '131123': ['武强县', '131100', 'wu qiang xian'],
            '131124': ['饶阳县', '131100', 'rao yang xian'],
            '131125': ['安平县', '131100', 'an ping xian'],
            '131126': ['故城县', '131100', 'gu cheng xian'],
            '131127': ['景县', '131100', 'jing xian'],
            '131128': ['阜城县', '131100', 'fu cheng xian'],
            '131181': ['冀州市', '131100', 'ji zhou shi'],
            '131182': ['深州市', '131100', 'shen zhou shi'],
            '131183': ['其它区', '131100', 'qi ta qu'],
            '140000': ['山西省', '1', 'shan xi sheng'],
            '140100': ['太原市', '140000', 'tai yuan shi'],
            '140105': ['小店区', '140100', 'xiao dian qu'],
            '140106': ['迎泽区', '140100', 'ying ze qu'],
            '140107': ['杏花岭区', '140100', 'xing hua ling qu'],
            '140108': ['尖草坪区', '140100', 'jian cao ping qu'],
            '140109': ['万柏林区', '140100', 'wan bai lin qu'],
            '140110': ['晋源区', '140100', 'jin yuan qu'],
            '140121': ['清徐县', '140100', 'qing xu xian'],
            '140122': ['阳曲县', '140100', 'yang qu xian'],
            '140123': ['娄烦县', '140100', 'lou fan xian'],
            '140181': ['古交市', '140100', 'gu jiao shi'],
            '140182': ['其它区', '140100', 'qi ta qu'],
            '140200': ['大同市', '140000', 'da tong shi'],
            '140202': ['城区', '140200', 'cheng qu'],
            '140203': ['矿区', '140200', 'kuang qu'],
            '140211': ['南郊区', '140200', 'nan jiao qu'],
            '140212': ['新荣区', '140200', 'xin rong qu'],
            '140221': ['阳高县', '140200', 'yang gao xian'],
            '140222': ['天镇县', '140200', 'tian zhen xian'],
            '140223': ['广灵县', '140200', 'guang ling xian'],
            '140224': ['灵丘县', '140200', 'ling qiu xian'],
            '140225': ['浑源县', '140200', 'hun yuan xian'],
            '140226': ['左云县', '140200', 'zuo yun xian'],
            '140227': ['大同县', '140200', 'da tong xian'],
            '140228': ['其它区', '140200', 'qi ta qu'],
            '140300': ['阳泉市', '140000', 'yang quan shi'],
            '140302': ['城区', '140300', 'cheng qu'],
            '140303': ['矿区', '140300', 'kuang qu'],
            '140311': ['郊区', '140300', 'jiao qu'],
            '140321': ['平定县', '140300', 'ping ding xian'],
            '140322': ['盂县', '140300', 'yu xian'],
            '140323': ['其它区', '140300', 'qi ta qu'],
            '140400': ['长治市', '140000', 'chang zhi shi'],
            '140421': ['长治县', '140400', 'chang zhi xian'],
            '140423': ['襄垣县', '140400', 'xiang yuan xian'],
            '140424': ['屯留县', '140400', 'tun liu xian'],
            '140425': ['平顺县', '140400', 'ping shun xian'],
            '140426': ['黎城县', '140400', 'li cheng xian'],
            '140427': ['壶关县', '140400', 'hu guan xian'],
            '140428': ['长子县', '140400', 'zhang zi xian'],
            '140429': ['武乡县', '140400', 'wu xiang xian'],
            '140430': ['沁县', '140400', 'qin xian'],
            '140431': ['沁源县', '140400', 'qin yuan xian'],
            '140481': ['潞城市', '140400', 'lu cheng shi'],
            '140482': ['城区', '140400', 'cheng qu'],
            '140483': ['郊区', '140400', 'jiao qu'],
            '140484': ['高新区', '140400', 'gao xin qu'],
            '140485': ['其它区', '140400', 'qi ta qu'],
            '140500': ['晋城市', '140000', 'jin cheng shi'],
            '140502': ['城区', '140500', 'cheng qu'],
            '140521': ['沁水县', '140500', 'qin shui xian'],
            '140522': ['阳城县', '140500', 'yang cheng xian'],
            '140524': ['陵川县', '140500', 'ling chuan xian'],
            '140525': ['泽州县', '140500', 'ze zhou xian'],
            '140581': ['高平市', '140500', 'gao ping shi'],
            '140582': ['其它区', '140500', 'qi ta qu'],
            '140600': ['朔州市', '140000', 'shuo zhou shi'],
            '140602': ['朔城区', '140600', 'shuo cheng qu'],
            '140603': ['平鲁区', '140600', 'ping lu qu'],
            '140621': ['山阴县', '140600', 'shan yin xian'],
            '140622': ['应县', '140600', 'ying xian'],
            '140623': ['右玉县', '140600', 'you yu xian'],
            '140624': ['怀仁县', '140600', 'huai ren xian'],
            '140625': ['其它区', '140600', 'qi ta qu'],
            '140700': ['晋中市', '140000', 'jin zhong shi'],
            '140702': ['榆次区', '140700', 'yu ci qu'],
            '140721': ['榆社县', '140700', 'yu she xian'],
            '140722': ['左权县', '140700', 'zuo quan xian'],
            '140723': ['和顺县', '140700', 'he shun xian'],
            '140724': ['昔阳县', '140700', 'xi yang xian'],
            '140725': ['寿阳县', '140700', 'shou yang xian'],
            '140726': ['太谷县', '140700', 'tai gu xian'],
            '140727': ['祁县', '140700', 'qi xian'],
            '140728': ['平遥县', '140700', 'ping yao xian'],
            '140729': ['灵石县', '140700', 'ling shi xian'],
            '140781': ['介休市', '140700', 'jie xiu shi'],
            '140782': ['其它区', '140700', 'qi ta qu'],
            '140800': ['运城市', '140000', 'yun cheng shi'],
            '140802': ['盐湖区', '140800', 'yan hu qu'],
            '140821': ['临猗县', '140800', 'lin yi xian'],
            '140822': ['万荣县', '140800', 'wan rong xian'],
            '140823': ['闻喜县', '140800', 'wen xi xian'],
            '140824': ['稷山县', '140800', 'ji shan xian'],
            '140825': ['新绛县', '140800', 'xin jiang xian'],
            '140826': ['绛县', '140800', 'jiang xian'],
            '140827': ['垣曲县', '140800', 'yuan qu xian'],
            '140828': ['夏县', '140800', 'xia xian'],
            '140829': ['平陆县', '140800', 'ping lu xian'],
            '140830': ['芮城县', '140800', 'rui cheng xian'],
            '140881': ['永济市', '140800', 'yong ji shi'],
            '140882': ['河津市', '140800', 'he jin shi'],
            '140883': ['其它区', '140800', 'qi ta qu'],
            '140900': ['忻州市', '140000', 'xin zhou shi'],
            '140902': ['忻府区', '140900', 'xin fu qu'],
            '140921': ['定襄县', '140900', 'ding xiang xian'],
            '140922': ['五台县', '140900', 'wu tai xian'],
            '140923': ['代县', '140900', 'dai xian'],
            '140924': ['繁峙县', '140900', 'fan shi xian'],
            '140925': ['宁武县', '140900', 'ning wu xian'],
            '140926': ['静乐县', '140900', 'jing le xian'],
            '140927': ['神池县', '140900', 'shen chi xian'],
            '140928': ['五寨县', '140900', 'wu zhai xian'],
            '140929': ['岢岚县', '140900', 'ke lan xian'],
            '140930': ['河曲县', '140900', 'he qu xian'],
            '140931': ['保德县', '140900', 'bao de xian'],
            '140932': ['偏关县', '140900', 'pian guan xian'],
            '140981': ['原平市', '140900', 'yuan ping shi'],
            '140982': ['其它区', '140900', 'qi ta qu'],
            '141000': ['临汾市', '140000', 'lin fen shi'],
            '141002': ['尧都区', '141000', 'yao du qu'],
            '141021': ['曲沃县', '141000', 'qu wo xian'],
            '141022': ['翼城县', '141000', 'yi cheng xian'],
            '141023': ['襄汾县', '141000', 'xiang fen xian'],
            '141024': ['洪洞县', '141000', 'hong dong xian'],
            '141025': ['古县', '141000', 'gu xian'],
            '141026': ['安泽县', '141000', 'an ze xian'],
            '141027': ['浮山县', '141000', 'fu shan xian'],
            '141028': ['吉县', '141000', 'ji xian'],
            '141029': ['乡宁县', '141000', 'xiang ning xian'],
            '141030': ['大宁县', '141000', 'da ning xian'],
            '141031': ['隰县', '141000', 'xi xian'],
            '141032': ['永和县', '141000', 'yong he xian'],
            '141033': ['蒲县', '141000', 'pu xian'],
            '141034': ['汾西县', '141000', 'fen xi xian'],
            '141081': ['侯马市', '141000', 'hou ma shi'],
            '141082': ['霍州市', '141000', 'huo zhou shi'],
            '141083': ['其它区', '141000', 'qi ta qu'],
            '141100': ['吕梁市', '140000', 'lv liang shi'],
            '141102': ['离石区', '141100', 'li shi qu'],
            '141121': ['文水县', '141100', 'wen shui xian'],
            '141122': ['交城县', '141100', 'jiao cheng xian'],
            '141123': ['兴县', '141100', 'xing xian'],
            '141124': ['临县', '141100', 'lin xian'],
            '141125': ['柳林县', '141100', 'liu lin xian'],
            '141126': ['石楼县', '141100', 'shi lou xian'],
            '141127': ['岚县', '141100', 'lan xian'],
            '141128': ['方山县', '141100', 'fang shan xian'],
            '141129': ['中阳县', '141100', 'zhong yang xian'],
            '141130': ['交口县', '141100', 'jiao kou xian'],
            '141181': ['孝义市', '141100', 'xiao yi shi'],
            '141182': ['汾阳市', '141100', 'fen yang shi'],
            '141183': ['其它区', '141100', 'qi ta qu'],
            '150000': ['内蒙古自治区', '1', 'nei meng gu zi zhi qu'],
            '150100': ['呼和浩特市', '150000', 'hu he hao te shi'],
            '150102': ['新城区', '150100', 'xin cheng qu'],
            '150103': ['回民区', '150100', 'hui min qu'],
            '150104': ['玉泉区', '150100', 'yu quan qu'],
            '150105': ['赛罕区', '150100', 'sai han qu'],
            '150121': ['土默特左旗', '150100', 'tu mo te zuo qi'],
            '150122': ['托克托县', '150100', 'tuo ke tuo xian'],
            '150123': ['和林格尔县', '150100', 'he lin ge er xian'],
            '150124': ['清水河县', '150100', 'qing shui he xian'],
            '150125': ['武川县', '150100', 'wu chuan xian'],
            '150126': ['其它区', '150100', 'qi ta qu'],
            '150200': ['包头市', '150000', 'bao tou shi'],
            '150202': ['东河区', '150200', 'dong he qu'],
            '150203': ['昆都仑区', '150200', 'kun du lun qu'],
            '150204': ['青山区', '150200', 'qing shan qu'],
            '150205': ['石拐区', '150200', 'shi guai qu'],
            '150206': ['白云矿区', '150200', 'bai yun kuang qu'],
            '150207': ['九原区', '150200', 'jiu yuan qu'],
            '150221': ['土默特右旗', '150200', 'tu mo te you qi'],
            '150222': ['固阳县', '150200', 'gu yang xian'],
            '150223': ['达尔罕茂明安联合旗', '150200', 'da er han mao ming an lian he qi'],
            '150224': ['其它区', '150200', 'qi ta qu'],
            '150300': ['乌海市', '150000', 'wu hai shi'],
            '150302': ['海勃湾区', '150300', 'hai bo wan qu'],
            '150303': ['海南区', '150300', 'hai nan qu'],
            '150304': ['乌达区', '150300', 'wu da qu'],
            '150305': ['其它区', '150300', 'qi ta qu'],
            '150400': ['赤峰市', '150000', 'chi feng shi'],
            '150402': ['红山区', '150400', 'hong shan qu'],
            '150403': ['元宝山区', '150400', 'yuan bao shan qu'],
            '150404': ['松山区', '150400', 'song shan qu'],
            '150421': ['阿鲁科尔沁旗', '150400', 'a lu ke er qin qi'],
            '150422': ['巴林左旗', '150400', 'ba lin zuo qi'],
            '150423': ['巴林右旗', '150400', 'ba lin you qi'],
            '150424': ['林西县', '150400', 'lin xi xian'],
            '150425': ['克什克腾旗', '150400', 'ke shi ke teng qi'],
            '150426': ['翁牛特旗', '150400', 'weng niu te qi'],
            '150428': ['喀喇沁旗', '150400', 'ka la qin qi'],
            '150429': ['宁城县', '150400', 'ning cheng xian'],
            '150430': ['敖汉旗', '150400', 'ao han qi'],
            '150431': ['其它区', '150400', 'qi ta qu'],
            '150500': ['通辽市', '150000', 'tong liao shi'],
            '150502': ['科尔沁区', '150500', 'ke er qin qu'],
            '150521': ['科尔沁左翼中旗', '150500', 'ke er qin zuo yi zhong qi'],
            '150522': ['科尔沁左翼后旗', '150500', 'ke er qin zuo yi hou qi'],
            '150523': ['开鲁县', '150500', 'kai lu xian'],
            '150524': ['库伦旗', '150500', 'ku lun qi'],
            '150525': ['奈曼旗', '150500', 'nai man qi'],
            '150526': ['扎鲁特旗', '150500', 'zha lu te qi'],
            '150581': ['霍林郭勒市', '150500', 'huo lin guo le shi'],
            '150582': ['其它区', '150500', 'qi ta qu'],
            '150600': ['鄂尔多斯市', '150000', 'e er duo si shi'],
            '150602': ['东胜区', '150600', 'dong sheng qu'],
            '150621': ['达拉特旗', '150600', 'da la te qi'],
            '150622': ['准格尔旗', '150600', 'zhun ge er qi'],
            '150623': ['鄂托克前旗', '150600', 'e tuo ke qian qi'],
            '150624': ['鄂托克旗', '150600', 'e tuo ke qi'],
            '150625': ['杭锦旗', '150600', 'hang jin qi'],
            '150626': ['乌审旗', '150600', 'wu shen qi'],
            '150627': ['伊金霍洛旗', '150600', 'yi jin huo luo qi'],
            '150628': ['其它区', '150600', 'qi ta qu'],
            '150700': ['呼伦贝尔市', '150000', 'hu lun bei er shi'],
            '150702': ['海拉尔区', '150700', 'hai la er qu'],
            '150721': ['阿荣旗', '150700', 'a rong qi'],
            '150722': ['莫力达瓦达斡尔族自治旗', '150700', 'mo li da wa da wo er zu zi zhi qi'],
            '150723': ['鄂伦春自治旗', '150700', 'e lun chun zi zhi qi'],
            '150724': ['鄂温克族自治旗', '150700', 'e wen ke zu zi zhi qi'],
            '150725': ['陈巴尔虎旗', '150700', 'chen ba er hu qi'],
            '150726': ['新巴尔虎左旗', '150700', 'xin ba er hu zuo qi'],
            '150727': ['新巴尔虎右旗', '150700', 'xin ba er hu you qi'],
            '150781': ['满洲里市', '150700', 'man zhou li shi'],
            '150782': ['牙克石市', '150700', 'ya ke shi shi'],
            '150783': ['扎兰屯市', '150700', 'zha lan tun shi'],
            '150784': ['额尔古纳市', '150700', 'e er gu na shi'],
            '150785': ['根河市', '150700', 'gen he shi'],
            '150786': ['其它区', '150700', 'qi ta qu'],
            '150800': ['巴彦淖尔市', '150000', 'ba yan nao er shi'],
            '150802': ['临河区', '150800', 'lin he qu'],
            '150821': ['五原县', '150800', 'wu yuan xian'],
            '150822': ['磴口县', '150800', 'deng kou xian'],
            '150823': ['乌拉特前旗', '150800', 'wu la te qian qi'],
            '150824': ['乌拉特中旗', '150800', 'wu la te zhong qi'],
            '150825': ['乌拉特后旗', '150800', 'wu la te hou qi'],
            '150826': ['杭锦后旗', '150800', 'hang jin hou qi'],
            '150827': ['其它区', '150800', 'qi ta qu'],
            '150900': ['乌兰察布市', '150000', 'wu lan cha bu shi'],
            '150902': ['集宁区', '150900', 'ji ning qu'],
            '150921': ['卓资县', '150900', 'zhuo zi xian'],
            '150922': ['化德县', '150900', 'hua de xian'],
            '150923': ['商都县', '150900', 'shang du xian'],
            '150924': ['兴和县', '150900', 'xing he xian'],
            '150925': ['凉城县', '150900', 'liang cheng xian'],
            '150926': ['察哈尔右翼前旗', '150900', 'cha ha er you yi qian qi'],
            '150927': ['察哈尔右翼中旗', '150900', 'cha ha er you yi zhong qi'],
            '150928': ['察哈尔右翼后旗', '150900', 'cha ha er you yi hou qi'],
            '150929': ['四子王旗', '150900', 'si zi wang qi'],
            '150981': ['丰镇市', '150900', 'feng zhen shi'],
            '150982': ['其它区', '150900', 'qi ta qu'],
            '152200': ['兴安盟', '150000', 'xing an meng'],
            '152201': ['乌兰浩特市', '152200', 'wu lan hao te shi'],
            '152202': ['阿尔山市', '152200', 'a er shan shi'],
            '152221': ['科尔沁右翼前旗', '152200', 'ke er qin you yi qian qi'],
            '152222': ['科尔沁右翼中旗', '152200', 'ke er qin you yi zhong qi'],
            '152223': ['扎赉特旗', '152200', 'zha lai te qi'],
            '152224': ['突泉县', '152200', 'tu quan xian'],
            '152225': ['其它区', '152200', 'qi ta qu'],
            '152500': ['锡林郭勒盟', '150000', 'xi lin guo le meng'],
            '152501': ['二连浩特市', '152500', 'er lian hao te shi'],
            '152502': ['锡林浩特市', '152500', 'xi lin hao te shi'],
            '152522': ['阿巴嘎旗', '152500', 'a ba ga qi'],
            '152523': ['苏尼特左旗', '152500', 'su ni te zuo qi'],
            '152524': ['苏尼特右旗', '152500', 'su ni te you qi'],
            '152525': ['东乌珠穆沁旗', '152500', 'dong wu zhu mu qin qi'],
            '152526': ['西乌珠穆沁旗', '152500', 'xi wu zhu mu qin qi'],
            '152527': ['太仆寺旗', '152500', 'tai pu si qi'],
            '152528': ['镶黄旗', '152500', 'xiang huang qi'],
            '152529': ['正镶白旗', '152500', 'zheng xiang bai qi'],
            '152530': ['正蓝旗', '152500', 'zheng lan qi'],
            '152531': ['多伦县', '152500', 'duo lun xian'],
            '152532': ['其它区', '152500', 'qi ta qu'],
            '152900': ['阿拉善盟', '150000', 'a la shan meng'],
            '152921': ['阿拉善左旗', '152900', 'a la shan zuo qi'],
            '152922': ['阿拉善右旗', '152900', 'a la shan you qi'],
            '152923': ['额济纳旗', '152900', 'e ji na qi'],
            '152924': ['其它区', '152900', 'qi ta qu'],
            '210000': ['辽宁省', '1', 'liao ning sheng'],
            '210100': ['沈阳市', '210000', 'shen yang shi'],
            '210102': ['和平区', '210100', 'he ping qu'],
            '210103': ['沈河区', '210100', 'shen he qu'],
            '210104': ['大东区', '210100', 'da dong qu'],
            '210105': ['皇姑区', '210100', 'huang gu qu'],
            '210106': ['铁西区', '210100', 'tie xi qu'],
            '210111': ['苏家屯区', '210100', 'su jia tun qu'],
            '210112': ['东陵区', '210100', 'dong ling qu'],
            '210113': ['新城子区', '210100', 'xin cheng zi qu'],
            '210114': ['于洪区', '210100', 'yu hong qu'],
            '210122': ['辽中县', '210100', 'liao zhong xian'],
            '210123': ['康平县', '210100', 'kang ping xian'],
            '210124': ['法库县', '210100', 'fa ku xian'],
            '210181': ['新民市', '210100', 'xin min shi'],
            '210182': ['浑南新区', '210100', 'hun nan xin qu'],
            '210183': ['张士开发区', '210100', 'zhang shi kai fa qu'],
            '210184': ['沈北新区', '210100', 'shen bei xin qu'],
            '210185': ['其它区', '210100', 'qi ta qu'],
            '210200': ['大连市', '210000', 'da lian shi'],
            '210202': ['中山区', '210200', 'zhong shan qu'],
            '210203': ['西岗区', '210200', 'xi gang qu'],
            '210204': ['沙河口区', '210200', 'sha he kou qu'],
            '210211': ['甘井子区', '210200', 'gan jing zi qu'],
            '210212': ['旅顺口区', '210200', 'lv shun kou qu'],
            '210213': ['金州区', '210200', 'jin zhou qu'],
            '210224': ['长海县', '210200', 'chang hai xian'],
            '210251': ['开发区', '210200', 'kai fa qu'],
            '210281': ['瓦房店市', '210200', 'wa fang dian shi'],
            '210282': ['普兰店市', '210200', 'pu lan dian shi'],
            '210283': ['庄河市', '210200', 'zhuang he shi'],
            '210297': ['岭前区', '210200', 'ling qian qu'],
            '210298': ['其它区', '210200', 'qi ta qu'],
            '210300': ['鞍山市', '210000', 'an shan shi'],
            '210302': ['铁东区', '210300', 'tie dong qu'],
            '210303': ['铁西区', '210300', 'tie xi qu'],
            '210304': ['立山区', '210300', 'li shan qu'],
            '210311': ['千山区', '210300', 'qian shan qu'],
            '210321': ['台安县', '210300', 'tai an xian'],
            '210323': ['岫岩满族自治县', '210300', 'xiu yan man zu zi zhi xian'],
            '210351': ['高新区', '210300', 'gao xin qu'],
            '210381': ['海城市', '210300', 'hai cheng shi'],
            '210382': ['其它区', '210300', 'qi ta qu'],
            '210400': ['抚顺市', '210000', 'fu shun shi'],
            '210402': ['新抚区', '210400', 'xin fu qu'],
            '210403': ['东洲区', '210400', 'dong zhou qu'],
            '210404': ['望花区', '210400', 'wang hua qu'],
            '210411': ['顺城区', '210400', 'shun cheng qu'],
            '210421': ['抚顺县', '210400', 'fu shun xian'],
            '210422': ['新宾满族自治县', '210400', 'xin bin man zu zi zhi xian'],
            '210423': ['清原满族自治县', '210400', 'qing yuan man zu zi zhi xian'],
            '210424': ['其它区', '210400', 'qi ta qu'],
            '210500': ['本溪市', '210000', 'ben xi shi'],
            '210502': ['平山区', '210500', 'ping shan qu'],
            '210503': ['溪湖区', '210500', 'xi hu qu'],
            '210504': ['明山区', '210500', 'ming shan qu'],
            '210505': ['南芬区', '210500', 'nan fen qu'],
            '210521': ['本溪满族自治县', '210500', 'ben xi man zu zi zhi xian'],
            '210522': ['桓仁满族自治县', '210500', 'huan ren man zu zi zhi xian'],
            '210523': ['其它区', '210500', 'qi ta qu'],
            '210600': ['丹东市', '210000', 'dan dong shi'],
            '210602': ['元宝区', '210600', 'yuan bao qu'],
            '210603': ['振兴区', '210600', 'zhen xing qu'],
            '210604': ['振安区', '210600', 'zhen an qu'],
            '210624': ['宽甸满族自治县', '210600', 'kuan dian man zu zi zhi xian'],
            '210681': ['东港市', '210600', 'dong gang shi'],
            '210682': ['凤城市', '210600', 'feng cheng shi'],
            '210683': ['其它区', '210600', 'qi ta qu'],
            '210700': ['锦州市', '210000', 'jin zhou shi'],
            '210702': ['古塔区', '210700', 'gu ta qu'],
            '210703': ['凌河区', '210700', 'ling he qu'],
            '210711': ['太和区', '210700', 'tai he qu'],
            '210726': ['黑山县', '210700', 'hei shan xian'],
            '210727': ['义县', '210700', 'yi xian'],
            '210781': ['凌海市', '210700', 'ling hai shi'],
            '210782': ['北镇市', '210700', 'bei zhen shi'],
            '210783': ['其它区', '210700', 'qi ta qu'],
            '210800': ['营口市', '210000', 'ying kou shi'],
            '210802': ['站前区', '210800', 'zhan qian qu'],
            '210803': ['西市区', '210800', 'xi shi qu'],
            '210804': ['鲅鱼圈区', '210800', 'ba yu juan qu'],
            '210811': ['老边区', '210800', 'lao bian qu'],
            '210881': ['盖州市', '210800', 'gai zhou shi'],
            '210882': ['大石桥市', '210800', 'da shi qiao shi'],
            '210883': ['其它区', '210800', 'qi ta qu'],
            '210900': ['阜新市', '210000', 'fu xin shi'],
            '210902': ['海州区', '210900', 'hai zhou qu'],
            '210903': ['新邱区', '210900', 'xin qiu qu'],
            '210904': ['太平区', '210900', 'tai ping qu'],
            '210905': ['清河门区', '210900', 'qing he men qu'],
            '210911': ['细河区', '210900', 'xi he qu'],
            '210921': ['阜新蒙古族自治县', '210900', 'fu xin meng gu zu zi zhi xian'],
            '210922': ['彰武县', '210900', 'zhang wu xian'],
            '210923': ['其它区', '210900', 'qi ta qu'],
            '211000': ['辽阳市', '210000', 'liao yang shi'],
            '211002': ['白塔区', '211000', 'bai ta qu'],
            '211003': ['文圣区', '211000', 'wen sheng qu'],
            '211004': ['宏伟区', '211000', 'hong wei qu'],
            '211005': ['弓长岭区', '211000', 'gong chang ling qu'],
            '211011': ['太子河区', '211000', 'tai zi he qu'],
            '211021': ['辽阳县', '211000', 'liao yang xian'],
            '211081': ['灯塔市', '211000', 'deng ta shi'],
            '211082': ['其它区', '211000', 'qi ta qu'],
            '211100': ['盘锦市', '210000', 'pan jin shi'],
            '211102': ['双台子区', '211100', 'shuang tai zi qu'],
            '211103': ['兴隆台区', '211100', 'xing long tai qu'],
            '211121': ['大洼县', '211100', 'da wa xian'],
            '211122': ['盘山县', '211100', 'pan shan xian'],
            '211123': ['其它区', '211100', 'qi ta qu'],
            '211200': ['铁岭市', '210000', 'tie ling shi'],
            '211202': ['银州区', '211200', 'yin zhou qu'],
            '211204': ['清河区', '211200', 'qing he qu'],
            '211221': ['铁岭县', '211200', 'tie ling xian'],
            '211223': ['西丰县', '211200', 'xi feng xian'],
            '211224': ['昌图县', '211200', 'chang tu xian'],
            '211281': ['调兵山市', '211200', 'diao bing shan shi'],
            '211282': ['开原市', '211200', 'kai yuan shi'],
            '211283': ['其它区', '211200', 'qi ta qu'],
            '211300': ['朝阳市', '210000', 'chao yang shi'],
            '211302': ['双塔区', '211300', 'shuang ta qu'],
            '211303': ['龙城区', '211300', 'long cheng qu'],
            '211321': ['朝阳县', '211300', 'chao yang xian'],
            '211322': ['建平县', '211300', 'jian ping xian'],
            '211324': ['喀喇沁左翼蒙古族自治县', '211300', 'ka la qin zuo yi meng gu zu zi zhi xian'],
            '211381': ['北票市', '211300', 'bei piao shi'],
            '211382': ['凌源市', '211300', 'ling yuan shi'],
            '211383': ['其它区', '211300', 'qi ta qu'],
            '211400': ['葫芦岛市', '210000', 'hu lu dao shi'],
            '211402': ['连山区', '211400', 'lian shan qu'],
            '211403': ['龙港区', '211400', 'long gang qu'],
            '211404': ['南票区', '211400', 'nan piao qu'],
            '211421': ['绥中县', '211400', 'sui zhong xian'],
            '211422': ['建昌县', '211400', 'jian chang xian'],
            '211481': ['兴城市', '211400', 'xing cheng shi'],
            '211482': ['其它区', '211400', 'qi ta qu'],
            '220000': ['吉林省', '1', 'ji lin sheng'],
            '220100': ['长春市', '220000', 'chang chun shi'],
            '220102': ['南关区', '220100', 'nan guan qu'],
            '220103': ['宽城区', '220100', 'kuan cheng qu'],
            '220104': ['朝阳区', '220100', 'chao yang qu'],
            '220105': ['二道区', '220100', 'er dao qu'],
            '220106': ['绿园区', '220100', 'lv yuan qu'],
            '220112': ['双阳区', '220100', 'shuang yang qu'],
            '220122': ['农安县', '220100', 'nong an xian'],
            '220181': ['九台市', '220100', 'jiu tai shi'],
            '220182': ['榆树市', '220100', 'yu shu shi'],
            '220183': ['德惠市', '220100', 'de hui shi'],
            '220184': ['高新技术产业开发区', '220100', 'gao xin ji shu chan ye kai fa qu'],
            '220185': ['汽车产业开发区', '220100', 'qi che chan ye kai fa qu'],
            '220186': ['经济技术开发区', '220100', 'jing ji ji shu kai fa qu'],
            '220187': ['净月旅游开发区', '220100', 'jing yue lv you kai fa qu'],
            '220188': ['其它区', '220100', 'qi ta qu'],
            '220200': ['吉林市', '220000', 'ji lin shi'],
            '220202': ['昌邑区', '220200', 'chang yi qu'],
            '220203': ['龙潭区', '220200', 'long tan qu'],
            '220204': ['船营区', '220200', 'chuan ying qu'],
            '220211': ['丰满区', '220200', 'feng man qu'],
            '220221': ['永吉县', '220200', 'yong ji xian'],
            '220281': ['蛟河市', '220200', 'jiao he shi'],
            '220282': ['桦甸市', '220200', 'hua dian shi'],
            '220283': ['舒兰市', '220200', 'shu lan shi'],
            '220284': ['磐石市', '220200', 'pan shi shi'],
            '220285': ['其它区', '220200', 'qi ta qu'],
            '220300': ['四平市', '220000', 'si ping shi'],
            '220302': ['铁西区', '220300', 'tie xi qu'],
            '220303': ['铁东区', '220300', 'tie dong qu'],
            '220322': ['梨树县', '220300', 'li shu xian'],
            '220323': ['伊通满族自治县', '220300', 'yi tong man zu zi zhi xian'],
            '220381': ['公主岭市', '220300', 'gong zhu ling shi'],
            '220382': ['双辽市', '220300', 'shuang liao shi'],
            '220383': ['其它区', '220300', 'qi ta qu'],
            '220400': ['辽源市', '220000', 'liao yuan shi'],
            '220402': ['龙山区', '220400', 'long shan qu'],
            '220403': ['西安区', '220400', 'xi an qu'],
            '220421': ['东丰县', '220400', 'dong feng xian'],
            '220422': ['东辽县', '220400', 'dong liao xian'],
            '220423': ['其它区', '220400', 'qi ta qu'],
            '220500': ['通化市', '220000', 'tong hua shi'],
            '220502': ['东昌区', '220500', 'dong chang qu'],
            '220503': ['二道江区', '220500', 'er dao jiang qu'],
            '220521': ['通化县', '220500', 'tong hua xian'],
            '220523': ['辉南县', '220500', 'hui nan xian'],
            '220524': ['柳河县', '220500', 'liu he xian'],
            '220581': ['梅河口市', '220500', 'mei he kou shi'],
            '220582': ['集安市', '220500', 'ji an shi'],
            '220583': ['其它区', '220500', 'qi ta qu'],
            '220600': ['白山市', '220000', 'bai shan shi'],
            '220602': ['八道江区', '220600', 'ba dao jiang qu'],
            '220621': ['抚松县', '220600', 'fu song xian'],
            '220622': ['靖宇县', '220600', 'jing yu xian'],
            '220623': ['长白朝鲜族自治县', '220600', 'chang bai chao xian zu zi zhi xian'],
            '220625': ['江源市', '220600', 'jiang yuan xian'],
            '220681': ['临江市', '220600', 'lin jiang shi'],
            '220682': ['其它区', '220600', 'qi ta qu'],
            '220700': ['松原市', '220000', 'song yuan shi'],
            '220702': ['宁江区', '220700', 'ning jiang qu'],
            '220721': ['前郭尔罗斯蒙古族自治县', '220700', 'qian guo er luo si meng gu zu zi zhi xian'],
            '220722': ['长岭县', '220700', 'chang ling xian'],
            '220723': ['乾安县', '220700', 'qian an xian'],
            '220724': ['扶余县', '220700', 'fu yu xian'],
            '220725': ['其它区', '220700', 'qi ta qu'],
            '220800': ['白城市', '220000', 'bai cheng shi'],
            '220802': ['洮北区', '220800', 'tao bei qu'],
            '220821': ['镇赉县', '220800', 'zhen lai xian'],
            '220822': ['通榆县', '220800', 'tong yu xian'],
            '220881': ['洮南市', '220800', 'tao nan shi'],
            '220882': ['大安市', '220800', 'da an shi'],
            '220883': ['其它区', '220800', 'qi ta qu'],
            '222400': ['延边朝鲜族自治州', '220000', 'yan bian chao xian zu zi zhi zhou'],
            '222401': ['延吉市', '222400', 'yan ji shi'],
            '222402': ['图们市', '222400', 'tu men shi'],
            '222403': ['敦化市', '222400', 'dun hua shi'],
            '222404': ['珲春市', '222400', 'hun chun shi'],
            '222405': ['龙井市', '222400', 'long jing shi'],
            '222406': ['和龙市', '222400', 'he long shi'],
            '222424': ['汪清县', '222400', 'wang qing xian'],
            '222426': ['安图县', '222400', 'an tu xian'],
            '222427': ['其它区', '222400', 'qi ta qu'],
            '230000': ['黑龙江省', '1', 'hei long jiang sheng'],
            '230100': ['哈尔滨市', '230000', 'ha er bin shi'],
            '230102': ['道里区', '230100', 'dao li qu'],
            '230103': ['南岗区', '230100', 'nan gang qu'],
            '230104': ['道外区', '230100', 'dao wai qu'],
            '230106': ['香坊区', '230100', 'xiang fang qu'],
            '230107': ['动力区', '230100', 'dong li qu'],
            '230108': ['平房区', '230100', 'ping fang qu'],
            '230109': ['松北区', '230100', 'song bei qu'],
            '230111': ['呼兰区', '230100', 'hu lan qu'],
            '230123': ['依兰县', '230100', 'yi lan xian'],
            '230124': ['方正县', '230100', 'fang zheng xian'],
            '230125': ['宾县', '230100', 'bin xian'],
            '230126': ['巴彦县', '230100', 'ba yan xian'],
            '230127': ['木兰县', '230100', 'mu lan xian'],
            '230128': ['通河县', '230100', 'tong he xian'],
            '230129': ['延寿县', '230100', 'yan shou xian'],
            '230181': ['阿城市', '230100', 'a cheng shi'],
            '230182': ['双城市', '230100', 'shuang cheng shi'],
            '230183': ['尚志市', '230100', 'shang zhi shi'],
            '230184': ['五常市', '230100', 'wu chang shi'],
            '230185': ['阿城市', '230100', 'a cheng shi'],
            '230186': ['其它区', '230100', 'qi ta qu'],
            '230200': ['齐齐哈尔市', '230000', 'qi qi ha er shi'],
            '230202': ['龙沙区', '230200', 'long sha qu'],
            '230203': ['建华区', '230200', 'jian hua qu'],
            '230204': ['铁锋区', '230200', 'tie feng qu'],
            '230205': ['昂昂溪区', '230200', 'ang ang xi qu'],
            '230206': ['富拉尔基区', '230200', 'fu la er ji qu'],
            '230207': ['碾子山区', '230200', 'nian zi shan qu'],
            '230208': ['梅里斯达斡尔族区', '230200', 'mei li si da wo er zu qu'],
            '230221': ['龙江县', '230200', 'long jiang xian'],
            '230223': ['依安县', '230200', 'yi an xian'],
            '230224': ['泰来县', '230200', 'tai lai xian'],
            '230225': ['甘南县', '230200', 'gan nan xian'],
            '230227': ['富裕县', '230200', 'fu yu xian'],
            '230229': ['克山县', '230200', 'ke shan xian'],
            '230230': ['克东县', '230200', 'ke dong xian'],
            '230231': ['拜泉县', '230200', 'bai quan xian'],
            '230281': ['讷河市', '230200', 'ne he shi'],
            '230282': ['其它区', '230200', 'qi ta qu'],
            '230300': ['鸡西市', '230000', 'ji xi shi'],
            '230302': ['鸡冠区', '230300', 'ji guan qu'],
            '230303': ['恒山区', '230300', 'heng shan qu'],
            '230304': ['滴道区', '230300', 'di dao qu'],
            '230305': ['梨树区', '230300', 'li shu qu'],
            '230306': ['城子河区', '230300', 'cheng zi he qu'],
            '230307': ['麻山区', '230300', 'ma shan qu'],
            '230321': ['鸡东县', '230300', 'ji dong xian'],
            '230381': ['虎林市', '230300', 'hu lin shi'],
            '230382': ['密山市', '230300', 'mi shan shi'],
            '230383': ['其它区', '230300', 'qi ta qu'],
            '230400': ['鹤岗市', '230000', 'he gang shi'],
            '230402': ['向阳区', '230400', 'xiang yang qu'],
            '230403': ['工农区', '230400', 'gong nong qu'],
            '230404': ['南山区', '230400', 'nan shan qu'],
            '230405': ['兴安区', '230400', 'xing an qu'],
            '230406': ['东山区', '230400', 'dong shan qu'],
            '230407': ['兴山区', '230400', 'xing shan qu'],
            '230421': ['萝北县', '230400', 'luo bei xian'],
            '230422': ['绥滨县', '230400', 'sui bin xian'],
            '230423': ['其它区', '230400', 'qi ta qu'],
            '230500': ['双鸭山市', '230000', 'shuang ya shan shi'],
            '230502': ['尖山区', '230500', 'jian shan qu'],
            '230503': ['岭东区', '230500', 'ling dong qu'],
            '230505': ['四方台区', '230500', 'si fang tai qu'],
            '230506': ['宝山区', '230500', 'bao shan qu'],
            '230521': ['集贤县', '230500', 'ji xian xian'],
            '230522': ['友谊县', '230500', 'you yi xian'],
            '230523': ['宝清县', '230500', 'bao qing xian'],
            '230524': ['饶河县', '230500', 'rao he xian'],
            '230525': ['其它区', '230500', 'qi ta qu'],
            '230600': ['大庆市', '230000', 'da qing shi'],
            '230602': ['萨尔图区', '230600', 'sa er tu qu'],
            '230603': ['龙凤区', '230600', 'long feng qu'],
            '230604': ['让胡路区', '230600', 'rang hu lu qu'],
            '230605': ['红岗区', '230600', 'hong gang qu'],
            '230606': ['大同区', '230600', 'da tong qu'],
            '230621': ['肇州县', '230600', 'zhao zhou xian'],
            '230622': ['肇源县', '230600', 'zhao yuan xian'],
            '230623': ['林甸县', '230600', 'lin dian xian'],
            '230624': ['杜尔伯特蒙古族自治县', '230600', 'du er bo te meng gu zu zi zhi xian'],
            '230625': ['其它区', '230600', 'qi ta qu'],
            '230700': ['伊春市', '230000', 'yi chun shi'],
            '230702': ['伊春区', '230700', 'yi chun qu'],
            '230703': ['南岔区', '230700', 'nan cha qu'],
            '230704': ['友好区', '230700', 'you hao qu'],
            '230705': ['西林区', '230700', 'xi lin qu'],
            '230706': ['翠峦区', '230700', 'cui luan qu'],
            '230707': ['新青区', '230700', 'xin qing qu'],
            '230708': ['美溪区', '230700', 'mei xi qu'],
            '230709': ['金山屯区', '230700', 'jin shan tun qu'],
            '230710': ['五营区', '230700', 'wu ying qu'],
            '230711': ['乌马河区', '230700', 'wu ma he qu'],
            '230712': ['汤旺河区', '230700', 'tang wang he qu'],
            '230713': ['带岭区', '230700', 'dai ling qu'],
            '230714': ['乌伊岭区', '230700', 'wu yi ling qu'],
            '230715': ['红星区', '230700', 'hong xing qu'],
            '230716': ['上甘岭区', '230700', 'shang gan ling qu'],
            '230722': ['嘉荫县', '230700', 'jia yin xian'],
            '230781': ['铁力市', '230700', 'tie li shi'],
            '230782': ['其它区', '230700', 'qi ta qu'],
            '230800': ['佳木斯市', '230000', 'jia mu si shi'],
            '230802': ['永红区', '230800', 'yong hong qu'],
            '230803': ['向阳区', '230800', 'xiang yang qu'],
            '230804': ['前进区', '230800', 'qian jin qu'],
            '230805': ['东风区', '230800', 'dong feng qu'],
            '230811': ['郊区', '230800', 'jiao qu'],
            '230822': ['桦南县', '230800', 'hua nan xian'],
            '230826': ['桦川县', '230800', 'hua chuan xian'],
            '230828': ['汤原县', '230800', 'tang yuan xian'],
            '230833': ['抚远县', '230800', 'fu yuan xian'],
            '230881': ['同江市', '230800', 'tong jiang shi'],
            '230882': ['富锦市', '230800', 'fu jin shi'],
            '230883': ['其它区', '230800', 'qi ta qu'],
            '230900': ['七台河市', '230000', 'qi tai he shi'],
            '230902': ['新兴区', '230900', 'xin xing qu'],
            '230903': ['桃山区', '230900', 'tao shan qu'],
            '230904': ['茄子河区', '230900', 'qie zi he qu'],
            '230921': ['勃利县', '230900', 'bo li xian'],
            '230922': ['其它区', '230900', 'qi ta qu'],
            '231000': ['牡丹江市', '230000', 'mu dan jiang shi'],
            '231002': ['东安区', '231000', 'dong an qu'],
            '231003': ['阳明区', '231000', 'yang ming qu'],
            '231004': ['爱民区', '231000', 'ai min qu'],
            '231005': ['西安区', '231000', 'xi an qu'],
            '231024': ['东宁县', '231000', 'dong ning xian'],
            '231025': ['林口县', '231000', 'lin kou xian'],
            '231081': ['绥芬河市', '231000', 'sui fen he shi'],
            '231083': ['海林市', '231000', 'hai lin shi'],
            '231084': ['宁安市', '231000', 'ning an shi'],
            '231085': ['穆棱市', '231000', 'mu ling shi'],
            '231086': ['其它区', '231000', 'qi ta qu'],
            '231100': ['黑河市', '230000', 'hei he shi'],
            '231102': ['爱辉区', '231100', 'ai hui qu'],
            '231121': ['嫩江县', '231100', 'nen jiang xian'],
            '231123': ['逊克县', '231100', 'xun ke xian'],
            '231124': ['孙吴县', '231100', 'sun wu xian'],
            '231181': ['北安市', '231100', 'bei an shi'],
            '231182': ['五大连池市', '231100', 'wu da lian chi shi'],
            '231183': ['其它区', '231100', 'qi ta qu'],
            '231200': ['绥化市', '230000', 'sui hua shi'],
            '231202': ['北林区', '231200', 'bei lin qu'],
            '231221': ['望奎县', '231200', 'wang kui xian'],
            '231222': ['兰西县', '231200', 'lan xi xian'],
            '231223': ['青冈县', '231200', 'qing gang xian'],
            '231224': ['庆安县', '231200', 'qing an xian'],
            '231225': ['明水县', '231200', 'ming shui xian'],
            '231226': ['绥棱县', '231200', 'sui ling xian'],
            '231281': ['安达市', '231200', 'an da shi'],
            '231282': ['肇东市', '231200', 'zhao dong shi'],
            '231283': ['海伦市', '231200', 'hai lun shi'],
            '231284': ['其它区', '231200', 'qi ta qu'],
            '232700': ['大兴安岭地区', '230000', 'da xing an ling di qu'],
            '232721': ['呼玛县', '232700', 'hu ma xian'],
            '232722': ['塔河县', '232700', 'ta he xian'],
            '232723': ['漠河县', '232700', 'mo he xian'],
            '232724': ['加格达奇区', '232700', 'jia ge da qi qu'],
            '232725': ['其它区', '232700', 'qi ta qu'],
            '310000': ['上海', '1', 'shang hai'],
            '310100': ['上海市', '310000', 'shang hai shi'],
            '310101': ['黄浦区', '310100', 'huang pu qu'],
            '310103': ['卢湾区', '310100', 'lu wan qu'],
            '310104': ['徐汇区', '310100', 'xu hui qu'],
            '310105': ['长宁区', '310100', 'chang ning qu'],
            '310106': ['静安区', '310100', 'jing an qu'],
            '310107': ['普陀区', '310100', 'pu tuo qu'],
            '310108': ['闸北区', '310100', 'zha bei qu'],
            '310109': ['虹口区', '310100', 'hong kou qu'],
            '310110': ['杨浦区', '310100', 'yang pu qu'],
            '310112': ['闵行区', '310100', 'min hang qu'],
            '310113': ['宝山区', '310100', 'bao shan qu'],
            '310114': ['嘉定区', '310100', 'jia ding qu'],
            '310115': ['浦东新区', '310100', 'pu dong xin qu'],
            '310116': ['金山区', '310100', 'jin shan qu'],
            '310117': ['松江区', '310100', 'song jiang qu'],
            '310118': ['青浦区', '310100', 'qing pu qu'],
            '310119': ['南汇区', '310100', 'nan hui qu'],
            '310120': ['奉贤区', '310100', 'feng xian qu'],
            '310152': ['川沙区', '310100', 'chuan sha qu'],
            '310230': ['崇明县', '310100', 'chong ming xian'],
            '310231': ['其它区', '310100', 'qi ta qu'],
            '320000': ['江苏省', '1', 'jiang su sheng'],
            '320100': ['南京市', '320000', 'nan jing shi'],
            '320102': ['玄武区', '320100', 'xuan wu qu'],
            '320103': ['白下区', '320100', 'bai xia qu'],
            '320104': ['秦淮区', '320100', 'qin huai qu'],
            '320105': ['建邺区', '320100', 'jian ye qu'],
            '320106': ['鼓楼区', '320100', 'gu lou qu'],
            '320107': ['下关区', '320100', 'xia guan qu'],
            '320111': ['浦口区', '320100', 'pu kou qu'],
            '320113': ['栖霞区', '320100', 'qi xia qu'],
            '320114': ['雨花台区', '320100', 'yu hua tai qu'],
            '320115': ['江宁区', '320100', 'jiang ning qu'],
            '320116': ['六合区', '320100', 'liu he qu'],
            '320124': ['溧水县', '320100', 'li shui xian'],
            '320125': ['高淳县', '320100', 'gao chun xian'],
            '320126': ['其它区', '320100', 'qi ta qu'],
            '320200': ['无锡市', '320000', 'wu xi shi'],
            '320202': ['崇安区', '320200', 'chong an qu'],
            '320203': ['南长区', '320200', 'nan chang qu'],
            '320204': ['北塘区', '320200', 'bei tang qu'],
            '320205': ['锡山区', '320200', 'xi shan qu'],
            '320206': ['惠山区', '320200', 'hui shan qu'],
            '320211': ['滨湖区', '320200', 'bin hu qu'],
            '320281': ['江阴市', '320200', 'jiang yin shi'],
            '320282': ['宜兴市', '320200', 'yi xing shi'],
            '320296': ['新区', '320200', 'xin qu'],
            '320297': ['其它区', '320200', 'qi ta qu'],
            '320300': ['徐州市', '320000', 'xu zhou shi'],
            '320302': ['鼓楼区', '320300', 'gu lou qu'],
            '320303': ['云龙区', '320300', 'yun long qu'],
            '320304': ['九里区', '320300', 'jiu li qu'],
            '320305': ['贾汪区', '320300', 'jia wang qu'],
            '320311': ['泉山区', '320300', 'quan shan qu'],
            '320321': ['丰县', '320300', 'feng xian'],
            '320322': ['沛县', '320300', 'pei xian'],
            '320323': ['铜山县', '320300', 'tong shan xian'],
            '320324': ['睢宁县', '320300', 'sui ning xian'],
            '320381': ['新沂市', '320300', 'xin yi shi'],
            '320382': ['邳州市', '320300', 'pi zhou shi'],
            '320383': ['其它区', '320300', 'qi ta qu'],
            '320400': ['常州市', '320000', 'chang zhou shi'],
            '320402': ['天宁区', '320400', 'tian ning qu'],
            '320404': ['钟楼区', '320400', 'zhong lou qu'],
            '320405': ['戚墅堰区', '320400', 'qi shu yan qu'],
            '320411': ['新北区', '320400', 'xin bei qu'],
            '320412': ['武进区', '320400', 'wu jin qu'],
            '320481': ['溧阳市', '320400', 'li yang shi'],
            '320482': ['金坛市', '320400', 'jin tan shi'],
            '320483': ['其它区', '320400', 'qi ta qu'],
            '320500': ['苏州市', '320000', 'su zhou shi'],
            '320502': ['沧浪区', '320500', 'cang lang qu'],
            '320503': ['平江区', '320500', 'ping jiang qu'],
            '320504': ['金阊区', '320500', 'jin chang qu'],
            '320505': ['虎丘区', '320500', 'hu qiu qu'],
            '320506': ['吴中区', '320500', 'wu zhong qu'],
            '320507': ['相城区', '320500', 'xiang cheng qu'],
            '320581': ['常熟市', '320500', 'chang shu shi'],
            '320582': ['张家港市', '320500', 'zhang jia gang shi'],
            '320583': ['昆山市', '320500', 'kun shan shi'],
            '320584': ['吴江市', '320500', 'wu jiang shi'],
            '320585': ['太仓市', '320500', 'tai cang shi'],
            '320594': ['新区', '320500', 'xin qu'],
            '320595': ['园区', '320500', 'yuan qu'],
            '320596': ['其它区', '320500', 'qi ta qu'],
            '320600': ['南通市', '320000', 'nan tong shi'],
            '320602': ['崇川区', '320600', 'chong chuan qu'],
            '320611': ['港闸区', '320600', 'gang zha qu'],
            '320612': ['通州区', '320600', 'tong zhou qu'],
            '320621': ['海安县', '320600', 'hai an xian'],
            '320623': ['如东县', '320600', 'ru dong xian'],
            '320681': ['启东市', '320600', 'qi dong shi'],
            '320682': ['如皋市', '320600', 'ru gao shi'],
            '320683': ['通州市', '320600', 'tong zhou shi'],
            '320684': ['海门市', '320600', 'hai men shi'],
            '320693': ['开发区', '320600', 'kai fa qu'],
            '320694': ['其它区', '320600', 'qi ta qu'],
            '320700': ['连云港市', '320000', 'lian yun gang shi'],
            '320703': ['连云区', '320700', 'lian yun qu'],
            '320705': ['新浦区', '320700', 'xin pu qu'],
            '320706': ['海州区', '320700', 'hai zhou qu'],
            '320721': ['赣榆县', '320700', 'gan yu xian'],
            '320722': ['东海县', '320700', 'dong hai xian'],
            '320723': ['灌云县', '320700', 'guan yun xian'],
            '320724': ['灌南县', '320700', 'guan nan xian'],
            '320725': ['其它区', '320700', 'qi ta qu'],
            '320800': ['淮安市', '320000', 'huai an shi'],
            '320802': ['清河区', '320800', 'qing he qu'],
            '320803': ['楚州区', '320800', 'chu zhou qu'],
            '320804': ['淮阴区', '320800', 'huai yin qu'],
            '320811': ['清浦区', '320800', 'qing pu qu'],
            '320826': ['涟水县', '320800', 'lian shui xian'],
            '320829': ['洪泽县', '320800', 'hong ze xian'],
            '320830': ['盱眙县', '320800', 'xu yi xian'],
            '320831': ['金湖县', '320800', 'jin hu xian'],
            '320832': ['其它区', '320800', 'qi ta qu'],
            '320900': ['盐城市', '320000', 'yan cheng shi'],
            '320902': ['亭湖区', '320900', 'ting hu qu'],
            '320903': ['盐都区', '320900', 'yan du qu'],
            '320921': ['响水县', '320900', 'xiang shui xian'],
            '320922': ['滨海县', '320900', 'bin hai xian'],
            '320923': ['阜宁县', '320900', 'fu ning xian'],
            '320924': ['射阳县', '320900', 'she yang xian'],
            '320925': ['建湖县', '320900', 'jian hu xian'],
            '320981': ['东台市', '320900', 'dong tai shi'],
            '320982': ['大丰市', '320900', 'da feng shi'],
            '320983': ['其它区', '320900', 'qi ta qu'],
            '321000': ['扬州市', '320000', 'yang zhou shi'],
            '321002': ['广陵区', '321000', 'guang ling qu'],
            '321003': ['邗江区', '321000', 'han jiang qu'],
            '321011': ['维扬区', '321000', 'wei yang qu'],
            '321023': ['宝应县', '321000', 'bao ying xian'],
            '321081': ['仪征市', '321000', 'yi zheng shi'],
            '321084': ['高邮市', '321000', 'gao you shi'],
            '321088': ['江都市', '321000', 'jiang du shi'],
            '321092': ['经济开发区', '321000', 'jing ji kai fa qu'],
            '321093': ['其它区', '321000', 'qi ta qu'],
            '321100': ['镇江市', '320000', 'zhen jiang shi'],
            '321102': ['京口区', '321100', 'jing kou qu'],
            '321111': ['润州区', '321100', 'run zhou qu'],
            '321112': ['丹徒区', '321100', 'dan tu qu'],
            '321181': ['丹阳市', '321100', 'dan yang shi'],
            '321182': ['扬中市', '321100', 'yang zhong shi'],
            '321183': ['句容市', '321100', 'ju rong shi'],
            '321184': ['其它区', '321100', 'qi ta qu'],
            '321200': ['泰州市', '320000', 'tai zhou shi'],
            '321202': ['海陵区', '321200', 'hai ling qu'],
            '321203': ['高港区', '321200', 'gao gang qu'],
            '321281': ['兴化市', '321200', 'xing hua shi'],
            '321282': ['靖江市', '321200', 'jing jiang shi'],
            '321283': ['泰兴市', '321200', 'tai xing shi'],
            '321284': ['姜堰市', '321200', 'jiang yan shi'],
            '321285': ['其它区', '321200', 'qi ta qu'],
            '321300': ['宿迁市', '320000', 'su qian shi'],
            '321302': ['宿城区', '321300', 'su cheng qu'],
            '321311': ['宿豫区', '321300', 'su yu qu'],
            '321322': ['沭阳县', '321300', 'shu yang xian'],
            '321323': ['泗阳县', '321300', 'si yang xian'],
            '321324': ['泗洪县', '321300', 'si hong xian'],
            '321325': ['其它区', '321300', 'qi ta qu'],
            '330000': ['浙江省', '1', 'zhe jiang sheng'],
            '330100': ['杭州市', '330000', 'hang zhou shi'],
            '330102': ['上城区', '330100', 'shang cheng qu'],
            '330103': ['下城区', '330100', 'xia cheng qu'],
            '330104': ['江干区', '330100', 'jiang gan qu'],
            '330105': ['拱墅区', '330100', 'gong shu qu'],
            '330106': ['西湖区', '330100', 'xi hu qu'],
            '330108': ['滨江区', '330100', 'bin jiang qu'],
            '330109': ['萧山区', '330100', 'xiao shan qu'],
            '330110': ['余杭区', '330100', 'yu hang qu'],
            '330122': ['桐庐县', '330100', 'tong lu xian'],
            '330127': ['淳安县', '330100', 'chun an xian'],
            '330182': ['建德市', '330100', 'jian de shi'],
            '330183': ['富阳市', '330100', 'fu yang shi'],
            '330185': ['临安市', '330100', 'lin an shi'],
            '330186': ['其它区', '330100', 'qi ta qu'],
            '330200': ['宁波市', '330000', 'ning bo shi'],
            '330203': ['海曙区', '330200', 'hai shu qu'],
            '330204': ['江东区', '330200', 'jiang dong qu'],
            '330205': ['江北区', '330200', 'jiang bei qu'],
            '330206': ['北仑区', '330200', 'bei lun qu'],
            '330211': ['镇海区', '330200', 'zhen hai qu'],
            '330212': ['鄞州区', '330200', 'yin zhou qu'],
            '330225': ['象山县', '330200', 'xiang shan xian'],
            '330226': ['宁海县', '330200', 'ning hai xian'],
            '330281': ['余姚市', '330200', 'yu yao shi'],
            '330282': ['慈溪市', '330200', 'ci xi shi'],
            '330283': ['奉化市', '330200', 'feng hua shi'],
            '330284': ['其它区', '330200', 'qi ta qu'],
            '330300': ['温州市', '330000', 'wen zhou shi'],
            '330302': ['鹿城区', '330300', 'lu cheng qu'],
            '330303': ['龙湾区', '330300', 'long wan qu'],
            '330304': ['瓯海区', '330300', 'ou hai qu'],
            '330322': ['洞头县', '330300', 'dong tou xian'],
            '330324': ['永嘉县', '330300', 'yong jia xian'],
            '330326': ['平阳县', '330300', 'ping yang xian'],
            '330327': ['苍南县', '330300', 'cang nan xian'],
            '330328': ['文成县', '330300', 'wen cheng xian'],
            '330329': ['泰顺县', '330300', 'tai shun xian'],
            '330381': ['瑞安市', '330300', 'rui an shi'],
            '330382': ['乐清市', '330300', 'yue qing shi'],
            '330383': ['其它区', '330300', 'qi ta qu'],
            '330400': ['嘉兴市', '330000', 'jia xing shi'],
            '330402': ['南湖区', '330400', 'nan hu qu'],
            '330411': ['秀洲区', '330400', 'xiu zhou qu'],
            '330421': ['嘉善县', '330400', 'jia shan xian'],
            '330424': ['海盐县', '330400', 'hai yan xian'],
            '330481': ['海宁市', '330400', 'hai ning shi'],
            '330482': ['平湖市', '330400', 'ping hu shi'],
            '330483': ['桐乡市', '330400', 'tong xiang shi'],
            '330484': ['其它区', '330400', 'qi ta qu'],
            '330500': ['湖州市', '330000', 'hu zhou shi'],
            '330502': ['吴兴区', '330500', 'wu xing qu'],
            '330503': ['南浔区', '330500', 'nan xun qu'],
            '330521': ['德清县', '330500', 'de qing xian'],
            '330522': ['长兴县', '330500', 'chang xing xian'],
            '330523': ['安吉县', '330500', 'an ji xian'],
            '330524': ['其它区', '330500', 'qi ta qu'],
            '330600': ['绍兴市', '330000', 'shao xing shi'],
            '330602': ['越城区', '330600', 'yue cheng qu'],
            '330621': ['绍兴县', '330600', 'shao xing xian'],
            '330624': ['新昌县', '330600', 'xin chang xian'],
            '330681': ['诸暨市', '330600', 'zhu ji shi'],
            '330682': ['上虞市', '330600', 'shang yu shi'],
            '330683': ['嵊州市', '330600', 'sheng zhou shi'],
            '330684': ['其它区', '330600', 'qi ta qu'],
            '330700': ['金华市', '330000', 'jin hua shi'],
            '330702': ['婺城区', '330700', 'wu cheng qu'],
            '330703': ['金东区', '330700', 'jin dong qu'],
            '330723': ['武义县', '330700', 'wu yi xian'],
            '330726': ['浦江县', '330700', 'pu jiang xian'],
            '330727': ['磐安县', '330700', 'pan an xian'],
            '330781': ['兰溪市', '330700', 'lan xi shi'],
            '330782': ['义乌市', '330700', 'yi wu shi'],
            '330783': ['东阳市', '330700', 'dong yang shi'],
            '330784': ['永康市', '330700', 'yong kang shi'],
            '330785': ['其它区', '330700', 'qi ta qu'],
            '330800': ['衢州市', '330000', 'qu zhou shi'],
            '330802': ['柯城区', '330800', 'ke cheng qu'],
            '330803': ['衢江区', '330800', 'qu jiang qu'],
            '330822': ['常山县', '330800', 'chang shan xian'],
            '330824': ['开化县', '330800', 'kai hua xian'],
            '330825': ['龙游县', '330800', 'long you xian'],
            '330881': ['江山市', '330800', 'jiang shan shi'],
            '330882': ['其它区', '330800', 'qi ta qu'],
            '330900': ['舟山市', '330000', 'zhou shan shi'],
            '330902': ['定海区', '330900', 'ding hai qu'],
            '330903': ['普陀区', '330900', 'pu tuo qu'],
            '330921': ['岱山县', '330900', 'dai shan xian'],
            '330922': ['嵊泗县', '330900', 'sheng si xian'],
            '330923': ['其它区', '330900', 'qi ta qu'],
            '331000': ['台州市', '330000', 'tai zhou shi'],
            '331002': ['椒江区', '331000', 'jiao jiang qu'],
            '331003': ['黄岩区', '331000', 'huang yan qu'],
            '331004': ['路桥区', '331000', 'lu qiao qu'],
            '331021': ['玉环县', '331000', 'yu huan xian'],
            '331022': ['三门县', '331000', 'san men xian'],
            '331023': ['天台县', '331000', 'tian tai xian'],
            '331024': ['仙居县', '331000', 'xian ju xian'],
            '331081': ['温岭市', '331000', 'wen ling shi'],
            '331082': ['临海市', '331000', 'lin hai shi'],
            '331083': ['其它区', '331000', 'qi ta qu'],
            '331100': ['丽水市', '330000', 'li shui shi'],
            '331102': ['莲都区', '331100', 'lian du qu'],
            '331121': ['青田县', '331100', 'qing tian xian'],
            '331122': ['缙云县', '331100', 'jin yun xian'],
            '331123': ['遂昌县', '331100', 'sui chang xian'],
            '331124': ['松阳县', '331100', 'song yang xian'],
            '331125': ['云和县', '331100', 'yun he xian'],
            '331126': ['庆元县', '331100', 'qing yuan xian'],
            '331127': ['景宁畲族自治县', '331100', 'jing ning she zu zi zhi xian'],
            '331181': ['龙泉市', '331100', 'long quan shi'],
            '331182': ['其它区', '331100', 'qi ta qu'],
            '340000': ['安徽省', '1', 'an hui sheng'],
            '340100': ['合肥市', '340000', 'he fei shi'],
            '340102': ['瑶海区', '340100', 'yao hai qu'],
            '340103': ['庐阳区', '340100', 'lu yang qu'],
            '340104': ['蜀山区', '340100', 'shu shan qu'],
            '340111': ['包河区', '340100', 'bao he qu'],
            '340121': ['长丰县', '340100', 'chang feng xian'],
            '340122': ['肥东县', '340100', 'fei dong xian'],
            '340123': ['肥西县', '340100', 'fei xi xian'],
            '340151': ['高新区', '340100', 'gao xin qu'],
            '340191': ['中区', '340100', 'zhong qu'],
            '340192': ['其它区', '340100', 'qi ta qu'],
            '340200': ['芜湖市', '340000', 'wu hu shi'],
            '340202': ['镜湖区', '340200', 'jing hu qu'],
            '340203': ['弋江区', '340200', 'yi jiang qu'],
            '340207': ['鸠江区', '340200', 'jiu jiang qu'],
            '340208': ['三山区', '340200', 'san shan qu'],
            '340221': ['芜湖县', '340200', 'wu hu xian'],
            '340222': ['繁昌县', '340200', 'fan chang xian'],
            '340223': ['南陵县', '340200', 'nan ling xian'],
            '340224': ['其它区', '340200', 'qi ta qu'],
            '340300': ['蚌埠市', '340000', 'beng bu shi'],
            '340302': ['龙子湖区', '340300', 'long zi hu qu'],
            '340303': ['蚌山区', '340300', 'beng shan qu'],
            '340304': ['禹会区', '340300', 'yu hui qu'],
            '340311': ['淮上区', '340300', 'huai shang qu'],
            '340321': ['怀远县', '340300', 'huai yuan xian'],
            '340322': ['五河县', '340300', 'wu he xian'],
            '340323': ['固镇县', '340300', 'gu zhen xian'],
            '340324': ['其它区', '340300', 'qi ta qu'],
            '340400': ['淮南市', '340000', 'huai nan shi'],
            '340402': ['大通区', '340400', 'da tong qu'],
            '340403': ['田家庵区', '340400', 'tian jia an qu'],
            '340404': ['谢家集区', '340400', 'xie jia ji qu'],
            '340405': ['八公山区', '340400', 'ba gong shan qu'],
            '340406': ['潘集区', '340400', 'pan ji qu'],
            '340421': ['凤台县', '340400', 'feng tai xian'],
            '340422': ['其它区', '340400', 'qi ta qu'],
            '340500': ['马鞍山市', '340000', 'ma an shan shi'],
            '340502': ['金家庄区', '340500', 'jin jia zhuang qu'],
            '340503': ['花山区', '340500', 'hua shan qu'],
            '340504': ['雨山区', '340500', 'yu shan qu'],
            '340521': ['当涂县', '340500', 'dang tu xian'],
            '340522': ['其它区', '340500', 'qi ta qu'],
            '340600': ['淮北市', '340000', 'huai bei shi'],
            '340602': ['杜集区', '340600', 'du ji qu'],
            '340603': ['相山区', '340600', 'xiang shan qu'],
            '340604': ['烈山区', '340600', 'lie shan qu'],
            '340621': ['濉溪县', '340600', 'sui xi xian'],
            '340622': ['其它区', '340600', 'qi ta qu'],
            '340700': ['铜陵市', '340000', 'tong ling shi'],
            '340702': ['铜官山区', '340700', 'tong guan shan qu'],
            '340703': ['狮子山区', '340700', 'shi zi shan qu'],
            '340711': ['郊区', '340700', 'jiao qu'],
            '340721': ['铜陵县', '340700', 'tong ling xian'],
            '340722': ['其它区', '340700', 'qi ta qu'],
            '340800': ['安庆市', '340000', 'an qing shi'],
            '340802': ['迎江区', '340800', 'ying jiang qu'],
            '340803': ['大观区', '340800', 'da guan qu'],
            '340811': ['宜秀区', '340800', 'yi xiu qu'],
            '340822': ['怀宁县', '340800', 'huai ning xian'],
            '340823': ['枞阳县', '340800', 'zong yang xian'],
            '340824': ['潜山县', '340800', 'qian shan xian'],
            '340825': ['太湖县', '340800', 'tai hu xian'],
            '340826': ['宿松县', '340800', 'su song xian'],
            '340827': ['望江县', '340800', 'wang jiang xian'],
            '340828': ['岳西县', '340800', 'yue xi xian'],
            '340881': ['桐城市', '340800', 'tong cheng shi'],
            '340882': ['其它区', '340800', 'qi ta qu'],
            '341000': ['黄山市', '340000', 'huang shan shi'],
            '341002': ['屯溪区', '341000', 'tun xi qu'],
            '341003': ['黄山区', '341000', 'huang shan qu'],
            '341004': ['徽州区', '341000', 'hui zhou qu'],
            '341021': ['歙县', '341000', 'she xian'],
            '341022': ['休宁县', '341000', 'xiu ning xian'],
            '341023': ['黟县', '341000', 'yi xian'],
            '341024': ['祁门县', '341000', 'qi men xian'],
            '341025': ['其它区', '341000', 'qi ta qu'],
            '341100': ['滁州市', '340000', 'chu zhou shi'],
            '341102': ['琅琊区', '341100', 'lang ya qu'],
            '341103': ['南谯区', '341100', 'nan qiao qu'],
            '341122': ['来安县', '341100', 'lai an xian'],
            '341124': ['全椒县', '341100', 'quan jiao xian'],
            '341125': ['定远县', '341100', 'ding yuan xian'],
            '341126': ['凤阳县', '341100', 'feng yang xian'],
            '341181': ['天长市', '341100', 'tian chang shi'],
            '341182': ['明光市', '341100', 'ming guang shi'],
            '341183': ['其它区', '341100', 'qi ta qu'],
            '341200': ['阜阳市', '340000', 'fu yang shi'],
            '341202': ['颍州区', '341200', 'ying zhou qu'],
            '341203': ['颍东区', '341200', 'ying dong qu'],
            '341204': ['颍泉区', '341200', 'ying quan qu'],
            '341221': ['临泉县', '341200', 'lin quan xian'],
            '341222': ['太和县', '341200', 'tai he xian'],
            '341225': ['阜南县', '341200', 'fu nan xian'],
            '341226': ['颍上县', '341200', 'ying shang xian'],
            '341282': ['界首市', '341200', 'jie shou shi'],
            '341283': ['其它区', '341200', 'qi ta qu'],
            '341300': ['宿州市', '340000', 'su zhou shi'],
            '341302': ['埇桥区', '341300', 'yong qiao qu'],
            '341321': ['砀山县', '341300', 'dang shan xian'],
            '341322': ['萧县', '341300', 'xiao xian'],
            '341323': ['灵璧县', '341300', 'ling bi xian'],
            '341324': ['泗县', '341300', 'si xian'],
            '341325': ['其它区', '341300', 'qi ta qu'],
            '341400': ['巢湖市', '340100', 'chao hu shi'],
            '341402': ['居巢区', '340100', 'ju chao qu'],
            '341421': ['庐江县', '340100', 'lu jiang xian'],
            '341422': ['无为县', '340200', 'wu wei xian'],
            '341423': ['含山县', '340500', 'han shan xian'],
            '341424': ['和县', '340500', 'he xian'],
            '341500': ['六安市', '340000', 'lu an shi'],
            '341502': ['金安区', '341500', 'jin an qu'],
            '341503': ['裕安区', '341500', 'yu an qu'],
            '341521': ['寿县', '341500', 'shou xian'],
            '341522': ['霍邱县', '341500', 'huo qiu xian'],
            '341523': ['舒城县', '341500', 'shu cheng xian'],
            '341524': ['金寨县', '341500', 'jin zhai xian'],
            '341525': ['霍山县', '341500', 'huo shan xian'],
            '341526': ['其它区', '341500', 'qi ta qu'],
            '341600': ['亳州市', '340000', 'bo zhou shi'],
            '341602': ['谯城区', '341600', 'qiao cheng qu'],
            '341621': ['涡阳县', '341600', 'guo yang xian'],
            '341622': ['蒙城县', '341600', 'meng cheng xian'],
            '341623': ['利辛县', '341600', 'li xin xian'],
            '341624': ['其它区', '341600', 'qi ta qu'],
            '341700': ['池州市', '340000', 'chi zhou shi'],
            '341702': ['贵池区', '341700', 'gui chi qu'],
            '341721': ['东至县', '341700', 'dong zhi xian'],
            '341722': ['石台县', '341700', 'shi tai xian'],
            '341723': ['青阳县', '341700', 'qing yang xian'],
            '341724': ['其它区', '341700', 'qi ta qu'],
            '341800': ['宣城市', '340000', 'xuan cheng shi'],
            '341802': ['宣州区', '341800', 'xuan zhou qu'],
            '341821': ['郎溪县', '341800', 'lang xi xian'],
            '341822': ['广德县', '341800', 'guang de xian'],
            '341823': ['泾县', '341800', 'jing xian'],
            '341824': ['绩溪县', '341800', 'ji xi xian'],
            '341825': ['旌德县', '341800', 'jing de xian'],
            '341881': ['宁国市', '341800', 'ning guo shi'],
            '341882': ['其它区', '341800', 'qi ta qu'],
            '350000': ['福建省', '1', 'fu jian sheng'],
            '350100': ['福州市', '350000', 'fu zhou shi'],
            '350102': ['鼓楼区', '350100', 'gu lou qu'],
            '350103': ['台江区', '350100', 'tai jiang qu'],
            '350104': ['仓山区', '350100', 'cang shan qu'],
            '350105': ['马尾区', '350100', 'ma wei qu'],
            '350111': ['晋安区', '350100', 'jin an qu'],
            '350121': ['闽侯县', '350100', 'min hou xian'],
            '350122': ['连江县', '350100', 'lian jiang xian'],
            '350123': ['罗源县', '350100', 'luo yuan xian'],
            '350124': ['闽清县', '350100', 'min qing xian'],
            '350125': ['永泰县', '350100', 'yong tai xian'],
            '350128': ['平潭县', '350100', 'ping tan xian'],
            '350181': ['福清市', '350100', 'fu qing shi'],
            '350182': ['长乐市', '350100', 'chang le shi'],
            '350183': ['其它区', '350100', 'qi ta qu'],
            '350200': ['厦门市', '350000', 'xia men shi'],
            '350203': ['思明区', '350200', 'si ming qu'],
            '350205': ['海沧区', '350200', 'hai cang qu'],
            '350206': ['湖里区', '350200', 'hu li qu'],
            '350211': ['集美区', '350200', 'ji mei qu'],
            '350212': ['同安区', '350200', 'tong an qu'],
            '350213': ['翔安区', '350200', 'xiang an qu'],
            '350214': ['其它区', '350200', 'qi ta qu'],
            '350300': ['莆田市', '350000', 'pu tian shi'],
            '350302': ['城厢区', '350300', 'cheng xiang qu'],
            '350303': ['涵江区', '350300', 'han jiang qu'],
            '350304': ['荔城区', '350300', 'li cheng qu'],
            '350305': ['秀屿区', '350300', 'xiu yu qu'],
            '350322': ['仙游县', '350300', 'xian you xian'],
            '350323': ['其它区', '350300', 'qi ta qu'],
            '350400': ['三明市', '350000', 'san ming shi'],
            '350402': ['梅列区', '350400', 'mei lie qu'],
            '350403': ['三元区', '350400', 'san yuan qu'],
            '350421': ['明溪县', '350400', 'ming xi xian'],
            '350423': ['清流县', '350400', 'qing liu xian'],
            '350424': ['宁化县', '350400', 'ning hua xian'],
            '350425': ['大田县', '350400', 'da tian xian'],
            '350426': ['尤溪县', '350400', 'you xi xian'],
            '350427': ['沙县', '350400', 'sha xian'],
            '350428': ['将乐县', '350400', 'jiang le xian'],
            '350429': ['泰宁县', '350400', 'tai ning xian'],
            '350430': ['建宁县', '350400', 'jian ning xian'],
            '350481': ['永安市', '350400', 'yong an shi'],
            '350482': ['其它区', '350400', 'qi ta qu'],
            '350500': ['泉州市', '350000', 'quan zhou shi'],
            '350502': ['鲤城区', '350500', 'li cheng qu'],
            '350503': ['丰泽区', '350500', 'feng ze qu'],
            '350504': ['洛江区', '350500', 'luo jiang qu'],
            '350505': ['泉港区', '350500', 'quan gang qu'],
            '350521': ['惠安县', '350500', 'hui an xian'],
            '350524': ['安溪县', '350500', 'an xi xian'],
            '350525': ['永春县', '350500', 'yong chun xian'],
            '350526': ['德化县', '350500', 'de hua xian'],
            '350527': ['金门县', '350500', 'jin men xian'],
            '350581': ['石狮市', '350500', 'shi shi shi'],
            '350582': ['晋江市', '350500', 'jin jiang shi'],
            '350583': ['南安市', '350500', 'nan an shi'],
            '350584': ['其它区', '350500', 'qi ta qu'],
            '350600': ['漳州市', '350000', 'zhang zhou shi'],
            '350602': ['芗城区', '350600', 'xiang cheng qu'],
            '350603': ['龙文区', '350600', 'long wen qu'],
            '350622': ['云霄县', '350600', 'yun xiao xian'],
            '350623': ['漳浦县', '350600', 'zhang pu xian'],
            '350624': ['诏安县', '350600', 'zhao an xian'],
            '350625': ['长泰县', '350600', 'chang tai xian'],
            '350626': ['东山县', '350600', 'dong shan xian'],
            '350627': ['南靖县', '350600', 'nan jing xian'],
            '350628': ['平和县', '350600', 'ping he xian'],
            '350629': ['华安县', '350600', 'hua an xian'],
            '350681': ['龙海市', '350600', 'long hai shi'],
            '350682': ['其它区', '350600', 'qi ta qu'],
            '350700': ['南平市', '350000', 'nan ping shi'],
            '350702': ['延平区', '350700', 'yan ping qu'],
            '350721': ['顺昌县', '350700', 'shun chang xian'],
            '350722': ['浦城县', '350700', 'pu cheng xian'],
            '350723': ['光泽县', '350700', 'guang ze xian'],
            '350724': ['松溪县', '350700', 'song xi xian'],
            '350725': ['政和县', '350700', 'zheng he xian'],
            '350781': ['邵武市', '350700', 'shao wu shi'],
            '350782': ['武夷山市', '350700', 'wu yi shan shi'],
            '350783': ['建瓯市', '350700', 'jian ou shi'],
            '350784': ['建阳市', '350700', 'jian yang shi'],
            '350785': ['其它区', '350700', 'qi ta qu'],
            '350800': ['龙岩市', '350000', 'long yan shi'],
            '350802': ['新罗区', '350800', 'xin luo qu'],
            '350821': ['长汀县', '350800', 'chang ting xian'],
            '350822': ['永定县', '350800', 'yong ding xian'],
            '350823': ['上杭县', '350800', 'shang hang xian'],
            '350824': ['武平县', '350800', 'wu ping xian'],
            '350825': ['连城县', '350800', 'lian cheng xian'],
            '350881': ['漳平市', '350800', 'zhang ping shi'],
            '350882': ['其它区', '350800', 'qi ta qu'],
            '350900': ['宁德市', '350000', 'ning de shi'],
            '350902': ['蕉城区', '350900', 'jiao cheng qu'],
            '350921': ['霞浦县', '350900', 'xia pu xian'],
            '350922': ['古田县', '350900', 'gu tian xian'],
            '350923': ['屏南县', '350900', 'ping nan xian'],
            '350924': ['寿宁县', '350900', 'shou ning xian'],
            '350925': ['周宁县', '350900', 'zhou ning xian'],
            '350926': ['柘荣县', '350900', 'zhe rong xian'],
            '350981': ['福安市', '350900', 'fu an shi'],
            '350982': ['福鼎市', '350900', 'fu ding shi'],
            '350983': ['其它区', '350900', 'qi ta qu'],
            '360000': ['江西省', '1', 'jiang xi sheng'],
            '360100': ['南昌市', '360000', 'nan chang shi'],
            '360102': ['东湖区', '360100', 'dong hu qu'],
            '360103': ['西湖区', '360100', 'xi hu qu'],
            '360104': ['青云谱区', '360100', 'qing yun pu qu'],
            '360105': ['湾里区', '360100', 'wan li qu'],
            '360111': ['青山湖区', '360100', 'qing shan hu qu'],
            '360121': ['南昌县', '360100', 'nan chang xian'],
            '360122': ['新建县', '360100', 'xin jian xian'],
            '360123': ['安义县', '360100', 'an yi xian'],
            '360124': ['进贤县', '360100', 'jin xian xian'],
            '360125': ['红谷滩新区', '360100', 'hong gu tan xin qu'],
            '360126': ['经济技术开发区', '360100', 'jing ji ji shu kai fa qu'],
            '360127': ['昌北区', '360100', 'chang bei qu'],
            '360128': ['其它区', '360100', 'qi ta qu'],
            '360200': ['景德镇市', '360000', 'jing de zhen shi'],
            '360202': ['昌江区', '360200', 'chang jiang qu'],
            '360203': ['珠山区', '360200', 'zhu shan qu'],
            '360222': ['浮梁县', '360200', 'fu liang xian'],
            '360281': ['乐平市', '360200', 'le ping shi'],
            '360282': ['其它区', '360200', 'qi ta qu'],
            '360300': ['萍乡市', '360000', 'ping xiang shi'],
            '360302': ['安源区', '360300', 'an yuan qu'],
            '360313': ['湘东区', '360300', 'xiang dong qu'],
            '360321': ['莲花县', '360300', 'lian hua xian'],
            '360322': ['上栗县', '360300', 'shang li xian'],
            '360323': ['芦溪县', '360300', 'lu xi xian'],
            '360324': ['其它区', '360300', 'qi ta qu'],
            '360400': ['九江市', '360000', 'jiu jiang shi'],
            '360402': ['庐山区', '360400', 'lu shan qu'],
            '360403': ['浔阳区', '360400', 'xun yang qu'],
            '360421': ['九江县', '360400', 'jiu jiang xian'],
            '360423': ['武宁县', '360400', 'wu ning xian'],
            '360424': ['修水县', '360400', 'xiu shui xian'],
            '360425': ['永修县', '360400', 'yong xiu xian'],
            '360426': ['德安县', '360400', 'de an xian'],
            '360427': ['星子县', '360400', 'xing zi xian'],
            '360428': ['都昌县', '360400', 'du chang xian'],
            '360429': ['湖口县', '360400', 'hu kou xian'],
            '360430': ['彭泽县', '360400', 'peng ze xian'],
            '360481': ['瑞昌市', '360400', 'rui chang shi'],
            '360482': ['其它区', '360400', 'qi ta qu'],
            '360500': ['新余市', '360000', 'xin yu shi'],
            '360502': ['渝水区', '360500', 'yu shui qu'],
            '360521': ['分宜县', '360500', 'fen yi xian'],
            '360522': ['其它区', '360500', 'qi ta qu'],
            '360600': ['鹰潭市', '360000', 'ying tan shi'],
            '360602': ['月湖区', '360600', 'yue hu qu'],
            '360622': ['余江县', '360600', 'yu jiang xian'],
            '360681': ['贵溪市', '360600', 'gui xi shi'],
            '360682': ['其它区', '360600', 'qi ta qu'],
            '360700': ['赣州市', '360000', 'gan zhou shi'],
            '360702': ['章贡区', '360700', 'zhang gong qu'],
            '360721': ['赣县', '360700', 'gan xian'],
            '360722': ['信丰县', '360700', 'shen feng xian'],
            '360723': ['大余县', '360700', 'da yu xian'],
            '360724': ['上犹县', '360700', 'shang you xian'],
            '360725': ['崇义县', '360700', 'chong yi xian'],
            '360726': ['安远县', '360700', 'an yuan xian'],
            '360727': ['龙南县', '360700', 'long nan xian'],
            '360728': ['定南县', '360700', 'ding nan xian'],
            '360729': ['全南县', '360700', 'quan nan xian'],
            '360730': ['宁都县', '360700', 'ning du xian'],
            '360731': ['于都县', '360700', 'yu du xian'],
            '360732': ['兴国县', '360700', 'xing guo xian'],
            '360733': ['会昌县', '360700', 'hui chang xian'],
            '360734': ['寻乌县', '360700', 'xun wu xian'],
            '360735': ['石城县', '360700', 'shi cheng xian'],
            '360751': ['黄金区', '360700', 'huang jin qu'],
            '360781': ['瑞金市', '360700', 'rui jin shi'],
            '360782': ['南康市', '360700', 'nan kang shi'],
            '360783': ['其它区', '360700', 'qi ta qu'],
            '360800': ['吉安市', '360000', 'ji an shi'],
            '360802': ['吉州区', '360800', 'ji zhou qu'],
            '360803': ['青原区', '360800', 'qing yuan qu'],
            '360821': ['吉安县', '360800', 'ji an xian'],
            '360822': ['吉水县', '360800', 'ji shui xian'],
            '360823': ['峡江县', '360800', 'xia jiang xian'],
            '360824': ['新干县', '360800', 'xin gan xian'],
            '360825': ['永丰县', '360800', 'yong feng xian'],
            '360826': ['泰和县', '360800', 'tai he xian'],
            '360827': ['遂川县', '360800', 'sui chuan xian'],
            '360828': ['万安县', '360800', 'wan an xian'],
            '360829': ['安福县', '360800', 'an fu xian'],
            '360830': ['永新县', '360800', 'yong xin xian'],
            '360881': ['井冈山市', '360800', 'jing gang shan shi'],
            '360882': ['其它区', '360800', 'qi ta qu'],
            '360900': ['宜春市', '360000', 'yi chun shi'],
            '360902': ['袁州区', '360900', 'yuan zhou qu'],
            '360921': ['奉新县', '360900', 'feng xin xian'],
            '360922': ['万载县', '360900', 'wan zai xian'],
            '360923': ['上高县', '360900', 'shang gao xian'],
            '360924': ['宜丰县', '360900', 'yi feng xian'],
            '360925': ['靖安县', '360900', 'jing an xian'],
            '360926': ['铜鼓县', '360900', 'tong gu xian'],
            '360981': ['丰城市', '360900', 'feng cheng shi'],
            '360982': ['樟树市', '360900', 'zhang shu shi'],
            '360983': ['高安市', '360900', 'gao an shi'],
            '360984': ['其它区', '360900', 'qi ta qu'],
            '361000': ['抚州市', '360000', 'fu zhou shi'],
            '361002': ['临川区', '361000', 'lin chuan qu'],
            '361021': ['南城县', '361000', 'nan cheng xian'],
            '361022': ['黎川县', '361000', 'li chuan xian'],
            '361023': ['南丰县', '361000', 'nan feng xian'],
            '361024': ['崇仁县', '361000', 'chong ren xian'],
            '361025': ['乐安县', '361000', 'le an xian'],
            '361026': ['宜黄县', '361000', 'yi huang xian'],
            '361027': ['金溪县', '361000', 'jin xi xian'],
            '361028': ['资溪县', '361000', 'zi xi xian'],
            '361029': ['东乡县', '361000', 'dong xiang xian'],
            '361030': ['广昌县', '361000', 'guang chang xian'],
            '361031': ['其它区', '361000', 'qi ta qu'],
            '361100': ['上饶市', '360000', 'shang rao shi'],
            '361102': ['信州区', '361100', 'shen zhou qu'],
            '361121': ['上饶县', '361100', 'shang rao xian'],
            '361122': ['广丰县', '361100', 'guang feng xian'],
            '361123': ['玉山县', '361100', 'yu shan xian'],
            '361124': ['铅山县', '361100', 'yan shan xian'],
            '361125': ['横峰县', '361100', 'heng feng xian'],
            '361126': ['弋阳县', '361100', 'yi yang xian'],
            '361127': ['余干县', '361100', 'yu gan xian'],
            '361128': ['鄱阳县', '361100', 'po yang xian'],
            '361129': ['万年县', '361100', 'wan nian xian'],
            '361130': ['婺源县', '361100', 'wu yuan xian'],
            '361181': ['德兴市', '361100', 'de xing shi'],
            '361182': ['其它区', '361100', 'qi ta qu'],
            '370000': ['山东省', '1', 'shan dong sheng'],
            '370100': ['济南市', '370000', 'ji nan shi'],
            '370102': ['历下区', '370100', 'li xia qu'],
            '370103': ['市中区', '370100', 'shi zhong qu'],
            '370104': ['槐荫区', '370100', 'huai yin qu'],
            '370105': ['天桥区', '370100', 'tian qiao qu'],
            '370112': ['历城区', '370100', 'li cheng qu'],
            '370113': ['长清区', '370100', 'chang qing qu'],
            '370124': ['平阴县', '370100', 'ping yin xian'],
            '370125': ['济阳县', '370100', 'ji yang xian'],
            '370126': ['商河县', '370100', 'shang he xian'],
            '370181': ['章丘市', '370100', 'zhang qiu shi'],
            '370182': ['其它区', '370100', 'qi ta qu'],
            '370200': ['青岛市', '370000', 'qing dao shi'],
            '370202': ['市南区', '370200', 'shi nan qu'],
            '370203': ['市北区', '370200', 'shi bei qu'],
            '370205': ['四方区', '370200', 'si fang qu'],
            '370211': ['黄岛区', '370200', 'huang dao qu'],
            '370212': ['崂山区', '370200', 'lao shan qu'],
            '370213': ['李沧区', '370200', 'li cang qu'],
            '370214': ['城阳区', '370200', 'cheng yang qu'],
            '370251': ['开发区', '370200', 'kai fa qu'],
            '370281': ['胶州市', '370200', 'jiao zhou shi'],
            '370282': ['即墨市', '370200', 'ji mo shi'],
            '370283': ['平度市', '370200', 'ping du shi'],
            '370284': ['胶南市', '370200', 'jiao nan shi'],
            '370285': ['莱西市', '370200', 'lai xi shi'],
            '370286': ['其它区', '370200', 'qi ta qu'],
            '370300': ['淄博市', '370000', 'zi bo shi'],
            '370302': ['淄川区', '370300', 'zi chuan qu'],
            '370303': ['张店区', '370300', 'zhang dian qu'],
            '370304': ['博山区', '370300', 'bo shan qu'],
            '370305': ['临淄区', '370300', 'lin zi qu'],
            '370306': ['周村区', '370300', 'zhou cun qu'],
            '370321': ['桓台县', '370300', 'huan tai xian'],
            '370322': ['高青县', '370300', 'gao qing xian'],
            '370323': ['沂源县', '370300', 'yi yuan xian'],
            '370324': ['其它区', '370300', 'qi ta qu'],
            '370400': ['枣庄市', '370000', 'zao zhuang shi'],
            '370402': ['市中区', '370400', 'shi zhong qu'],
            '370403': ['薛城区', '370400', 'xue cheng qu'],
            '370404': ['峄城区', '370400', 'yi cheng qu'],
            '370405': ['台儿庄区', '370400', 'tai er zhuang qu'],
            '370406': ['山亭区', '370400', 'shan ting qu'],
            '370481': ['滕州市', '370400', 'teng zhou shi'],
            '370482': ['其它区', '370400', 'qi ta qu'],
            '370500': ['东营市', '370000', 'dong ying shi'],
            '370502': ['东营区', '370500', 'dong ying qu'],
            '370503': ['河口区', '370500', 'he kou qu'],
            '370521': ['垦利县', '370500', 'ken li xian'],
            '370522': ['利津县', '370500', 'li jin xian'],
            '370523': ['广饶县', '370500', 'guang rao xian'],
            '370589': ['西城区', '370500', 'xi cheng qu'],
            '370590': ['东城区', '370500', 'dong cheng qu'],
            '370591': ['其它区', '370500', 'qi ta qu'],
            '370600': ['烟台市', '370000', 'yan tai shi'],
            '370602': ['芝罘区', '370600', 'zhi fu qu'],
            '370611': ['福山区', '370600', 'fu shan qu'],
            '370612': ['牟平区', '370600', 'mu ping qu'],
            '370613': ['莱山区', '370600', 'lai shan qu'],
            '370634': ['长岛县', '370600', 'chang dao xian'],
            '370681': ['龙口市', '370600', 'long kou shi'],
            '370682': ['莱阳市', '370600', 'lai yang shi'],
            '370683': ['莱州市', '370600', 'lai zhou shi'],
            '370684': ['蓬莱市', '370600', 'peng lai shi'],
            '370685': ['招远市', '370600', 'zhao yuan shi'],
            '370686': ['栖霞市', '370600', 'qi xia shi'],
            '370687': ['海阳市', '370600', 'hai yang shi'],
            '370688': ['其它区', '370600', 'qi ta qu'],
            '370700': ['潍坊市', '370000', 'wei fang shi'],
            '370702': ['潍城区', '370700', 'wei cheng qu'],
            '370703': ['寒亭区', '370700', 'han ting qu'],
            '370704': ['坊子区', '370700', 'fang zi qu'],
            '370705': ['奎文区', '370700', 'kui wen qu'],
            '370724': ['临朐县', '370700', 'lin qu xian'],
            '370725': ['昌乐县', '370700', 'chang le xian'],
            '370751': ['开发区', '370700', 'kai fa qu'],
            '370781': ['青州市', '370700', 'qing zhou shi'],
            '370782': ['诸城市', '370700', 'zhu cheng shi'],
            '370783': ['寿光市', '370700', 'shou guang shi'],
            '370784': ['安丘市', '370700', 'an qiu shi'],
            '370785': ['高密市', '370700', 'gao mi shi'],
            '370786': ['昌邑市', '370700', 'chang yi shi'],
            '370787': ['其它区', '370700', 'qi ta qu'],
            '370800': ['济宁市', '370000', 'ji ning shi'],
            '370802': ['市中区', '370800', 'shi zhong qu'],
            '370811': ['任城区', '370800', 'ren cheng qu'],
            '370826': ['微山县', '370800', 'wei shan xian'],
            '370827': ['鱼台县', '370800', 'yu tai xian'],
            '370828': ['金乡县', '370800', 'jin xiang xian'],
            '370829': ['嘉祥县', '370800', 'jia xiang xian'],
            '370830': ['汶上县', '370800', 'wen shang xian'],
            '370831': ['泗水县', '370800', 'si shui xian'],
            '370832': ['梁山县', '370800', 'liang shan xian'],
            '370881': ['曲阜市', '370800', 'qu fu shi'],
            '370882': ['兖州市', '370800', 'yan zhou shi'],
            '370883': ['邹城市', '370800', 'zou cheng shi'],
            '370884': ['其它区', '370800', 'qi ta qu'],
            '370900': ['泰安市', '370000', 'tai an shi'],
            '370902': ['泰山区', '370900', 'tai shan qu'],
            '370903': ['岱岳区', '370900', 'dai yue qu'],
            '370921': ['宁阳县', '370900', 'ning yang xian'],
            '370923': ['东平县', '370900', 'dong ping xian'],
            '370982': ['新泰市', '370900', 'xin tai shi'],
            '370983': ['肥城市', '370900', 'fei cheng shi'],
            '370984': ['其它区', '370900', 'qi ta qu'],
            '371000': ['威海市', '370000', 'wei hai shi'],
            '371002': ['环翠区', '371000', 'huan cui qu'],
            '371081': ['文登市', '371000', 'wen deng shi'],
            '371082': ['荣成市', '371000', 'rong cheng shi'],
            '371083': ['乳山市', '371000', 'ru shan shi'],
            '371084': ['其它区', '371000', 'qi ta qu'],
            '371100': ['日照市', '370000', 'ri zhao shi'],
            '371102': ['东港区', '371100', 'dong gang qu'],
            '371103': ['岚山区', '371100', 'lan shan qu'],
            '371121': ['五莲县', '371100', 'wu lian xian'],
            '371122': ['莒县', '371100', 'ju xian'],
            '371123': ['其它区', '371100', 'qi ta qu'],
            '371200': ['莱芜市', '370000', 'lai wu shi'],
            '371202': ['莱城区', '371200', 'lai cheng qu'],
            '371203': ['钢城区', '371200', 'gang cheng qu'],
            '371204': ['其它区', '371200', 'qi ta qu'],
            '371300': ['临沂市', '370000', 'lin yi shi'],
            '371302': ['兰山区', '371300', 'lan shan qu'],
            '371311': ['罗庄区', '371300', 'luo zhuang qu'],
            '371312': ['河东区', '371300', 'he dong qu'],
            '371321': ['沂南县', '371300', 'yi nan xian'],
            '371322': ['郯城县', '371300', 'tan cheng xian'],
            '371323': ['沂水县', '371300', 'yi shui xian'],
            '371324': ['苍山县', '371300', 'cang shan xian'],
            '371325': ['费县', '371300', 'fei xian'],
            '371326': ['平邑县', '371300', 'ping yi xian'],
            '371327': ['莒南县', '371300', 'ju nan xian'],
            '371328': ['蒙阴县', '371300', 'meng yin xian'],
            '371329': ['临沭县', '371300', 'lin shu xian'],
            '371330': ['其它区', '371300', 'qi ta qu'],
            '371400': ['德州市', '370000', 'de zhou shi'],
            '371402': ['德城区', '371400', 'de cheng qu'],
            '371421': ['陵县', '371400', 'ling xian'],
            '371422': ['宁津县', '371400', 'ning jin xian'],
            '371423': ['庆云县', '371400', 'qing yun xian'],
            '371424': ['临邑县', '371400', 'lin yi xian'],
            '371425': ['齐河县', '371400', 'qi he xian'],
            '371426': ['平原县', '371400', 'ping yuan xian'],
            '371427': ['夏津县', '371400', 'xia jin xian'],
            '371428': ['武城县', '371400', 'wu cheng xian'],
            '371451': ['开发区', '371400', 'kai fa qu'],
            '371481': ['乐陵市', '371400', 'le ling shi'],
            '371482': ['禹城市', '371400', 'yu cheng shi'],
            '371483': ['其它区', '371400', 'qi ta qu'],
            '371500': ['聊城市', '370000', 'liao cheng shi'],
            '371502': ['东昌府区', '371500', 'dong chang fu qu'],
            '371521': ['阳谷县', '371500', 'yang gu xian'],
            '371522': ['莘县', '371500', 'shen xian'],
            '371523': ['茌平县', '371500', 'chi ping xian'],
            '371524': ['东阿县', '371500', 'dong e xian'],
            '371525': ['冠县', '371500', 'guan xian'],
            '371526': ['高唐县', '371500', 'gao tang xian'],
            '371581': ['临清市', '371500', 'lin qing shi'],
            '371582': ['其它区', '371500', 'qi ta qu'],
            '371600': ['滨州市', '370000', 'bin zhou shi'],
            '371602': ['滨城区', '371600', 'bin cheng qu'],
            '371621': ['惠民县', '371600', 'hui min xian'],
            '371622': ['阳信县', '371600', 'yang shen xian'],
            '371623': ['无棣县', '371600', 'wu di xian'],
            '371624': ['沾化县', '371600', 'zhan hua xian'],
            '371625': ['博兴县', '371600', 'bo xing xian'],
            '371626': ['邹平县', '371600', 'zou ping xian'],
            '371627': ['其它区', '371600', 'qi ta qu'],
            '371700': ['菏泽市', '370000', 'he ze shi'],
            '371702': ['牡丹区', '371700', 'mu dan qu'],
            '371721': ['曹县', '371700', 'cao xian'],
            '371722': ['单县', '371700', 'shan xian'],
            '371723': ['成武县', '371700', 'cheng wu xian'],
            '371724': ['巨野县', '371700', 'ju ye xian'],
            '371725': ['郓城县', '371700', 'yun cheng xian'],
            '371726': ['鄄城县', '371700', 'juan cheng xian'],
            '371727': ['定陶县', '371700', 'ding tao xian'],
            '371728': ['东明县', '371700', 'dong ming xian'],
            '371729': ['其它区', '371700', 'qi ta qu'],
            '410000': ['河南省', '1', 'he nan sheng'],
            '410100': ['郑州市', '410000', 'zheng zhou shi'],
            '410102': ['中原区', '410100', 'zhong yuan qu'],
            '410103': ['二七区', '410100', 'er qi qu'],
            '410104': ['管城回族区', '410100', 'guan cheng hui zu qu'],
            '410105': ['金水区', '410100', 'jin shui qu'],
            '410106': ['上街区', '410100', 'shang jie qu'],
            '410108': ['惠济区', '410100', 'hui ji qu'],
            '410122': ['中牟县', '410100', 'zhong mu xian'],
            '410181': ['巩义市', '410100', 'gong yi shi'],
            '410182': ['荥阳市', '410100', 'xing yang shi'],
            '410183': ['新密市', '410100', 'xin mi shi'],
            '410184': ['新郑市', '410100', 'xin zheng shi'],
            '410185': ['登封市', '410100', 'deng feng shi'],
            '410186': ['郑东新区', '410100', 'zheng dong xin qu'],
            '410187': ['高新区', '410100', 'gao xin qu'],
            '410188': ['其它区', '410100', 'qi ta qu'],
            '410200': ['开封市', '410000', 'kai feng shi'],
            '410202': ['龙亭区', '410200', 'long ting qu'],
            '410203': ['顺河回族区', '410200', 'shun he hui zu qu'],
            '410204': ['鼓楼区', '410200', 'gu lou qu'],
            '410205': ['禹王台区', '410200', 'yu wang tai qu'],
            '410211': ['金明区', '410200', 'jin ming qu'],
            '410221': ['杞县', '410200', 'qi xian'],
            '410222': ['通许县', '410200', 'tong xu xian'],
            '410223': ['尉氏县', '410200', 'wei shi xian'],
            '410224': ['开封县', '410200', 'kai feng xian'],
            '410225': ['兰考县', '410200', 'lan kao xian'],
            '410226': ['其它区', '410200', 'qi ta qu'],
            '410300': ['洛阳市', '410000', 'luo yang shi'],
            '410302': ['老城区', '410300', 'lao cheng qu'],
            '410303': ['西工区', '410300', 'xi gong qu'],
            '410304': ['廛河回族区', '410300', 'chan he hui zu qu'],
            '410305': ['涧西区', '410300', 'jian xi qu'],
            '410306': ['吉利区', '410300', 'ji li qu'],
            '410307': ['洛龙区', '410300', 'luo long qu'],
            '410322': ['孟津县', '410300', 'meng jin xian'],
            '410323': ['新安县', '410300', 'xin an xian'],
            '410324': ['栾川县', '410300', 'luan chuan xian'],
            '410325': ['嵩县', '410300', 'song xian'],
            '410326': ['汝阳县', '410300', 'ru yang xian'],
            '410327': ['宜阳县', '410300', 'yi yang xian'],
            '410328': ['洛宁县', '410300', 'luo ning xian'],
            '410329': ['伊川县', '410300', 'yi chuan xian'],
            '410381': ['偃师市', '410300', 'yan shi shi'],
            '410400': ['平顶山市', '410000', 'ping ding shan shi'],
            '410402': ['新华区', '410400', 'xin hua qu'],
            '410403': ['卫东区', '410400', 'wei dong qu'],
            '410404': ['石龙区', '410400', 'shi long qu'],
            '410411': ['湛河区', '410400', 'zhan he qu'],
            '410421': ['宝丰县', '410400', 'bao feng xian'],
            '410422': ['叶县', '410400', 'ye xian'],
            '410423': ['鲁山县', '410400', 'lu shan xian'],
            '410425': ['郏县', '410400', 'jia xian'],
            '410481': ['舞钢市', '410400', 'wu gang shi'],
            '410482': ['汝州市', '410400', 'ru zhou shi'],
            '410483': ['其它区', '410400', 'qi ta qu'],
            '410500': ['安阳市', '410000', 'an yang shi'],
            '410502': ['文峰区', '410500', 'wen feng qu'],
            '410503': ['北关区', '410500', 'bei guan qu'],
            '410505': ['殷都区', '410500', 'yin du qu'],
            '410506': ['龙安区', '410500', 'long an qu'],
            '410522': ['安阳县', '410500', 'an yang xian'],
            '410523': ['汤阴县', '410500', 'tang yin xian'],
            '410526': ['滑县', '410500', 'hua xian'],
            '410527': ['内黄县', '410500', 'nei huang xian'],
            '410581': ['林州市', '410500', 'lin zhou shi'],
            '410582': ['其它区', '410500', 'qi ta qu'],
            '410600': ['鹤壁市', '410000', 'he bi shi'],
            '410602': ['鹤山区', '410600', 'he shan qu'],
            '410603': ['山城区', '410600', 'shan cheng qu'],
            '410611': ['淇滨区', '410600', 'qi bin qu'],
            '410621': ['浚县', '410600', 'xun xian'],
            '410622': ['淇县', '410600', 'qi xian'],
            '410623': ['其它区', '410600', 'qi ta qu'],
            '410700': ['新乡市', '410000', 'xin xiang shi'],
            '410702': ['红旗区', '410700', 'hong qi qu'],
            '410703': ['卫滨区', '410700', 'wei bin qu'],
            '410704': ['凤泉区', '410700', 'feng quan qu'],
            '410711': ['牧野区', '410700', 'mu ye qu'],
            '410721': ['新乡县', '410700', 'xin xiang xian'],
            '410724': ['获嘉县', '410700', 'huo jia xian'],
            '410725': ['原阳县', '410700', 'yuan yang xian'],
            '410726': ['延津县', '410700', 'yan jin xian'],
            '410727': ['封丘县', '410700', 'feng qiu xian'],
            '410728': ['长垣县', '410700', 'chang yuan xian'],
            '410781': ['卫辉市', '410700', 'wei hui shi'],
            '410782': ['辉县市', '410700', 'hui xian shi'],
            '410783': ['其它区', '410700', 'qi ta qu'],
            '410800': ['焦作市', '410000', 'jiao zuo shi'],
            '410802': ['解放区', '410800', 'jie fang qu'],
            '410803': ['中站区', '410800', 'zhong zhan qu'],
            '410804': ['马村区', '410800', 'ma cun qu'],
            '410811': ['山阳区', '410800', 'shan yang qu'],
            '410821': ['修武县', '410800', 'xiu wu xian'],
            '410822': ['博爱县', '410800', 'bo ai xian'],
            '410823': ['武陟县', '410800', 'wu zhi xian'],
            '410825': ['温县', '410800', 'wen xian'],
            '410881': ['济源市', '410000', 'ji yuan shi'],
            '410882': ['沁阳市', '410800', 'qin yang shi'],
            '410883': ['孟州市', '410800', 'meng zhou shi'],
            '410884': ['其它区', '410800', 'qi ta qu'],
            '410900': ['濮阳市', '410000', 'pu yang shi'],
            '410902': ['华龙区', '410900', 'hua long qu'],
            '410922': ['清丰县', '410900', 'qing feng xian'],
            '410923': ['南乐县', '410900', 'nan le xian'],
            '410926': ['范县', '410900', 'fan xian'],
            '410927': ['台前县', '410900', 'tai qian xian'],
            '410928': ['濮阳县', '410900', 'pu yang xian'],
            '410929': ['其它区', '410900', 'qi ta qu'],
            '411000': ['许昌市', '410000', 'xu chang shi'],
            '411002': ['魏都区', '411000', 'wei du qu'],
            '411023': ['许昌县', '411000', 'xu chang xian'],
            '411024': ['鄢陵县', '411000', 'yan ling xian'],
            '411025': ['襄城县', '411000', 'xiang cheng xian'],
            '411081': ['禹州市', '411000', 'yu zhou shi'],
            '411082': ['长葛市', '411000', 'chang ge shi'],
            '411083': ['其它区', '411000', 'qi ta qu'],
            '411100': ['漯河市', '410000', 'luo he shi'],
            '411102': ['源汇区', '411100', 'yuan hui qu'],
            '411103': ['郾城区', '411100', 'yan cheng qu'],
            '411104': ['召陵区', '411100', 'zhao ling qu'],
            '411121': ['舞阳县', '411100', 'wu yang xian'],
            '411122': ['临颍县', '411100', 'lin ying xian'],
            '411123': ['其它区', '411100', 'qi ta qu'],
            '411200': ['三门峡市', '410000', 'san men xia shi'],
            '411202': ['湖滨区', '411200', 'hu bin qu'],
            '411221': ['渑池县', '411200', 'mian chi xian'],
            '411222': ['陕县', '411200', 'shan xian'],
            '411224': ['卢氏县', '411200', 'lu shi xian'],
            '411281': ['义马市', '411200', 'yi ma shi'],
            '411282': ['灵宝市', '411200', 'ling bao shi'],
            '411283': ['其它区', '411200', 'qi ta qu'],
            '411300': ['南阳市', '410000', 'nan yang shi'],
            '411302': ['宛城区', '411300', 'wan cheng qu'],
            '411303': ['卧龙区', '411300', 'wo long qu'],
            '411321': ['南召县', '411300', 'nan zhao xian'],
            '411322': ['方城县', '411300', 'fang cheng xian'],
            '411323': ['西峡县', '411300', 'xi xia xian'],
            '411324': ['镇平县', '411300', 'zhen ping xian'],
            '411325': ['内乡县', '411300', 'nei xiang xian'],
            '411326': ['淅川县', '411300', 'xi chuan xian'],
            '411327': ['社旗县', '411300', 'she qi xian'],
            '411328': ['唐河县', '411300', 'tang he xian'],
            '411329': ['新野县', '411300', 'xin ye xian'],
            '411330': ['桐柏县', '411300', 'tong bai xian'],
            '411381': ['邓州市', '411300', 'deng zhou shi'],
            '411382': ['其它区', '411300', 'qi ta qu'],
            '411400': ['商丘市', '410000', 'shang qiu shi'],
            '411402': ['梁园区', '411400', 'liang yuan qu'],
            '411403': ['睢阳区', '411400', 'sui yang qu'],
            '411421': ['民权县', '411400', 'min quan xian'],
            '411422': ['睢县', '411400', 'sui xian'],
            '411423': ['宁陵县', '411400', 'ning ling xian'],
            '411424': ['柘城县', '411400', 'zhe cheng xian'],
            '411425': ['虞城县', '411400', 'yu cheng xian'],
            '411426': ['夏邑县', '411400', 'xia yi xian'],
            '411481': ['永城市', '411400', 'yong cheng shi'],
            '411482': ['其它区', '411400', 'qi ta qu'],
            '411500': ['信阳市', '410000', 'shen yang shi'],
            '411502': ['浉河区', '411500', 'shi he qu'],
            '411503': ['平桥区', '411500', 'ping qiao qu'],
            '411521': ['罗山县', '411500', 'luo shan xian'],
            '411522': ['光山县', '411500', 'guang shan xian'],
            '411523': ['新县', '411500', 'xin xian'],
            '411524': ['商城县', '411500', 'shang cheng xian'],
            '411525': ['固始县', '411500', 'gu shi xian'],
            '411526': ['潢川县', '411500', 'huang chuan xian'],
            '411527': ['淮滨县', '411500', 'huai bin xian'],
            '411528': ['息县', '411500', 'xi xian'],
            '411529': ['其它区', '411500', 'qi ta qu'],
            '411600': ['周口市', '410000', 'zhou kou shi'],
            '411602': ['川汇区', '411600', 'chuan hui qu'],
            '411621': ['扶沟县', '411600', 'fu gou xian'],
            '411622': ['西华县', '411600', 'xi hua xian'],
            '411623': ['商水县', '411600', 'shang shui xian'],
            '411624': ['沈丘县', '411600', 'shen qiu xian'],
            '411625': ['郸城县', '411600', 'dan cheng xian'],
            '411626': ['淮阳县', '411600', 'huai yang xian'],
            '411627': ['太康县', '411600', 'tai kang xian'],
            '411628': ['鹿邑县', '411600', 'lu yi xian'],
            '411681': ['项城市', '411600', 'xiang cheng shi'],
            '411682': ['其它区', '411600', 'qi ta qu'],
            '411700': ['驻马店市', '410000', 'zhu ma dian shi'],
            '411702': ['驿城区', '411700', 'yi cheng qu'],
            '411721': ['西平县', '411700', 'xi ping xian'],
            '411722': ['上蔡县', '411700', 'shang cai xian'],
            '411723': ['平舆县', '411700', 'ping yu xian'],
            '411724': ['正阳县', '411700', 'zheng yang xian'],
            '411725': ['确山县', '411700', 'que shan xian'],
            '411726': ['泌阳县', '411700', 'bi yang xian'],
            '411727': ['汝南县', '411700', 'ru nan xian'],
            '411728': ['遂平县', '411700', 'sui ping xian'],
            '411729': ['新蔡县', '411700', 'xin cai xian'],
            '411730': ['其它区', '411700', 'qi ta qu'],
            '420000': ['湖北省', '1', 'hu bei sheng'],
            '420100': ['武汉市', '420000', 'wu han shi'],
            '420102': ['江岸区', '420100', 'jiang an qu'],
            '420103': ['江汉区', '420100', 'jiang han qu'],
            '420104': ['硚口区', '420100', 'qiao kou qu'],
            '420105': ['汉阳区', '420100', 'han yang qu'],
            '420106': ['武昌区', '420100', 'wu chang qu'],
            '420107': ['青山区', '420100', 'qing shan qu'],
            '420111': ['洪山区', '420100', 'hong shan qu'],
            '420112': ['东西湖区', '420100', 'dong xi hu qu'],
            '420113': ['汉南区', '420100', 'han nan qu'],
            '420114': ['蔡甸区', '420100', 'cai dian qu'],
            '420115': ['江夏区', '420100', 'jiang xia qu'],
            '420116': ['黄陂区', '420100', 'huang pi qu'],
            '420117': ['新洲区', '420100', 'xin zhou qu'],
            '420118': ['其它区', '420100', 'qi ta qu'],
            '420200': ['黄石市', '420000', 'huang shi shi'],
            '420202': ['黄石港区', '420200', 'huang shi gang qu'],
            '420203': ['西塞山区', '420200', 'xi sai shan qu'],
            '420204': ['下陆区', '420200', 'xia lu qu'],
            '420205': ['铁山区', '420200', 'tie shan qu'],
            '420222': ['阳新县', '420200', 'yang xin xian'],
            '420281': ['大冶市', '420200', 'da ye shi'],
            '420282': ['其它区', '420200', 'qi ta qu'],
            '420300': ['十堰市', '420000', 'shi yan shi'],
            '420302': ['茅箭区', '420300', 'mao jian qu'],
            '420303': ['张湾区', '420300', 'zhang wan qu'],
            '420321': ['郧县', '420300', 'yun xian'],
            '420322': ['郧西县', '420300', 'yun xi xian'],
            '420323': ['竹山县', '420300', 'zhu shan xian'],
            '420324': ['竹溪县', '420300', 'zhu xi xian'],
            '420325': ['房县', '420300', 'fang xian'],
            '420381': ['丹江口市', '420300', 'dan jiang kou shi'],
            '420382': ['城区', '420300', 'cheng qu'],
            '420383': ['其它区', '420300', 'qi ta qu'],
            '420500': ['宜昌市', '420000', 'yi chang shi'],
            '420502': ['西陵区', '420500', 'xi ling qu'],
            '420503': ['伍家岗区', '420500', 'wu jia gang qu'],
            '420504': ['点军区', '420500', 'dian jun qu'],
            '420505': ['猇亭区', '420500', 'yao ting qu'],
            '420506': ['夷陵区', '420500', 'yi ling qu'],
            '420525': ['远安县', '420500', 'yuan an xian'],
            '420526': ['兴山县', '420500', 'xing shan xian'],
            '420527': ['秭归县', '420500', 'zi gui xian'],
            '420528': ['长阳土家族自治县', '420500', 'chang yang tu jia zu zi zhi xian'],
            '420529': ['五峰土家族自治县', '420500', 'wu feng tu jia zu zi zhi xian'],
            '420551': ['葛洲坝区', '420500', 'ge zhou ba qu'],
            '420552': ['开发区', '420500', 'kai fa qu'],
            '420581': ['宜都市', '420500', 'yi du shi'],
            '420582': ['当阳市', '420500', 'dang yang shi'],
            '420583': ['枝江市', '420500', 'zhi jiang shi'],
            '420584': ['其它区', '420500', 'qi ta qu'],
            '420600': ['襄阳市', '420000', 'xiang yang shi'],
            '420602': ['襄城区', '420600', 'xiang cheng qu'],
            '420606': ['樊城区', '420600', 'fan cheng qu'],
            '420607': ['襄州区', '420600', 'xiang zhou qu'],
            '420624': ['南漳县', '420600', 'nan zhang xian'],
            '420625': ['谷城县', '420600', 'gu cheng xian'],
            '420626': ['保康县', '420600', 'bao kang xian'],
            '420682': ['老河口市', '420600', 'lao he kou shi'],
            '420683': ['枣阳市', '420600', 'zao yang shi'],
            '420684': ['宜城市', '420600', 'yi cheng shi'],
            '420685': ['其它区', '420600', 'qi ta qu'],
            '420700': ['鄂州市', '420000', 'e zhou shi'],
            '420702': ['梁子湖区', '420700', 'liang zi hu qu'],
            '420703': ['华容区', '420700', 'hua rong qu'],
            '420704': ['鄂城区', '420700', 'e cheng qu'],
            '420705': ['其它区', '420700', 'qi ta qu'],
            '420800': ['荆门市', '420000', 'jing men shi'],
            '420802': ['东宝区', '420800', 'dong bao qu'],
            '420804': ['掇刀区', '420800', 'duo dao qu'],
            '420821': ['京山县', '420800', 'jing shan xian'],
            '420822': ['沙洋县', '420800', 'sha yang xian'],
            '420881': ['钟祥市', '420800', 'zhong xiang shi'],
            '420882': ['其它区', '420800', 'qi ta qu'],
            '420900': ['孝感市', '420000', 'xiao gan shi'],
            '420902': ['孝南区', '420900', 'xiao nan qu'],
            '420921': ['孝昌县', '420900', 'xiao chang xian'],
            '420922': ['大悟县', '420900', 'da wu xian'],
            '420923': ['云梦县', '420900', 'yun meng xian'],
            '420981': ['应城市', '420900', 'ying cheng shi'],
            '420982': ['安陆市', '420900', 'an lu shi'],
            '420984': ['汉川市', '420900', 'han chuan shi'],
            '420985': ['其它区', '420900', 'qi ta qu'],
            '421000': ['荆州市', '420000', 'jing zhou shi'],
            '421002': ['沙市区', '421000', 'sha shi qu'],
            '421003': ['荆州区', '421000', 'jing zhou qu'],
            '421022': ['公安县', '421000', 'gong an xian'],
            '421023': ['监利县', '421000', 'jian li xian'],
            '421024': ['江陵县', '421000', 'jiang ling xian'],
            '421081': ['石首市', '421000', 'shi shou shi'],
            '421083': ['洪湖市', '421000', 'hong hu shi'],
            '421087': ['松滋市', '421000', 'song zi shi'],
            '421088': ['其它区', '421000', 'qi ta qu'],
            '421100': ['黄冈市', '420000', 'huang gang shi'],
            '421102': ['黄州区', '421100', 'huang zhou qu'],
            '421121': ['团风县', '421100', 'tuan feng xian'],
            '421122': ['红安县', '421100', 'hong an xian'],
            '421123': ['罗田县', '421100', 'luo tian xian'],
            '421124': ['英山县', '421100', 'ying shan xian'],
            '421125': ['浠水县', '421100', 'xi shui xian'],
            '421126': ['蕲春县', '421100', 'qi chun xian'],
            '421127': ['黄梅县', '421100', 'huang mei xian'],
            '421181': ['麻城市', '421100', 'ma cheng shi'],
            '421182': ['武穴市', '421100', 'wu xue shi'],
            '421183': ['其它区', '421100', 'qi ta qu'],
            '421200': ['咸宁市', '420000', 'xian ning shi'],
            '421202': ['咸安区', '421200', 'xian an qu'],
            '421221': ['嘉鱼县', '421200', 'jia yu xian'],
            '421222': ['通城县', '421200', 'tong cheng xian'],
            '421223': ['崇阳县', '421200', 'chong yang xian'],
            '421224': ['通山县', '421200', 'tong shan xian'],
            '421281': ['赤壁市', '421200', 'chi bi shi'],
            '421282': ['温泉城区', '421200', 'wen quan cheng qu'],
            '421283': ['其它区', '421200', 'qi ta qu'],
            '421300': ['随州市', '420000', 'sui zhou shi'],
            '421302': ['曾都区', '421300', 'zeng du qu'],
            '421321': ['随县', '421300', 'sui xian'],
            '421381': ['广水市', '421300', 'guang shui shi'],
            '421382': ['其它区', '421300', 'qi ta qu'],
            '422800': ['恩施土家族苗族自治州', '420000', 'en shi tu jia zu miao zu zi zhi zhou'],
            '422801': ['恩施市', '422800', 'en shi shi'],
            '422802': ['利川市', '422800', 'li chuan shi'],
            '422822': ['建始县', '422800', 'jian shi xian'],
            '422823': ['巴东县', '422800', 'ba dong xian'],
            '422825': ['宣恩县', '422800', 'xuan en xian'],
            '422826': ['咸丰县', '422800', 'xian feng xian'],
            '422827': ['来凤县', '422800', 'lai feng xian'],
            '422828': ['鹤峰县', '422800', 'he feng xian'],
            '422829': ['其它区', '422800', 'qi ta qu'],
            '429004': ['仙桃市', '420000', 'xian tao shi'],
            '429005': ['潜江市', '420000', 'qian jiang shi'],
            '429006': ['天门市', '420000', 'tian men shi'],
            '429021': ['神农架林区', '420000', 'shen nong jia lin qu'],
            '430000': ['湖南省', '1', 'hu nan sheng'],
            '430100': ['长沙市', '430000', 'chang sha shi'],
            '430102': ['芙蓉区', '430100', 'fu rong qu'],
            '430103': ['天心区', '430100', 'tian xin qu'],
            '430104': ['岳麓区', '430100', 'yue lu qu'],
            '430105': ['开福区', '430100', 'kai fu qu'],
            '430111': ['雨花区', '430100', 'yu hua qu'],
            '430121': ['长沙县', '430100', 'chang sha xian'],
            '430122': ['望城县', '430100', 'wang cheng xian'],
            '430124': ['宁乡县', '430100', 'ning xiang xian'],
            '430181': ['浏阳市', '430100', 'liu yang shi'],
            '430182': ['其它区', '430100', 'qi ta qu'],
            '430200': ['株洲市', '430000', 'zhu zhou shi'],
            '430202': ['荷塘区', '430200', 'he tang qu'],
            '430203': ['芦淞区', '430200', 'lu song qu'],
            '430204': ['石峰区', '430200', 'shi feng qu'],
            '430211': ['天元区', '430200', 'tian yuan qu'],
            '430221': ['株洲县', '430200', 'zhu zhou xian'],
            '430223': ['攸县', '430200', 'you xian'],
            '430224': ['茶陵县', '430200', 'cha ling xian'],
            '430225': ['炎陵县', '430200', 'yan ling xian'],
            '430281': ['醴陵市', '430200', 'li ling shi'],
            '430282': ['其它区', '430200', 'qi ta qu'],
            '430300': ['湘潭市', '430000', 'xiang tan shi'],
            '430302': ['雨湖区', '430300', 'yu hu qu'],
            '430304': ['岳塘区', '430300', 'yue tang qu'],
            '430321': ['湘潭县', '430300', 'xiang tan xian'],
            '430381': ['湘乡市', '430300', 'xiang xiang shi'],
            '430382': ['韶山市', '430300', 'shao shan shi'],
            '430383': ['其它区', '430300', 'qi ta qu'],
            '430400': ['衡阳市', '430000', 'heng yang shi'],
            '430405': ['珠晖区', '430400', 'zhu hui qu'],
            '430406': ['雁峰区', '430400', 'yan feng qu'],
            '430407': ['石鼓区', '430400', 'shi gu qu'],
            '430408': ['蒸湘区', '430400', 'zheng xiang qu'],
            '430412': ['南岳区', '430400', 'nan yue qu'],
            '430421': ['衡阳县', '430400', 'heng yang xian'],
            '430422': ['衡南县', '430400', 'heng nan xian'],
            '430423': ['衡山县', '430400', 'heng shan xian'],
            '430424': ['衡东县', '430400', 'heng dong xian'],
            '430426': ['祁东县', '430400', 'qi dong xian'],
            '430481': ['耒阳市', '430400', 'lei yang shi'],
            '430482': ['常宁市', '430400', 'chang ning shi'],
            '430483': ['其它区', '430400', 'qi ta qu'],
            '430500': ['邵阳市', '430000', 'shao yang shi'],
            '430502': ['双清区', '430500', 'shuang qing qu'],
            '430503': ['大祥区', '430500', 'da xiang qu'],
            '430511': ['北塔区', '430500', 'bei ta qu'],
            '430521': ['邵东县', '430500', 'shao dong xian'],
            '430522': ['新邵县', '430500', 'xin shao xian'],
            '430523': ['邵阳县', '430500', 'shao yang xian'],
            '430524': ['隆回县', '430500', 'long hui xian'],
            '430525': ['洞口县', '430500', 'dong kou xian'],
            '430527': ['绥宁县', '430500', 'sui ning xian'],
            '430528': ['新宁县', '430500', 'xin ning xian'],
            '430529': ['城步苗族自治县', '430500', 'cheng bu miao zu zi zhi xian'],
            '430581': ['武冈市', '430500', 'wu gang shi'],
            '430582': ['其它区', '430500', 'qi ta qu'],
            '430600': ['岳阳市', '430000', 'yue yang shi'],
            '430602': ['岳阳楼区', '430600', 'yue yang lou qu'],
            '430603': ['云溪区', '430600', 'yun xi qu'],
            '430611': ['君山区', '430600', 'jun shan qu'],
            '430621': ['岳阳县', '430600', 'yue yang xian'],
            '430623': ['华容县', '430600', 'hua rong xian'],
            '430624': ['湘阴县', '430600', 'xiang yin xian'],
            '430626': ['平江县', '430600', 'ping jiang xian'],
            '430681': ['汨罗市', '430600', 'mi luo shi'],
            '430682': ['临湘市', '430600', 'lin xiang shi'],
            '430683': ['其它区', '430600', 'qi ta qu'],
            '430700': ['常德市', '430000', 'chang de shi'],
            '430702': ['武陵区', '430700', 'wu ling qu'],
            '430703': ['鼎城区', '430700', 'ding cheng qu'],
            '430721': ['安乡县', '430700', 'an xiang xian'],
            '430722': ['汉寿县', '430700', 'han shou xian'],
            '430723': ['澧县', '430700', 'li xian'],
            '430724': ['临澧县', '430700', 'lin li xian'],
            '430725': ['桃源县', '430700', 'tao yuan xian'],
            '430726': ['石门县', '430700', 'shi men xian'],
            '430781': ['津市市', '430700', 'jin shi shi'],
            '430782': ['其它区', '430700', 'qi ta qu'],
            '430800': ['张家界市', '430000', 'zhang jia jie shi'],
            '430802': ['永定区', '430800', 'yong ding qu'],
            '430811': ['武陵源区', '430800', 'wu ling yuan qu'],
            '430821': ['慈利县', '430800', 'ci li xian'],
            '430822': ['桑植县', '430800', 'sang zhi xian'],
            '430823': ['其它区', '430800', 'qi ta qu'],
            '430900': ['益阳市', '430000', 'yi yang shi'],
            '430902': ['资阳区', '430900', 'zi yang qu'],
            '430903': ['赫山区', '430900', 'he shan qu'],
            '430921': ['南县', '430900', 'nan xian'],
            '430922': ['桃江县', '430900', 'tao jiang xian'],
            '430923': ['安化县', '430900', 'an hua xian'],
            '430981': ['沅江市', '430900', 'yuan jiang shi'],
            '430982': ['其它区', '430900', 'qi ta qu'],
            '431000': ['郴州市', '430000', 'chen zhou shi'],
            '431002': ['北湖区', '431000', 'bei hu qu'],
            '431003': ['苏仙区', '431000', 'su xian qu'],
            '431021': ['桂阳县', '431000', 'gui yang xian'],
            '431022': ['宜章县', '431000', 'yi zhang xian'],
            '431023': ['永兴县', '431000', 'yong xing xian'],
            '431024': ['嘉禾县', '431000', 'jia he xian'],
            '431025': ['临武县', '431000', 'lin wu xian'],
            '431026': ['汝城县', '431000', 'ru cheng xian'],
            '431027': ['桂东县', '431000', 'gui dong xian'],
            '431028': ['安仁县', '431000', 'an ren xian'],
            '431081': ['资兴市', '431000', 'zi xing shi'],
            '431082': ['其它区', '431000', 'qi ta qu'],
            '431100': ['永州市', '430000', 'yong zhou shi'],
            '431102': ['零陵区', '431100', 'ling ling qu'],
            '431103': ['冷水滩区', '431100', 'leng shui tan qu'],
            '431121': ['祁阳县', '431100', 'qi yang xian'],
            '431122': ['东安县', '431100', 'dong an xian'],
            '431123': ['双牌县', '431100', 'shuang pai xian'],
            '431124': ['道县', '431100', 'dao xian'],
            '431125': ['江永县', '431100', 'jiang yong xian'],
            '431126': ['宁远县', '431100', 'ning yuan xian'],
            '431127': ['蓝山县', '431100', 'lan shan xian'],
            '431128': ['新田县', '431100', 'xin tian xian'],
            '431129': ['江华瑶族自治县', '431100', 'jiang hua yao zu zi zhi xian'],
            '431130': ['其它区', '431100', 'qi ta qu'],
            '431200': ['怀化市', '430000', 'huai hua shi'],
            '431202': ['鹤城区', '431200', 'he cheng qu'],
            '431221': ['中方县', '431200', 'zhong fang xian'],
            '431222': ['沅陵县', '431200', 'yuan ling xian'],
            '431223': ['辰溪县', '431200', 'chen xi xian'],
            '431224': ['溆浦县', '431200', 'xu pu xian'],
            '431225': ['会同县', '431200', 'hui tong xian'],
            '431226': ['麻阳苗族自治县', '431200', 'ma yang miao zu zi zhi xian'],
            '431227': ['新晃侗族自治县', '431200', 'xin huang dong zu zi zhi xian'],
            '431228': ['芷江侗族自治县', '431200', 'zhi jiang dong zu zi zhi xian'],
            '431229': ['靖州苗族侗族自治县', '431200', 'jing zhou miao zu dong zu zi zhi xian'],
            '431230': ['通道侗族自治县', '431200', 'tong dao dong zu zi zhi xian'],
            '431281': ['洪江市', '431200', 'hong jiang shi'],
            '431282': ['其它区', '431200', 'qi ta qu'],
            '431300': ['娄底市', '430000', 'lou di shi'],
            '431302': ['娄星区', '431300', 'lou xing qu'],
            '431321': ['双峰县', '431300', 'shuang feng xian'],
            '431322': ['新化县', '431300', 'xin hua xian'],
            '431381': ['冷水江市', '431300', 'leng shui jiang shi'],
            '431382': ['涟源市', '431300', 'lian yuan shi'],
            '431383': ['其它区', '431300', 'qi ta qu'],
            '433100': ['湘西土家族苗族自治州', '430000', 'xiang xi tu jia zu miao zu zi zhi zhou'],
            '433101': ['吉首市', '433100', 'ji shou shi'],
            '433122': ['泸溪县', '433100', 'lu xi xian'],
            '433123': ['凤凰县', '433100', 'feng huang xian'],
            '433124': ['花垣县', '433100', 'hua yuan xian'],
            '433125': ['保靖县', '433100', 'bao jing xian'],
            '433126': ['古丈县', '433100', 'gu zhang xian'],
            '433127': ['永顺县', '433100', 'yong shun xian'],
            '433130': ['龙山县', '433100', 'long shan xian'],
            '433131': ['其它区', '433100', 'qi ta qu'],
            '440000': ['广东省', '1', 'guang dong sheng'],
            '440100': ['广州市', '440000', 'guang zhou shi'],
            '440103': ['荔湾区', '440100', 'li wan qu'],
            '440104': ['越秀区', '440100', 'yue xiu qu'],
            '440105': ['海珠区', '440100', 'hai zhu qu'],
            '440106': ['天河区', '440100', 'tian he qu'],
            '440111': ['白云区', '440100', 'bai yun qu'],
            '440112': ['黄埔区', '440100', 'huang pu qu'],
            '440113': ['番禺区', '440100', 'pan yu qu'],
            '440114': ['花都区', '440100', 'hua du qu'],
            '440115': ['南沙区', '440100', 'nan sha qu'],
            '440116': ['萝岗区', '440100', 'luo gang qu'],
            '440183': ['增城市', '440100', 'zeng cheng shi'],
            '440184': ['从化市', '440100', 'cong hua shi'],
            '440188': ['东山区', '440100', 'dong shan qu'],
            '440189': ['其它区', '440100', 'qi ta qu'],
            '440200': ['韶关市', '440000', 'shao guan shi'],
            '440203': ['武江区', '440200', 'wu jiang qu'],
            '440204': ['浈江区', '440200', 'zhen jiang qu'],
            '440205': ['曲江区', '440200', 'qu jiang qu'],
            '440222': ['始兴县', '440200', 'shi xing xian'],
            '440224': ['仁化县', '440200', 'ren hua xian'],
            '440229': ['翁源县', '440200', 'weng yuan xian'],
            '440232': ['乳源瑶族自治县', '440200', 'ru yuan yao zu zi zhi xian'],
            '440233': ['新丰县', '440200', 'xin feng xian'],
            '440281': ['乐昌市', '440200', 'le chang shi'],
            '440282': ['南雄市', '440200', 'nan xiong shi'],
            '440283': ['其它区', '440200', 'qi ta qu'],
            '440300': ['深圳市', '440000', 'shen zhen shi'],
            '440303': ['罗湖区', '440300', 'luo hu qu'],
            '440304': ['福田区', '440300', 'fu tian qu'],
            '440305': ['南山区', '440300', 'nan shan qu'],
            '440306': ['宝安区', '440300', 'bao an qu'],
            '440307': ['龙岗区', '440300', 'long gang qu'],
            '440308': ['盐田区', '440300', 'yan tian qu'],
            '440309': ['其它区', '440300', 'qi ta qu'],
            '440400': ['珠海市', '440000', 'zhu hai shi'],
            '440402': ['香洲区', '440400', 'xiang zhou qu'],
            '440403': ['斗门区', '440400', 'dou men qu'],
            '440404': ['金湾区', '440400', 'jin wan qu'],
            '440486': ['金唐区', '440400', 'jin tang qu'],
            '440487': ['南湾区', '440400', 'nan wan qu'],
            '440488': ['其它区', '440400', 'qi ta qu'],
            '440500': ['汕头市', '440000', 'shan tou shi'],
            '440507': ['龙湖区', '440500', 'long hu qu'],
            '440511': ['金平区', '440500', 'jin ping qu'],
            '440512': ['濠江区', '440500', 'hao jiang qu'],
            '440513': ['潮阳区', '440500', 'chao yang qu'],
            '440514': ['潮南区', '440500', 'chao nan qu'],
            '440515': ['澄海区', '440500', 'cheng hai qu'],
            '440523': ['南澳县', '440500', 'nan ao xian'],
            '440524': ['其它区', '440500', 'qi ta qu'],
            '440600': ['佛山市', '440000', 'fo shan shi'],
            '440604': ['禅城区', '440600', 'chan cheng qu'],
            '440605': ['南海区', '440600', 'nan hai qu'],
            '440606': ['顺德区', '440600', 'shun de qu'],
            '440607': ['三水区', '440600', 'san shui qu'],
            '440608': ['高明区', '440600', 'gao ming qu'],
            '440609': ['其它区', '440600', 'qi ta qu'],
            '440700': ['江门市', '440000', 'jiang men shi'],
            '440703': ['蓬江区', '440700', 'peng jiang qu'],
            '440704': ['江海区', '440700', 'jiang hai qu'],
            '440705': ['新会区', '440700', 'xin hui qu'],
            '440781': ['台山市', '440700', 'tai shan shi'],
            '440783': ['开平市', '440700', 'kai ping shi'],
            '440784': ['鹤山市', '440700', 'he shan shi'],
            '440785': ['恩平市', '440700', 'en ping shi'],
            '440786': ['其它区', '440700', 'qi ta qu'],
            '440800': ['湛江市', '440000', 'zhan jiang shi'],
            '440802': ['赤坎区', '440800', 'chi kan qu'],
            '440803': ['霞山区', '440800', 'xia shan qu'],
            '440804': ['坡头区', '440800', 'po tou qu'],
            '440811': ['麻章区', '440800', 'ma zhang qu'],
            '440823': ['遂溪县', '440800', 'sui xi xian'],
            '440825': ['徐闻县', '440800', 'xu wen xian'],
            '440881': ['廉江市', '440800', 'lian jiang shi'],
            '440882': ['雷州市', '440800', 'lei zhou shi'],
            '440883': ['吴川市', '440800', 'wu chuan shi'],
            '440884': ['其它区', '440800', 'qi ta qu'],
            '440900': ['茂名市', '440000', 'mao ming shi'],
            '440902': ['茂南区', '440900', 'mao nan qu'],
            '440903': ['茂港区', '440900', 'mao gang qu'],
            '440923': ['电白县', '440900', 'dian bai xian'],
            '440981': ['高州市', '440900', 'gao zhou shi'],
            '440982': ['化州市', '440900', 'hua zhou shi'],
            '440983': ['信宜市', '440900', 'shen yi shi'],
            '440984': ['其它区', '440900', 'qi ta qu'],
            '441200': ['肇庆市', '440000', 'zhao qing shi'],
            '441202': ['端州区', '441200', 'duan zhou qu'],
            '441203': ['鼎湖区', '441200', 'ding hu qu'],
            '441223': ['广宁县', '441200', 'guang ning xian'],
            '441224': ['怀集县', '441200', 'huai ji xian'],
            '441225': ['封开县', '441200', 'feng kai xian'],
            '441226': ['德庆县', '441200', 'de qing xian'],
            '441283': ['高要市', '441200', 'gao yao shi'],
            '441284': ['四会市', '441200', 'si hui shi'],
            '441285': ['其它区', '441200', 'qi ta qu'],
            '441300': ['惠州市', '440000', 'hui zhou shi'],
            '441302': ['惠城区', '441300', 'hui cheng qu'],
            '441303': ['惠阳区', '441300', 'hui yang qu'],
            '441322': ['博罗县', '441300', 'bo luo xian'],
            '441323': ['惠东县', '441300', 'hui dong xian'],
            '441324': ['龙门县', '441300', 'long men xian'],
            '441325': ['其它区', '441300', 'qi ta qu'],
            '441400': ['梅州市', '440000', 'mei zhou shi'],
            '441402': ['梅江区', '441400', 'mei jiang qu'],
            '441421': ['梅县', '441400', 'mei xian'],
            '441422': ['大埔县', '441400', 'da bu xian'],
            '441423': ['丰顺县', '441400', 'feng shun xian'],
            '441424': ['五华县', '441400', 'wu hua xian'],
            '441426': ['平远县', '441400', 'ping yuan xian'],
            '441427': ['蕉岭县', '441400', 'jiao ling xian'],
            '441481': ['兴宁市', '441400', 'xing ning shi'],
            '441482': ['其它区', '441400', 'qi ta qu'],
            '441500': ['汕尾市', '440000', 'shan wei shi'],
            '441502': ['城区', '441500', 'cheng qu'],
            '441521': ['海丰县', '441500', 'hai feng xian'],
            '441523': ['陆河县', '441500', 'lu he xian'],
            '441581': ['陆丰市', '441500', 'lu feng shi'],
            '441582': ['其它区', '441500', 'qi ta qu'],
            '441600': ['河源市', '440000', 'he yuan shi'],
            '441602': ['源城区', '441600', 'yuan cheng qu'],
            '441621': ['紫金县', '441600', 'zi jin xian'],
            '441622': ['龙川县', '441600', 'long chuan xian'],
            '441623': ['连平县', '441600', 'lian ping xian'],
            '441624': ['和平县', '441600', 'he ping xian'],
            '441625': ['东源县', '441600', 'dong yuan xian'],
            '441626': ['其它区', '441600', 'qi ta qu'],
            '441700': ['阳江市', '440000', 'yang jiang shi'],
            '441702': ['江城区', '441700', 'jiang cheng qu'],
            '441721': ['阳西县', '441700', 'yang xi xian'],
            '441723': ['阳东县', '441700', 'yang dong xian'],
            '441781': ['阳春市', '441700', 'yang chun shi'],
            '441782': ['其它区', '441700', 'qi ta qu'],
            '441800': ['清远市', '440000', 'qing yuan shi'],
            '441802': ['清城区', '441800', 'qing cheng qu'],
            '441821': ['佛冈县', '441800', 'fo gang xian'],
            '441823': ['阳山县', '441800', 'yang shan xian'],
            '441825': ['连山壮族瑶族自治县', '441800', 'lian shan zhuang zu yao zu zi zhi xian'],
            '441826': ['连南瑶族自治县', '441800', 'lian nan yao zu zi zhi xian'],
            '441827': ['清新县', '441800', 'qing xin xian'],
            '441881': ['英德市', '441800', 'ying de shi'],
            '441882': ['连州市', '441800', 'lian zhou shi'],
            '441883': ['其它区', '441800', 'qi ta qu'],
            '441900': ['东莞市', '440000', 'dong guan shi'],
            '442000': ['中山市', '440000', 'zhong shan shi'],
            '445100': ['潮州市', '440000', 'chao zhou shi'],
            '445102': ['湘桥区', '445100', 'xiang qiao qu'],
            '445121': ['潮安县', '445100', 'chao an xian'],
            '445122': ['饶平县', '445100', 'rao ping xian'],
            '445185': ['枫溪区', '445100', 'feng xi qu'],
            '445186': ['其它区', '445100', 'qi ta qu'],
            '445200': ['揭阳市', '440000', 'jie yang shi'],
            '445202': ['榕城区', '445200', 'rong cheng qu'],
            '445221': ['揭东县', '445200', 'jie dong xian'],
            '445222': ['揭西县', '445200', 'jie xi xian'],
            '445224': ['惠来县', '445200', 'hui lai xian'],
            '445281': ['普宁市', '445200', 'pu ning shi'],
            '445284': ['东山区', '445200', 'dong shan qu'],
            '445285': ['其它区', '445200', 'qi ta qu'],
            '445300': ['云浮市', '440000', 'yun fu shi'],
            '445302': ['云城区', '445300', 'yun cheng qu'],
            '445321': ['新兴县', '445300', 'xin xing xian'],
            '445322': ['郁南县', '445300', 'yu nan xian'],
            '445323': ['云安县', '445300', 'yun an xian'],
            '445381': ['罗定市', '445300', 'luo ding shi'],
            '445382': ['其它区', '445300', 'qi ta qu'],
            '450000': ['广西壮族自治区', '1', 'guang xi zhuang zu zi zhi qu'],
            '450100': ['南宁市', '450000', 'nan ning shi'],
            '450102': ['兴宁区', '450100', 'xing ning qu'],
            '450103': ['青秀区', '450100', 'qing xiu qu'],
            '450105': ['江南区', '450100', 'jiang nan qu'],
            '450107': ['西乡塘区', '450100', 'xi xiang tang qu'],
            '450108': ['良庆区', '450100', 'liang qing qu'],
            '450109': ['邕宁区', '450100', 'yong ning qu'],
            '450122': ['武鸣县', '450100', 'wu ming xian'],
            '450123': ['隆安县', '450100', 'long an xian'],
            '450124': ['马山县', '450100', 'ma shan xian'],
            '450125': ['上林县', '450100', 'shang lin xian'],
            '450126': ['宾阳县', '450100', 'bin yang xian'],
            '450127': ['横县', '450100', 'heng xian'],
            '450128': ['其它区', '450100', 'qi ta qu'],
            '450200': ['柳州市', '450000', 'liu zhou shi'],
            '450202': ['城中区', '450200', 'cheng zhong qu'],
            '450203': ['鱼峰区', '450200', 'yu feng qu'],
            '450204': ['柳南区', '450200', 'liu nan qu'],
            '450205': ['柳北区', '450200', 'liu bei qu'],
            '450221': ['柳江县', '450200', 'liu jiang xian'],
            '450222': ['柳城县', '450200', 'liu cheng xian'],
            '450223': ['鹿寨县', '450200', 'lu zhai xian'],
            '450224': ['融安县', '450200', 'rong an xian'],
            '450225': ['融水苗族自治县', '450200', 'rong shui miao zu zi zhi xian'],
            '450226': ['三江侗族自治县', '450200', 'san jiang dong zu zi zhi xian'],
            '450227': ['其它区', '450200', 'qi ta qu'],
            '450300': ['桂林市', '450000', 'gui lin shi'],
            '450302': ['秀峰区', '450300', 'xiu feng qu'],
            '450303': ['叠彩区', '450300', 'die cai qu'],
            '450304': ['象山区', '450300', 'xiang shan qu'],
            '450305': ['七星区', '450300', 'qi xing qu'],
            '450311': ['雁山区', '450300', 'yan shan qu'],
            '450321': ['阳朔县', '450300', 'yang shuo xian'],
            '450322': ['临桂县', '450300', 'lin gui xian'],
            '450323': ['灵川县', '450300', 'ling chuan xian'],
            '450324': ['全州县', '450300', 'quan zhou xian'],
            '450325': ['兴安县', '450300', 'xing an xian'],
            '450326': ['永福县', '450300', 'yong fu xian'],
            '450327': ['灌阳县', '450300', 'guan yang xian'],
            '450328': ['龙胜各族自治县', '450300', 'long sheng ge zu zi zhi xian'],
            '450329': ['资源县', '450300', 'zi yuan xian'],
            '450330': ['平乐县', '450300', 'ping le xian'],
            '450331': ['荔浦县', '450300', 'li pu xian'],
            '450332': ['恭城瑶族自治县', '450300', 'gong cheng yao zu zi zhi xian'],
            '450333': ['其它区', '450300', 'qi ta qu'],
            '450400': ['梧州市', '450000', 'wu zhou shi'],
            '450403': ['万秀区', '450400', 'wan xiu qu'],
            '450404': ['蝶山区', '450400', 'die shan qu'],
            '450405': ['长洲区', '450400', 'chang zhou qu'],
            '450421': ['苍梧县', '450400', 'cang wu xian'],
            '450422': ['藤县', '450400', 'teng xian'],
            '450423': ['蒙山县', '450400', 'meng shan xian'],
            '450481': ['岑溪市', '450400', 'cen xi shi'],
            '450482': ['其它区', '450400', 'qi ta qu'],
            '450500': ['北海市', '450000', 'bei hai shi'],
            '450502': ['海城区', '450500', 'hai cheng qu'],
            '450503': ['银海区', '450500', 'yin hai qu'],
            '450512': ['铁山港区', '450500', 'tie shan gang qu'],
            '450521': ['合浦县', '450500', 'he pu xian'],
            '450522': ['其它区', '450500', 'qi ta qu'],
            '450600': ['防城港市', '450000', 'fang cheng gang shi'],
            '450602': ['港口区', '450600', 'gang kou qu'],
            '450603': ['防城区', '450600', 'fang cheng qu'],
            '450621': ['上思县', '450600', 'shang si xian'],
            '450681': ['东兴市', '450600', 'dong xing shi'],
            '450682': ['其它区', '450600', 'qi ta qu'],
            '450700': ['钦州市', '450000', 'qin zhou shi'],
            '450702': ['钦南区', '450700', 'qin nan qu'],
            '450703': ['钦北区', '450700', 'qin bei qu'],
            '450721': ['灵山县', '450700', 'ling shan xian'],
            '450722': ['浦北县', '450700', 'pu bei xian'],
            '450723': ['其它区', '450700', 'qi ta qu'],
            '450800': ['贵港市', '450000', 'gui gang shi'],
            '450802': ['港北区', '450800', 'gang bei qu'],
            '450803': ['港南区', '450800', 'gang nan qu'],
            '450804': ['覃塘区', '450800', 'qin tang qu'],
            '450821': ['平南县', '450800', 'ping nan xian'],
            '450881': ['桂平市', '450800', 'gui ping shi'],
            '450882': ['其它区', '450800', 'qi ta qu'],
            '450900': ['玉林市', '450000', 'yu lin shi'],
            '450902': ['玉州区', '450900', 'yu zhou qu'],
            '450921': ['容县', '450900', 'rong xian'],
            '450922': ['陆川县', '450900', 'lu chuan xian'],
            '450923': ['博白县', '450900', 'bo bai xian'],
            '450924': ['兴业县', '450900', 'xing ye xian'],
            '450981': ['北流市', '450900', 'bei liu shi'],
            '450982': ['其它区', '450900', 'qi ta qu'],
            '451000': ['百色市', '450000', 'bo se shi'],
            '451002': ['右江区', '451000', 'you jiang qu'],
            '451021': ['田阳县', '451000', 'tian yang xian'],
            '451022': ['田东县', '451000', 'tian dong xian'],
            '451023': ['平果县', '451000', 'ping guo xian'],
            '451024': ['德保县', '451000', 'de bao xian'],
            '451025': ['靖西县', '451000', 'jing xi xian'],
            '451026': ['那坡县', '451000', 'na po xian'],
            '451027': ['凌云县', '451000', 'ling yun xian'],
            '451028': ['乐业县', '451000', 'le ye xian'],
            '451029': ['田林县', '451000', 'tian lin xian'],
            '451030': ['西林县', '451000', 'xi lin xian'],
            '451031': ['隆林各族自治县', '451000', 'long lin ge zu zi zhi xian'],
            '451032': ['其它区', '451000', 'qi ta qu'],
            '451100': ['贺州市', '450000', 'he zhou shi'],
            '451102': ['八步区', '451100', 'ba bu qu'],
            '451121': ['昭平县', '451100', 'zhao ping xian'],
            '451122': ['钟山县', '451100', 'zhong shan xian'],
            '451123': ['富川瑶族自治县', '451100', 'fu chuan yao zu zi zhi xian'],
            '451124': ['其它区', '451100', 'qi ta qu'],
            '451200': ['河池市', '450000', 'he chi shi'],
            '451202': ['金城江区', '451200', 'jin cheng jiang qu'],
            '451221': ['南丹县', '451200', 'nan dan xian'],
            '451222': ['天峨县', '451200', 'tian e xian'],
            '451223': ['凤山县', '451200', 'feng shan xian'],
            '451224': ['东兰县', '451200', 'dong lan xian'],
            '451225': ['罗城仫佬族自治县', '451200', 'luo cheng mu lao zu zi zhi xian'],
            '451226': ['环江毛南族自治县', '451200', 'huan jiang mao nan zu zi zhi xian'],
            '451227': ['巴马瑶族自治县', '451200', 'ba ma yao zu zi zhi xian'],
            '451228': ['都安瑶族自治县', '451200', 'du an yao zu zi zhi xian'],
            '451229': ['大化瑶族自治县', '451200', 'da hua yao zu zi zhi xian'],
            '451281': ['宜州市', '451200', 'yi zhou shi'],
            '451282': ['其它区', '451200', 'qi ta qu'],
            '451300': ['来宾市', '450000', 'lai bin shi'],
            '451302': ['兴宾区', '451300', 'xing bin qu'],
            '451321': ['忻城县', '451300', 'xin cheng xian'],
            '451322': ['象州县', '451300', 'xiang zhou xian'],
            '451323': ['武宣县', '451300', 'wu xuan xian'],
            '451324': ['金秀瑶族自治县', '451300', 'jin xiu yao zu zi zhi xian'],
            '451381': ['合山市', '451300', 'he shan shi'],
            '451382': ['其它区', '451300', 'qi ta qu'],
            '451400': ['崇左市', '450000', 'chong zuo shi'],
            '451402': ['江洲区', '451400', 'jiang zhou qu'],
            '451421': ['扶绥县', '451400', 'fu sui xian'],
            '451422': ['宁明县', '451400', 'ning ming xian'],
            '451423': ['龙州县', '451400', 'long zhou xian'],
            '451424': ['大新县', '451400', 'da xin xian'],
            '451425': ['天等县', '451400', 'tian deng xian'],
            '451481': ['凭祥市', '451400', 'ping xiang shi'],
            '451482': ['其它区', '451400', 'qi ta qu'],
            '460000': ['海南省', '1', 'hai nan sheng'],
            '460100': ['海口市', '460000', 'hai kou shi'],
            '460105': ['秀英区', '460100', 'xiu ying qu'],
            '460106': ['龙华区', '460100', 'long hua qu'],
            '460107': ['琼山区', '460100', 'qiong shan qu'],
            '460108': ['美兰区', '460100', 'mei lan qu'],
            '460109': ['其它区', '460100', 'qi ta qu'],
            '460200': ['三亚市', '460000', 'san ya shi'],
            '469001': ['五指山市', '460000', 'wu zhi shan shi'],
            '469002': ['琼海市', '460000', 'qiong hai shi'],
            '469003': ['儋州市', '460000', 'dan zhou shi'],
            '469005': ['文昌市', '460000', 'wen chang shi'],
            '469006': ['万宁市', '460000', 'wan ning shi'],
            '469007': ['东方市', '460000', 'dong fang shi'],
            '469025': ['定安县', '460000', 'ding an xian'],
            '469026': ['屯昌县', '460000', 'tun chang xian'],
            '469027': ['澄迈县', '460000', 'cheng mai xian'],
            '469028': ['临高县', '460000', 'lin gao xian'],
            '469030': ['白沙黎族自治县', '460000', 'bai sha li zu zi zhi xian'],
            '469031': ['昌江黎族自治县', '460000', 'chang jiang li zu zi zhi xian'],
            '469033': ['乐东黎族自治县', '460000', 'le dong li zu zi zhi xian'],
            '469034': ['陵水黎族自治县', '460000', 'ling shui li zu zi zhi xian'],
            '469035': ['保亭黎族苗族自治县', '460000', 'bao ting li zu miao zu zi zhi xian'],
            '469036': ['琼中黎族苗族自治县', '460000', 'qiong zhong li zu miao zu zi zhi xian'],
            '469037': ['西沙群岛', '460000', 'xi sha qun dao'],
            '469038': ['南沙群岛', '460000', 'nan sha qun dao'],
            '469039': ['中沙群岛的岛礁及其海域', '460000', 'zhong sha qun dao de dao jiao ji qi hai yu'],
            '471004': ['高新区', '410300', 'gao xin qu'],
            '471005': ['其它区', '410300', 'qi ta qu'],
            '500000': ['重庆', '1', 'chong qing'],
            '500100': ['重庆市', '500000', 'chong qing shi'],
            '500101': ['万州区', '500100', 'wan zhou qu'],
            '500102': ['涪陵区', '500100', 'fu ling qu'],
            '500103': ['渝中区', '500100', 'yu zhong qu'],
            '500104': ['大渡口区', '500100', 'da du kou qu'],
            '500105': ['江北区', '500100', 'jiang bei qu'],
            '500106': ['沙坪坝区', '500100', 'sha ping ba qu'],
            '500107': ['九龙坡区', '500100', 'jiu long po qu'],
            '500108': ['南岸区', '500100', 'nan an qu'],
            '500109': ['北碚区', '500100', 'bei bei qu'],
            '500110': ['万盛区', '500100', 'wan sheng qu'],
            '500111': ['双桥区', '500100', 'shuang qiao qu'],
            '500112': ['渝北区', '500100', 'yu bei qu'],
            '500113': ['巴南区', '500100', 'ba nan qu'],
            '500114': ['黔江区', '500100', 'qian jiang qu'],
            '500115': ['长寿区', '500100', 'chang shou qu'],
            '500222': ['綦江县', '500100', 'qi jiang xian'],
            '500223': ['潼南县', '500100', 'tong nan xian'],
            '500224': ['铜梁县', '500100', 'tong liang xian'],
            '500225': ['大足县', '500100', 'da zu xian'],
            '500226': ['荣昌县', '500100', 'rong chang xian'],
            '500227': ['璧山县', '500100', 'bi shan xian'],
            '500228': ['梁平县', '500100', 'liang ping xian'],
            '500229': ['城口县', '500100', 'cheng kou xian'],
            '500230': ['丰都县', '500100', 'feng du xian'],
            '500231': ['垫江县', '500100', 'dian jiang xian'],
            '500232': ['武隆县', '500100', 'wu long xian'],
            '500233': ['忠县', '500100', 'zhong xian'],
            '500234': ['开县', '500100', 'kai xian'],
            '500235': ['云阳县', '500100', 'yun yang xian'],
            '500236': ['奉节县', '500100', 'feng jie xian'],
            '500237': ['巫山县', '500100', 'wu shan xian'],
            '500238': ['巫溪县', '500100', 'wu xi xian'],
            '500240': ['石柱土家族自治县', '500100', 'shi zhu tu jia zu zi zhi xian'],
            '500241': ['秀山土家族苗族自治县', '500100', 'xiu shan tu jia zu miao zu zi zhi xian'],
            '500242': ['酉阳土家族苗族自治县', '500100', 'you yang tu jia zu miao zu zi zhi xian'],
            '500243': ['彭水苗族土家族自治县', '500100', 'peng shui miao zu tu jia zu zi zhi xian'],
            '500381': ['江津区', '500100', 'jiang jin qu'],
            '500382': ['合川区', '500100', 'he chuan qu'],
            '500383': ['永川区', '500100', 'yong chuan qu'],
            '500384': ['南川区', '500100', 'nan chuan qu'],
            '500385': ['其它区', '500100', 'qi ta qu'],
            '510000': ['四川省', '1', 'si chuan sheng'],
            '510100': ['成都市', '510000', 'cheng du shi'],
            '510104': ['锦江区', '510100', 'jin jiang qu'],
            '510105': ['青羊区', '510100', 'qing yang qu'],
            '510106': ['金牛区', '510100', 'jin niu qu'],
            '510107': ['武侯区', '510100', 'wu hou qu'],
            '510108': ['成华区', '510100', 'cheng hua qu'],
            '510112': ['龙泉驿区', '510100', 'long quan yi qu'],
            '510113': ['青白江区', '510100', 'qing bai jiang qu'],
            '510114': ['新都区', '510100', 'xin du qu'],
            '510115': ['温江区', '510100', 'wen jiang qu'],
            '510121': ['金堂县', '510100', 'jin tang xian'],
            '510122': ['双流县', '510100', 'shuang liu xian'],
            '510124': ['郫县', '510100', 'pi xian'],
            '510129': ['大邑县', '510100', 'da yi xian'],
            '510131': ['蒲江县', '510100', 'pu jiang xian'],
            '510132': ['新津县', '510100', 'xin jin xian'],
            '510181': ['都江堰市', '510100', 'du jiang yan shi'],
            '510182': ['彭州市', '510100', 'peng zhou shi'],
            '510183': ['邛崃市', '510100', 'qiong lai shi'],
            '510184': ['崇州市', '510100', 'chong zhou shi'],
            '510185': ['其它区', '510100', 'qi ta qu'],
            '510300': ['自贡市', '510000', 'zi gong shi'],
            '510302': ['自流井区', '510300', 'zi liu jing qu'],
            '510303': ['贡井区', '510300', 'gong jing qu'],
            '510304': ['大安区', '510300', 'da an qu'],
            '510311': ['沿滩区', '510300', 'yan tan qu'],
            '510321': ['荣县', '510300', 'rong xian'],
            '510322': ['富顺县', '510300', 'fu shun xian'],
            '510323': ['其它区', '510300', 'qi ta qu'],
            '510400': ['攀枝花市', '510000', 'pan zhi hua shi'],
            '510402': ['东区', '510400', 'dong qu'],
            '510403': ['西区', '510400', 'xi qu'],
            '510411': ['仁和区', '510400', 'ren he qu'],
            '510421': ['米易县', '510400', 'mi yi xian'],
            '510422': ['盐边县', '510400', 'yan bian xian'],
            '510423': ['其它区', '510400', 'qi ta qu'],
            '510500': ['泸州市', '510000', 'lu zhou shi'],
            '510502': ['江阳区', '510500', 'jiang yang qu'],
            '510503': ['纳溪区', '510500', 'na xi qu'],
            '510504': ['龙马潭区', '510500', 'long ma tan qu'],
            '510521': ['泸县', '510500', 'lu xian'],
            '510522': ['合江县', '510500', 'he jiang xian'],
            '510524': ['叙永县', '510500', 'xu yong xian'],
            '510525': ['古蔺县', '510500', 'gu lin xian'],
            '510526': ['其它区', '510500', 'qi ta qu'],
            '510600': ['德阳市', '510000', 'de yang shi'],
            '510603': ['旌阳区', '510600', 'jing yang qu'],
            '510623': ['中江县', '510600', 'zhong jiang xian'],
            '510626': ['罗江县', '510600', 'luo jiang xian'],
            '510681': ['广汉市', '510600', 'guang han shi'],
            '510682': ['什邡市', '510600', 'shi fang shi'],
            '510683': ['绵竹市', '510600', 'mian zhu shi'],
            '510684': ['其它区', '510600', 'qi ta qu'],
            '510700': ['绵阳市', '510000', 'mian yang shi'],
            '510703': ['涪城区', '510700', 'fu cheng qu'],
            '510704': ['游仙区', '510700', 'you xian qu'],
            '510722': ['三台县', '510700', 'san tai xian'],
            '510723': ['盐亭县', '510700', 'yan ting xian'],
            '510724': ['安县', '510700', 'an xian'],
            '510725': ['梓潼县', '510700', 'zi tong xian'],
            '510726': ['北川羌族自治县', '510700', 'bei chuan qiang zu zi zhi xian'],
            '510727': ['平武县', '510700', 'ping wu xian'],
            '510751': ['高新区', '510700', 'gao xin qu'],
            '510781': ['江油市', '510700', 'jiang you shi'],
            '510782': ['其它区', '510700', 'qi ta qu'],
            '510800': ['广元市', '510000', 'guang yuan shi'],
            '510802': ['利州区', '510800', 'li zhou qu'],
            '510811': ['元坝区', '510800', 'yuan ba qu'],
            '510812': ['朝天区', '510800', 'chao tian qu'],
            '510821': ['旺苍县', '510800', 'wang cang xian'],
            '510822': ['青川县', '510800', 'qing chuan xian'],
            '510823': ['剑阁县', '510800', 'jian ge xian'],
            '510824': ['苍溪县', '510800', 'cang xi xian'],
            '510825': ['其它区', '510800', 'qi ta qu'],
            '510900': ['遂宁市', '510000', 'sui ning shi'],
            '510903': ['船山区', '510900', 'chuan shan qu'],
            '510904': ['安居区', '510900', 'an ju qu'],
            '510921': ['蓬溪县', '510900', 'peng xi xian'],
            '510922': ['射洪县', '510900', 'she hong xian'],
            '510923': ['大英县', '510900', 'da ying xian'],
            '510924': ['其它区', '510900', 'qi ta qu'],
            '511000': ['内江市', '510000', 'nei jiang shi'],
            '511002': ['市中区', '511000', 'shi zhong qu'],
            '511011': ['东兴区', '511000', 'dong xing qu'],
            '511024': ['威远县', '511000', 'wei yuan xian'],
            '511025': ['资中县', '511000', 'zi zhong xian'],
            '511028': ['隆昌县', '511000', 'long chang xian'],
            '511029': ['其它区', '511000', 'qi ta qu'],
            '511100': ['乐山市', '510000', 'le shan shi'],
            '511102': ['市中区', '511100', 'shi zhong qu'],
            '511111': ['沙湾区', '511100', 'sha wan qu'],
            '511112': ['五通桥区', '511100', 'wu tong qiao qu'],
            '511113': ['金口河区', '511100', 'jin kou he qu'],
            '511123': ['犍为县', '511100', 'qian wei xian'],
            '511124': ['井研县', '511100', 'jing yan xian'],
            '511126': ['夹江县', '511100', 'jia jiang xian'],
            '511129': ['沐川县', '511100', 'mu chuan xian'],
            '511132': ['峨边彝族自治县', '511100', 'e bian yi zu zi zhi xian'],
            '511133': ['马边彝族自治县', '511100', 'ma bian yi zu zi zhi xian'],
            '511181': ['峨眉山市', '511100', 'e mei shan shi'],
            '511182': ['其它区', '511100', 'qi ta qu'],
            '511300': ['南充市', '510000', 'nan chong shi'],
            '511302': ['顺庆区', '511300', 'shun qing qu'],
            '511303': ['高坪区', '511300', 'gao ping qu'],
            '511304': ['嘉陵区', '511300', 'jia ling qu'],
            '511321': ['南部县', '511300', 'nan bu xian'],
            '511322': ['营山县', '511300', 'ying shan xian'],
            '511323': ['蓬安县', '511300', 'peng an xian'],
            '511324': ['仪陇县', '511300', 'yi long xian'],
            '511325': ['西充县', '511300', 'xi chong xian'],
            '511381': ['阆中市', '511300', 'lang zhong shi'],
            '511382': ['其它区', '511300', 'qi ta qu'],
            '511400': ['眉山市', '510000', 'mei shan shi'],
            '511402': ['东坡区', '511400', 'dong po qu'],
            '511421': ['仁寿县', '511400', 'ren shou xian'],
            '511422': ['彭山县', '511400', 'peng shan xian'],
            '511423': ['洪雅县', '511400', 'hong ya xian'],
            '511424': ['丹棱县', '511400', 'dan ling xian'],
            '511425': ['青神县', '511400', 'qing shen xian'],
            '511426': ['其它区', '511400', 'qi ta qu'],
            '511500': ['宜宾市', '510000', 'yi bin shi'],
            '511502': ['翠屏区', '511500', 'cui ping qu'],
            '511521': ['宜宾县', '511500', 'yi bin xian'],
            '511522': ['南溪县', '511500', 'nan xi xian'],
            '511523': ['江安县', '511500', 'jiang an xian'],
            '511524': ['长宁县', '511500', 'chang ning xian'],
            '511525': ['高县', '511500', 'gao xian'],
            '511526': ['珙县', '511500', 'gong xian'],
            '511527': ['筠连县', '511500', 'jun lian xian'],
            '511528': ['兴文县', '511500', 'xing wen xian'],
            '511529': ['屏山县', '511500', 'ping shan xian'],
            '511530': ['其它区', '511500', 'qi ta qu'],
            '511600': ['广安市', '510000', 'guang an shi'],
            '511602': ['广安区', '511600', 'guang an qu'],
            '511621': ['岳池县', '511600', 'yue chi xian'],
            '511622': ['武胜县', '511600', 'wu sheng xian'],
            '511623': ['邻水县', '511600', 'lin shui xian'],
            '511681': ['华蓥市', '511600', 'hua ying shi'],
            '511682': ['市辖区', '511600', 'shi xia qu'],
            '511683': ['其它区', '511600', 'qi ta qu'],
            '511700': ['达州市', '510000', 'da zhou shi'],
            '511702': ['通川区', '511700', 'tong chuan qu'],
            '511721': ['达县', '511700', 'da xian'],
            '511722': ['宣汉县', '511700', 'xuan han xian'],
            '511723': ['开江县', '511700', 'kai jiang xian'],
            '511724': ['大竹县', '511700', 'da zhu xian'],
            '511725': ['渠县', '511700', 'qu xian'],
            '511781': ['万源市', '511700', 'wan yuan shi'],
            '511782': ['其它区', '511700', 'qi ta qu'],
            '511800': ['雅安市', '510000', 'ya an shi'],
            '511802': ['雨城区', '511800', 'yu cheng qu'],
            '511821': ['名山县', '511800', 'ming shan xian'],
            '511822': ['荥经县', '511800', 'ying jing xian'],
            '511823': ['汉源县', '511800', 'han yuan xian'],
            '511824': ['石棉县', '511800', 'shi mian xian'],
            '511825': ['天全县', '511800', 'tian quan xian'],
            '511826': ['芦山县', '511800', 'lu shan xian'],
            '511827': ['宝兴县', '511800', 'bao xing xian'],
            '511828': ['其它区', '511800', 'qi ta qu'],
            '511900': ['巴中市', '510000', 'ba zhong shi'],
            '511902': ['巴州区', '511900', 'ba zhou qu'],
            '511921': ['通江县', '511900', 'tong jiang xian'],
            '511922': ['南江县', '511900', 'nan jiang xian'],
            '511923': ['平昌县', '511900', 'ping chang xian'],
            '511924': ['其它区', '511900', 'qi ta qu'],
            '512000': ['资阳市', '510000', 'zi yang shi'],
            '512002': ['雁江区', '512000', 'yan jiang qu'],
            '512021': ['安岳县', '512000', 'an yue xian'],
            '512022': ['乐至县', '512000', 'le zhi xian'],
            '512081': ['简阳市', '512000', 'jian yang shi'],
            '512082': ['其它区', '512000', 'qi ta qu'],
            '513200': ['阿坝藏族羌族自治州', '510000', 'a ba zang zu qiang zu zi zhi zhou'],
            '513221': ['汶川县', '513200', 'wen chuan xian'],
            '513222': ['理县', '513200', 'li xian'],
            '513223': ['茂县', '513200', 'mao xian'],
            '513224': ['松潘县', '513200', 'song pan xian'],
            '513225': ['九寨沟县', '513200', 'jiu zhai gou xian'],
            '513226': ['金川县', '513200', 'jin chuan xian'],
            '513227': ['小金县', '513200', 'xiao jin xian'],
            '513228': ['黑水县', '513200', 'hei shui xian'],
            '513229': ['马尔康县', '513200', 'ma er kang xian'],
            '513230': ['壤塘县', '513200', 'rang tang xian'],
            '513231': ['阿坝县', '513200', 'a ba xian'],
            '513232': ['若尔盖县', '513200', 'ruo er gai xian'],
            '513233': ['红原县', '513200', 'hong yuan xian'],
            '513234': ['其它区', '513200', 'qi ta qu'],
            '513300': ['甘孜藏族自治州', '510000', 'gan zi zang zu zi zhi zhou'],
            '513321': ['康定县', '513300', 'kang ding xian'],
            '513322': ['泸定县', '513300', 'lu ding xian'],
            '513323': ['丹巴县', '513300', 'dan ba xian'],
            '513324': ['九龙县', '513300', 'jiu long xian'],
            '513325': ['雅江县', '513300', 'ya jiang xian'],
            '513326': ['道孚县', '513300', 'dao fu xian'],
            '513327': ['炉霍县', '513300', 'lu huo xian'],
            '513328': ['甘孜县', '513300', 'gan zi xian'],
            '513329': ['新龙县', '513300', 'xin long xian'],
            '513330': ['德格县', '513300', 'de ge xian'],
            '513331': ['白玉县', '513300', 'bai yu xian'],
            '513332': ['石渠县', '513300', 'shi qu xian'],
            '513333': ['色达县', '513300', 'se da xian'],
            '513334': ['理塘县', '513300', 'li tang xian'],
            '513335': ['巴塘县', '513300', 'ba tang xian'],
            '513336': ['乡城县', '513300', 'xiang cheng xian'],
            '513337': ['稻城县', '513300', 'dao cheng xian'],
            '513338': ['得荣县', '513300', 'de rong xian'],
            '513339': ['其它区', '513300', 'qi ta qu'],
            '513400': ['凉山彝族自治州', '510000', 'liang shan yi zu zi zhi zhou'],
            '513401': ['西昌市', '513400', 'xi chang shi'],
            '513422': ['木里藏族自治县', '513400', 'mu li zang zu zi zhi xian'],
            '513423': ['盐源县', '513400', 'yan yuan xian'],
            '513424': ['德昌县', '513400', 'de chang xian'],
            '513425': ['会理县', '513400', 'hui li xian'],
            '513426': ['会东县', '513400', 'hui dong xian'],
            '513427': ['宁南县', '513400', 'ning nan xian'],
            '513428': ['普格县', '513400', 'pu ge xian'],
            '513429': ['布拖县', '513400', 'bu tuo xian'],
            '513430': ['金阳县', '513400', 'jin yang xian'],
            '513431': ['昭觉县', '513400', 'zhao jue xian'],
            '513432': ['喜德县', '513400', 'xi de xian'],
            '513433': ['冕宁县', '513400', 'mian ning xian'],
            '513434': ['越西县', '513400', 'yue xi xian'],
            '513435': ['甘洛县', '513400', 'gan luo xian'],
            '513436': ['美姑县', '513400', 'mei gu xian'],
            '513437': ['雷波县', '513400', 'lei bo xian'],
            '513438': ['其它区', '513400', 'qi ta qu'],
            '520000': ['贵州省', '1', 'gui zhou sheng'],
            '520100': ['贵阳市', '520000', 'gui yang shi'],
            '520102': ['南明区', '520100', 'nan ming qu'],
            '520103': ['云岩区', '520100', 'yun yan qu'],
            '520111': ['花溪区', '520100', 'hua xi qu'],
            '520112': ['乌当区', '520100', 'wu dang qu'],
            '520113': ['白云区', '520100', 'bai yun qu'],
            '520114': ['小河区', '520100', 'xiao he qu'],
            '520121': ['开阳县', '520100', 'kai yang xian'],
            '520122': ['息烽县', '520100', 'xi feng xian'],
            '520123': ['修文县', '520100', 'xiu wen xian'],
            '520151': ['金阳开发区', '520100', 'jin yang kai fa qu'],
            '520181': ['清镇市', '520100', 'qing zhen shi'],
            '520182': ['其它区', '520100', 'qi ta qu'],
            '520200': ['六盘水市', '520000', 'liu pan shui shi'],
            '520201': ['钟山区', '520200', 'zhong shan qu'],
            '520203': ['六枝特区', '520200', 'liu zhi te qu'],
            '520221': ['水城县', '520200', 'shui cheng xian'],
            '520222': ['盘县', '520200', 'pan xian'],
            '520223': ['其它区', '520200', 'qi ta qu'],
            '520300': ['遵义市', '520000', 'zun yi shi'],
            '520302': ['红花岗区', '520300', 'hong hua gang qu'],
            '520303': ['汇川区', '520300', 'hui chuan qu'],
            '520321': ['遵义县', '520300', 'zun yi xian'],
            '520322': ['桐梓县', '520300', 'tong zi xian'],
            '520323': ['绥阳县', '520300', 'sui yang xian'],
            '520324': ['正安县', '520300', 'zheng an xian'],
            '520325': ['道真仡佬族苗族自治县', '520300', 'dao zhen ge lao zu miao zu zi zhi xian'],
            '520326': ['务川仡佬族苗族自治县', '520300', 'wu chuan ge lao zu miao zu zi zhi xian'],
            '520327': ['凤冈县', '520300', 'feng gang xian'],
            '520328': ['湄潭县', '520300', 'mei tan xian'],
            '520329': ['余庆县', '520300', 'yu qing xian'],
            '520330': ['习水县', '520300', 'xi shui xian'],
            '520381': ['赤水市', '520300', 'chi shui shi'],
            '520382': ['仁怀市', '520300', 'ren huai shi'],
            '520383': ['其它区', '520300', 'qi ta qu'],
            '520400': ['安顺市', '520000', 'an shun shi'],
            '520402': ['西秀区', '520400', 'xi xiu qu'],
            '520421': ['平坝县', '520400', 'ping ba xian'],
            '520422': ['普定县', '520400', 'pu ding xian'],
            '520423': ['镇宁布依族苗族自治县', '520400', 'zhen ning bu yi zu miao zu zi zhi xian'],
            '520424': ['关岭布依族苗族自治县', '520400', 'guan ling bu yi zu miao zu zi zhi xian'],
            '520425': ['紫云苗族布依族自治县', '520400', 'zi yun miao zu bu yi zu zi zhi xian'],
            '520426': ['其它区', '520400', 'qi ta qu'],
            '522200': ['铜仁地区', '520000', 'tong ren di qu'],
            '522201': ['铜仁市', '522200', 'tong ren shi'],
            '522222': ['江口县', '522200', 'jiang kou xian'],
            '522223': ['玉屏侗族自治县', '522200', 'yu ping dong zu zi zhi xian'],
            '522224': ['石阡县', '522200', 'shi qian xian'],
            '522225': ['思南县', '522200', 'si nan xian'],
            '522226': ['印江土家族苗族自治县', '522200', 'yin jiang tu jia zu miao zu zi zhi xian'],
            '522227': ['德江县', '522200', 'de jiang xian'],
            '522228': ['沿河土家族自治县', '522200', 'yan he tu jia zu zi zhi xian'],
            '522229': ['松桃苗族自治县', '522200', 'song tao miao zu zi zhi xian'],
            '522230': ['万山特区', '522200', 'wan shan te qu'],
            '522231': ['其它区', '522200', 'qi ta qu'],
            '522300': ['黔西南布依族苗族自治州', '520000', 'qian xi nan bu yi zu miao zu zi zhi zhou'],
            '522301': ['兴义市', '522300', 'xing yi shi'],
            '522322': ['兴仁县', '522300', 'xing ren xian'],
            '522323': ['普安县', '522300', 'pu an xian'],
            '522324': ['晴隆县', '522300', 'qing long xian'],
            '522325': ['贞丰县', '522300', 'zhen feng xian'],
            '522326': ['望谟县', '522300', 'wang mo xian'],
            '522327': ['册亨县', '522300', 'ce heng xian'],
            '522328': ['安龙县', '522300', 'an long xian'],
            '522329': ['其它区', '522300', 'qi ta qu'],
            '522400': ['毕节地区', '520000', 'bi jie di qu'],
            '522401': ['毕节市', '522400', 'bi jie shi'],
            '522422': ['大方县', '522400', 'da fang xian'],
            '522423': ['黔西县', '522400', 'qian xi xian'],
            '522424': ['金沙县', '522400', 'jin sha xian'],
            '522425': ['织金县', '522400', 'zhi jin xian'],
            '522426': ['纳雍县', '522400', 'na yong xian'],
            '522427': ['威宁彝族回族苗族自治县', '522400', 'wei ning yi zu hui zu miao zu zi zhi xian'],
            '522428': ['赫章县', '522400', 'he zhang xian'],
            '522429': ['其它区', '522400', 'qi ta qu'],
            '522600': ['黔东南苗族侗族自治州', '520000', 'qian dong nan miao zu dong zu zi zhi zhou'],
            '522601': ['凯里市', '522600', 'kai li shi'],
            '522622': ['黄平县', '522600', 'huang ping xian'],
            '522623': ['施秉县', '522600', 'shi bing xian'],
            '522624': ['三穗县', '522600', 'san sui xian'],
            '522625': ['镇远县', '522600', 'zhen yuan xian'],
            '522626': ['岑巩县', '522600', 'cen gong xian'],
            '522627': ['天柱县', '522600', 'tian zhu xian'],
            '522628': ['锦屏县', '522600', 'jin ping xian'],
            '522629': ['剑河县', '522600', 'jian he xian'],
            '522630': ['台江县', '522600', 'tai jiang xian'],
            '522631': ['黎平县', '522600', 'li ping xian'],
            '522632': ['榕江县', '522600', 'rong jiang xian'],
            '522633': ['从江县', '522600', 'cong jiang xian'],
            '522634': ['雷山县', '522600', 'lei shan xian'],
            '522635': ['麻江县', '522600', 'ma jiang xian'],
            '522636': ['丹寨县', '522600', 'dan zhai xian'],
            '522637': ['其它区', '522600', 'qi ta qu'],
            '522700': ['黔南布依族苗族自治州', '520000', 'qian nan bu yi zu miao zu zi zhi zhou'],
            '522701': ['都匀市', '522700', 'du yun shi'],
            '522702': ['福泉市', '522700', 'fu quan shi'],
            '522722': ['荔波县', '522700', 'li bo xian'],
            '522723': ['贵定县', '522700', 'gui ding xian'],
            '522725': ['瓮安县', '522700', 'weng an xian'],
            '522726': ['独山县', '522700', 'du shan xian'],
            '522727': ['平塘县', '522700', 'ping tang xian'],
            '522728': ['罗甸县', '522700', 'luo dian xian'],
            '522729': ['长顺县', '522700', 'chang shun xian'],
            '522730': ['龙里县', '522700', 'long li xian'],
            '522731': ['惠水县', '522700', 'hui shui xian'],
            '522732': ['三都水族自治县', '522700', 'san du shui zu zi zhi xian'],
            '522733': ['其它区', '522700', 'qi ta qu'],
            '530000': ['云南省', '1', 'yun nan sheng'],
            '530100': ['昆明市', '530000', 'kun ming shi'],
            '530102': ['五华区', '530100', 'wu hua qu'],
            '530103': ['盘龙区', '530100', 'pan long qu'],
            '530111': ['官渡区', '530100', 'guan du qu'],
            '530112': ['西山区', '530100', 'xi shan qu'],
            '530113': ['东川区', '530100', 'dong chuan qu'],
            '530121': ['呈贡县', '530100', 'cheng gong xian'],
            '530122': ['晋宁县', '530100', 'jin ning xian'],
            '530124': ['富民县', '530100', 'fu min xian'],
            '530125': ['宜良县', '530100', 'yi liang xian'],
            '530126': ['石林彝族自治县', '530100', 'shi lin yi zu zi zhi xian'],
            '530127': ['嵩明县', '530100', 'song ming xian'],
            '530128': ['禄劝彝族苗族自治县', '530100', 'lu quan yi zu miao zu zi zhi xian'],
            '530129': ['寻甸回族彝族自治县', '530100', 'xun dian hui zu yi zu zi zhi xian'],
            '530181': ['安宁市', '530100', 'an ning shi'],
            '530182': ['其它区', '530100', 'qi ta qu'],
            '530300': ['曲靖市', '530000', 'qu jing shi'],
            '530302': ['麒麟区', '530300', 'qi lin qu'],
            '530321': ['马龙县', '530300', 'ma long xian'],
            '530322': ['陆良县', '530300', 'lu liang xian'],
            '530323': ['师宗县', '530300', 'shi zong xian'],
            '530324': ['罗平县', '530300', 'luo ping xian'],
            '530325': ['富源县', '530300', 'fu yuan xian'],
            '530326': ['会泽县', '530300', 'hui ze xian'],
            '530328': ['沾益县', '530300', 'zhan yi xian'],
            '530381': ['宣威市', '530300', 'xuan wei shi'],
            '530382': ['其它区', '530300', 'qi ta qu'],
            '530400': ['玉溪市', '530000', 'yu xi shi'],
            '530402': ['红塔区', '530400', 'hong ta qu'],
            '530421': ['江川县', '530400', 'jiang chuan xian'],
            '530422': ['澄江县', '530400', 'cheng jiang xian'],
            '530423': ['通海县', '530400', 'tong hai xian'],
            '530424': ['华宁县', '530400', 'hua ning xian'],
            '530425': ['易门县', '530400', 'yi men xian'],
            '530426': ['峨山彝族自治县', '530400', 'e shan yi zu zi zhi xian'],
            '530427': ['新平彝族傣族自治县', '530400', 'xin ping yi zu dai zu zi zhi xian'],
            '530428': ['元江哈尼族彝族傣族自治县', '530400', 'yuan jiang ha ni zu yi zu dai zu zi zhi xian'],
            '530429': ['其它区', '530400', 'qi ta qu'],
            '530500': ['保山市', '530000', 'bao shan shi'],
            '530502': ['隆阳区', '530500', 'long yang qu'],
            '530521': ['施甸县', '530500', 'shi dian xian'],
            '530522': ['腾冲县', '530500', 'teng chong xian'],
            '530523': ['龙陵县', '530500', 'long ling xian'],
            '530524': ['昌宁县', '530500', 'chang ning xian'],
            '530525': ['其它区', '530500', 'qi ta qu'],
            '530600': ['昭通市', '530000', 'zhao tong shi'],
            '530602': ['昭阳区', '530600', 'zhao yang qu'],
            '530621': ['鲁甸县', '530600', 'lu dian xian'],
            '530622': ['巧家县', '530600', 'qiao jia xian'],
            '530623': ['盐津县', '530600', 'yan jin xian'],
            '530624': ['大关县', '530600', 'da guan xian'],
            '530625': ['永善县', '530600', 'yong shan xian'],
            '530626': ['绥江县', '530600', 'sui jiang xian'],
            '530627': ['镇雄县', '530600', 'zhen xiong xian'],
            '530628': ['彝良县', '530600', 'yi liang xian'],
            '530629': ['威信县', '530600', 'wei shen xian'],
            '530630': ['水富县', '530600', 'shui fu xian'],
            '530631': ['其它区', '530600', 'qi ta qu'],
            '530700': ['丽江市', '530000', 'li jiang shi'],
            '530702': ['古城区', '530700', 'gu cheng qu'],
            '530721': ['玉龙纳西族自治县', '530700', 'yu long na xi zu zi zhi xian'],
            '530722': ['永胜县', '530700', 'yong sheng xian'],
            '530723': ['华坪县', '530700', 'hua ping xian'],
            '530724': ['宁蒗彝族自治县', '530700', 'ning lang yi zu zi zhi xian'],
            '530725': ['其它区', '530700', 'qi ta qu'],
            '530800': ['普洱市', '530000', 'pu er shi'],
            '530802': ['思茅区', '530800', 'si mao qu'],
            '530821': ['宁洱哈尼族彝族自治县', '530800', 'ning er ha ni zu yi zu zi zhi xian'],
            '530822': ['墨江哈尼族自治县', '530800', 'mo jiang ha ni zu zi zhi xian'],
            '530823': ['景东彝族自治县', '530800', 'jing dong yi zu zi zhi xian'],
            '530824': ['景谷傣族彝族自治县', '530800', 'jing gu dai zu yi zu zi zhi xian'],
            '530825': ['镇沅彝族哈尼族拉祜族自治县', '530800', 'zhen yuan yi zu ha ni zu la hu zu zi zhi xian'],
            '530826': ['江城哈尼族彝族自治县', '530800', 'jiang cheng ha ni zu yi zu zi zhi xian'],
            '530827': ['孟连傣族拉祜族佤族自治县', '530800', 'meng lian dai zu la hu zu wa zu zi zhi xian'],
            '530828': ['澜沧拉祜族自治县', '530800', 'lan cang la hu zu zi zhi xian'],
            '530829': ['西盟佤族自治县', '530800', 'xi meng wa zu zi zhi xian'],
            '530830': ['其它区', '530800', 'qi ta qu'],
            '530900': ['临沧市', '530000', 'lin cang shi'],
            '530902': ['临翔区', '530900', 'lin xiang qu'],
            '530921': ['凤庆县', '530900', 'feng qing xian'],
            '530922': ['云县', '530900', 'yun xian'],
            '530923': ['永德县', '530900', 'yong de xian'],
            '530924': ['镇康县', '530900', 'zhen kang xian'],
            '530925': ['双江拉祜族佤族布朗族傣族自治县', '530900', 'shuang jiang la hu zu wa zu bu lang zu dai zu zi zhi xian'],
            '530926': ['耿马傣族佤族自治县', '530900', 'geng ma dai zu wa zu zi zhi xian'],
            '530927': ['沧源佤族自治县', '530900', 'cang yuan wa zu zi zhi xian'],
            '530928': ['其它区', '530900', 'qi ta qu'],
            '532300': ['楚雄彝族自治州', '530000', 'chu xiong yi zu zi zhi zhou'],
            '532301': ['楚雄市', '532300', 'chu xiong shi'],
            '532322': ['双柏县', '532300', 'shuang bai xian'],
            '532323': ['牟定县', '532300', 'mu ding xian'],
            '532324': ['南华县', '532300', 'nan hua xian'],
            '532325': ['姚安县', '532300', 'yao an xian'],
            '532326': ['大姚县', '532300', 'da yao xian'],
            '532327': ['永仁县', '532300', 'yong ren xian'],
            '532328': ['元谋县', '532300', 'yuan mou xian'],
            '532329': ['武定县', '532300', 'wu ding xian'],
            '532331': ['禄丰县', '532300', 'lu feng xian'],
            '532332': ['其它区', '532300', 'qi ta qu'],
            '532500': ['红河哈尼族彝族自治州', '530000', 'hong he ha ni zu yi zu zi zhi zhou'],
            '532501': ['个旧市', '532500', 'ge jiu shi'],
            '532502': ['开远市', '532500', 'kai yuan shi'],
            '532522': ['蒙自县', '532500', 'meng zi xian'],
            '532523': ['屏边苗族自治县', '532500', 'ping bian miao zu zi zhi xian'],
            '532524': ['建水县', '532500', 'jian shui xian'],
            '532525': ['石屏县', '532500', 'shi ping xian'],
            '532526': ['弥勒县', '532500', 'mi le xian'],
            '532527': ['泸西县', '532500', 'lu xi xian'],
            '532528': ['元阳县', '532500', 'yuan yang xian'],
            '532529': ['红河县', '532500', 'hong he xian'],
            '532530': ['金平苗族瑶族傣族自治县', '532500', 'jin ping miao zu yao zu dai zu zi zhi xian'],
            '532531': ['绿春县', '532500', 'lv chun xian'],
            '532532': ['河口瑶族自治县', '532500', 'he kou yao zu zi zhi xian'],
            '532533': ['其它区', '532500', 'qi ta qu'],
            '532600': ['文山壮族苗族自治州', '530000', 'wen shan zhuang zu miao zu zi zhi zhou'],
            '532621': ['文山县', '532600', 'wen shan xian'],
            '532622': ['砚山县', '532600', 'yan shan xian'],
            '532623': ['西畴县', '532600', 'xi chou xian'],
            '532624': ['麻栗坡县', '532600', 'ma li po xian'],
            '532625': ['马关县', '532600', 'ma guan xian'],
            '532626': ['丘北县', '532600', 'qiu bei xian'],
            '532627': ['广南县', '532600', 'guang nan xian'],
            '532628': ['富宁县', '532600', 'fu ning xian'],
            '532629': ['其它区', '532600', 'qi ta qu'],
            '532800': ['西双版纳傣族自治州', '530000', 'xi shuang ban na dai zu zi zhi zhou'],
            '532801': ['景洪市', '532800', 'jing hong shi'],
            '532822': ['勐海县', '532800', 'meng hai xian'],
            '532823': ['勐腊县', '532800', 'meng la xian'],
            '532824': ['其它区', '532800', 'qi ta qu'],
            '532900': ['大理白族自治州', '530000', 'da li bai zu zi zhi zhou'],
            '532901': ['大理市', '532900', 'da li shi'],
            '532922': ['漾濞彝族自治县', '532900', 'yang bi yi zu zi zhi xian'],
            '532923': ['祥云县', '532900', 'xiang yun xian'],
            '532924': ['宾川县', '532900', 'bin chuan xian'],
            '532925': ['弥渡县', '532900', 'mi du xian'],
            '532926': ['南涧彝族自治县', '532900', 'nan jian yi zu zi zhi xian'],
            '532927': ['巍山彝族回族自治县', '532900', 'wei shan yi zu hui zu zi zhi xian'],
            '532928': ['永平县', '532900', 'yong ping xian'],
            '532929': ['云龙县', '532900', 'yun long xian'],
            '532930': ['洱源县', '532900', 'er yuan xian'],
            '532931': ['剑川县', '532900', 'jian chuan xian'],
            '532932': ['鹤庆县', '532900', 'he qing xian'],
            '532933': ['其它区', '532900', 'qi ta qu'],
            '533100': ['德宏傣族景颇族自治州', '530000', 'de hong dai zu jing po zu zi zhi zhou'],
            '533102': ['瑞丽市', '533100', 'rui li shi'],
            '533103': ['潞西市', '533100', 'lu xi shi'],
            '533122': ['梁河县', '533100', 'liang he xian'],
            '533123': ['盈江县', '533100', 'ying jiang xian'],
            '533124': ['陇川县', '533100', 'long chuan xian'],
            '533125': ['其它区', '533100', 'qi ta qu'],
            '533300': ['怒江傈僳族自治州', '530000', 'nu jiang li su zu zi zhi zhou'],
            '533321': ['泸水县', '533300', 'lu shui xian'],
            '533323': ['福贡县', '533300', 'fu gong xian'],
            '533324': ['贡山独龙族怒族自治县', '533300', 'gong shan du long zu nu zu zi zhi xian'],
            '533325': ['兰坪白族普米族自治县', '533300', 'lan ping bai zu pu mi zu zi zhi xian'],
            '533326': ['其它区', '533300', 'qi ta qu'],
            '533400': ['迪庆藏族自治州', '530000', 'di qing zang zu zi zhi zhou'],
            '533421': ['香格里拉县', '533400', 'xiang ge li la xian'],
            '533422': ['德钦县', '533400', 'de qin xian'],
            '533423': ['维西傈僳族自治县', '533400', 'wei xi li su zu zi zhi xian'],
            '533424': ['其它区', '533400', 'qi ta qu'],
            '540000': ['西藏自治区', '1', 'xi zang zi zhi qu'],
            '540100': ['拉萨市', '540000', 'la sa shi'],
            '540102': ['城关区', '540100', 'cheng guan qu'],
            '540121': ['林周县', '540100', 'lin zhou xian'],
            '540122': ['当雄县', '540100', 'dang xiong xian'],
            '540123': ['尼木县', '540100', 'ni mu xian'],
            '540124': ['曲水县', '540100', 'qu shui xian'],
            '540125': ['堆龙德庆县', '540100', 'dui long de qing xian'],
            '540126': ['达孜县', '540100', 'da zi xian'],
            '540127': ['墨竹工卡县', '540100', 'mo zhu gong ka xian'],
            '540128': ['其它区', '540100', 'qi ta qu'],
            '542100': ['昌都地区', '540000', 'chang du di qu'],
            '542121': ['昌都县', '542100', 'chang du xian'],
            '542122': ['江达县', '542100', 'jiang da xian'],
            '542123': ['贡觉县', '542100', 'gong jue xian'],
            '542124': ['类乌齐县', '542100', 'lei wu qi xian'],
            '542125': ['丁青县', '542100', 'ding qing xian'],
            '542126': ['察雅县', '542100', 'cha ya xian'],
            '542127': ['八宿县', '542100', 'ba su xian'],
            '542128': ['左贡县', '542100', 'zuo gong xian'],
            '542129': ['芒康县', '542100', 'mang kang xian'],
            '542132': ['洛隆县', '542100', 'luo long xian'],
            '542133': ['边坝县', '542100', 'bian ba xian'],
            '542134': ['其它区', '542100', 'qi ta qu'],
            '542200': ['山南地区', '540000', 'shan nan di qu'],
            '542221': ['乃东县', '542200', 'nai dong xian'],
            '542222': ['扎囊县', '542200', 'zha nang xian'],
            '542223': ['贡嘎县', '542200', 'gong ga xian'],
            '542224': ['桑日县', '542200', 'sang ri xian'],
            '542225': ['琼结县', '542200', 'qiong jie xian'],
            '542226': ['曲松县', '542200', 'qu song xian'],
            '542227': ['措美县', '542200', 'cuo mei xian'],
            '542228': ['洛扎县', '542200', 'luo zha xian'],
            '542229': ['加查县', '542200', 'jia cha xian'],
            '542231': ['隆子县', '542200', 'long zi xian'],
            '542232': ['错那县', '542200', 'cuo na xian'],
            '542233': ['浪卡子县', '542200', 'lang ka zi xian'],
            '542234': ['其它区', '542200', 'qi ta qu'],
            '542300': ['日喀则地区', '540000', 'ri ka ze di qu'],
            '542301': ['日喀则市', '542300', 'ri ka ze shi'],
            '542322': ['南木林县', '542300', 'nan mu lin xian'],
            '542323': ['江孜县', '542300', 'jiang zi xian'],
            '542324': ['定日县', '542300', 'ding ri xian'],
            '542325': ['萨迦县', '542300', 'sa jia xian'],
            '542326': ['拉孜县', '542300', 'la zi xian'],
            '542327': ['昂仁县', '542300', 'ang ren xian'],
            '542328': ['谢通门县', '542300', 'xie tong men xian'],
            '542329': ['白朗县', '542300', 'bai lang xian'],
            '542330': ['仁布县', '542300', 'ren bu xian'],
            '542331': ['康马县', '542300', 'kang ma xian'],
            '542332': ['定结县', '542300', 'ding jie xian'],
            '542333': ['仲巴县', '542300', 'zhong ba xian'],
            '542334': ['亚东县', '542300', 'ya dong xian'],
            '542335': ['吉隆县', '542300', 'ji long xian'],
            '542336': ['聂拉木县', '542300', 'nie la mu xian'],
            '542337': ['萨嘎县', '542300', 'sa ga xian'],
            '542338': ['岗巴县', '542300', 'gang ba xian'],
            '542339': ['其它区', '542300', 'qi ta qu'],
            '542400': ['那曲地区', '540000', 'na qu di qu'],
            '542421': ['那曲县', '542400', 'na qu xian'],
            '542422': ['嘉黎县', '542400', 'jia li xian'],
            '542423': ['比如县', '542400', 'bi ru xian'],
            '542424': ['聂荣县', '542400', 'nie rong xian'],
            '542425': ['安多县', '542400', 'an duo xian'],
            '542426': ['申扎县', '542400', 'shen zha xian'],
            '542427': ['索县', '542400', 'suo xian'],
            '542428': ['班戈县', '542400', 'ban ge xian'],
            '542429': ['巴青县', '542400', 'ba qing xian'],
            '542430': ['尼玛县', '542400', 'ni ma xian'],
            '542431': ['其它区', '542400', 'qi ta qu'],
            '542500': ['阿里地区', '540000', 'a li di qu'],
            '542521': ['普兰县', '542500', 'pu lan xian'],
            '542522': ['札达县', '542500', 'zha da xian'],
            '542523': ['噶尔县', '542500', 'ga er xian'],
            '542524': ['日土县', '542500', 'ri tu xian'],
            '542525': ['革吉县', '542500', 'ge ji xian'],
            '542526': ['改则县', '542500', 'gai ze xian'],
            '542527': ['措勤县', '542500', 'cuo qin xian'],
            '542528': ['其它区', '542500', 'qi ta qu'],
            '542600': ['林芝地区', '540000', 'lin zhi di qu'],
            '542621': ['林芝县', '542600', 'lin zhi xian'],
            '542622': ['工布江达县', '542600', 'gong bu jiang da xian'],
            '542623': ['米林县', '542600', 'mi lin xian'],
            '542624': ['墨脱县', '542600', 'mo tuo xian'],
            '542625': ['波密县', '542600', 'bo mi xian'],
            '542626': ['察隅县', '542600', 'cha yu xian'],
            '542627': ['朗县', '542600', 'lang xian'],
            '542628': ['其它区', '542600', 'qi ta qu'],
            '610000': ['陕西省', '1', 'shan xi sheng'],
            '610100': ['西安市', '610000', 'xi an shi'],
            '610102': ['新城区', '610100', 'xin cheng qu'],
            '610103': ['碑林区', '610100', 'bei lin qu'],
            '610104': ['莲湖区', '610100', 'lian hu qu'],
            '610111': ['灞桥区', '610100', 'ba qiao qu'],
            '610112': ['未央区', '610100', 'wei yang qu'],
            '610113': ['雁塔区', '610100', 'yan ta qu'],
            '610114': ['阎良区', '610100', 'yan liang qu'],
            '610115': ['临潼区', '610100', 'lin tong qu'],
            '610116': ['长安区', '610100', 'chang an qu'],
            '610122': ['蓝田县', '610100', 'lan tian xian'],
            '610124': ['周至县', '610100', 'zhou zhi xian'],
            '610125': ['户县', '610100', 'hu xian'],
            '610126': ['高陵县', '610100', 'gao ling xian'],
            '610127': ['其它区', '610100', 'qi ta qu'],
            '610200': ['铜川市', '610000', 'tong chuan shi'],
            '610202': ['王益区', '610200', 'wang yi qu'],
            '610203': ['印台区', '610200', 'yin tai qu'],
            '610204': ['耀州区', '610200', 'yao zhou qu'],
            '610222': ['宜君县', '610200', 'yi jun xian'],
            '610223': ['其它区', '610200', 'qi ta qu'],
            '610300': ['宝鸡市', '610000', 'bao ji shi'],
            '610302': ['渭滨区', '610300', 'wei bin qu'],
            '610303': ['金台区', '610300', 'jin tai qu'],
            '610304': ['陈仓区', '610300', 'chen cang qu'],
            '610322': ['凤翔县', '610300', 'feng xiang xian'],
            '610323': ['岐山县', '610300', 'qi shan xian'],
            '610324': ['扶风县', '610300', 'fu feng xian'],
            '610326': ['眉县', '610300', 'mei xian'],
            '610327': ['陇县', '610300', 'long xian'],
            '610328': ['千阳县', '610300', 'qian yang xian'],
            '610329': ['麟游县', '610300', 'lin you xian'],
            '610330': ['凤县', '610300', 'feng xian'],
            '610331': ['太白县', '610300', 'tai bai xian'],
            '610332': ['其它区', '610300', 'qi ta qu'],
            '610400': ['咸阳市', '610000', 'xian yang shi'],
            '610402': ['秦都区', '610400', 'qin du qu'],
            '610403': ['杨陵区', '610400', 'yang ling qu'],
            '610404': ['渭城区', '610400', 'wei cheng qu'],
            '610422': ['三原县', '610400', 'san yuan xian'],
            '610423': ['泾阳县', '610400', 'jing yang xian'],
            '610424': ['乾县', '610400', 'qian xian'],
            '610425': ['礼泉县', '610400', 'li quan xian'],
            '610426': ['永寿县', '610400', 'yong shou xian'],
            '610427': ['彬县', '610400', 'bin xian'],
            '610428': ['长武县', '610400', 'chang wu xian'],
            '610429': ['旬邑县', '610400', 'xun yi xian'],
            '610430': ['淳化县', '610400', 'chun hua xian'],
            '610431': ['武功县', '610400', 'wu gong xian'],
            '610481': ['兴平市', '610400', 'xing ping shi'],
            '610482': ['其它区', '610400', 'qi ta qu'],
            '610500': ['渭南市', '610000', 'wei nan shi'],
            '610502': ['临渭区', '610500', 'lin wei qu'],
            '610521': ['华县', '610500', 'hua xian'],
            '610522': ['潼关县', '610500', 'tong guan xian'],
            '610523': ['大荔县', '610500', 'da li xian'],
            '610524': ['合阳县', '610500', 'he yang xian'],
            '610525': ['澄城县', '610500', 'cheng cheng xian'],
            '610526': ['蒲城县', '610500', 'pu cheng xian'],
            '610527': ['白水县', '610500', 'bai shui xian'],
            '610528': ['富平县', '610500', 'fu ping xian'],
            '610581': ['韩城市', '610500', 'han cheng shi'],
            '610582': ['华阴市', '610500', 'hua yin shi'],
            '610583': ['其它区', '610500', 'qi ta qu'],
            '610600': ['延安市', '610000', 'yan an shi'],
            '610602': ['宝塔区', '610600', 'bao ta qu'],
            '610621': ['延长县', '610600', 'yan chang xian'],
            '610622': ['延川县', '610600', 'yan chuan xian'],
            '610623': ['子长县', '610600', 'zi chang xian'],
            '610624': ['安塞县', '610600', 'an sai xian'],
            '610625': ['志丹县', '610600', 'zhi dan xian'],
            '610626': ['吴起县', '610600', 'wu qi xian'],
            '610627': ['甘泉县', '610600', 'gan quan xian'],
            '610628': ['富县', '610600', 'fu xian'],
            '610629': ['洛川县', '610600', 'luo chuan xian'],
            '610630': ['宜川县', '610600', 'yi chuan xian'],
            '610631': ['黄龙县', '610600', 'huang long xian'],
            '610632': ['黄陵县', '610600', 'huang ling xian'],
            '610633': ['其它区', '610600', 'qi ta qu'],
            '610700': ['汉中市', '610000', 'han zhong shi'],
            '610702': ['汉台区', '610700', 'han tai qu'],
            '610721': ['南郑县', '610700', 'nan zheng xian'],
            '610722': ['城固县', '610700', 'cheng gu xian'],
            '610723': ['洋县', '610700', 'yang xian'],
            '610724': ['西乡县', '610700', 'xi xiang xian'],
            '610725': ['勉县', '610700', 'mian xian'],
            '610726': ['宁强县', '610700', 'ning qiang xian'],
            '610727': ['略阳县', '610700', 'lve yang xian'],
            '610728': ['镇巴县', '610700', 'zhen ba xian'],
            '610729': ['留坝县', '610700', 'liu ba xian'],
            '610730': ['佛坪县', '610700', 'fo ping xian'],
            '610731': ['其它区', '610700', 'qi ta qu'],
            '610800': ['榆林市', '610000', 'yu lin shi'],
            '610802': ['榆阳区', '610800', 'yu yang qu'],
            '610821': ['神木县', '610800', 'shen mu xian'],
            '610822': ['府谷县', '610800', 'fu gu xian'],
            '610823': ['横山县', '610800', 'heng shan xian'],
            '610824': ['靖边县', '610800', 'jing bian xian'],
            '610825': ['定边县', '610800', 'ding bian xian'],
            '610826': ['绥德县', '610800', 'sui de xian'],
            '610827': ['米脂县', '610800', 'mi zhi xian'],
            '610828': ['佳县', '610800', 'jia xian'],
            '610829': ['吴堡县', '610800', 'wu bao xian'],
            '610830': ['清涧县', '610800', 'qing jian xian'],
            '610831': ['子洲县', '610800', 'zi zhou xian'],
            '610832': ['其它区', '610800', 'qi ta qu'],
            '610900': ['安康市', '610000', 'an kang shi'],
            '610902': ['汉滨区', '610900', 'han bin qu'],
            '610921': ['汉阴县', '610900', 'han yin xian'],
            '610922': ['石泉县', '610900', 'shi quan xian'],
            '610923': ['宁陕县', '610900', 'ning shan xian'],
            '610924': ['紫阳县', '610900', 'zi yang xian'],
            '610925': ['岚皋县', '610900', 'lan gao xian'],
            '610926': ['平利县', '610900', 'ping li xian'],
            '610927': ['镇坪县', '610900', 'zhen ping xian'],
            '610928': ['旬阳县', '610900', 'xun yang xian'],
            '610929': ['白河县', '610900', 'bai he xian'],
            '610930': ['其它区', '610900', 'qi ta qu'],
            '611000': ['商洛市', '610000', 'shang luo shi'],
            '611002': ['商州区', '611000', 'shang zhou qu'],
            '611021': ['洛南县', '611000', 'luo nan xian'],
            '611022': ['丹凤县', '611000', 'dan feng xian'],
            '611023': ['商南县', '611000', 'shang nan xian'],
            '611024': ['山阳县', '611000', 'shan yang xian'],
            '611025': ['镇安县', '611000', 'zhen an xian'],
            '611026': ['柞水县', '611000', 'zha shui xian'],
            '611027': ['其它区', '611000', 'qi ta qu'],
            '620000': ['甘肃省', '1', 'gan su sheng'],
            '620100': ['兰州市', '620000', 'lan zhou shi'],
            '620102': ['城关区', '620100', 'cheng guan qu'],
            '620103': ['七里河区', '620100', 'qi li he qu'],
            '620104': ['西固区', '620100', 'xi gu qu'],
            '620105': ['安宁区', '620100', 'an ning qu'],
            '620111': ['红古区', '620100', 'hong gu qu'],
            '620121': ['永登县', '620100', 'yong deng xian'],
            '620122': ['皋兰县', '620100', 'gao lan xian'],
            '620123': ['榆中县', '620100', 'yu zhong xian'],
            '620124': ['其它区', '620100', 'qi ta qu'],
            '620200': ['嘉峪关市', '620000', 'jia yu guan shi'],
            '620300': ['金昌市', '620000', 'jin chang shi'],
            '620302': ['金川区', '620300', 'jin chuan qu'],
            '620321': ['永昌县', '620300', 'yong chang xian'],
            '620322': ['其它区', '620300', 'qi ta qu'],
            '620400': ['白银市', '620000', 'bai yin shi'],
            '620402': ['白银区', '620400', 'bai yin qu'],
            '620403': ['平川区', '620400', 'ping chuan qu'],
            '620421': ['靖远县', '620400', 'jing yuan xian'],
            '620422': ['会宁县', '620400', 'hui ning xian'],
            '620423': ['景泰县', '620400', 'jing tai xian'],
            '620424': ['其它区', '620400', 'qi ta qu'],
            '620500': ['天水市', '620000', 'tian shui shi'],
            '620502': ['秦州区', '620500', 'qin zhou qu'],
            '620503': ['麦积区', '620500', 'mai ji qu'],
            '620521': ['清水县', '620500', 'qing shui xian'],
            '620522': ['秦安县', '620500', 'qin an xian'],
            '620523': ['甘谷县', '620500', 'gan gu xian'],
            '620524': ['武山县', '620500', 'wu shan xian'],
            '620525': ['张家川回族自治县', '620500', 'zhang jia chuan hui zu zi zhi xian'],
            '620526': ['其它区', '620500', 'qi ta qu'],
            '620600': ['武威市', '620000', 'wu wei shi'],
            '620602': ['凉州区', '620600', 'liang zhou qu'],
            '620621': ['民勤县', '620600', 'min qin xian'],
            '620622': ['古浪县', '620600', 'gu lang xian'],
            '620623': ['天祝藏族自治县', '620600', 'tian zhu zang zu zi zhi xian'],
            '620624': ['其它区', '620600', 'qi ta qu'],
            '620700': ['张掖市', '620000', 'zhang ye shi'],
            '620702': ['甘州区', '620700', 'gan zhou qu'],
            '620721': ['肃南裕固族自治县', '620700', 'su nan yu gu zu zi zhi xian'],
            '620722': ['民乐县', '620700', 'min le xian'],
            '620723': ['临泽县', '620700', 'lin ze xian'],
            '620724': ['高台县', '620700', 'gao tai xian'],
            '620725': ['山丹县', '620700', 'shan dan xian'],
            '620726': ['其它区', '620700', 'qi ta qu'],
            '620800': ['平凉市', '620000', 'ping liang shi'],
            '620802': ['崆峒区', '620800', 'kong tong qu'],
            '620821': ['泾川县', '620800', 'jing chuan xian'],
            '620822': ['灵台县', '620800', 'ling tai xian'],
            '620823': ['崇信县', '620800', 'chong shen xian'],
            '620824': ['华亭县', '620800', 'hua ting xian'],
            '620825': ['庄浪县', '620800', 'zhuang lang xian'],
            '620826': ['静宁县', '620800', 'jing ning xian'],
            '620827': ['其它区', '620800', 'qi ta qu'],
            '620900': ['酒泉市', '620000', 'jiu quan shi'],
            '620902': ['肃州区', '620900', 'su zhou qu'],
            '620921': ['金塔县', '620900', 'jin ta xian'],
            '620922': ['安西县', '620900', 'an xi xian'],
            '620923': ['肃北蒙古族自治县', '620900', 'su bei meng gu zu zi zhi xian'],
            '620924': ['阿克塞哈萨克族自治县', '620900', 'a ke sai ha sa ke zu zi zhi xian'],
            '620981': ['玉门市', '620900', 'yu men shi'],
            '620982': ['敦煌市', '620900', 'dun huang shi'],
            '620983': ['其它区', '620900', 'qi ta qu'],
            '621000': ['庆阳市', '620000', 'qing yang shi'],
            '621002': ['西峰区', '621000', 'xi feng qu'],
            '621021': ['庆城县', '621000', 'qing cheng xian'],
            '621022': ['环县', '621000', 'huan xian'],
            '621023': ['华池县', '621000', 'hua chi xian'],
            '621024': ['合水县', '621000', 'he shui xian'],
            '621025': ['正宁县', '621000', 'zheng ning xian'],
            '621026': ['宁县', '621000', 'ning xian'],
            '621027': ['镇原县', '621000', 'zhen yuan xian'],
            '621028': ['其它区', '621000', 'qi ta qu'],
            '621100': ['定西市', '620000', 'ding xi shi'],
            '621102': ['安定区', '621100', 'an ding qu'],
            '621121': ['通渭县', '621100', 'tong wei xian'],
            '621122': ['陇西县', '621100', 'long xi xian'],
            '621123': ['渭源县', '621100', 'wei yuan xian'],
            '621124': ['临洮县', '621100', 'lin tao xian'],
            '621125': ['漳县', '621100', 'zhang xian'],
            '621126': ['岷县', '621100', 'min xian'],
            '621127': ['其它区', '621100', 'qi ta qu'],
            '621200': ['陇南市', '620000', 'long nan shi'],
            '621202': ['武都区', '621200', 'wu du qu'],
            '621221': ['成县', '621200', 'cheng xian'],
            '621222': ['文县', '621200', 'wen xian'],
            '621223': ['宕昌县', '621200', 'dang chang xian'],
            '621224': ['康县', '621200', 'kang xian'],
            '621225': ['西和县', '621200', 'xi he xian'],
            '621226': ['礼县', '621200', 'li xian'],
            '621227': ['徽县', '621200', 'hui xian'],
            '621228': ['两当县', '621200', 'liang dang xian'],
            '621229': ['其它区', '621200', 'qi ta qu'],
            '622900': ['临夏回族自治州', '620000', 'lin xia hui zu zi zhi zhou'],
            '622901': ['临夏市', '622900', 'lin xia shi'],
            '622921': ['临夏县', '622900', 'lin xia xian'],
            '622922': ['康乐县', '622900', 'kang le xian'],
            '622923': ['永靖县', '622900', 'yong jing xian'],
            '622924': ['广河县', '622900', 'guang he xian'],
            '622925': ['和政县', '622900', 'he zheng xian'],
            '622926': ['东乡族自治县', '622900', 'dong xiang zu zi zhi xian'],
            '622927': ['积石山保安族东乡族撒拉族自治县', '622900', 'ji shi shan bao an zu dong xiang zu sa la zu zi zhi xian'],
            '622928': ['其它区', '622900', 'qi ta qu'],
            '623000': ['甘南藏族自治州', '620000', 'gan nan zang zu zi zhi zhou'],
            '623001': ['合作市', '623000', 'he zuo shi'],
            '623021': ['临潭县', '623000', 'lin tan xian'],
            '623022': ['卓尼县', '623000', 'zhuo ni xian'],
            '623023': ['舟曲县', '623000', 'zhou qu xian'],
            '623024': ['迭部县', '623000', 'die bu xian'],
            '623025': ['玛曲县', '623000', 'ma qu xian'],
            '623026': ['碌曲县', '623000', 'liu qu xian'],
            '623027': ['夏河县', '623000', 'xia he xian'],
            '623028': ['其它区', '623000', 'qi ta qu'],
            '630000': ['青海省', '1', 'qing hai sheng'],
            '630100': ['西宁市', '630000', 'xi ning shi'],
            '630102': ['城东区', '630100', 'cheng dong qu'],
            '630103': ['城中区', '630100', 'cheng zhong qu'],
            '630104': ['城西区', '630100', 'cheng xi qu'],
            '630105': ['城北区', '630100', 'cheng bei qu'],
            '630121': ['大通回族土族自治县', '630100', 'da tong hui zu tu zu zi zhi xian'],
            '630122': ['湟中县', '630100', 'huang zhong xian'],
            '630123': ['湟源县', '630100', 'huang yuan xian'],
            '630124': ['其它区', '630100', 'qi ta qu'],
            '632100': ['海东地区', '630000', 'hai dong di qu'],
            '632121': ['平安县', '632100', 'ping an xian'],
            '632122': ['民和回族土族自治县', '632100', 'min he hui zu tu zu zi zhi xian'],
            '632123': ['乐都县', '632100', 'le du xian'],
            '632126': ['互助土族自治县', '632100', 'hu zhu tu zu zi zhi xian'],
            '632127': ['化隆回族自治县', '632100', 'hua long hui zu zi zhi xian'],
            '632128': ['循化撒拉族自治县', '632100', 'xun hua sa la zu zi zhi xian'],
            '632129': ['其它区', '632100', 'qi ta qu'],
            '632200': ['海北藏族自治州', '630000', 'hai bei zang zu zi zhi zhou'],
            '632221': ['门源回族自治县', '632200', 'men yuan hui zu zi zhi xian'],
            '632222': ['祁连县', '632200', 'qi lian xian'],
            '632223': ['海晏县', '632200', 'hai yan xian'],
            '632224': ['刚察县', '632200', 'gang cha xian'],
            '632225': ['其它区', '632200', 'qi ta qu'],
            '632300': ['黄南藏族自治州', '630000', 'huang nan zang zu zi zhi zhou'],
            '632321': ['同仁县', '632300', 'tong ren xian'],
            '632322': ['尖扎县', '632300', 'jian zha xian'],
            '632323': ['泽库县', '632300', 'ze ku xian'],
            '632324': ['河南蒙古族自治县', '632300', 'he nan meng gu zu zi zhi xian'],
            '632325': ['其它区', '632300', 'qi ta qu'],
            '632500': ['海南藏族自治州', '630000', 'hai nan zang zu zi zhi zhou'],
            '632521': ['共和县', '632500', 'gong he xian'],
            '632522': ['同德县', '632500', 'tong de xian'],
            '632523': ['贵德县', '632500', 'gui de xian'],
            '632524': ['兴海县', '632500', 'xing hai xian'],
            '632525': ['贵南县', '632500', 'gui nan xian'],
            '632526': ['其它区', '632500', 'qi ta qu'],
            '632600': ['果洛藏族自治州', '630000', 'guo luo zang zu zi zhi zhou'],
            '632621': ['玛沁县', '632600', 'ma qin xian'],
            '632622': ['班玛县', '632600', 'ban ma xian'],
            '632623': ['甘德县', '632600', 'gan de xian'],
            '632624': ['达日县', '632600', 'da ri xian'],
            '632625': ['久治县', '632600', 'jiu zhi xian'],
            '632626': ['玛多县', '632600', 'ma duo xian'],
            '632627': ['其它区', '632600', 'qi ta qu'],
            '632700': ['玉树藏族自治州', '630000', 'yu shu zang zu zi zhi zhou'],
            '632721': ['玉树县', '632700', 'yu shu xian'],
            '632722': ['杂多县', '632700', 'za duo xian'],
            '632723': ['称多县', '632700', 'cheng duo xian'],
            '632724': ['治多县', '632700', 'zhi duo xian'],
            '632725': ['囊谦县', '632700', 'nang qian xian'],
            '632726': ['曲麻莱县', '632700', 'qu ma lai xian'],
            '632727': ['其它区', '632700', 'qi ta qu'],
            '632800': ['海西蒙古族藏族自治州', '630000', 'hai xi meng gu zu zang zu zi zhi zhou'],
            '632801': ['格尔木市', '632800', 'ge er mu shi'],
            '632802': ['德令哈市', '632800', 'de ling ha shi'],
            '632821': ['乌兰县', '632800', 'wu lan xian'],
            '632822': ['都兰县', '632800', 'du lan xian'],
            '632823': ['天峻县', '632800', 'tian jun xian'],
            '632824': ['其它区', '632800', 'qi ta qu'],
            '640000': ['宁夏回族自治区', '1', 'ning xia hui zu zi zhi qu'],
            '640100': ['银川市', '640000', 'yin chuan shi'],
            '640104': ['兴庆区', '640100', 'xing qing qu'],
            '640105': ['西夏区', '640100', 'xi xia qu'],
            '640106': ['金凤区', '640100', 'jin feng qu'],
            '640121': ['永宁县', '640100', 'yong ning xian'],
            '640122': ['贺兰县', '640100', 'he lan xian'],
            '640181': ['灵武市', '640100', 'ling wu shi'],
            '640182': ['其它区', '640100', 'qi ta qu'],
            '640200': ['石嘴山市', '640000', 'shi zui shan shi'],
            '640202': ['大武口区', '640200', 'da wu kou qu'],
            '640205': ['惠农区', '640200', 'hui nong qu'],
            '640221': ['平罗县', '640200', 'ping luo xian'],
            '640222': ['其它区', '640200', 'qi ta qu'],
            '640300': ['吴忠市', '640000', 'wu zhong shi'],
            '640302': ['利通区', '640300', 'li tong qu'],
            '640303': ['红寺堡区', '640300', 'hong si bao qu'],
            '640323': ['盐池县', '640300', 'yan chi xian'],
            '640324': ['同心县', '640300', 'tong xin xian'],
            '640381': ['青铜峡市', '640300', 'qing tong xia shi'],
            '640382': ['其它区', '640300', 'qi ta qu'],
            '640400': ['固原市', '640000', 'gu yuan shi'],
            '640402': ['原州区', '640400', 'yuan zhou qu'],
            '640422': ['西吉县', '640400', 'xi ji xian'],
            '640423': ['隆德县', '640400', 'long de xian'],
            '640424': ['泾源县', '640400', 'jing yuan xian'],
            '640425': ['彭阳县', '640400', 'peng yang xian'],
            '640426': ['其它区', '640400', 'qi ta qu'],
            '640500': ['中卫市', '640000', 'zhong wei shi'],
            '640502': ['沙坡头区', '640500', 'sha po tou qu'],
            '640521': ['中宁县', '640500', 'zhong ning xian'],
            '640522': ['海原县', '640500', 'hai yuan xian'],
            '640523': ['其它区', '640500', 'qi ta qu'],
            '650000': ['新疆维吾尔自治区', '1', 'xin jiang wei wu er zi zhi qu'],
            '650100': ['乌鲁木齐市', '650000', 'wu lu mu qi shi'],
            '650102': ['天山区', '650100', 'tian shan qu'],
            '650103': ['沙依巴克区', '650100', 'sha yi ba ke qu'],
            '650104': ['新市区', '650100', 'xin shi qu'],
            '650105': ['水磨沟区', '650100', 'shui mo gou qu'],
            '650106': ['头屯河区', '650100', 'tou tun he qu'],
            '650107': ['达坂城区', '650100', 'da ban cheng qu'],
            '650108': ['东山区', '650100', 'dong shan qu'],
            '650109': ['米东区', '650100', 'mi dong qu'],
            '650121': ['乌鲁木齐县', '650100', 'wu lu mu qi xian'],
            '650122': ['其它区', '650100', 'qi ta qu'],
            '650200': ['克拉玛依市', '650000', 'ke la ma yi shi'],
            '650202': ['独山子区', '650200', 'du shan zi qu'],
            '650203': ['克拉玛依区', '650200', 'ke la ma yi qu'],
            '650204': ['白碱滩区', '650200', 'bai jian tan qu'],
            '650205': ['乌尔禾区', '650200', 'wu er he qu'],
            '650206': ['其它区', '650200', 'qi ta qu'],
            '652100': ['吐鲁番地区', '650000', 'tu lu fan di qu'],
            '652101': ['吐鲁番市', '652100', 'tu lu fan shi'],
            '652122': ['鄯善县', '652100', 'shan shan xian'],
            '652123': ['托克逊县', '652100', 'tuo ke xun xian'],
            '652124': ['其它区', '652100', 'qi ta qu'],
            '652200': ['哈密地区', '650000', 'ha mi di qu'],
            '652201': ['哈密市', '652200', 'ha mi shi'],
            '652222': ['巴里坤哈萨克自治县', '652200', 'ba li kun ha sa ke zi zhi xian'],
            '652223': ['伊吾县', '652200', 'yi wu xian'],
            '652224': ['其它区', '652200', 'qi ta qu'],
            '652300': ['昌吉回族自治州', '650000', 'chang ji hui zu zi zhi zhou'],
            '652301': ['昌吉市', '652300', 'chang ji shi'],
            '652302': ['阜康市', '652300', 'fu kang shi'],
            '652303': ['米泉市', '652300', 'mi quan shi'],
            '652323': ['呼图壁县', '652300', 'hu tu bi xian'],
            '652324': ['玛纳斯县', '652300', 'ma na si xian'],
            '652325': ['奇台县', '652300', 'qi tai xian'],
            '652327': ['吉木萨尔县', '652300', 'ji mu sa er xian'],
            '652328': ['木垒哈萨克自治县', '652300', 'mu lei ha sa ke zi zhi xian'],
            '652329': ['其它区', '652300', 'qi ta qu'],
            '652700': ['博尔塔拉蒙古自治州', '650000', 'bo er ta la meng gu zi zhi zhou'],
            '652701': ['博乐市', '652700', 'bo le shi'],
            '652722': ['精河县', '652700', 'jing he xian'],
            '652723': ['温泉县', '652700', 'wen quan xian'],
            '652724': ['其它区', '652700', 'qi ta qu'],
            '652800': ['巴音郭楞蒙古自治州', '650000', 'ba yin guo leng meng gu zi zhi zhou'],
            '652801': ['库尔勒市', '652800', 'ku er le shi'],
            '652822': ['轮台县', '652800', 'lun tai xian'],
            '652823': ['尉犁县', '652800', 'yu li xian'],
            '652824': ['若羌县', '652800', 'ruo qiang xian'],
            '652825': ['且末县', '652800', 'ju mo xian'],
            '652826': ['焉耆回族自治县', '652800', 'yan qi hui zu zi zhi xian'],
            '652827': ['和静县', '652800', 'he jing xian'],
            '652828': ['和硕县', '652800', 'he shuo xian'],
            '652829': ['博湖县', '652800', 'bo hu xian'],
            '652830': ['其它区', '652800', 'qi ta qu'],
            '652900': ['阿克苏地区', '650000', 'a ke su di qu'],
            '652901': ['阿克苏市', '652900', 'a ke su shi'],
            '652922': ['温宿县', '652900', 'wen su xian'],
            '652923': ['库车县', '652900', 'ku che xian'],
            '652924': ['沙雅县', '652900', 'sha ya xian'],
            '652925': ['新和县', '652900', 'xin he xian'],
            '652926': ['拜城县', '652900', 'bai cheng xian'],
            '652927': ['乌什县', '652900', 'wu shi xian'],
            '652928': ['阿瓦提县', '652900', 'a wa ti xian'],
            '652929': ['柯坪县', '652900', 'ke ping xian'],
            '652930': ['其它区', '652900', 'qi ta qu'],
            '653000': ['克孜勒苏柯尔克孜自治州', '650000', 'ke zi le su ke er ke zi zi zhi zhou'],
            '653001': ['阿图什市', '653000', 'a tu shi shi'],
            '653022': ['阿克陶县', '653000', 'a ke tao xian'],
            '653023': ['阿合奇县', '653000', 'a he qi xian'],
            '653024': ['乌恰县', '653000', 'wu qia xian'],
            '653025': ['其它区', '653000', 'qi ta qu'],
            '653100': ['喀什地区', '650000', 'ka shi di qu'],
            '653101': ['喀什市', '653100', 'ka shi shi'],
            '653121': ['疏附县', '653100', 'shu fu xian'],
            '653122': ['疏勒县', '653100', 'shu le xian'],
            '653123': ['英吉沙县', '653100', 'ying ji sha xian'],
            '653124': ['泽普县', '653100', 'ze pu xian'],
            '653125': ['莎车县', '653100', 'shao che xian'],
            '653126': ['叶城县', '653100', 'ye cheng xian'],
            '653127': ['麦盖提县', '653100', 'mai gai ti xian'],
            '653128': ['岳普湖县', '653100', 'yue pu hu xian'],
            '653129': ['伽师县', '653100', 'jia shi xian'],
            '653130': ['巴楚县', '653100', 'ba chu xian'],
            '653131': ['塔什库尔干塔吉克自治县', '653100', 'ta shi ku er gan ta ji ke zi zhi xian'],
            '653132': ['其它区', '653100', 'qi ta qu'],
            '653200': ['和田地区', '650000', 'he tian di qu'],
            '653201': ['和田市', '653200', 'he tian shi'],
            '653221': ['和田县', '653200', 'he tian xian'],
            '653222': ['墨玉县', '653200', 'mo yu xian'],
            '653223': ['皮山县', '653200', 'pi shan xian'],
            '653224': ['洛浦县', '653200', 'luo pu xian'],
            '653225': ['策勒县', '653200', 'ce le xian'],
            '653226': ['于田县', '653200', 'yu tian xian'],
            '653227': ['民丰县', '653200', 'min feng xian'],
            '653228': ['其它区', '653200', 'qi ta qu'],
            '654000': ['伊犁哈萨克自治州', '650000', 'yi li ha sa ke zi zhi zhou'],
            '654002': ['伊宁市', '654000', 'yi ning shi'],
            '654003': ['奎屯市', '654000', 'kui tun shi'],
            '654021': ['伊宁县', '654000', 'yi ning xian'],
            '654022': ['察布查尔锡伯自治县', '654000', 'cha bu cha er xi bo zi zhi xian'],
            '654023': ['霍城县', '654000', 'huo cheng xian'],
            '654024': ['巩留县', '654000', 'gong liu xian'],
            '654025': ['新源县', '654000', 'xin yuan xian'],
            '654026': ['昭苏县', '654000', 'zhao su xian'],
            '654027': ['特克斯县', '654000', 'te ke si xian'],
            '654028': ['尼勒克县', '654000', 'ni le ke xian'],
            '654029': ['其它区', '654000', 'qi ta qu'],
            '654200': ['塔城地区', '650000', 'ta cheng di qu'],
            '654201': ['塔城市', '654200', 'ta cheng shi'],
            '654202': ['乌苏市', '654200', 'wu su shi'],
            '654221': ['额敏县', '654200', 'e min xian'],
            '654223': ['沙湾县', '654200', 'sha wan xian'],
            '654224': ['托里县', '654200', 'tuo li xian'],
            '654225': ['裕民县', '654200', 'yu min xian'],
            '654226': ['和布克赛尔蒙古自治县', '654200', 'he bu ke sai er meng gu zi zhi xian'],
            '654227': ['其它区', '654200', 'qi ta qu'],
            '654300': ['阿勒泰地区', '650000', 'a le tai di qu'],
            '654301': ['阿勒泰市', '654300', 'a le tai shi'],
            '654321': ['布尔津县', '654300', 'bu er jin xian'],
            '654322': ['富蕴县', '654300', 'fu yun xian'],
            '654323': ['福海县', '654300', 'fu hai xian'],
            '654324': ['哈巴河县', '654300', 'ha ba he xian'],
            '654325': ['青河县', '654300', 'qing he xian'],
            '654326': ['吉木乃县', '654300', 'ji mu nai xian'],
            '654327': ['其它区', '654300', 'qi ta qu'],
            '659001': ['石河子市', '650000', 'shi he zi shi'],
            '659002': ['阿拉尔市', '650000', 'a la er shi'],
            '659003': ['图木舒克市', '650000', 'tu mu shu ke shi'],
            '659004': ['五家渠市', '650000', 'wu jia qu shi'],
            '440320': ['光明新区', '440300', 'guang ming xin qu'],
            '440321': ['坪山新区', '440300', 'ping shan xin qu'],
            '440322': ['大鹏新区', '440300', 'da peng xin qu'],
            '440323': ['龙华新区', '440300', 'long hua xin qu']
        }
    });
});
define('service/weibo',['at_app'], function(app) {
    app.lazy.factory('weibo', ['$resource',
        function($resource) {

            var WeiboUser = $resource('/restful/rest/buyer/weibo/user/:nickname/:topics',{},{
                'get': {
                    method: 'GET',
                    params: {
                        nickname: '@nickname',
                        topics:'@topics'
                    }
                }
            });

            var Weibo = $resource('/restful/rest/buyer/weibo/:id',{},{
                'get': {
                    method: 'GET',
                    cache : !1,
                    params: {
                        id: '@id'
                    }
                }
            });
            var WeiboUserSearch = $resource('/restful/rest/buyer/weibo/user/search/:input',{},{
                'getSearch': {
                    method: 'GET',
                    params: {
                        input: '@input'
                    }
                }
            });
            var Comment = $resource('/restful/rest/buyer/weibo/comment/:id',{},{
                'getList': {
                    method: 'GET',
                    params: {
                        id: '@id'
                    }
                }
            });
            var SelectFans = $resource('/restful/rest/buyer/weibo/user/fans', {}, {
                'get': {
                    isArray: false
                }
            });
            var FollowUser=$resource('/restful/rest/buyer/weibo/user/follow/:id', {}, {
                'send': {
                    method: "POST",
                    params: {
                        id: "@id"
                    }
                }
            });
            var DeleteFollow=$resource('/restful/rest/buyer/weibo/user/follow/:id', {}, {
                'send': {
                    method: "delete",
                    params: {
                        id: "@id"
                    }
                }

            });
            var SelectFollow= $resource('/restful/rest/buyer/weibo/user/follow', {}, {
                'get': {
                    isArray: false
                }
            });

            var AtMy=$resource('/restful/rest/buyer/weibo/atmy');
            var WeiboComment=$resource('/restful/rest/buyer/weibo/mycomment');
            var WeiboCommentMy=$resource('/restful/rest/buyer/weibo/commentmy');;


            var weibo = {};
            weibo.getSelectFollow=function(data){
                return SelectFollow.get(data);
            }
            weibo.getDeleteFollow=function(data){
                return DeleteFollow.send(data).$promise;
            }
            weibo.getFollowUser=function(data){
                return FollowUser.send(data).$promise;
            }
            weibo.getSelectFans=function(data){
                return SelectFans.get(data);
            }
            weibo.getAtMy=function(data){
                return AtMy.get(data);
            }
            weibo.getWeiboComment=function(data){
                return WeiboComment.get(data);
            }
            weibo.getWeiboCommentMy=function(data){
                return WeiboCommentMy.get(data);
            }

            weibo.getWeiboUserSearch = function(data) {
                return WeiboUserSearch.getSearch(data).$promise;
            }

            weibo.getWbList = function(data) {
                return Weibo.get(data);
            }

            weibo.getUserToWeiboList = function(data) {
                return WeiboUser.get(data);
            }

            weibo.getCommentList = function(data) {
                return Comment.getList(data);
            }

            weibo.sendWb = function(data) {
                var wb = new Weibo();
                var topicBean = {};
                topicBean.content = data.content||'';
                topicBean.type = data.type||'';
                topicBean.imageList = data.imageList||[];
                angular.extend(wb, topicBean);
                return wb.$save();
            }

            weibo.sendComment = function(data) {
                var wb = new Weibo();
                angular.extend(wb, data);
                return wb.$save();
            }

            weibo.sendRepost= function(data) {
                var wb = new Weibo();
                angular.extend(wb, data);
                return wb.$save();
            }

            weibo.getWbUser = function(data) {
                return WeiboUser.get(data).$promise;
            }



            return weibo;

        }
    ])
})
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
define('service/CONFIG',['at_app'], function(app) {
    app.lazy.service('CONFIG', function() {
        return {
            "NavMap": {
                //买家导航
                "/buyer-center": ["buyer-center", "0"],
                "/buyer-order": ["buyer-order", "2"],
                "/spread/:orderId/last/:page*": ["buyer-spread", "3"],
                "/spread/list": ["buyer-spread", "3"],
                "/spread/:id/list": ["buyer-spread", "2"],
                "/spread/:orderId/:orderGoodsId/last/:page*": ["buyer-spread", "3"],
                "/spread/:orderGoodsId/detail": ["buyer-spread", "3"],
                "/buyer-rebate": ["buyer-rebate", "4"],
                "/comment/list": ["buyer-comment", "5"],
                "/comment/:orderId/list": ["buyer-comment", "5"],
                "/buyer-apply-list": ["buyer-aftersale", "6"],
                "/buyer-apply/:id": ["buyer-aftersale", "6"],
                "/buyer-order-list": ["buyer-aftersale", "6"],
                "/buyer-apply-detail/:id": ["buyer-aftersale", "6"],
                "/contact-after-sale": ["buyer-aftersale", "6"],
                "/buyer-info": ["buyer-info", "8"],
                "/delivery-address": ["delivery-address", "9"],
                "/account-security": ["account-security", "10"],
                "/mobile/last/:page*": ["account-security", "10"],
                "/nickname/last/:page*": ["account-security", "10"],
                "/password/last/:page*": ["account-security", "10"],
                "/buyer-fund-account": ["buyer-fund-account", "11"],
                "/stock-config-center/:param": ["stock-config-center", "12"],
                //平台导航
                "/platformer-center": ["platform-center", "0"],
                "/platform-static": ["platform-static", "1"],
                "/goods-list": ["goods-management", "2"],
                "/publish-goods": ["goods-management", "2"],
                "/goods-promotion": ["goods-management", "2"],
                "/confirm-cancel-promotion/:id": ["goods-management", "2"],
                "/prize-list": ["prize-list", "3"],
                "/depot": ["depot", "4"],
                "/platform-order": ["platform-order", "5"],
                "/foo1": ["foo1", "7"],
                "/foo2": ["foo2", "8"],
                "/foo3": ["foo3", "9"],
                "/platform-apply-list": ["platform-aftersale", "10"],
                "/platform-apply-detail/:id": ["platform-aftersale", "10"],
                "/postage-list": ["postage-management", "12"],
                "/postage-template": ["postage-management", "12"],
                "/postage-template/:id": ["postage-management", "12"],
                "/postage-detail/:id": ["postage-management", "12"],
                "/postage-sf": ["postage-management", "13"],
                "/foo4": ["foo4", "14"],
                "/user-list": ["user-management", "15"],
                "/user-detail/:id": ["user-management", "15"],
                "/seller-detail": ["seller-management", "16"],
                "/platform-manages": ["fund-management", "17"],
                "/stock-config": ["stock-config", "18"],
                "/allow-ip": ["allow-ip", "20"],
                "/authority-manage": ["authority-manage", "21"],
                "/admin-user": ["admin-user", "22"],
                //商家导航
                "/seller-center": ["seller-center", "0"],
                "/seller-goods-list": ["seller-goods-management", "2"],
                "/seller-order": ["seller-order", "3"],
                "/seller-apply-list": ["seller-aftersale", "4"],
                "/seller-apply-detail/:id": ["seller-aftersale", "4"],
                "/foo5": ["foo5", "5"],
                "/seller-postage": ["seller-postage", "6"],
                "/seller-info": ["seller-info", "8"],
                "/seller-settle-accounts-detail": ["seller-settle", "9"],
                "/update-password": ["update-password", "10"],
                //微博导航
                "/comment": ["comment", "1"],
                "/at-my": ["at-my", "2"],
                "/my-fans": ["my-fans", "4"],
                "/my-follow": ["my-follow", "5"],
                "/my-message": ["my-message", "3"],
                "/message-history/:uid/:buyerId/:uname": ["my-message", "3"]
            },
            "IconSize": {
                'tiny': '60',
                'small': '100',
                'middle': '300',
                'large': '600',
                'huge': '800'
            }
        }
    });
})
define('service/EMAIL',['at_app'], function(app) {
    app.lazy.service('EMAIL',
        function() {
            return {
                'atman.com': ['凹凸曼', 'http://mail.atman.com'],
                'qq.com': ['腾讯', 'http://mail.qq.com'],
                '163.com': ['网易', 'http://email.163.com'],
                'sina.com': ['新浪', 'http://mail.sina.com'],
                'sina.cn': ['新浪', 'http://mail.sina.cn'],
                '126.com': ['网易', 'http://email.126.com'],
                'hotmail.com': ['微软', 'http://mail.hotmail.com'],
                'live.cn': ['微软', 'http://mail.live.cn'],
                'gmail.com': ['谷歌', 'http://mail.gmail.com'],
                'sohu.com': ['搜狐', 'http://mail.sohu.com'],
                'yahoo.com': ['雅虎', 'http://mail.yahoo.com']
            }
        }
    )
})
define('service/EMOJIS',['at_app'], function(app) {
    app.lazy.service('EMOJIS',
        function() {
            return [{
                "phrase": /\[草泥马\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/shenshou_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/shenshou_thumb.gif",
                "value": "[草泥马]",
                "picid": ""
            }, {
                "phrase": /\[神马\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/horse2_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/horse2_thumb.gif",
                "value": "[神马]",
                "picid": ""
            }, {
                "phrase": /\[浮云\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/fuyun_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/fuyun_thumb.gif",
                "value": "[浮云]",
                "picid": ""
            }, {
                "phrase": /\[给力\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/geili_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/geili_thumb.gif",
                "value": "[给力]",
                "picid": ""
            }, {
                "phrase": /\[围观\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/wg_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/wg_thumb.gif",
                "value": "[围观]",
                "picid": ""
            }, {
                "phrase": /\[威武\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/vw_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/vw_thumb.gif",
                "value": "[威武]",
                "picid": ""
            }, {
                "phrase": /\[熊猫\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/panda_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/panda_thumb.gif",
                "value": "[熊猫]",
                "picid": ""
            }, {
                "phrase": /\[兔子\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/rabbit_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/rabbit_thumb.gif",
                "value": "[兔子]",
                "picid": ""
            }, {
                "phrase": /\[奥特曼\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/otm_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/otm_thumb.gif",
                "value": "[奥特曼]",
                "picid": ""
            }, {
                "phrase": /\[囧\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/j_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/j_thumb.gif",
                "value": "[囧]",
                "picid": ""
            }, {
                "phrase": /\[互粉\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/hufen_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/hufen_thumb.gif",
                "value": "[互粉]",
                "picid": ""
            }, {
                "phrase": /\[礼物\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/liwu_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/liwu_thumb.gif",
                "value": "[礼物]",
                "picid": ""
            }, {
                "phrase": /\[呵呵\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/smilea_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/smilea_thumb.gif",
                "value": "[呵呵]",
                "picid": ""
            }, {
                "phrase": /\[嘻嘻\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/tootha_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/tootha_thumb.gif",
                "value": "[嘻嘻]",
                "picid": ""
            }, {
                "phrase": /\[哈哈\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/laugh.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/laugh.gif",
                "value": "[哈哈]",
                "picid": ""
            }, {
                "phrase": /\[可爱\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/tza_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/tza_thumb.gif",
                "value": "[可爱]",
                "picid": ""
            }, {
                "phrase": /\[可怜\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/kl_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/kl_thumb.gif",
                "value": "[可怜]",
                "picid": ""
            }, {
                "phrase": /\[挖鼻屎\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/kbsa_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/kbsa_thumb.gif",
                "value": "[挖鼻屎]",
                "picid": ""
            }, {
                "phrase": /\[吃惊\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/cj_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/cj_thumb.gif",
                "value": "[吃惊]",
                "picid": ""
            }, {
                "phrase": /\[害羞\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/shamea_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/shamea_thumb.gif",
                "value": "[害羞]",
                "picid": ""
            }, {
                "phrase": /\[挤眼\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/zy_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/zy_thumb.gif",
                "value": "[挤眼]",
                "picid": ""
            }, {
                "phrase": /\[闭嘴\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/bz_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/bz_thumb.gif",
                "value": "[闭嘴]",
                "picid": ""
            }, {
                "phrase": /\[鄙视\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/bs2_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/bs2_thumb.gif",
                "value": "[鄙视]",
                "picid": ""
            }, {
                "phrase": /\[爱你\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/lovea_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/lovea_thumb.gif",
                "value": "[爱你]",
                "picid": ""
            }, {
                "phrase": /\[泪\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/sada_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/sada_thumb.gif",
                "value": "[泪]",
                "picid": ""
            }, {
                "phrase": /\[偷笑\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/heia_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/heia_thumb.gif",
                "value": "[偷笑]",
                "picid": ""
            }, {
                "phrase": /\[亲亲\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/qq_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/qq_thumb.gif",
                "value": "[亲亲]",
                "picid": ""
            }, {
                "phrase": /\[生病\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/sb_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/sb_thumb.gif",
                "value": "[生病]",
                "picid": ""
            }, {
                "phrase": /\[太开心\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/mb_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/mb_thumb.gif",
                "value": "[太开心]",
                "picid": ""
            }, {
                "phrase": /\[懒得理你\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/ldln_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/ldln_thumb.gif",
                "value": "[懒得理你]",
                "picid": ""
            }, {
                "phrase": /\[右哼哼\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/yhh_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/yhh_thumb.gif",
                "value": "[右哼哼]",
                "picid": ""
            }, {
                "phrase": /\[左哼哼\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/zhh_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/zhh_thumb.gif",
                "value": "[左哼哼]",
                "picid": ""
            }, {
                "phrase": /\[嘘\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/x_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/x_thumb.gif",
                "value": "[嘘]",
                "picid": ""
            }, {
                "phrase": /\[衰\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/cry.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/cry.gif",
                "value": "[衰]",
                "picid": ""
            }, {
                "phrase": /\[委屈\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/wq_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/wq_thumb.gif",
                "value": "[委屈]",
                "picid": ""
            }, {
                "phrase": /\[吐\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/t_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/t_thumb.gif",
                "value": "[吐]",
                "picid": ""
            }, {
                "phrase": /\[打哈欠\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/k_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/k_thumb.gif",
                "value": "[打哈欠]",
                "picid": ""
            }, {
                "phrase": /\[抱抱\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/bba_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/bba_thumb.gif",
                "value": "[抱抱]",
                "picid": ""
            }, {
                "phrase": /\[怒\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/angrya_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/angrya_thumb.gif",
                "value": "[怒]",
                "picid": ""
            }, {
                "phrase": /\[疑问\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/yw_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/yw_thumb.gif",
                "value": "[疑问]",
                "picid": ""
            }, {
                "phrase": /\[馋嘴\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/cza_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/cza_thumb.gif",
                "value": "[馋嘴]",
                "picid": ""
            }, {
                "phrase": /\[拜拜\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/88_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/88_thumb.gif",
                "value": "[拜拜]",
                "picid": ""
            }, {
                "phrase": /\[思考\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/sk_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/sk_thumb.gif",
                "value": "[思考]",
                "picid": ""
            }, {
                "phrase": /\[汗\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/sweata_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/sweata_thumb.gif",
                "value": "[汗]",
                "picid": ""
            }, {
                "phrase": /\[困\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/sleepya_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/sleepya_thumb.gif",
                "value": "[困]",
                "picid": ""
            }, {
                "phrase": /\[睡觉\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/sleepa_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/sleepa_thumb.gif",
                "value": "[睡觉]",
                "picid": ""
            }, {
                "phrase": /\[钱\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/money_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/money_thumb.gif",
                "value": "[钱]",
                "picid": ""
            }, {
                "phrase": /\[失望\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/sw_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/sw_thumb.gif",
                "value": "[失望]",
                "picid": ""
            }, {
                "phrase": /\[酷\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/cool_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/cool_thumb.gif",
                "value": "[酷]",
                "picid": ""
            }, {
                "phrase": /\[花心\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/hsa_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/hsa_thumb.gif",
                "value": "[花心]",
                "picid": ""
            }, {
                "phrase": /\[哼\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/hatea_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/hatea_thumb.gif",
                "value": "[哼]",
                "picid": ""
            }, {
                "phrase": /\[鼓掌\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/gza_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/gza_thumb.gif",
                "value": "[鼓掌]",
                "picid": ""
            }, {
                "phrase": /\[晕\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/dizzya_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/dizzya_thumb.gif",
                "value": "[晕]",
                "picid": ""
            }, {
                "phrase": /\[悲伤\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/bs_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/bs_thumb.gif",
                "value": "[悲伤]",
                "picid": ""
            }, {
                "phrase": /\[抓狂\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/crazya_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/crazya_thumb.gif",
                "value": "[抓狂]",
                "picid": ""
            }, {
                "phrase": /\[黑线\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/h_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/h_thumb.gif",
                "value": "[黑线]",
                "picid": ""
            }, {
                "phrase": /\[阴险\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/yx_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/yx_thumb.gif",
                "value": "[阴险]",
                "picid": ""
            }, {
                "phrase": /\[怒骂\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/nm_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/nm_thumb.gif",
                "value": "[怒骂]",
                "picid": ""
            }, {
                "phrase": /\[心\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/hearta_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/hearta_thumb.gif",
                "value": "[心]",
                "picid": ""
            }, {
                "phrase": /\[伤心\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/unheart.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/unheart.gif",
                "value": "[伤心]",
                "picid": ""
            }, {
                "phrase": /\[猪头\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/pig.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/pig.gif",
                "value": "[猪头]",
                "picid": ""
            }, {
                "phrase": /\[ok\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/ok_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/ok_thumb.gif",
                "value": "[ok]",
                "picid": ""
            }, {
                "phrase": /\[耶\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/ye_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/ye_thumb.gif",
                "value": "[耶]",
                "picid": ""
            }, {
                "phrase": /\[good\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/good_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/good_thumb.gif",
                "value": "[good]",
                "picid": ""
            }, {
                "phrase": /\[不要\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/no_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/no_thumb.gif",
                "value": "[不要]",
                "picid": ""
            }, {
                "phrase": /\[赞\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/z2_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/z2_thumb.gif",
                "value": "[赞]",
                "picid": ""
            }, {
                "phrase": /\[来\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/come_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/come_thumb.gif",
                "value": "[来]",
                "picid": ""
            }, {
                "phrase": /\[弱\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/sad_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/sad_thumb.gif",
                "value": "[弱]",
                "picid": ""
            }, {
                "phrase": /\[蜡烛\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/lazu_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/lazu_thumb.gif",
                "value": "[蜡烛]",
                "picid": ""
            }, {
                "phrase": /\[钟\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/clock_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/clock_thumb.gif",
                "value": "[钟]",
                "picid": ""
            }, {
                "phrase": /\[话筒\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/m_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/m_thumb.gif",
                "value": "[话筒]",
                "picid": ""
            }, {
                "phrase": /\[蛋糕\]/g,
                "type": "face",
                "url": "/atmanlib/asset/images/emojis/cake.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "images/emojis/cake.gif",
                "value": "[蛋糕]",
                "picid": ""
            }];
        });
})
define('service/EXPRESS',['at_app'], function(app) {
    app.lazy.service('EXPRESS',
        function() {
            return {
                '14': ['大田物流', 'datianwuliu'],
                '15': ['德邦物流', 'debangwuliu'],
                '62': ['联邦快递', 'lianbangkuaidi'],
                '75': ['全峰快递', 'quanfengkuaidi'],
                '91': ['天天快递', 'tiantian'],
                '110': ['圆通速递', 'yuantong'],
                '111': ['韵达快运', 'yunda'],
                '112': ['运通快递', 'yuntongkuaidi'],
                '116': ['优速物流', 'youshuwuliu'],
                '126': ['中通速递', 'zhongtong'],
                '127': ['宅急送', 'zhaijisong']
            }
        }
    );
})
define('service/GOODSTYPE',['at_app'], function(app) {
    app.lazy.service('GOODSTYPE',
        function() {
            return {
                '0': ['全品类', '-1', 'quan pin'],
                '1': ['电器', '0', 'dian qi'],
                '2': ['服装', '0', 'fu zhuang'],
                '101': ['彩电', '1', 'cai dian'],
                '102': ['冰箱', '1', 'bing xiang'],
                '103': ['空调', '1', 'kong tiao'],
                '104': ['洗衣机', '1', 'xi yi ji'],
                '105': ['热水器', '1', 're shui qi'],
                '201': ['毛衣', '2', 'mao yi'],
                '202': ['皮衣', '2', 'pi yi'],
                '203': ['裤子', '2', 'ku zi']
            }
        }
    );
})
define('service/SE',['at_app'], function(app) {
    app.lazy.service('SE', function() {
        return {
            "actionName": {
                "ActiveUserByMail": [
                    "激活邮箱",
                    "ActiveUserByMail",
                    "ActiveUserByMail"
                ],
                "BatchReceipt": [
                    "批量收货",
                    "BatchReceipt",
                    "BatchReceipt"
                ],
                "BindMobile": [
                    "绑定手机",
                    "BindMobile",
                    "BindMobile"
                ],
                "BindUserBank": [
                    "绑定银行卡信息",
                    "BindUserBank",
                    "BindUserBank"
                ],
                "BindUserNameByMail": [
                    "绑定新邮箱",
                    "BindUserNameByMail",
                    "BindUserNameByMail"
                ],
                "Payment": [
                    "支付",
                    "Payment",
                    "Payment"
                ],
                "Receipt": [
                    "确认收货",
                    "Receipt",
                    "Receipt"
                ],
                "ResetPasswordByMail": [
                    "通过邮箱重置密码",
                    "ResetPasswordByMail",
                    "ResetPasswordByMail"
                ],
                "UnbindMobile": [
                    "解绑手机",
                    "UnbindMobile",
                    "UnbindMobile"
                ],
                "UnbindMobileByMail": [
                    "通过邮箱解绑手机",
                    "UnbindMobileByMail",
                    "UnbindMobileByMail"
                ],
                "UnbindMobileRemind": [
                    "解绑手机提醒",
                    "UnbindMobileRemind",
                    "UnbindMobileRemind"
                ],
                "UnbindUserNameByMail": [
                    "解绑老邮箱",
                    "UnbindUserNameByMail",
                    "UnbindUserNameByMail"
                ],
                "WithdrawCash": [
                    "提现",
                    "WithdrawCash",
                    "WithdrawCash"
                ]
            },
            "afterMarketState": {
                "1": [
                    "等待卖家同意退款",
                    "waitSellerAgreeRefund",
                    1
                ],
                "2": [
                    "同意退款",
                    "agreeRefund",
                    2
                ],
                "3": [
                    "拒绝退款",
                    "refuseRefund",
                    3
                ],
                "4": [
                    "退款成功",
                    "refundSuccess",
                    4
                ],
                "5": [
                    "等待卖家同意退货退款",
                    "waitSellerAgreeReturnGoodsAndRefund",
                    5
                ],
                "6": [
                    "同意退货退款",
                    "agreeReturnGoodsAndRefund",
                    6
                ],
                "7": [
                    "同拒绝退货退款",
                    "refuseReturnGoodsAndRefund",
                    7
                ],
                "8": [
                    "等待卖家收货并退款",
                    "waitSellerReceivingGoodsAndRefund",
                    8
                ],
                "9": [
                    "卖家已收货",
                    "sellerReceivingGoods",
                    9
                ],
                "10": [
                    "退款成功",
                    "returnfundSuccess",
                    10
                ]
            },
            "afterMarketType": {
                "1": [
                    "商品问题退货退款",
                    "goodsProblemReturnGoodsAndReturnfund",
                    1
                ],
                "2": [
                    "商品问题退款不退货",
                    "goodsProblemReturnfundAndNotReturnGoods",
                    2
                ]
            },
            "allotmentStatus": {
                "0": [
                    "未开始",
                    "NOT_START",
                    0
                ],
                "1": [
                    "进行中",
                    "ONGOING",
                    1
                ],
                "2": [
                    "已结束",
                    "OVERTIME",
                    2
                ],
                "3": [
                    "已结束",
                    "END",
                    3
                ],
                "4": [
                    "已取消",
                    "CANCEL",
                    4
                ]
            },
            "boolean": {
                "0": [
                    "否",
                    "no",
                    0
                ],
                "1": [
                    "是",
                    "yes",
                    1
                ]
            },
            "buyerGetPopularizeFundDay": {
                "1": [
                    "对角币领取超时返回的时间",
                    "buyerGetPopularizeFundDay",
                    1
                ]
            },
            "cartItemState": {
                "0": [
                    "正常",
                    "normal",
                    0
                ],
                "1": [
                    "商品不在售",
                    "notBuyable",
                    1
                ],
                "2": [
                    "数量大于库存",
                    "overQuantity",
                    2
                ]
            },
            "clientType": {
                "1": [
                    "网站",
                    "website",
                    1
                ]
            },
            "commentShareSpreadStatus": {
                "0": [
                    "未领取",
                    "unreceived",
                    0
                ],
                "1": [
                    "已领取",
                    "received",
                    1
                ],
                "2": [
                    "超时未领取",
                    "timeoutUnreceived",
                    2
                ]
            },
            "diagonFund": {
                "1000": [
                    "对角币的比率",
                    "diagonFund",
                    1000
                ]
            },
            "diagonFundReceiveState": {
                "1": [
                    "未失效待领取",
                    "unexpireWaitReceive",
                    1
                ],
                "2": [
                    "已领取",
                    "alreadyReceive",
                    2
                ],
                "3": [
                    "失效未领取",
                    "expireNoReceive",
                    3
                ]
            },
            "feedContentType": {
                "1": [
                    "普通微博",
                    "common",
                    1
                ],
                "2": [
                    "商品推广",
                    "goodsRelease",
                    2
                ],
                "3": [
                    "订单分享",
                    "orderShare",
                    3
                ]
            },
            "feedType": {
                "1": [
                    "原创",
                    "post",
                    1
                ],
                "2": [
                    "转发",
                    "repost",
                    2
                ]
            },
            "fundType": {
                "1": [
                    "现金",
                    "cash",
                    1
                ],
                "2": [
                    "推广金",
                    "popularizeFund",
                    2
                ],
                "3": [
                    "返利金",
                    "rebateFund",
                    3
                ],
                "4": [
                    "对角币",
                    "diagonFund",
                    4
                ],
                "5": [
                    "虚拟币",
                    "virtualFund",
                    5
                ],
                "6": [
                    "支付宝",
                    "alipayFund",
                    6
                ]
            },
            "goodsState": {
                "1": [
                    "已上架",
                    "onsale",
                    1
                ],
                "2": [
                    "无库存",
                    "noInventory",
                    2
                ],
                "3": [
                    "停产",
                    "stopProduction",
                    3
                ],
                "4": [
                    "售完",
                    "sellOut",
                    4
                ],
                "5": [
                    "指定时间上架(仍然在仓库中)",
                    "scheduleOnsale",
                    5
                ],
                "6": [
                    "违约商品",
                    "illegal",
                    6
                ],
                "7": [
                    "待推广",
                    "waitSpread",
                    7
                ]
            },
            "goodsUsefulLife": {
                "7": [
                    "7天",
                    "sevenDays",
                    7
                ],
                "15": [
                    "15天",
                    "fifteenDays",
                    15
                ],
                "30": [
                    "30天",
                    "thirtyDays",
                    30
                ]
            },
            "massmarkingOrderEffectDays": {
                "1": [
                    "等待买家付款_超时交易关闭",
                    "1",
                    1
                ],
                "2": [
                    "等待卖家发货_超时交易关闭",
                    "2",
                    2
                ],
                "3": [
                    "等待买家收货_超时交易成功",
                    "3",
                    3
                ]
            },
            "massmarkingOrderStateOfBuyer": {
                "1": [
                    "待付款",
                    "waitBuyerPay",
                    1
                ],
                "2": [
                    "待发货",
                    "buyerAlreadyPay",
                    2
                ],
                "3": [
                    "已发货",
                    "sellerAlreadyDelivery",
                    3
                ],
                "4": [
                    "超时发货",
                    "sellerDeliveryOvertime",
                    4
                ],
                "5": [
                    "交易成功<br/>（待评价分享）",
                    "tradeSuccessWaitComment",
                    5
                ],
                "6": [
                    "交易成功",
                    "tradeSuccess",
                    6
                ],
                "7": [
                    "交易成功<br/>（待评价分享）",
                    "tradeFinishedWaitComment",
                    7
                ],
                "8": [
                    "交易成功",
                    "tradeSuccess",
                    8
                ],
                "9": [
                    "交易失败",
                    "tradeClose",
                    9
                ]
            },
            "massmarkingOrderStateOfSeller": {
                "1": [
                    "等待买家付款",
                    "waitBuyerPay",
                    1
                ],
                "2": [
                    "买家已付款",
                    "waitDelivery",
                    2
                ],
                "3": [
                    "等待买家收货",
                    "waitBuyerReceive",
                    3
                ],
                "4": [
                    "交易成功",
                    "tradeSuccess",
                    4
                ],
                "5": [
                    "交易关闭",
                    "tradeClose",
                    5
                ]
            },
            "massmarkingscaleOfBuyer": {
                "100": [
                    "对角币比例",
                    "useCashAndDiagon",
                    100
                ]
            },
            "orderGoodsPopularizeFundAssignState": {
                "1": [
                    "未派发",
                    "notAssign",
                    1
                ],
                "2": [
                    "未失效派发中",
                    "assigningWhenNoExpire",
                    2
                ],
                "3": [
                    "失效返回订单",
                    "returnOrderGoodsWhenExpire",
                    3
                ],
                "4": [
                    "已派发完毕",
                    "assignOver",
                    4
                ]
            },
            "paymentType": {
                "1": [
                    "吾商账户支付",
                    "diagonalleyAccount",
                    1
                ],
                "2": [
                    "支付宝账户支付",
                    "alipayAccount",
                    2
                ],
                "3": [
                    "吾商和支付宝共同支付",
                    "diagonalleyAndAlipayAccount",
                    3
                ]
            },
            "permission": {
                "1": [
                    "所有人可见",
                    "allCanSee",
                    1
                ],
                "2": [
                    "我关注的人可见",
                    "iAttentionCanSee",
                    2
                ],
                "3": [
                    "仅自己可见",
                    "onlyMyselfCanSee",
                    3
                ]
            },
            "popularizedFundSendState": {
                "1": [
                    "未分享",
                    "noShare",
                    1
                ],
                "2": [
                    "分享中",
                    "sharing",
                    2
                ],
                "3": [
                    "失效返回订单",
                    "expireBackToOrder",
                    3
                ],
                "4": [
                    "已分享",
                    "shareOver",
                    4
                ]
            },
            "postageFeeType": {
                "1": [
                    "快递",
                    "express",
                    1
                ],
                "2": [
                    "EMS",
                    "ems",
                    2
                ],
                "3": [
                    "平邮",
                    "surfaceMail",
                    3
                ]
            },
            "remindMessageType": {
                "1": [
                    "卖家发货提醒",
                    "sellerDeliveryRemind",
                    1
                ],
                "2": [
                    "返利金提醒",
                    "rebateFundRemind",
                    2
                ],
                "3": [
                    "对角币提醒",
                    "diagonFundRemind",
                    3
                ],
                "4": [
                    "评论提醒",
                    "commentRemind",
                    4
                ],
                "5": [
                    "at提醒",
                    "atMeRemind",
                    5
                ],
                "6": [
                    "私信提醒",
                    "privateMessageRemind",
                    6
                ],
                "7": [
                    "新增粉丝提醒",
                    "fansRemind",
                    7
                ]
            },
            "returnGoodsNotReceiveGoodsType": {
                "1": [
                    "空包裹",
                    "emptyPackage",
                    1
                ],
                "2": [
                    "少货",
                    "lackGoods",
                    2
                ],
                "3": [
                    "快递问题",
                    "expressProblem",
                    3
                ],
                "4": [
                    "卖家发错货",
                    "sellerWrongDelivery",
                    4
                ],
                "5": [
                    "虚假发货",
                    "bogusDelivery",
                    5
                ]
            },
            "returnGoodsReceiveGoodsType": {
                "6": [
                    "材质不符",
                    "materialNotMatch",
                    6
                ],
                "7": [
                    "认为是假货",
                    "believeFakes",
                    7
                ],
                "8": [
                    "颜色、款式、图案、吊牌与描述不符",
                    "colorAndStyleNotMatch",
                    8
                ],
                "9": [
                    "配件问题",
                    "fittingsProblem",
                    9
                ],
                "10": [
                    "发货问题",
                    "deliveryProblem",
                    10
                ],
                "11": [
                    "工艺/手艺问题",
                    "craftsProblem",
                    11
                ],
                "12": [
                    "尺寸不符",
                    "sizeNotMatch",
                    12
                ],
                "13": [
                    "效果不好/不喜欢",
                    "effectNotGood",
                    13
                ],
                "14": [
                    "其他",
                    "others",
                    14
                ]
            },
            "returnGoodsStateOfBuyer": {
                "2": [
                    "退款成功",
                    "refundSuccess",
                    2
                ],
                "3": [
                    "不同意退款",
                    "refuseRefund",
                    3
                ],
                "4": [
                    "等待卖家同意",
                    "refundDoing",
                    4
                ],
                "5": [
                    "请退货",
                    "pleaseReturngoods",
                    5
                ],
                "6": [
                    "不同意退货退款",
                    "refuseReturngoods",
                    6
                ],
                "7": [
                    "等待卖家确认收货",
                    "waitSellerReceivingGoods",
                    7
                ],
                "8": [
                    "退款成功",
                    "returngoodsAndReturnfundBothSuccess",
                    8
                ],
                "9": [
                    "退货关闭",
                    "processStop",
                    9
                ],
                "201": [
                    "超时退款成功",
                    "timeoutRefundSuccess",
                    201
                ],
                "801": [
                    "超时退款成功",
                    "timeoutReturngoodsAndReturnfundBothSuccess",
                    801
                ],
                "901": [
                    "确认收货,终止退货",
                    "goodsreceipt-processStop",
                    901
                ]
            },
            "returnGoodsStateOfSeller": {
                "1": [
                    "买家申请退款",
                    "buyerApplyRefund",
                    1
                ],
                "2": [
                    "退款成功",
                    "refundSuccess",
                    2
                ],
                "3": [
                    "不同意退款",
                    "refuseRefund",
                    3
                ],
                "4": [
                    "买家申请退货",
                    "buyerApplyReturngoods",
                    4
                ],
                "5": [
                    "等待买家退货",
                    "waitBuyerReturngoods",
                    5
                ],
                "6": [
                    "不同意退货退款",
                    "refuseReturngoods",
                    6
                ],
                "7": [
                    "买家已退货",
                    "buyerAlreadyReturngoods",
                    7
                ],
                "8": [
                    "退款成功",
                    "returngoodsAndReturnfundBothSuccess",
                    8
                ],
                "9": [
                    "退货关闭",
                    "processStop",
                    9
                ],
                "201": [
                    "超时退款成功",
                    "timeoutRefundSuccess",
                    201
                ],
                "801": [
                    "超时退款成功",
                    "timeoutReturngoodsAndReturnfundBothSuccess",
                    801
                ],
                "901": [
                    "确认收货,终止退货",
                    "goodsreceipt-processStop",
                    901
                ]
            },
            "returngoodsEffectDays": {
                "3": [
                    "退款不退货_买家提交申请_超时退款成功",
                    "1",
                    3
                ],
                "5": [
                    "退款且退货_买家提交申请_超时退款成功",
                    "4",
                    5
                ],
                "6": [
                    "退款且退货_等待买家发货_超时退货关闭",
                    "5",
                    6
                ],
                "7": [
                    "退款且退货_等待卖家收货_超时退款成功",
                    "7",
                    7
                ]
            },
            "sellerAuditState": {
                "1": [
                    "审核中",
                    "auditDoing",
                    1
                ],
                "2": [
                    "审核成功",
                    "auditSuccess",
                    2
                ],
                "3": [
                    "审核失败",
                    "auditFail",
                    3
                ]
            },
            "sellerState": {
                "0": [
                    "卖家状态:停用",
                    "ban",
                    0
                ],
                "1": [
                    "卖家状态:正常",
                    "normal",
                    1
                ]
            },
            "spikeStatus": {
                "0": [
                    "等待中",
                    "waiting",
                    0
                ],
                "1": [
                    "秒杀中",
                    "spiking",
                    1
                ],
                "2": [
                    "卖完",
                    "soldOut",
                    2
                ],
                "4": [
                    "过期未卖完",
                    "timeOver",
                    4
                ],
                "6": [
                    "直接取消",
                    "directCancel",
                    6
                ],
                "7": [
                    "秒杀中取消",
                    "cancel",
                    7
                ]
            },
            "tradeType": {
                "1": [
                    "购物支出",
                    "buyerShoppingExpense",
                    1
                ],
                "2": [
                    "购物退款",
                    "buyerShoppingReturnfund",
                    2
                ],
                "3": [
                    "销售款收入",
                    "SellerGetSales",
                    3
                ],
                "4": [
                    "推广金收入",
                    "buyerGetPopularizeFund",
                    4
                ],
                "5": [
                    "虚拟资金收入",
                    "buyerGetVirtulFund",
                    5
                ],
                "6": [
                    "返利金收入",
                    "linkUserGetRebateFund",
                    6
                ],
                "7": [
                    "分发推广金",
                    "buyerAssignPopularizeFund",
                    7
                ],
                "8": [
                    "领取对角币",
                    "spreaderGetDiagonFund",
                    8
                ],
                "9": [
                    "退货退款",
                    "buyerGetReturnGoodsFund",
                    9
                ],
                "10": [
                    "买家退货商家获得销售款",
                    "SellerGetReturnGoodsFund",
                    10
                ],
                "11": [
                    "充值",
                    "recharge",
                    11
                ],
                "12": [
                    "提现",
                    "withdrawDeposit",
                    12
                ],
                "401": [
                    "对角币领取超时获取推广金",
                    "timeoutBuyerGetPopularizeFund",
                    401
                ]
            },
            "url": {
                "/data/mfs/": [
                    "linux图片存放地址",
                    "linux_path",
                    "/data/mfs/"
                ],
                "d:\\\\aa\\": [
                    "window图片存放地址",
                    "win_path",
                    "d:\\\\aa\\"
                ],
                "goodsCommonDetail.html": [
                    "商品评论详情页面名称",
                    "goodsCommonDetail",
                    "goodsCommonDetail.html"
                ],
                "http://192.168.1.181:8000/imageServer/": [
                    "图片服务器地址",
                    "image",
                    "http://192.168.1.181:8000/imageServer/"
                ],
                "http://192.168.1.181:9425/": [
                    "mfs管理地址",
                    "mfsmaster",
                    "http://192.168.1.181:9425/"
                ],
                "http://localhost:8080/da/": [
                    "项目访问地址",
                    "url",
                    "http://localhost:8080/da/"
                ]
            },
            "withdrawalState": {
                "1": [
                    "提现汇款中",
                    "withdrawDoing",
                    1
                ],
                "2": [
                    "提现汇款成功",
                    "withdrawSuccess",
                    2
                ],
                "3": [
                    "提现汇款失败",
                    "withdrawFail",
                    3
                ]
            }
        };
    });
});
define('service/buyer',['at_app'], function(app) {
    app.lazy.factory('buyer', ['$resource',
        function($resource) {
            var bb = $resource('/restful/rest/buyer/brief');
            var bam = $resource('/restful/rest/buyer/account/myself');
            var bis = $resource('/restful/rest/buyer/interim/sendvalidatecode');
            var bip = $resource('/restful/rest/buyer/interim/payment');

            var buyer = {};

            buyer.getBuyerInfo = function(data) {
                return bb.get(data);
            }
            buyer.getBuyerAccountmyself = function(data) {
                return bam.get(data);
            }
            buyer.getBuyerAccountmyself = function(data) {
                return bis.get(data);
            }
            buyer.updateCaptcha = function(data) {
                return bip.put(data);
            }

            return buyer;
        }
    ]);

    app.lazy.factory('Validation', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/interim/sendvalidatecode');
        }
    ]);

    app.lazy.factory('GetDeliveryCode', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/order/orderReceiptCode');
        }
    ]);

    app.lazy.factory('ConfirmBuyerOrder', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/order/:id/status/received', {}, {
                'confirmOrder': {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    }
                }
            });
        }
    ]);
})
define('service/cart',['at_app'], function(app) {
    app.lazy.factory('CartItem', ['$resource',
        function($resource) {
            return $resource('/restful/rest/cart/cartItem', {}, {
                'update': {
                    method: 'PUT'
                }
            });
        }
    ]);
})
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
define('service/order',['at_app'], function(app) {
    app.lazy.factory('order', ['$resource',
        function($resource) {
            var cancelBuyerOrder = $resource('/restful/rest/buyer/order/:orderId/status/cancel', {}, {
                'put': {
                    method: 'PUT'
                }
            });
            var BuyerOrder = $resource('/restful/rest/buyer/order/:statistics');
            var BuyerOrderStatusReceived = $resource('/restful/rest/buyer/order/:id/status/received', {}, {
                'confirmOrder': {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    }
                }
            });

            var order = {};
            order.cancelBuyerOrder = function(data) {
                return cancelBuyerOrder.put(data);
            }
            order.getBuyerOrder = function(data) {
                return BuyerOrder.get(data);
            }
            order.putOrderStatusReceived = function(data) {
                return BuyerOrderStatusReceived.confirmOrder(data);
            }
            return order;
        }
    ]);
    app.lazy.factory('GetBuyerOrder', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/order/:statistics', {}, {
                'getOrder': {
                    method: 'GET'
                }
            });
        }
    ]);
    app.lazy.factory('ConfirmBuyerOrder', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/order/:id/status/received', {}, {
                'confirmOrder': {
                    method: 'PUT',
                    params: {
                        id: '@id'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('GetDeliveryCode', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/order/orderReceiptCode');
        }
    ]);
    app.lazy.factory('AplipayOrder', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/order/:orderId/pay', {}, {
                'payment': {
                    method: 'POST'
                }
            });
        }
    ]);
});
define('service/promo',['at_app'], function(app) {
    app.lazy.factory('Promo', ['$resource',
        function($resource) {
            return $resource('/restful/rest/promo/:id/:commentId/:key', {}, {
                id: '@id',
                commentId: '@commentId',
                key: '@key'
            });
        }
    ]);

    app.lazy.factory('MySpread', ['$resource',
        function($resource) {
            return $resource('/restful/rest/promo/order/:spread',{},{
                'get':{
                    method:'GET',
                    params:{
                        spread:'@spread'
                    }
                }
            });
        }
    ])

    app.lazy.factory('GetSpreadUser', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/promo', {}, {
                'get': {
                    method: 'GET',
                    isArray: true
                }
            });
        }
    ])
})
define('service/shoppingcar',['at_app'], function(app) {
    app.lazy.factory('ShoppingCar', ['$resource',
        function($resource) {
            return $resource('/restful/rest/cart/small');
        }
    ]);

    app.lazy.factory('CartItem', ['$resource',
        function($resource) {
            return $resource('/restful/rest/cart/cartItem', {}, {
                'update': {
                    method: 'PUT'

                }
            });
        }
    ]);
})
define('service/spread',['at_app'], function(app) {
    app.lazy.factory('MySpread', ['$resource',
        function($resource) {
            return $resource('/restful/rest/promo/order/:spread',{},{
                'get':{
                    method:'GET',
                    params:{
                        spread:'@spread'
                    }
                }
            });
        }
    ])
})