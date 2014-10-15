define('item-ctrl/detail', ['at_app', 'atmanlib-lib/GOODS_TYPE', 'filter/emojis', 'filter/at_link',
    'directive/at_validate', 'directive/at_user_popover', 'directive/at_goods_detail_tip',
    'directive/at_paging', 'directive/at_zoom', 'filter/emojis', 'directive-common/add-cart-item',
    'directive/at_user_popover',
    'common-ctrl/weibo/at.weibo.comment.input.ctrl', 'common-ctrl/weibo/at.weibo.comment.list.ctrl',
    'common-ctrl/weibo/at.weibo.forwards.ctrl', 'highcharts'
], function(app, GOODS_TYPE) {
    app.lazy.controller('ctrl.item.detail', ['$scope', '$route', '$timeout', '$window', '$document', '$location', '$rootScope', '$routeParams', 'GoodsDetail', 'GoodsComment', 'Promo', 'StockCategoryBonusDetail', 'RelatedGoods', 'CategoryStockListForLinePic', 'GetBuyerCommentByStarNum', 'weibo',
        function($scope, $route, $timeout, $window, $document, $location, $rootScope, $routeParams, GoodsDetail, GoodsComment, Promo, StockCategoryBonusDetail, RelatedGoods, CategoryStockListForLinePic, GetBuyerCommentByStarNum, weibo) {

            //$document.scrollTop(600);

            // function share(goods) {
            //     // setTimeout(function() {
            //         window._bd_share_config = {
            //             "common": {
            //                 "bdSnsKey": {},
            //                 "bdMini": "2",
            //                 "bdMiniList": false,
            //                 "bdSign": "no",
            //                 "bdPic": "",
            //                 "bdStyle": "1",
            //                 "bdSize": "16"
            //             },
            //             "share": [{}]
            //         };
            //         window._bd_share_config.common.bdDesc = goods.topComment;
            //         window._bd_share_config.common.bdText = goods.goodsName;
            //         window._bd_share_config.common.bdPic = window.location.protocol + '//' + window.location.hostname + goods.goodsImage;
            //         window._bd_share_config.common.bdUrl = $location.absUrl();
            //          $('#shareBaidu').remove();
            //         var st = (document.getElementsByTagName('head')[0] || document.body).appendChild(document.createElement('script'));
            //         st.id="shareBaidu";
            //         st.src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5);

            //     // }, 300)
            // }
            function share(goods) {
                window.jiathis_config = {
                    shortUrl: false,
                    hideMore: false,
                    data_track_clickback: !0
                }
                window.jiathis_config.url = $location.absUrl();
                window.jiathis_config.title = goods.goodsName;
                window.jiathis_config.summary = goods.topComment+goods.goodsName;
                window.jiathis_config.desc = goods.topComment+goods.goodsName;
                window.jiathis_config.pic = window.location.protocol + '//' + window.location.hostname + goods.goodsImage;
                var st = (document.getElementsByTagName('head')[0] || document.body).appendChild(document.createElement('script'));
                st.src = 'http://v3.jiathis.com/code/jia.js';
            }

            function shareQQZone(goods) {
                // var p = {
                // url:$location.absUrl(),
                // showcount:'0',/*是否显示分享总数,显示：'1'，不显示：'0' */
                // desc:goods.topComment,/*默认分享理由(可选)*/
                // summary:goods.topComment,/*分享摘要(可选)*/
                // title:goods.goodsName,/*分享标题(可选)*/
                // site:'吾商',/*分享来源 如：腾讯网(可选)*/
                // pics:window.location.protocol + '//' + window.location.hostname + goods.goodsImage, /*分享图片的路径(可选)*/
                // style:'203',
                // width:22,
                // height:22
                // };
                // var s = [];
                // for(var i in p){
                // s.push(i + '=' + encodeURIComponent(p[i]||''));
                // }
                // $scope.shareQQZoneUrl = s.join('&');
                // var st2 = (document.getElementsByTagName('head')[0] || document.body).appendChild(document.createElement('script'));
                // st2.src = 'http://qzonestyle.gtimg.cn/qzone/app/qzlike/qzopensl.js#jsdate=20111201';
            }

            $scope.page = {
                status: {
                    goods: 0, //0: loading, 1: loaded, 2:load error
                    topCmt: 0,
                    sevenYearBonus: 0,
                    relatedGoods: 0
                }
            };
            $scope.model = {
                goods: {
                    goodsTypeCode: "",
                    goodsTypeName: "",
                    topCommentHeadImage: "",
                    topCommentType: 3, // 1:不显示 2，买家推广， 3，系统推广
                    topComment: null,
                    saleStatus: 1 //1:普通商品 2，秒杀商品， 3，已售完
                },
                buyNumLimit: 99,
                bonus: {
                    bonusYesterday: 0,
                    yearReturnRate: 0
                },
                recentlyBuyerList: [],
                relatedGoods: [],
                allComments: [],
                buyerComments: [],
                activeCommentNav: "buyerComment"
            };

            $scope.GDSubmitModel = {
                quantity: 1,
                goodsId: $routeParams.goodsId || "",
                commentId: $routeParams.commentId || "",
                saleStatus: 1
            };

            $scope.currentNav = "description";

            $scope.gotoNav = function(nav) {
                $scope.currentNav = nav;
                if (nav == 'comment') {
                    $scope.commentFilter = 'buyerComment';

                }
                $document.scrollTop($scope.offsetTop);
            };



            //只能输入数字
            var REGEXP = {};
            REGEXP.INVALID_NUMBER = /[^0-9]/g;
            REGEXP.NUMBER = /^\d+$/;

            var $$validate = {};
            $$validate.replaceToPositiveIntegers = function(str) {
                if (str == 0 || str == null || str == undefined || str == '' || isNaN(str)) {
                    return 1;
                }
                return str.replace(REGEXP.INVALID_NUMBER, '');
            };

            $$validate.atNumber = function(str) {
                return REGEXP.NUMBER.test(str);
            };

            //修改数字
            $scope.modifyNum = function(flag) {
                if (!flag) {
                    $scope.GDSubmitModel.quantity--;
                } else {
                    $scope.GDSubmitModel.quantity++;
                }
            };

            $scope.$watch('GDSubmitModel.quantity', function(news, olds, scope) {
                if (!$$validate.atNumber(news)) {
                    $scope.GDSubmitModel.quantity = $$validate.replaceToPositiveIntegers(news);
                }
                if ($scope.model.goods.promotionBriefBean) {
                    if (news >= $scope.model.goods.promotionBriefBean.promotionLimit) {
                        $scope.GDSubmitModel.quantity = $scope.model.goods.promotionBriefBean.promotionLimit;
                    }
                } else if (news >= $scope.model.buyNumLimit) {
                    $scope.GDSubmitModel.quantity = $scope.model.buyNumLimit;
                }
            });

            function initPage() {
                if (angular.isFunction($document.scrollTop)) {
                    $document.scrollTop(0); //回到顶部
                }
                var detailNav = $("#gd-dtl-nav");
                var navCart = detailNav.find("button");
                var path = $location.path();
                if (path.indexOf('/comment/') != -1) {
                    $scope.gotoNav('comment');
                }

                // $timeout(function() {
                $($window).scroll(function() {
                    if(!$scope.offsetTop) {
                        $scope.offsetTop = detailNav.offset().top;
                    }

                    var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                    $scope.scrollTop = scrollTop;

                    if ($scope.scrollTop > $scope.offsetTop) {
                        if (!detailNav.hasClass("at-fixed-top")) {
                            if ($scope.model.goods.canBuy) {
                                navCart.removeClass("hide");
                            }
                            detailNav.addClass("at-fixed-top");
                        }
                    } else {
                        navCart.addClass("hide");
                        detailNav.removeClass("at-fixed-top");
                    }
                });
                // }, 300);

            }

            function initGoodsImg() {
                var selImg = 0;
                $scope.imgStyle = {};
                $scope.imgStyle.left = 0;
                $scope.imgHover = 0;
                //$scope.mainImgTmp = '/common/template/main-img.html';

                var options = {
                    zoomType: 'standard',
                    lens: true,
                    preloadImages: true,
                    alwaysOn: false,
                    zoomWidth: 446,
                    zoomHeight: 446,
                    xOffset: 1,
                    yOffset: 0,
                    position: 'right',
                    title: false,
                    preloadText: '加载中...'
                };
                $timeout(function() {
                    angular.element('#jqZoom').jqzoom(options);
                }, 1000);

                $scope.atThumbLeftDisabled = !0;

                //切换图片
                $scope.replaceMainImg = function(i) {
                    $scope.imgHover = i;
                    $scope.mainImg = $scope.model.goods.goodsImages[i];
                }

                $scope.imgLeft = function() {
                    if (!$scope.atThumbLeftDisabled) {
                        selImg -= 1;
                        $scope.imgStyle.left += 60;
                        initLeftAndRight();
                    }
                }

                $scope.imgRight = function() {
                    if (!$scope.atThumbRightDisabled) {
                        selImg += 1;
                        $scope.imgStyle.left -= 60;
                        initLeftAndRight();
                    }
                }

                initLeftAndRight();

                function initLeftAndRight() {
                    if (selImg == 0) {
                        $scope.atThumbLeftDisabled = !0;
                    } else {
                        $scope.atThumbLeftDisabled = !1
                    }
                    if ($scope.model.goods.goodsImages.length > 4) {
                        if ($scope.model.goods.goodsImages.length - 4 == selImg) {
                            $scope.atThumbRightDisabled = !0;
                        } else {
                            $scope.atThumbRightDisabled = !1;
                        }
                    } else {
                        $scope.atThumbRightDisabled = !0;
                    }
                }
            }

            if ($routeParams.goodsId) {
                getGoodsDetail();
            }

            function getRelatedGoods() {
                RelatedGoods.get({
                    id: $routeParams.goodsId
                }, function(data) {
                    $scope.relatedGoods = data;
                });
            }

            function getGoodsDetail() {
                GoodsDetail.get({ id: $routeParams.goodsId}).$promise.then(function(data) {
                    if (!data.resultStatusBean) {
                        if(!data.promotionBriefBean) {
                            angular.extend($scope.model.goods, data);
                            if (!$routeParams.commentId && data.weiboDesc) {
                                $scope.model.goods.topCommentType = 3;
                                $scope.model.goods.topComment = data.weiboDesc;
                            }
                            if (!data.canBuy) {
                                //正常售完
                                $scope.model.goods.saleStatus = $scope.GDSubmitModel.saleStatus = 3;
                            }
                            if (GOODS_TYPE[data.goodsTypeId]) {
                                $scope.model.goods.goodsTypeCode = parseInt(data.goodsTypeId / 100);
                                $scope.model.goods.goodsTypeName = GOODS_TYPE[$scope.model.goods.goodsTypeCode][0];
                                StockCategoryBonusDetail.get({
                                    categoryId: $scope.model.goods.goodsTypeCode
                                }).$promise.then(function(data) {
                                        $scope.model.bonus = data;
                                    });
                                sevenYearsBonusChart();
                                initGoodsImg();
                                getRelatedGoods();
                            }
                            if ($routeParams.commentId) {
                                getTopComment();
                            }
                            if (data.goodsImages && data.goodsImages.length) {
                                $scope.model.goods.mainImg = data.goodsImages[0];
                            }
                            $scope.page.status.goods = 1;
                            initPage();
                            share($scope.model.goods);
                            shareQQZone($scope.model.goods);
                        }
                        else {
                            var rdPath = "/quickbuy/" + $routeParams.goodsId;
                            if($routeParams.commentId){
                                rdPath += "/" + $routeParams.commentId;
                            }
                            if($routeParams.key){
                                rdPath += "/" + $routeParams.key;
                            }
                            $location.path(rdPath);
                        }
                    }
                    else {
                        $scope.page.status.goods = 2;
                        //$rootScope.notification(data.resultStatusBean.message);
                    }
                }, function(){
                    $scope.page.status.goods = 2;
                });
            }

            function getTopComment() {
                GoodsComment.get({
                    id: $routeParams.goodsId,
                    goodsCommentId: $routeParams.commentId
                }, function(data) {
                    if (!data.resultStatusBean) {
                        $scope.model.goods.topCommentType = 2;
                        $scope.model.goods.topComment = data.content;
                        $scope.model.goods.topCommentBuyer = data.buyer;
                    } else {
                        $scope.GDSubmitModel.commentId = "";
                        $scope.model.goods.topCommentType = 3;
                        $scope.model.goods.topComment = $scope.model.goods.weiboDesc;
                    }
                    share($scope.model.goods);
                    shareQQZone($scope.model.goods);
                });
            }

            function sevenYearsBonusChart() {

                var timeLineArray = [];
                var yearReturnRateArray = [];

                //number天数目前暂时取7天数据
                CategoryStockListForLinePic.get({
                    categoryId: $scope.model.goods.goodsTypeCode,
                    number: 7
                }).$promise.then(function(data) {
                        angular.forEach(data, function(value, key) {
                            timeLineArray.push(value.bonusDateString);
                            yearReturnRateArray.push(value.yearReturnRate);
                        });
                        angular.element("#sevenYearsBobus").highcharts({
                            colors: ["#F3803D"],
                            plotOptions: {
                                line: {
                                    lineWidth: 1
                                },
                                series: {
                                    marker: {
                                        radius: 2,  //曲线点半径，默认是4
                                        symbol: 'circle' //曲线点类型："circle", "square", "diamond", "triangle","triangle-down"，默认是"circle"
                                    }
                                }
                            },
                            chart: {
                                backgroundColor: "#FAFAFA",
                                plotBorderColor: "#dddddd",
                                plotBorderWidth: 0
                            },
                            title: {
                                text: '年化收益 (%)',
                                x: -10, //center
                                style: {
                                    color: '#666',
                                    'font-size': '12px',
                                    'font-weight': '500',
                                    'font-family': 'Microsoft YaHei'
                                }
                            },
                            subtitle: {
                                text: '',
                                x: -20
                            },
                            xAxis: {
                                lineColor: "#ddd",
                                gridLineWidth: 1,
                                tickWidth: 0,
                                gridLineColor: "#e5e5e5",
                                categories: timeLineArray || [],
                                labels: {
                                    style: {
                                        color: '#888',
                                        'font-size': '11px',
                                        width: '40px'
                                    }
                                }
                            },
                            yAxis: {
                                gridLineWidth: 1,
                                gridLineColor: "#e5e5e5",
                                minorGridLineColor: "#e5e5e5",
                                minorTickInterval: 'auto',
                                title: {
                                    text: ''
                                },
                                labels: {
                                    style: {
                                        color: '#888',
                                        'font-size': '11px'
                                    }
                                },
                                min: 0
                            },
                            tooltip: {
                                valueSuffix: '%',
                                shared: true,
                                crosshairs: [true, true]
                            },
                            legend: {
                                enabled: false
                            },
                            series: [{
                                name: $scope.model.goods.goodsTypeName,
                                data: yearReturnRateArray || []
                            }],
                            credits: {
                                enabled: false
                            }
                        });
                    });
            }

            //计算抢购剩余时间
            /*function getlastTime() {
             var lastTime = $scope.model.goods.promotionBriefBean.endTime - new Date().getTime();
             var hours = Math.floor(lastTime / (3600 * 1000));
             if (hours < 10) {
             hours = "0" + hours;
             }
             var leave1 = lastTime % (3600 * 1000);
             var minutes = Math.floor(leave1 / (60 * 1000));
             var leave2 = leave1 % (60 * 1000);
             var seconds = Math.round(leave2 / 100);
             if (seconds < 10) {
             seconds = "0" + seconds;
             }
             var perSeconds = seconds / 10;
             if (seconds % 10 == 0) {
             perSeconds = seconds / 10 + ".0";
             }
             if (hours >= 0 && minutes >= 0 && seconds >= 0) {
             $scope.model.promRemainHours = hours;
             $scope.model.promRemainMinutes = minutes;
             $scope.model.promRemainSeconds = perSeconds;
             $timeout(getlastTime, 100);
             }
             }*/

            //领取对角币
            $scope.promoCoinGet = false;

            $scope.getPromo = function() {
                if (!$scope.promoCoinGet) {
                    Promo.save($routeParams).$promise.then(function(data) {
                        if (data.resultStatusBean) {
                            $rootScope.notification(data.resultStatusBean.message);
                        } else {
                            $scope.promoCoinGet = true;
                            $scope.promoCoin = data.promoCoin;
                            showCoinFlash();
                        }
                    });
                }
            };

            $scope.test = function() {
                showCoinFlash();
            };

            function showCoinFlash() {
                $scope.showCoin = true;
                $timeout(function(){
                    $scope.showCoin = false;
                    $rootScope.notification("金币 +" + $scope.promoCoin);
                }, 1500);
            }

            if ($routeParams.key && $routeParams.commentId) {
                Promo.get($routeParams).$promise.then(function(data) {
                    if (!data.resultStatusBean) {
                        $scope.promoCoin = data.promoCoin;
                        if($routeParams.agc){
                            $timeout(function(){
                                $scope.getPromo();
                            }, 500);
                        }
                    } else {
                        $rootScope.notification(data.resultStatusBean.message);
                    }
                });
            }
        }
    ]);
    /**
     商品评论/转发模块
     **/
    app.lazy.controller('commentCtrl', ['$scope', '$rootScope', '$window', '$routeParams', '$location', '$timeout', 'GetBuyerCommentByStarNum',
        function($scope, $rootScope, $window, $routeParams, $location, $timeout, GetBuyerCommentByStarNum) {
            $scope.commentParams = {}; //请求评论的参数

            $scope.searchItems = {};

            $scope.commentList = []; //保存商品的评论信息

            $scope.commentFilter = 'buyerComment';

            $scope.star = [];

            $scope.$parent.model.goods.replysFlag = 1;



            var one = 0;

            lazy();

            function lazy() {
                if (one) {
                    return false;
                }
                one = 1;
                getCommentDetail(1);
            }

            $($window).scroll(function() {
                if ($($window).scrollTop() > 500) {
                    lazy();
                }
            })

            $scope.getByStarNum = function(starnum) {
                $scope.commentParams.star = starnum;
                getCommentDetail(true);
            }

            $scope.openForwards = function(data) {
                $rootScope.$emit('weibo-forwards:open', data);
            }


            function getCommentDetail(flag) {
                if (flag) {
                    $scope.commentParams.needCount = true;
                    delete $scope.commentParams.count;
                    delete $scope.commentParams.currentPage;
                    delete $scope.commentParams.pageSize;
                }
                else {
                    delete $scope.commentParams.needCount;
                }
                $scope.commentParams.goodsId = $routeParams.goodsId;
                GetBuyerCommentByStarNum.getCommentDetail($scope.commentParams, function(data) {
                    $scope.commentList = data.data;
                    angular.extend($scope.commentParams, data.page);
                    initRecentlyBuyer();
                    lazyloadImg();
                });
            }

            function lazyloadImg() {
                $timeout(function() {
                    angular.element('img.lazy').lazyload({
                        effect: "fadeIn"
                    });
                    // $element.find('img.lazy').lazyload({
                    //     effect: "fadeIn"
                    // });
                }, 100)
            }

            function initRecentlyBuyer() {
                var recentlyBuyerList = [];
                if ($scope.commentList && $scope.commentList.length > 0) {
                    angular.forEach($scope.commentList, function(value) {
                        recentlyBuyerList.push(value.buyer);
                    });
                    $scope.$parent.RecentlyBuyerList = recentlyBuyerList;
                } else {
                    $scope.$parent.RecentlyBuyerList = [];
                }
                //$scope.$parent.$apply();
            }

            //执行下一页/上一页查询
            $scope.$on('at.paging.currentPage', function(e, data) {
                angular.extend($scope.commentParams, data);
                getCommentDetail();
            });

            $rootScope.$on('GoodsComment:refurbish', function(e, data) {
                $scope.commentFilter = 'comment';
                $scope.$parent.model.goods.replysFlag = 2;
            });

            $scope.selFilter = function(args) {
                $scope.commentFilter = args;
                $scope.$parent.model.goods.replysFlag = 1;
            }
        }
    ]);



});