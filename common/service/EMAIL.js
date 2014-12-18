'use strict';
define('service/EMAIL',['at_app'], function(app) {
    app.lazy.service('EMAIL',
        function() {
            return {
                'atman.com': ['凹凸曼', 'http://mail.atman.com'],
                'qq.com': ['腾讯', 'http://mail.qq.com'],
                '163.com': ['网易', 'http://email.163.com'],
                'sina.com': ['新浪', 'http://mail.sina.com'],
                'sina.cn': ['新浪', 'http://mail.sina.cn'],
                '126.com': ['网易', 'http://email.126.com'],
                'hotmail.com': ['微软', 'http://mail.hotmail.com'],
                'live.cn': ['微软', 'http://mail.live.cn'],
                'gmail.com': ['谷歌', 'http://mail.gmail.com'],
                'sohu.com': ['搜狐', 'http://mail.sohu.com'],
                'yahoo.com': ['雅虎', 'http://mail.yahoo.com']
            }
            // return {
            //     '@atman.com': ['凹凸曼', 'http://mail.atman.com'],
            //     '@qq.com': ['腾讯', 'http://mail.qq.com'],
            //     '@163.com': ['网易', 'http://email.163.com'],
            //     '@sina.com': ['新浪', 'http://mail.sina.com'],
            //     '@sina.cn': ['新浪', 'http://mail.sina.cn'],
            //     '@126.com': ['网易', 'http://email.126.com'],
            //     '@hotmail.com': ['微软', 'http://mail.hotmail.com'],
            //     '@live.cn': ['微软', 'http://mail.live.cn'],
            //     '@gmail.com': ['谷歌', 'http://mail.gmail.com'],
            //     '@sohu.com': ['搜狐', 'http://mail.sohu.com'],
            //     '@yahoo.com': ['雅虎', 'http://mail.yahoo.com']
            // }
        }
    )
})