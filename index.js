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

start()

function start() {
    prompt(questions).then(answers => {
        processAnswers(answers)
    })
}

async function processAnswers(answers){
    try {
        let names = await loadFile(answers.name, 'name')
        let transactions = await loadFile(answers.expense, 'expense')
        let ledger = new Ledger()
        ledger.parseNames(names)
        ledger.parseTransactions(transactions)
        ledger.settle()
    } catch (err) {
        console.log(err.message)
        start()
    }
} 

function loadFile(filename, type) {
    return new Promise((resolve, reject) => {
        if(filename === ''){
            reject(Error('File name cannot be empty'))
        }
        fs.readFile(config.filePath + filename, 'utf8', (err, lines) => {
            if (err) reject(err)
            resolve(lines)
        })
    })
}



