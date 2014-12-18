define('service/at_url',['at_app'],function(app) {
    app.lazy.provider('getTpl',
        function() {
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
    /*app.lazy.factory('SubmitOrder', ['$resource',
     function($resource) {
     return $resource('/restful/rest/order');
     }
     ])*/


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
    /*
     app.lazy.factory('BuyerMoneyAccountBrief', ['$resource',
     function($resource) {
     return $resource('/restful/rest/acount');
     }
     ])*/
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

    /*app.lazy.factory('PostTempOrder', ['$resource',
     function($resource) {
     return $resource('/restful/rest/order/TempOrder/:id', {}, {
     'save': {
     method: 'POST',
     params: {
     id: '@id'
     }
     }
     });
     }
     ])*/
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
    /*
     app.lazy.factory('PutCaptcha', ['$resource',
     function($resource) {
     return $resource('/restful/rest/order/TempOrder/Acount', {}, {
     'updateCaptcha': {
     method: 'PUT',
     params: {}
     }
     });
     }
     ])*/
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
    /*
     app.lazy.factory('SelectAddress', ['$resource',
     function($resource) {
     return $resource('/restful/rest/order/TempOrder/Address/:id', {}, {
     'address': {
     method: 'PUT',
     params: {
     id: '@id'
     }
     }
     });
     }
     ])*/
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
    /*
     app.lazy.factory('GetTempOrder', ['$resource',
     function($resource) {
     return $resource('/restful/rest/order/TempOrder');
     }
     ])*/
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
    /*app.lazy.factory('Validation', ['$resource',
     function($resource) {
     return $resource('/restful/rest/buyer/interim/sendvalidatecode');
     }
     ]);*/
    app.lazy.factory('Validation', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/interim/validatecode', {}, {
                'get': {
                    method: 'GET'
                }
            });
        }
    ]);
    /*
     app.lazy.factory('Validation', ['$resource',
     function($resource) {
     return $resource('/restful/rest/order/TempOrder/sendMobileCode');
     }
     ])*/
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
    /*app.lazy.factory('OrderNew', ['$resource',
     function($resource) {
     return $resource('/restful/rest/buyer/ordernew/:orderId');
     }
     ])*/
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
    app.lazy.factory('SpreadApply', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/spread');
        }
    ]);
    app.lazy.factory('SpreadConfig', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/spreadconfig/:id', {}, {
                'save': {
                    method: 'POST',
                    params: {
                        id: '@id'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('GetSpreadConfig', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/spreadconfig/:action');
        }
    ]);
    app.lazy.factory('Logstatistics', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/spreadconfig/logstatistics/:month');
        }
    ]);
    app.lazy.factory('SpreadList', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/spreadconfig/usestatistics/:status');
        }
    ]);
    app.lazy.factory('SpreadIncome', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/spreadconfig/daily');
        }
    ]);

    app.lazy.factory('SpRegPrize', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/spread/registe');
        }
    ]);
    app.lazy.factory('BannerItem', ['$resource',
        function($resource) {
            return $resource('/restful/rest/common/adsinfo/homePage');
        }
    ]);
    app.lazy.factory('PublicSpread', ['$resource',
        function($resource) {
            return $resource('/restful/rest/public/spread/:spreadId?type=1', {}, {
                'get': {
                    method: 'GET',
                    params: {
                        spreadId: '@spreadId'
                    }
                }
            });
        }
    ]);
    app.lazy.factory('SpreadSummary', ['$resource',
        function($resource) {
            return $resource('/restful/rest/buyer/spread/summary');
        }
    ]);
    app.lazy.factory('GoodsRecommendList', ['$resource',
        function($resource) {
            return $resource('/restful/rest/common/goodsRecommend');
        }
    ]);
});