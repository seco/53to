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
                        if($event && $event.stopPropagation){$event.stopPropagation();}
                        else{window.event.cancelBubble = true;}
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

define('directive/float-widget',["at_app", 'atmanlib-provider/modal'], function (app) {
    app.lazy.directive("floatWidget", ["$rootScope","$window","$ATModal", function($rootScope, $window,$ATModal) {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: '/common/template/float-widget.html',
            link: function(scope, element, attr) {
                var returnTop = element.find(".return-top");
                scope.animating = false;
                angular.element($window).scroll(function() {
                    if(!scope.animating){
                        var st = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                        if(st > 100){
                            if(returnTop.is(":hidden")){returnTop.fadeIn();}
                        }else if(!returnTop.is(":hidden")){returnTop.fadeOut();}
                    }
                });
                scope.returnToTop = function(){
                    scope.animating = true;
                    $("html,body").animate({scrollTop: 0}, "fast", function(){
                        scope.animating = false;
                        returnTop.fadeOut();
                    });
                };
                var ATModal;
                //创建APP下载接口
                scope.appShow=function(){
                    ATModal = $ATModal({show: true, template: "/common/template/float-widget-app.html"});
                }
            }
        };
    }]);
});
define('directive/user/user-state',['at_app','service/oauth'], function(app) {
    app.lazy.directive('userState', ['OAuth','$rootScope',
        function(OAuth,$rootScope) {
            return {
                restrict: 'EA',
                templateUrl: '/common/template/user/user-state.html',
                link: function(scope, element, attrs) {
                    var vm = scope.vm = {};
                    scope.logout = function(){
                        OAuth.logout()
                    }
                }
            }
        }
    ]);
})
define('directive/at_validate',['at_app'],function(app) {
    app.lazy.service('REGEXP', [

        function() {
            var REGEXP = {};
            REGEXP.CURRENCY_RMB_ZERO = /^(([1-9]\d*)|0)(\.\d{1,2})?$/;
            REGEXP.CURRENCY_RMB = /^(([1-9]\d*)(\.\d{1,2})?)$|(0\.0?([1-9]\d?))$/;
            REGEXP.REPLACE_NOTCURRENCY = /[^0-9\.]/g;
            REGEXP.INVALID_NUMBER = /[^0-9]/g;
            REGEXP.INVALID_ZERO_NUMBER = /^[1-9]/;
            REGEXP.INT = /^\d+$/;
            REGEXP.MOBILE = /^0?(13[0-9]|15[0-9]|18[0-9]|147)[0-9]{8}$/;
            REGEXP.NUMBERORLETTER = /^[A-Za-z0-9]+$/;
            REGEXP.PHONENUMBER = /^[0-9-]+$/;
            REGEXP.EMAIL = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
            REGEXP.NUMBER = /^\d+$/;
            REGEXP.NICKNAME = /^[\u4e00-\u9fA5A-Za-z0-9\-_]{4,24}$/;
            REGEXP.REALNAME = /^[\u4e00-\u9fA5]{2,8}$/;
            REGEXP.POSITIVE_INTEGER = /^(([1-9]\d*)|0)$/;
            REGEXP.NOT_ZERO_POSITIVE_INTEGER = /^[1-9][0-9]*$/;
            REGEXP.TEL = /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
            REGEXP.FLOAT = /^\-?[0-9]+(\.\d{1,2})?$/;
            REGEXP.CODE = /^[0-9]+$/;
            //REGEXP.PASSWORD=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{6,16}$/;
            REGEXP.PASSWORD = /^\w{6,16}$/;
            REGEXP.INVITATIONCODE=/^[A-Za-z0-9]{20}$/;
            // var _set = function(key, value) {
            //     if (angular.isUndefined(key) || key === '' || key === null) {
            //         return null;
            //     }
            //     if (angular.isUndefined(value) || value === '' || value === null) {
            //         return null;
            //     } else {
            //         REGEXP[angular.uppercase(key)] = value;
            //         return REGEXP[angular.uppercase(key)];
            //     }

            // },
            //     _get = function(key) {
            //         return REGEXP[angular.uppercase(key)];
            //     },
            //     _all = function() {
            //         return REGEXP;
            //     },
            //     _length = function() {
            //         var count = 0;
            //         angular.forEach(REGEXP, function(value, key) {
            //             count = count + 1;
            //         });
            //         return count;
            //     };


            // _set('CURRENCY_RMB_ZERO', new RegExp("^(([1-9]\d*)|0)(\.\d{1,2})?$"));
            // _set('CURRENCY_RMB', new RegExp("^(([1-9]\d*)(\.\d{1,2})?)$|(0\.0?([1-9]\d?))$"));
            // _set('REPLACE_NOTCURRENCY', new RegExp("[^0-9\.]", "g"));
            // _set('INVALID_NUMBER', new RegExp("[^0-9]", "g"));


            // _set('CURRENCY_RMB_ZERO', /^(([1-9]\d*)|0)(\.\d{1,2})?$/);
            // _set('CURRENCY_RMB', /^(([1-9]\d*)(\.\d{1,2})?)$|(0\.0?([1-9]\d?))$/);
            // _set('REPLACE_NOTCURRENCY', /[^0-9\.]/g);
            // _set('INVALID_NUMBER', /[^0-9]/g);

            // return {
            //     set: _set,
            //     get: _get,
            //     all: _all,
            //     length: _length,
            //     REGEXP: REGEXP
            // }

            return REGEXP;
        }
    ])
    app.lazy.factory('validate', ['REGEXP',
        function(REGEXP) {
            var validate = {};
            validate.currency = function(str) {
                return REGEXP.CURRENCY_RMB.test(str);
            }
            validate.currencyZero = function(str) {
                return REGEXP.CURRENCY_RMB_ZERO.test(str);
            }
            validate.atSection = function(str, min, max) {
                if (str == null || str == undefined || str == '') {
                    return false;
                }
                min = min - 0;
                max = max - 0;
                str = str + '';
                if (str.length > min && str.length < max) {
                    return true;
                }
                if (isNaN(max) && str.length > min) {
                    return true;
                }
                if (isNaN(min) && str.length < max) {
                    return true;
                }
                return false;
            }

            validate.atPi = function(str) {
                return REGEXP.POSITIVE_INTEGER.test(str);
            }
            validate.atPiNotZero = function(str) {
                return REGEXP.NOT_ZERO_POSITIVE_INTEGER.test(str);
            }


            validate.atCode = function(str) {
                return REGEXP.CODE.test(str);
            }

            validate.replaceToCode = function(str) {
                if (angular.isUndefined(str) || str === '' || str === null) {
                    str = '';
                }
                return str.replace(REGEXP.INVALID_NUMBER, '');
            }

            validate.atPositiveInteger = function(str, min, max) {
                if (str == null || str == undefined || str == '' || !REGEXP.NUMBER.test(str)) {
                    return false;
                }
                min = min - 0;
                max = max - 0;
                str = parseInt(str);
                if (isNaN(max) && str >= min) {
                    return true;
                }
                if (isNaN(min) && str <= max) {
                    return true;
                }

                if (str >= min && str <= max) {
                    return true;
                }

                return false;

            }

            validate.atFloat = function(str) {
                return REGEXP.FLOAT.test(str);
            }
            validate.atFloatLimit = function(str, min, max) {
                if (str == null || str == undefined || str == '' || isNaN(str) || !angular.isNumber(str)) {
                    return true;
                }
                min = parseFloat(min);
                max = parseFloat(max);
                str = parseFloat(str);
                if (isNaN(max) && str >= min) {
                    return true;
                }
                if (isNaN(min) && str <= max) {
                    return true;
                }

                if (str >= min && str <= max) {
                    return true;
                }

                return false;

            }
            validate.isnil = function(value) {
                if (angular.isUndefined(value) || value === '' || value === null) {
                    return true;
                } else if (angular.isArray(value) && value.length < 1) {
                    return true;
                } else if (angular.isObject(value) && !value) {
                    return true;
                }
                return false;
            }
            validate.replaceToNotCurrency = function(str) {
                if (angular.isString(str)) {

                } else {
                    str = str + '';
                }
                return str.replace(REGEXP.REPLACE_NOTCURRENCY, '');
            }
            validate.replaceToNotCurrencyFixDecimal = function(str) {
                str = str + '';
                var valid = str.replace(REGEXP.REPLACE_NOTCURRENCY, '');
                var r = valid;
                if (valid.length < str.length - 1) {
                    r = '';
                } else {
                    var ss = valid.split('.');
                    if (ss.length > 1) {
                        r = ss[0] + '.' + ss[1].substr(0, 2);
                    }
                }
                return r;
            }
            validate.atInvalidZeroNumber = function(str) {
                return REGEXP.INVALID_ZERO_NUMBER.exec(str) != null;
            }
            validate.atMinMax = function(str, min, max) {
                str = parseInt(str);
                min = parseInt(min);
                max = parseInt(max);
                if (isNaN(max) && str > min) {
                    return true;
                }
                if (isNaN(min) && str < max) {
                    return true;
                }

                if (str > min && str < max) {
                    return true;
                }
                return false;
            }
            validate.replaceToNotZeroNumber = function(str) {
                if (!angular.isString(str)) {
                    return str;
                }
                return str.replace(REGEXP.INVALID_NUMBER, '');
            }

            validate.replaceToNotNumber = function(str) {
                return typeof str == 'number' ? str : parseInt(str.replace(REGEXP.INVALID_NUMBER, ''));
            }
            validate.atZero = function(str) {
                if (str == 0 || str == null || str == undefined || str == '' || isNaN(str)) {
                    return true;
                }
                return false;
            }
            validate.replaceToPositiveIntegers = function(str) {
                if (str == 0 || str == null || str == undefined || str == '' || isNaN(str)) {
                    return 1;
                }
                return str.replace(REGEXP.INVALID_NUMBER, '');
            }
            validate.atInt = function(str) {
                return REGEXP.INT.test(str);
            }
            validate.atNumberOrLetter = function(str) {
                return REGEXP.NUMBERORLETTER.test(str);
            }
            validate.atIntExceptZero = function(str) {
                return REGEXP.INT.test(str) && (str != 0);
            }
            validate.currencyMinMax = function(str, min, max) {
                return REGEXP.CURRENCY_RMB_ZERO.test(parseFloat(str)) && parseFloat(str) >= min && parseFloat(str) <= max;
            }
            validate.atMobile = function(str) {
                return REGEXP.MOBILE.test(str);
            }
            validate.atPhone = function(str) {
                return REGEXP.PHONENUMBER.test(str);
            }
            validate.atEmail = function(str) {
                return REGEXP.EMAIL.test(str);
            }
            validate.atNickName = function(str) {
                return REGEXP.NICKNAME.test(str);
            }
            validate.atRealName = function(str) {
                return REGEXP.REALNAME.test(str);
            }
            validate.atNumber = function(str) {
                return REGEXP.NUMBER.test(str);
            }
            validate.atZip = function(str) {
                return (validate.atInt(str) && str.length == 6) ? !0 : !1;
            }
            validate.atTel = function(str) {
                return REGEXP.TEL.test(str);
            }
            validate.atPassword = function(str) {
                return REGEXP.PASSWORD.test(str);
            }
            validate.atInvitationcode = function(str) {
                return REGEXP.INVITATIONCODE.test(str);
            }
            validate.isTrue = function(str) {
                if (str == 0 || str == null || str == undefined || str == '' || str == 'false' || str == 'FALSE' || str == '0') {
                    return false;
                }
                return true;
            }
            return validate;
        }
    ])
    app.lazy.directive('atSection', ['validate', '$rootScope', '$parse',
        function($$validate, $rootScope, $parse) {
            return {
                require: '?ngModel',
                link: function(scope, elm, attr, ctrl) {
                    if (!ctrl) {
                        return;
                    }

                    function validator() {
                        if ($$validate.atSection(ctrl.$viewValue, attr.atMin, attr.atMax)) {
                            ctrl.$setValidity('atSection', true);
                            return $$validate.isnil(ctrl.$viewValue) ? '' : ctrl.$viewValue;
                        } else {
                            ctrl.$setValidity('atSection', false);
                            return undefined;
                        }

                    };
                    ctrl.at_validator = []; //自己创建的验证list

                    if ($$validate.isTrue(attr.atSection)) {
                        ctrl.at_validator.push(validator);
                        elm.on('blur', function(e) {
                            $rootScope.safeApply(validator);
                        });
                    }
                }
            };
        }
    ])
    app.lazy.directive('atCurrency', ['validate', '$rootScope', '$parse',
        function($$validate, $rootScope, $parse) {
            return {
                require: '?ngModel',
                link: function(scope, elm, attr, ctrl) {
                    if (!ctrl) {
                        return;
                    }

                    function validator() {
                        if ($$validate.currency(ctrl.$viewValue)) {
                            ctrl.$setValidity('atCurrency', true);
                            return $$validate.isnil(ctrl.$viewValue) ? '' : ctrl.$viewValue;
                        } else {
                            ctrl.$setValidity('atCurrency', false);
                            return undefined;
                        }
                    };
                    ctrl.at_validator = []; //自己创建的验证list

                    if ($$validate.isTrue(attr.atCurrency)) {
                        ctrl.at_validator.push(validator);
                        elm.on('blur', function(e) {
                            $rootScope.safeApply(validator);
                        });
                    }
                }
            };
        }
    ])
    app.lazy.directive('atCurrencyZero', ['validate', '$rootScope', '$parse',
        function($$validate, $rootScope, $parse) {
            return {
                require: '?ngModel',
                link: function(scope, elm, attr, ctrl) {
                    if (!ctrl) {
                        return;
                    }

                    function validator() {
                        if ($$validate.currencyZero(ctrl.$viewValue)) {
                            ctrl.$setValidity('atCurrencyZero', true);
                            return $$validate.isnil(ctrl.$viewValue) ? '' : ctrl.$viewValue;
                        } else {
                            ctrl.$setValidity('atCurrencyZero', false);
                            return 0;
                        }
                    };

                    function ViewValue() {
                        ctrl.$setViewValue(validator());
                        ctrl.$render();
                    }

                    ctrl.at_validator = []; //自己创建的验证list

                    if ($$validate.isTrue(attr.atCurrencyZero)) {
                        ctrl.at_validator.push(ViewValue);
                        elm.on('blur', function(e) {
                            $rootScope.safeApply(ViewValue);
                        });
                    }
                }
            };
        }
    ])
    app.lazy.directive('atCurrencyVertify', ['validate', '$rootScope', '$parse',
        function($$validate, $rootScope, $parse) {
            return {
                require: '?ngModel',
                link: function(scope, elm, attr, ctrl) {
                    if (!ctrl) {
                        return;
                    }

                    function validator() {
                        if ($$validate.currencyZero(ctrl.$viewValue)) {
                            var f_x = Math.round(ctrl.$viewValue * 100) / 100;
                            ctrl.$setValidity('atCurrencyVertify', true);
                            var s_x = f_x.toString();
                            var pos_decimal = s_x.indexOf('.');
                            if (pos_decimal < 0) {
                                pos_decimal = s_x.length;
                                s_x += '.';
                            }
                            while (s_x.length <= pos_decimal + 2) {
                                s_x += '0';
                            }
                            return $$validate.isnil(ctrl.$viewValue) ? '' : s_x;
                        } else {
                            ctrl.$setValidity('atCurrencyVertify', false);
                            return '0.00';
                        }
                    };

                    function ViewValue() {
                        ctrl.$setViewValue(validator());
                        ctrl.$render();
                    }

                    ctrl.at_validator = []; //自己创建的验证list

                    if ($$validate.isTrue(attr.atCurrencyVertify)) {
                        ctrl.at_validator.push(ViewValue);
                        elm.on('blur', function(e) {
                            $rootScope.safeApply(ViewValue);
                        });
                    }
                }
            };
        }
    ])
    // app.lazy.directive('atMoney', ['validate', '$rootScope', '$parse',
    //     function($$validate, $rootScope, $parse) {
    //         return {
    //             require: '?ngModel',
    //             link: function(scope, elm, attr, ctrl) {
    //                 if (!ctrl) {
    //                     return;
    //                 }
    //                 // scope.$watch($parse(attr.atCash), function(args) {
    //                 // console.log(attr.atCash, 'attr.atCash',args);
    //                 //     var dd = $parse(attr.atCash);
    //                 //     console.log(dd,'(attr.atCash1111111111111',args);
    //                 // })
    //                 function validator() {
    //                     if (ctrl.$viewValue > scope.moneyValue) {
    //                         ctrl.$setValidity('atMoney', false);
    //                         return 0;
    //                     } else {
    //                         ctrl.$setValidity('atMoney', true);
    //                         return $$validate.isnil(ctrl.$viewValue) ? '' : ctrl.$viewValue;
    //                     }
    //                 };

    //                 function ViewValue() {
    //                     ctrl.$setViewValue(validator());
    //                     ctrl.$render();
    //                 }
    //                 ctrl.at_validator = [];
    //                 if ($$validate.isTrue(attr.atMoney)) {
    //                     ctrl.at_validator.push(ViewValue());
    //                     elm.on('blur', function(e) {
    //                         $rootScope.safeApply(ViewValue);
    //                     });
    //                 }
    //             }
    //         };
    //     }
    // ])
    app.lazy.directive('atNil', ['validate', '$rootScope', '$parse',
        function($$validate, $rootScope, $parse) {
            return {
                require: '?ngModel',
                link: function(scope, elm, attr, ctrl) {
                    if (!ctrl) {
                        return;
                    }
                    // $setValidity [true=通过,false=未通过]
                    function validator() {
                        if (attr.atInvalid === "true") {
                            return;
                        }
                        if ($$validate.isnil(ctrl.$viewValue)) {
                            ctrl.$setValidity('atNil', false);
                            return undefined;
                        } else {
                            ctrl.$setValidity('atNil', true);
                            return $$validate.isnil(ctrl.$viewValue) ? '' : ctrl.$viewValue;
                        }
                    };
                    ctrl.at_validator = []; //自己创建的验证list

                    if ($$validate.isTrue(attr.atNil)) {
                        ctrl.at_validator.push(validator);
                        elm.on('blur', function(e) {
                            $rootScope.safeApply(validator);
                        });

                    }
                }
            };
        }
    ])
    app.lazy.directive('atPiNotZero', ['validate', '$rootScope', '$parse',
        function($$validate, $rootScope, $parse) {
            return {
                require: '?ngModel',
                link: function(scope, elm, attr, ctrl) {
                    if (!ctrl) {
                        return;
                    }

                    var validator = function(news, olds) {
                        if ($$validate.atPiNotZero(news)) {
                            ctrl.$setValidity('atPiNotZero', true);
                            if ($$validate.isnil(news)) {
                                return olds;
                            } else {
                                return news;
                            }
                        } else {
                            ctrl.$setValidity('atPiNotZero', false);
                            return olds;
                        }

                    };

                    function ViewValue() {
                        ctrl.$setViewValue(validator(ctrl.$viewValue, 0));
                        ctrl.$render();
                    }
                    ctrl.at_validator = []; //自己创建的验证list

                    if ($$validate.isTrue(attr.atPiNotZero)) {
                        ctrl.at_validator.push(ViewValue);
                        elm.on('blur', function(e) {
                            $rootScope.safeApply(ViewValue);
                        });

                    }

                }
            };
        }
    ])
    app.lazy.directive('atPi', ['validate', '$rootScope', '$parse',
        function($$validate, $rootScope, $parse) {
            return {
                require: '?ngModel',
                link: function(scope, elm, attr, ctrl) {
                    if (!ctrl) {
                        return;
                    }

                    var validator = function(news, olds) {
                        if ($$validate.atPi(news)) {
                            ctrl.$setValidity('atPi', true);
                            if ($$validate.isnil(news)) {
                                return olds;
                            } else {
                                return news;
                            }
                        } else {
                            ctrl.$setValidity('atPi', false);
                            return olds;
                        }

                    };

                    function ViewValue() {
                        ctrl.$setViewValue(validator(ctrl.$viewValue, 0));
                        ctrl.$render();
                    }
                    ctrl.at_validator = []; //自己创建的验证list

                    if ($$validate.isTrue(attr.atPi)) {
                        ctrl.at_validator.push(ViewValue);
                        elm.on('blur', function(e) {
                            $rootScope.safeApply(ViewValue);
                        });

                    }


                }
            };
        }
    ])
    app.lazy.directive('atPiToNil', ['validate', '$rootScope', '$parse',
        function($$validate, $rootScope, $parse) {
            return {
                require: '?ngModel',
                link: function(scope, elm, attr, ctrl) {
                    if (!ctrl) {
                        return;
                    }

                    var validator = function(news, olds) {
                        if ($$validate.atPi(news)) {
                            ctrl.$setValidity('atPiToNil', true);
                            if ($$validate.isnil(news)) {
                                return olds;
                            } else {
                                return news;
                            }
                        } else {
                            ctrl.$setValidity('atPiToNil', false);
                            return olds;
                        }

                    };

                    function ViewValue() {
                        ctrl.$setViewValue(validator(ctrl.$viewValue, ''));
                        ctrl.$render();
                    }
                    ctrl.at_validator = []; //自己创建的验证list

                    if ($$validate.isTrue(attr.atPiToNil)) {
                        ctrl.at_validator.push(ViewValue);
                        elm.on('blur', function(e) {
                            $rootScope.safeApply(ViewValue);
                        });

                    }
                }
            };
        }
    ])
    app.lazy.directive('atPiToZero', ['validate', '$rootScope', '$parse',
        function($$validate, $rootScope, $parse) {
            return {
                require: '?ngModel',
                link: function(scope, elm, attr, ctrl) {
                    if (!ctrl) {
                        return;
                    }

                    var validator = function(news, olds) {
                        if ($$validate.atPi(news)) {
                            ctrl.$setValidity('atPiToZero', true);
                            if ($$validate.isnil(news)) {
                                return olds;
                            } else {
                                return news;
                            }
                        } else {
                            ctrl.$setValidity('atPiToZero', false);
                            return olds;
                        }

                    };

                    function ViewValue() {
                        ctrl.$setViewValue(validator(ctrl.$viewValue, 0));
                        ctrl.$render();
                    }
                    ctrl.at_validator = []; //自己创建的验证list

                    if ($$validate.isTrue(attr.atPiToZero)) {
                        ctrl.at_validator.push(ViewValue);
                        elm.on('blur', function(e) {
                            $rootScope.safeApply(ViewValue);
                        });

                    }
                }
            };
        }
    ])
    app.lazy.directive('atPositiveInteger', ['validate', '$rootScope', '$parse',
        function($$validate, $rootScope, $parse) {
            return {
                require: '?ngModel',
                link: function(scope, elm, attr, ctrl) {
                    if (!ctrl) {
                        return;
                    }

                    var validator = function(news, olds) {
                        if (attr.atInvalid === "true") {
                            return;
                        }
                        if ($$validate.atPositiveInteger(news, attr.atMin, attr.atMax)) {
                            ctrl.$setValidity('atPositiveInteger', true);
                            if ($$validate.isnil(news)) {
                                return olds;
                            } else {
                                return news;
                            }
                            // return $$validate.isnil(news) ? olds : news;
                        } else {
                            ctrl.$setValidity('atPositiveInteger', false);
                            return olds;
                        }

                    };

                    function ViewValue() {
                        ctrl.$setViewValue(validator(ctrl.$viewValue, 1));
                        ctrl.$render();
                    }
                    ctrl.at_validator = []; //自己创建的验证list

                    if ($$validate.isTrue(attr.atPositiveInteger)) {
                        ctrl.at_validator.push(ViewValue);
                        elm.on('blur', function(e) {
                            $rootScope.safeApply(ViewValue);
                        });

                    }
                }
            };
        }
    ])
    app.lazy.directive('atFloat', ['validate', '$rootScope', '$parse',
        function($$validate, $rootScope, $parse) {
            return {
                require: '?ngModel',
                link: function(scope, elm, attr, ctrl) {
                    if (!ctrl) {
                        return;
                    }


                    function validator(news, olds) {
                        if ($$validate.atFloat(news)) {
                            ctrl.$setValidity('atFloat', true);
                            if ($$validate.isnil(news)) {
                                return olds;
                            } else {
                                return news;
                            }
                        } else {
                            ctrl.$setValidity('atFloat', false);
                            return olds;
                        }

                    };

                    function ViewValue() {
                        ctrl.$setViewValue(validator(ctrl.$viewValue, 0));
                        ctrl.$render();
                    }
                    ctrl.at_validator = []; //自己创建的验证list

                    if ($$validate.isTrue(attr.atFloat)) {
                        ctrl.at_validator.push(ViewValue);
                        elm.on('blur', function(e) {
                            $rootScope.safeApply(ViewValue);
                        });

                    }
                }
            };
        }
    ])
    app.lazy.directive('atFloatLimit', ['validate', '$rootScope', '$parse',
        function($$validate, $rootScope, $parse) {
            return {
                require: '?ngModel',
                link: function(scope, elm, attr, ctrl) {
                    if (!ctrl) {
                        return;
                    }


                    function validator(news, olds) {
                        if ($$validate.atFloatLimit(ctrl.$viewValue, attr.atFloatMin, attr.atFloatMax)) {
                            ctrl.$setValidity('atFloatLimit', true);
                            if ($$validate.isnil(news)) {
                                return olds;
                            } else {
                                return news;
                            }
                        } else {
                            ctrl.$setValidity('atFloatLimit', false);
                            return olds;
                        }

                    };

                    function ViewValue() {
                        ctrl.$setViewValue(validator(ctrl.$viewValue, 0));
                        ctrl.$render();
                    }
                    ctrl.at_validator = []; //自己创建的验证list

                    if ($$validate.isTrue(attr.atFloatLimit)) {
                        ctrl.at_validator.push(ViewValue);
                        elm.on('blur', function(e) {
                            $rootScope.safeApply(ViewValue);
                        });

                    }
                }
            };
        }
    ])
    app.lazy.directive('atZero', ['validate', '$rootScope', '$parse',
        function($$validate, $rootScope, $parse) {
            return {
                require: '?ngModel',
                link: function(scope, elm, attr, ctrl) {
                    if (!ctrl) {
                        return;
                    }

                    function validator() {
                        if (!$$validate.atZero(ctrl.$viewValue)) {
                            ctrl.$setValidity('atZero', true);
                            return $$validate.isnil(ctrl.$viewValue) ? undefined : ctrl.$viewValue;
                        } else {
                            ctrl.$setValidity('atZero', false);
                            return undefined;
                        }

                    };
                    ctrl.at_validator = []; //自己创建的验证list


                    if ($$validate.isTrue(attr.atZero)) {
                        ctrl.at_validator.push(validator);
                        elm.on('blur', function(e) {
                            $rootScope.safeApply(validator);
                        });

                    }
                }
            };
        }
    ])
    app.lazy.directive('atNumber', ['validate', '$rootScope', '$parse',
        function($$validate, $rootScope, $parse) {
            return {
                require: '?ngModel',
                link: function(scope, elm, attr, ctrl) {
                    if (!ctrl) {
                        return;
                    }

                    function validator() {
                        if ($$validate.atNumber(ctrl.$viewValue)) {
                            ctrl.$setValidity('atNumber', true);
                            if (!$$validate.atMinMax(ctrl.$viewValue, attr.atMin, attr.atMax)) {
                                ctrl.$setValidity('atMinMax', true);
                                //return $$validate.isnil(ctrl.$viewValue) ? undefined : ctrl.$viewValue;
                            } else {
                                ctrl.$setValidity('atMinMax', false);
                                //return undefined;
                            }
                        } else {
                            ctrl.$setValidity('atMinMax', true);
                            ctrl.$setValidity('atNumber', false);
                            //return undefined;
                        }


                    };
                    ctrl.at_validator = []; //自己创建的验证list



                    if ($$validate.isTrue(attr.atNumber)) {
                        ctrl.at_validator.push(validator);
                        elm.on('blur', function(e) {
                            $rootScope.safeApply(validator);
                        });

                    }
                }
            };
        }
    ])
    app.lazy.directive('atZip', ['validate', '$rootScope', '$parse',
        function($$validate, $rootScope, $parse) {
            return {
                require: '?ngModel',
                link: function(scope, elm, attr, ctrl) {
                    if (!ctrl) {
                        return;
                    }

                    function validator() {
                        if ($$validate.atZip(ctrl.$viewValue)) {
                            ctrl.$setValidity('atZip', true);
                        } else {
                            ctrl.$setValidity('atZip', false);
                        }

                    };
                    ctrl.at_validator = []; //自己创建的验证list

                    if ($$validate.isTrue(attr.atZip)) {
                        ctrl.at_validator.push(validator);
                        elm.on('blur', function(e) {
                            $rootScope.safeApply(validator);
                        });

                    }
                }
            };
        }
    ])
    app.lazy.directive('atPhone', ['validate', '$rootScope', '$parse',
        function($$validate, $rootScope, $parse) {
            return {
                require: '?ngModel',
                link: function(scope, elm, attr, ctrl) {
                    if (!ctrl) {
                        return;
                    }

                    function validator() {
                        if ($$validate.atPhone(ctrl.$viewValue)) {
                            ctrl.$setValidity('atPhone', true);
                        } else {
                            ctrl.$setValidity('atPhone', false);
                        }

                    };
                    ctrl.at_validator = []; //自己创建的验证list

                    if ($$validate.isTrue(attr.atPhone)) {
                        ctrl.at_validator.push(validator);
                        elm.on('blur', function(e) {
                            $rootScope.safeApply(validator);
                        });

                    }
                }
            };
        }
    ])

    app.lazy.directive('atMobile', ['validate', '$rootScope', '$parse',
        function($$validate, $rootScope, $parse) {
            return {
                require: '?ngModel',
                link: function(scope, elm, attr, ctrl) {
                    if (!ctrl) {
                        return;
                    }

                    function validator() {
                        if ($$validate.atMobile(ctrl.$viewValue)) {
                            ctrl.$setValidity('atMobile', true);
                        } else {
                            ctrl.$setValidity('atMobile', false);
                        }

                    };
                    ctrl.at_validator = []; //自己创建的验证list

                    if ($$validate.isTrue(attr.atMobile)) {
                        ctrl.at_validator.push(validator);
                        elm.on('blur', function(e) {
                            $rootScope.safeApply(validator);
                        });

                    }
                }
            };
        }
    ])
    app.lazy.directive('atInvitationcode', ['validate', '$rootScope', '$parse',
        function($$validate, $rootScope, $parse) {
            return {
                require: '?ngModel',
                link: function(scope, elm, attr, ctrl) {
                    if (!ctrl) {
                        return;
                    }

                    function validator() {
                        if ($$validate.atInvitationcode(ctrl.$viewValue)) {
                            ctrl.$setValidity('atInvitationcode', true);
                        } else {
                            ctrl.$setValidity('atInvitationcode', false);
                        }

                    };
                    ctrl.at_validator = []; //自己创建的验证list

                    if ($$validate.isTrue(attr.atInvitationcode)) {
                        ctrl.at_validator.push(validator);
                        elm.on('blur', function(e) {
                            $rootScope.safeApply(validator);
                        });

                    }
                }
            };
        }
    ])
    app.lazy.directive('atTel', ['validate', '$rootScope', '$parse',
        function($$validate, $rootScope, $parse) {
            return {
                require: '?ngModel',
                link: function(scope, elm, attr, ctrl) {
                    if (!ctrl) {
                        return;
                    }

                    function validator() {
                        if ($$validate.atTel(ctrl.$viewValue)) {
                            ctrl.$setValidity('atTel', true);
                        } else {
                            ctrl.$setValidity('atTel', false);
                        }
                    };

                    ctrl.at_validator = []; //自己创建的验证list


                    if ($$validate.isTrue(attr.atTel)) {
                        ctrl.at_validator.push(validator);
                        elm.on('blur', function(e) {
                            $rootScope.safeApply(validator);
                        });

                    }
                }
            };
        }
    ])



    app.lazy.directive('atNickName', ['validate', '$rootScope', '$parse',
        function($$validate, $rootScope, $parse) {
            return {
                require: '?ngModel',
                link: function(scope, elm, attr, ctrl) {
                    if (!ctrl) {
                        return;
                    }

                    function validator() {
                        if ($$validate.isnil(ctrl.$viewValue)) {
                            ctrl.$setValidity('atNil', false);
                            ctrl.$setValidity('atNickName', true);
                        } else {
                            if ($$validate.atNickName(ctrl.$viewValue)) {
                                ctrl.$setValidity('atNickName', true);
                            } else {
                                ctrl.$setValidity('atNickName', false);
                            }
                            ctrl.$setValidity('atNil', true);
                        }
                    };

                    ctrl.at_validator = []; //自己创建的验证list


                    if ($$validate.isTrue(attr.atNickName)) {
                        ctrl.at_validator.push(validator);
                        elm.on('blur', function(e) {
                            $rootScope.safeApply(validator);
                        });

                    }
                }
            };
        }
    ])
    app.lazy.directive('atRealName', ['validate', '$rootScope', '$parse',
        function($$validate, $rootScope, $parse) {
            return {
                require: '?ngModel',
                link: function(scope, elm, attr, ctrl) {
                    if (!ctrl) {
                        return;
                    }

                    function validator() {
                        if ($$validate.isnil(ctrl.$viewValue)) {
                            ctrl.$setValidity('atRealName', false);
                        } else {
                            if ($$validate.atRealName(ctrl.$viewValue)) {
                                ctrl.$setValidity('atRealName', true);
                            } else {
                                ctrl.$setValidity('atRealName', false);
                            }
                        }
                    };

                    ctrl.at_validator = []; //自己创建的验证list


                    if ($$validate.isTrue(attr.atRealName)) {
                        ctrl.at_validator.push(validator);
                        elm.on('blur', function(e) {
                            $rootScope.safeApply(validator);
                        });

                    }
                }
            };
        }
    ])
    app.lazy.directive('atPassword', ['validate', '$rootScope', '$parse',
        function($$validate, $rootScope, $parse) {
            return {
                require: '?ngModel',
                link: function(scope, elm, attr, ctrl) {
                    if (!ctrl) {
                        return;
                    }

                    function validator() {
                        if ($$validate.atPassword(ctrl.$viewValue)) {
                            ctrl.$setValidity('atPassword', true);
                        } else {
                            ctrl.$setValidity('atPassword', false);
                        }
                    };

                    ctrl.at_validator = []; //自己创建的验证list


                    if ($$validate.isTrue(attr.atPassword)) {
                        ctrl.at_validator.push(validator);
                        elm.on('blur', function(e) {
                            $rootScope.safeApply(validator);
                        });

                    }
                }
            };
        }
    ])

    app.lazy.directive('atEmail', ['validate', '$rootScope', '$parse',
        function($$validate, $rootScope, $parse) {
            return {
                require: '?ngModel',
                link: function(scope, elm, attr, ctrl) {
                    if (!ctrl) {
                        return;
                    }
                    // $setValidity [true=通过,false=未通过]
                    function validator() {
                        if ($$validate.atEmail(ctrl.$viewValue)) {
                            ctrl.$setValidity('atEmail', true);
                            return $$validate.isnil(ctrl.$viewValue) ? '' : ctrl.$viewValue;
                        } else {
                            ctrl.$setValidity('atEmail', false);
                            return undefined;
                        }
                    };
                    ctrl.at_validator = []; //自己创建的验证list


                    if ($$validate.isTrue(attr.atEmail)) {
                        ctrl.at_validator.push(validator);
                        elm.on('blur', function(e) {
                            $rootScope.safeApply(validator);
                        });

                    }
                }
            };
        }
    ])
    app.lazy.directive('atCode', ['validate', '$rootScope', '$parse',
        function($$validate, $rootScope, $parse) {
            return {
                require: '?ngModel',
                link: function(scope, elm, attr, ctrl) {
                    if (!ctrl) {
                        return;
                    }

                    var validator = function(news, olds) {
                        if ($$validate.atCode(news)) {
                            ctrl.$setValidity('atCode', true);
                            if ($$validate.isnil(news)) {
                                return olds;
                            } else {
                                return news;
                            }
                        } else {
                            ctrl.$setValidity('atCode', false);
                            return olds;
                        }

                    };

                    function ViewValue() {
                        ctrl.$setViewValue(validator(ctrl.$viewValue, ''));
                        ctrl.$render();
                    }
                    ctrl.at_validator = []; //自己创建的验证list

                    if ($$validate.isTrue(attr.atCode)) {
                        ctrl.at_validator.push(ViewValue);
                        elm.on('blur', function(e) {
                            $rootScope.safeApply(ViewValue);
                        });

                    }
                }
            };
        }
    ])
});
define('directive/at_paging',['at_app'], function(app) {
    app.lazy
        .directive('atPaging', ['$rootScope', 'getTpl',
            function($rootScope, getTpl) {
                return {
                    restrict: 'EAC',
                    templateUrl: getTpl.common('paging.html'),
                    scope: {
                        current: '=',
                        size: '=',
                        total: '='
                    },
                    link: function(scope, iElement, iAttrs) {
                        scope.one = {};

                        scope.$watch('size', function(news, olds) {
                            if (!angular.isUndefined(news)) {
                                scope.sizePage = news || 20;
                            }
                        })
                        scope.$watch('total', function(news, olds) {
                            if (!angular.isUndefined(news)) {
                                scope.total = news || 0;
                            }
                        })
                        scope.$watch('current', function(news, olds) {
                            if (!angular.isUndefined(news)) {
                                scope.currentPage = news || 1;
                                refresh();
                            }
                        })

                        var pg = 1,
                            list = [];

                        function refresh() {

                            //计算总页数
                            if (angular.isNumber(scope.total) && angular.isNumber(scope.sizePage)) {
                                pg = Math.ceil(scope.total / scope.sizePage) || 1; //向上去整
                            }
                            scope.totalPage = pg;
                            //当前页码>总页码时
                            if (scope.currentPage > pg) {
                                scope.currentPage = pg - 1; //跳转上一页
                            }

                            //第[]页.赋值为当前页码
                            scope.one.jump = scope.currentPage;

                            createPageList(); //初始化
                        }

                        //创建分页标签
                        function createPageList() {
                            list = [];
                            if (scope.totalPage <= 8) {
                                for (var i = 1; i <= scope.totalPage; i++) {
                                    list.push(i);
                                }
                            } else {
                                if (scope.currentPage <= 5) {
                                    for (var i = 1; i <= 7; i++) {
                                        list.push(i);
                                    }
                                    list.push('...');
                                } else {
                                    list.push(1);
                                    list.push(2);
                                    list.push('...');
                                    var begin = scope.currentPage - 2;
                                    var end = scope.currentPage + 2;
                                    if (end > scope.totalPage) {
                                        end = scope.totalPage;
                                        begin = end - 4;
                                        if (scope.currentPage - begin < 2) {
                                            begin = begin - 1;
                                        }
                                    } else if (end + 1 == scope.totalPage) {
                                        end = scope.totalPage;
                                    }
                                    for (var i = begin; i <= end; i++) {
                                        list.push(i);
                                    }
                                    if (end != scope.totalPage) {
                                        list.push('...');
                                    }
                                }
                            }

                            scope.paging = list;
                        }

                        //刷新页面公共方法
                        function RefreshPage(args) {
                            scope.currentPage = args - 0;
                            var page = {};
                            page.currentPage = args - 0;
                            page.needCount = undefined;
                            scope.$emit('at.paging.currentPage', page); //推送页码
                            // scope.page.currentPage = args;
                            //分页样式控制
                            if (scope.currentPage < pg - 2) {
                                createPageList();
                            }
                        }
                        //上一页
                        scope.lastPage = function(args) {
                            if (args < 1) {

                            } else {
                                RefreshPage(args);
                            }
                        }
                        //选择页码
                        scope.selectPage = function(args) {
                            RefreshPage(args);
                        }
                        //下一页
                        scope.nextPage = function(args) {
                            if (args > pg) {} else {
                                RefreshPage(args);
                            }
                        }
                        //跳转页码
                        scope.jumpPage = function() {
                            if (scope.one.jump - 0 > 0) { //正整数&&大于0
                                scope.one.jump = Math.ceil(scope.one.jump);
                                if (scope.one.jump > pg) {
                                    RefreshPage(pg);
                                    scope.one.jump = pg;
                                } else {
                                    RefreshPage(scope.one.jump);
                                }
                            }
                        }
                        //回车跳转页码
                        scope.enterPage = function(e) {
                            if (e.keyCode == 13) {
                                scope.jumpPage();
                            }
                        }

                    }
                }
            }
        ])
});
define('directive/weibo/weibo-paging', ['at_app'], function(app) {
    app.lazy.directive('weiboPaging', ['$rootScope',
        function($rootScope) {
            return {
                require: '?^weiboList',
                restrict: 'EA',
                templateUrl: '/common/template/weibo/weibo-paging.html',
                scope: {
                    // current: '=',
                    // size: '=',
                    // total: '=',
                    page: '=',
                    item: '='
                },
                link: function(scope, iElement, iAttrs, ctrl) {
                    scope.one = {};
                    scope.one.jump = 1;

                    scope.$watch('page.pageSize', function(news, olds) {
                        if (!angular.isUndefined(news)) {
                            scope.sizePage = news || 20;
                        } else {
                            scope.sizePage = 0;
                        }
                    }, true);

                    scope.$watch('page.count', function(news, olds) {
                        if (!angular.isUndefined(news)) {
                            scope.total = news || 0;
                        } else {
                            scope.total = 0;
                        }
                    }, true);

                    scope.$watch('page.currentPage', function(news, olds) {
                        if (!angular.isUndefined(news)) {
                            scope.currentPage = news || 1;
                            refresh();
                        } else {
                            scope.currentPage = 1;
                        }
                    }, true);

                    var pg = 1,
                        list = [];

                    function refresh() {

                        //计算总页数
                        if (angular.isNumber(scope.total) && angular.isNumber(scope.sizePage)) {
                            pg = Math.ceil(scope.total / scope.sizePage) || 1; //向上去整
                        }
                        scope.totalPage = pg;
                        //当前页码>总页码时
                        if (scope.currentPage > pg) {
                            scope.currentPage = pg; //- 1; //跳转上一页
                        }
                        //第[]页.赋值为当前页码
                        scope.one.jump = scope.currentPage;

                        createPageList(); //初始化
                    }

                    //创建分页标签
                    function createPageList() {
                        list = [];
                        if (scope.totalPage <= 8) {
                            for (var i = 1; i <= scope.totalPage; i++) {
                                list.push(i);
                            }
                        } else {
                            if (scope.currentPage <= 5) {
                                for (var i = 1; i <= 7; i++) {
                                    list.push(i);
                                }
                                list.push('...');
                            } else {
                                list.push(1);
                                list.push(2);
                                list.push('...');
                                var begin = scope.currentPage - 2;
                                var end = scope.currentPage + 2;
                                if (end > scope.totalPage) {
                                    end = scope.totalPage;
                                    begin = end - 4;
                                    if (scope.currentPage - begin < 2) {
                                        begin = begin - 1;
                                    }
                                } else if (end + 1 == scope.totalPage) {
                                    end = scope.totalPage;
                                }
                                for (var i = begin; i <= end; i++) {
                                    list.push(i);
                                }
                                if (end != scope.totalPage) {
                                    list.push('...');
                                }
                            }
                        }

                        scope.paging = list;
                    }

                    //刷新页面公共方法
                    function RefreshPage(args) {
                        scope.currentPage = args - 0;
                        scope.page.current = args;
                        $rootScope.$emit('WeiboList:refurbish', {
                            needCount: true,
                            currentPage: args
                        });
                        // ctrl.getWeiboList({
                        //     needCount: true,
                        //     currentPage:args
                        // });
                        //分页样式控制
                        if (scope.currentPage < pg - 2) {
                            createPageList();
                        }
                    }
                    //上一页
                    scope.lastPage = function(args) {
                        if (args < 1) {

                        } else {
                            scope.page.current = args;
                            $rootScope.$emit('WeiboList:refurbish', {
                                needCount: true,
                                currentPage: args
                            });
                            // ctrl.getWeiboList({
                            //     needCount: true,
                            //     currentPage:args
                            // });
                        }
                    }
                    //选择页码
                    scope.selectPage = function(args) {
                        RefreshPage(args);
                    }
                    //下一页
                    scope.nextPage = function(args) {
                        if (args > pg) {} else {
                            $rootScope.$emit('WeiboList:refurbish', {
                                needCount: true,
                                currentPage: args
                            });
                            // ctrl.getWeiboList({
                            //     needCount: true,
                            //     currentPage:args
                            // });
                        }
                    }
                    //跳转页码
                    scope.jumpPage = function() {
                        if (scope.one.jump - 0 > 0) { //正整数&&大于0
                            scope.one.jump = Math.ceil(scope.one.jump);
                            if (scope.one.jump > pg) {
                                RefreshPage(pg);
                                scope.one.jump = pg;
                            } else {
                                RefreshPage(scope.one.jump);
                            }
                        }
                    }
                    //回车跳转页码
                    scope.enterPage = function(e) {
                        if (e.keyCode == 13) {
                            scope.jumpPage();
                        }
                    }

                }
            }
        }
    ]);
})
define('directive/at_mobiles',['at_app','directive/at_validate', 'directive/at_route_list'], function(app) {
    app.lazy.directive('atMobiles', ['$rootScope', 'getTpl', 'validate', '$timeout', '$location', 'SendBindCaptcha', 'GetBindCaptcha', 'SendUnBindCaptcha', 'GetUnBindCaptcha', 'GetBuyerPhone', 'CheckMobile',
        function($rootScope, getTpl, $$$v, $timeout, $location, SendBindCaptcha, GetBindCaptcha, SendUnBindCaptcha, GetUnBindCaptcha, GetBuyerPhone, CheckMobile) {
            return {
                restrict: 'A',
                templateUrl: getTpl.common('mobiles.html'),
                scope: {},
                priority: 200,
                terminal: true,
                link: function(scope, iElement, iAttrs) {
                    //手机绑定与解绑的页面
                    //接口：“at.mobile:show”
                    //目前会使用当前指令的页面有：1、个人资料。2、账户安全。3、确认订单（是从captchas.html页面进入的）。4、确认收货
                    //接收的是对象，数据有：show:是否显示，必要（true），type:类型（1、表示普通的，2表示从订单确认收货过来，需要带订单编号，可要可不要），orderId：订单编号，当从确认收货页面过来必要
                    //手机输入框
                    scope.mobileDisabled = false;
                    //点击确认按钮
                    scope.mobileClick = false;
                    //点击发送验证码按钮
                    scope.clickCaptchas=false;
                    //是否倒计时中
                    scope.countdown=false;
                    //是否点击使用新手机号码
                    scope.clickNew=false;
                    //用于记录是连续发送验证码的还是第一次发送验证码
                    //scope.captchasCount=0;
                    //查询是否有手机
                    /*function getBuyerInfo() {
                     GetBuyerPhone.get(function(data) {
                     scope.mobile = data.mobile;
                     scope.email = data.email;
                     });
                     }
                     getBuyerInfo();*/
                    //显示修改手机验证
                    $rootScope.$on('at.mobile:show',function(e,args){
                        if(args.show){
                            editMobile(args);
                        }
                    });
                    scope.submitModel = {
                        phone: "",
                        captchasCode: ""
                    };

                    scope.validation = {
                        phone: {
                            result: true,
                            message: ""
                        },
                        captchasCode: {
                            result: true,
                            message: ""
                        },
                        isAllValidated: function(){
                            return this.phone.result && this.captchasCode.result;
                        }
                    };

                    scope.formEditStatus = {
                        phone: false,
                        captchasCode: false,
                        isAllEdited: function(){
                            return this.phone && this.captchasCode && this.nickName && this.mobileCaptcha&& this.invitationCode;
                        }
                    };

                    scope.changeEditStatus = function(name){
                        scope.formEditStatus[name] = true;
                    };

                    //验证手机
                    scope.mobileBlur = function(){
                        validatePhone();
                        validatePhoneRemote();
                    };
                    function validatePhoneRemote() {
                        if(scope.submitModel.phone && scope.validation.phone.result){
                            scope.checkMobile = new CheckMobile();
                            scope.checkMobile.value = scope.submitModel.phone;
                            scope.checkMobile.$save(function(data) {
                                if (data.resultStatusBean) {
                                    scope.validation.phone.result = false;
                                    scope.validation.phone.message = data.resultStatusBean.message;
                                }
                                else {
                                    scope.validation.phone.result = true;
                                    scope.validation.phone.message = "";
                                }
                            });
                        }
                    }
                    function validatePhone(){
                        if(!scope.submitModel.phone) {
                            scope.validation.phone.result = false;
                            scope.validation.phone.message = "手机号码不能为空";
                        }else if(!$$$v.atMobile(scope.submitModel.phone)){
                            scope.validation.phone.result = false;
                            scope.validation.phone.message = "手机号码格式不正确";
                        }
                        else {
                            scope.validation.phone.result = true;
                            scope.validation.phone.message = "";
                        }
                    }

                    scope.$watch('submitModel.phone', function (newValue, oldValue) {
                        if(scope.formEditStatus.phone){
                            validatePhone();
                        }
                    });
                    //验证验证码输入框
                    scope.captchasCodeBlur = function(){
                        validateCaptchasCode();
                    };
                    function validateCaptchasCode(){
                        if(!scope.submitModel.captchasCode) {
                            scope.validation.captchasCode.result = false;
                            scope.validation.captchasCode.message = "验证码不能为空";
                        }
                        else {
                            scope.validation.captchasCode.result = true;
                            scope.validation.captchasCode.message = "";
                        }
                    }

                    scope.$watch('submitModel.captchasCode', function (newValue, oldValue) {
                        if(scope.formEditStatus.captchasCode&&scope.captchasCodeNil){
                            validateCaptchasCode();
                        }
                        //设置为需要验证
                        scope.captchasCodeNil=true;
                    });

                    function editMobile(args){
                        scope.mobile = $rootScope.USER.mobile;
                        scope.type=args.type;
                        scope.orderId=args.orderId;
                        $('#MobileModal').modal('show');

                        //验证码文本框、验证码未通过验证、验证码提示消息清空
                        scope.submitModel.captchasCode="";
                        scope.validation.captchasCode.result = true;
                        scope.validation.captchasCode.message = "";
                        //将手机文本框内、验证未通过、提示消息清空
                        // scope.submitModel.phone="";
                        // scope.validation.phone.result = true;
                        // scope.validation.phone.message = "";
                        //getBuyerInfo();
                    }
                    //是否使用email验证
                    scope.isEmail = !! 0;
                    //验证手机号是否存在
                    // scope.checkedMobile = function() {
                    //     scope.mobileValue = "";
                    //     //在得到其他验证前执行以下验证
                    //     angular.forEach(scope.mobile_form, function(field, name) {
                    //         if (typeof(name) == 'string' && !name.match('^[\$]')) {
                    //             angular.forEach(field.at_validator, function(value, key) {
                    //                 //判断是否是email的文本框
                    //                 if (name == "phone") {
                    //                     value();
                    //                 }
                    //             });
                    //         }
                    //     });
                    //     if (scope.mobile_form.phone.$error.atMobile||scope.mobile_form.phone.$error.atNil) {
                    //         return;
                    //     }
                    //     scope.checkMobile = new CheckMobile();
                    //     scope.checkMobile.value = scope.submitModel.phone;
                    //     scope.checkMobile.$save(function(data) {
                    //         if (data.resultStatusBean) {
                    //             scope.mobileValue = data.resultStatusBean.message;
                    //         }
                    //     });
                    // }
                    //倒计时方法
                    function setTimer(time) {
                        //是否倒计时中
                        scope.countdown=true;
                        if ( !! time) {
                            scope.frozenTime = time;
                        }
                        $timeout(function() {
                            if (scope.change) {
                                return;
                            }
                            //修改文本内的值
                            scope.getMoboileValue = "验证码已发，请查收短信，如果没有收到，你可以在<strong class='c-f50 f-16'>" + scope.frozenTime + "</strong>秒要求系统重新发送";
                            if (scope.frozenTime > 0) {
                                --scope.frozenTime;
                                setTimer();
                            } else {
                                //是否倒计时中
                                scope.countdown=false;
                                scope.getMoboileValue = "";
                                scope.clickGetCaptchas = !! 0;
                            }
                        }, 1000);
                    }
                    //更换手机
                    scope.changePhone=function(){
                        //使用其他手机号码，验证码输入框不允许输入
                        scope.clickCaptchas=false;
                        //将输入手机号码的文本框可以使用
                        scope.mobileDisabled=false;
                        //是否点击使用新手机号码
                        scope.clickNew=true;
                    }
                    /* scope.changeIsEmail = function() {
                     scope.isEmail = !0;
                     }*/
                    //发送验证码
                    scope.clickCaptchasButton = function() {
                        scope.mobileDisabled = true;
                        //发送过验证码，并设置验证码可用
                        scope.clickCaptchas=true;
                        //如果有手机号码，进行解绑发送验证码
                        if (scope.mobile) {
                            //将发送验证码按钮禁用
                            scope.clickGetCaptchas = !0;
                            //清空验证返回信息
                            scope.getMoboileValue = "";
                            //是否改变发送验证码提示信息
                            scope.change = false;
                            //调用倒计时方法
                            setTimer(120);
                            //发送验证码
                            SendUnBindCaptcha.save(function(data) {
                                if (data.resultStatusBean) {
                                    scope.frozenTime = 0;
                                    scope.change = true;
                                    //5次发送验证码，输入框可用
                                    //if(data.resultStatusBean.code=='100502'&&!scope.clickNew&&scope.captchasCount>0){
                                    if(data.resultStatusBean.code=='100502'&&!scope.clickNew){
                                        //发送过验证码失败，并设置验证码可用
                                        scope.clickCaptchas=true;
                                    }else{
                                        //发送过验证码失败，并设置验证码不可用
                                        scope.clickCaptchas=false;
                                    }
                                    scope.getMoboileValue = data.resultStatusBean.message;
                                }
                                //是否点击使用新手机号码
                                scope.clickNew=false;
                                //发送验证码累加一次
                                //scope.captchasCount++;
                            });
                        } else {
                            //如果没有手机号码进行绑定发送验证码
                            if (!scope.submitModel.phone) {
                                return;
                            }
                            //将发送验证码按钮禁用
                            scope.clickGetCaptchas = !0;
                            //清空验证返回信息
                            scope.getMoboileValue = "";
                            //是否改变发送验证码提示信息
                            scope.change = false;
                            //调用倒计时方法
                            setTimer(120);
                            //发送验证码
                            SendBindCaptcha.save({
                                mobile: scope.submitModel.phone
                            }, {}, function(data) {
                                if (data.resultStatusBean) {
                                    scope.frozenTime = 0;
                                    scope.change = true;
                                    //if(data.resultStatusBean.code=='100502'&&!scope.clickNew&&scope.captchasCount>0){
                                    if(data.resultStatusBean.code=='100502'&&!scope.clickNew){
                                        //发送过验证码失败，并设置验证码可用
                                        scope.clickCaptchas=true;
                                    }else{
                                        //发送过验证码失败，并设置验证码不可用
                                        scope.clickCaptchas=false;
                                    }
                                    scope.getMoboileValue = data.resultStatusBean.message;
                                }
                                //是否点击使用新手机号码
                                scope.clickNew=false;
                                //发送验证码累加一次
                                //scope.captchasCount++;
                            });

                        }
                    }
                    //确认验证码
                    scope.captcha = function() {
                        //将确认按钮禁用，等返回成功后再点击确认
                        scope.mobileClick = true;
                        //如果当前登录用户已经绑定手机号码
                        if (scope.mobile) {
                            scope.validation.captchasCode.result = true;
                            scope.validation.captchasCode.message = "";
                            GetUnBindCaptcha.save({
                                captcha: scope.submitModel.captchasCode
                            }, {}, function(data) {
                                scope.mobileClick = false;
                                if (data.resultStatusBean) {
                                    scope.validation.captchasCode.result = false;
                                    scope.validation.captchasCode.message = data.resultStatusBean.message;
                                } else {
                                    //getBuyerInfo();
                                    //将文本框信息都清空
                                    $rootScope.USER.mobile = '';
                                    scope.mobile='';
                                    scope.submitModel.mobile='';
                                    scope.submitModel.captchasCode = '';
                                    //验证码清空后，设置为不需要验证
                                    scope.captchasCodeNil=false;
                                    //发送验证码的提示文本清除
                                    scope.getMoboileValue = '';
                                    scope.mobileDisabled = false;
                                    $rootScope.notification("解绑成功！");
                                    $rootScope.$broadcast('at.buyer.security:refresh',true);
                                    scope.frozenTime=0;
                                    //将发送验证码按钮设置为可用
                                    scope.clickGetCaptchas = !! 0;
                                    //点击发送验证码按钮设置为未触发
                                    scope.clickCaptchas=false;
                                }
                            })
                        } else {
                            if (!scope.submitModel.captchasCode) {
                                return;
                            }
                            scope.validation.captchasCode.result = true;
                            scope.validation.captchasCode.message = "";
                            GetBindCaptcha.save({
                                captcha: scope.submitModel.captchasCode
                            }, {}, function(data) {
                                scope.mobileClick = false;
                                if (data.resultStatusBean) {
                                    scope.validation.captchasCode.result = false;
                                    scope.validation.captchasCode.message = data.resultStatusBean.message;
                                } else {
                                    //getBuyerInfo();
                                    scope.submitModel.captchasCode = '';
                                    scope.frozenTime=0;

                                    $rootScope.USER.mobile = scope.submitModel.phone.substring(0, 3)+'****'+scope.submitModel.phone.substring(7, 11);
                                    $rootScope.notification("绑定手机成功！");
                                    //发送验证码的提示文本清除
                                    scope.getMoboileValue = '';
                                    //将发送验证码按钮设置为可用
                                    scope.clickGetCaptchas = !! 0;
                                    //如果类型为2表示是从确认收货的链接进来，要显示确认收货的页面
                                    $('#MobileModal').modal('hide');
                                    if(scope.type==2){
                                        //表示从订单页面过来的，将订单编号也传过去
                                        //触发订单页面显示确认收货
                                        $rootScope.$broadcast('at.buyer.order:receipt',scope.orderId);
                                    }else{
                                        $rootScope.$broadcast('at.buyer.security:refresh',true);
                                    }
                                    //$location.path("/account-security");
                                }
                            })
                        }
                    }
                    //取消
                    scope.cancel = function() {
                        $('#MobileModal').modal('hide');
                        $rootScope.$broadcast('at.buyer.security:refresh',true);
                    }
                }
            }
        }
    ])
});
define('directive/at_small_shopping_car',['at_app'],function(app) {
    app.lazy.directive('shopcar', ['$rootScope', 'getTpl',
        function($rootScope, getTpl) {
            return {
                restrict: 'E',
                templateUrl: getTpl.common('small-shopping-car.html'),
                replace: true,
                scope: {
                    shopcar: '&',
                    item: '=',
                    flag: '='
                }
            };
        }
    ])
});