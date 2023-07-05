const globalContainer = document.getElementById('landolt_ring');
const REFRESH_INTERVAL = 3;
const container = document.querySelector('.scene');
const children = [...container.children];

let isDuringTest = false;
let timePassed = 0;
let initTime = 0;
const TOTAL_RINGS = 8;
let randRing = Math.floor(Math.random()*8) + 1;
const ringMap = new Map();
ringMap.set(1, "n.png");
ringMap.set(2, "ne.png");
ringMap.set(3, "e.png");
ringMap.set(4, "se.png");
ringMap.set(5, "s.png");
ringMap.set(6, "sw.png");
ringMap.set(7, "w.png");
ringMap.set(8, "nw.png");
let correctChosen = [];
let incorrectChosen = [];

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
    document.getElementById('Choosing_img').style.display = 'block';
    document.getElementById('Choosing_instruction').innerHTML = 'Нажмите все кольца вида: ';
    document.getElementById('Choosing_img').innerHTML = `<img src="/public/img/`+ ringMap.get(randRing) + `" class="cell_img">`;
    document.getElementById('Start_button').style.display = 'none';
    document.getElementById('Finish_button').style.display = 'block';
    document.getElementById('bg').style.background = 'black';
    document.getElementById('Scene').style.display = 'block';

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


function cell(val, id) {
    let cell = document.getElementById(id);
    if (correctChosen.includes(cell)) {
        correctChosen.splice(correctChosen.indexOf(cell), 1);
        cell.style.backgroundColor = "white";
    } else if (incorrectChosen.includes(cell)) {
        incorrectChosen.splice(incorrectChosen.indexOf(cell), 1);
        cell.style.backgroundColor = "white";
    } else {
        cell.style.backgroundColor = "gray";
        if (val === randRing) {
            correctChosen.push(cell);
        } else {
            incorrectChosen.push(cell);
        }
    }
}

function finish_test() {
    isDuringTest = false;
    document.getElementById('Choosing_img').style.display = 'none';
    document.getElementById('Choosing_instruction').style.display = 'none';
    document.getElementById('Final Result').style.display = 'block';
    document.getElementById('Final Result').innerHTML = "Вы верно выбрали " + correctChosen.length + " колец и ошибочно выбрали " + incorrectChosen.length + " колец" +
        "<br>Время выполнения: " + timePassed;
    document.getElementById('Timer').style.display = 'none';
    document.getElementById('Finish_button').style.display = 'none';

    for (let cell of correctChosen) {
        cell.style.backgroundColor = "green";
    }
    for (let cell of incorrectChosen) {
        cell.style.backgroundColor = "red";
    }
    for (let cell of children) {
        if (parseInt(cell.id) < (randRing*8) && parseInt(cell.id) > ((randRing-1)*8) && !correctChosen.includes(cell) && !incorrectChosen.includes(cell)) {
            cell.style.backgroundColor = "yellow";
        }
    }
    document.getElementById('Retry').style.top = '10vh';
    document.getElementById('Retry').style.display = 'block';
    sendUser(correctChosen.length, incorrectChosen.length, timePassed);
}

// Sends test results to server
async function sendUser(correct, incorrect, time) {
    const response = await fetch("/result", {
        method: "POST",
        body: JSON.stringify({
            user_name: getCookie("login"),
            test_name: "landolt_ring",
            correct: correct.toString(),
            incorrect: incorrect.toString(),
            time: time.toString()
        })
    });
    const responseText = await response.text();
    console.log(responseText);
}
