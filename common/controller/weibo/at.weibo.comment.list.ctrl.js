'use strict';
define('common-ctrl/weibo/at.weibo.comment.list.ctrl', ['at_app', 'service/weibo'], function(app) {
    app.lazy.controller('ctrl.weibo-comment-list', ['$scope', '$element', '$rootScope', '$timeout', '$compile', 'weibo',
        function($scope, $element, $rootScope, $timeout, $compile, weibo) {
            $element.html('<div ng-include="template" onload="htmlLoad()" ></div>');
            $scope.template = '/common/template/weibo/weibo-comment-list.html';
            $compile($element.contents())($scope);

            $scope.htmlLoad = function() {

                $scope.loading = false;

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

                var getCommentList = function(args) {
                    var obj = {};
                    // if ($scope.wr.root) {
                    //     obj.id = $scope.wr.rootTopic.tid;
                    // } else {
                    //     obj.id = $scope.wr.tid;
                    // }
                    // angular.extend(args, {uuid:new Date().getTime().toString(6)});
                    weibo.getCommentList(args).$promise.then(function(data) {
                        if (args.needCount) {
                            delete $scope.commentList;
                            $scope.commentList = data.data || [];
                        } else {
                            $scope.commentList = $scope.commentList.concat(data.data || []);
                        }
                        $scope.commentPage = data.page;
                        $scope.loading = true;
                        // lazyloadImg();
                    })
                }
                $scope.commentList = [];
                $scope.commentPage = {};


                // $rootScope.$on('CommentList:' + $scope.wr.tid, function(e, data) {
                //     getCommentList({
                //         id: data,
                //         needCount: !0
                //     });
                // })



                $scope.$watch('wr.replysFlag', function(news, olds) {
                    // if (news != olds) {
                    if (news) {
                        getCommentList({
                            id: $scope.wr.tid,
                            needCount: !0
                        });
                        $rootScope.$on('CommentList:' + $scope.wr.tid, function(e, data) {
                            getCommentList({
                                id: data,
                                needCount: !0
                            });
                        })
                    }
                    // }
                }, !0);
                $scope.nextMore = function() {
                    $scope.commentPage.currentPage += 1;
                    $scope.commentPage.id = $scope.wr.tid;
                    getCommentList($scope.commentPage);
                }
            }
        }
    ])
})