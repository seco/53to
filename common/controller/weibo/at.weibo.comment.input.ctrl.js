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
})