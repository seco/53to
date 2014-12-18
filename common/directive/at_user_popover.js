/**
 * Created by Administrator on 14-5-26.
 */
define('directive/at_user_popover',["at_app", "atmanlib-provider/popover", "atmanlib-provider/confirm"], function (app) {
    app.lazy.directive("atUserPopover", ["$rootScope","$window", "$location", "$sce", "$timeout", "getTpl", "$ATPopover", "GetUserInfo", "FollowUser", "DeleteFollow", "getAddrById", "$ATConfirm", "$document",
        function($rootScope, $window, $location, $sce, $timeout, getTpl, $ATPopover, WeiboUser, FollowUser, DeleteFollow, getAddrById, $ATConfirm, $document) {
            var requestAnimationFrame = $window.requestAnimationFrame || $window.setTimeout;
            return {
                restrict: 'EACM',
                scope: true,
                link: function(scope, element, attr) {

                    var thisTimeOut;
                    // Directive options
                    var options = {
                        placement: "bottom-left",
                        trigger: "manual",
                        scope: scope,
                        show: true,
                        template: getTpl.common("user-popover.html")
                    };
                    angular.forEach(['template', 'contentTemplate', 'placement', 'container', 'delay', 'trigger', 'keyboard', 'html', 'animation'], function(key) {
                        if(angular.isDefined(attr[key])) options[key] = attr[key];
                    });

                    attr.atUserPopover && scope.$watch(attr.atUserPopover, function(newValue, oldValue) {
                        if(angular.isObject(newValue)) {
                            angular.extend(scope, newValue);
                            scope.sourceObj = newValue;
                        } else {
                            scope.nickName = newValue;
                        }
                        angular.isDefined(oldValue) && requestAnimationFrame(function() {
                            popover && popover.$applyPlacement();
                        });
                    }, true);

                    // Support scope as data-attrs
                    angular.forEach(['title', 'content'], function(key) {
                        attr[key] && attr.$observe(key, function(newValue, oldValue) {
                            scope[key] = $sce.trustAsHtml(newValue);
                            angular.isDefined(oldValue) && requestAnimationFrame(function() {
                                popover && popover.$applyPlacement();
                            });
                        });
                    });
                    var popover;
                    scope.isMouseover = false;
                    element.on("mouseover", function(){
                        scope.isMouseover = true;
                        if(!popover && scope.nickName){
                            thisTimeOut = $timeout(function(){
                                WeiboUser.get({id: scope.nickName}).$promise.then(function(data){
                                    if(data.$resolved && !data.resultStatusBean){
                                        scope.userData = data;
                                        data.cityId && getAddrById(data.cityId).then(function(data){
                                            scope.userCity = data.p[1] + " " + data.c[1] + " " + data.a[1];
                                        });
                                        // Initialize popover
                                        popover = $ATPopover(element, options);

                                        // Garbage collection
                                        scope.$on('$destroy', function() {
                                            popover.destroy();
                                            options = null;
                                            popover = null;
                                        });
                                    }
                                });
                            }, 500);
                        }
                        else if(popover){
                            $timeout(function(){
                                if(scope.isMouseover){
                                    if(scope.sourceObj){
                                        angular.extend(scope.userData, scope.sourceObj);
                                    }
                                    popover.show();
                                }
                            }, 500);
                        }
                    });
                    element.on("mouseout", function(){
                        scope.isMouseover = false;
                        $timeout.cancel(thisTimeOut);
                        hidePopover();
                    });

                    function hidePopover(){
                        $timeout(function(){
                            if(popover && !scope.isMouseover){
                                popover.hide();
                                if(scope.atConfirm){
                                    scope.atConfirm.destroy();
                                    scope.atConfirm = null;
                                }
                            }
                        }, 500);
                    }

                    scope.popMouseover = function(){
                        scope.isMouseover = true;
                    };

                    scope.popMouseout = function(){
                        scope.isMouseover = false;
                        hidePopover();
                    };

                    scope.follow = function(){
                        FollowUser.send({id: scope.userData.uid}).$promise.then(function(data){
                            if(data.$resolved && !data.resultStatusBean){
                                if(scope.userData.isFollowRelation == 0){
                                    scope.userData.isFollowRelation = 1;
                                }
                                else if(scope.userData.isFollowRelation == 2){
                                    scope.userData.isFollowRelation = 3;
                                }
                                scope.userData.fansCount +=1;
                                if($rootScope.WbUser && $rootScope.WbUser.nickName == $rootScope.USER.nickName) {
                                    $rootScope.WbUser.followCount +=1;
                                }
                                if($rootScope.WbUser && $rootScope.WbUser.nickName == scope.userData.nickName){
                                    $rootScope.WbUser.fansCount +=1;
                                }
                                if(scope.sourceObj){
                                    angular.extend(scope.sourceObj, scope.userData);
                                }
                                /*if($rootScope.WbUser) {
                                 }*/
                            }
                            else {
                                $rootScope.prompt({msg: data.resultStatusBean.message, autoClose: true, icon: "alert"});
                            }
                        });
                    };
                    scope.atConfirm = null;
                    $document.click(function($event){
                        if(scope.atConfirm){
                            scope.atConfirm.destroy();
                            scope.atConfirm = null;
                        }
                    });
                    scope.unFollow = function($event){
                        if($event && $event.stopPropagation){
                            $event.stopPropagation();
                        }
                        else{
                            window.event.cancelBubble = true;
                        }
                        if(!scope.atConfirm){
                            var options = {placement: "top"};
                            scope.atConfirm = $ATConfirm(angular.element($event.target), options);
                            scope.atConfirm.$scope.content = "确定不再关注 " + scope.userData.nickName;
                            scope.atConfirm.$scope.dialogClass = "w-auto";
                            scope.atConfirm.$scope.okClick = function(){
                                DeleteFollow.send({id: scope.userData.uid}).$promise.then(function(data){
                                    if(data.$resolved && !data.resultStatusBean){
                                        if(scope.userData.isFollowRelation == 1){
                                            scope.userData.isFollowRelation = 0;
                                        }
                                        else if(scope.userData.isFollowRelation == 3){
                                            scope.userData.isFollowRelation = 2;
                                        }
                                        if(scope.atConfirm){
                                            scope.atConfirm.destroy();
                                            scope.atConfirm = null;
                                        }
                                        scope.userData.fansCount -=1;
                                        if($rootScope.WbUser && $rootScope.WbUser.nickName == $rootScope.USER.nickName) {
                                            $rootScope.WbUser.followCount -=1;
                                        }
                                        if($rootScope.WbUser && $rootScope.WbUser.nickName == scope.userData.nickName){
                                            $rootScope.WbUser.fansCount -=1;
                                        }
                                        if(scope.sourceObj){
                                            angular.extend(scope.sourceObj, scope.userData);
                                        }
                                        /*if($rootScope.WbUser) {
                                         $rootScope.WbUser.fansCount -=1;
                                         }*/
                                        //$rootScope.notification("已取消关注 " + scope.userData.nickName);
                                    }
                                });
                            };
                            scope.atConfirm.$scope.cancelClick = function(){
                                if(scope.atConfirm){
                                    scope.atConfirm.destroy();
                                    scope.atConfirm = null;
                                }
                            }

                        }
                    }
                }
            };
        }
    ]);
});