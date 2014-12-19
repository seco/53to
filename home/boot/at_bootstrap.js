//at_bootstrap.js
//window.UMEDITOR_HOME_URL = "/atmanlib/vendor/bower_components/ueditor_mini/";
window.UEDITOR_HOME_URL = "/atmanlib/vendor/bower_components/ueditor/";
require.config({
    paths: {
        text: "/atmanlib/vendor/bower_components/requirejs-text/text",
        json: "/atmanlib/vendor/bower_components/requirejs-plugins/src/json",
        es5: "/atmanlib/vendor/bower_components/es5-shim/es5-shim.min",
        bower: "/atmanlib/vendor/bower_components",
        bootstrap: "/atmanlib/vendor/bower_components/bootstrap/dist/js/bootstrap.min",
        "load-image": "/atmanlib/vendor/bower_components/blueimp-load-image/js/load-image",
        "load-image-ios": "/atmanlib/vendor/bower_components/blueimp-load-image/js/load-image-ios",
        "load-image-meta": "/atmanlib/vendor/bower_components/blueimp-load-image/js/load-image-meta",
        "load-image-exif": "/atmanlib/vendor/bower_components/blueimp-load-image/js/load-image-exif",
        "canvas-to-blob": "/atmanlib/vendor/bower_components/blueimp-canvas-to-blob/js/canvas-to-blob.min",
        jquery: "/atmanlib/vendor/bower_components/jquery/dist/jquery.min",
        'jquery.lazyload': "/atmanlib/vendor/bower_components/jquery.lazyload/jquery.lazyload.min",
        "jquery.ui.widget": "/atmanlib/vendor/bower_components/blueimp-file-upload/js/vendor/jquery.ui.widget",
        angular: "/atmanlib/vendor/bower_components/angular/angular.min",
        "ng-route": "/atmanlib/vendor/bower_components/angular-route/angular-route.min",
        "ng-resource": "/atmanlib/vendor/bower_components/angular-resource/angular-resource.min",
        "ng-cookies": "/atmanlib/vendor/bower_components/angular-cookies/angular-cookies.min",
        "ng-sanitize": "/atmanlib/vendor/bower_components/angular-sanitize/angular-sanitize.min",
        "ng-animate": "/atmanlib/vendor/bower_components/angular-animate/angular-animate.min",
        "ng-touch": "/atmanlib/vendor/bower_components/angular-touch/angular-touch.min",
        "bindonce": "/atmanlib/vendor/bower_components/angular-bindonce/bindonce.min",
        "datepicker": "/atmanlib/vendor/bower_components/datetimepicker/bootstrap-datetimepicker",
        "datepicker-zh-CN": "/atmanlib/vendor/bower_components/datetimepicker/locales/bootstrap-datetimepicker.zh-CN",
        "highcharts": "/atmanlib/vendor/bower_components/highcharts/highcharts",
        "highcharts-noData-toDispaly": "/atmanlib/vendor/bower_components/highcharts/js/modules/no-data-to-display.src",
        "timeCountdownTool":"/atmanlib/vendor/bower_components/countdown/jquery.countdown",

        "at_app": "at_app",
        "at_root_ctrl": "at_root_ctrl",
        "all":"/all",
        "at-datepicker": "/src/directives/at_datepicker",

        "common-ctrl": "/common/controller",
        "service": "/common/service",
        "directive-common": "/common/directive/common",
        "directive": "/common/directive",
        "filter": "/common/filter",

        "atmanlib-lib": "/atmanlib/lib",
        "atmanlib-provider": "/atmanlib/provider",

        "home-ctrl": "/home/controller",
        "manage-ctrl": "/manage/controller",
        "register-ctrl": "/register/controller",
        "trade-ctrl": "/trade/controller"
    },
    shim: {
        angular: ["jquery"],
        "ng-route": ["angular"],
        "ng-resource": ["angular"],
        "ng-cookies": ["angular"],
        "ng-sanitize": ["angular"],
        "ng-animate": ["angular"],
        "ng-touch": ["angular"],
        "bindonce": ["angular"],
        "jquery.lazyload": ["jquery"],
        bootstrap: ["jquery"],
        at_app: ["angular", "ng-route", "ng-resource", "ng-cookies", "ng-sanitize", "ng-animate", "ng-touch", "bindonce"],
        at_root_ctrl: ["at_app"],

        //"all/home-templates": ['at_app'],
        //"all/home-directive": ['at_app'],
        //'all/home-ctrl': ['at_app'],
        //"all/controller": ['at_app'],
        //"all/service": ['at_app'],
        //"all/filter": ['at_app'],
        //"all/directive": ['at_app'],

        datepicker: ["jquery"],
        "datepicker-zh-CN": ["datepicker"],
        "at-datepicker": ["datepicker-zh-CN"],
        "common-ctrl/weibo/at.weibo.input.ctrl": ["bower/caret.js/dist/jquery.caret.min", "bower/At.js/dist/js/jquery.atwho.min"],
        "common-ctrl/weibo/at.weibo.comment.input.ctrl": ["bower/caret.js/dist/jquery.caret.min", "bower/At.js/dist/js/jquery.atwho.min"],
        "highcharts-noData-toDispaly": ["highcharts"],
        "timeCountdownTool":["jquery"]
    }
});
require("bootstrap at_root_ctrl ".split(" "), function() {
    angular.bootstrap(document, ["atApp"])
});