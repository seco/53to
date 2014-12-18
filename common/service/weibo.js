'use strict';
define('service/weibo',['at_app'], function(app) {
    app.lazy.factory('weibo', ['$resource',
        function($resource) {

            var WeiboUser = $resource('/restful/rest/buyer/weibo/user/:nickname/:topics',{},{
                'get': {
                    method: 'GET',
                    params: {
                        nickname: '@nickname',
                        topics:'@topics'
                    }
                }
            });

            var Weibo = $resource('/restful/rest/buyer/weibo/:id',{},{
                'get': {
                    method: 'GET',
                    cache : !1,
                    params: {
                        id: '@id'
                    }
                }
            });
            var WeiboUserSearch = $resource('/restful/rest/buyer/weibo/user/search/:input',{},{
                'getSearch': {
                    method: 'GET',
                    params: {
                        input: '@input'
                    }
                }
            });
            var Comment = $resource('/restful/rest/buyer/weibo/comment/:id',{},{
                'getList': {
                    method: 'GET',
                    params: {
                        id: '@id'
                    }
                }
            });
            var SelectFans = $resource('/restful/rest/buyer/weibo/user/fans', {}, {
                'get': {
                    isArray: false
                }
            });
            var FollowUser=$resource('/restful/rest/buyer/weibo/user/follow/:id', {}, {
                'send': {
                    method: "POST",
                    params: {
                        id: "@id"
                    }
                }
            });
            var DeleteFollow=$resource('/restful/rest/buyer/weibo/user/follow/:id', {}, {
                'send': {
                    method: "delete",
                    params: {
                        id: "@id"
                    }
                }

            });
            var SelectFollow= $resource('/restful/rest/buyer/weibo/user/follow', {}, {
                'get': {
                    isArray: false
                }
            });

            var AtMy=$resource('/restful/rest/buyer/weibo/atmy');
            var WeiboComment=$resource('/restful/rest/buyer/weibo/mycomment');
            var WeiboCommentMy=$resource('/restful/rest/buyer/weibo/commentmy');;


            var weibo = {};
            weibo.getSelectFollow=function(data){
                return SelectFollow.get(data);
            }
            weibo.getDeleteFollow=function(data){
                return DeleteFollow.send(data).$promise;
            }
            weibo.getFollowUser=function(data){
                return FollowUser.send(data).$promise;
            }
            weibo.getSelectFans=function(data){
                return SelectFans.get(data);
            }
            weibo.getAtMy=function(data){
                return AtMy.get(data);
            }
            weibo.getWeiboComment=function(data){
                return WeiboComment.get(data);
            }
            weibo.getWeiboCommentMy=function(data){
                return WeiboCommentMy.get(data);
            }

            weibo.getWeiboUserSearch = function(data) {
                return WeiboUserSearch.getSearch(data).$promise;
            }

            weibo.getWbList = function(data) {
                return Weibo.get(data);
            }

            weibo.getUserToWeiboList = function(data) {
                return WeiboUser.get(data);
            }

            weibo.getCommentList = function(data) {
                return Comment.getList(data);
            }

            weibo.sendWb = function(data) {
                var wb = new Weibo();
                var topicBean = {};
                topicBean.content = $.trim(data.content)||'';
                topicBean.type = data.type||'';
                topicBean.imageList = data.imageList||[];
                angular.extend(wb, topicBean);
                return wb.$save();
            }

            weibo.sendComment = function(data) {
                var wb = new Weibo();
                angular.extend(wb, data);
                return wb.$save();
            }

            weibo.sendRepost= function(data) {
                var wb = new Weibo();
                angular.extend(wb, data);
                return wb.$save();
            }

            weibo.getWbUser = function(data) {
                return WeiboUser.get(data).$promise;
            }



            return weibo;

        }
    ])
})