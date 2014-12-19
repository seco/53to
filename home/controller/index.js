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
     app.lazy.controller('ctrl.home.index', ['$scope', '$rootScope', '$cookies', 'buyerPromoPromoed', 'buyerStockBrief', 'BuyerAccountmyself', 'Recommend', 'RecommendUser', '$ATModal', 'weibo', 'BuyerProfit', 'BannerItem',
         function($scope, $rootScope, $cookies, buyerPromoPromoed, buyerStockBrief, BuyerAccountmyself, Recommend, RecommendUser, $ATModal, weibo, BuyerProfit, BannerItem) {
             $('#pic-play').carousel({
                 interval: 5000
             }); //隔5秒自动播放
             $scope.newWeibo = false;
             //确定弹窗提示收益还是提示关注推荐用户
             if ($cookies.FSTLGN == 1) {
                 showRecUser();
             }
             else {
                 //showPromo();
             }
             $scope.bannerList = {
                 "slide": [{
                     "id": 1,
                     "imageUrl": "http://www.53to.com/asset/images/warmerMachine.jpg",
                     "linkUrl": "http://www.53to.com/item/#/406"
                 }, {
                     "id": 2,
                     "imageUrl": "http://www.53to.com/asset/images/whiteSpirits.jpg",
                     "linkUrl": "http://www.53to.com/item/#/567"
                 }, {
                     "id": 3,
                     "imageUrl": "http://www.53to.com/asset/images/hotPot.jpg",
                     "linkUrl": "http://www.53to.com/item/#/239"
                 }]
             };

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
             //getWeiboList(true);
             //执行下一页/上一页查询
             $scope.$on("at.paging.currentPage", function(e, data) {
                 angular.extend($scope.searchItems, data);
                 getWeiboList();
             });

             $rootScope.$on('WeiboList:refurbish', function(e, data) {
                 if (data.data) {
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
                 if ((scrollTop + clientHeight + 350) > htmlHeight && ($scope.searchItems.currentPage < 3 && $scope.searchItems.count > $scope.searchItems.currentPage * $scope.searchItems.pageSize) && !($scope.page.status.wblist == 0)) {
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