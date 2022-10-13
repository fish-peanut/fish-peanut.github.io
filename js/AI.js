num = 1;
over = 0;
board = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
grade = [0, 0];
flag = 0;
step = 0;

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function nextStep(ownBoard, otherBoard, figure) {
    console.log(ownBoard, otherBoard, figure);
    var next_place = -1;
    var count_remove = 0;
    var room = 0;
    var next_place_in = -1;
    var count_remove_in = 0;
    var room_in = 0;
    for (var i = 0; i < 3; i++) {
        var place_find = 0;
        var column = i * 3;
        var flag = -1;
        var flag2 = -1;
        var count = 0;
        var count2 = 0;
        for (var j = 0; j < 3; j++) {
            if (ownBoard[column + j] == 0) {
                if (flag == -1) flag = j;
                count++;
            }
            if (otherBoard[column + j] == figure) {
                flag2 = j;
                count2++;
            }
        }
        if (flag != -1 && flag2 != -1) {
            next_place_in = flag + column;
            count_remove_in = count2;
            room_in = count;
            place_find = 1;
        }
        if (place_find == 1 && (count_remove_in > count_remove || (count_remove_in == count_remove && room_in > room))) {
            next_place = next_place_in;
            count_remove = count_remove_in;
            room = room_in;
        }
    }
    if (next_place == -1) {
        var random_list = [];
        for (var i = 0; i < 9; i++) {
            if (ownBoard[i] == 0) random_list.push(i);
        }

        next_place = random_list[getRandomIntInclusive(0, random_list.length - 1)];
    }
    return next_place;
}

function toutouzi() {
    step = 1;
    var touzi = $(".touzi");
    touzi.addClass("disable");
    var img = touzi.find("img");
    img.hide();
    img.eq(6).show();
    setTimeout(function () {
        num = getRandomIntInclusive(1, 6);
        img.eq(6).hide();
        img.eq(num - 1).show();
        var table = $(".table")
        table.eq(turn).removeClass("disable");
    }, 1000);
}

function tuoguan2() {
    if (turn && flag) {
        var id;
        do {
            id = getRandomIntInclusive(0, 8);
        } while (board[turn][id] != 0);
        id += 1;
        if (step == 0) {
            toutouzi();
            setTimeout(function () {
                puttouzi(id);
            }, 1200);
        }
        else if (step == 1) {
            setTimeout(function () {
                puttouzi(id);
            }, 200);
        }
    }
}

function puttouzi(id) {
    step = 2;
    var table = $(".table");
    var i = table.eq(turn).find("#" + id);
    var img = "<img src='images/骰子" + num + ".jpg' alt=''>";
    i.append(img);
    var Id = id - 1;
    board[turn][Id] = num;
    table.eq(turn).addClass("disable");
    var round = $(".round");
    round.find("i").eq(turn).html("");
    turn = turn == 0 ? 1 : 0;
    // 吃
    var cal = Math.floor(Id / 3);
    for (var j = cal * 3; j < (cal + 1) * 3; j++) {
        if (board[turn][j] == num) {
            board[turn][j] = 0;
            var index = j + 1;
            var i = table.eq(turn).find("#" + index);
            i.find("img").remove();
        }
        else continue;
    }

    // over
    if (table.eq(0).find("img").length == 9 || table.eq(1).find("img").length == 9) {
        var touzi = $(".touzi")
        touzi.addClass("disable");
        table.addClass("disable");
        var robot = $(".robot");
        robot.hide();
        // 算分
        for (var k = 0; k < 2; k++) {
            for (var i = 0; i < 3; i++) {
                var count = [0, 0, 0, 0, 0, 0, 0];
                for (var j = i * 3; j < (i + 1) * 3; j++) {
                    count[board[k][j]] += 1;
                }
                for (var j = 1; j <= 6; j++) {
                    grade[k] += j * count[j] * count[j];
                }
            }
        }
        // show
        var mask = $(".mask");
        var score = mask.find(".score");
        score.html("对局结束!<br>双方比分为" + grade[0] + " : " + grade[1]);
        mask.css("display", "block");
    }
    else {
        step = 0;
        var round = $(".round");
        round.find("i").eq(turn).html("·");
        var touzi = $(".touzi");
        touzi.removeClass("disable");
        if (turn == 0) {
            toutouzi();
            setTimeout(function () {
                var id = nextStep(board[0], board[1], num) + 1;
                console.log(id);
                puttouzi(id);
            }, 1500);
        }
        tuoguan2();
    }
}

$(function () {
    turn = getRandomIntInclusive(0, 1);
    var round = $(".round");
    round.find("i").eq(turn).html("·");
    if (turn == 0) {
        toutouzi();
        setTimeout(function () {
            var id = nextStep(board[1], board[0], num) + 1;
            console.log(id);
            puttouzi(id);
        }, 1500);

    }
    var touzi = $(".touzi");
    touzi.on("touchend", function () {
        toutouzi();
    })
    var table = $(".table");
    table.find("i").on("touchend", function (e) {
        var id = e.currentTarget.id;
        var i = table.eq(turn).find("#" + id);
        if (!i.find("img").length) puttouzi(e.currentTarget.id);
    })
    var tuoguan = $(".tuoguan");
    tuoguan.on("touchend", function () {
        flag = flag == 0 ? 1 : 0;
        var robot = $(".robot");
        if (flag) {
            robot.show();
            tuoguan2();
        }
        else {
            robot.hide();
        }
    })

})
