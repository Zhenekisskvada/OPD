const REFRESH_INTERVAL = 3;
const correctSequence = [1, 24, 2, 23, 3, 22, 4, 21, 5, 20, 6, 19, 7, 18, 8, 17, 9, 16, 10, 15, 11, 14, 12, 13, 13, 12, 14, 11, 15, 10, 16, 9, 17, 8, 18, 7, 19, 6, 20, 5, 21, 4, 22, 3, 23, 2, 24, 1, 25];

let isDuringTest = false;
let timePassed = 0;
let initTime = 0;
let cursor = 0;
let score = 0;


function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function start_test() {
    isDuringTest = true;
    document.getElementById('Timer').style.display = 'flex';
    document.getElementById('Instruction').style.display = 'none';
    document.getElementById('Choosing_instruction').style.display = 'block';
    document.getElementById('Start_button').style.display = 'none';

    document.getElementById('Choosing_instruction').style.backgroundColor = 'white';
    document.getElementById('Choosing_instruction').style.width = 'fit-content';
    document.getElementById('Choosing_instruction').style.margin = '0 auto';
    document.getElementById('Choosing_instruction').innerHTML = '<b style="color: red">Красные на увеличение</b><b style="color: black"> Черные на уменьшение</b>';
    document.getElementById('bg').style.background = 'black';
    document.getElementById('Scene').style.display = 'block';
    const container = document.querySelector('.scene');
    const children = [...container.children];
    shuffle(children);
    for (const child of children) {
        container.appendChild(child);
    }
    initTime = new Date().getTime();
    let timer = setInterval(function() {

        let now = new Date().getTime();

        let distance = now - initTime;

        timePassed = distance/1000;

        document.getElementById("Timer").innerHTML = timePassed + "s";

        if (!isDuringTest) {
            clearInterval(timer);
        }

    }, REFRESH_INTERVAL);
}



function cell(val) {
    if (val === correctSequence[cursor]) {
        score++;
    }
    cursor++;
    if (cursor === 48) {
        document.getElementById('Final Result').innerHTML = "Время: " + timePassed + 's' + " Выбрано правильных ячеек: " + score;
        finish_test();
    }

}

function finish_test() {
    isDuringTest = false;
    document.getElementById('Final Result').style.display = 'block';
    document.getElementById('Choosing_instruction').style.display = 'none';
    document.getElementById('Timer').style.display = 'none';
    document.getElementById('Scene').style.display = 'none';
    document.getElementById('Retry').style.display = 'block';
    sendUser(score, timePassed);
}

// Sends test results to server
async function sendUser(score, time) {
    const response = await fetch("/result", {
        method: "POST",
        body: JSON.stringify({
            user_name: getCookie("login"),
            test_name: "red_n_black",
            score: score.toString(),
            time: time.toString()
        })
    });
    const responseText = await response.text();
    console.log(responseText);
}
