'use strict';
define('filter/goodstype2name',['at_app','service/GOODSTYPE'], function(app) {
app.lazy.filter('goodstype2nameFr',['GOODSTYPE', function(GOODSTYPE) {
    return function(input) {
        var pId = GOODSTYPE[input][1];
        return GOODSTYPE[pId][0];
    }
}]);
})