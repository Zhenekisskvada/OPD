const WAIT_TIME = 3000; //time in ms to show the words

let selectedCells = [];
let isDuringTest = false;
let canClick = false;
let score = 0;

const container = document.querySelector('.scene');
const children = [...container.children];

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
    document.getElementById('Instruction').style.display = 'none';
    document.getElementById('Start_button').style.display = 'none';
    document.getElementById('bg').style.background = 'black';
    document.getElementById('Scene').style.display = 'block';

    shuffle(children);
    for (const child of children) {
        container.appendChild(child);
    }
    for (let i = 1; i <= 8; i++) {
        document.getElementById(i.toString()).style.backgroundColor = 'gold';
    }
    setTimeout(fillAnswers, WAIT_TIME)
}

function cell(id) {
    if (canClick) {
        let cell = document.getElementById(id);
        selectedCells.push(cell);
        cell.style.backgroundColor = "gray";
    }
}

function fillAnswers() {
    for (const child of children) {
        child.style.backgroundColor = 'white';
    }
    canClick = true;
    document.getElementById('Finish_button').style.display = 'block';
}

function finish_test() {
    isDuringTest = false;
    document.getElementById('Final Result').style.display = 'block';
    document.getElementById('Finish_button').style.display = 'none';
    document.getElementById('Retry').style.display = 'block';
    for (let i = 1; i <= 8; i++) {
        document.getElementById(i.toString()).style.backgroundColor = 'gold';
    }
    for (const cell of selectedCells) {
        if ((1 <= cell.id) && (cell.id <= 8)) {
            score++;
            cell.style.backgroundColor = 'green';
        } else {
            cell.style.backgroundColor = 'red';
        }
    }
    document.getElementById('Final Result').innerHTML = 'Вы верно выбрали: ' + score + '/8';
    sendUser(score);
}

// Sends test results to server
async function sendUser(score) {
    const response = await fetch("/result", {
        method: "POST",
        body: JSON.stringify({
            user_name: getCookie("login"),
            test_name: "visual_memory",
            score: score.toString()
        })
    });
    const responseText = await response.text();
    console.log(responseText);
}
