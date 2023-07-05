let start_time;
let iteration = 0;
let end_time;
let maxIteration = 5;
let isDuringTest = false;

//Результаты
let correctTests = 0;
const resultList = [];

document.addEventListener('keydown', function(event) {
    if (iteration <= maxIteration && isDuringTest) {
        switch (event.key) {
            case "f":
                onAnswer(0);
                break;
            case "F":
                onAnswer(0);
                break;
            case "j":
                onAnswer(1);
                break;
            case "J":
                onAnswer(1);
                break;
        }
    }
});

function onAnswer(num) {
    finish_test(num);
    if (iteration !== maxIteration) {
        start_test();
    } else {
        iteration++;
    }
}

let num1 = Math.floor(Math.random() * 99) + 1;
let num2 = Math.floor(Math.random() * 99) + 1;
let sum = (num1 + num2) % 2;

function start_test() {
    iteration++;
    end_time = 0;
    start_time = NaN;
    isDuringTest = true;
    document.getElementById('Instruction').style.display = 'none';
    document.getElementById('Start_button').style.display = 'none';
    document.getElementById('bg').style.background = 'black';
    document.getElementById('Iteration').style.display = 'block';
    document.getElementById('Iteration').innerHTML = 'Попытка: ' + iteration +'/' + maxIteration;

    num1 = Math.floor(Math.random() * 100);
    num2 = Math.floor(Math.random() * 100);
    sum = (num1 + num2) % 2;
    document.getElementById('Calc').style.display = 'block';
    document.getElementById('Calc').innerHTML = num1 + '+' + num2;
    document.getElementById('Even').style.display = 'inline-block';
    document.getElementById('Odd').style.display = 'inline-block';
    start_time = Date.now();
}
function finish_test(answer) {
    let end_time = Date.now() - start_time;
    document.getElementById('Result').style.display = 'block';
    document.getElementById('Even').style.display = 'none';
    document.getElementById('Odd').style.display = 'none';
    if (isNaN(end_time)) {
        document.getElementById('Result').innerHTML = 'Не спешите!';
    } else if (sum === answer) {
        end_time = end_time / 1000
        resultList.push(end_time);
        document.getElementById('Result').innerHTML = 'Ваше время реакции: ' + end_time.toString() + 's';
        correctTests++;
    } else {
        document.getElementById('Result').innerHTML = 'Вы выбрали неверный ответ';
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
            test_name: "vision_sum",
            time: averageTime.toString(),
            percentage: percentageOfCorrectAnswers.toString()
        })
    });
    const responseText = await response.text();
    console.log(responseText);
}