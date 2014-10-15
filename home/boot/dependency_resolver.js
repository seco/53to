//dependency_resolver.js
define('dependency_resolver', ['require'], function(require){
    return function(dependencies){
        return {
            resolver : ['$q', '$rootScope', function($q, $rootScope){
                var deferred = $q.defer();
                $rootScope.loading = '/common/template/loading.html';
                /**
                 <div style="margin: 0 auto;text-align: center;">
                 <img src="/atmanlib/asset/images/icon/loading.png" alt="loading" width="800" height="600">
                 </div>
                 **/
                require(dependencies, function(){
                    $rootScope.loading = '/common/template/ngview.html';
                    //<div ng-view ng-cloak></div>
                    $rootScope.$apply(function(){
                        deferred.resolve();
                    });
                });
                return deferred.promise;
            }]
        };
    };
});
