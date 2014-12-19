//dependency_resolver.js
define('dependency_resolver', ['require'], function(require){
    return function(dependencies){
        return {
            resolver : ['$q', '$rootScope', function($q, $rootScope){
                var deferred = $q.defer();
                $rootScope.loading = '/common/template/loading.html';

                require(dependencies, function(){
                    $rootScope.loading = '/common/template/ngview.html';

                    $rootScope.$apply(function(){
                        deferred.resolve();
                    });
                });
                return deferred.promise;
            }]
        };
    };
});
