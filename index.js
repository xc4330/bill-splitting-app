import { prompt } from 'inquirer'
import fs from 'fs'
import Ledger from './ledger.js'
import config from './config.json'

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
    processAnswers(answers)
})

async function processAnswers(answers){
    let names = ''
    let transactions = ''

    try {
        names = await loadFile(answers.name, 'name')
    } catch (err) {
        console.log('read name file failed')
        console.log(err)
    }

    try {
        transactions = await loadFile(answers.expense, 'expense')
    } catch (err) {
        console.log('read expense file failed')
        console.log(err)
    }

    let ledger = new Ledger(names)
    ledger.parseTransaction(transactions)
    console.log(ledger)

} 

function loadFile(filename, type) {
    return new Promise((resolve, reject) => {
        fs.readFile(config.filePath + filename, 'utf8', (err, lines) => {
            if (err) reject(err)
            console.log('OK: ' + filename)
            resolve(lines)
        })
    })
}



