const TEST_DURATION = 20000; //(milliseconds)
const WAIT_TIME = 200; // time before circle starts moving after starting test (milliseconds)
const HORIZONTAL_MOVE = 1 // px
const HORIZONTAL_USER_MOVE = 30 // px
const DIRECTION_CHANGE_INTERVAL = 800 //(milliseconds)
const REFRESH_INTERVAL = 3 // (milliseconds)

const globalContainer = document.getElementById('analog_tracking');
const circle = document.getElementById('Circle')
const rectangle1 = document.getElementById('Upper_marker')
const rectangle2 = document.getElementById('Lower_marker')
const rectangleGlow = "1px 1px 10px 5px darkgreen"

let isDuringTest = false;
let countDownTime;
let leftBorder = parseFloat(getComputedStyle(rectangle1).left.replace("re", ""));
let rightBorder = leftBorder +  parseFloat(getComputedStyle(rectangle1).width.replace("re", ""));

let globalLeftBorder = 0;
let globalRightBorder = parseFloat(getComputedStyle(globalContainer).width.replace("re", ""));

//Результаты
let score = 0;

document.addEventListener('keydown', function(event) {
    if (isDuringTest) {
        switch (event.key) {
            case "a":
                moveLeft(HORIZONTAL_USER_MOVE)
                break;
            case "A":
                moveLeft(HORIZONTAL_USER_MOVE)
                break;
            case "d":
                moveRight(HORIZONTAL_USER_MOVE)
                break;
            case "D":
                moveRight(HORIZONTAL_USER_MOVE)
                break;
        }
    }
});

function moveLeft(change_value) {
    let curr_left_value = getCurrentValuePX(circle, "left");
    let new_left_value = curr_left_value - change_value;
    circle.style.left = new_left_value + "px";
}

function moveRight(change_value) {
    let curr_left_value = getCurrentValuePX(circle, "left");
    let new_left_value = curr_left_value + change_value;
    circle.style.left = new_left_value + "px";
}

//returns property value (number) of provided element, value should be in px
function getCurrentValuePX(element, property) {
    let style = getComputedStyle(element)
    let curr_left = style.getPropertyValue(property);
    return parseFloat(curr_left.replace("px", ""));
}


function start_test() {
    // Set the date we're counting down to
    isDuringTest = true;
    document.getElementById('Timer').style.display = 'flex';
    document.getElementById('Score').style.display = 'flex';
    document.getElementById('Instruction').style.display = 'none';
    document.getElementById('Start_button').style.display = 'none';
    document.getElementById('bg').style.background = 'black';
    circle.style.display = 'flex';
    document.getElementById('Upper_marker').style.display = 'flex';
    document.getElementById('Lower_marker').style.display = 'flex';
    document.getElementById('Lower_marker').style.top = '3vh';

    setTimeout(function(){
        if (isDuringTest) {
            let direction_change = setInterval(function (){
                let rand_direction = Math.floor(Math.random()*2);
                let iterations = DIRECTION_CHANGE_INTERVAL/REFRESH_INTERVAL;
                let iterator = 0;
                let movement_change = setInterval(function (){
                    iterator++;
                    console.log("Curr:" + getCurrentValuePX(circle, "left") + "RightBorder: " + (globalRightBorder - 100));
                    if (getCurrentValuePX(circle, "left") > (globalRightBorder - 100)) {
                        moveLeft(HORIZONTAL_MOVE);
                    } else if (getCurrentValuePX(circle, "left") < (globalLeftBorder + 100)) {
                        moveRight(HORIZONTAL_MOVE);
                    } else if (rand_direction === 0) {
                        moveLeft(HORIZONTAL_MOVE);
                    } else if (rand_direction === 1) {
                        moveRight(HORIZONTAL_MOVE);
                    }
                    if (iterator >= iterations || !isDuringTest) {
                        clearInterval(movement_change)
                        iterator = 0;
                    }
                }, REFRESH_INTERVAL);

            }, DIRECTION_CHANGE_INTERVAL);

            let countScore = setInterval(function () {
                let circleCenter = getCurrentValuePX(circle, "left") + (getCurrentValuePX(circle, "width")/2);
                if (circleCenter > leftBorder && circleCenter < rightBorder) {
                    rectangle1.style.boxShadow = "1px 1px 10px 5px darkgreen"
                    rectangle2.style.boxShadow = "1px 1px 10px 5px darkgreen"
                    score += REFRESH_INTERVAL;
                    document.getElementById('Score').innerHTML = "Score: " + score;
                } else {
                    rectangle1.style.boxShadow = "1px 1px 10px 5px darkred"
                    rectangle2.style.boxShadow = "1px 1px 10px 5px darkred"
                }
            }, REFRESH_INTERVAL);

            countDownTime = new Date().getTime() + TEST_DURATION;
            // Update the count-down every x milliseconds
            let timer = setInterval(function() {

                // Get today's date and time
                let now = new Date().getTime();

                // Find the distance between now and the count-down date
                let distance = countDownTime - now;

                let seconds = distance/1000;

                document.getElementById("Timer").innerHTML = seconds + "s";

                // If the count-down is finished, write some text
                if (distance <= 0) {
                    clearInterval(direction_change);
                    clearInterval(timer);
                    clearInterval(countScore);
                    document.getElementById("Timer").innerHTML = "Время вышло";
                    finish_test();
                }
            }, REFRESH_INTERVAL);
        }

    }, WAIT_TIME);
}

function finish_test() {
    isDuringTest = false;

    document.getElementById('Final Result').style.display = 'block';
    circle.style.display = 'none';
    document.getElementById('Upper_marker').style.display = 'none';
    document.getElementById('Lower_marker').style.display = 'none';
    document.getElementById('Timer').style.display = 'none';
    document.getElementById('Score').style.display = 'none';
    document.getElementById('Final Result').innerHTML = "Score: " + score;
    document.getElementById('Retry').style.display = 'block';
    sendUser(score);
}

// Sends test results to server
async function sendUser(score) {
    const response = await fetch("/result", {
        method: "POST",
        body: JSON.stringify({
            user_name: getCookie("login"),
            test_name: "analog_tracking",
            score: score.toString()
        })
    });
    const responseText = await response.text();
    console.log(responseText);
}
