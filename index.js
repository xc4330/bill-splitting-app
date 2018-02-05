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

export const InputHandler = {
    start() {
        prompt(questions).then(answers => {
            this.processAnswers(answers)
        })
    },
    processAnswers(answers){
        let ledger = new Ledger()
        return this.loadFile(answers.name).then((names) => {
            ledger.parseNames(names)
            return this.loadFile(answers.expense)
        }).then((transactions) => {
            ledger.parseTransactions(transactions)
            ledger.settle()
        }).catch((err) => {
            console.log(err.message)
            this.start()
        })
    }, 
    loadFile(filename) {
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
}

InputHandler.start()