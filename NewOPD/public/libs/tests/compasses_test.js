const TRUE_RESULT = ['southeast', 'east', 'south', 'south', 'southeast', 'west', 'southwest', 'northeast', 'northeast', 'northwest',
    'south', 'north', 'southeast', 'northwest', 'southeast', 'southeast', 'northwest', 'northeast', 'southeast', 'southwest',
    'south', 'southwest', 'southwest', 'north', 'southwest', 'southeast', 'west', 'southwest', 'west', 'west',
    'southeast', 'west', 'east', 'southeast', 'east', 'north', 'east', 'west', 'south', 'southeast',
    'southwest', 'southwest', 'southeast', 'southeast', 'west', 'northwest', 'south', 'southwest', 'southwest', 'west'];

const TEST_DURATION = (2 * 60 + 30) * 1000;
const NUMBER_OF_COMPASSES = 25;

let timer;

let correctChosen = [];
let incorrectChosen = [];

function start_test() {
    document.getElementById('Timer').style.display = 'flex';
    document.getElementById('Instruction').style.display = 'none';
    document.getElementById('Start_button').style.display = 'none';
    document.getElementById('Finish_button').style.display = 'block';
    document.getElementById('bg').style.background = 'black';
    document.getElementById('container').style.display = 'block';

    generateItemCompass();

    setTimeout(finish_test, TEST_DURATION);

    let end = (new Date().getTime() + 1000) + TEST_DURATION;
    timer = setInterval(() => {
        let now = new Date().getTime();
        let distance = Math.floor((end - now) / 1000);
        document.getElementById("Timer").innerHTML = Math.floor(distance / 60) + "m " + distance % 60 + "s ";
    }, 1000);
}

function get_random_set() {
    let randomSet = new Set();
    while (randomSet.size < NUMBER_OF_COMPASSES) {
        randomSet.add(Math.floor(Math.random() * 50))
    }
    return randomSet;
}

function generateItemCompass() {
    let container = document.getElementById('container');
    let randomSet = get_random_set()
    for (let i of randomSet) {
        container.innerHTML += `
            <div class="itemCompass">
                <div class="answers">
                    <div class="butSideWorld" id="north_${i}" onclick="cell('north_${i}')">С</div>
                    <div class="butSideWorld" id="east_${i}" onclick="cell('east_${i}')">В</div>
                    <div class="butSideWorld" id="south_${i}" onclick="cell('south_${i}')">Ю</div>
                    <div class="butSideWorld" id="west_${i}" onclick="cell('west_${i}')">З</div>
                </div>
                <img style="width: 137px;" src="https://www.aviaknow.ru/img/compas/${i+1}.png">
                <div class="answers">
                    <div class="butSideWorld" id="northeast_${i}" onclick="cell('northeast_${i}')">СВ</div>
                    <div class="butSideWorld" id="southeast_${i}" onclick="cell('southeast_${i}')">ЮВ</div>
                    <div class="butSideWorld" id="southwest_${i}" onclick="cell('southwest_${i}')">ЮЗ</div>
                    <div class="butSideWorld" id="northwest_${i}" onclick="cell('northwest_${i}')">СЗ</div>
                </div>

            </div>`
    }
}

function cell(id) {
    let cell = document.getElementById(id);
    let num = id.split('_')[1];
    let val = id.split('_')[0];
    let flag = false;
    correctChosen.forEach(elem => {
        if (elem.id.split('_')[1] === num) {
            flag = true;
        }
    })
    incorrectChosen.forEach(elem => {
        if (elem.id.split('_')[1] === num) {
            flag = true;
        }
    })
    if (correctChosen.includes(cell)) {
        correctChosen.splice(incorrectChosen.indexOf(cell), 1);
        cell.style.backgroundColor = "white";
    } else if (incorrectChosen.includes(cell)) {
        incorrectChosen.splice(incorrectChosen.indexOf(cell), 1);
        cell.style.backgroundColor = "white";
    } else if (flag) {
        return;
    } else {
        cell.style.backgroundColor = "gray";
        if (val === TRUE_RESULT[num]) {
            correctChosen.push(cell);
        } else {
            incorrectChosen.push(cell);
        }
    }
}

function finish_test() {
    document.getElementById('Instruction').style.display = 'none';
    document.getElementById('Final Result').style.display = 'block';
    document.getElementById('Final Result').innerHTML = "Вы верно выбрали " +
        correctChosen.length + "/" + (correctChosen.length + incorrectChosen.length) + " направлений";
    document.getElementById('Finish_button').style.display = 'none';
    clearInterval(timer);
    document.getElementById('Timer').style.display = 'none';

    for (let cell of correctChosen) {
        cell.style.backgroundColor = "green";
    }
    for (let cell of incorrectChosen) {
        cell.style.backgroundColor = "red";
    }
    document.getElementById('Retry').style.top = '10vh';
    document.getElementById('Retry').style.display = 'block';
    window.scroll(0, 0)
    sendUser(correctChosen.length, incorrectChosen.length);
}

// Sends test results to server
async function sendUser(correct, incorrect) {
    const response = await fetch("/result", {
        method: "POST",
        body: JSON.stringify({
            user_name: getCookie("login"),
            test_name: "compass",
            correct: correct.toString(),
            incorrect: incorrect.toString()
        })
    });
    const responseText = await response.text();
    console.log(responseText);
}
