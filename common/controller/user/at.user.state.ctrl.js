'use strict';
define('common-ctrl/user/at.user.state.ctrl', ['at_app', 'service/oauth'], function(app) {
    app.lazy.controller('ctrl.user-state', ['$scope', '$element', '$compile', '$rootScope', 'OAuth',
        function($scope, $element, $compile, $rootScope, OAuth) {
            $element.html('<div ng-include="template" onload="htmlLoad()" ></div>');
            $rootScope.$on('OAuth:login', function(e, data) {
                if (data) {
                    $scope.template = '/common/template/user/user-state-login.html';
                } else {
                    $scope.template = '/common/template/user/user-state-logout.html';
                }
                $compile($element.contents())($scope);
            })
        }
    ]);
})