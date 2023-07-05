let start_time;
let iteration = 0;
let maxIteration = 5;
let end_time;
let isDuringTest = false;

//Результаты
let correctTests = 0;
const resultList = [];

document.addEventListener('keydown', function(event) {
    if (iteration <= maxIteration && isDuringTest) {
        switch (event.key) {
            case "1":
                onAnswer('Circle1');
                break;
            case "2":
                onAnswer('Circle2');
                break;
            case "3":
                onAnswer('Circle3');
                break;
            case "4":
                onAnswer('Circle4');
                break;
        }
    }
});

function onAnswer(circle) {
    finish_test(circle);
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
    isDuringTest = true;
    document.getElementById('Instruction').style.display = 'none';
    document.getElementById('Start_button').style.display = 'none';
    document.getElementById('bg').style.background = 'black';
    document.getElementById('Iteration').style.display = 'block';
    document.getElementById('Iteration').innerHTML = 'Попытка: ' + iteration + '/' + maxIteration;
    let rand_time = (Math.random() * 5000) + 1000;
    document.getElementById('Circle1').style.left = '15vw';
    document.getElementById('Circle2').style.left = '25vw';
    document.getElementById('Circle3').style.left = '35vw';
    document.getElementById('Circle4').style.left = '45vw';
    document.getElementById('Circle1').style.display = 'inline-block';
    document.getElementById('Circle2').style.display = 'inline-block';
    document.getElementById('Circle3').style.display = 'inline-block';
    document.getElementById('Circle4').style.display = 'inline-block';
    let randCircle = 'Circle' + (Math.floor(Math.random() * 4) + 1);
    setTimeout(function(){
        if (isDuringTest) {
            document.getElementById(randCircle).style.backgroundColor = 'red';
            start_time = Date.now();
        }
    }, rand_time);
}

function finish_test(circle) {
    end_time = Date.now() - start_time;
    document.getElementById('Result').style.display = 'block';
    if (isNaN(end_time)) {
        document.getElementById('Result').innerHTML = 'Не спешите!';
    } else if (document.getElementById(circle).style.backgroundColor === 'red') {
        end_time = end_time / 1000
        resultList.push(end_time);
        document.getElementById('Result').innerHTML = 'Ваше время реакции: ' + end_time.toString() + 's';
        correctTests++;
    } else {
        document.getElementById('Result').innerHTML = 'Вы выбрали неверный ответ';
    }
    document.getElementById('Circle1').style.backgroundColor = 'midnightblue'
    document.getElementById('Circle1').style.display = 'none';
    document.getElementById('Circle2').style.backgroundColor = 'midnightblue'
    document.getElementById('Circle2').style.display = 'none';
    document.getElementById('Circle3').style.backgroundColor = 'midnightblue'
    document.getElementById('Circle3').style.display = 'none';
    document.getElementById('Circle4').style.backgroundColor = 'midnightblue'
    document.getElementById('Circle4').style.display = 'none';
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
            test_name: "medium_vision",
            time: averageTime.toString(),
            percentage: percentageOfCorrectAnswers.toString()
        })
    });
    const responseText = await response.text();
    console.log(responseText);
}