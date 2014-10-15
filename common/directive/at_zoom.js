define('directive/at_zoom', ['at_app', 'jqzoom'], function(app) {
    app.lazy.directive('atZoom', ['$rootScope', '$compile', '$timeout','loadCss',
        function($rootScope, $compile, $timeout,loadCss) {
            return {
                priority: 1000,
                restrict: 'A',
                scope: {
                    rel: '@'
                },
                link: function postLink(scope, iElement, iAttrs) {
                    var options = {
                        zoomType: 'standard',
                        lens: true,
                        preloadImages: true,
                        alwaysOn: false,
                        zoomWidth: 446,
                        zoomHeight: 446,
                        xOffset: 1,
                        yOffset: 0,
                        position: 'right',
                        title: false,
                        preloadText: '加载中...'
                    };
                    $timeout(function() {
                        iElement.jqzoom(options);
                    }, 1000);
                }
            };
        }
    ])
});