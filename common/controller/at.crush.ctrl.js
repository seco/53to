 define('common-ctrl/at.crush.ctrl', ['at_app', 'service/goods'], function(app) {
     app.lazy.controller('ctrl.crush', ['$scope', 'goods', '$routeParams', '$element', '$compile', '$timeout',
         function($scope, goods, $routeParams, $element, $compile, $timeout) {
             $element.html('<div ng-include="crushTmp" onload="htmlLoad()"></div>');
             $scope.crushTmp = '/common/template/common/crush.html';
             $scope.crushNum = 6;
             $compile($element.contents())($scope);

             $scope.htmlLoad = function() {
                 goods.getGoodsPromotion(function(data) {
                     $scope.goodsList = data;
                     $scope.model = {};
                     getlastTime();
                     var dd = new Date();
                     dd.setDate(dd.getDate());
                     var y = dd.getFullYear();
                     var m = dd.getMonth() + 1; //获取当前月份的日期 
                     var d = dd.getDate();
                     var hour = dd.getHours();
                    if (hour < 10) {
                         $scope.todayStartTime = new Date(y, m - 1, d - 1, '10', '00');
                         $scope.todayEndTime = new Date(y, m - 1, d, '10', '00');
                         $scope.tomorrowStartTime = $scope.todayEndTime;
                         $scope.tomorrowEndTime = new Date(y, m - 1, d + 1, '10', '00');
                    } else {
                         $scope.todayStartTime = new Date(y, m - 1, d, '10', '00');
                         $scope.todayEndTime = new Date(y, m - 1, d + 1, '10', '00');
                         $scope.tomorrowStartTime = $scope.todayEndTime;
                         $scope.tomorrowEndTime = new Date(y, m - 1, d + 2, '10', '00');
                    }
                    
                 })

                 function getlastTime() {
                     var lastTime = $scope.goodsList.endDate - new Date().getTime();
                     var hours = Math.floor(lastTime / (3600 * 1000));
                     var leave1 = lastTime % (3600 * 1000);
                     var minutes = Math.floor(leave1 / (60 * 1000));
                     var leave2 = leave1 % (60 * 1000);
                     var seconds = Math.round(leave2 / 1000);
                     if (hours < 10) {
                         hours = "0" + hours;
                     }
                     if (minutes < 10) {
                         minutes = "0" + minutes;
                     }
                     if (seconds < 10) {
                         seconds = "0" + seconds;
                     }
                     if (seconds == 60) {
                         seconds = 59;
                     }
                     if (minutes == 60) {
                         minutes = 59;
                     }
                     if (hours >= 0 && minutes >= 0 && seconds >= 0) {
                         $scope.model.promRemainHours = hours || '00';
                         $scope.model.promRemainMinutes = minutes || '00';
                         $scope.model.promRemainSeconds = seconds || '00';
                         $timeout(getlastTime, 100);
                     } else {
                         $scope.model.promRemainHours = '00';
                         $scope.model.promRemainMinutes = '00';
                         $scope.model.promRemainSeconds = '00';
                         //$scope.goodsList = goods.getGoodsPromotion();
                     }
                 }


             }
         }
     ]);
 });