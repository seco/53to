'use strict';
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