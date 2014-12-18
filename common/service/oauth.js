'use strict';
define('service/oauth', ['at_app','service/weibo'], function(app) {
    app.lazy.factory('OAuth', ['$resource', '$rootScope','$q','weibo',
        function($resource, $rootScope,$q,weibo) {
            var UserInfo = $resource('/restful/rest/buyer/brief');
            var Logout = $resource('/restful/rest/auth/logout');
            var Login = $resource('/restful/login');

            var user = {};
            user.userInfo = function(data) {
                return UserInfo.get({uuid:new Date().getTime()},function(data) {
                    $rootScope.userInfo = data;
                    $rootScope.USER = data;
                    $rootScope.isLogged = 1;
                    $rootScope.$emit('OAuth:login', 1);
                }).$promise;
            }
            user.login = function(data) {
                var deferred = $q.defer();
                $.ajax({
                    url: '/restful/login',
                    type: 'POST',
                    dataType: 'json',
                    data: data
                }).done(function(data) {
                    if (!data.code) {
                        $rootScope.isLogged = 1;
                        user.userInfo();
                    } else {
                        alert(data.message);
                        $rootScope.$emit('OAuth:login', 0);
                        $rootScope.isLogged = 0;
                    }
                    deferred.resolve(data);
                }).fail(function(err) {
                    console.log('err',err);
                    deferred.resolve(err);
                    alert(err.data);
                })
                return deferred.promise;
            }
            user.logout = function() {
                return Logout.get(function(data) {
                    $rootScope.userInfo = {};
                    $rootScope.USER = {};
                    $rootScope.isLogged = 0;
                    $rootScope.$emit('OAuth:logout', 1);
                }).$promise;
            }
            return user;
        }
    ])
})