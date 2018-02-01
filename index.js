import { prompt } from 'inquirer'

const questions = [
    { 
        type : 'input',
        name : 'name',
        message : 'Enter name list file name:'
    },
    {
        type : 'input',
        name : 'transactions',
        message : 'Enter expense transactions file name:'
    },
];

prompt(questions).then(answers => {
    console.log(answers)
    
})

const loadFile = function(fileName, type) {
    console.log()
}

module.exports.loadFile = loadFile
