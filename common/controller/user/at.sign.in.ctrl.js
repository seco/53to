'use strict';
define('common-ctrl/user/at.sign.in.ctrl', ['at_app', 'bower/md5/md5.min', 'service/oauth', 'service/EMAIL', 'filter/email'], function(app, md5) {
    app.lazy.controller('ctrl.sign-in', ['$scope', '$element', '$compile', '$rootScope', 'OAuth', 'EMAIL','$log',
        function($scope, $element, $compile, $rootScope, OAuth, EMAIL,$log) {
            $element.html('<div ng-include="template" onload="htmlLoad()" ></div>');
            $scope.template = '/common/template/user/sign-in.html';
            $compile($element.contents())($scope);

            $scope.htmlLoad = function() {
                $scope.sign = $scope.one = {};
                $scope.sign.rememberMe = true;
                $scope.sign.loginType = 'BUYER';
                $scope.emailSel = 0;
                $scope.emailList = EMAIL;
                var emailListLen = Object.keys(EMAIL).length - 1;
                $scope.keyCodeSel = function(e) {
                    if (e.keyCode == 38 && $scope.emailSel > 0) {
                        e.preventDefault();
                        $scope.emailSel -= 1;
                    }
                    if (e.keyCode == 40 && $scope.emailSel < emailListLen) {
                        e.preventDefault();
                        $scope.emailSel += 1;
                    }
                    if (e.keyCode == 13) {
                        if ($scope.one.emailAutocompleteShow) {
                            $scope.sign.username = $.trim($element.find('.email-selected').text());
                        } else {
                            $element.find('.pass-word').focus();
                        }
                        $scope.one.emailAutocompleteShow = 0;
                    }
                };
                // $element.find('#siUserName').bind('blur',function(){
                // $scope.one.emailAutocompleteShow = 0;
                // })
                $scope.sel = function(data) {
                    $log.log('username=', data);
                    $scope.one.emailAutocompleteShow = 0;
                    $scope.sign.username = data;
                };
                $scope.signIn = function() {
                    $scope.disabled = !0;
                    if ($scope.sign.password.length != 32) {
                        $scope.sign.password = md5($scope.sign.password);
                    }
                    OAuth.login($scope.sign).then(function() {
                        $scope.disabled = !1;
                    });
                };
                $scope.signInKeyCode = function(e) {
                    $scope.one.emailAutocompleteShow = 0;
                    if (e.keyCode == 13) {
                        $scope.signIn();
                        $element.find('.pass-word').blur();
                    }
                };
                $scope.$watch('sign.username', function(news, olds) {
                    if (news && /.*@/gi.test(news) && !/.*@.+/gi.test(news)) {
                        $scope.one.emailAutocompleteShow = 1;
                    }
                });
            }
        }
    ]);
})