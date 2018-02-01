import { prompt } from 'inquirer'
import async from 'async'
import util from './util/util.js'

const questions = [
    { 
        type : 'input',
        name : 'name',
        message : 'Enter name list file name:'
    },
    {
        type : 'input',
        name : 'expense',
        message : 'Enter expense transactions file name:'
    },
]

prompt(questions).then(answers => {
    console.log(answers)
    async.seq(
        function(callback) {
            util.loadFile(answers.name, 'name', data => {
                util.parseName(data)
                callback()
            })
        },
        function(callback){
            util.loadFile(answers.expense, 'expense', data => {
                util.parseTransaction(data)
                callback()
            })
        },
    )(function(err) {
        if(err) {
            console.log(err)
        }
    })
})



