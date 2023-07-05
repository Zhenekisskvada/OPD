let iteration = 0;
const NUMBER_OF_ITERATIONS = 3;

let interval;

//Результаты
const resultList = []

function start_test() {
    interval = setInterval(() => {
        iteration ++
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
    if (e.code === 'Space') {


        let movingDot = document.getElementById('movingDotWrapper');
        let rotationalSpeed = 2 * Math.PI / window.getComputedStyle(movingDot).animationDuration.slice(0, -1);

        let rotationalMatrix = window.getComputedStyle(movingDot).transform
            .split('(')[1].split(')')[0].split(',');
        let angleTemp = Math.asin(rotationalMatrix[1]);
        let angle = Math.acos(rotationalMatrix[0]);
        angle = angleTemp > 0 ? -angle : angle;

        let wrong = angle / rotationalSpeed;
        if (wrong < 0.35 && wrong > -0.35){
            document.getElementById('Result').innerHTML = 'Ваш результат: ' + (wrong).toFixed(3) +' с';
            resultList.push(wrong);
        } else {
            document.getElementById('Result').innerHTML = 'Ошибка!';
        }
    }
}

function finish_test() {
    document.removeEventListener('keydown', next_time);

    let sd;
    let sdMinus;
    let sdPlus;
    let dispersionMinusCounter = 0;
    let dispersionPlusCounter = 0;

    let dispersion = resultList.reduce((acc, number) => acc + Math.pow(number, 2), 0) / (resultList.length);
    let dispersionMinus = 0;
    let dispersionPlus = 0;
    resultList.forEach(elem => {
        if (elem < 0) {
            dispersionMinus += Math.pow(elem, 2);
            dispersionMinusCounter += 1;
        } else if (elem > 0) {
            dispersionPlus += Math.pow(elem, 2);
            dispersionPlusCounter += 1;
        }
    })
    sd = Math.sqrt(dispersion).toFixed(3);
    sdMinus = Math.sqrt(dispersionMinus / (dispersionMinusCounter)).toFixed(3);
    sdPlus = Math.sqrt(dispersionPlus / (dispersionPlusCounter)).toFixed(3);

    if (sd === "NaN") {
        sd = 0;
    }
    if (sdMinus === 'NaN') {
        sdMinus = 0;
    }
    if (sdPlus === 'NaN') {
        sdPlus = 0;
    }


    document.getElementById('movingTest').style.display = 'none';
    document.getElementById('Iteration').style.display = 'none';

    document.getElementById('Result').innerHTML = `Стандартное отклонение:<br>
            <table style="display: inline-table">
                <tr>
                    <td style="border-bottom: 2px solid #fff;">общее</td>
                    <td style="border-bottom: 2px solid #fff">минус</td>
                    <td style="border-bottom: 2px solid #fff; border-right: none">плюс</td>
                </tr>
                <tr>
                    <td>${sd}</td>
                    <td>${sdMinus}</td>
                    <td style="border-right: none">${sdPlus}</td>
                </tr>
            </table>
            <style>
                td {
                    border-right: 2px solid #fff;
                    padding: 5px;
                }
                table {
                    margin: 20px;
                }
            </style>`
    document.getElementById('Result').style.top = '30vh';
    document.getElementById('Retry').style.display = 'block';
    sendUser(sd, sdMinus, sdPlus);
    clearInterval(interval);
}

// Sends test results to server
async function sendUser(sd, sdMinus, sdPlus) {
    const response = await fetch("/result", {
        method: "POST",
        body: JSON.stringify({
            user_name: getCookie("login"),
            test_name: "easy_moving",
            dispersion: sd.toString(),
            negative_dispersion: sdMinus.toString(),
            positive_dispersion: sdPlus.toString()
        })
    });
    const responseText = await response.text();
    console.log(responseText);


}