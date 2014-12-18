'use strict';
define('common-ctrl/weibo/at.weibo.forwards.ctrl', ['at_app', 'service/weibo'], function(app) {
    app.lazy.controller('ctrl.weibo-forwards', ['$scope', '$element', '$rootScope', '$timeout', '$compile', 'weibo',
        function($scope, $element, $rootScope, $timeout, $compile, weibo) {
            $element.html('<div ng-include="template" onload="htmlLoad()" ></div>');
            $scope.template = '/common/template/weibo/weibo-forwards.html';
            $compile($element.contents())($scope);

            $scope.htmlLoad = function() {
                $rootScope.$on('weibo-forwards:open',function(e,data) {
                    $scope.wr = data;
                    $('#weiboForwardsModal').modal('show');
                })
                $rootScope.$on('weibo-forwards:close',function(e,data) {
                    $scope.wr = {};
                    $('#weiboForwardsModal').modal('hide');
                })

                // var $wfm = $element.find('.weiboForwardsModal');

                // $scope.$watchCollection('wr.forwardsFlag', function(news, olds) {
                //     if (news) {
                //         $wfm.modal('show');
                //     } else {
                //         $wfm.modal('hide');
                //         if (angular.isFunction($scope.closeEmojis)) {
                //             $scope.closeEmojis();
                //         }
                //     }
                // })

                // $scope.show = function() {
                //     $wfm.modal('show');
                //     $scope.wr.forwardsFlag = !$scope.wr.forwardsFlag;
                // }
                // $scope.close = function() {
                //     $wfm.modal('hide');
                //     $scope.wr.forwardsFlag = !$scope.wr.forwardsFlag;
                //     if (angular.isFunction($scope.closeEmojis)) {
                //         $scope.closeEmojis();
                //     }
                // }
            }
        }
    ])
})