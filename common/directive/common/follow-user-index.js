define('directive-common/follow-user-index',['at_app','filter/stockcode', "atmanlib-provider/confirm"], function(app) {
    app.lazy.directive('followUserIndex', ['$rootScope', 'UserRecommend','$ATConfirm','DeleteFollow','FollowUser',
        function($rootScope,UserRecommend,$modalConfirm,DeleteFollow,FollowUser) {
            return {
                restrict: 'EA',
                templateUrl: '/common/template/follow-user-index.html',
                scope: {},
                controller: ['$scope', '$element', '$location',
                    function($scope, $element, $location) {
                        $scope.oneNum;
                        $scope.twoNum;
                        $scope.threeNum;
                        var totalNum;
                        //查询
                        UserRecommend.get(function(data){
                            $scope.userList=data;
                            totalNum=$scope.userList.length;
                            $scope.oneNum=0;
                            $scope.twoNum=1;
                            $scope.threeNum=2;
                        })
                        $scope.getUser=function(){
                            if((totalNum-$scope.threeNum)==2){
                                $scope.oneNum=$scope.threeNum+1;
                                $scope.twoNum=0;
                                $scope.threeNum=1;
                            }else if((totalNum-$scope.threeNum)==3){
                                $scope.oneNum=$scope.threeNum+1;
                                $scope.twoNum=$scope.threeNum+2;
                                $scope.threeNum=0;
                            }else if((totalNum-1)==$scope.threeNum){
                                $scope.oneNum=0;
                                $scope.twoNum=1;
                                $scope.threeNum=2;
                            }else{
                                $scope.oneNum=$scope.threeNum+1;
                                $scope.twoNum=$scope.threeNum+2;
                                $scope.threeNum=$scope.threeNum+3;
                            }
                        }
                        var modalConfirm;
                        //取消关注
                        $scope.cancelFollow=function(user, $event){
                            if($event && $event.stopPropagation){
                                $event.stopPropagation();
                            }
                            else{
                                window.event.cancelBubble = true;
                            }
                            if(!modalConfirm){
                                var confirmOptions = {placement: "top"};
                                modalConfirm = $modalConfirm(angular.element($event.target), confirmOptions);
                                modalConfirm.$scope.content = "确定不再关注 " + user.nickName;
                                modalConfirm.$scope.dialogClass = "w-auto";
                                modalConfirm.$scope.okClick = function(){
                                    DeleteFollow.send({id:user.uid},function(data){
                                        if(!data){
                                            $rootScope.notification("取消关注失败");
                                        }else{
                                            modalConfirm.destroy();
                                            modalConfirm = null;
                                            user.isFollowRelation = 2;
                                            user.fansCount -=1;
                                            $rootScope.WbUser.followCount -=1;
                                            // if($rootScope.WbUser.nickName == $rootScope.USER.nickName) {
                                            //     $rootScope.WbUser.followCount -=1;
                                            // }
                                            // if($rootScope.WbUser && $rootScope.WbUser.nickName == user.nickName){
                                            //     $rootScope.WbUser.fansCount -=1;
                                            // }
                                            // $rootScope.notification("已取消关注 " + follows.nickName);
                                        }
                                    });
                                }
                                modalConfirm.$scope.cancelClick = function(){
                                    modalConfirm.destroy();
                                    modalConfirm = null;
                                }
                            }
                        }
                        //关注is_follow_relation:关注关系 0：没有关系 1：我关注TA 2：TA关注我 3：互相关注
                        $scope.userFollow=function(user){
                            FollowUser.send({id:user.uid},function(data){
                                if(!data){
                                    $rootScope.notification("关注失败");
                                }else{
                                    // $rootScope.notification("关注成功");
                                    //init(1);
                                    user.isFollowRelation=1;
                                    user.fansCount +=1;
                                    $rootScope.WbUser.followCount +=1;
                                    // if($rootScope.WbUser.nickName == $rootScope.USER.nickName) {
                                    //     $rootScope.WbUser.followCount +=1;
                                    // }
                                    // if($rootScope.WbUser && $rootScope.WbUser.nickName == user.nickName){
                                    //     $rootScope.WbUser.fansCount +=1;
                                    // }
                                }
                            });
                        }
                    }
                ]
            }
        }
    ]);
})