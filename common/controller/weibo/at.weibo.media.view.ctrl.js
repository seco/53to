define('common-ctrl/weibo/at.weibo.media.view.ctrl', ['at_app'], function(app) {
    app.lazy.controller('ctrl.weibo-media-view', ['$scope', '$rootScope', '$timeout', '$compile', 'UA', '$log', '$element',
        function($scope, $rootScope, $timeout, $compile, UA, $log, $element) {
            $element.html('<div ng-include="template" onload="htmlLoad()" ></div>');
            $scope.template = '/common/template/weibo/weibo-media-view.html';
            $compile($element.contents())($scope);


            $scope.htmlLoad = function() {
                var $psb = $($element).find('.pic-show-box');
                var $psbImg = $($element).find('.pic-show-box img');
                var $psbtn = $($element).find('.pic-small-btn');
                var $psbi = $($element).find('.pic-show-box-img');
                var $loading = $($element).find('.loading-bar');
                var wid, hei, tt, transformRotate = 0;
                var stylePic = 0;
                var style = {};
                var cssdiv = {};
                var cssimg = {};

                $scope.imgList = $scope.wr.topicBean.imageList;
                $scope.wmv = {};
                $scope.wmv.picBoxNum = $scope.selectedNum[$scope.wr.tid] || 0;
                var len = $scope.imgList.length;

                $scope.$watch('wmv.picBoxNum', function() {
                    loadingImg();
                })

                function loadingImg() {
                    $loading.show();
                    $psbImg.hide().animate({
                        opacity: '1'
                    }, "slow", null, function() {
                        $psbImg.attr("src", $scope.imgList[$scope.wmv.picBoxNum] + '/400');
                        // $psbImg.animate({
                        //     opacity: '1'
                        // }, "slow");
                    }).load(function(e) {
                        
                        transformRotateFun(0);
                    }).error(function(e) {
                        cssdiv.width = 400;
                        cssdiv.height = 400;
                        cssdiv.top = 0;
                        cssdiv.left = 0;
                        $psb.css(cssdiv);
                        $psbtn.css(cssdiv);
                        $scope.wmv.cssdiv = cssdiv;
                    });
                }

                // $psbImg.load(function(e) {
                //     $loading.hide();
                //     transformRotateFun(0);
                // }).error(function(e) {
                //     cssdiv.width = 400;
                //     cssdiv.height = 400;
                //     cssdiv.top = 0;
                //     cssdiv.left = 0;
                //     $psb.css(cssdiv);
                //     $psbtn.css(cssdiv);
                //     $scope.wmv.cssdiv = cssdiv;
                // })

                // $scope.$watch(function() {
                //     return $scope.imgList[$scope.wmv.picBoxNum];
                // }, function(news, olds) {
                //     $timeout.cancel(tt);
                //     tt = $timeout(function() {
                //         transformRotateFun(0);
                //     }, 60)
                // })


                $scope.close = function(i) {
                    $scope.wbMediaView[$scope.wr.tid] = !$scope.wbMediaView[$scope.wr.tid];
                }

                $scope.selImg = function(i) {
                    $scope.wmv.picBoxNum = i;
                }

                $scope.picPrev = function() {
                    if (len < 7) {

                    } else {
                        style['margin-left'] = '0px';
                        $scope.styleLi = style;
                    }
                }
                $scope.picNext = function() {
                    if (len < 7) {

                    } else {
                        style['margin-left'] = '-' + len * 60 + 'px';
                        $scope.styleLi = style;
                    }
                }

                $scope.picImgPrev = function() {
                    if ($scope.wmv.picBoxNum > 0) {
                        $scope.wmv.picBoxNum = $scope.wmv.picBoxNum - 1;
                    }
                }
                $scope.picImgNext = function() {
                    if ($scope.wmv.picBoxNum < len - 1) {
                        $scope.wmv.picBoxNum = $scope.wmv.picBoxNum + 1;
                    }
                }


                function transformRotateFun(args) {
                    $loading.hide();
                    $psbImg.show();
                    // $scope.loading = 1;

                    wid = $psbImg.width();
                    hei = $psbImg.height();

                    /*alert(wid)
                    alert(hei)*/

                    if (args >= 0) {
                        var rotation = Math.PI * (360 + args) / 180;
                    } else {
                        var rotation = Math.PI * args / 180;
                    }
                    var costheta = Math.round(Math.cos(rotation) * 1000) / 1000;
                    var sintheta = Math.round(Math.sin(rotation) * 1000) / 1000;

                    cssimg.filter = "progid:DXImageTransform.Microsoft.Matrix(M11=" + costheta + ",M12=" + (-sintheta) + ",M21=" + sintheta + ",M22=" + costheta + ",SizingMethod='auto expand',FilterType='bilinear')";
                    // cssimg['-ms-filter'] = "progid:DXImageTransform.Microsoft.Matrix(M11=" + sintheta + ",M12=" + (-costheta) + ",M21=" + costheta + ",M22=" + sintheta + ",SizingMethod='auto expand')";
                    // cssimg.transform = 'matrix(' + costheta + ',' + (-sintheta) + ',' + sintheta + ',' + costheta + ',0,0)';
                    // cssimg.filter = "progid:DXImageTransform.Microsoft.BasicImage(rotation="+IE_rotation+");";
                    cssimg.transform = "rotate(" + args + "deg)";

                    cssimg.top = 0;
                    cssimg.left = 0;
                    cssdiv.width = wid;
                    cssdiv.height = hei;
                    var rt = args % 180;
                    if (!rt) {
                        cssdiv.width = wid;
                        cssdiv.height = hei;
                    } else {
                        cssdiv.width = hei;
                        cssdiv.height = wid;
                        if (UA().ie) {
                            // if (wid == 400) {
                            //     cssimg.top = (wid - hei) / 2 + 20;
                            //     cssimg.left = -(wid - hei) / 2 + 20;
                            // } else {
                            //     if (wid < hei) {
                            //         if (hei / 2 < wid) {
                            //             cssimg.top = (wid - hei) / 2;
                            //             cssimg.left = -(wid - hei) / 2;
                            //         } else if (hei / 3 < wid) {
                            //             cssimg.top = (wid - hei) / 3;
                            //             cssimg.left = -(wid - hei) / 3;
                            //         } else {
                            //             cssimg.top = (wid - hei);
                            //             cssimg.left = -(wid - hei);
                            //         }
                            //     }
                            // }
                        } else {
                            // if (wid > hei) {
                            //     if (wid / 2 < hei) {
                            //         cssimg.top = (wid - hei) / 2;
                            //         cssimg.left = -(wid - hei) / 2;
                            //     } else if (wid / 3 < hei) {
                            //         cssimg.top = (wid - hei) / 3;
                            //         cssimg.left = -(wid - hei) / 3;
                            //     } else {
                            //         cssimg.top = (wid - hei);
                            //         cssimg.left = -(wid - hei);
                            //     }
                            // }
                            if (wid == 400) {
                                cssimg.top = (wid - hei) / 2;
                                cssimg.left = -(wid - hei) / 2;
                            }
                            // if (hei > 690) {
                            //     if (wid < 690) {
                            //         if (690 / 2 < wid) {
                            //             cssimg.top = (wid - 690) / 2;
                            //             cssimg.left = -(wid - 690) / 2;
                            //         } else if (690 / 3 < wid) {
                            //             cssimg.top = (wid - 690) / 3;
                            //             cssimg.left = -(wid - 690) / 3;
                            //         } else {
                            //             cssimg.top = (wid - 690);
                            //         }
                            //         cssimg.left = 0;
                            //     }
                            // } else {
                            //     if (wid < hei) {
                            //         if (hei / 2 < wid) {
                            //             cssimg.top = (wid - hei) / 2;
                            //             cssimg.left = -(wid - hei) / 2;
                            //         } else if (hei / 3 < wid) {
                            //             cssimg.top = (wid - hei) / 3;
                            //             cssimg.left = -(wid - hei) / 3;
                            //         } else {
                            //             cssimg.top = (wid - hei);
                            //             cssimg.left = -(wid - hei);
                            //         }
                            //     }
                            // }
                        }
                    }
                    // $timeout(function(){
                    // $scope.wmv.cssdiv = cssdiv;
                    // $scope.wmv.cssimg = cssimg;
                    // })
                    $psb.css(cssdiv);
                    $psbtn.css(cssdiv);
                    $psbImg.css(cssimg);
                    // $psbImg.show();
                    // $scope.loading = 0;
                    $scope.$apply();
                }
                $scope.turnLeft = function() {
                    transformRotate -= 90;
                    transformRotateFun(transformRotate);
                }
                $scope.turnRight = function() {
                    transformRotate += 90;
                    transformRotateFun(transformRotate);
                }
            }
        }
    ])
});