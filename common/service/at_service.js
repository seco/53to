define('service/at_service',['at_app', 'require'], function(app, require) {
    app.lazy.value('UUID', function() {
        return new Date().getTime().toString(16) + Math.random(1000).toString().replace('.', '')
    })
    app.lazy.factory('getUrlParam', ['$window',
        function($window) {
            return function(name) {
                var obj = {};
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
                var r = $window.location.search.substr(1).match(reg); //匹配目标参数
                if (r != null) {
                    obj[name] = unescape(r[2]);
                    return obj
                }
                return obj;
            }
        }
    ]);
    app.lazy
        .service('emojisAr', function() {
            return [{
                "phrase": "[草泥马]",
                "type": "face",
                "url": "/assets/images/emojis/shenshou_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/shenshou_thumb.gif",
                "value": "[草泥马]",
                "picid": ""
            }, {
                "phrase": "[神马]",
                "type": "face",
                "url": "/assets/images/emojis/horse2_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/horse2_thumb.gif",
                "value": "[神马]",
                "picid": ""
            }, {
                "phrase": "[浮云]",
                "type": "face",
                "url": "/assets/images/emojis/fuyun_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/fuyun_thumb.gif",
                "value": "[浮云]",
                "picid": ""
            }, {
                "phrase": "[给力]",
                "type": "face",
                "url": "/assets/images/emojis/geili_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/geili_thumb.gif",
                "value": "[给力]",
                "picid": ""
            }, {
                "phrase": "[围观]",
                "type": "face",
                "url": "/assets/images/emojis/wg_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/wg_thumb.gif",
                "value": "[围观]",
                "picid": ""
            }, {
                "phrase": "[威武]",
                "type": "face",
                "url": "/assets/images/emojis/vw_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/vw_thumb.gif",
                "value": "[威武]",
                "picid": ""
            }, {
                "phrase": "[熊猫]",
                "type": "face",
                "url": "/assets/images/emojis/panda_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/panda_thumb.gif",
                "value": "[熊猫]",
                "picid": ""
            }, {
                "phrase": "[兔子]",
                "type": "face",
                "url": "/assets/images/emojis/rabbit_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/rabbit_thumb.gif",
                "value": "[兔子]",
                "picid": ""
            }, {
                "phrase": "[奥特曼]",
                "type": "face",
                "url": "/assets/images/emojis/otm_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/otm_thumb.gif",
                "value": "[奥特曼]",
                "picid": ""
            }, {
                "phrase": "[囧]",
                "type": "face",
                "url": "/assets/images/emojis/j_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/j_thumb.gif",
                "value": "[囧]",
                "picid": ""
            }, {
                "phrase": "[互粉]",
                "type": "face",
                "url": "/assets/images/emojis/hufen_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/hufen_thumb.gif",
                "value": "[互粉]",
                "picid": ""
            }, {
                "phrase": "[礼物]",
                "type": "face",
                "url": "/assets/images/emojis/liwu_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/liwu_thumb.gif",
                "value": "[礼物]",
                "picid": ""
            }, {
                "phrase": "[呵呵]",
                "type": "face",
                "url": "/assets/images/emojis/smilea_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/smilea_thumb.gif",
                "value": "[呵呵]",
                "picid": ""
            }, {
                "phrase": "[嘻嘻]",
                "type": "face",
                "url": "/assets/images/emojis/tootha_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/tootha_thumb.gif",
                "value": "[嘻嘻]",
                "picid": ""
            }, {
                "phrase": "[哈哈]",
                "type": "face",
                "url": "/assets/images/emojis/laugh.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/laugh.gif",
                "value": "[哈哈]",
                "picid": ""
            }, {
                "phrase": "[可爱]",
                "type": "face",
                "url": "/assets/images/emojis/tza_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/tza_thumb.gif",
                "value": "[可爱]",
                "picid": ""
            }, {
                "phrase": "[可怜]",
                "type": "face",
                "url": "/assets/images/emojis/kl_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/kl_thumb.gif",
                "value": "[可怜]",
                "picid": ""
            }, {
                "phrase": "[挖鼻屎]",
                "type": "face",
                "url": "/assets/images/emojis/kbsa_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/kbsa_thumb.gif",
                "value": "[挖鼻屎]",
                "picid": ""
            }, {
                "phrase": "[吃惊]",
                "type": "face",
                "url": "/assets/images/emojis/cj_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/cj_thumb.gif",
                "value": "[吃惊]",
                "picid": ""
            }, {
                "phrase": "[害羞]",
                "type": "face",
                "url": "/assets/images/emojis/shamea_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/shamea_thumb.gif",
                "value": "[害羞]",
                "picid": ""
            }, {
                "phrase": "[挤眼]",
                "type": "face",
                "url": "/assets/images/emojis/zy_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/zy_thumb.gif",
                "value": "[挤眼]",
                "picid": ""
            }, {
                "phrase": "[闭嘴]",
                "type": "face",
                "url": "/assets/images/emojis/bz_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/bz_thumb.gif",
                "value": "[闭嘴]",
                "picid": ""
            }, {
                "phrase": "[鄙视]",
                "type": "face",
                "url": "/assets/images/emojis/bs2_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/bs2_thumb.gif",
                "value": "[鄙视]",
                "picid": ""
            }, {
                "phrase": "[爱你]",
                "type": "face",
                "url": "/assets/images/emojis/lovea_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/lovea_thumb.gif",
                "value": "[爱你]",
                "picid": ""
            }, {
                "phrase": "[泪]",
                "type": "face",
                "url": "/assets/images/emojis/sada_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/sada_thumb.gif",
                "value": "[泪]",
                "picid": ""
            }, {
                "phrase": "[偷笑]",
                "type": "face",
                "url": "/assets/images/emojis/heia_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/heia_thumb.gif",
                "value": "[偷笑]",
                "picid": ""
            }, {
                "phrase": "[亲亲]",
                "type": "face",
                "url": "/assets/images/emojis/qq_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/qq_thumb.gif",
                "value": "[亲亲]",
                "picid": ""
            }, {
                "phrase": "[生病]",
                "type": "face",
                "url": "/assets/images/emojis/sb_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/sb_thumb.gif",
                "value": "[生病]",
                "picid": ""
            }, {
                "phrase": "[太开心]",
                "type": "face",
                "url": "/assets/images/emojis/mb_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/mb_thumb.gif",
                "value": "[太开心]",
                "picid": ""
            }, {
                "phrase": "[懒得理你]",
                "type": "face",
                "url": "/assets/images/emojis/ldln_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/ldln_thumb.gif",
                "value": "[懒得理你]",
                "picid": ""
            }, {
                "phrase": "[右哼哼]",
                "type": "face",
                "url": "/assets/images/emojis/yhh_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/yhh_thumb.gif",
                "value": "[右哼哼]",
                "picid": ""
            }, {
                "phrase": "[左哼哼]",
                "type": "face",
                "url": "/assets/images/emojis/zhh_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/zhh_thumb.gif",
                "value": "[左哼哼]",
                "picid": ""
            }, {
                "phrase": "[嘘]",
                "type": "face",
                "url": "/assets/images/emojis/x_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/x_thumb.gif",
                "value": "[嘘]",
                "picid": ""
            }, {
                "phrase": "[衰]",
                "type": "face",
                "url": "/assets/images/emojis/cry.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/cry.gif",
                "value": "[衰]",
                "picid": ""
            }, {
                "phrase": "[委屈]",
                "type": "face",
                "url": "/assets/images/emojis/wq_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/wq_thumb.gif",
                "value": "[委屈]",
                "picid": ""
            }, {
                "phrase": "[吐]",
                "type": "face",
                "url": "/assets/images/emojis/t_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/t_thumb.gif",
                "value": "[吐]",
                "picid": ""
            }, {
                "phrase": "[打哈欠]",
                "type": "face",
                "url": "/assets/images/emojis/k_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/k_thumb.gif",
                "value": "[打哈欠]",
                "picid": ""
            }, {
                "phrase": "[抱抱]",
                "type": "face",
                "url": "/assets/images/emojis/bba_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/bba_thumb.gif",
                "value": "[抱抱]",
                "picid": ""
            }, {
                "phrase": "[怒]",
                "type": "face",
                "url": "/assets/images/emojis/angrya_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/angrya_thumb.gif",
                "value": "[怒]",
                "picid": ""
            }, {
                "phrase": "[疑问]",
                "type": "face",
                "url": "/assets/images/emojis/yw_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/yw_thumb.gif",
                "value": "[疑问]",
                "picid": ""
            }, {
                "phrase": "[馋嘴]",
                "type": "face",
                "url": "/assets/images/emojis/cza_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/cza_thumb.gif",
                "value": "[馋嘴]",
                "picid": ""
            }, {
                "phrase": "[拜拜]",
                "type": "face",
                "url": "/assets/images/emojis/88_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/88_thumb.gif",
                "value": "[拜拜]",
                "picid": ""
            }, {
                "phrase": "[思考]",
                "type": "face",
                "url": "/assets/images/emojis/sk_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/sk_thumb.gif",
                "value": "[思考]",
                "picid": ""
            }, {
                "phrase": "[汗]",
                "type": "face",
                "url": "/assets/images/emojis/sweata_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/sweata_thumb.gif",
                "value": "[汗]",
                "picid": ""
            }, {
                "phrase": "[困]",
                "type": "face",
                "url": "/assets/images/emojis/sleepya_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/sleepya_thumb.gif",
                "value": "[困]",
                "picid": ""
            }, {
                "phrase": "[睡觉]",
                "type": "face",
                "url": "/assets/images/emojis/sleepa_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/sleepa_thumb.gif",
                "value": "[睡觉]",
                "picid": ""
            }, {
                "phrase": "[钱]",
                "type": "face",
                "url": "/assets/images/emojis/money_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/money_thumb.gif",
                "value": "[钱]",
                "picid": ""
            }, {
                "phrase": "[失望]",
                "type": "face",
                "url": "/assets/images/emojis/sw_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/sw_thumb.gif",
                "value": "[失望]",
                "picid": ""
            }, {
                "phrase": "[酷]",
                "type": "face",
                "url": "/assets/images/emojis/cool_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/cool_thumb.gif",
                "value": "[酷]",
                "picid": ""
            }, {
                "phrase": "[花心]",
                "type": "face",
                "url": "/assets/images/emojis/hsa_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/hsa_thumb.gif",
                "value": "[花心]",
                "picid": ""
            }, {
                "phrase": "[哼]",
                "type": "face",
                "url": "/assets/images/emojis/hatea_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/hatea_thumb.gif",
                "value": "[哼]",
                "picid": ""
            }, {
                "phrase": "[鼓掌]",
                "type": "face",
                "url": "/assets/images/emojis/gza_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/gza_thumb.gif",
                "value": "[鼓掌]",
                "picid": ""
            }, {
                "phrase": "[晕]",
                "type": "face",
                "url": "/assets/images/emojis/dizzya_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/dizzya_thumb.gif",
                "value": "[晕]",
                "picid": ""
            }, {
                "phrase": "[悲伤]",
                "type": "face",
                "url": "/assets/images/emojis/bs_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/bs_thumb.gif",
                "value": "[悲伤]",
                "picid": ""
            }, {
                "phrase": "[抓狂]",
                "type": "face",
                "url": "/assets/images/emojis/crazya_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/crazya_thumb.gif",
                "value": "[抓狂]",
                "picid": ""
            }, {
                "phrase": "[黑线]",
                "type": "face",
                "url": "/assets/images/emojis/h_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/h_thumb.gif",
                "value": "[黑线]",
                "picid": ""
            }, {
                "phrase": "[阴险]",
                "type": "face",
                "url": "/assets/images/emojis/yx_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/yx_thumb.gif",
                "value": "[阴险]",
                "picid": ""
            }, {
                "phrase": "[怒骂]",
                "type": "face",
                "url": "/assets/images/emojis/nm_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/nm_thumb.gif",
                "value": "[怒骂]",
                "picid": ""
            }, {
                "phrase": "[心]",
                "type": "face",
                "url": "/assets/images/emojis/hearta_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/hearta_thumb.gif",
                "value": "[心]",
                "picid": ""
            }, {
                "phrase": "[伤心]",
                "type": "face",
                "url": "/assets/images/emojis/unheart.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/unheart.gif",
                "value": "[伤心]",
                "picid": ""
            }, {
                "phrase": "[猪头]",
                "type": "face",
                "url": "/assets/images/emojis/pig.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/pig.gif",
                "value": "[猪头]",
                "picid": ""
            }, {
                "phrase": "[ok]",
                "type": "face",
                "url": "/assets/images/emojis/ok_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/ok_thumb.gif",
                "value": "[ok]",
                "picid": ""
            }, {
                "phrase": "[耶]",
                "type": "face",
                "url": "/assets/images/emojis/ye_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/ye_thumb.gif",
                "value": "[耶]",
                "picid": ""
            }, {
                "phrase": "[good]",
                "type": "face",
                "url": "/assets/images/emojis/good_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/good_thumb.gif",
                "value": "[good]",
                "picid": ""
            }, {
                "phrase": "[不要]",
                "type": "face",
                "url": "/assets/images/emojis/no_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/no_thumb.gif",
                "value": "[不要]",
                "picid": ""
            }, {
                "phrase": "[赞]",
                "type": "face",
                "url": "/assets/images/emojis/z2_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/z2_thumb.gif",
                "value": "[赞]",
                "picid": ""
            }, {
                "phrase": "[来]",
                "type": "face",
                "url": "/assets/images/emojis/come_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/come_thumb.gif",
                "value": "[来]",
                "picid": ""
            }, {
                "phrase": "[弱]",
                "type": "face",
                "url": "/assets/images/emojis/sad_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/sad_thumb.gif",
                "value": "[弱]",
                "picid": ""
            }, {
                "phrase": "[蜡烛]",
                "type": "face",
                "url": "/assets/images/emojis/lazu_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/lazu_thumb.gif",
                "value": "[蜡烛]",
                "picid": ""
            }, {
                "phrase": "[钟]",
                "type": "face",
                "url": "/assets/images/emojis/clock_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/clock_thumb.gif",
                "value": "[钟]",
                "picid": ""
            }, {
                "phrase": "[话筒]",
                "type": "face",
                "url": "/assets/images/emojis/m_org.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/m_thumb.gif",
                "value": "[话筒]",
                "picid": ""
            }, {
                "phrase": "[蛋糕]",
                "type": "face",
                "url": "/assets/images/emojis/cake.gif",
                "hot": false,
                "common": true,
                "category": "",
                "icon": "/assets/images/emojis/cake.gif",
                "value": "[蛋糕]",
                "picid": ""
            }];
        })


    app.lazy
        .service('emailData', function() {
            return [{
                'domain': 'qq.com',
                'url': 'http://mail.qq.com'
            }, {
                'domain': '163.com',
                'url': 'http://mail.163.com/'
            }, {
                'domain': 'sina.com',
                'url': 'http://mail.sina.com'
            }, {
                'domain': '126.com',
                'url': 'http://mail.126.com'
            }, {
                'domain': 'hotmail.com',
                'url': 'http://mail.hotmail.com'
            }, {
                'domain': 'sina.cn',
                'url': 'http://mail.sina.cn'
            }, {
                'domain': 'gmail.com',
                'url': 'http://mail.google.com'
            }, {
                'domain': 'sohu.com',
                'url': 'http://mail.sohu.com'
            }, {
                'domain': 'yahoo.com',
                'url': 'http://mail.yahoo.com'
            }, {
                'domain': '139.com',
                'url': 'http://mail.139.com'
            }, {
                'domain': '189.cn',
                'url': 'http://mail.189.cn'
            }];
        })
    app.lazy.service('at_route', function() {
        return {
            user: [{
                title: '基础信息',
                url: '/user-info'
            }, {
                title: '修改密码',
                url: '/modify-password'
            }, {
                title: '更换邮箱',
                url: '/modify-email'
            }, {
                title: '手机绑定',
                url: '/mobile-verify'
            }, {
                title: '修改头像',
                url: '/set-photo'
            }, {
                title: '用户资料',
                url: '/me'
            }],
            manage: [{
                title: '我的订单',
                url: '/buyer-order'
            }, {
                title: '发布商品',
                url: '/publish-goods'
            }, {
                title: '仓库商品',
                url: '/depot'
            }, {
                title: '在售商品',
                url: '/goods-list'
            }, {
                title: '平台订单',
                url: '/platform-order'
            }, {
                title: '收货地址管理',
                url: '/delivery-address'
            }, {
                title: '新建运费模版',
                url: '/postage'
            }, {
                title: '资金账户查询',
                url: '/fund-account'
            }, {
                title: '商家管理',
                url: '/seller-detail'
            }, {
                title: '商家信息',
                url: '/seller-center'
            }, {
                title: '添加商家',
                url: '/release-seller'
            }, {
                title: '商家订单',
                url: '/seller-order'
            }, {
                title: '商家商品',
                url: '/seller-goods-list'
            }, {
                title: '商家详情',
                url: '/seller-info'
            }, {
                title: '我的推广',
                url: '/spread/list'
            }],
            buyer: [{
                parent: {
                    title: '我的吾商',
                    url: '/buyer-center'
                },
                son: []
            }, {
                parent: {
                    title: '交易管理',
                    url: '/'
                },
                son: [{
                    title: '我的订单',
                    url: '/buyer-order'
                }, {
                    title: '我的推广',
                    url: '/spread/list'
                }, {
                    title: '获利交易',
                    url: '/buyer-rebate'
                }, {
                    title: '我的评价',
                    url: '/comment/list'
                }, {
                    title: '退款/退换货',
                    url: '/buyer-apply-list'
                }]
            }, {
                parent: {
                    title: '账户管理',
                    url: '/'
                },
                son: [{
                    title: '个人资料',
                    url: '/#/complement-buyer-info'
                }, {
                    title: '收货地址',
                    url: '/delivery-address'
                }, {
                    title: '账户安全',
                    url: '/account-security'
                }, {
                    title: '吾付通',
                    url: '/#'
                }, {
                    title: '商票',
                    url: '/#'
                }]
            }, {
                parent: {
                    title: '社区中心',
                    url: '/'
                },
                son: [{
                    title: '通用',
                    url: '/#'
                }, {
                    title: '隐私设置',
                    url: '/#'
                }, {
                    title: '黑名单',
                    url: '/#'
                }, {
                    title: '信息屏蔽',
                    url: '/#'
                }, {
                    title: '提醒设置',
                    url: '/#'
                }]
            }, {
                parent: {
                    title: '数据中心',
                    url: '/'
                },
                son: [{
                    title: '转化率',
                    url: '/#'
                }, {
                    title: ' 成交数据',
                    url: '/#'
                }]
            }],
            seller: [{
                parent: {
                    title: '我的销售',
                    url: '/seller-center'
                },
                son: []
            }, {
                parent: {
                    title: '交易管理',
                    url: '/'
                },
                son: [{
                    title: '在售商品',
                    url: '/seller-goods-list'
                }, {
                    title: '管理订单',
                    url: '/seller-order'
                }, {
                    title: '管理退货',
                    url: '/#'
                }, {
                    title: '销售统计',
                    url: '/#'
                }, {
                    title: '运费查询',
                    url: '/seller-postage'
                }]
            }, {
                parent: {
                    title: '账户管理',
                    url: '/'
                },
                son: [{
                    title: '账户信息',
                    url: '/seller-info'
                }, {
                    title: '结算信息',
                    url: '/#'
                }, {
                    title: '修改密码',
                    url: '/update-password'
                }]
            }],
            platform: [{
                parent: {
                    title: '我的平台',
                    url: '/platformer-center'
                },
                son: []
            }, {
                parent: {
                    title: '商品管理',
                    url: '/'
                },
                son: [{
                    title: '在售商品',
                    url: '/goods-list'
                }, {
                    title: '奖品库',
                    url: '/#'
                }, {
                    title: '仓库商品',
                    url: '/depot'
                }]
            }, {
                parent: {
                    title: '订单管理',
                    url: '/platform-order'
                },
                son: []
            }, {
                parent: {
                    title: '营销推广',
                    url: '/#'
                },
                son: [{
                    title: '营销数据',
                    url: '/#'
                }, {
                    title: '商品推广',
                    url: '/#'
                }]
            }, {
                parent: {
                    title: '商票交易数据',
                    url: '/#'
                },
                son: []
            }, {
                parent: {
                    title: '退换货管理',
                    url: '/#'
                },
                son: []
            }, {
                parent: {
                    title: '运费管理',
                    url: '/postage-list'
                },
                son: []
            }, {
                parent: {
                    title: '类目管理',
                    url: '/#'
                },
                son: []
            }, {
                parent: {
                    title: '会员管理',
                    url: '/#'
                },
                son: []
            }, {
                parent: {
                    title: '商家管理',
                    url: '/seller-detail'
                },
                son: []
            }, {
                parent: {
                    title: '资金管理',
                    url: '/#'
                },
                son: []
            }, {
                parent: {
                    title: '商票购设置',
                    url: '/#'
                },
                son: []
            }, {
                parent: {
                    title: '权限设置',
                    url: '/#'
                },
                son: [{
                    title: '授权登录IP',
                    url: '/#'
                }, {
                    title: '权限管理',
                    url: '/#'
                }, {
                    title: '登录帐号管理',
                    url: '/#'
                }]
            }, {
                parent: {
                    title: '操作日志',
                    url: '/#'
                },
                son: []
            }]
        }
    })
    // app.lazy.factory('OAuth', ['$resource', '$q', '$rootScope', 'cks',
    //     function($resource, $q, $rootScope, cks) {

    //         var logout = $resource('/restful/rest/auth/logout');
    //         var userInfo = $resource('/restful/rest/buyer/brief');
    //         var sellerUserInfo = $resource('/restful/rest/seller/brief');
    //         var adminUserInfo = $resource('/restful/rest/admin/brief');

    //         var user = {};

    //         user.sellerUserInfo = function() {
    //             return sellerUserInfo.get().$promise;
    //         }
    //         user.adminUserInfo = function() {
    //             return adminUserInfo.get().$promise;
    //         }

    //         user.userInfo = function() {
    //             return userInfo.get().$promise;
    //         }


    //         user.logout = function() {
    //             return logout.get().$promise;
    //         }

    //         return user;

    //     }
    // ])
    app.lazy.factory('cks', ['$cookieStore', '$cookies',
        function($cookieStore, $cookies) {
            return {
                set: function(args) {
                    angular.forEach(args, function(value, key) {

                        $cookies[key] = value;

                    });
                },
                get: function(args) {
                    return $cookieStore.get(args);
                },
                remove: function() {
                    angular.forEach($cookies, function(value, key) {
                        delete $cookies[key];
                    });
                }
            }
        }
    ])
    app.lazy.factory('loadCss',
        function() {
            return function(file) {
                var head = document.getElementsByTagName('head').item(0);
                var css = document.createElement('link');
                css.href = file;
                css.rel = 'stylesheet';
                css.type = 'text/css';
                head.appendChild(css);
            }
        })
    app.lazy.factory('unique',
        function() {
            return function(arr) {
                var ret = []
                var hash = {}
                for (var i = 0; i < arr.length; i++) {
                    var item = arr[i]
                    var key = typeof(item) + item
                    if (hash[key] !== 1) {
                        ret.push(item)
                        hash[key] = 1
                    }
                }
                return ret;
            }
        })
    app.lazy.factory('cycles', [function () {
        var dates=[];
        var cyc=function(by, bm, ny, nm, nd,unsettleCycle) {
            //开始的年份by，月份bm，现在的年份ny，月份nm，日分nd，未结算的周期
            //周期列表的生成
            //开始时间
            /*var val=Date.parse('20140211');*/
            //如果开始年份少于当前年份
            if (by <= ny) {
                var bd = {};
                //得到开始时间
                var beginTime = "";
                //设置结束时间
                var endTime = "";
                //年份
                var year = "";
                //月份
                var month = "";
                //设置开始时间
                beginTime = bm < 10 ? by + "0" + bm + "11" : by + "" + bm + "11";
                //如果年份为当前年份，并且月份为当前月份并且日期少于11，结束
                //如果年份为当前年份，月份大于当前月份，结束
                if ((by == ny && bm == nm&&nd<11)||(by == ny && bm > nm)) {
                    return dates;
                }
                //如果月份少于12月，直接给月份加一
                if (bm < 12) {
                    endTime = bm < 9 ? by + "0" + (bm + 1) + "10" : by + "" + (bm + 1) + "10";
                    year = by;
                    month = bm + 1;
                } else {
                    //如果开始年份等于当前年份
                    if ((by + 1) == ny) {
                        //如果当前月份为1月
                        if (nm == 1) {
                            endTime = (by + 1) + "01" + "10";
                            year = by + 1;
                            month = 1;
                        } else {
                            if ((bm+1) == nm && nd < 11) {
                                return dates;
                            }
                            endTime = (by + 1) + "01" + "10";
                            year = by + 1;
                            month = 1;
                        }
                    } else {
                        //如果月份等于12月，年份加一，月份设置为一月
                        endTime = (by + 1) + "01" + "10";
                        year = by + 1;
                        month = 1;
                    }
                }
                // bd.beginDate = new Date(beginTime.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1/$2/$3"));
                // bd.endDate = new Date(endTime.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1/$2/$3"));
                //周期的开始时间
                var beginDate = new Date(beginTime.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1/$2/$3"));
                //周期的结束时间
                var endDate = new Date(endTime.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1/$2/$3"));
                bd.beginTime=bm<10?by+"0"+bm:by+""+bm;
                bd.date=beginDate.toLocaleDateString()+"-"+endDate.toLocaleDateString();
                bd.ends=endDate.getTime();
                angular.forEach(unsettleCycle, function(cyc,key){
                    if(bd.beginTime==cyc){
                        bd.date=bd.date+"（未结）";
                        //如果当前的时间大月这一周期的最后一天
                        //得到当前的时间
                        var nowDay=nd<=9?"0"+nd:""+nd;
                        var nowTime=nm < 9 ? ny + "0" + nm + nowDay : (nm==9?by + "0" + nm + nowDay:by + "" + nm + nowDay);
                        //得到当前的时间戳
                        var n=new Date(nowTime.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1/$2/$3")).getTime();
                        //得到结束时间的时间戳
                        var e=endDate.getTime();
                        //结束时间少于当前时间，将结算按钮可用
                        if(e<n){
                            //表示可用结算结算
                            bd.isSettle=true;
                        }
                    }
                })
                bd.beginDate=beginDate.getTime();
                dates.push(bd);
                cyc(year, month, ny, nm, nd,unsettleCycle);
            }
        }
        return function(by, bm, ny, nm, nd,unsettleCycle){
            dates=[];
            cyc(by, bm, ny, nm, nd,unsettleCycle);
            return dates;
        }
    }])
    app.lazy.factory('spreadCycles', [function () {
        var dates=[];
        var cyc=function(by, bm, ny, nm) {
            //开始的年份by，月份bm，现在的年份ny，月份nm
            //周期列表的生成
            //开始时间
            /*var val=Date.parse('20140211');*/
            //如果开始年份少于当前年份
            if (by <= ny) {
                var bd = {};
                //得到开始时间
                var beginTime = "";
                //设置结束时间
                var endTime = "";
                //年份
                var year = "";
                //月份
                var month = "";
                //设置开始时间
                beginTime = bm < 10 ? by + "0" + bm : by + "" + bm;
                //如果年份为当前年份，并且月份为当前月份并且日期少于11，结束
                //如果年份为当前年份，月份大于当前月份，结束
                if ((by == ny && bm == nm)||(by == ny && bm > nm)) {
                    return dates;
                }
                //如果月份少于12月，直接给月份加一
                if (bm < 12) {
                    endTime = bm < 9 ? by + "0" + (bm + 1): by + "" + (bm + 1);
                    year = by;
                    month = bm + 1;
                } else {
                    //如果开始年份等于当前年份
                    if ((by + 1) == ny) {
                        //如果当前月份为1月
                        if (nm == 1) {
                            endTime = (by + 1) + "01";
                            year = by + 1;
                            month = 1;
                        } else {
                            if ((bm+1) == nm) {
                                return dates;
                            }
                            endTime = (by + 1) + "01";
                            year = by + 1;
                            month = 1;
                        }
                    } else {
                        //如果月份等于12月，年份加一，月份设置为一月
                        endTime = (by + 1) + "01";
                        year = by + 1;
                        month = 1;
                    }
                }
                // bd.beginDate = new Date(beginTime.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1/$2/$3"));
                // bd.endDate = new Date(endTime.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1/$2/$3"));
                //周期的开始时间
                //var beginDate = new Date(beginTime.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1/$2/$3"));
                //周期的结束时间
                //var endDate = new Date(endTime.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1/$2/$3"));
                bd.beginTime=beginTime.substr(0,4)+"-"+beginTime.substr(4,5);
                bd.endTime=endTime.substr(0,4)+"-"+endTime.substr(4,5);
                bd.date=bd.beginTime+" 至 "+bd.endTime;
                dates.push(bd);
                cyc(year, month, ny, nm);
            }
        }
        return function(by, bm, ny, nm){
            dates=[];
            cyc(by, bm, ny, nm);
            return dates;
        }
    }])
    // .factory('getAddrById', ['$q',
    //     function($q) {
    //         return function(id) {
    //             var def = $q.defer();

    //             require(['json!src/lib/CITY.json'], function(CITY) {
    //                 var s = [];
    //                 var a = CITY[id];
    //                 var c = CITY[a[1]];
    //                 var p = CITY[c[1]];

    //                 var obj ={};
    //                 obj[id] = a;
    //                 s.unshift(obj);

    //                 if (c[1] == '1') {
    //                     s.unshift({0:[]});
    //                     obj ={};
    //                     obj[a[1]] = c;
    //                     s.unshift(obj);
    //                 } else {
    //                     obj ={};
    //                     obj[a[1]] = c;
    //                     s.unshift(obj);
    //                     obj ={};
    //                     obj[c[1]] = p;
    //                     s.unshift(obj);
    //                 }

    //                 def.resolve(s);
    //             })

    //             return def.promise;
    //         }
    //     }
    // ])
    app.lazy.factory('getAddrById', ['$q',
        function($q) {
            return function(id) {
                var def = $q.defer();

                require(['json!atmanlib-lib/CITY.json'], function(CITY) {
                    var s = {
                        p: [undefined, ''],
                        c: [undefined, ''],
                        a: [undefined, '']
                    };
                    if(id){
                        var aId = CITY[id];
                        var cId = CITY[aId[1]];
                        var pId = CITY[cId[1]];

                        s['a'] = [id + '', aId[0]];

                        if (cId[1] == '1') {
                            s['p'] = [aId[1] + '', cId[0]];
                        } else {
                            s['c'] = [aId[1] + '', cId[0]];
                            s['p'] = [cId[1] + '', pId[0]];
                        }
                    }

                    def.resolve(s);
                })
                return def.promise;
            }
        }
    ])
    // .factory('getAddrById', ['$q',
    //     function($q) {
    //         // /[1-9]{2}0000$/.test('110000') //省_
    //         // /[1-9]{2}([1-9]{1}[0-9]{1}|[0-9]{1}[1-9]{1})00$/.test('111100') //市
    //         // /[1-9]{2}([1-9]{1}[0-9]{1}|[0-9]{1}[1-9]{1})([1-9]{1}[0-9]{1}|[0-9]{1}[1-9]{1})$/.test('111110') //区
    //         return function(id) {
    //             var def = $q.defer();
    //             require(['json!src/lib/CITY.json'], function(CITY) {
    //                 var s = {
    //                     p: [0, ''],
    //                     c: [0, ''],
    //                     a: [0, '']
    //                 };

    //                 if (/[1-9]{2}([1-9]{1}[0-9]{1}|[0-9]{1}[1-9]{1})([1-9]{1}[0-9]{1}|[0-9]{1}[1-9]{1})$/.test(id)) {
    //                     angular.forEach(CITY, function(a, iii) {
    //                         if (iii == id) {
    //                             // var obj = {};
    //                             // obj[iii] = a[0];
    //                             //s.unshift(obj);
    //                             s['a'] = [iii, a[0]];
    //                             if (/[1-9]{2}([1-9]{1}[0-9]{1}|[0-9]{1}[1-9]{1})00$/.test(a[1])) {
    //                                 angular.forEach(CITY, function(c, ii) {
    //                                     if (a[1] == ii) {
    //                                         // var obj = {};
    //                                         // obj[ii] = c[0];
    //                                         // s.unshift(obj);
    //                                         s['c'] = [ii, c[0]];
    //                                         angular.forEach(CITY, function(p, i) {
    //                                             if (c[1] == i) {
    //                                                 // var obj = {};
    //                                                 // obj[i] = p[0];
    //                                                 // s.unshift(obj);
    //                                                 s['p'] = [i, p[0]];
    //                                             }
    //                                         })
    //                                     }
    //                                 })
    //                             } else if (/[1-9]{2}0000$/.test(a[1])) {
    //                                 angular.forEach(CITY, function(p, i) {
    //                                     if (a[1] == i) {
    //                                         // var obj = {};
    //                                         // obj[i] = p[0];
    //                                         // s.unshift(obj);
    //                                         s['p'] = [i, p[0]];
    //                                     }
    //                                 })
    //                             }
    //                         }
    //                     })
    //                 }
    //                 if (/[1-9]{2}([1-9]{1}[0-9]{1}|[0-9]{1}[1-9]{1})00$/.test(id)) {
    //                     angular.forEach(CITY, function(c, ii) {
    //                         if (id == ii) {
    //                             // var obj = {};
    //                             // obj[ii] = c[0];
    //                             // s.unshift(obj);
    //                             s['c'] = [ii, c[0]];
    //                             angular.forEach(CITY, function(p, i) {
    //                                 if (c[1] == i) {
    //                                     // var obj = {};
    //                                     // obj[i] = p[0];
    //                                     // s.unshift(obj);
    //                                     s['p'] = [i, p[0]];
    //                                 }
    //                             })
    //                         }
    //                     })
    //                 }
    //                 if (/[1-9]{2}0000$/.test(id)) {
    //                     // var obj = {};
    //                     // obj[i] = CITY[id][0];
    //                     // s.unshift(obj);
    //                     s['p'] = [id, p[0]];
    //                 }

    //                 def.resolve(s);
    //             })
    //             return def.promise;
    //         }
    //     }
    // ])
});