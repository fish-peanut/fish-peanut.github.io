function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值
}
$(function () {
    // 投骰子
    // alert("开始对局");
    var touzi = $(".touzi");
    var table = $(".table");
    var round = $(".round");
    var tuoguan = $(".tuoguan");
    var robot = $(".robot")
    var turn = getRandomIntInclusive(0, 1);    // 任取其中一方先手
    round.find("i").eq(turn).html("·");
    var flag = 1;   // 判断是否可以交换行动权
    var flag1 = 0;  // 托管标志
    var num = 0;    // 骰子点数
    // console.log(turn);
    var arr = new Array(2);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = new Array(3);
        for (var j = 0; j < arr[i].length; j++) {
            arr[i][j] = new Array(3);
            for (var k = 0; k < arr[i][j].length; k++) {
                arr[i][j][k] = 0;
            }
        }
    }
    // 托管点击事件
    tuoguan.on("touchend", function () {
        flag1 = flag1 == 0 ? 1 : 0;
        if (flag1) robot.removeClass("hide");
        else robot.addClass("hide");
        // console.log(flag1);
    })

    interval = setInterval(function () {
        // 结束对局条件，计算分数
        if (table.eq(0).find("img").length == 9 || table.eq(1).find("img").length == 9) {
            clearInterval(interval);
            alert("对局结束");
            var sum = [0, 0];
            for (var j = 0; j < 2; j++) {
                for (var k = 0; k < 3; k++) {
                    var count = [0, 0, 0, 0, 0, 0, 0];
                    for (var l = 0; l < 3; l++) {
                        count[arr[j][l][k]] += 1;
                    }
                    for (var l = 1; l <= 6; l++) {
                        sum[j] += l * count[l] * count[l];
                    }
                }
            }
            var mask = $(".mask");
            var score = mask.find(".score");
            score.html("对局结束<br>双方比分为" + sum[0] + " : " + sum[1]);
            mask.css("display", "block");
            // alert("双方比分为" + sum[0] + " : " + sum[1]);
        }
        else if (flag) {
            flag = 0;
            num = getRandomIntInclusive(1, 6);
            var touzi = $(".touzi");
            if (flag1 && turn) {
                var img = touzi.find("img");
                img.hide();
                img.eq(6).show();
                setTimeout(function () {
                    var img = touzi.find("img");
                    img.eq(6).hide();
                    img.eq(num - 1).show();
                }, 1000);
                setTimeout(function () {
                    var img = "<img src='images/骰子" + num + ".jpg' alt=''>"
                    var temp;
                    var index;
                    var value;
                    var i = table.find("i");

                    do {
                        temp = getRandomIntInclusive(0, 8);
                        index = temp + turn * 9;
                        value = i.eq(index).find("img").length;
                    } while (value)
                    i.eq(index).append(img);

                    var row = parseInt(temp / 3);
                    var coloum = temp % 3;
                    console.log(turn, row, coloum)
                    arr[turn][row][coloum] = num;
                    round.find("i").eq(turn).html("");

                    // console.log(arr);
                    turn = turn == 0 ? 1 : 0;
                    // 判断是否消除
                    for (var k = 0; k < 3; k++) {
                        if (arr[turn][k][coloum] == num) {
                            var index = k * 3 + coloum + turn * 9;
                            // console.log(index);
                            i.eq(index).find("img").remove();
                            arr[turn][k][coloum] = 0;
                        }
                    }
                    flag = 1;
                    round.find("i").eq(turn).html("·");
                }, 1200);
            }
            else {
                touzi.removeClass("disable");
                touzi.on("touchend", function (flag2) {
                    var img = $(this).find("img");
                    img.hide();
                    img.eq(6).show();
                    setTimeout(function () {
                        img.eq(6).hide();
                        img.eq(num - 1).show();
                    }, 1000);
                    $(this).addClass("disable");
                    table.eq(turn).removeClass("disable");
                });
                setTimeout(function () {
                    // 放入九宫格点击事件
                    // console.log(turn);
                    var i = table.find("i");
                    // console.log(turn);
                    // var table = $(".table")
                    for (var j = 0; j < i.length; j++) {
                        (function (j) {
                            i.eq(j).on("touchend", function () {
                                flag2 = 0;
                                var img = "<img src='images/骰子" + num + ".jpg' alt=''>"
                                var value = $(this).find("img").length;
                                if (!value) {
                                    $(this).append(img);
                                    table.eq(turn).addClass("disable");
                                    var row;
                                    var coloum;
                                    if (turn) {
                                        row = parseInt((j % 9) / 3);
                                        coloum = parseInt((j % 9) % 3);
                                    }
                                    else {
                                        row = parseInt(j / 3);
                                        coloum = parseInt(j % 3);
                                    }
                                    arr[turn][row][coloum] = num;
                                    round.find("i").eq(turn).html("");

                                    // console.log(arr);
                                    turn = turn == 0 ? 1 : 0;
                                    // 判断是否消除
                                    for (var k = 0; k < 3; k++) {
                                        if (arr[turn][k][coloum] == num) {
                                            var index = k * 3 + coloum + turn * 9;
                                            // console.log(index);
                                            i.eq(index).find("img").remove();
                                            arr[turn][k][coloum] = 0;
                                        }
                                    }
                                    // console.log(turn);
                                    flag = 1;
                                    round.find("i").eq(turn).html("·");
                                }
                            })
                        })(j);
                    }
                }, 1000);
            }
        };
    }, 1001);
})