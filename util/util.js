import fs from 'fs'
import Account from '../model/account.js'
import config from '../config.json'

export default class Util {
    static loadFile(filename, type, callback) {
        fs.readFile(config.filePath + filename, 'utf8', (err, data) => {
            if (err) throw err
            console.log('OK: ' + filename)
            callback(data)
        })
    }
    
    static parseName(data) {
        let names = data.split('\n')
        console.log(names)
    }
    
    static parseTransaction(data) {
        let transactions = data.split('\n')
        transactions.forEach(record => {
            let words = record.split(' ')
            let amt = this.parseAmt(words[config.amountIndex])
            let account = new Account(words[config.nameIndex], amt)
            console.log(account)
        })
    }
    
    static parseAmt(amtStr) {
        return parseFloat(amtStr.substring(amtStr.indexOf(config.symbol) + 1))
    }
}

