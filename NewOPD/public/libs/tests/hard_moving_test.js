let iteration = 0;
const NUMBER_OF_ITERATIONS = 3;

let interval;
//Результаты
const resultList = {slow: [],
    middle: [],
    fast: []};

function start_test() {
    interval = setInterval(() => {
        iteration ++;
        document.getElementById('Iteration').innerHTML = 'Попытка: ' + iteration +'/' + NUMBER_OF_ITERATIONS;
        if (iteration >= NUMBER_OF_ITERATIONS) finish_test();
    }, 5000);
    document.getElementById('Instruction').style.display = 'none';
    document.getElementById('Start_button').style.display = 'none';
    document.getElementById('bg').style.background = 'black';
    document.getElementById('Iteration').style.display = 'block';
    document.getElementById('Result').style.display = 'block';
    document.getElementById('Iteration').innerHTML = 'Попытка: ' + iteration +'/' + NUMBER_OF_ITERATIONS;
    document.getElementById('movingTest').style.display = 'block';

    document.addEventListener('keydown', next_time);
}

function next_time(e) {
    switch (e.code) {
        case 'KeyA':
            calculate_wrong('slow');
            break;
        case 'KeyS':
            calculate_wrong('middle');
            break;
        case 'KeyD':
            calculate_wrong('fast');
            break;
    }
}

function calculate_wrong(speed) {

    document.getElementById('Iteration').innerHTML = 'Попытка: ' + iteration +'/' + NUMBER_OF_ITERATIONS;

    let targetMovingDot = document.getElementById(speed + 'MovingDot');

    targetMovingDot.children[0].classList.remove('dot_highlight');

    let rotationalSpeed = 2 * Math.PI / window.getComputedStyle(targetMovingDot).animationDuration.slice(0, -1);

    let rotationalMatrix = window.getComputedStyle(targetMovingDot).transform
        .split('(')[1].split(')')[0].split(',');
    let angleTemp = Math.asin(rotationalMatrix[1]);
    let angle = Math.acos(rotationalMatrix[0]);
    angle = angleTemp > 0 ? -angle : angle;

    let wrong = angle / rotationalSpeed;
    if (wrong < 0.35 && wrong > -0.35){
        document.getElementById('Result').style.color = '#fff';
        document.getElementById('Result').innerHTML = 'Ваш результат: ' + (wrong).toFixed(3) +' с';
        resultList[speed].push(wrong);
        targetMovingDot.children[0].classList.add('dot_highlight');
    } else {
        if (speed === "fast") {
            document.getElementById('Result').style.color = 'purple';
            document.getElementById('Result').innerHTML = 'Ошибка!';

        }
        if (speed === "middle") {
            document.getElementById('Result').style.color = 'red';
            document.getElementById('Result').innerHTML = 'Ошибка!';

        }
        if (speed === "slow") {
            document.getElementById('Result').style.color = 'green';
            document.getElementById('Result').innerHTML = 'Ошибка!';

        }
    }


}

function finish_test() {
    document.removeEventListener('keydown', next_time);
    document.getElementById('Result').style.color = '#fff';

    let sd = {slow: 0,
        middle: 0,
        fast: 0};
    let sdMinus = {slow: 0,
        middle: 0,
        fast: 0};
    let sdPlus = {slow: 0,
        middle: 0,
        fast: 0};
    let dispersionMinusCounter = 0;
    let dispersionPlusCounter = 0;

    let average = [];

    for (let result in resultList) {
        let dispersion = resultList[result].reduce((acc, number) => acc + Math.pow(number, 2), 0) / (resultList[result].length);
        let dispersionMinus = 0;
        let dispersionPlus = 0;
        resultList[result].forEach(elem => {
            if (elem < 0) {
                dispersionMinus += Math.pow(elem, 2);
                dispersionMinusCounter += 1;
            } else if (elem > 0) {
                dispersionPlus += Math.pow(elem, 2);
                dispersionPlusCounter += 1;
            }
        });
        sd[result] = Math.sqrt(dispersion).toFixed(3);
        sdMinus[result] = Math.sqrt(dispersionMinus / (dispersionMinusCounter)).toFixed(3);
        sdPlus[result] = Math.sqrt(dispersionPlus / (dispersionPlusCounter)).toFixed(3);
        if (sd[result] === "NaN") {
            sd[result] = 0;
        }
        if (sdMinus[result] === 'NaN') {
            sdMinus[result] = 0;
        }
        if (sdPlus[result] === 'NaN') {
            sdPlus[result] = 0;
        }
    }

    for (let elem in sd) {
        if (sd[elem] !== 0) {
            average.push(parseFloat(sd[elem]));
        }
    }

    document.getElementById('movingTest').style.display = 'none';
    document.getElementById('Iteration').style.display = 'none';
    let averageReduced = (average.reduce((acc, num) => acc + num, 0) / average.length).toFixed(3);
    document.getElementById('Result').innerHTML = `Стандартное отклонение:<br>
                <table style="display: inline-table;">
                    <tr>
                        <td style="border-bottom: 2px solid #fff;"></td>
                        <td>общее</td>
                        <td>минус</td>
                        <td style="border-right: none">плюс</td>
                    </tr>
                    <tr>
                        <td>медленный круг</td>
                        <td>${sd['slow']}</td>
                        <td>${sdMinus['slow']}</td>
                        <td style="border-right: none">${sdPlus['slow']}</td>
                    </tr>
                    <tr>
                        <td>средний круг</td>
                        <td>${sd['middle']}</td>
                        <td>${sdMinus['middle']}</td>
                        <td style="border-right: none">${sdPlus['middle']}</td>
                    </tr>
                    <tr>
                        <td style="border-bottom: none">быстрый круг</td>
                        <td style="border-bottom: none">${sd['fast']}</td>
                        <td style="border-bottom: none">${sdMinus['fast']}</td>
                        <td style="border: none">${sdPlus['fast']}</td>
                    </tr>
                </table><br>
                среднее по всем стандартным отклонениям: ${averageReduced} c.
                <style>
                    td {
                        border-bottom: 2px solid #fff;
                        border-right: 2px solid #fff;
                        padding: 5px;
                    }
                    table {
                        margin: 20px;
                    }
                </style>`;

    document.getElementById('Result').style.top = '30vh';

    document.getElementById('Retry').style.display = 'block';
    clearInterval(interval);
    sendUser(sd, sdMinus, sdPlus, averageReduced);
}

// Sends test results to server
async function sendUser(sd, sdMinus, sdPlus, averageReduced) {
    const response = await fetch("/result", {
        method: "POST",
        body: JSON.stringify({
            user_name: getCookie("login"),
            test_name: "hard_moving",
            slow_dispersion: sd['slow'].toString(),
            slow_negative_dispersion: sdMinus['slow'].toString(),
            slow_positive_dispersion: sdPlus['slow'].toString(),
            middle_dispersion: sd['middle'].toString(),
            middle_negative_dispersion: sdMinus['middle'].toString(),
            middle_positive_dispersion: sdPlus['middle'].toString(),
            fast_dispersion: sd['fast'].toString(),
            fast_negative_dispersion: sdMinus['fast'].toString(),
            fast_positive_dispersion: sdPlus['fast'].toString(),
            average_dispersion: averageReduced.toString()
        })
    });
    const responseText = await response.text();
    console.log(responseText);
}