//at_app.js
define('at_app', ['dependency_resolver','json!at_modules.json'], function(dependencyResolver, modules) {
    var app = angular.module('atApp', ['ngRoute', 'ngResource', 'ngCookies', 'ngSanitize', 'ngAnimate','pasvaz.bindonce']);
    //配置应用拦截器
    angular.module('atApp').factory('httpInterceptor', ['$q', '$rootScope', '$window', '$timeout', '$location', '$document',
        function($q, $rootScope, $window, $timeout, $location, $document) {
            var numLoadings = 0;
            return {
                request: function(config) {
                    if (config.method == 'GET') {
                        if (config.params) {
                        } else {
                            config.params = {};
                        }
                        if (!/\.html$/i.test(config.url)) {
                            config.params['uuid'] = +new Date().getTime().toString(6);
                        }
                    }
                    numLoadings++;
                    // Show loader
                    $rootScope.$broadcast("loader_show", config);
                    return config || $q.when(config)
                },
                response: function(response) {
                    if (!!response.config.params && !!response.config.params['currentPage']) {
                        // $document.scrollTop(0);
                    }
                    if ((--numLoadings) === 0) {
                        // Hide loader
                        $rootScope.$broadcast("loader_hide", response);
                    }
                    return response || $q.when(response);
                },
                responseError: function(response) {
                    console.log('--- response ---');
                    console.log(response);

                    if (response.status === 404) {
                        if (/\/restful\/rest\/\.*/.test(response.config.url)) {
                            $location.path('/500');
                        } else {
                            $location.path('/404');
                        }
                    }
                    if (response.status === 500) {
                        $rootScope.rootEmit = !0;
                        $rootScope.message = '系统出错,请稍后再试';
                        $timeout(function() {
                            $rootScope.rootEmit = !1;
                        }, 5000)
                        $timeout(function() {
                            $rootScope.message = '';
                        }, 6000)
                    }
                    if (response.status === 401) {
                        $timeout(function() {
                            $window.location.href = '/login?url=' + $window.location.pathname + $window.location.hash;
                        }, 0)
                    }
                    if (response.status === 403) {
                        if (response.config && response.config.url === "/restful/rest/buyer/brief") {
                        } else {
                            $rootScope.rootEmit = !0;
                            $rootScope.message = '权限不足';
                            $timeout(function() {
                                $rootScope.rootEmit = !1;
                            }, 5000)
                            $timeout(function() {
                                $rootScope.message = '';
                            }, 6000)
                        }
                    }
                    if (response.status === 502 || response.status === 504) {
                        $rootScope.rootEmit = !0;
                        $rootScope.message = '系统暂时无法访问';
                        $timeout(function() {
                            $rootScope.rootEmit = !1;
                        }, 5000)
                        $timeout(function() {
                            $rootScope.message = '';
                        }, 6000)
                    }
                    if (!(--numLoadings)) {
                        $rootScope.$broadcast("loader_hide", response);
                    }
                    return $q.reject(response);
                }
            };
        }
    ]);

    app.lazy = {
        controller: app.controller,
        directive: app.directive,
        filter: app.filter,
        factory: app.factory,
        service: app.service,
        constant: app.constant,
        decorator: app.decorator,
        provider: app.provider,
        value: app.value,
        animation: app.animation
    };
    console.log('--- app.lazy ---');
    console.dir(app.lazy);

    angular.module('atApp').constant('UA', function() {
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        if (ua.match(/msie ([\d.]+)/)) {
            Sys.ie = ua.match(/msie ([\d.]+)/)[1];
        } else if (ua.match(/firefox\/([\d.]+)/)) {
            Sys.firefox = ua.match(/firefox\/([\d.]+)/);
        } else if (ua.match(/chrome\/([\d.]+)/)) {
            Sys.chrome = ua.match(/chrome\/([\d.]+)/);
        } else if (ua.match(/opera.([\d.]+)/)) {
            Sys.opera = ua.match(/opera.([\d.]+)/);
        } else if (ua.match(/version\/([\d.]+).*safari/)) {
            Sys.safari = ua.match(/version\/([\d.]+).*safari/);
        }
        return Sys;
    });
    angular.module('atApp').config(['$routeProvider', '$locationProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$httpProvider', '$animateProvider', '$provide', '$sceProvider',
        function($routeProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $httpProvider, $animateProvider, $provide, $sceProvider) {
            $sceProvider.enabled(false);
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension|data):/);
            $httpProvider.interceptors.push('httpInterceptor');
            // $httpProvider.defaults.headers.get={ 'UUID' : new Date().getTime().toString(6)};
            app.lazy = {
                controller: $controllerProvider.register,
                directive: $compileProvider.directive,
                filter: $filterProvider.register,
                factory: $provide.factory,
                service: $provide.service,
                constant: $provide.constant,
                decorator: $provide.decorator,
                provider: $provide.provider,
                value: $provide.value,
                animation: $animateProvider.register
            };
            $locationProvider.html5Mode(!1);
            // $locationProvider.hashPrefix('!');
            angular.forEach(modules, function(moduleConfig) {
                angular.forEach(moduleConfig.routes, function(route) {
                    $routeProvider.when(route.path, {
                        templateUrl: route.templateUrl,
                        controller: route.controller,
                        resolve: dependencyResolver(moduleConfig.dependencies),
                        reloadOnSearch: true
                    });
                });
            });
            $routeProvider.otherwise({
                redirectTo: '/'
            });
        }
    ]);
    angular.module('atApp').directive('compile', ['$compile', '$timeout',
        function($compile, $timeout) {
            return function(scope, element, attrs) {
                scope.$watch(
                    function(scope) {
                        // watch the 'compile' expression for changes
                        return scope.$eval(attrs.compile);
                    },
                    function(value) {
                        // when the 'compile' expression changes assign it into the current DOM
                        element.html(value);
                        // compile the new DOM and link it to the current
                        // scope.
                        // NOTE: we only compile .childNodes so that
                        // we don't get into infinite loop compiling ourselves
                        $compile(element.contents())(scope);
                    }
                );
            };
        }
    ]);
    return app;
});