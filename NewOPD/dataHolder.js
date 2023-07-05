const frontend_id = 1;
const sysAdmin_id = 2
const dataScientist_id = 3

let user_id
let user_name
let authoriseFlag = false;

let personDS = []
let personFE = []
let personSA = []

let timePercentTests = {
    'easy_audio': {
        'time': null,
        'percentage': null
    },
    'easy_vision': {
        'time': null,
        'percentage': null
    },
    'medium_vision': {
        'time': null,
        'percentage': null
    },
    'hard_vision': {
        'time': null,
        'percentage': null
    },
    'audio_sum': {
        'time': null,
        'percentage': null
    },
    'vision_sum': {
        'time': null,
        'percentage': null
    }
}

let dispersionTests = {
    'easy_moving': {
        'dispersion': null,
        'negative_dispersion': null,
        'positive_dispersion': null
    }
}

let manyArgsTests = {
    'hard_moving': {
        'slow_dispersion' : null,
        'middle_dispersion' : null,
        'fast_dispersion' : null,

        'slow_negative_dispersion' : null,
        'middle_negative_dispersion' : null,
        'fast_negative_dispersion' : null,

        'slow_positive_dispersion' : null,
        'middle_positive_dispersion' : null,
        'fast_positive_dispersion' : null,

        'average_dispersion' : null
    }
}

let scoreTests = {
    'analog_tracking': {
        'score': null
    },
    'persecution_tracking': {
        'score': null
    },
    'visual_memory': {
        'score': null
    }
}

let correctIncorrectTests = {
    'compass': {
        'correct': null,
        'incorrect': null
    },
    'landolt_ring': {
        'correct': null,
        'incorrect': null
    }
}

let correctTests = {
    'raven': {
        'correct': null
    },
    'voinarovsky': {
        'correct': null
    }
}

let scoreTimeTests = {
    'red_n_black': {
        'score': null,
        'time': null
    }
}
let percentageTests = {
    'verbal_memory': {
        'percentage': null
    }
}

let pulse = {
    'before': [],
    'after': []
}

let dataScience = []
let frontEnd = []
let sysAdmin = []

let pvk = []

let tempTests = []
let predictedSkills = []
let tempSkills = {}
let tempProfession

module.exports = {
    frontend_id,
    sysAdmin_id,
    dataScientist_id,
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
}
