define('directive/at_goods_detail_tip',['at_app'], function(app) {
    app.lazy.directive('atGoodsDetailTip', ['$rootScope', '$compile',
        function($rootScope, $compile) {
            return {
                priority: 0,
                restrict: 'A',
                scope: {
                    item: "="
                },
                link: function postLink(scope, iElement, iAttrs) {
                    var popText = '';
                    $rootScope.$on('at.poptip.show', function(e, data) {
                        if (data.promotionBriefBean && !data.resultStatusBean) {
                            popText = '<div>' +
                                '<p class="pull-right"><button type="button" class="close close-sm" id="closeBtn">&times;</button></p>' +
                                '<a class="pull-left" href="#">' +
                                '<img class="media-object" src="/atmanlib/asset/images/icon/success.png" alt="">' +
                                '</a>' +
                                '<div class="media-body payment-detail">' +
                                '<h4 class="media-heading payment-title">' +
                                '<span class="label-warning-tip">加入购物车成功！</span>' +
                                '</h4>' +
                                '<h5>请在30分钟内完成支付！</h5>' +
                                '<h5><a ng-href="/trade/#/cart" class="btn btn-primary">马上去支付</a>' +
                                '</h5>' +
                                '</div>' +
                                '</div>';
                            popText = data.resultStatusBean.message;
                        } else {
                            if (!data.resultStatusBean) {
                                popText = '<p class="pull-right pd-tb-10"><button type="button" class="close close-sm" id="closeBtn">&times;</button></p>' +
                                    '<div style="float:left;margin-top:10px;">' +
                                    '<img class = "media-object" src = "/atmanlib/asset/images/icon/success.png">' +
                                    '</div>'+
                                    '<div style="float:right;margin-top:15px;">' +
                                    '<p><h4 class="pd-lr-10">添加成功！</h4></p>' +
                                    '<p class="mg-tb-10"><a href="/trade/#/cart" class="btn btn-primary mg-tb-10" id="goToCar">去结算</a>&nbsp;&nbsp;&nbsp;&nbsp;' +
                                    '<button class="btn btn-default btn-search mg-tb-10" id="shoppingMore">继续购物</button></p>' +
                                    '</div>';
                            } else {
                                popText = '<p class="pull-right pd-tb-10"><button class="close close-sm" id="closeBtn">&times;</button></p>' +
                                    '<div style="float:left;margin-top:10px;">' +
                                    '<img class = "media-object" src = "/atmanlib/asset/images/icon/success.png">' +
                                    ' </div>' +
                                    '<div style="float:right;margin-top:15px;">' +
                                    '<p><h4 class="pd-lr-5">该商品已存在购物车中！</h4> </p >' +
                                    '<p class="mg-tb-10">'+
                                    '<a href="/trade/#/cart" class="btn btn-primary mg-tb-10" id="goToCar">去结算</a>&nbsp;&nbsp;&nbsp;&nbsp;' +
                                    '<a class="btn btn-default btn-search mg-tb-10" id="shoppingMore">继续购物</a>' +
                                    '</p>' +
                                    '</div>';
                            }
                        }
                        var options = {
                            container: 'body',
                            html: true,
                            trigger: 'manual',
                            placement: 'bottom',
                            content:  popText
                        };
                        $('#addShoppingCar').popover(options);
                        $('#addShoppingCar').popover('show');
                        iElement.click(function(e) {
                            e.stopPropagation();
                        });
                        $(document).click(function(e) {
                            if ($('.popover').has(e.target).length == 0 || $(e.target).is('#shoppingMore') || $(e.target).is('.close') || $(e.target).is('#goToCar')) {
                                iElement.popover('hide');
                            }
                        });
                    });
                }
            };
        }
    ])
})