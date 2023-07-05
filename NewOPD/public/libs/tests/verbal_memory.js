//const dictionary = ['яблоко', 'лампа', 'книга', 'чайник', 'птица', 'ручка', 'ноутбук', 'дерево', 'телефон', 'велосипед', 'солнце', 'гитара', 'зеркало', 'стол', 'гриб', 'плащ', 'замок', 'ножницы', 'карандаш', 'бутылка', 'стул', 'пылесос', 'рубашка', 'банан', 'компьютер', 'коньки', 'губка', 'торт', 'ковер', 'кот', 'пальто', 'кувшин', 'молоток', 'термос', 'кресло', 'доска', 'клавиатура', 'шкаф', 'шапка', 'тумбочка', 'стакан', 'тарелка', 'бумага', 'картон', 'паспорт', 'морковь', 'рыба', 'ложка', 'вилка', 'нож', 'подушка', 'медведь', 'коса', 'лопата', 'сковорода', 'масло', 'свеча', 'нитки', 'ковер', 'цветок', 'молоко', 'банк', 'тетрадь', 'динамик', 'гольф', 'микрофон', 'наушники', 'щетка', 'паста', 'колесо', 'шар', 'корзина', 'гамак', 'мангал', 'кольцо', 'кисть', 'печенье', 'картошка', 'лаванда', 'носки', 'шнурки', 'часы', 'юбка', 'белье', 'дверь', 'окно']
const dictionary = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99'];
const WAIT_TIME = 5000; //time in ms to show the words
const maxIteration = 5;
const resultList = [];

let iteration = 0;

let selectedWords = []
let isDuringTest = false;
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

function onAnswer() {
    score = 0;
    for (const child of children) {
        let answer = child.innerHTML.toLowerCase();
        if (selectedWords.includes(answer)) {
            score++;
            selectedWords.splice(selectedWords.indexOf(answer), 1);
        }
    }
    resultList.push(score);
    if (iteration !== maxIteration) {
        start_test();
    } else {
        iteration++;
        finish_test();
    }
}

const container = document.querySelector('.scene');
const children = [...container.children];
function start_test() {
    iteration++;
    isDuringTest = true;
    document.getElementById('Instruction').style.display = 'none';
    document.getElementById('Start_button').style.display = 'none';
    document.getElementById('bg').style.background = 'black';
    document.getElementById('Scene').style.display = 'block';
    document.getElementById('Finish_button').style.display = 'none';
    document.getElementById('Iteration').style.display = 'block';
    document.getElementById('Iteration').innerHTML = 'Попытка: ' + iteration + '/' + maxIteration;

    shuffle(children);
    for (const child of children) {
        container.appendChild(child);
    }
    shuffle(dictionary);
    let cursor = 0;
    for (const child of children) {
        cursor++;
        selectedWords.push(dictionary[cursor]);
        child.innerHTML = dictionary[cursor];
    }
    setTimeout(fillAnswers, WAIT_TIME)
}

function fillAnswers() {
    for (const child of children) {
        child.innerHTML = "";
        child.contentEditable = "true";
    }
    document.getElementById('Finish_button').style.display = 'block';
}

function finish_test() {
    isDuringTest = false;
    document.getElementById('Final Result').style.display = 'block';
    document.getElementById('Finish_button').style.display = 'none';
    document.getElementById('Scene').style.display = 'none';
    document.getElementById('Retry').style.display = 'block';
    let sum = 0;
    for (let i of resultList) {
        i = parseInt(i);
        sum += i;
    }
    let percentageOfCorrectAnswers = ((sum / 16)/ maxIteration) * 100;
    document.getElementById('Final Result').innerHTML = 'Число правилных ответов: ' + percentageOfCorrectAnswers.toFixed(2) + "%";
    sendUser(percentageOfCorrectAnswers.toFixed(2));
}

// Sends test results to server
async function sendUser(percentage) {
    const response = await fetch("/result", {
        method: "POST",
        body: JSON.stringify({
            user_name: getCookie("login"),
            test_name: "verbal_memory",
            percentage: percentage.toString()
        })
    });
    const responseText = await response.text();
    console.log(responseText);
}
