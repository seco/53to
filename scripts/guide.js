/**
 * Created by Administrator on 14-7-23.
 */
var dh = 0;
var animating = false;
var slideIndex = 1;
$(function(){
    dh = $(window).height();
    if(dh < 600){
        dh = 600;
    }
    else if(dh > 800){
        dh = 800;
    }
    $(".guide-item").css("height", dh);
    $(".item-inner").css("height", dh);
    if (document.addEventListener) {
        document.addEventListener('DOMMouseScroll', windowScroll, false);
    }
    window.onmousewheel = document.onmousewheel = windowScroll;
    $("#next-step").click(function(){
        slideDown();
    });
});
function windowScroll(e){
    if(!animating){
        e = e || window.event;
        var direct = 0;
        if(e.wheelDelta && e.wheelDelta > 0){
            direct = 1;
        }
        else if(e.detail && e.detail > 0){
            direct = 1;
        }
        var gc = $("#guide-container");
        var mgt = parseInt(gc.css("margin-top"));
        if(direct == 0){
            slideDown();
        }
        else if(direct == 1 && mgt < 0){
            animating = true;
            slideIndex--;
            $("#next-step").fadeOut();
            gc.animate({"margin-top": mgt + dh}, 1000, function(){
                initPage();
                animating = false;
                $("#next-step").fadeIn();
            });
        }
    }
    return false;
}

function slideDown(){
    var gc = $("#guide-container");
    var mgt = parseInt(gc.css("margin-top"));
    if(mgt > (0 - (dh * 10))){
        slideIndex++;
        animating = true;
        $("#next-step").fadeOut();
        if(slideIndex == 3){
            item3Animate();
        }
        else if(slideIndex == 4){
            item4Animate();
        }
        else if(slideIndex == 6){
            item6Animate();
        }
        gc.animate({"margin-top": mgt - dh}, 1000, function(){
            initPage();
            if(slideIndex == 2){
                item2Animate();
            }
            else if(slideIndex == 3){
                item3Animate();
            }
            else if(slideIndex == 5){
                item5Animate();
            }
            else if(slideIndex == 7){
                item7Animate();
            }
            else if(slideIndex == 8){
                item8Animate();
            }
            else if(slideIndex == 9){
                item9Animate();
            }
            else if(slideIndex == 10){
                item10Animate();
            }
            else if(slideIndex == 11){
                item11Animate();
            }
        });
    }
}

function stopAnimating(){
    animating = false;
    $("#next-step").fadeIn();
}

function initPage(){
    var page = $("#page");
    page.children(".active").removeClass("active");
    page.children("div:eq(" + (slideIndex - 1) + ")").addClass("active");

}

function item2Animate(){
    var goodsListAnimate = function(){
        var gl = $("#goods-list");
        gl.show().animate({width: 445, height: 218}, 600, function(){
            stopAnimating();
        });
    };
    var searchAnimate = function(){
        var search02 = $("#search-02");
        search02.fadeIn(500, function(){
            search02.animate({right: 400}, 1000, function(){
                search02.children(".search-text").html("小家电").fadeIn(function(){
                    search02.animate({width: 153, height: 30, bottom: 460, right: 150}, 1000);
                    goodsListAnimate();
                });
            })
        });
    };
    var wd02 = $("#word-02");
    if(wd02.is(":hidden")){
        wd02.show().animate({bottom: 560, opacity: 1}, 1000);
        searchAnimate();
    }
    else {
        stopAnimating();
    }
}

function item3Animate(){
    var cleaner03 = $("#cleaner-03");
    if(cleaner03.is(":hidden")){
        var cover = $("#cover-02");
        cover.show();
        cleaner03.css({bottom: dh + 341}).show().animate({width: 198, height: 168, bottom: 234, right: 450}, 1000, function(){
            setTimeout(function(){
                $("#addcart-02").show();
                stopAnimating();
            }, 1000);
        });
    }
    else{
        setTimeout(function(){
            stopAnimating();
        }, 1000);
    }
}

function item4Animate(){
    var word01 = $("#word-04-01");
    var word02 = $("#word-04-02");
    var cleaner04 = $("#cleaner-04");
    var cart04 = $("#cart-04");
    var delivery = $("#delivery");
    var deliveryAddress = $("#delivery-address");
    var deliveryAnimate = function(){
        word01.fadeOut(function(){
            word02.fadeIn(function(){
                delivery.fadeIn(function(){
                    deliveryAddress.fadeIn(function(){
                        stopAnimating();
                    });
                });
            });
        });
    };
    var cartAnimate = function(){
        cleaner04.animate({right: -800}, 1500, function(){
            cleaner04.fadeOut(function(){
                deliveryAnimate();
            });
        });
        cart04.animate({right: -800}, 1500, function(){
            cart04.fadeOut();
        });
    };
    if(deliveryAddress.is(":hidden")){
        word01.fadeIn();
        var cover = $("#cover-03");
        cover.show();
        cleaner04.css({bottom: dh + 206}).show().animate({bottom: 240, right: 290}, 1000, function(){
            cartAnimate();
        });
    }
    else{
        setTimeout(function(){
            stopAnimating();
        }, 1000);
    }
}

function item5Animate(){
    var hand05 = $("#hand-05");
    var cleaner05 = $("#cleaner-05");
    var receipt = $("#receipt-05");
    if(hand05.is(":hidden")){
        hand05.show().animate({bottom: 0}, 1000, function(){
            $("#mouse-05-2").show();
            cleaner05.show().animate({bottom: 120}, 1000, function(){
                receipt.show().animate({bottom: 378}, 1000, function(){
                    stopAnimating();
                });
            });
        });
    }
    else{
        stopAnimating();
    }
}

function item6Animate(){
    var cleaner05 = $("#cleaner-05");
    var box06 = $("#box-06");
    var cleaner06 = $("#cleaner-06");
    var receipt = $("#receipt-05");
    var bg06 = $("#item-06-bg");
    var courier06 = $("#courier-06");
    var girl06 = $("#girl-06");
    var door06 = $("#door-06");
    var word01 = $("#word-06-01");
    var word02 = $("#word-06-02");
    var address01 = $("#address-01");
    var address02 = $("#address-02");
    var popTalk = $("#pop-talk");
    if(box06.is(":hidden")){
        box06.show().animate({left: 150}, 1000, function(){
            box06.animate({left: 50, bottom: 20}, 500, function(){
                //animating = false;
            });
        });
        cleaner05.hide();
        cleaner06.css("bottom", dh + 120).show().animate({left: 180, bottom: 450, width: 60, height: 53}, 1000, function(){
            cleaner06.animate({left: 80, bottom: 20}, 500, function(){
                word01.animate({left: -50}, 500, function(){
                    word01.fadeOut();
                });
                address01.show();
                setTimeout(function(){
                    address01.hide();
                }, 1000);
                bg06.animate({left: -1500}, 2000, function(){
                    word02.fadeIn();
                    address02.show();
                    courier06.show().animate({height: 293, width: 168, bottom: 116}, 800, function(){
                        courier06.animate({left: 350}, 1000, function(){
                            popTalk.fadeIn();
                        });
                        door06.show();
                        girl06.show().animate({right: 200, height: 246}, 1000);
                    });
                    stopAnimating();
                });
            });
        });
    }
    else{
        setTimeout(function(){
            stopAnimating();
        }, 1000);
    }
}

function item7Animate(){
    var star01 = $("#star-07-01");
    var star02 = $("#star-07-02");
    var star03 = $("#star-07-03");
    var star04 = $("#star-07-04");
    var star05 = $("#star-07-05");
    var word01 = $("#word-07-01");
    var word02 = $("#word-07-02");
    var showWord = function(){
        word01.fadeIn(500, function(){
            word02.fadeIn(function(){
                stopAnimating();
            });
        });
    };
    if(star01.is(":hidden")){
        star01.fadeIn(300, function(){
            star02.fadeIn(300, function(){
                star03.fadeIn(300, function(){
                    star04.fadeIn(300, function(){
                        star05.fadeIn(300, function(){
                            showWord();
                        });
                    });
                });
            });
        });
    }
    else{
        stopAnimating();
    }
}

function item8Animate(){
    var girl08 = $("#girl-08");
    var screen = $("#screen");
    var coins = $("#coins");
    if(girl08.is(":hidden")){
        girl08.fadeIn(500, function(){
            screen.fadeIn(300, function(){
                coins.show().animate({bottom: -215}, 2000, function(){
                    coins.hide();
                    stopAnimating();
                });
            });
        });
    }
    else{
        stopAnimating();
    }
}

function item9Animate(){
    var pop01 = $("#pop-09-01");
    var plus = $("#plus");
    var pop02 = $("#pop-09-02");
    var favor = $("#favor");
    if(pop01.is(":hidden")){
        pop01.fadeIn(500, function(){
            plus.fadeIn(500, function(){
                pop02.fadeIn(function(){
                    favor.fadeIn(function(){
                        stopAnimating();
                    });
                });
            });
        });
    }
    else{
        stopAnimating();
    }
}

function sevenYearsBonusChart(){
    $("#chart").highcharts({
        title: {
            text: '年化收益 (%)',
            x: -10, //center
            style: {
                color: '#666',
                'font-size': '12px',
                'font-weight': '500',
                'font-family': 'Microsoft YaHei'
            }
        },
        subtitle: {
            text: '',
            x: -20
        },
        xAxis: {
            categories: ['7-11', '7-12', '7-13', '7-14', '7-15', '7-16', '7-17']
        },
        yAxis: {
            title: {
                text: ''
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#000'
            }]
        },
        tooltip: {
            valueSuffix: '%'
        },
        legend: {
            enabled: false,
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            borderWidth: 0
        },
        series: [{
            name: "",
            data: [4.86, 5.02, 5.48, 5.32, 6.08, 5.80, 6.02]
        }],
        credits: {
            enabled: false
        }
    });
}

function item10Animate(){
    var word10 = $("#word-10");
    var pop01 = $("#pop-10-01");
    var pop02 = $("#pop-10-02");
    if(word10.is(":hidden")){
        word10.fadeIn(500, function(){
            pop01.fadeIn(500, function(){
                pop02.fadeIn(function(){
                    stopAnimating();
                    sevenYearsBonusChart();
                });
            });
        });
    }
    else{
        stopAnimating();
    }
}

function item11Animate(){
    var startBtn = $("#start-btn");
    var againBtn = $("#again-btn");
    var item11 = $(".item-11");
    var hand11 = $("#hand-11");
    var startBtnImg = $("#start-btn-img");
    var mouseEvent = function(){
        item11.on("mousemove", function(e){
            var pointX = e.pageX;
            var pointY = e.pageY;
            var ox = pointX - 90;
            var oy = pointY;
            if(oy < dh - 461){
                oy = dh - 461;
            }
            hand11.show().css({top: oy + 10, left: ox});
        });
        item11.on("mouseout", function(){
            hand11.hide();
        });
        startBtn.on("mouseover", function(){
            startBtnImg.attr("src", "../asset/images/guide/guide11/bt_start_mouseover.gif");
        });
        startBtn.on("mouseout", function(){
            startBtnImg.attr("src", "../asset/images/guide/guide11/bt_start.png");
        });
    };
    if(startBtn.is(":hidden")){
        startBtn.fadeIn(500, function(){
            againBtn.fadeIn(500, function(){
                mouseEvent();
                animating = false;
            });
        });
    }
    else{
        animating = false;
    }
}