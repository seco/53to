define('home-ctrl/channel', ['at_app', 'atmanlib-lib/GOODS_TYPE', 'filter/at_link', 'filter/emojis', 'filter/goodstype2name', 'common-ctrl/weibo/at.weibo.list.ctrl', 'common-ctrl/weibo/at.weibo.media.view.ctrl', 'common-ctrl/weibo/at.weibo.input.ctrl', 'common-ctrl/weibo/at.weibo.expand.record.ctrl', 'directive/weibo/weibo-media-view', 'common-ctrl/weibo/at.weibo.comment.input.ctrl', 'common-ctrl/weibo/at.weibo.comment.list.ctrl', 'common-ctrl/weibo/at.weibo.forwards.ctrl', 'directive/weibo/highchart-linepic'], function(app, GOODS_TYPE) {

    app.lazy.controller('ctrl.home.channel', ['$scope', '$routeParams', 'GOODSTYPE', 'StockCategoryBonusDetail', '$timeout',
        function($scope, $routeParams, GOODSTYPE, StockCategoryBonusDetail, $timeout) {
            //注意：不能取service里面的这个GOODSTYPE，静态化文件更新后，会造成取到的商品类目名称不统一
            $scope.GOODSTYPE = GOODS_TYPE;
            //取当前类目收益（必须）
            StockCategoryBonusDetail.get({
                'categoryId': $routeParams.id
            }, function(data) {
                $scope.stockCategoryBonusDetailBean = data;
                $scope.stockCategoryBonusDetailBean.categoryId = $routeParams.id;
            })
            //获取当前类目的id(必须)
            $scope.categoryId = $routeParams.id;
            //类目曲线图隐藏
            $scope.chartShow = false;
            $timeout(function() {
                $scope.chartShow = true;
            }, 5000);
            $scope.toggleChart = function() {
                $scope.chartShow = !$scope.chartShow;
                // $('#highChart-box').style.height = $scope.chartShow?'0px':'200px';
                return false;
            }
        }
    ]);
    app.lazy.controller('ctrl.home.channel.recommend', ['$scope', '$routeParams', 'goods',
        function($scope, $routeParams, goods) {
            goods.getGoodsRecommend($routeParams).$promise.then(function(data) {
                $scope.clRecList = data;
            });
        }
    ]);
    app.lazy.controller('ctrl.home.channel.list', ['$scope', '$routeParams', 'goods',
        function($scope, $routeParams, goods) {
            $scope.clNum = 10;

            goods.getGoodsTypeById($routeParams).$promise.then(function(data) {
                $scope.channelList = data.data;
            });

            $scope.next = function() {
                $scope.clNum += 10;
            }

            function autoScroll() {
                //下面这句主要是获取网页的总高度，主要是考虑兼容性所以把Ie支持的documentElement也写了，这个方法至少支持IE8
                var htmlHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
                //clientHeight是网页在浏览器中的可视高度，
                var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
                //scrollTop是浏览器滚动条的top位置，
                var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

                $scope.scrollTop = scrollTop;
                //通过判断滚动条的top位置与可视网页之和与整个网页的高度是否相等来决定是否加载内容；
                if ((scrollTop + clientHeight) == htmlHeight) {
                    $scope.next();
                    $scope.$apply();
                }
            }

            $(window).bind('scroll', autoScroll);
        }
    ]);

});
define('home-ctrl/goods-detail',['at_app', 'atmanlib-lib/GOODS_TYPE', 'filter/emojis', 'filter/at_link', 'directive/at_validate','directive/at_goods_detail_tip', 'directive/at_paging', 'directive/at_zoom', 'filter/emojis', 'directive/weibo/weibo-comment-input', 'directive/weibo/weibo-comment-list', 'directive/weibo/weibo-forwards', 'directive-common/add-cart-item'], function(app, GOODS_TYPE) {

    app.lazy.filter('JQHT', function() {
        return function(str) {
            return $(str).text();
        }
    });
    /**
     页面总控制器
     **/
    app.lazy.controller('ctrl.home.goods.detail', ['$scope', '$window', '$document', '$resource', '$timeout', '$location', '$rootScope', '$routeParams', '$route', 'getTpl', 'GoodsDetail', 'unique', 'GoodsComment', 'Promo', 'SmallShoppingCar', 'getUrlParam', 'CartItem',
        function($scope, $window, $document, $resource, $timeout, $location, $rootScope, $routeParams, $route, getTpl, GoodsDetail, unique, GoodsComment, Promo, SmallShoppingCar, getUrlParam, CartItem) {
            $scope.commentFirst = {};
            $scope.buyNumLimit = 99;
            $scope.commentFilter = 'buyerComment';

            $scope.Goods = {
                topCommentHeadImage: "",
                topCommentType: 1, // 1:不显示 2，买家推广， 3，系统推广
                topComment: null,
                saleStatus: 1 //1:普通商品 2，秒杀商品， 3，已售完
            };

            $scope.GDSubmitModel = {
                quantity: 1,
                goodsId: $routeParams.goodsId || "",
                commentId: $routeParams.commentId || "",
                saleStatus: 1
            };

            if($routeParams.goodsId){
                getGoodsDetail();
            }

            if($routeParams.commentId) {
                getTopComment();
            }

            function getGoodsDetail(){
                GoodsDetail.get({id: $routeParams.goodsId}, function(data) {
                    if (!data.resultStatusBean) {
                        $scope.Goods = angular.extend($scope.Goods, data);
                        if(!$routeParams.commentId && $scope.Goods.weiboDesc){
                            $scope.Goods.topCommentType = 3;
                            $scope.Goods.topComment = $scope.Goods.weiboDesc;
                        }
                        if(!$scope.Goods.canBuy){
                            $scope.Goods.saleStatus = $scope.GDSubmitModel.saleStatus = 3;
                        }
                        else if (data.promotionBriefBean) {
                            $scope.buyNumLimit = data.promotionBriefBean.promotionLimit;
                            $scope.Goods.saleStatus = 2;
                            $scope.Goods.saleStatus = $scope.GDSubmitModel.saleStatus = 2;
                            getlastTime();
                        }
                        if (GOODS_TYPE[data.goodsTypeId]) {
                            $scope.Goods.goodsTypeName = GOODS_TYPE[data.goodsTypeId][0];
                        }
                        if (data.goodsImages && data.goodsImages.length) {
                            $scope.mainImg = data.goodsImages[0];
                        }
                        $rootScope.$emit('at.getGoodsDetail', $scope.Goods);
                    }
                    else {
                        $rootScope.notification(data.resultStatusBean.message);

                    }
                });
            }

            function getTopComment(){
                GoodsComment.get({id: $routeParams.goodsId, goodsCommentId: $routeParams.commentId}, function(data) {
                    if(!data.resultStatusBean){
                        $scope.Goods.topCommentType = 2;
                        $scope.topComment = data;
                    }
                });
                var timeout = 2000;
                $timeout(PromoFun, timeout);
            }

            //计算抢购剩余时间
            function getlastTime() {
                var lastTime = $scope.Goods.promotionBriefBean.endTime - new Date().getTime();
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
                    $scope.Goods.promRemainHours = hours;
                    $scope.Goods.promRemainMinutes = minutes;
                    $scope.Goods.promRemainSeconds = perSeconds;
                    $timeout(getlastTime, 100);
                    //$("#timeLeftMsg").html('剩余<span class="highlight">' + hours + '</span>时<span class="highlight">' + minutes + '</span>分<span class="highlight">' + perSeconds + '</span>秒');
                }
            }

            //$scope.$emit('at.getsmallshopingcar', true);

            //领取对角币
            function PromoFun() {
                var timeout = 2000;
                if ($routeParams.key && $routeParams.commentId) {
                    var p = new Promo($routeParams);
                    // angular.extend(p, $routeParams);
                    p.$save(function(data, head) {
                        if (data.resultStatusBean) {
                            $rootScope.notification(data.resultStatusBean.message);
                        } else {
                            $rootScope.promoCoin = data.promoCoin;
                            showAlert();
                        }
                    })
                }
            }
            // $timeout(function() {
            //     $scope.adPayment = 1000;
            //     showAlert();
            // }, 5000);

            // //提示信息
            // function showAlert() {
            //     var timeout = 2000;
            //     $scope.showPromo = !0;
            //     $timeout(function() {
            //         $scope.showPromo = !1;
            //     }, timeout);
            // }

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
            //只能输入数字
            $scope.$watch('GDSubmitModel.quantity', function(news, olds, scope) {
                if (!$$validate.atNumber(news)) {
                    $scope.GDSubmitModel.quantity = $$validate.replaceToPositiveIntegers(news);
                } else {
                    if (!!$scope.Goods.promotionBriefBean && news >= $scope.Goods.promotionBriefBean.promotionLimit)
                        $scope.GDSubmitModel.quantity = $scope.Goods.promotionBriefBean.promotionLimit;
                }
            });

            var detailNav = $("#gd-dtl-nav");
            var navCart = detailNav.find("button");
            $scope.offsetTop = detailNav.offset().top;
            $($window).scroll(function() {
                //detailNav.css("width", detailNav.width());
                if (!$scope.offsetTop) {
                }
                var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                $scope.scrollTop = scrollTop;
                if (scrollTop > $scope.offsetTop) {
                    if (!detailNav.hasClass("at-fixed-top")) {
                        if ($scope.Goods.canBuy) {
                            navCart.removeClass("hide");
                        }
                        detailNav.addClass("at-fixed-top");
                    }
                }
                else {
                    navCart.addClass("hide");
                    detailNav.removeClass("at-fixed-top");
                }
            });

            $scope.currentNav = "description";

            $scope.gotoNav = function(nav) {
                console.log('gotoNav', nav);
                $scope.currentNav = nav;
                if(nav=='buyerComment'){
                    $scope.commentFilter = nav;
                    $scope.Goods.replysFlag = 2;
                    console.log('commentFilter', $scope.commentFilter);
                }
                $($document).scrollTop($scope.offsetTop);
            };
        }
    ]);
    /**
     商品图片模块
     **/
    app.lazy.controller('GDImgListCtrl', ['$scope', '$rootScope', '$element', 'getTpl',
        function($scope, $rootScope, $element, getTpl) {
            var selImg = 0;
            $scope.imgStyle = {};
            $scope.imgStyle.left = 0;
            $scope.imgHover = 0;
            $scope.mainImgTmp = getTpl.common('main-img.html');

            var options = {
                zoomType: 'standard',
                lens: true,
                preloadImages: true,
                alwaysOn: false,
                zoomWidth: 300,
                zoomHeight: 300,
                xOffset: 20,
                yOffset: 10,
                position: 'right',
                title: false,
                preloadText: '加载中...'
            };
            $('#jqZoom').jqzoom(options);

            $scope.atThumbLeftDisabled = !0;
            $scope.$watch('Goods.goodsImages.length', function(news, olds) {
                if (news != olds) {
                    if (news < 5) {
                        $scope.atThumbRightDisabled = !0;
                    }
                }
            }, !0)

            //切换图片
            $scope.replaceMainImg = function(i) {
                $scope.imgHover = i;
                $scope.mainImg = $scope.Goods.goodsImages[i];
                $scope.mainImgTmp = '';
                $scope.mainImgTmp = getTpl.common('main-img.html');
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
                    $scope.imgStyle.left -=60;
                    initLeftAndRight();
                }
            }

            function initLeftAndRight(){
                if (selImg == 0) {
                    $scope.atThumbLeftDisabled = !0;
                } else {
                    $scope.atThumbLeftDisabled = !1
                }
                if($scope.Goods.goodsImages.length > 4){
                    if ($scope.Goods.goodsImages.length - 4 == selImg) {
                        $scope.atThumbRightDisabled = !0;
                    } else {
                        $scope.atThumbRightDisabled = !1;
                    }
                }
            }
        }
    ]);
    /**
     商品评论/转发模块
     **/
    app.lazy.controller('commentCtrl', ['$scope', '$window', '$routeParams', '$location', 'GetBuyerCommentByStarNum',
        function($scope, $window, $routeParams, $location, GetBuyerCommentByStarNum) {
            $scope.commentParams = {}; //请求评论的参数

            $scope.searchItems = {};

            $scope.commentList = []; //保存商品的评论信息

            $scope.star = [];

            $scope.$parent.Goods.replysFlag = 1;

            var one = 0;

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
                getCommentDetail();
            }

            function getCommentDetail(flag) {
                if (flag) {
                    $scope.commentParams.needCount = true;
                    delete $scope.commentParams.count;
                    delete $scope.commentParams.currentPage;
                    delete $scope.commentParams.pageSize;
                } else {
                    delete $scope.commentParams.needCount;
                }
                $scope.commentParams.goodsId = $routeParams.goodsId;
                GetBuyerCommentByStarNum.getCommentDetail($scope.commentParams, function(data) {
                    $scope.commentList = data.data;
                    angular.extend($scope.commentParams, data.page);
                });
            }

            //执行下一页/上一页查询
            $scope.$on('at.paging.currentPage', function(e, data) {
                $scope.commentParams = data;
                getCommentDetail();
            });

            $scope.selFilter = function(args) {
                $scope.commentFilter = args;
                $scope.Goods.replysFlag = 1;
            }
        }
    ]);
});
define('home-ctrl/goods-search',['at_app', 'atmanlib-lib/GOODS_TYPE', 'directive/at_paging', 'directive/at_paging_sm', 'directive/search', 'filter/at_link', 'filter/emojis'], function(app, GOODS_TYPE) {

    app.lazy.controller('goodsSearchCtrl', ['$scope', '$rootScope', '$routeParams', 'SearchGoods', 'GetSeller',
        function($scope, $rootScope, $routeParams, SearchGoods, GetSeller) {
            $scope.goodsName = $routeParams.selectInfo;
            $scope.type = "3";
            //修改搜索内容时，重新查询用户
            /*$scope.$on('home.goods.search', function(e, args) {
             $scope.goodsName = args;
             $scope.getGoodsByGoodsName($scope.goodsName);
             });*/

            $scope.searchItems = {};
            $scope.searchItems.needCount = true;
            $scope.goodsType = GOODS_TYPE;
            $scope.getGoodsByGoodsName = function(param) {
                if(param.length<=1){
                    return false;
                }
                $scope.searchItems.goodsName = param;
                SearchGoods.get($scope.searchItems, function(data) {
                    if (data.resultStatusBean) {
                        $rootScope.notification(data.resultStatusBean.message);
                    } else {
                        $scope.goodsResultList = data.data;
                        angular.extend($scope.searchItems, data.page);
                    }
                })
            }
            $scope.getGoodsByGoodsName($scope.goodsName);
            //执行下一页/上一页查询
            $scope.$on('at.paging.currentPage', function(e, data) {
                angular.extend($scope.searchItems, data);
                $scope.getGoodsByGoodsName($scope.searchItems);
            });

        }
    ])
})
define('home-ctrl/index', [
    'at_app',
    'service/weibo',
    'directive/at_paging',
    'common-ctrl/at.crush.ctrl',
    'common-ctrl/weibo/at.weibo.input.ctrl',
    'common-ctrl/weibo/at.ctrl.weibo.list',
    'common-ctrl/weibo/at.weibo.media.view.ctrl',
    'common-ctrl/weibo/at.weibo.comment.input.ctrl',
    'common-ctrl/weibo/at.weibo.comment.list.ctrl',
    'common-ctrl/weibo/at.weibo.forwards.ctrl',
    'atmanlib-provider/modal'
], function(app) {
    app.lazy.controller('ctrl.home.index', ['$scope', '$rootScope', '$cookies', 'buyerPromoPromoed', 'buyerStockBrief', 'BuyerAccountmyself', 'Recommend', 'RecommendUser', '$ATModal', 'weibo', 'BuyerProfit',
        function($scope, $rootScope, $cookies, buyerPromoPromoed, buyerStockBrief, BuyerAccountmyself, Recommend, RecommendUser, $ATModal, weibo, BuyerProfit) {
            $('#pic-play').carousel({
                interval: 5000
            }); //隔5秒自动播放
            $scope.newWeibo = false;
            //确定弹窗提示收益还是提示关注推荐用户
            if ($cookies.FSTLGN == 1) {
                showRecUser();
            } else {
                showPromo();
            }

            function showPromo() {
                var day = new Date().getDate();
                if ($cookies.FIRST_NOTI != day) {
                    BuyerProfit.get({
                        day: -1
                    }, function(data) {
                        var options = {
                            scope: $scope,
                            show: true,
                            template: "/common/template/common/promo.html"
                        };
                        // Initialize modal
                        var promoModal = $ATModal(options);
                        promoModal.$scope.receive = function(i) {
                            var pl = promoModal.$scope.promoList[i];
                            //promoModal.$scope.one.coinTotal -= pl.coin;
                            promoModal.$scope.promoList.splice(i, 1);
                            window.open('/item/#/' + pl.goodsBriefBean.goodsId + '/' + pl.goodsCommentBean.goodsCommentId + '/' + pl.uuid + "?agc=1");
                        };
                        buyerPromoPromoed.get(function(data) {
                            promoModal.$scope.promoList = data.data;
                        });
                        buyerStockBrief.get(function(data) {
                            promoModal.$scope.stockbrief = data;
                        });
                        BuyerAccountmyself.get(function(data) {
                            promoModal.$scope.buyerAccountInfo = data;
                        });
                        $rootScope.setCookie("FIRST_NOTI", day, 7);

                        promoModal.$scope.closePromoModal = function() {
                            if (promoModal) {
                                promoModal.hide();
                            }
                        };
                        promoModal.$scope.buyerProfit = data;
                    });
                }
            }

            function showRecUser() {
                var options = {
                    show: true,
                    template: "/common/template/common/recommend-user.html"
                };
                // Initialize modal
                var recModal = $ATModal(options);
                recModal.$scope.selectUser = function(user) {
                    if (!(user.buyerType == 2)) {
                        if (user.isFollow) {
                            recModal.$scope.followCount--;
                        } else {
                            recModal.$scope.followCount++;
                        }
                    }
                };
                recModal.$scope.closeRecModal = function() {
                    if (recModal) {
                        recModal.hide();
                    }
                };
                recModal.$scope.submitRecUser = function() {
                    var ids = "";
                    angular.forEach(recModal.$scope.recUserList, function(user, key) {
                        if (user.isFollow) {
                            ids = ids + ',' + user.buyerId;
                        }
                    });
                    if (ids) {
                        //提交关注的用户
                        RecommendUser.save({
                            ids: ids.substring(1, ids.length)
                        }, function(data) {
                            $rootScope.loadWbUser();
                            if (recModal) {
                                recModal.hide();
                            }
                        });
                    }
                };
                Recommend.get(function(data) {
                    angular.forEach(data.result, function(value) {
                        value.isFollow = true;
                    });
                    recModal.$scope.recUserList = data.result;
                    if (data.result.length > 12) {
                        recModal.$scope.followCount = 12;
                    } else {
                        recModal.$scope.followCount = data.result.length;
                    }
                });
                $rootScope.setCookie("FSTLGN", 0, 7);
            }

            $scope.page = {
                status: {
                    wblist: 0 //0: loading, 1: loaded, 2:load error
                }
            };

            //微博列表
            $scope.searchItems = {};

            function getWeiboList(needCount) {
                $scope.page.status.wblist = 0;
                $scope.searchItems.needCount = needCount;
                weibo.getWbList($scope.searchItems).$promise.then(function(data) {
                    $scope.page.status.wblist = 1;
                    $scope.weiboList = data.data;
                    angular.extend($scope.searchItems, data.page);
                    if (!needCount) {
                        $("html,body").animate({
                            scrollTop: 680
                        });
                    }
                })
            }
            getWeiboList(true);
            //执行下一页/上一页查询
            $scope.$on("at.paging.currentPage", function(e, data) {
                angular.extend($scope.searchItems, data);
                getWeiboList();
            });

            $rootScope.$on('WeiboList:refurbish', function(e, data) {
                if(data.data) {
                    $scope.weiboList.unshift(data.data);
                }
            });

            function autoScroll() {
                //下面这句主要是获取网页的总高度，主要是考虑兼容性所以把Ie支持的documentElement也写了，这个方法至少支持IE8
                var htmlHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
                //clientHeight是网页在浏览器中的可视高度，
                var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
                //scrollTop是浏览器滚动条的top位置，
                var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

                $scope.scrollTop = scrollTop;
                //通过判断滚动条的top位置与可视网页之和与整个网页的高度是否相等来决定是否加载内容；
                if ((scrollTop + clientHeight + 350) > htmlHeight && $scope.searchItems.currentPage < 3 && !($scope.page.status.wblist == 0)) {
                    $scope.searchItems.needCount = false;
                    $scope.searchItems.currentPage++;
                    $scope.page.status.wblist = 0;
                    weibo.getWbList($scope.searchItems).$promise.then(function(data) {
                        $scope.page.status.wblist = 1;
                        $scope.weiboList = $scope.weiboList.concat(data.data);
                        angular.extend($scope.searchItems, data.page);
                    });

                    $scope.$apply();
                }
            }

            $(window).bind('scroll', autoScroll);
        }
    ]);
});
define('home-ctrl/user-search', ['at_app', 'json!atmanlib-lib/CITY.json', 'atmanlib-lib/SYSTEM_ENUMERATE', 'filter/emojis', 'filter/at_link', 'directive/at_send_msg', 'directive/at_paging', 'directive/at_user_popover', 'filter/emojis', 'directive/weibo/weibo-expand-record', 'directive/at_user_popover', 'directive/search'], function(app, CITY) {
    app.lazy.controller('ctrl.home.user.search', ['$scope', '$rootScope', '$routeParams', '$location', 'WeiboSearchUser', 'FollowUser', 'DeleteFollow', '$ATConfirm', 'getAddrById',
        function($scope, $rootScope, $routeParams, $location, WeiboSearchUser, FollowUser, DeleteFollow, $modalConfirm, getAddrById) {
            //设置条件查询用户的内容
            $scope.userSerach = $routeParams.selectInfo;
            $scope.type = "2";
            //修改搜索内容时，重新查询用户
            /*$scope.$on('home.user.search',function(e,args){
             $scope.userSerach=args;
             init(1);
             });*/
            //查询
            $scope.seachInfo = {};

            getAddrById('511600').then(function(args) {
                // console.log(args);
            })
            getAddrById('110100').then(function(args) {
                // console.log(args);
            })

            function init(flag) {

                if ($scope.userSerach.length <= 1) {
                    return false;
                }
                //0.点击下一页,delete $scope.needCount;
                if (flag == 0) {
                    delete $scope.seachInfo.needCount;
                } else {
                    $scope.seachInfo.needCount = true;
                }
                $scope.seachInfo.name=$scope.userSerach;
                WeiboSearchUser.get($scope.seachInfo, function(data) {
                    angular.extend($scope.seachInfo, data.page);
                    angular.forEach(data.data, function(user, key) {
                        //locationIdToIdName(user);
                        //查询用户地址
                        getAddrById(user.cityId).then(function(args) {
                            if (angular.isObject(args)) {
                                user.provinceId = args['p'][0];
                                user.provinceName = args['p'][1];
                                user.cityId = args['c'][0];
                                user.cityName = args['c'][1];
                                user.areaId = args['a'][0];
                                user.areaName = args['a'][1];
                            }
                        })
                    })
                    $scope.userList = data.data;
                });
            }
            init(1);
            //关注
            $scope.userFollow = function(users) {
                FollowUser.send({
                    id: users.uid
                }, function(data) {
                    if (!data) {
                        $rootScope.notification("关注失败");
                    } else {
                        // $rootScope.notification("关注成功");
                        //用户的粉丝数加1
                        users.fansCount+=1;
                        $rootScope.WbUser.followCount+=1;
                        if (users.isFollowRelation == 2) {
                            users.isFollowRelation = 3;
                        } else if (users.isFollowRelation == 0) {
                            users.isFollowRelation = 1;
                        }
                    }
                });
            }
            var modalConfirm;
            //取消关注
            $scope.cancelFollow = function(users, $event) {
                if($event && $event.stopPropagation){
                    $event.stopPropagation();
                }
                else{
                    window.event.cancelBubble = true;
                }
                if(!modalConfirm){
                    var confirmOptions = {placement: "top"};
                    modalConfirm = $modalConfirm(angular.element($event.target), confirmOptions);
                    modalConfirm.$scope.content = "确定不再关注 " + users.nickName;
                    modalConfirm.$scope.dialogClass = "w-auto";
                    modalConfirm.$scope.okClick = function() {
                        DeleteFollow.send({
                            id: users.uid
                        }, function(data) {
                            if (!data) {
                                $rootScope.notification("取消关注失败" + users.nickName);
                            } else {
                                modalConfirm.destroy();
                                modalConfirm = null;
                                users.fansCount-=1;
                                $rootScope.WbUser.followCount-=1;
                                if (users.isFollowRelation == 1) {
                                    users.isFollowRelation = 0;
                                } else if (users.isFollowRelation == 3) {
                                    users.isFollowRelation = 2;
                                }
                                // $rootScope.notification("已取消关注 " + users.nickName);
                            }
                        });
                    }
                    modalConfirm.$scope.cancelClick = function() {
                        modalConfirm.destroy();
                        modalConfirm = null;
                    }
                }
            }
            //执行下一页/上一页查询
            $scope.$on('at.paging.currentPage', function(e, data) {
                $scope.seachInfo.currentPage = data.currentPage;
                init(0);
            });
        }
    ])
});
define('home-ctrl/weibo-search', ['at_app', 'json!atmanlib-lib/CITY.json', 'atmanlib-lib/SYSTEM_ENUMERATE',
    'filter/emojis', 'filter/at_link', 'directive/at_send_msg', 'directive/at_user_popover',
    'directive/at_user_popover', 'directive/search',
    'common-ctrl/weibo/at.weibo.input.ctrl', 'common-ctrl/weibo/at.ctrl.weibo.list',
    'common-ctrl/weibo/at.weibo.media.view.ctrl', 'common-ctrl/weibo/at.weibo.comment.input.ctrl',
    'common-ctrl/weibo/at.weibo.comment.list.ctrl', 'common-ctrl/weibo/at.weibo.forwards.ctrl',
    'directive/weibo/weibo-paging', 'directive/weibo/weibo-record', 'directive/at_paging'
], function(app) {
    app.lazy.controller('ctrl.home.weibo.search', ['$scope', '$rootScope', '$routeParams', '$location', 'SearchTopic',
        function($scope, $rootScope, $routeParams, $location, SearchTopic) {
            $scope.weiboSerach = $routeParams.selectInfo;
            //根据子页面的数据查询数据
            /*$scope.$on('home.weibo.search',function(e,args){
             $scope.weiboSerach=args;
             init(1);
             });*/
            //查询
            $scope.seachInfo = {};

            function init(flag) {
                if ($scope.weiboSerach.length <= 1) {
                    return false;
                }
                //0.点击下一页,delete $scope.needCount;
                if (flag == 0) {
                    delete $scope.seachInfo.needCount;
                } else {
                    $scope.seachInfo.needCount = true;
                }
                $scope.seachInfo.seachValue = $scope.weiboSerach;
                SearchTopic.get($scope.seachInfo, function(data) {
                    $scope.weiboSerachInfo=!0;
                    angular.extend($scope.seachInfo, data.page);
                    $scope.weiboList = data.data;
                });
            }
            init(1);
            $scope.weiboSerachInfo=!!0;
            //执行下一页/上一页查询
            $scope.$on("at.paging.currentPage", function(e, data) {
                angular.extend($scope.seachInfo, data);
                init(0);
                //$scope.changeType($scope.type, 0);
            });
        }
    ])
});