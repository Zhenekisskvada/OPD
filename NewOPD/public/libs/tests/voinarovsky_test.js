function start_test() {
    document.getElementById('Instruction').style.display = 'none';
    document.getElementById('Start_button').style.display = 'none';
    document.getElementById('Finish_button').style.display = 'block';
    document.getElementById('bg').style.background = 'black';
    document.getElementById('container-voinarovsky').style.zIndex = '10';
}

function finish_test(){
    const TRUE_RESULT = new Array(90);
    TRUE_RESULT[1] = 0; TRUE_RESULT[2] = 1; TRUE_RESULT[3] = 0;
    TRUE_RESULT[4] = 0; TRUE_RESULT[5] = 1; TRUE_RESULT[6] = 0;
    TRUE_RESULT[7] = 0; TRUE_RESULT[8] = 0; TRUE_RESULT[9] = 1;
    TRUE_RESULT[10] = 1; TRUE_RESULT[11] = 0; TRUE_RESULT[12] = 0;
    TRUE_RESULT[13] = 0; TRUE_RESULT[14] = 0; TRUE_RESULT[15] = 1;
    TRUE_RESULT[16] = 1; TRUE_RESULT[17] = 0; TRUE_RESULT[18] = 0;
    TRUE_RESULT[19] = 1; TRUE_RESULT[20] = 0; TRUE_RESULT[21] = 0;
    TRUE_RESULT[22] = 0; TRUE_RESULT[23] = 1; TRUE_RESULT[24] = 0;
    TRUE_RESULT[25] = 0; TRUE_RESULT[26] = 0; TRUE_RESULT[27] = 1;
    TRUE_RESULT[28] = 0; TRUE_RESULT[29] = 0; TRUE_RESULT[30] = 1;
    TRUE_RESULT[31] = 0; TRUE_RESULT[32] = 0; TRUE_RESULT[33] = 1;
    TRUE_RESULT[34] = 1; TRUE_RESULT[35] = 0; TRUE_RESULT[36] = 0;
    TRUE_RESULT[37] = 0; TRUE_RESULT[38] = 0; TRUE_RESULT[39] = 1;
    TRUE_RESULT[40] = 0; TRUE_RESULT[41] = 1; TRUE_RESULT[42] = 0;
    TRUE_RESULT[43] = 0; TRUE_RESULT[44] = 1; TRUE_RESULT[45] = 0;
    TRUE_RESULT[46] = 0; TRUE_RESULT[47] = 1; TRUE_RESULT[48] = 0;
    TRUE_RESULT[49] = 0; TRUE_RESULT[50] = 1; TRUE_RESULT[51] = 0;
    TRUE_RESULT[52] = 0; TRUE_RESULT[53] = 0; TRUE_RESULT[54] = 1;
    TRUE_RESULT[55] = 1; TRUE_RESULT[56] = 0; TRUE_RESULT[57] = 0;
    TRUE_RESULT[58] = 0; TRUE_RESULT[59] = 0; TRUE_RESULT[60] = 1;
    TRUE_RESULT[61] = 1; TRUE_RESULT[62] = 0; TRUE_RESULT[63] = 0;
    TRUE_RESULT[64] = 0; TRUE_RESULT[65] = 0; TRUE_RESULT[66] = 1;
    TRUE_RESULT[67] = 0; TRUE_RESULT[68] = 1; TRUE_RESULT[69] = 0;
    TRUE_RESULT[70] = 0; TRUE_RESULT[71] = 0; TRUE_RESULT[72] = 1;
    TRUE_RESULT[73] = 1; TRUE_RESULT[74] = 0; TRUE_RESULT[75] = 0;
    TRUE_RESULT[76] = 0; TRUE_RESULT[77] = 1; TRUE_RESULT[78] = 0;
    TRUE_RESULT[79] = 1; TRUE_RESULT[80] = 0; TRUE_RESULT[81] = 0;
    TRUE_RESULT[82] = 0; TRUE_RESULT[83] = 0; TRUE_RESULT[84] = 1;
    TRUE_RESULT[85] = 0; TRUE_RESULT[86] = 0; TRUE_RESULT[87] = 1;
    TRUE_RESULT[88] = 1; TRUE_RESULT[89] = 0; TRUE_RESULT[90] = 0;

    let result = 0;
    let form = document.getElementById('test')
    for(let i = 0; i < 90; i++) {
        if (form.elements[i].checked) {
            result = result + TRUE_RESULT[i+1];
        }
    }
    document.getElementById('Final Result').style.display = 'block';
    document.getElementById('Final Result').innerHTML = 'Верных ответов ' + result + '<br><br>' +
        '<a href="https://testometrika.com/blog/the-correct-answers-to-the-logical-test-wojnarowski/">Подробное разъяснение всех задач</a>';
    document.getElementById('Finish_button').style.display = 'none';
    document.getElementById('container-voinarovsky').style.display = 'none';
    document.getElementById('Retry').style.display = 'block';
    document.getElementById('Retry').style.top = '10vh';
    sendUser(result);
}

// Sends test results to server
async function sendUser(result) {
    const response = await fetch("/result", {
        method: "POST",
        body: JSON.stringify({
            user_name: getCookie("login"),
            test_name: "voinarovsky",
            correct: result.toString()
        })
    });
    const responseText = await response.text();
    console.log(responseText);
}