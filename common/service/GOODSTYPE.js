'use strict';
define('service/GOODSTYPE',['at_app'], function(app) {
app.lazy.service('GOODSTYPE',
    function() {
        return {
            '0': ['全品类', '-1', 'quan pin'],
            '1': ['电器', '0', 'dian qi'],
            '2': ['服装', '0', 'fu zhuang'],
            '101': ['彩电', '1', 'cai dian'],
            '102': ['冰箱', '1', 'bing xiang'],
            '103': ['空调', '1', 'kong tiao'],
            '104': ['洗衣机', '1', 'xi yi ji'],
            '105': ['热水器', '1', 're shui qi'],
            '201': ['毛衣', '2', 'mao yi'],
            '202': ['皮衣', '2', 'pi yi'],
            '203': ['裤子', '2', 'ku zi']
        }
    }
);
})