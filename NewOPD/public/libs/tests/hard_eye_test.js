let start_time;
let iteration = 0;
let maxIteration = 5;
let end_time;
const sizeList = ["Маленький", "Средний", "Большой"];
const colorList = ["Красный", "Зелёный", "Синий", "Жёлтый", "Белый"];
let size_ru;
let color_ru;
let circleSize;
let circleColor;

//Результаты
let correctTests = 0;
const resultList = [];

function random_circle(element) {
    let circleSizeList = ["10vh", "20vh", "40vh"];
    let circleColorList = ["red", "green", "blue", "yellow", "white"];
    let indexSize = circleSizeList.indexOf(circleSize);
    if (indexSize > -1) { // only splice array when item is found
        circleSizeList.splice(indexSize, 1); // 2nd parameter means remove one item only
    }
    let indexColor = circleColorList.indexOf(circleColor);
    if (indexColor > -1) { // only splice array when item is found
        circleColorList.splice(indexColor, 1); // 2nd parameter means remove one item only
    }

    let size = circleSizeList[Math.floor(Math.random()*circleSizeList.length)];
    let color = circleColorList[Math.floor(Math.random()*circleColorList.length)];
    let top = (Math.random()* 40).toString() + 'vh';
    let left = (Math.random() * 30).toString() + 'vw';
    document.getElementById(element).style.display = 'inline-block';
    document.getElementById(element).style.height = size;
    document.getElementById(element).style.width = size;
    document.getElementById(element).style.top = top;
    document.getElementById(element).style.left = left;
    document.getElementById(element).style.backgroundColor = color;
}

function onAnswer(correct) {
    finish_test(correct);
    if (iteration !== maxIteration) {
        start_test();
    } else {
        iteration++;
    }
}

function start_test() {
    iteration++;
    end_time = 0;
    start_time = NaN;

    size_ru = sizeList[Math.floor(Math.random()*sizeList.length)];
    color_ru = colorList[Math.floor(Math.random()*colorList.length)];
    switch (size_ru) {
        case 'Маленький':
            circleSize = '10vh'
            break;
        case 'Средний':
            circleSize = '20vh'
            break;
        case 'Большой':
            circleSize = '40vh'
            break;
    }
    switch (color_ru) {
        case 'Красный':
            circleColor = 'red'
            break;
        case 'Зелёный':
            circleColor = 'green'
            break;
        case 'Синий':
            circleColor = 'blue'
            break;
        case 'Жёлтый':
            circleColor = 'yellow'
            break;
        case 'Белый':
            circleColor = 'white'
            break;
    }
    document.getElementById('Instruction').style.display = 'none';
    document.getElementById('Start_button').style.display = 'none';
    document.getElementById('bg').style.background = 'black';
    document.getElementById('Iteration').style.display = 'block';
    document.getElementById('Iteration').innerHTML = 'Попытка: ' + iteration + '/' + maxIteration;

    document.getElementById('Choosing_instruction').style.display = 'block';
    document.getElementById('Choosing_instruction').innerHTML = 'Нажмите ' + color_ru + ' ' + size_ru + ' круг';

    random_circle('Circle1');
    document.getElementById('Circle1').style.height = circleSize;
    document.getElementById('Circle1').style.width = circleSize;
    document.getElementById('Circle1').style.backgroundColor = circleColor;
    document.getElementById('Circle1').style.zIndex = '2';

    random_circle('Circle2');
    random_circle('Circle3');
    random_circle('Circle4');

    start_time = Date.now();
}
function finish_test(correct) {
    let end_time = Date.now() - start_time;
    document.getElementById('Result').style.display = 'block';
    document.getElementById('Choosing_instruction').style.display = 'none';
    document.getElementById('Circle1').style.display = 'none';
    document.getElementById('Circle2').style.display = 'none';
    document.getElementById('Circle3').style.display = 'none';
    document.getElementById('Circle4').style.display = 'none';
    if (correct) {
        if (isNaN(end_time)) {
            document.getElementById('Result').innerHTML = 'Не спешите!';
        } else {
            end_time = end_time / 1000
            resultList.push(end_time);
            document.getElementById('Result').innerHTML = 'Ваше время реакции: ' + end_time.toString() + 's';
            correctTests++;
        }
    } else {
        document.getElementById('Result').innerHTML = 'Вы выбрали неправильный круг';
    }

    if (iteration === maxIteration) {
        let averageTime = 0;
        for (let i = 0; i < resultList.length; i++) {
            if (isNaN(resultList[i])) {
                continue;
            }
            averageTime += resultList[i];
        }
        averageTime /= correctTests;
        let percentageOfCorrectAnswers = correctTests / maxIteration * 100;
        document.getElementById('Final Result').style.display = 'block'
        document.getElementById('Final Result').innerHTML = 'Среднее время: ' + averageTime.toFixed(3) + '\nКоличество правильных ответов: ' + percentageOfCorrectAnswers.toFixed(2) + "%";
        document.getElementById('Retry').style.display = 'block';
        sendUser(averageTime.toFixed(3), percentageOfCorrectAnswers.toFixed(2));
    }
}
// Sends test results to server
async function sendUser(averageTime, percentageOfCorrectAnswers) {
    const response = await fetch("/result", {
        method: "POST",
        body: JSON.stringify({
            user_name: getCookie("login"),
            test_name: "hard_vision",
            time: averageTime.toString(),
            percentage: percentageOfCorrectAnswers.toString()
        })
    });
    const responseText = await response.text();
    console.log(responseText);
}