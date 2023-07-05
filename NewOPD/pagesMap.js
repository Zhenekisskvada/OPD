let pagesMap = new Map();

pagesMap.set('main', 'main')

pagesMap.set('reg', 'authorization/reg')
pagesMap.set('login', 'authorization/login')
pagesMap.set('account', 'account')

pagesMap.set('lab1', 'lab1/lab_1')
pagesMap.set('anketa', 'anketa')


pagesMap.set('frontend', 'lab1/frontend/frontend')
pagesMap.set('desc_frontend', 'lab1/frontend/desc_frontend' )

pagesMap.set('datascience', 'lab1/datascience/datascience')
pagesMap.set('desc_datascience', 'lab1/datascience/desc_datascience' )

pagesMap.set('sysadmin', 'lab1/sysadmin/sysadmin')
pagesMap.set('desc_sysadmin', 'lab1/sysadmin/desc_sysadmin' )

pagesMap.set('testError', 'lab1/testError')
pagesMap.set('stat', 'lab1/stat')

pagesMap.set('tests', 'tests')
pagesMap.set('all_tests', 'all_tests')

pagesMap.set('pulse_start', 'pulse_start')
pagesMap.set('pulse_after', 'pulse_after')

pagesMap.set('tests_lab2', 'tests_lab2')
pagesMap.set('tests_lab3', 'tests_lab3')
pagesMap.set('tests_lab4', 'tests_lab4')
pagesMap.set('tests_lab5', 'tests_lab5')
pagesMap.set('easy_aud_test', 'tests_lab2/easy_aud_test')
pagesMap.set('easy_aud_stat', 'tests_lab2/stat')
pagesMap.set('easy_eye_test', 'tests_lab2/easy_eye_test')
pagesMap.set('med_eye_test', 'tests_lab2/med_eye_test')
pagesMap.set('hard_eye_test', 'tests_lab2/hard_eye_test')
pagesMap.set('sum_aud_test', 'tests_lab2/sum_aud_test')
pagesMap.set('sum_eye_test', 'tests_lab2/sum_eye_test')
pagesMap.set('easy_moving_test', 'tests_lab3/easy_moving_test')
pagesMap.set('hard_moving_test', 'tests_lab3/hard_moving_test')
pagesMap.set('analog_tracking', 'tests_lab4/analog_tracking')
pagesMap.set('tracking_with_persecution', 'tests_lab4/tracking_with_persecution')
pagesMap.set('red_black_table', 'tests_lab5/red_black_table')
pagesMap.set('landolt_ring', 'tests_lab5/landolt_ring')
pagesMap.set('verbal_memory', 'tests_lab5/verbal_memory')
pagesMap.set('visual_memory', 'tests_lab5/visual_memory')
pagesMap.set('raven_test', 'tests_lab5/raven_test')
pagesMap.set('voinarovsky_test', 'tests_lab5/voinarovsky_test')
pagesMap.set('compasses_test', 'tests_lab5/compasses_test')

module.exports = {
    pagesMap
}
