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
                    dd.setDate(dd.getDate()); //获取AddDayCount天后的日期
                    var y = dd.getFullYear();
                    var m = dd.getMonth() + 1; //获取当前月份的日期
                    var d = dd.getDate();

                    $scope.todayStartTime = new Date(y, m - 1, d, '10', '00');
                    $scope.todayEndTime = new Date(y, m - 1, d + 1, '10', '00');
                    $scope.tomorrowStartTime = $scope.todayEndTime;
                    $scope.tomorrowEndTime = new Date(y, m - 1, d + 2, '10', '00');
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
define('common-ctrl/at.follow.now.info.ctrl', ['at_app', 'service/goods', 'filter/stockcode'], function(app) {
    app.lazy.controller('ctrl.follow-now-info', ['$scope', '$element', '$compile', '$rootScope', '$location', 'goods',
        function($scope, $element, $compile, $rootScope, $location, goods) {
            $element.html('<div ng-include="template" onload="htmlLoad()" class="scale-animate" ></div>');
            $scope.template = '/common/template/common/follow-now-info.html';
            $compile($element.contents())($scope);

            function getGoodsType() {
                goods.getGoodsType(function(datas) {
                    angular.forEach(datas, function(data, i) {
                        if (data.name == '首发') {
                            datas.splice(i, 1);
                            datas.unshift(data);
                        }
                    })
                    $scope.GoodsType = datas;
                });
            }
            $rootScope.$on('OAuth:login', function(e, data) {
                if (data) {
                    getGoodsType();
                }
            })

            $scope.$watch(function() {
                return $location.path();
            }, function(news, olds) {
                $scope.path = news;
            })
            $scope.getStockItemsByGoodsType = function(goodsTypeId, i) {
                $scope.idIndex = i;
                window.location.href = "/home/#/channel/" + goodsTypeId;
            }
        }
    ]);
});
define('common-ctrl/user/at.sign.in.ctrl', ['at_app', 'bower/md5/md5.min', 'service/oauth', 'service/EMAIL', 'filter/email'], function(app, md5) {
    app.lazy.controller('ctrl.sign-in', ['$scope', '$element', '$compile', '$rootScope', 'OAuth', 'EMAIL','$log',
        function($scope, $element, $compile, $rootScope, OAuth, EMAIL,$log) {
            $element.html('<div ng-include="template" onload="htmlLoad()" ></div>');
            $scope.template = '/common/template/user/sign-in.html';
            $compile($element.contents())($scope);

            $scope.htmlLoad = function() {
                $scope.sign = $scope.one = {};
                $scope.sign.rememberMe = true;
                $scope.sign.loginType = 'BUYER';
                $scope.emailSel = 0;
                $scope.emailList = EMAIL;
                var emailListLen = Object.keys(EMAIL).length - 1;
                $scope.keyCodeSel = function(e) {
                    if (e.keyCode == 38 && $scope.emailSel > 0) {
                        e.preventDefault();
                        $scope.emailSel -= 1;
                    }
                    if (e.keyCode == 40 && $scope.emailSel < emailListLen) {
                        e.preventDefault();
                        $scope.emailSel += 1;
                    }
                    if (e.keyCode == 13) {
                        if ($scope.one.emailAutocompleteShow) {
                            $scope.sign.username = $.trim($element.find('.email-selected').text());
                        } else {
                            $element.find('.pass-word').focus();
                        }
                        $scope.one.emailAutocompleteShow = 0;
                    }
                };
                // $element.find('#siUserName').bind('blur',function(){
                // $scope.one.emailAutocompleteShow = 0;
                // })
                $scope.sel = function(data) {
                    $log.log('username=', data);
                    $scope.one.emailAutocompleteShow = 0;
                    $scope.sign.username = data;
                };
                $scope.signIn = function() {
                    $scope.disabled = !0;
                    if ($scope.sign.password.length != 32) {
                        $scope.sign.password = md5($scope.sign.password);
                    }
                    OAuth.login($scope.sign).then(function() {
                        $scope.disabled = !1;
                    });
                };
                $scope.signInKeyCode = function(e) {
                    $scope.one.emailAutocompleteShow = 0;
                    if (e.keyCode == 13) {
                        $scope.signIn();
                        $element.find('.pass-word').blur();
                    }
                };
                $scope.$watch('sign.username', function(news, olds) {
                    if (news && /.*@/gi.test(news) && !/.*@.+/gi.test(news)) {
                        $scope.one.emailAutocompleteShow = 1;
                    }
                });
            }
        }
    ]);
});
define('common-ctrl/user/at.user.info.ctrl', ['at_app', 'service/weibo'], function(app) {
    app.lazy.controller('ctrl.user-info', ['$scope', '$element', '$compile', '$rootScope', '$timeout', 'weibo', 'Notice', 'GetStockBrief', 'BuyerAccountmyself',
        function($scope, $element, $compile, $rootScope, $timeout, weibo, Notice, GetStockBrief, BuyerAccountmyself) {
            $element.html('<div ng-include="template" onload="htmlLoad()" class="scale-animate" ></div>');
            $scope.template = '/common/template/user/user-info.html';
            $compile($element.contents())($scope);

            $scope.htmlLoad = function() {
                var obj = {};
                $rootScope.$on('OAuth:login', function(e, data) {
                    if (data) {
                        getWbUI();
                        getStockBrief();
                    }
                });

                // Notice.get().$promise.then(function(data) {
                //         scope.noticeData = data;
                //         scope.noticeAmount = (scope.noticeData.atNew || 0) + (scope.noticeData.fansNew || 0) + (scope.noticeData.newpm || 0);
                //     });

                // $rootScope.$watch('isLogged', function(news,olds){
                //     getWbUI();
                // })

                function getWbUI() {
                    weibo.getWbUser({
                        name: $rootScope.userInfo.nickName//,
                        //uuid: new Date().getTime()
                    }).then(function(data) {
                        $scope.wbUserInfo = data;
                    })
                    // $rootScope.loadWbUser($rootScope.userInfo.nickName);
                    // $scope.wbUserInfo =$rootScope.WbUser;
                    // console.log($rootScope.WbUser);
                }

                function getStockBrief() {
                    //BUG 查询还是原用户的股票首页
                    GetStockBrief.get({
                        brief: 'brief'//,
                        //uuid: new Date().getTime()
                    }, function(data) {
                        $scope.stockbrief = data;
                    })
                }
                // $timeout(function(){
                getWbUI();
                getStockBrief();
                $scope.buyerAccountInfo = BuyerAccountmyself.get();
                // },100)


            }
        }
    ]);
})
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

            // $rootScope.homeLogout = function () {
            //     OAuth.logout();
            // }
        }
    ]);
});
define('common-ctrl/weibo/at.ctrl.weibo.list', ['at_app', 'service/weibo','service/at_url', 'service/EMOJIS', 'filter/at_link', 'filter/emojis', 'filter/goodstype2name', 'directive/weibo/weibo-paging', "atmanlib-provider/popover", 'bower/caret.js/dist/jquery.caret.min', 'bower/At.js/dist/js/jquery.atwho.min'], function(app) {

    app.lazy.controller('ctrl.weibo.list', ['$scope', '$rootScope', '$timeout', '$compile', 'weibo', '$window', '$document', '$routeParams', '$filter', 'UA', 'EMOJIS', '$ATPopover', '$element', '$location', '$anchorScroll','SearchTopic',
        function($scope, $rootScope, $timeout, $compile, weibo, $window, $document, $routeParams, $filter, UA, EMOJIS, $ATPopover, $element, $location, $anchorScroll,SearchTopic) {
            //
            //点击微博图片
            $scope.mediaImgClick = function(wr, idx, tid, totid){
                if(idx > 5){
                    wr.imgThumnbIdx = 2;
                }
                else {
                    wr.imgThumnbIdx = 1;
                }
                if(!(wr.selectedImgIdx == idx)){
                    wr.selectedImgIdx = idx;
                    loadMediaImg(wr, tid, totid);
                }
                else {
                    wr.imgExpanded = true;
                }
            };
            $scope.imgThumnbLeft = function(wr, tid, totid){
                wr.imgThumnbIdx = 1;
            };
            $scope.imgThumnbRight = function(wr, tid, totid){
                wr.imgThumnbIdx = 2;
            };
            $scope.selectMediaImg = function(wr, idx, tid, totid){
                if(!(wr.selectedImgIdx == idx)){
                    wr.selectedImgIdx = idx;
                    loadMediaImg(wr, tid, totid);
                }
            };
            $scope.closeMediaImg = function(wr){
                wr.imgExpanded = false;
            };
            $scope.mediaImgLeft = function(wr, tid, totid){
                wr.selectedImgIdx--;
                loadMediaImg(wr, tid, totid);
            };
            $scope.mediaImgRight = function(wr, tid, totid){
                wr.selectedImgIdx++;
                if(wr.selectedImgIdx > 5){
                    wr.imgThumnbIdx = 2;
                }
                else {
                    wr.imgThumnbIdx = 1;
                }
                loadMediaImg(wr, tid, totid);
            };

            function loadMediaImg(wr, tid, totid){
                var id = "media_" + tid;
                if(totid) {
                    id += "_" + totid;
                }
                var $mediaImgCtn = $("#" + id);
                var $mediaDiv = $mediaImgCtn.find(".wb-media-img");
                var $mediaImg = $mediaDiv.children("img");
                if(wr.imgExpanded){
                    $mediaImg.attr("style", "");
                    $mediaDiv.attr("style", "");
                    var $mediaImgLoader = $mediaDiv.children(".img-loading");
                    $mediaImgLoader.show();
                    $mediaImg.attr("src", wr.topicBean.imageList[wr.selectedImgIdx] + "/400").load(function(e) {
                        $mediaImgLoader.hide();
                    });
                }
                else {
                    var mdListId = "media_list_" + tid;
                    if(totid) {
                        mdListId += "_" + totid;
                    }
                    var $imgLoader =  $("#" + mdListId).find(".img-loading");
                    $imgLoader.css({left: ((wr.selectedImgIdx%3) * 85 + 40) + "px", top: (parseInt(wr.selectedImgIdx/3) * 85 + 40) + "px"}).show();
                    $mediaImg.attr("src", wr.topicBean.imageList[wr.selectedImgIdx] + "/400").load(function(e) {
                        $imgLoader.hide();
                        wr.imgExpanded = true;
                        $scope.$apply();
                    });
                }
            }

            var transformRotate = 0;
            $scope.transformRotateFun = function(rotate, tid, totid) {
                var id = "media_" + tid;
                if(totid) {
                    id += "_" + totid;
                }
                var $mediaImgCtn = $("#" + id);
                transformRotate += rotate;
                var $mediaDiv = $mediaImgCtn.find(".wb-media-img");
                var $mediaImg = $mediaDiv.children("img");
                wid = $mediaImg.width();
                hei = $mediaImg.height();
                var rotation;
                if (transformRotate >= 0) {
                    rotation = Math.PI * (360 + transformRotate) / 180;
                }
                else {
                    rotation = Math.PI * transformRotate / 180;
                }
                var costheta = Math.round(Math.cos(rotation) * 1000) / 1000;
                var sintheta = Math.round(Math.sin(rotation) * 1000) / 1000;
                var cssimg = {};
                var cssdiv = {};
                cssimg.transform = "rotate(" + transformRotate + "deg)";
                cssimg.top = 0;
                cssimg.left = 0;
                cssimg.position = "absolute";
                if (UA().ie && UA().ie < 9) {
                    cssimg.filter = "progid:DXImageTransform.Microsoft.Matrix(M11=" + costheta + ",M12=" + (-sintheta) + ",M21=" + sintheta + ",M22=" + costheta + ",SizingMethod='auto expand',FilterType='bilinear')";
                }
                var rt = transformRotate % 180;
                if (!rt) {
                    cssdiv.height = "auto";
                    cssimg.height = "auto";
                    cssimg.width = "auto";
                    cssimg.position = "relative";
                }
                else {
                    if(hei > 400){
                        cssimg.height = 400;
                        cssdiv.height = wid * (400/hei);
                    }
                    else {
                        cssdiv.height = wid;
                    }
                    if (UA().ie && UA().ie < 9) {
                        if (hei < 400) {
                            cssimg.left = (wid - hei) / 2;
                        }
                    }
                    else {
                        if (hei > 400) {
                            cssimg.top = (wid * (400/hei) - wid) / 2;
                            cssimg.left = (wid - wid * (400/hei)) / 2;
                        }
                        else {
                            cssimg.top = (wid - hei) / 2;
                            cssimg.left = 0;
                        }
                    }
                }
                $mediaDiv.css(cssdiv);
                $mediaImg.css(cssimg);
            }

            $scope.showReply = function(wr, root){
                if(wr.replyStatus > -1){
                    wr.replyStatus = -1;
                    wr.replyContent = "";
                }
                else {
                    wr.replyStatus = 0;
                    var args = {id: wr.tid, needCount: true};
                    weibo.getCommentList(args).$promise.then(function(data) {
                        wr.replyStatus = 1;
                        wr.replyList = data.data || [];
                        wr.replyCount = 0;
                        if(data.page){
                            wr.replyCount = data.page.count;
                        }
                        wr.replyPage = 0;
                        $timeout(function(){
                            var id = "cmt_txt";
                            if(root){
                                id += "_" + root.tid;
                            }
                            id += "_" + wr.tid;
                            var $cmtTxt = $("#" + id);
                            atWhoCmtTxt($cmtTxt);
                            $cmtTxt.focus();
                        }, 300);
                    });
                }
            };

            $scope.getRemainTxtCount = function(wr){
                var remainTxtCount = 140;
                if(wr.replyContent){
                    remainTxtCount = (140 - wr.replyContent.length);
                }
                if(remainTxtCount < 0) {
                    return '已超过<span class="ft-bd c-f50 mglr-3">' + (0 - remainTxtCount) + '</span>字';
                }
                else {
                    return '还可以输入<span class="ft-bd mglr-3">' + remainTxtCount + '</span>字';
                }
            };

            $scope.submitReply = function(wr){
                var submitData = {toTid: wr.tid, content: $filter('forbidden')(wr.replyContent)};
                if(wr.sendType) {
                    submitData.type = "both";
                }
                else {
                    submitData.type = "reply";
                }
                weibo.sendComment(submitData).then(function(data) {
                    if (data.resultStatusBean) {
                        $rootScope.prompt({msg: data.resultStatusBean.message, autoClose: true, icon: "error"});
                    }
                    else {
                        $rootScope.prompt({msg: "评论成功!", autoClose: true, icon: "success"});
                        wr.replyList.unshift(data);
                        wr.replys++;
                        if(wr.rootTopic){
                            wr.rootTopic.replys++;
                        }
                        wr.replyContent = "";
                    }
                }, function(err) {
                    if (err.status == 401 || err.status == 403) {
                        $rootScope.prompt({msg: "未登录吾商账户.不能发布评论!", autoClose: true, icon: "error"});
                    }
                });
            };

            $scope.submitSubReply = function(cmt, wr, root){
                var submitData = {toTid: wr.tid, content: $filter('forbidden')(cmt.replyContent)};
                if(cmt.sendType) {
                    submitData.type = "both";
                }
                else {
                    submitData.type = "reply";
                }
                weibo.sendComment(submitData).then(function(data) {
                    if (data.resultStatusBean) {
                        $rootScope.prompt({msg: data.resultStatusBean.message, autoClose: true, icon: "error"});
                    }
                    else {
                        $rootScope.prompt({msg: "评论成功!", autoClose: true, icon: "success"});
                        wr.replyList.unshift(data);
                        wr.replys++;
                        cmt.showReply = false;
                    }
                }, function(err) {
                    if (err.status == 401 || err.status == 403) {
                        $rootScope.prompt({msg: "未登录吾商账户.不能发布评论!", autoClose: true, icon: "error"});
                    }
                });
            };

            $scope.replyComment = function(wr, cmt, root){
                cmt.showReply = !cmt.showReply;
                if(cmt.showReply) {
                    cmt.replyContent = '回复 @' + cmt.weiboUserBean.nickName + ' :';
                    $timeout(function(){
                        var id = "cmt_txt_" + wr.tid;
                        if(root){
                            id += "_" + root.tid;
                        }
                        if(cmt){
                            id += "_" + cmt.tid;
                        }
                        var $cmtTxt = $("#" + id);
                        atWhoCmtTxt($cmtTxt);
                        var cmtContent = $cmtTxt.val();
                        $cmtTxt.val("").focus().val(cmtContent);
                    }, 300);
                }
            };

            $scope.cmtTextKeyup = function(wr, cmt, root){
                var id = "cmt_txt_" + wr.tid;
                if(root){
                    id += "_" + root.tid;
                }
                if(cmt){
                    id += "_" + cmt.tid;
                }
                var $cmtTextArea = $("#" + id);
                if (!UA().ie) {
                    $cmtTextArea.height(0);
                }
                var h = parseFloat($cmtTextArea[0].scrollHeight);
                $cmtTextArea.css({height: h + "px"}).scrollTop(h);
            };

            var emoji_config = {
                at: "[",
                search_key: 'phrase',
                start_with_space: null,
                data: EMOJIS,
                tpl: "<li data-value='${phrase}'>${value} <img src='${url}'  height='20' width='20' /></li>",
                insert_tpl: "<img src='${url}'  height='20' width='20' />"
            };

            var at_config = {
                at: "@",
                search_key: 'nickName',
                start_with_space: null,
                tpl: "<li data-value='@${nickName}'>${nickName}</li>",
                show_the_at: true,
                callbacks: {
                    remote_filter: function(query, render_view) {
                        weibo.getWeiboUserSearch({
                            p: query
                        }).then(function(data) {
                            render_view(data.data);
                        });
                    }
                }
            };

            function atWhoCmtTxt($cmtTxt){
                $cmtTxt.atwho(at_config).atwho(emoji_config).atwho('run');
                // $inputor.caret('pos', 47);
            }

            var emojisPopover;
            var emojisPopoverOptions = {
                scope: $scope,
                trigger: "manual",
                placement: "bottom-left",
                show: true,
                template: "/common/template/emojis.tpl.html"
            };

            $scope.showEmojis = function ($event, wr, cmt, root){
                var lkId = "cmt_emojis_" + wr.tid;
                var cmtTxtId = "cmt_txt_" + wr.tid;
                if(root){
                    lkId += "_" + root.tid;
                    cmtTxtId +=  "_" + root.tid;
                }
                if(cmt){
                    lkId += "_" + cmt.tid;
                    cmtTxtId +=  "_" + cmt.tid;
                }
                if(emojisPopover){
                    emojisPopover.destroy();
                    emojisPopover = null;
                }
                emojisPopover = $ATPopover(angular.element("#" + lkId), emojisPopoverOptions);
                if($event && $event.stopPropagation){
                    $event.stopPropagation();
                }
                else{
                    window.event.cancelBubble = true;
                }
                emojisPopover.$scope.emojisArray = EMOJIS;
                emojisPopover.$scope.emojisContainerClick = function($event){
                    if($event && $event.stopPropagation){
                        $event.stopPropagation();
                    }
                    else{
                        window.event.cancelBubble = true;
                    }
                };

                emojisPopover.$scope.emojisInsert = function(emoji){
                    var str = emoji.value;
                    var obj = angular.element("#" + cmtTxtId)[0];
                    if (document.selection) {
                        obj.focus();
                        var sel = document.selection.createRange();
                        sel.text = str;
                    }
                    else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
                        var startPos = obj.selectionStart,
                            endPos = obj.selectionEnd,
                            cursorPos = startPos,
                            tmpStr = obj.value;
                        obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
                        cursorPos += str.length;
                        obj.selectionStart = obj.selectionEnd = cursorPos;
                    }
                    else {
                        obj.value += str;
                    }
                    if(cmt) {
                        cmt.replyContent = obj.value;

                    }
                    else {
                        wr.replyContent = obj.value;
                    }
                    if(emojisPopover){
                        emojisPopover.destroy();
                        emojisPopover = null;
                    }
                };
            };

            $document.click(function($event){
                if(emojisPopover){
                    emojisPopover.hide();
                }
            });

            $scope.moreComment = function(wr){
                weibo.getCommentList({currentPage: (wr.replyPage + 1), id: wr.tid}).$promise.then(function(data) {
                    wr.replyPage++;
                    wr.replyList = wr.replyList.concat(data.data || []);
                })
            };
            $scope.openForwards = function(data) {
                $rootScope.$emit('weibo-forwards:open', data);
            }
        }
    ]);
});
define('common-ctrl/weibo/at.weibo.comment.input.ctrl', ['at_app', 'service/weibo', 'service/EMOJIS', 'bower/caret.js/dist/jquery.caret.min', 'bower/At.js/dist/js/jquery.atwho.min'], function(app) {
    app.lazy.controller('ctrl.weibo-comment-input', ['$scope', '$element', '$rootScope', '$timeout', 'EMOJIS', '$compile', 'weibo', '$filter', '$log',
        function($scope, $element, $rootScope, $timeout, EMOJIS, $compile, weibo, $filter, $log) {
            $element.html('<div ng-include="template" onload="htmlLoad()" ></div>');
            $scope.template = '/common/template/weibo/weibo-comment-input.html';
            $compile($element.contents())($scope);

            $scope.htmlLoad = function() {
                var one = 0;

                // $scope.commentTextarea = '';
                // $scope.btnType = $scope.btnType || 'reply';
                var $inor = $element.find('.commentinputor'); //评论输入框

                $scope.$watch('btnType', function(news, olds) {
                    $inor.val('');
                    inputInit();
                })

                // $scope.$watch('wr.forwardsFlag', function(news, olds) {
                //     console.log('wr.forwardsFlag',news, olds);
                //     if (news) {
                //         $inor.val('');
                //         $scope.btnType = 'forward';
                //         $scope.sendType = 'forward';
                //         inputInit();
                //         // init();
                //     }
                // });

                // $scope.$watch('wr.replysFlag', function(news, olds) {
                //     if (news) {
                //         $inor.val('');
                //         $scope.sendType = $scope.btnType || 'reply';
                //         $scope.btnType = 'reply';
                //         inputInit();
                //         // init();
                //     }
                // });

                // $scope.$watch('wr.answerFlag', function(news, olds) {
                //     if (news) {
                //         $scope.sendType = $scope.btnType || 'reply';
                //         $scope.btnType = 'answer';
                //         init();
                //         inputInit();
                //     }
                // });

                function init() {
                    setTimeout(function() {
                        if ($scope.btnType == 'forward' || $scope.btnType == 'both') {
                            if (!one) {
                                if ($scope.wr.weiboUserBean) {
                                    $inor.val('//@' + $scope.wr.weiboUserBean.nickName + ':'); //自动组织昵称
                                    locatePoint();
                                    $inor.trigger('atinput');
                                }
                            }
                        } else {
                            // $scope.commentTextarea = '';
                        }
                        //回复
                        if ($scope.btnType == 'answer') {
                            // $inor.val('');
                            if ($scope.wr.weiboUserBean) {
                                $inor.val('@' + $scope.wr.weiboUserBean.nickName + ':'); //自动组织昵称
                                $inor.trigger('atinput');
                            }
                        }
                    }, 300)
                }

                // $scope.$watch('wr', function(news, olds) {
                //     if (news != olds) {
                //         if (!$scope.wr) {
                //             $scope.wr = {};
                //         }
                //         if (!$scope.wr.type) {
                //             $scope.wr.type = 'reply';
                //         }
                //         if ($scope.wr.weiboUserBean) {
                //             if ($scope.sendType == 'forward' || $scope.sendType == 'both') {
                //                 if (!one) {
                //                     $scope.commentTextarea = '//@' + $scope.wr.weiboUserBean.nickName + ':'; //自动组织昵称
                //                     locatePoint();
                //                 }
                //             } else {
                //                 // $scope.commentTextarea = '';
                //             }
                //             //回复
                //             if ($scope.sendType == 'answer') {
                //                 $scope.commentTextarea = '@' + $scope.wr.weiboUserBean.nickName + ':'; //自动组织昵称
                //             }
                //         }
                //     }
                // }, !0);



                //自动补全+
                //在光标位置插入文字
                function insertText(obj, str) {
                    obj.focus();
                    if (document.selection) {
                        var sel = document.selection.createRange();
                        sel.text = str;
                    } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
                        var startPos = obj.selectionStart,
                            endPos = obj.selectionEnd,
                            cursorPos = startPos,
                            tmpStr = obj.value;
                        obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
                        cursorPos += str.length;
                        obj.selectionStart = obj.selectionEnd = cursorPos;
                    } else {
                        obj.value += str;
                    }
                    $inor.trigger('atinput');
                }
                //在输入框最后插入文字
                function moveEnd(obj) {
                    // obj.focus();
                    var len = obj.value.length;
                    if (document.selection) {
                        var sel = obj.createTextRange();
                        sel.moveStart('character', len);
                        sel.collapse();
                        sel.select();
                    } else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') {
                        obj.selectionStart = obj.selectionEnd = len;
                    }
                }

                function locatePoint() {
                    if ($inor[0].setSelectionRange) {
                        setTimeout(function() {
                            $inor[0].setSelectionRange(0, 0); //将光标定位在textarea的开头，需要定位到其他位置的请自行修改
                            $inor[0].focus();
                        }, 0);
                    } else if ($inor[0].createTextRange) {
                        var txt = $inor[0].createTextRange();
                        txt.moveEnd("character", 0 - txt.text.length);
                        txt.select();
                    }
                }



                var emoji_config = {
                    at: "[",
                    search_key: 'phrase',
                    start_with_space: null,
                    data: EMOJIS,
                    tpl: "<li data-value='${phrase}'>${value} <img src='${url}'  height='20' width='20' /></li>",
                    insert_tpl: "<img src='${url}'  height='20' width='20' />",
                }

                var at_config = {
                    at: "@",
                    search_key: 'nickName',
                    start_with_space: null,
                    tpl: "<li data-value='@${nickName}'>${nickName}</li>",
                    show_the_at: true,
                    callbacks: {
                        remote_filter: function(query, render_view) {
                            weibo.getWeiboUserSearch({
                                p: query
                            }).then(function(data) {
                                render_view(data.data);
                            });
                        }
                    }
                }

                var $inputor = $inor.atwho(at_config).atwho(emoji_config);
                // $inputor.caret('pos', 47);
                $inputor.atwho('run');

                //自动补全-

                //表情气泡+
                var $emojisBtn = $element.find('.emojisBtn');
                var $emojisTmp = $element.find('.weiboCommentEmojisTmp');
                $emojisBtn.popover({
                    container: 'body',
                    html: true,
                    trigger: 'click',
                    placement: 'bottom',
                    title: function() {
                        return $compile('<button type="button" class="close pull-right" aria-hidden="true" ng-click="closeEmojis()">&times;</button><span>表情</span>')($scope);
                    },
                    content: function() {
                        $emojisTmp.show();
                        return $emojisTmp;
                    },
                    template: '<div class="popover" style="z-index:' + $element.parents('.modal').css('zIndex') + 20 + '"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
                }).on('show.bs.popover', function() {
                    var html = '<ul class="weiboEmojis clearfix">' +
                        '<li ng-click="emojisInsert(\'[草泥马]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/shenshou_org.gif" alt="草泥马" title="草泥马">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[神马]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/horse2_org.gif" alt="神马" title="神马">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[浮云]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/fuyun_org.gif" alt="浮云" title="浮云">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[给力]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/geili_org.gif" alt="给力" title="给力">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[围观]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/wg_org.gif" alt="围观" title="围观">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[威武]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/vw_org.gif" alt="威武" title="威武">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[熊猫]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/panda_org.gif" alt="熊猫" title="熊猫">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[兔子]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/rabbit_org.gif" alt="兔子" title="兔子">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[奥特曼]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/otm_org.gif" alt="奥特曼" title="奥特曼">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[囧]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/j_org.gif" alt="囧" title="囧">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[互粉]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/hufen_org.gif" alt="互粉" title="互粉">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[礼物]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/liwu_org.gif" alt="礼物" title="礼物">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[呵呵]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/smilea_org.gif" alt="呵呵" title="呵呵">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[嘻嘻]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/tootha_org.gif" alt="嘻嘻" title="嘻嘻">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[哈哈]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/laugh.gif" alt="哈哈" title="哈哈">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[可爱]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/tza_org.gif" alt="可爱" title="可爱">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[可怜]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/kl_org.gif" alt="可怜" title="可怜">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[挖鼻屎]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/kbsa_org.gif" alt="挖鼻屎" title="挖鼻屎">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[吃惊]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/cj_org.gif" alt="吃惊" title="吃惊">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[害羞]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/shamea_org.gif" alt="害羞" title="害羞">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[挤眼]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/zy_org.gif" alt="挤眼" title="挤眼">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[闭嘴]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/bz_org.gif" alt="闭嘴" title="闭嘴">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[鄙视]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/bs2_org.gif" alt="鄙视" title="鄙视">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[爱你]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/lovea_org.gif" alt="爱你" title="爱你">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[泪]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/sada_org.gif" alt="泪" title="泪">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[偷笑]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/heia_org.gif" alt="偷笑" title="偷笑">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[亲亲]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/qq_org.gif" alt="亲亲" title="亲亲">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[生病]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/sb_org.gif" alt="生病" title="生病">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[太开心]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/mb_org.gif" alt="太开心" title="太开心">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[懒得理你]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/ldln_org.gif" alt="懒得理你" title="懒得理你">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[右哼哼]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/yhh_org.gif" alt="右哼哼" title="右哼哼">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[左哼哼]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/zhh_org.gif" alt="左哼哼" title="左哼哼">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[嘘]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/x_org.gif" alt="嘘" title="嘘">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[衰]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/cry.gif" alt="衰" title="衰">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[委屈]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/wq_org.gif" alt="委屈" title="委屈">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[吐]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/t_org.gif" alt="吐" title="吐">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[打哈欠]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/k_org.gif" alt="打哈欠" title="打哈欠">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[抱抱]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/bba_org.gif" alt="抱抱" title="抱抱">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[怒]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/angrya_org.gif" alt="怒" title="怒">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[疑问]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/yw_org.gif" alt="疑问" title="疑问">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[馋嘴]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/cza_org.gif" alt="馋嘴" title="馋嘴">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[拜拜]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/88_org.gif" alt="拜拜" title="拜拜">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[思考]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/sk_org.gif" alt="思考" title="思考">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[汗]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/sweata_org.gif" alt="汗" title="汗">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[困]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/sleepya_org.gif" alt="困" title="困">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[睡觉]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/sleepa_org.gif" alt="睡觉" title="睡觉">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[钱]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/money_org.gif" alt="钱" title="钱">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[失望]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/sw_org.gif" alt="失望" title="失望">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[酷]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/cool_org.gif" alt="酷" title="酷">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[花心]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/hsa_org.gif" alt="花心" title="花心">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[哼]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/hatea_org.gif" alt="哼" title="哼">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[鼓掌]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/gza_org.gif" alt="鼓掌" title="鼓掌">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[晕]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/dizzya_org.gif" alt="晕" title="晕">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[悲伤]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/bs_org.gif" alt="悲伤" title="悲伤">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[抓狂]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/crazya_org.gif" alt="抓狂" title="抓狂">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[黑线]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/h_org.gif" alt="黑线" title="黑线">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[阴险]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/yx_org.gif" alt="阴险" title="阴险">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[怒骂]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/nm_org.gif" alt="怒骂" title="怒骂">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[心]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/hearta_org.gif" alt="心" title="心">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[伤心]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/unheart.gif" alt="伤心" title="伤心">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[猪头]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/pig.gif" alt="猪头" title="猪头">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[ok]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/ok_org.gif" alt="ok" title="ok">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[耶]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/ye_org.gif" alt="耶" title="耶">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[good]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/good_org.gif" alt="good" title="good">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[不要]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/no_org.gif" alt="不要" title="不要">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[赞]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/z2_org.gif" alt="赞" title="赞">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[来]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/come_org.gif" alt="来" title="来">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[弱]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/sad_org.gif" alt="弱" title="弱">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[蜡烛]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/lazu_org.gif" alt="蜡烛" title="蜡烛">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[钟]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/clock_org.gif" alt="钟" title="钟">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[话筒]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/m_org.gif" alt="话筒" title="话筒">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[蛋糕]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/cake.gif" alt="蛋糕" title="蛋糕">' +
                        '</li>' +
                        '</ul>';
                    $emojisTmp.html($compile(html)($scope));
                })
                //关闭表情气泡
                $scope.closeEmojis = function() {
                    $emojisBtn.popover('hide');
                }
                //插入表情
                $scope.emojisInsert = function(args) {
                    insertText($inor[0], args);
                    $scope.classh = 1;
                    $scope.closeEmojis();
                }
                //表情气泡-

                var $wnt = $element.find('.weiboNumTip');

                function weiboLength() {
                    var len = 0;
                    if ($inor.val()) {
                        len = $inor.val().length || 0;
                    }
                    // $scope.weiboTextareaLen = len;
                    if (len < 141) {
                        $wnt.html('还可以输入<span class="weiboNum">' + (140 - len) + '</span>字');
                    } else {
                        $wnt.html('已经超过<span class="weiboNum c-f50">' + (len - 140) + '</span>字');
                    }
                    timeout = $timeout(weiboLength, 300);
                }

                $scope.clkInput = function() {
                    if ($scope.classh != 1) {
                        $scope.classh = 1;
                    }
                    if (!one) {
                        one = 1;
                        if ($scope.btnType == 'forward' || $scope.btnType == 'both') {
                            locatePoint();
                        }
                    }
                }

                $scope.typeClk = function(e) {
                    e.stopPropagation();
                    if ($scope.sendType == 'both') {
                        $scope.sendType = $scope.btnType;
                    } else {
                        $scope.sendType = 'both';
                    }
                }
                var $inor;

                function disabledBtn(flag) {
                    var $reply = $element.find('.reply-btn'); //微博输入框
                    var $answer = $element.find('.answer-btn'); //微博输入框
                    var $forward = $element.find('.forward-btn'); //微博输入框

                    $reply.attr('disabled', flag);
                    $answer.attr('disabled', flag);
                    $forward.attr('disabled', flag);
                }

                function inputInit() {
                    $timeout(function() {
                        $inor = $element.find('.commentinputor'); //微博输入框

                        disabledBtn(!0);
                        $inor.bind('focus', function(e) {
                            weiboLength();
                        })

                        $inor.bind('keyup change click input propertychange focus atinput', function(e) {
                            var leng = $(this).val().length;
                            if (leng == 0 || leng > 140) {
                                disabledBtn(!0);
                            } else {
                                disabledBtn(!1);
                            }
                        })
                    })
                }

                function lazySendSuccess(args) {
                    $scope.sendSuccessMsg = args;
                    $scope.sendSuccess = 1;
                    $timeout(function() {
                        $scope.sendSuccess = 0;
                    }, 2000);
                }

                $scope.submit = function() {
                    disabledBtn(!0);
                    var submitData = {};
                    //是否转发到我的微博
                    if ($inor.val().length > 0 && $inor.val().length < 141) {
                        submitData.content = $filter('forbidden')($inor.val()); //过滤特殊字符
                        if ($scope.btnType == 'answer') {
                            submitData.type = 'reply';
                            if ($scope.cr) {
                                submitData.toTid = $scope.cr.tid;
                                if ($scope.cr.toTopic != 'first') {
                                    var name = $scope.cr.weiboUserBean.nickName;
                                    submitData.content = '回复 @' + name + ' :' + submitData.content;
                                }
                            } else {
                                submitData.toTid = $scope.wr.tid;
                                if ($scope.wr.toTopic != 'first') {
                                    var name = $scope.wr.weiboUserBean.nickName;
                                    submitData.content = '回复 @' + name + ' :' + submitData.content;
                                }
                            }
                        } else {
                            submitData.type = $scope.btnType;
                            submitData.toTid = $scope.wr.tid || 0;
                        }
                        if ($scope.sendType == 'both') {
                            submitData.type = 'both';
                        }
                        submitData.channelId = $scope.wr.itemId || 0;

                        //发送评论
                        weibo.sendComment(submitData).then(function(data) {
                            if (data.resultStatusBean) {
                                $rootScope.prompt({
                                    msg: data.resultStatusBean.message,
                                    autoClose: true,
                                    icon: 'alert'
                                });
                            } else {
                                $inor.val('');
                                if (angular.isFunction($scope.$parent.close)) { //关闭转发窗口
                                    $scope.$parent.close();
                                }
                                if ($scope.btnType == 'forward') {
                                    $scope.wr.forwards = $scope.wr.forwards + 1;
                                    // $rootScope.notification('转发成功');
                                    lazySendSuccess('转发成功');
                                    $rootScope.$emit('WeiboList:refurbish', {
                                        needCount: !0,
                                        data: data
                                    });
                                    $rootScope.$emit('GoodsComment:refurbish', 1);
                                    $scope.wr.forwardsFlag = 0;
                                    $rootScope.$emit('weibo-forwards:close', 1);
                                    // $rootScope.$emit('CommentList', $scope.wr.tid);
                                }
                                if ($scope.btnType == 'answer') {
                                    $scope.cr.replys = $scope.cr.replys + 1;
                                    // $rootScope.notification('回复成功');
                                    lazySendSuccess('回复成功');
                                    $rootScope.$emit('CommentList:' + $scope.wr.tid, $scope.wr.tid);
                                    $rootScope.$emit('Comment:refurbish', 1);
                                }
                                if ($scope.btnType == 'reply') {
                                    $scope.wr.replys++;
                                    // $rootScope.notification('评论成功');
                                    lazySendSuccess('评论成功');
                                    $rootScope.$emit('CommentList:' + $scope.wr.tid, $scope.wr.tid);
                                    $rootScope.$emit('GoodsComment:refurbish', 1);
                                }
                            }
                            disabledBtn(!1);
                        }, function(err) {
                            disabledBtn(!1);
                            if (err.status == 401) {
                                $rootScope.prompt({
                                    msg: '您未登录吾商账户.不能发布评论!',
                                    autoClose: true,
                                    icon: 'alert'
                                });
                            }else{
                                $rootScope.prompt({
                                    msg: err,
                                    autoClose: true,
                                    icon: 'alert'
                                });
                            }
                        });
                    } else {
                        if ($inor.val().length > 140) {
                            $rootScope.prompt({
                                msg: '评论内容超过140字!',
                                autoClose: true,
                                icon: 'alert'
                            });
                        } else {
                            $rootScope.prompt({
                                msg: '评论内容不能为空!',
                                autoClose: true,
                                icon: 'alert'
                            });
                        }
                        disabledBtn(!1);
                    }
                }
            }
        }
    ])
});
define('common-ctrl/weibo/at.weibo.comment.list.ctrl', ['at_app', 'service/weibo'], function(app) {
    app.lazy.controller('ctrl.weibo-comment-list', ['$scope', '$element', '$rootScope', '$timeout', '$compile', 'weibo',
        function($scope, $element, $rootScope, $timeout, $compile, weibo) {
            $element.html('<div ng-include="template" onload="htmlLoad()" ></div>');
            $scope.template = '/common/template/weibo/weibo-comment-list.html';
            $compile($element.contents())($scope);

            $scope.htmlLoad = function() {

                $scope.loading = false;

                function lazyloadImg() {
                    $timeout(function() {
                        angular.element('img.lazy').lazyload({
                            effect: "fadeIn"
                        });
                        // $element.find('img.lazy').lazyload({
                        //     effect: "fadeIn"
                        // });
                    }, 100)
                }

                var getCommentList = function(args) {
                    var obj = {};
                    // if ($scope.wr.root) {
                    //     obj.id = $scope.wr.rootTopic.tid;
                    // } else {
                    //     obj.id = $scope.wr.tid;
                    // }
                    // angular.extend(args, {uuid:new Date().getTime().toString(6)});
                    weibo.getCommentList(args).$promise.then(function(data) {
                        if (args.needCount) {
                            delete $scope.commentList;
                            $scope.commentList = data.data || [];
                        } else {
                            $scope.commentList = $scope.commentList.concat(data.data || []);
                        }
                        $scope.commentPage = data.page;
                        $scope.loading = true;
                        // lazyloadImg();
                    })
                }
                $scope.commentList = [];
                $scope.commentPage = {};


                // $rootScope.$on('CommentList:' + $scope.wr.tid, function(e, data) {
                //     getCommentList({
                //         id: data,
                //         needCount: !0
                //     });
                // })



                $scope.$watch('wr.replysFlag', function(news, olds) {
                    // if (news != olds) {
                    if (news) {
                        getCommentList({
                            id: $scope.wr.tid,
                            needCount: !0
                        });
                        $rootScope.$on('CommentList:' + $scope.wr.tid, function(e, data) {
                            getCommentList({
                                id: data,
                                needCount: !0
                            });
                        })
                    }
                    // }
                }, !0);
                $scope.nextMore = function() {
                    $scope.commentPage.currentPage += 1;
                    $scope.commentPage.id = $scope.wr.tid;
                    getCommentList($scope.commentPage);
                }
            }
        }
    ])
});
define('common-ctrl/weibo/at.weibo.expand.record.ctrl', ['at_app', 'directive/at_user_popover'], function(app) {
    app.lazy.controller('ctrl.weibo-expand-record', ['$rootScope', '$timeout', '$compile','$element','$scope',
        function($rootScope, $timeout, $compile,$element,$scope) {
            $element.html('<div ng-include="template" onload="htmlLoad()" ></div>');
            $scope.template = '/common/template/weibo/weibo-expand-record.html';
            $compile($element.contents())($scope);

            $scope.htmlLoad = function() {
                // console.log('ctrl.weibo-expand-record',$scope.imgList);
            }
        }
    ])
})
define('common-ctrl/weibo/at.weibo.forwards.ctrl', ['at_app', 'service/weibo'], function(app) {
    app.lazy.controller('ctrl.weibo-forwards', ['$scope', '$element', '$rootScope', '$timeout', '$compile', 'weibo',
        function($scope, $element, $rootScope, $timeout, $compile, weibo) {
            $element.html('<div ng-include="template" onload="htmlLoad()" ></div>');
            $scope.template = '/common/template/weibo/weibo-forwards.html';
            $compile($element.contents())($scope);

            $scope.htmlLoad = function() {
                $rootScope.$on('weibo-forwards:open',function(e,data) {
                    $scope.wr = data;
                    $('#weiboForwardsModal').modal('show');
                })
                $rootScope.$on('weibo-forwards:close',function(e,data) {
                    $scope.wr = {};
                    $('#weiboForwardsModal').modal('hide');
                })

                // var $wfm = $element.find('.weiboForwardsModal');

                // $scope.$watchCollection('wr.forwardsFlag', function(news, olds) {
                //     if (news) {
                //         $wfm.modal('show');
                //     } else {
                //         $wfm.modal('hide');
                //         if (angular.isFunction($scope.closeEmojis)) {
                //             $scope.closeEmojis();
                //         }
                //     }
                // })

                // $scope.show = function() {
                //     $wfm.modal('show');
                //     $scope.wr.forwardsFlag = !$scope.wr.forwardsFlag;
                // }
                // $scope.close = function() {
                //     $wfm.modal('hide');
                //     $scope.wr.forwardsFlag = !$scope.wr.forwardsFlag;
                //     if (angular.isFunction($scope.closeEmojis)) {
                //         $scope.closeEmojis();
                //     }
                // }
            }
        }
    ])
})
define('common-ctrl/weibo/at.weibo.input.ctrl', ['at_app', 'filter/forbidden', 'service/weibo', 'service/EMOJIS', 'bower/caret.js/dist/jquery.caret.min', 'bower/At.js/dist/js/jquery.atwho.min', 'bower/blueimp-file-upload/js/jquery.fileupload-angular'], function(app) {

    app.lazy.controller('ctrl.weibo-input', ['$scope', '$rootScope', '$timeout', '$compile', 'EMOJIS', 'weibo', '$filter', '$element',
        function($scope, $rootScope, $timeout, $compile, EMOJIS, weibo, $filter, $element) {
            $element.html('<div ng-include="weiboInputTmp" onload="htmlLoad()" ></div>');
            $scope.weiboInputTmp = '/common/template/weibo/weibo-input.html';
            $compile($element.contents())($scope);
            $scope.htmlLoad = function() {

                //图片上传+
                $scope.queue = [];
                $scope.options = {
                    maxNumberOfFiles: 9,
                    url: '/upload?uploadType=weiboImage'
                };
                //图片上传-

                //自动补全+
                var $inor = $element.find('.weiboinputor'); //微博输入框

                //在光标位置插入文字
                function insertText(obj, str) {
                    obj.focus();
                    if (document.selection) {
                        var sel = document.selection.createRange();
                        sel.collapse(true);
                        sel.text = str;
                    } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
                        var startPos = obj.selectionStart,
                            endPos = obj.selectionEnd,
                            cursorPos = startPos,
                            tmpStr = obj.value;
                        obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
                        cursorPos += str.length;
                        obj.selectionStart = obj.selectionEnd = cursorPos;
                    } else {
                        obj.value += str;
                    }
                    $inor.trigger('atinput');
                }
                //在输入框最后插入文字
                function moveEnd(obj) {
                    obj.focus();
                    var len = obj.value.length;
                    if (document.selection) {
                        var sel = obj.createTextRange();
                        sel.moveStart('character', len);
                        sel.collapse();
                        sel.select();
                    } else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') {
                        obj.selectionStart = obj.selectionEnd = len;
                    }
                }

                //[@]补全数据
                var namesAr = ["Jacob", "Isabella", "Ethan", "Emma", "Michael", "Olivia", "Alexander", "Sophia", "William", "Ava", "Joshua", "Emily", "Daniel", "Madison", "Jayden", "Abigail", "Noah", "Chloe", "你好", "你你你"];

                //[话题]补全数据
                var huatisAr = ['洋小伙驾机迫降北川公路为加油', '澳发现两次脉冲信', '微软明起停止“视窗', '全国小长假景区爆棚游人节日成景区"劫日"', 'XP服务将终结 升级者少观望多[财经早班车]', '疑似马航黑匣子信', '搜寻马航MH370·澳'];

                var names = $.map(namesAr, function(value, i) {
                    return {
                        'id': i,
                        'name': value
                    };
                });

                var huatis = $.map(huatisAr, function(value, i) {
                    return {
                        'id': i,
                        'name': value,
                        'huati': value
                    };
                });


                var emoji_config = {
                    at: "[",
                    search_key: 'value',
                    start_with_space: null,
                    data: EMOJIS,
                    tpl: "<li data-value='${value}'>${value} <img src='${url}'  height='20' width='20' /></li>",
                    insert_tpl: "<img src='${url}'  height='20' width='20' />",
                }
                var huati_config = {
                    at: "#",
                    start_with_space: null,
                    data: huatis,
                    tpl: "<li data-value='#${name}#'>${name}</li>",
                    show_the_at: true
                }

                var at_config = {
                    at: "@",
                    search_key: 'nickName',
                    start_with_space: null,
                    tpl: "<li data-value='@${nickName}'>${nickName}</li>",
                    show_the_at: true,
                    callbacks: {
                        remote_filter: function(query, render_view) {
                            weibo.getWeiboUserSearch({
                                p: query
                            }).then(function(data) {
                                render_view(data.data);
                            });
                        }
                    }
                }

                var $inputor;

                $inputor = $inor.atwho(at_config).atwho(emoji_config); //.atwho(huati_config);
                // $inputor.caret('pos', 47);
                $inputor.atwho('run');

                //自动补全-

                //话题气泡+

                // var $huatiBtn = $element.find('.huatiBtn');
                // var $huatiTmp = $element.find('.huatiTmp')
                // $huatiBtn.popover({
                //     container: 'body',
                //     html: true,
                //     trigger: 'click',
                //     placement: 'bottom',
                //     title: function() {
                //         return $compile('<button type="button" class="close pull-right" aria-hidden="true" ng-click="closehuati()">&times;</button><span>话题</span>')($scope);
                //     },
                //     content: function() {
                //         $huatiTmp.show();
                //         return $huatiTmp;
                //     }
                // });
                //关闭话题气泡
                $scope.closehuati = function() {
                    $huatiBtn.popover('hide');
                }
                //插入话题
                $scope.haitiInsert = function(args) {
                    $timeout(function() {
                        $scope.weiboTextarea = insertText($inor[0], args);
                        $scope.$apply();
                    }, 0)
                    args === '#' && $inor.trigger('keyup.atwhoInner'); //模拟键盘松开
                    $huatiBtn.popover('hide');
                }

                //话题气泡-

                //图片气泡+
                var $imgBtn = $element.find('.imgBtn');
                var $ufTmp = $element.find('.weiboUploadFileTmp');
                $imgBtn.popover({
                    container: 'body',
                    html: true,
                    trigger: 'click',
                    placement: 'bottom',
                    title: function() {
                        return $compile('<button type="button" class="close pull-right" aria-hidden="true" ng-click="closeImg()">&times;</button><span>图片</span>')($scope);
                    },
                    content: function() {
                        $ufTmp.show();
                        return $ufTmp;
                    }
                });
                //关闭图片气泡
                $scope.closeImg = function() {
                    $imgBtn.popover('hide');
                    $scope.queue = []; //清空图片
                }
                $scope.imgFlag = 1; //是否使用图片

                $imgBtn.on('shown.bs.popover', function() {
                    $scope.imgFlag = 1;
                })
                $imgBtn.on('hidden.bs.popover', function() {
                    $scope.imgFlag = 0;
                })
                //图片气泡-

                //表情气泡+
                var $emojisBtn = $element.find('.emojisBtn');
                var $emojisTmp = $element.find('.weiboEmojisTmp');

                $emojisBtn.popover({
                    container: 'body',
                    html: true,
                    trigger: 'click',
                    placement: 'bottom',
                    title: function() {
                        return $compile('<button type="button" class="close pull-right" aria-hidden="true" ng-click="closeEmojis()">&times;</button><span>表情</span>')($scope);
                    },
                    content: function() {
                        return $emojisTmp;
                    }
                }).on('show.bs.popover', function() {
                    var html = '<ul class="weiboEmojis clearfix">' +
                        '<li ng-click="emojisInsert(\'[草泥马]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/shenshou_org.gif" alt="草泥马" title="草泥马">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[神马]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/horse2_org.gif" alt="神马" title="神马">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[浮云]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/fuyun_org.gif" alt="浮云" title="浮云">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[给力]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/geili_org.gif" alt="给力" title="给力">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[围观]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/wg_org.gif" alt="围观" title="围观">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[威武]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/vw_org.gif" alt="威武" title="威武">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[熊猫]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/panda_org.gif" alt="熊猫" title="熊猫">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[兔子]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/rabbit_org.gif" alt="兔子" title="兔子">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[奥特曼]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/otm_org.gif" alt="奥特曼" title="奥特曼">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[囧]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/j_org.gif" alt="囧" title="囧">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[互粉]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/hufen_org.gif" alt="互粉" title="互粉">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[礼物]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/liwu_org.gif" alt="礼物" title="礼物">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[呵呵]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/smilea_org.gif" alt="呵呵" title="呵呵">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[嘻嘻]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/tootha_org.gif" alt="嘻嘻" title="嘻嘻">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[哈哈]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/laugh.gif" alt="哈哈" title="哈哈">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[可爱]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/tza_org.gif" alt="可爱" title="可爱">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[可怜]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/kl_org.gif" alt="可怜" title="可怜">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[挖鼻屎]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/kbsa_org.gif" alt="挖鼻屎" title="挖鼻屎">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[吃惊]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/cj_org.gif" alt="吃惊" title="吃惊">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[害羞]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/shamea_org.gif" alt="害羞" title="害羞">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[挤眼]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/zy_org.gif" alt="挤眼" title="挤眼">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[闭嘴]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/bz_org.gif" alt="闭嘴" title="闭嘴">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[鄙视]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/bs2_org.gif" alt="鄙视" title="鄙视">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[爱你]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/lovea_org.gif" alt="爱你" title="爱你">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[泪]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/sada_org.gif" alt="泪" title="泪">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[偷笑]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/heia_org.gif" alt="偷笑" title="偷笑">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[亲亲]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/qq_org.gif" alt="亲亲" title="亲亲">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[生病]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/sb_org.gif" alt="生病" title="生病">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[太开心]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/mb_org.gif" alt="太开心" title="太开心">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[懒得理你]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/ldln_org.gif" alt="懒得理你" title="懒得理你">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[右哼哼]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/yhh_org.gif" alt="右哼哼" title="右哼哼">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[左哼哼]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/zhh_org.gif" alt="左哼哼" title="左哼哼">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[嘘]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/x_org.gif" alt="嘘" title="嘘">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[衰]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/cry.gif" alt="衰" title="衰">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[委屈]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/wq_org.gif" alt="委屈" title="委屈">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[吐]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/t_org.gif" alt="吐" title="吐">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[打哈欠]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/k_org.gif" alt="打哈欠" title="打哈欠">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[抱抱]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/bba_org.gif" alt="抱抱" title="抱抱">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[怒]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/angrya_org.gif" alt="怒" title="怒">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[疑问]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/yw_org.gif" alt="疑问" title="疑问">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[馋嘴]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/cza_org.gif" alt="馋嘴" title="馋嘴">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[拜拜]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/88_org.gif" alt="拜拜" title="拜拜">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[思考]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/sk_org.gif" alt="思考" title="思考">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[汗]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/sweata_org.gif" alt="汗" title="汗">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[困]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/sleepya_org.gif" alt="困" title="困">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[睡觉]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/sleepa_org.gif" alt="睡觉" title="睡觉">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[钱]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/money_org.gif" alt="钱" title="钱">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[失望]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/sw_org.gif" alt="失望" title="失望">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[酷]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/cool_org.gif" alt="酷" title="酷">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[花心]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/hsa_org.gif" alt="花心" title="花心">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[哼]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/hatea_org.gif" alt="哼" title="哼">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[鼓掌]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/gza_org.gif" alt="鼓掌" title="鼓掌">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[晕]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/dizzya_org.gif" alt="晕" title="晕">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[悲伤]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/bs_org.gif" alt="悲伤" title="悲伤">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[抓狂]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/crazya_org.gif" alt="抓狂" title="抓狂">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[黑线]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/h_org.gif" alt="黑线" title="黑线">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[阴险]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/yx_org.gif" alt="阴险" title="阴险">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[怒骂]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/nm_org.gif" alt="怒骂" title="怒骂">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[心]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/hearta_org.gif" alt="心" title="心">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[伤心]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/unheart.gif" alt="伤心" title="伤心">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[猪头]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/pig.gif" alt="猪头" title="猪头">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[ok]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/ok_org.gif" alt="ok" title="ok">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[耶]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/ye_org.gif" alt="耶" title="耶">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[good]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/good_org.gif" alt="good" title="good">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[不要]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/no_org.gif" alt="不要" title="不要">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[赞]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/z2_org.gif" alt="赞" title="赞">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[来]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/come_org.gif" alt="来" title="来">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[弱]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/sad_org.gif" alt="弱" title="弱">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[蜡烛]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/lazu_org.gif" alt="蜡烛" title="蜡烛">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[钟]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/clock_org.gif" alt="钟" title="钟">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[话筒]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/m_org.gif" alt="话筒" title="话筒">' +
                        '</li>' +
                        '<li ng-click="emojisInsert(\'[蛋糕]\');">' +
                        '<img src="/atmanlib/asset/images/emojis/cake.gif" alt="蛋糕" title="蛋糕">' +
                        '</li>' +
                        '</ul>';
                    $emojisTmp.html($compile(html)($scope));
                })
                //关闭表情气泡
                $scope.closeEmojis = function() {
                    $emojisBtn.popover('hide');
                }
                //插入表情
                $scope.emojisInsert = function(args) {
                    // setTimeout(function() {
                    insertText($inor[0], args);
                    // $scope.$appy();
                    // $scope.weiboTextarea = insertText($inor[0], args);
                    // },100)
                    $scope.closeEmojis();
                    $element.find('.send-btn').attr('disabled', false);
                }
                var $wnt = $element.find('.weiboNumTip');
                var timeout;

                function weiboLength() {
                    var len = 0;
                    if ($inor.val()) {
                        len = $inor.val().length || 0;
                    }
                    // $scope.weiboTextareaLen = len;
                    if (len < 141) {
                        $wnt.html('还可以输入<span class="weiboNum">' + (140 - len) + '</span>字');
                    } else {
                        $wnt.html('已经超过<span class="weiboNum c-f50">' + (len - 140) + '</span>字');
                    }
                    timeout = $timeout(weiboLength, 300);
                }

                // var lenSI = setInterval(function() {
                //     var len = 0;
                //     if ($inor.val()) {
                //         len = $inor.val().length || 0;
                //     }
                //     // $scope.weiboTextareaLen = len;
                //     if (len < 141) {
                //         $wnt.html('还可以输入<span class="weiboNum">' + (140 - len) + '</span>字');
                //     } else {
                //         $wnt.html('已经超过<span class="weiboNum c-f50">' + (len - 140) + '</span>字');
                //     }
                // }, 300);
                //表情气泡-

                var $inor, $sb;
                $timeout(function() {
                    $inor = $element.find('.weiboinputor'); //微博输入框
                    $sb = $element.find('.send-btn'); //微博输入框

                    $sb.attr('disabled', true);
                    $inor.bind('focus', function(e) {
                        weiboLength();
                    })

                    $inor.bind('keyup change click input propertychange focus atinput', function(e) {
                        var leng = $(this).val().length;
                        if (leng == 0 || leng > 140) {
                            $sb.attr('disabled', true);
                        } else {
                            $sb.attr('disabled', false);
                        }
                    })
                }, 100)

                function lazySendSuccess(args) {
                    $scope.sendSuccessMsg = args;
                    $scope.sendSuccess = 1;
                    $timeout(function() {
                        $scope.sendSuccess = 0;
                    }, 2000);
                }


                $scope.send = function() {
                    $sb.attr('disabled', true);
                    var submitData = {};
                    submitData.type = 'first';
                    submitData.imageList = [];
                    if ($scope.imgFlag) {
                        submitData.imageList = [];
                        angular.forEach($scope.queue, function(data, i) {
                            if (data.successful && data.url) {
                                submitData.imageList.push(data.url);
                            }
                        })
                    }
                    if ($inor.val().length > 0 && $inor.val().length < 141) {
                        submitData.content = $filter('forbidden')($inor.val());
                        weibo.sendWb(submitData).then(function(data) {
                            if (data.resultStatusBean) {
                                alert(data.resultStatusBean.message);
                            } else {
                                $inor.val('');
                                $timeout(function() {
                                    $rootScope.$emit('WeiboList:refurbish', {
                                        needCount: !0,
                                        data: data
                                    });
                                    /*lazySendSuccess('发布成功');*/
                                    $rootScope.prompt({
                                        msg: '发布成功',
                                        autoClose: true,
                                        icon: 'success'
                                    });
                                }, 100);
                                $sb.attr('disabled', false);
                                $scope.closeImg(); //关闭图片气泡
                                $scope.closeEmojis();//关闭表情气泡
                            }
                        }, function(err) {
                            $sb.attr('disabled', false);
                            if (err.status == 401 || err.status == 403) {
                                alert('您未登录吾商账户.不能发布微博!');
                            }
                        });
                    } else {
                        if ($inor.val().length > 140) {
                            alert('微博内容超过140字!');
                        } else {
                            alert('微博内容不能为空!');
                        }
                        $sb.attr('disabled', false);
                    }
                }

            }
        }
    ]);
});
define('common-ctrl/weibo/at.weibo.list.ctrl', ['at_app', 'service/weibo','service/at_url', 'filter/at_link', 'filter/emojis', 'filter/goodstype2name', 'directive/weibo/weibo-paging'], function(app) {

    app.lazy.controller('ctrl.weibo-list', ['$scope', '$rootScope', '$timeout', '$compile', 'weibo', '$window', '$document', '$routeParams', '$filter', '$element', '$location', '$anchorScroll','SearchTopic',
        function($scope, $rootScope, $timeout, $compile, weibo, $window, $document, $routeParams, $filter, $element, $location, $anchorScroll,SearchTopic) {
            $element.html('<div ng-include="weiboListTmp" onload="htmlLoad()"></div>');
            $scope.weiboListTmp = '/common/template/weibo/weibo-list.html';
            $compile($element.contents())($scope);

            var NUM = 10;

            $scope.htmlLoad = function() {
                $scope.wrOne = {};
                $scope.loading = true;
                $scope.weiboList = [];
                $scope.weiboPage = {};
                $scope.selectedImg = {};
                $scope.wbMediaView = {};
                $scope.wbMediaViewNum = {};
                $scope.weiboNum = NUM;
                var lazyloadImgFlag = 1;

                // function lazyloadImg() {
                //    // if(lazyloadImgFlag){
                //         // $timeout(function() {
                //             $element.find('img.lazy').lazyload({
                //                 effect: "fadeIn"
                //             });
                //         // }, 1500)
                //    // }
                //    // lazyloadImgFlag = 0;
                // }
                // lazyloadImg();

                function initWeiboList(args, data) {
                    if (args.needCount) {
                        // if (angular.isFunction($document.scrollTop)) {
                        //     $document.scrollTop(0);
                        // }
                        $scope.weiboList = data.data || [];
                        $scope.weiboPage = data.page || {};
                        if (data.page && data.page.count) {
                            $scope.pagination = Math.ceil(data.page.count / data.page.pageSize);
                        } else {
                            $scope.pagination = 1;
                        }
                    } else {
                        $scope.weiboList = $scope.weiboList.concat(data.data || []);
                    }
                    // $scope.weiboListTmp = '/common/template/weibo/weibo-list.html';
                    // $compile($element.contents())($scope);
                    $scope.loading = 0;
                    // lazyloadImg();

                }

                function getWl(args) {
                    flag = 0;
                    $scope.loading = 1;
                    if($routeParams.selectInfo){
                        SearchTopic.get({seachValue:$routeParams.selectInfo}).$promise.then(function(data) {
                            initWeiboList(args, data);
                        })
                    }
                    if ($location.path() == '/mine/at') {
                        weibo.getAtMy(args).$promise.then(function(data) {
                            initWeiboList(args, data);
                        })
                    }
                    if ($routeParams.nickname) {
                        args.nickname = $routeParams.nickname;
                        args.topics = 'topics';
                        weibo.getUserToWeiboList(args).$promise.then(function(data) {
                            initWeiboList(args, data);
                        })
                    }
                    if ($location.path() == '/') {
                        weibo.getWbList(args).$promise.then(function(data) {
                            initWeiboList(args, data);
                        })
                    }
                    $rootScope.$emit('getNotice:remind',true);
                }
                var obj = {};
                obj.needCount = !0;
                obj.id = $routeParams.id;
                getWl(obj);
                var num = 1;
                var flag = 1;

                function autoScroll() {
                    //下面这句主要是获取网页的总高度，主要是考虑兼容性所以把Ie支持的documentElement也写了，这个方法至少支持IE8
                    var htmlHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
                    //clientHeight是网页在浏览器中的可视高度，
                    var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
                    //scrollTop是浏览器滚动条的top位置，
                    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

                    $scope.scrollTop = scrollTop;
                    //通过判断滚动条的top位置与可视网页之和与整个网页的高度是否相等来决定是否加载内容；
                    if ((scrollTop + clientHeight) == htmlHeight) {
                        $scope.weiboNum = $scope.weiboNum + NUM;
                        $scope.$apply();
                    }
                }

                // window.onscroll = autoScroll;
                $($window).bind('scroll', autoScroll);

                $scope.$watch('weiboNum', function() {
                    var wn = Math.floor($scope.weiboNum / 20);
                    if (!$scope.weiboPagingShow) {
                        $timeout(function() {
                            $($window).scrollTop($scope.scrollTop - 40);
                        }, 200);
                    }
                    if ($scope.weiboNum == $scope.weiboList.length) {
                        if (wn > $scope.weiboPage.currentPage || $scope.weiboPage.currentPage > 2) {
                            $scope.weiboPagingShow = 1;
                            return false;
                        }
                        $scope.next();
                    }
                })

                $scope.more = function() {
                    $scope.weiboNum = $scope.weiboNum + NUM;
                }

                function addCurrentPage() {
                    $scope.weiboPage.currentPage = $scope.weiboPage.currentPage + 1;
                }

                $rootScope.$on('WeiboList:refurbish', function(e, data) {
                    $scope.weiboList = [];
                    getWl(data);
                })
                $rootScope.$on('OAuth:login', function(e, data) {
                    if (data) {
                        getWl({
                            needCount: !0
                        });
                    }
                })

                $scope.openForwards = function(data) {
                    $rootScope.$emit('weibo-forwards:open', data);
                }

                $scope.next = function() {
                    addCurrentPage();
                    getWl($scope.weiboPage);
                    // getWl({
                    //     idMax: $scope.weiboList[$scope.weiboList.length - 1].tid
                    // });
                }
            }
        }
    ]);
});
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