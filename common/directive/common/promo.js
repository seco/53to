define('directive-common/promo', ['at_app', 'service/goods','filter/emojis','filter/at_link', 'atmanlib-provider/modal'], function(app) {
    app.lazy.directive('promo', ['goods', '$routeParams', '$timeout', '$cookies', 'buyerPromoPromoed', 'buyerStockBrief', '$ATModal','BuyerAccountmyself', 'BuyerProfit',
        function(goods, $routeParams, $timeout, $cookies, buyerPromoPromoed, buyerStockBrief, $ATModal, BuyerAccountmyself, BuyerProfit) {
            return {
                restrict: 'EA',
                scope: {},
                link: function(scope, element, attrs) {
                    var vm = scope.vm = {}
                    scope.promoIf = [];
                    scope.one = {};

                    function SetCookie(name, value) //两个参数，一个是cookie的名子，一个是值
                    {
                        var Days = 7; //此 cookie 将被保存 1 天
                        var exp = new Date();
                        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
                        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
                    }

                    function showModal(){
                        // Directive options
                        var options = {
                            scope: scope,
                            show: true,
                            template: "/common/template/common/promo.html"
                        };

                        // Initialize modal
                        scope.modal = $ATModal(options);


                        scope.modal.$scope.receive = function(i) {
                            var pl = scope.promoList[i];
                            scope.one.coinTotal -= pl.coin;
                            scope.promoList.splice(i, 1);
                            window.open('/item/#/'+pl.goodsBriefBean.goodsId+'/'+pl.goodsCommentBean.goodsCommentId+'/'+pl.uuid + "?agc=1");
                        }
                    }

                    function allPromo() {
                        var day = new Date().getDate();
                        if ($cookies.FIRST_NOTI != day+'') {
                            buyerPromoPromoed.get(function(data) {
                                scope.promoList = data.data;
                            })
                            buyerStockBrief.get(function(data) {
                                scope.stockbrief = data;
                            })
                            BuyerAccountmyself.get(function(data){
                                scope.buyerAccountInfo = data;
                            })
                            BuyerProfit.get({day: "-1"}, function(data){
                                scope.buyerProfit = data;
                            })
                            //$cookies.FIRST_NOTI = day;
                            SetCookie('FIRST_NOTI',day);
                            showModal();
                        }
                    }
                    allPromo();

                    scope.closeModal = function(){
                        if(scope.modal) {
                            scope.modal.hide();
                        }
                    }
                }
            }
        }
    ]);
})