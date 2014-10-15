define('directive-common/sm-header',['at_app'], function(app) {
    app.lazy.directive('smHeader', function() {
        return {
            restrict: 'EA',
            templateUrl: '/common/template/common/sm-header.html',
            link: function(scope, element, attrs) {
                var vm = scope.vm = {}
            }
        }
    });
})