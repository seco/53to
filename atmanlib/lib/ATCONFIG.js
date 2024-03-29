define('atmanlib-lib/ATCONFIG',{
    "NavMap": {
        //买家导航
        "/buyer-center": ["buyer-center", "0"],
        "/buyer-order": ["buyer-order", "2"],
        "/spread-order/:orderId/last/:page*": ["buyer-spread", "3"],
        "/spread/list": ["buyer-spread", "3"],
        "/spread/list/:id": ["buyer-spread", "2"],
        "/spread-order/:orderId/:orderGoodsId/last/:page*": ["buyer-spread", "3"],
        "/spread-detail/:orderGoodsId": ["buyer-spread", "3"],
        "/buyer-rebate": ["buyer-rebate", "4"],
        "/comment-list": ["buyer-comment", "5"],
        "/comment-list/:orderId": ["buyer-comment", "5"],
        "/buyer-apply-list": ["buyer-aftersale", "6"],
        "/buyer-apply/:id": ["buyer-aftersale", "6"],
        "/buyer-order-list": ["buyer-aftersale", "6"],
        "/buyer-apply-detail/:id": ["buyer-aftersale", "6"],
        "/contact-after-sale": ["buyer-aftersale", "6"],
        "/buyer-info": ["buyer-info", "8"],
        "/delivery-address": ["delivery-address", "9"],
        "/account-security": ["account-security", "10"],
        "/mobile/last/:page*": ["account-security", "10"],
        "/nickname/last/:page*": ["account-security", "10"],
        "/password/last/:page*": ["account-security", "10"],
        "/buyer-fund-account": ["buyer-fund-account", "11"],
        "/stock-center/gainItem": ["stock-center", "12"],
        //平台导航
        "/platformer-center": ["platform-center", "0"],
        "/platform-static": ["platform-static", "1"],
        "/goods-list/:param": ["goods-management", "2"],
        "/publish-goods": ["goods-management", "2"],
        "/goods-promotion": ["goods-management", "2"],
        "/confirm-cancel-promotion/:id": ["goods-management", "2"],
        "/prize-list": ["prize-list", "3"],
        "/depot": ["depot", "4"],
        "/platform-order": ["platform-order", "5"],
        /*"/foo1": ["foo1", "7"],
         "/foo2": ["foo2", "8"],
         "/foo3": ["foo3", "9"],
         "/platform-apply-list": ["platform-aftersale", "10"],
         "/platform-apply-detail/:id": ["platform-aftersale", "10"],
         "/postage-list": ["postage-management", "12"],
         "/postage-template": ["postage-management", "12"],
         "/postage-template/:id": ["postage-management", "12"],
         "/postage-detail/:id": ["postage-management", "12"],
         "/postage-sf": ["postage-management", "13"],
         "/foo4": ["foo4", "14"],
         "/user-list": ["user-management", "15"],
         "/user-detail/:id": ["user-management", "15"],
         "/seller-detail": ["seller-management", "16"],
         "/platform-manages": ["fund-management", "17"],
         "/stock-config": ["stock-config", "18"],
         "/allow-ip":["allow-ip","20"],
         "/authority-manage":["authority-manage","21"],
         "/admin-user": ["admin-user", "22"],*/
        "/platform-apply-list": ["platform-aftersale", "6"],
        "/platform-apply-detail/:id": ["platform-aftersale", "6"],
        "/postage-list": ["postage-management", "7"],
        "/postage-template": ["postage-management", "7"],
        "/postage-template/:id": ["postage-management", "7"],
        "/postage-detail/:id": ["postage-management", "7"],
        "/postage-list": ["postage-list", "8"],
        "/postage-sf": ["postage-management", "9"],
        "/user-list": ["user-management", "10"],
        "/user-detail/:id": ["user-management", "10"],
        "/seller-detail": ["seller-management", "11"],
        "/platform-manages": ["fund-management", "12"],
        "/stock-config": ["stock-config", "13"],
        "/allow-ip":["allow-ip","15"],
        "/authority-manage":["authority-manage","16"],
        "/admin-user": ["admin-user", "17"],
        "/as-task": ["as-task", "19"],
        //商家导航
        "/seller-center": ["seller-center", "0"],
        "/seller-goods-list": ["seller-goods-management", "2"],
        "/seller-order": ["seller-order", "3"],
        "/seller-apply-list": ["seller-aftersale", "4"],
        "/seller-apply-detail/:id": ["seller-aftersale", "4"],
        "/foo5": ["foo5", "5"],
        "/seller-postage": ["seller-postage", "6"],
        "/seller-info": ["seller-info", "8"],
        "/seller-settle-accounts-detail": ["seller-settle", "9"],
        "/update-password": ["update-password", "10"],
        //微博导航
        "/comment": ["comment", "1"],
        "/at-my": ["at-my", "2"],
        "/my-fans": ["my-fans", "4"],
        "/my-follow": ["my-follow", "5"],
        "/my-message": ["my-message", "3"],
        "/message-history/:uid/:buyerId/:uname": ["my-message", "3"]
    },
    "IconSize": {
        'tiny': '80',
        'small': '100',
        'middle': '400',
        'large': '600',
        'huge': '800'
    },
    "headTemplate": "/common/template/header.tpl.html",
    "footTemplate": "/common/template/footer.tpl.html"
});