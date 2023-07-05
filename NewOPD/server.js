const {
    runQuery,
    registerUser,
    insertPVK,
    saveMarks,
    savePulse
} = require("./dbProperties.js");

const {
    frontend_id,
    sysAdmin_id,
    dataScientist_id
} = require("./dataHolder.js");

let {
    user_id,
    user_name,
    authoriseFlag,
    personDS,
    personFE,
    personSA,
    dataScience,
    frontEnd,
    sysAdmin,
    timePercentTests,
    dispersionTests,
    manyArgsTests,
    scoreTests,
    correctIncorrectTests,
    correctTests,
    scoreTimeTests,
    percentageTests,
    pulse,
    pvk,
    tempTests,
    tempSkills,
    tempProfession,
    predictedSkills
} = require("./dataHolder.js");

const {
    runModelTS,
    startTS
} = require("./tests_to_skills")

const {
    runModelSP,
    startSP
} = require("./skills_to_profession")

const {
    pagesMap
} = require("./pagesMap.js");

// server initialization
const port = 9000;
const host = 'localhost';

// server properties
let fs = require('fs');
let express = require('express');
let bodyParser = require('body-parser');
let urlEncodeParser = bodyParser.urlencoded({ extended: false });
let app = express();
const cookieManager = require('./public/libs/CookieManager.js');
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use('/public', express.static('public'));
app.set('view engine', 'ejs');

startTS()
    .then(() => {
        startSP()
            .then(
                app.listen(port, host, function (){
                    console.log('Server - http://' + host + ':' + port);
                })
            )
    })


async function reloadPersonStat(user_id, needToCheck = ["dataScience", "frontEnd", "sysAdmin"]) {

    if (needToCheck.includes("dataScience")) {
        personDS = []
        await runQuery(`SELECT quality_name, mark FROM important_qualities_result join important_quality on important_qualities_result.quality_id = important_quality.id WHERE user_id = ${user_id} AND profession_id = ${dataScientist_id}`).then((rows) => {
            rows.forEach((row) => {
                personDS.push([row["quality_name"], row.mark])
            })
        })
    }

    if (needToCheck.includes("frontEnd")) {
        personFE = []
        await runQuery(`SELECT quality_name, mark FROM important_qualities_result join important_quality on important_qualities_result.quality_id = important_quality.id WHERE user_id = ${user_id} AND profession_id = ${frontend_id}`).then((rows) => {
            rows.forEach((row) => {
                personFE.push([row["quality_name"], row.mark])
            })
        })
    }

    if (needToCheck.includes("sysAdmin")) {
        personSA = []
        await runQuery(`SELECT quality_name, mark FROM important_qualities_result join important_quality on important_qualities_result.quality_id = important_quality.id WHERE user_id = ${user_id} AND profession_id = ${sysAdmin_id}`).then((rows) => {
            rows.forEach((row) => {
                personSA.push([row["quality_name"], row.mark])
            })
        })
    }
}

async function clearPersonStat(profession) {
    if (profession === "frontend") {
        personFE = []
        await runQuery(`DELETE FROM important_qualities_result WHERE user_id = ${user_id} AND profession_id = 1`).then(r => r)
    } else if (profession === "sysAdmin") {
        personSA = []
        await runQuery(`DELETE FROM important_qualities_result WHERE user_id = ${user_id} AND profession_id = 2`).then(r => r)
    } else if (profession === "dataScience") {
        personDS = []
        await runQuery(`DELETE FROM important_qualities_result WHERE user_id = ${user_id} AND profession_id = 3`).then(r => r)
    }
}

async function reloadOverallStat() {

    dataScience = []
    frontEnd = []
    sysAdmin = []

    let tempDS = {}
    let tempFE = {}
    let tempSA = {}

    await runQuery(`SELECT quality_name, mark FROM important_qualities_result join important_quality on important_qualities_result.quality_id = important_quality.id WHERE profession_id = ${dataScientist_id}`).then((rows) => {
        rows.forEach((row) => {
            if (row["quality_name"] in Object.keys(tempDS)) {
                tempDS[row["quality_name"]].push(row.mark)
            } else {
                tempDS[row["quality_name"]] = [row.mark]
            }
        })
    })

    await runQuery(`SELECT quality_name, mark FROM important_qualities_result join important_quality on important_qualities_result.quality_id = important_quality.id WHERE profession_id = ${frontend_id}`).then((rows) => {
        rows.forEach((row) => {
            if (row["quality_name"] in Object.keys(tempFE)) {
                tempFE[row["quality_name"]].push(row.mark)
            } else {
                tempFE[row["quality_name"]] = [row.mark]
            }
        })
    })

    await runQuery(`SELECT quality_name, mark FROM important_qualities_result join important_quality on important_qualities_result.quality_id = important_quality.id WHERE profession_id = ${sysAdmin_id}`).then((rows) => {
        rows.forEach((row) => {
            if (row["quality_name"] in Object.keys(tempSA)) {
                tempSA[row["quality_name"]].push(row.mark)
            } else {
                tempSA[row["quality_name"]] = [row.mark]
            }
        })
    })


    for (let i of Object.keys(tempDS)) {
        let sum = 0
        let count = 0
        for (let j of tempDS[i]) {
            count += 1
            sum += j
        }
        dataScience.push([i, sum / count])
    }

    for (let i of Object.keys(tempFE)) {
        let sum = 0
        let count = 0
        for (let j of tempFE[i]) {
            count += 1
            sum += j
        }
        frontEnd.push([i, sum / count])
    }

    for (let i of Object.keys(tempSA)) {
        let sum = 0
        let count = 0
        for (let j of tempSA[i]) {
            count += 1
            sum += j
        }
        sysAdmin.push([i, sum / count])
    }

    // console.log(frontEnd)
    // console.log(sysAdmin)
    // console.log(dataScience)

// sorting lists by values
    dataScience.sort((a, b) => a[1] - b[1]).reverse()
    frontEnd.sort((a, b) => a[1] - b[1]).reverse()
    sysAdmin.sort((a, b) => a[1] - b[1]).reverse()
}

async function reloadTestStat(user_id) {
    let testNames = []

    await runQuery(`SELECT name FROM test`).then((names) => {
        names.forEach((name) => {
            testNames.push(name['name'])
        })
    })

    for (let name of testNames) {
        await runQuery(`SELECT * FROM ${name + '_result'} WHERE user_id = ${user_id}`)
            .then((rows) => {
                if (rows.length > 0) {
                    switch (name) {
                        case 'easy_audio':
                        case 'easy_vision':
                        case 'medium_vision':
                        case 'hard_vision':
                        case 'audio_sum':
                        case 'vision_sum':
                            timePercentTests[name]["time"] = rows[rows.length-1]['time']
                            timePercentTests[name]['percentage'] = rows[rows.length-1]['percentage']
                            break
                        case 'easy_moving':
                            dispersionTests[name]['dispersion'] = rows[rows.length-1]['dispersion']
                            dispersionTests[name]['negative_dispersion'] = rows[rows.length-1]['negative_dispersion']
                            dispersionTests[name]['positive_dispersion'] = rows[rows.length-1]['positive_dispersion']
                            break
                        case 'hard_moving':
                            manyArgsTests[name]['slow_dispersion'] = rows[rows.length-1]['slow_dispersion']
                            manyArgsTests[name]['middle_dispersion'] = rows[rows.length-1]['middle_dispersion']
                            manyArgsTests[name]['fast_dispersion'] = rows[rows.length-1]['fast_dispersion']

                            manyArgsTests[name]['slow_negative_dispersion'] = rows[rows.length-1]['slow_negative_dispersion']
                            manyArgsTests[name]['middle_negative_dispersion'] = rows[rows.length-1]['middle_negative_dispersion']
                            manyArgsTests[name]['fast_negative_dispersion'] = rows[rows.length-1]['fast_negative_dispersion']

                            manyArgsTests[name]['slow_positive_dispersion'] = rows[rows.length-1]['slow_positive_dispersion']
                            manyArgsTests[name]['middle_positive_dispersion'] = rows[rows.length-1]['middle_positive_dispersion']
                            manyArgsTests[name]['fast_positive_dispersion'] = rows[rows.length-1]['fast_positive_dispersion']

                            manyArgsTests[name]['average_dispersion'] = rows[rows.length-1]['average_dispersion']

                            break
                        case 'analog_tracking':
                        case 'persecution_tracking':
                        case 'visual_memory':
                            scoreTests[name]['score'] = rows[rows.length-1]['score']
                            break
                        case 'compass':
                        case 'landolt_ring':
                            correctIncorrectTests[name]['correct'] = rows[rows.length-1]['correct']
                            correctIncorrectTests[name]['incorrect'] = rows[rows.length-1]['incorrect']
                            break
                        case 'raven':
                        case 'voinarovsky':
                            correctTests[name]['correct'] = rows[rows.length-1]['correct']
                            break
                        case 'red_n_black':
                            scoreTimeTests[name]['score'] = rows[rows.length-1]['score']
                            scoreTimeTests[name]['time'] = rows[rows.length-1]['time']
                            break
                        case 'verbal_memory':
                            percentageTests[name]['percentage'] = rows[rows.length-1]['percentage']
                            break
                    }
                }
            })
    }
}

async function reloadPulseStat(user_id) {
    return await runQuery(`SELECT * FROM pulse_measurement WHERE user_id = ${user_id}`)
        .then((rows) => {
            if (rows.length > 0) {
                for (let row of rows) {
                    if (row['when_pulse_id'] === 1) {
                        pulse['before'].push(row['pulse'])
                    } else if (row['when_pulse_id'] === 2) {
                        pulse['after'].push(row['pulse'])
                    }
                }
            }
        })
}

async function getPVK(user_id, profession_id) {

    pvk = []

    await runQuery(`SELECT * FROM important_qualities_result WHERE user_id = ${user_id} AND profession_id = ${profession_id}`)
        .then(rows => {
            if (rows.length > 0) {
                for (let row of rows) {
                    pvk.push(row.quality_id)
                }
            }
        })

}

function fillTempTests(user_id) {
    tempTests = []

    for (let test in timePercentTests) {
        tempTests.push(timePercentTests[test].time)
        tempTests.push(timePercentTests[test].percentage)
    }

    for (let test in dispersionTests) {
        tempTests.push(dispersionTests[test].dispersion)
        tempTests.push(dispersionTests[test].negative_dispersion)
        tempTests.push(dispersionTests[test].positive_dispersion)
    }


    for (let test in manyArgsTests) {
        tempTests.push(manyArgsTests[test].slow_dispersion)
        tempTests.push(manyArgsTests[test].middle_dispersion)
        tempTests.push(manyArgsTests[test].fast_dispersion)
        tempTests.push(manyArgsTests[test].slow_negative_dispersion)
        tempTests.push(manyArgsTests[test].middle_negative_dispersion)
        tempTests.push(manyArgsTests[test].fast_negative_dispersion)
        tempTests.push(manyArgsTests[test].slow_positive_dispersion)
        tempTests.push(manyArgsTests[test].middle_positive_dispersion)
        tempTests.push(manyArgsTests[test].fast_positive_dispersion)
        tempTests.push(manyArgsTests[test].average_dispersion)
    }


    for (let test in scoreTests) {
        tempTests.push(scoreTests[test].score)
    }


    for (let test in correctIncorrectTests) {
        tempTests.push(correctIncorrectTests[test].correct)
        tempTests.push(correctIncorrectTests[test].incorrect)
    }


    for (let test in correctTests) {
        tempTests.push(correctTests[test].correct)
    }


    for (let test in scoreTimeTests) {
        tempTests.push(scoreTimeTests[test].time)
        tempTests.push(scoreTimeTests[test].score)
    }


    for (let test in percentageTests) {
        tempTests.push(percentageTests[test].percentage)
    }

    console.log(tempTests)
}

async function matchSkills() {
    tempSkills = []
    predictedSkills = []

    predictedSkills = await runModelTS(tempTests)

    await runQuery('select * from important_quality')
        .then((rows) => {
            for (let i = 0; i < rows.length; i++) {
                let name = rows[i]['quality_name']
                if (predictedSkills[i] !== 0) {
                    tempSkills[name] = parseInt(predictedSkills[i].toFixed(0))
                }
            }
        })
    console.log(tempSkills)
}

async function matchProfession() {
    tempProfession = ''

    let prediction = await runModelSP(predictedSkills)


    if (prediction === 1) {
        tempProfession = 'Frontend-разработчик'
    } else if (prediction === 2) {
        tempProfession = 'Системный администратор'
    } else if (prediction === 3) {
        tempProfession = 'Data Scientist'
    } else {
        tempProfession = 'Не удалось определить профессию'
    }
}

app.post('/registration', urlEncodeParser, function(req, res) {
    if(!req.body) return res.sendStatus(400);
    console.log(req.body);

    user_name = req.body.name;
    let user_email = req.body.email;
    let user_password = req.body.password;
    //let isExpert = req.body.expert; TODO
    authoriseFlag = true;

    registerUser(user_name, user_email, user_password)
        .then(() => {
            runQuery(`SELECT id FROM user WHERE email = '${user_email}'`)
                .then(r => {
                    user_id = r[0]["id"]
                    res.cookie('login', user_name);
                    res.render('main');
                })
        })
})

app.post('/login', urlEncodeParser, function(req, res) {
    if(!req.body) return res.sendStatus(400);

    console.log(req.body);

    const user_email = req.body.user_email;
    const user_password = req.body.user_password;

    runQuery(`SELECT password FROM user WHERE email = '${user_email}'`)
        .then(r => {
            try {
                if (user_password === r[0]["password"]) {
                    console.log("Успешная авторизация")
                    authoriseFlag = true

                    runQuery(`SELECT id, name FROM user WHERE email = '${user_email}'`)
                        .then(r => {
                            user_name = r[0]["name"]
                            res.cookie('login', user_name);

                            user_id = r[0]["id"]

                            reloadPersonStat(user_id)
                                .then(() => {
                                    reloadTestStat(user_id)
                                        .then(() => {
                                            reloadPulseStat(user_id)
                                                .then(() => {
                                                    fillTempTests()
                                                    matchSkills()
                                                        .then(() => {
                                                            matchProfession()
                                                                .then(() => {
                                                                    res.render("account", {
                                                                        user_name: user_name,
                                                                        DS: personDS,
                                                                        FE: personFE,
                                                                        SA: personSA,
                                                                        timePercentTests: timePercentTests,
                                                                        dispersionTests: dispersionTests,
                                                                        manyArgsTests: manyArgsTests,
                                                                        scoreTests: scoreTests,
                                                                        correctIncorrectTests: correctIncorrectTests,
                                                                        correctArgTests: correctTests,
                                                                        scoreTimeTests: scoreTimeTests,
                                                                        percentageTests: percentageTests,
                                                                        pulse: pulse,
                                                                        predictedSkills: tempTests.includes(null) ? null : tempSkills,
                                                                        predictedProfession: tempTests.includes(null) ? null : tempProfession
                                                                    })
                                                                })
                                                        })
                                                })
                                        })
                                })
                        })

                } else {
                    console.log("Неверный пароль")
                    res.render('authorization/login');
                }
            } catch (e) {
                console.log("Нет данного пользователя");
                res.render('authorization/reg');
            }

        })
})

app.post('/add', urlEncodeParser, function(req, res) {
    if(!req.body) return res.sendStatus(400)

    let profession = Object.keys(req.body)[0]

    insertPVK(req.body, user_id)
        .then(() => {
            reloadPersonStat(user_id)
                .then(() => {
                    if (profession.startsWith('f')) {
                        getPVK(user_id, 1)
                            .then(() => {
                                res.render("lab1/mark", {lst: personFE, pvk: pvk, prof: 'f'})
                            })
                    }

                    if (profession.startsWith('d')) {
                        getPVK(user_id, 3)
                            .then(() => {
                                res.render("lab1/mark", {lst: personDS, pvk: pvk, prof: 'd'})
                            })
                    }
                    if (profession.startsWith('a')) {
                        getPVK(user_id, 2)
                            .then(() => {
                                res.render("lab1/mark", {lst: personSA, pvk: pvk, prof: 's'})
                            })
                    }
                })
        })
})

app.post('/mark', urlEncodeParser, function(req, res) {
    if (!req.body) return res.sendStatus(400)

    console.log(req.body)

    saveMarks(req.body, user_id).then(() => {
        reloadPersonStat(user_id)
            .then(() => {
                reloadTestStat(user_id)
                    .then(() => {
                        reloadPulseStat(user_id)
                            .then(() => {
                                reloadPulseStat(user_id)
                                    .then(() => {
                                        fillTempTests()
                                        matchSkills()
                                            .then(() => {
                                                matchProfession()
                                                    .then(() => {
                                                        res.render("account", {
                                                            user_name: user_name,
                                                            DS: personDS,
                                                            FE: personFE,
                                                            SA: personSA,
                                                            timePercentTests: timePercentTests,
                                                            dispersionTests: dispersionTests,
                                                            manyArgsTests: manyArgsTests,
                                                            scoreTests: scoreTests,
                                                            correctIncorrectTests: correctIncorrectTests,
                                                            correctArgTests: correctTests,
                                                            scoreTimeTests: scoreTimeTests,
                                                            percentageTests: percentageTests,
                                                            pulse: pulse,
                                                            predictedSkills: tempTests.includes(null) ? null : tempSkills,
                                                            predictedProfession: tempTests.includes(null) ? null : tempProfession
                                                        })
                                                    })
                                            })

                                    })
                            })
                    })
            })
    })
})

app.get('/', function (req, res) {
    res.render('main');
});

app.get('/:name', function(req, res) {
    let page = pagesMap.get(req.params.name);

    switch (req.params.name) {

        case 'main': {
            res.render(page);
        } break;

        case 'stat': {
            reloadOverallStat()
                .then(() => {
                    res.render(page, {dataScience: dataScience, frontEnd: frontEnd, sysAdmin: sysAdmin});
                })
        } break;

        case 'desc_frontend': {
            reloadOverallStat()
                .then(() => {
                    res.render(page, {frontEnd: frontEnd});
                })
        } break;

        case 'mark': {
            reloadPersonStat().then(() => {
                res.render(page, {FE: personFE});
            })
        } break;
        case 'anketa': {
            reloadPersonStat().finally(() => {
                res.render(page, {frontEnd: frontEnd});
            })
        } break;

        case "frontend": {
            if (authoriseFlag) {
                clearPersonStat("frontend").then(() => {
                    res.render(page);
                })
            } else {
                res.render('authorization/login');
            }
        } break;

        case "sysadmin": {
            if (authoriseFlag) {
                clearPersonStat("sysAdmin").then(() => {
                    res.render(page);
                })
            } else {
                res.render('authorization/login');
            }
        } break;

        case "datascience": {
            if (authoriseFlag) {
                clearPersonStat("dataScience").then(() => {
                    res.render(page);
                })
            } else {
                res.render('authorization/login');
            }
        } break;

        case "desc_datascience": {
            reloadOverallStat().then(() => {
                res.render(page, {dataScience: dataScience});
            })
        } break;

        case "desc_sysadmin": {
            reloadOverallStat(dataScience, frontEnd, sysAdmin).then(() => {
                res.render(page, {sysAdmin: sysAdmin});
            })
        } break;

        case "login": {
            if (authoriseFlag) {
                reloadPersonStat(user_id).then(() => {
                    reloadTestStat(user_id).then(() => {
                        reloadPulseStat(user_id)
                            .then(() => {
                                fillTempTests()
                                matchSkills()
                                    .then(() => {
                                        matchProfession()
                                            .then(() => {
                                                res.render("account", {
                                                    user_name: user_name,
                                                    DS: personDS,
                                                    FE: personFE,
                                                    SA: personSA,
                                                    timePercentTests: timePercentTests,
                                                    dispersionTests: dispersionTests,
                                                    manyArgsTests: manyArgsTests,
                                                    scoreTests: scoreTests,
                                                    correctIncorrectTests: correctIncorrectTests,
                                                    correctArgTests: correctTests,
                                                    scoreTimeTests: scoreTimeTests,
                                                    percentageTests: percentageTests,
                                                    pulse: pulse,
                                                    predictedSkills: tempTests.includes(null) ? null : tempSkills,
                                                    predictedProfession: tempTests.includes(null) ? null : tempProfession
                                                })
                                            })
                                    })
                            })
                    })
                })

            } else {
                res.render(page)
            }
        } break;

        case 'all_tests':
        case 'pulse_start':
        case 'easy_aud_test':
        case 'easy_eye_test':
        case 'med_eye_test':
        case 'hard_eye_test':
        case 'sum_aud_test':
        case 'sum_eye_test':
        case 'easy_moving_test':
        case 'hard_moving_test':
        case 'analog_tracking':
        case 'tracking_with_persecution':
        case 'visual_memory':
        case 'compasses_test':
        case 'landolt_ring':
        case 'raven_test':
        case 'voinarovsky_test':
        case 'red_black_table':
        case 'verbal_memory': {
            if (authoriseFlag) {
                // after_pulse_load = page;
                // res.render("pulse_start")
                res.render(page);
            } else {
                res.render('authorization/login');
            }
        } break;

        case undefined: {
            res.sendFile(__dirname + '/404.html');
        } break;

        default: {
            res.render(page)
        }
    }

});

app.post('/result', urlEncodeParser, function(req, res) {
    if(!req.body) return res.sendStatus(400);

    let data = "";

    req.on("data", chunk => {
        data += chunk;
    });

    req.on("end", () => {
        console.log(data);
        let obj = JSON.parse(data); // contains username, test name, result variables
        res.end("Данные успешно получены");
        let user_name = obj["user_name"];
        let test_name = obj["test_name"];

        let table_name = test_name + '_result';

        if (['easy_audio', 'easy_vision', 'medium_vision', 'hard_vision', 'audio_sum', 'vision_sum'].includes(test_name)) {
            console.log("sending to db");
            // time, percentage
            runQuery(`INSERT INTO ${table_name} (user_id, time, percentage)
                      VALUES ('${user_id}', ${obj.time}, ${obj.percentage})`).then(r => r)
        } else if (test_name === 'easy_moving') {
            // dispersion, neg, pos
            runQuery(`INSERT INTO ${table_name} (user_id, dispersion, negative_dispersion, positive_dispersion)
                      VALUES ('${user_id}', ${obj.dispersion}, ${obj.negative_dispersion}, ${obj.positive_dispersion})`).then(r => r)
        } else if (test_name === 'hard_moving') {
            // dispersion, neg, pos for 3 circles and average
            runQuery(`INSERT INTO ${table_name} (user_id,
                                                 slow_dispersion,
                                                 middle_dispersion,
                                                 fast_dispersion,
                                                 slow_negative_dispersion,
                                                 middle_negative_dispersion,
                                                 fast_negative_dispersion,
                                                 slow_positive_dispersion,
                                                 middle_positive_dispersion,
                                                 fast_positive_dispersion,
                                                 average_dispersion)
                      VALUES ('${user_id}',
                              ${obj.slow_dispersion},
                              ${obj.middle_dispersion},
                              ${obj.fast_dispersion},
                              ${obj.slow_negative_dispersion},
                              ${obj.middle_negative_dispersion},
                              ${obj.fast_negative_dispersion},
                              ${obj.slow_positive_dispersion},
                               ${obj.middle_positive_dispersion},
                              ${obj.fast_positive_dispersion},
                              ${obj.average_dispersion})`).then(r => r)

        } else if (['analog_tracking', 'persecution_tracking', 'visual_memory'].includes(test_name)) {
            // score
            runQuery(`INSERT INTO ${table_name} (user_id, score) VALUES ('${user_id}', ${obj.score})`).then(r => r)
        } else if (['compass', 'landolt_ring'].includes(test_name)) {
            // correct, incorrect
            runQuery(`INSERT INTO ${table_name} (user_id, correct, incorrect) VALUES ('${user_id}', ${obj.correct}, ${obj.incorrect})`).then(r => r)
        } else if (['raven', 'voinarovsky'].includes(test_name)) {
            // correct
            runQuery(`INSERT INTO ${table_name} (user_id, correct) VALUES ('${user_id}', ${obj.correct})`).then(r => r)
        } else if (test_name === 'red_n_black') {
            // score, time
            runQuery(`INSERT INTO ${table_name} (user_id, score, time) VALUES ('${user_id}', ${obj.score}, ${obj.time})`).then(r => r)
        } else if (test_name === 'verbal_memory') {
            // percentage
            runQuery(`INSERT INTO ${table_name} (user_id, percentage) VALUES ('${user_id}', ${obj.percentage})`).then(r => r)
        }
    });
});

app.post('/pulse_start', urlEncodeParser, function(req, res) {
    if(!req.body) return res.sendStatus(400);

    try {
        savePulse(user_id, 1,  req.body.pulse).then(() => {
            res.render('all_tests')
        })
    } catch (e) {
        res.render('authorization/login')
    }

});

app.post('/pulse_end', urlEncodeParser, function(req, res) {
    if(!req.body) return res.sendStatus(400);

    savePulse(user_id, 2,  req.body.pulse).then(() => {
        res.render('main')
    })
});
