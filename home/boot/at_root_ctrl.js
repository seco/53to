/**
 * SignUpCtrl
 * @constructor
 */
define('at_root_ctrl', ['at_app', 'atmanlib-lib/ATCONFIG', 'service/oauth', 'service/at_url', 'service/at_service', 'common-ctrl/user/at.user.state.ctrl', 'common-ctrl/at.follow.now.info.ctrl', 'directive-common/global-search', "common-ctrl/user/at.sign.in.ctrl", "common-ctrl/user/at.user.info.ctrl", "filter/forbidden", 'directive-common/tiny-shop-car', 'directive-common/notice', "directive/float-widget",'directive-common/promo', "atmanlib-provider/prompt", 'directive-common/follow-user-index'], function(app, ATCONFIG) {

    app.lazy.controller('RootCtrl', ['$scope', '$cookies', '$element', '$route', '$timeout', '$window', '$document', '$location', '$rootScope', 'getTpl', 'at_route', 'OAuth', '$ATPrompt', 'getAddrById', "Notice", 'SmallShoppingCar','WeiboUser','GetStockBrief','BuyerAccountmyself',
        function($scope, $cookies, $element, $route, $timeout, $window, $document, $location, $rootScope, getTpl, at_route, OAuth, $ATPrompt, getAddrById, Notice, SmallShoppingCar,WeiboUser,GetStockBrief, BuyerAccountmyself) {
            $rootScope.setCookie = function(key, value, expireDay) {
                var exp = new Date();
                exp.setTime(exp.getTime() + expireDay * 24 * 60 * 60 * 1000);
                document.cookie = key + "=" + value + ";expires=" + exp.toGMTString();
            };

            $rootScope.title = '';
            $rootScope.message = '';
            $rootScope.rootEmit = !1;
            $rootScope.at_route = at_route;

            $rootScope.layout = {showUserInfo: false};
            $rootScope.ATConfig = ATCONFIG;

            $rootScope.prompt = function(options) {
                if(!$rootScope.promptDialog){
                    $rootScope.promptDialog = $ATPrompt();
                }
                $rootScope.promptDialog.$scope.content = options.msg;
                $rootScope.promptDialog.$scope.icon = options.icon;
                if(options.autoClose){
                    var timeOut = options.timeOut || 1500;
                    $timeout(function() {
                        $rootScope.promptDialog.destroy();
                        $rootScope.promptDialog = null;
                    }, timeOut);
                }
            };

            $rootScope.loadWbUser = function(nickname) {
                WeiboUser.get({nickname: nickname}).$promise.then(function(data){
                    $rootScope.WbUser = data;
                    $rootScope.WbUser.cityName = "";
                    if ($rootScope.WbUser.cityId) {
                        getAddrById($rootScope.WbUser.cityId).then(function(data) {
                            if (data.p && data.p.length > 1) {
                                $rootScope.WbUser.cityName += data.p[1];
                            }
                            if (data.c && data.c.length > 1) {
                                $rootScope.WbUser.cityName += data.c[1];
                            }
                            if (data.a && data.a.length > 1) {
                                $rootScope.WbUser.cityName += data.a[1];
                            }
                        });
                    }
                });
            };
            //$rootScope.loadWbUser();
            $rootScope.getStockBrief=function() {
                //BUG 查询还是原用户的股票首页
                GetStockBrief.get({
                    brief: 'brief'//,
                    //uuid: new Date().getTime()
                }, function(data) {
                    $scope.stockbrief = data;
                })
            }
            //$rootScope.getStockBrief();
            //BuyerAccountmyself.get().$promise.then(function(data) {$scope.buyerAccountInfo = data;});

            //OAuth.userInfo();
            $rootScope.homeLogout = function() {
                $rootScope.$emit('OAuth:login', 0);
                $rootScope.USER = {};
                $rootScope.userInfo = {};
                $scope.welcomeTitle = getTpl.common('welcome-title-unlogin.html');
                OAuth.logout().then(function(args, b, c) {
                    $rootScope.$emit('OAuth:login', 0);
                    $rootScope.USER = {};
                    $rootScope.userInfo = {};
                    $scope.welcomeTitle = getTpl.common('welcome-title-unlogin.html');
                }, function(error) {
                    $rootScope.$emit('OAuth:login', 0);
                    $rootScope.USER = {};
                    $rootScope.userInfo = {};
                    $scope.welcomeTitle = getTpl.common('welcome-title-unlogin.html');
                })
            }
            $rootScope.logout = function() {
                OAuth.logout().then(function() {
                    window.location.href = '/login/#login';
                });
            }

            //安全渲染
            $rootScope.safeApply = function(fn) {
                var phase = this.$root.$$phase;
                if (phase == '$apply' || phase == '$digest') {
                    if (fn && (typeof(fn) === 'function')) {
                        fn();
                    }
                } else {
                    this.$apply(fn);
                }
            };
            $scope.headerToggle = function(data) {
                $scope.topHeader = data;
            };
            //公用通知
            $rootScope.notification = function(msg, timeout) {
                /*if (UA.ie) {
                 */
                /*$rootScope.messageStyle = {
                 top: $($document).scrollTop()
                 };*/
                /*
                 }*/
                timeout = timeout || 1500;
                $rootScope.rootEmit = !0;
                $rootScope.message = msg;
                /*$timeout(function() {
                 $rootScope.messageStyle = {};
                 $rootScope.rootEmit = !1;
                 }, timeout);*/
                $timeout(function() {
                    $rootScope.message = '';
                    $rootScope.rootEmit = !1;
                }, timeout);
            };

            $scope.$on("$routeChangeSuccess", function(angularEvent, currentRoute, previousRoute) {
                console.log("--- $routeChangeSuccess ---");

                $rootScope.at_path = $location.path();
                $rootScope.modules_path = $route.current.originalPath;
                $rootScope.absUrl = $location.absUrl();
                if (previousRoute && previousRoute.scope) {
                    previousRoute.scope.$destroy();
                }
                if (!!currentRoute && !!currentRoute.originalPath) {
                    angular.forEach(['/activating-buyer', '/register'], function(data) {
                        if ($rootScope.at_path.indexOf(data) != -1) {
                            $rootScope.at_path = undefined;
                        }
                    })
                    $('.popover').removeClass('in'); //载入新页面时将上一个页面的popover隐藏
                    if (angular.isFunction($document.scrollTop)) {
                        $document.scrollTop(0); //回到顶部
                    }
                    if (ATCONFIG && angular.isDefined(ATCONFIG.NavMap[currentRoute.originalPath])) {
                        $rootScope.navPath = ATCONFIG.NavMap[currentRoute.originalPath][0];
                        $rootScope.navIndex = ATCONFIG.NavMap[currentRoute.originalPath][1];
                        $rootScope.activeNavIndex = $rootScope.navIndex;
                    }

                    $rootScope.title = currentRoute.title;

                    if ($rootScope.at_path.indexOf('/register') != -1 && $rootScope.isLogged) {
                        if ($location.$$absUrl().indexOf('index-seller.html') != -1) {
                            $location.path('/seller-center');
                        }
                        if ($location.$$absUrl().indexOf('index-admin.html') != -1) {
                            $location.path('/platform-center');
                        }
                        $location.path('/seller-center');
                    }
                    if ($rootScope.at_path.indexOf('/goods-detail') != -1) {
                        $rootScope.fullpage = !0;
                    } else {
                        $rootScope.fullpage = !1;
                    }
                }
            });

            $scope.navMouseOver = function(index) {
                $rootScope.activeNavIndex = index;
            };
            $scope.navMouseOut = function() {
                $rootScope.activeNavIndex = $rootScope.navIndex;
            };
        }
    ])

    // app.lazy.animation(".fade-fast", function() {
    //     return {
    //         enter: function(element, done) {
    //             element.fadeIn("fast");
    //         },
    //         leave: function(element, done) {
    //             element.fadeOut("fast");
    //         }
    //     }
    // });
});