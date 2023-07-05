let start_time;
let iteration = 0;
let maxIteration = 5;
let end_time;
let isDuringTest = false;

//Результаты
let correctTests = 0;
const resultList = [];

const audio = new Audio("/public/audio/audiosignal.mp3");

//Keydown on space
document.addEventListener('keydown', listener);

function listener(event) {
    if (event.key === " " && iteration <= maxIteration && isDuringTest) {
        onAnswer();
    }
}

function onAnswer() {
    finish_test();
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
    document.getElementById('Circle').style.display = 'block';
    setTimeout(function(){
        if (isDuringTest) {
            audio.play();
            start_time = Date.now();
        }
    }, rand_time);
}

function finish_test() {
    isDuringTest = false;
    end_time = Date.now() - start_time;
    document.getElementById('Result').style.display = 'block';
    document.getElementById('Circle').style.display = 'none';
    if (isNaN(end_time)) {
        document.getElementById('Result').innerHTML = 'Не спешите!';
    } else {
        end_time = end_time / 1000
        resultList.push(end_time);
        document.getElementById('Result').innerHTML = 'Ваше время реакции: ' + end_time.toString() + 's';
        correctTests++;
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
        sendUser(averageTime.toFixed(3), percentageOfCorrectAnswers.toFixed(2)).then(r => console.log("promise returned"));
    }
}

// Sends test results to server
async function sendUser(averageTime, percentageOfCorrectAnswers) {
    const response = await fetch("/result", {
        method: "POST",
        body: JSON.stringify({
            user_name: getCookie("login"),
            test_name: "easy_audio",
            time: averageTime.toString(),
            percentage: percentageOfCorrectAnswers.toString()
        })
    });
    const responseText = await response.text();
    console.log(responseText);
}
