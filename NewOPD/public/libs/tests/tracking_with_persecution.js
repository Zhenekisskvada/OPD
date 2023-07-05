const TEST_DURATION = 20000; //(milliseconds)
const WAIT_TIME = 200; // time before target starts moving after starting test (milliseconds)
const HORIZONTAL_MOVE = 0.8; // px
const HORIZONTAL_USER_MOVE = 25; // px
const DIRECTION_CHANGE_INTERVAL = 800; //(milliseconds)
const REFRESH_INTERVAL = 3; // (milliseconds)

const globalContainer = document.getElementById('tracking_with_persecution');
const target = document.getElementById('Target');
const crosshair = document.getElementById('Crosshair');
const rectangle1 = document.getElementById('Upper_marker');
const rectangle2 = document.getElementById('Lower_marker');
const rectangleGlow = "1px 1px 10px 5px #888888";
rectangle1.style.boxShadow = rectangleGlow;
rectangle2.style.boxShadow = rectangleGlow;

let isDuringTest = false;
let countDownTime;
let globalLeftBorder = 0;
let globalRightBorder = getCurrentValuePX(globalContainer, "width");
let circleLeftBorder = getCurrentValuePX(target, "left");
let circleRightBorder = getCurrentValuePX(target, "left") + getCurrentValuePX(target, "width");


//Результаты
let score = 0;

document.addEventListener('keydown', function(event) {
    if (isDuringTest) {
        switch (event.key) {
            case "a":
                moveLeft(crosshair, HORIZONTAL_USER_MOVE);
                break;
            case "A":
                moveLeft(crosshair, HORIZONTAL_USER_MOVE);
                break;
            case "d":
                moveRight(crosshair, HORIZONTAL_USER_MOVE);
                break;
            case "D":
                moveRight(crosshair, HORIZONTAL_USER_MOVE);
                break;
        }
    }
});

function moveLeft(element, change_value) {
    let curr_left_value = getCurrentValuePX(element, "left");
    let new_left_value = curr_left_value - change_value;
    element.style.left = new_left_value + "px";
}

function moveRight(element, change_value) {
    let curr_left_value = getCurrentValuePX(element, "left");
    let new_left_value = curr_left_value + change_value;
    element.style.left = new_left_value + "px";
}

//returns property value (number) of provided element, value should be in px
function getCurrentValuePX(element, property) {
    let style = getComputedStyle(element);
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
    target.style.display = 'flex';
    crosshair.style.display = 'flex';
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
                    if (getCurrentValuePX(target, "left") > (globalRightBorder - 100)) {
                        moveLeft(target, HORIZONTAL_MOVE);
                    } else if (getCurrentValuePX(target, "left") < (globalLeftBorder + 100)) {
                        moveRight(target, HORIZONTAL_MOVE);
                    } else if (rand_direction === 0) {
                        moveLeft(target, HORIZONTAL_MOVE);
                    } else if (rand_direction === 1) {
                        moveRight(target, HORIZONTAL_MOVE);
                    }
                    if (iterator >= iterations || !isDuringTest) {
                        clearInterval(movement_change)
                        iterator = 0;
                    }
                }, REFRESH_INTERVAL);

                let countScore = setInterval(function () {
                    let crosshairCenter = getCurrentValuePX(crosshair, "left") + (getCurrentValuePX(crosshair, "width")/2);
                    circleLeftBorder = getCurrentValuePX(target, "left");
                    circleRightBorder = getCurrentValuePX(target, "left") + getCurrentValuePX(target, "width");
                    if (crosshairCenter > circleLeftBorder && crosshairCenter < circleRightBorder) {
                        target.style.boxShadow = "1px 1px 10px 5px darkgreen";
                        score += REFRESH_INTERVAL;
                        document.getElementById('Score').innerHTML = "Score: " + score;
                    } else {
                        target.style.boxShadow = "1px 1px 10px 5px darkred"
                    }
                    if (!isDuringTest) {
                        clearInterval(countScore);
                    }
                }, REFRESH_INTERVAL);

            }, DIRECTION_CHANGE_INTERVAL);

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
    target.style.display = 'none';
    crosshair.style.display = 'none';
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
            test_name: "persecution_tracking",
            score: score.toString()
        })
    });
    const responseText = await response.text();
    console.log(responseText);
}
