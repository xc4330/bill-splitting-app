import config from '../config.json'

let instance = null

export default class Ledger{  
    constructor(names) {
        if(!instance){
            instance = this
        }
        let nameArray = names.split('\n')
        let accountMap = new Map()
        nameArray.forEach( name => {
            accountMap.set(name,0.0)
        })
        this.accountMap = accountMap
        return instance
    }

    parseTransaction(transactions){
        let array = transactions.split('\n')
        array.forEach(record => {
            let words = record.split(' ')
            let name = words[config.nameIndex]
            let amt = this.parseAmt(words[config.amountIndex])
            console.log(name, amt)
            let balance = this.accountMap.get(name)
            this.accountMap.set(name, balance + amt)
        })
    }

    parseAmt(amtStr) {
        return parseFloat(amtStr.substring(amtStr.indexOf(config.symbol) + 1))
    }

}