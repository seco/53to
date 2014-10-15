define('directive-common/add-cart-item',['at_app', 'atmanlib-provider/popover'], function(app) {
    app.lazy.directive('addCartItem', ['$rootScope', '$document', 'CartItem', "$ATPopover", function($rootScope, $document, CartItem, $ATPopover) {
        return {
            require: '?ngModel',
            restrict: 'EA',
            link: function(scope, element, attrs, ngModel) {
                var options = {
                    scope: scope,
                    show: true,
                    trigger: "manual",
                    placement: "bottom",
                    template: "/common/template/common/add-cart-item.tpl.html"
                };

                if(angular.isDefined(attrs.placement)) {
                    options.placement = attrs.placement;
                }

                scope.popoverContainerClick = function($event){
                    if($event && $event.stopPropagation){
                        $event.stopPropagation();
                    }
                    else{
                        window.event.cancelBubble = true;
                    }
                };

                element.click(function(){
                    if(scope.popover){
                        scope.popover.destroy();
                    }
                    addCartItem();
                });

                $document.click(function($event){
                    if(scope.popover){
                        scope.popover.hide();
                    }
                });

                scope.close = function(){
                    if(scope.popover){
                        scope.popover.hide();
                    }
                };

                //加入购物车
                function addCartItem() {
                    var newCartItem = new CartItem();
                    newCartItem.goodsId = ngModel.$viewValue.goodsId;
                    newCartItem.goodsCommentId = ngModel.$viewValue.commentId || "";
                    newCartItem.quantity = ngModel.$viewValue.quantity - 0;
                    newCartItem.$save(function(data) {
                        scope.submitModel = ngModel.$viewValue;
                        scope.data = data;
                        if(data.resultStatusBean && data.resultStatusBean.code == "10240"){
                            scope.message = data.resultStatusBean.message;
                        }
                        scope.popover = $ATPopover(element, options);
                        scope.$emit('at.getsmallshopingcar', true);
                    });
                }

                // Garbage collection
                scope.$on('$destroy', function() {
                    if(scope.popover) {
                        scope.popover.destroy();
                        options = null;
                        scope.popover = null;
                    }
                });
            }
        }
    }]);
});