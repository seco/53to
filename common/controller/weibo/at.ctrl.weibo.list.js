/**
 * Created by Administrator on 14-9-24.
 */
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


            $scope.statement1ImgClick = function(){
                var $mediaImgCtn = $("#media_list_statement1");
                var $mediaImgExp = $("#media_exp_statement1");
                var $mediaDiv = $mediaImgExp.find(".wb-media-img");
                var $mediaImg = $mediaDiv.children("img");
                var mdListId = "media_list_statement1";
                var $imgLoader =  $("#" + mdListId).find(".img-loading");
                $imgLoader.css({left: 40 + "px", top: 40 + "px"}).show();
                if(!$mediaImg.attr("src")){
                    $mediaImg.attr("src", "/atmanlib/asset/images/maintext1.png").load(function(e) {
                        $imgLoader.hide();
                        $mediaImgCtn.hide();
                        $mediaImgExp.removeClass("hide");
                    });
                }
                else{
                    $mediaImgCtn.hide();
                    $mediaImgExp.removeClass("hide");
                }
            }
            $scope.closeStatement1Img = function(){
                var $mediaImgCtn = $("#media_list_statement1");
                var $mediaImgExp = $("#media_exp_statement1");
                $mediaImgExp.addClass("hide");
                $mediaImgCtn.show();
            }

            $scope.statement2ImgClick = function(){
                var $mediaImgCtn = $("#media_list_statement2");
                var $mediaImgExp = $("#media_exp_statement2");
                var $mediaDiv = $mediaImgExp.find(".wb-media-img");
                var $mediaImg = $mediaDiv.children("img");
                var mdListId = "media_list_statement2";
                var $imgLoader =  $("#" + mdListId).find(".img-loading");
                $imgLoader.css({left: 40 + "px", top: 40 + "px"}).show();
                if(!$mediaImg.attr("src")){
                    $mediaImg.attr("src", "/atmanlib/asset/images/maintext2.png").load(function(e) {
                        $imgLoader.hide();
                        $mediaImgCtn.hide();
                        $mediaImgExp.removeClass("hide");
                    });
                }
                else{
                    $mediaImgCtn.hide();
                    $mediaImgExp.removeClass("hide");
                }
            }
            $scope.closeStatement2Img = function(){
                var $mediaImgCtn = $("#media_list_statement2");
                var $mediaImgExp = $("#media_exp_statement2");
                $mediaImgExp.addClass("hide");
                $mediaImgCtn.show();
            }
        }
    ]);
});