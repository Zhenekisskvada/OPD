let correctChosen = 0;
let counter = 0;
let isAorBseries = true;
const TRUE_RESULT = [4, 5, 1, 2, 6, 3, 6, 2, 1, 3, 4, 5,
    2, 6, 1, 2, 1, 3, 5, 6, 4, 3, 4, 5,
    8, 2, 3, 8, 7, 4, 5, 1, 7, 6, 1, 2,
    3, 4, 3, 7, 8, 6, 5, 4, 1, 2, 5, 6,
    7, 6, 8, 2, 1, 5, 1, 6, 3, 2, 4, 5];

function start_test() {
    document.getElementById('Instruction').style.display = 'none';
    document.getElementById('Start_button').style.display = 'none';
    document.getElementById('bg').style.background = 'black';
    document.getElementById('Scene').style.display = 'block';

    document.getElementById('Scene').addEventListener('mousemove', mouseMoveOverPossibleAnswer);
    addEventListener('click', next_time);
}

function isOverPossibleAnswer(e) {
    let mousePositionX = e.clientX - e.target.getBoundingClientRect().left;
    let mousePositionY = e.clientY - e.target.getBoundingClientRect().top;
    if  (isAorBseries) {
        if (1 <= mousePositionX && mousePositionX <= 129 &&
            247 <= mousePositionY && mousePositionY <= 326) return 1;
        if (151 <= mousePositionX && mousePositionX <= 279 &&
            247 <= mousePositionY && mousePositionY <= 326) return 2;
        if (301 <= mousePositionX && mousePositionX <= 429 &&
            247 <= mousePositionY && mousePositionY <= 326) return 3;
        if (1 <= mousePositionX && mousePositionX <= 129 &&
            360 <= mousePositionY && mousePositionY <= 438) return 4;
        if (151 <= mousePositionX && mousePositionX <= 279 &&
            360 <= mousePositionY && mousePositionY <= 438) return 5;
        if (301 <= mousePositionX && mousePositionX <= 429 &&
            360 <= mousePositionY && mousePositionY <= 438) return 6;
    } else {
        if (0 <= mousePositionX && mousePositionX <= 112 &&
            272 <= mousePositionY && mousePositionY <= 341) return 1;
        if (121 <= mousePositionX && mousePositionX <= 233 &&
            272 <= mousePositionY && mousePositionY <= 341) return 2;
        if (242 <= mousePositionX && mousePositionX <= 354 &&
            272 <= mousePositionY && mousePositionY <= 341) return 3;
        if (363 <= mousePositionX && mousePositionX <= 474 &&
            272 <= mousePositionY && mousePositionY <= 341) return 4;
        if (0 <= mousePositionX && mousePositionX <= 112 &&
            370 <= mousePositionY && mousePositionY <= 439) return 5;
        if (121 <= mousePositionX && mousePositionX <= 233 &&
            370 <= mousePositionY && mousePositionY <= 439) return 6;
        if (242 <= mousePositionX && mousePositionX <= 354 &&
            370 <= mousePositionY && mousePositionY <= 439) return 7;
        if (363 <= mousePositionX && mousePositionX <= 474 &&
            370 <= mousePositionY && mousePositionY <= 439) return 8;
    }
    return false;
}

function mouseMoveOverPossibleAnswer(e) {
    if (isOverPossibleAnswer(e)) {
        e.target.style.cursor = 'pointer';
    } else {
        e.target.style.cursor = 'crosshair';
    }
}

function next_time(e) {
    if (!(document.getElementById('Scene').contains(e.target))) {
        return;
    }
    let answer = isOverPossibleAnswer(e)
    if (answer) {
        if (answer === TRUE_RESULT[counter]) {
            correctChosen += 1;
            e.target.remove();
        } else {
            e.target.style.zIndex = '0';
        }
        counter++;
    }
    if (counter === 24) {
        isAorBseries = false;
    }
    if (counter === 60) {
        finish_test();
    }
}

function finish_test() {
    let percentOfCorrectAnswer = correctChosen / 60 * 100;
    let message;
    if (percentOfCorrectAnswer <= 5) {
        message = 'V степень: дефектная интеллектуальная способность';
    } else if (6 <= percentOfCorrectAnswer && percentOfCorrectAnswer <= 24) {
        message = 'IV степень: интеллект ниже среднего';
    } else if (25 <= percentOfCorrectAnswer && percentOfCorrectAnswer <= 74) {
        message = 'III степень: средний интеллект';
    } else if (75 <= percentOfCorrectAnswer && percentOfCorrectAnswer <= 94) {
        message = 'II степень: незаурядный интеллект';
    } else {
        message = 'I степень: особо высокоразвитый интеллект';
    }

    document.getElementById('Final Result').style.display = 'block';
    document.getElementById('Scene').style.display = 'block';

    document.getElementById('Final Result').innerHTML = 'Верных ответов ' + correctChosen + ' из 60(' +
        percentOfCorrectAnswer.toFixed(1) + '%)<br>У Вас ' + message + '<br>Ошибочные матрицы:';
    document.getElementById('Scene').style.overflowY = 'scroll';
    Array.from(document.getElementById('Scene').children).forEach(img =>
        img.style.position = 'static'
    );

    document.getElementById('Retry').style.top = '10vh';
    document.getElementById('Retry').style.display = 'block';
    sendUser(correctChosen);
}

// Sends test results to server
async function sendUser(correct) {
    const response = await fetch("/result", {
        method: "POST",
        body: JSON.stringify({
            user_name: getCookie("login"),
            test_name: "raven",
            correct: correct.toString()
        })
    });
    const responseText = await response.text();
    console.log(responseText);
}
