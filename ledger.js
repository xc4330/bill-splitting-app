import config from '../config.json'

let instance = null

export default class Ledger{  
    constructor(names) {
        if(!instance){
            instance = this
        }
        let nameArray = names.split('\n')
        let amountMap = new Map()
        nameArray.forEach( name => {
            amountMap.set(name,0)
        })
        this.amountMap = amountMap
        this.creditMap = new Map() // init empty credit records
        this.debitMap = new Map() // init empty debit records
        return instance
    }

    parseTransaction(transactions){
        let total = 0
        transactions.split('\n').forEach(record => {
            let words = record.split(' ')
            let name = words[config.nameIndex]
            let amt = this.parseAmt(words[config.amountIndex])
            let balance = this.amountMap.get(name)
            this.amountMap.set(name, balance + amt)
            total += amt
        })

        let avg = total/this.amountMap.size
        this.amountMap.forEach( (amt, name) => {
            if(amt > avg){
                this.creditMap.set(name, amt-avg)
            } else if(amt < avg){
                this.debitMap.set(name, avg-amt)
            }
        })
        this.settle()
    }

    settle(){
        // return if there is no credit/debit record to settle
        if(this.creditMap.size === 0 || this.debitMap.size === 0){
            return
        }

        let creditMapArray = Array.from(this.creditMap).sort(this.sortKvPair)
        let debitMapArray = Array.from(this.debitMap).sort(this.sortKvPair)
        this.creditMap = new Map(creditMapArray)
        this.debitMap = new Map(debitMapArray)

        let payment = 0
        let payer = debitMapArray[0][0]
        let receiver = creditMapArray[0][0]
        let remainder = debitMapArray[0][1] - creditMapArray[0][1]
        // compare largest credit and debit record
        if(remainder >= 0){
            payment = creditMapArray[0][1]
            // remove credit record
            this.creditMap.delete(receiver)
            // udpate debit record
            this.debitMap.set(debitMapArray[0][0],remainder)
        } else {
            payment = debitMapArray[0][1]
            // remove debit record
            this.debitMap.delete(payer)
            // update credit record
            this.creditMap.set(creditMapArray[0][0],remainder)
        }
        
        console.log(payer + ' pays ' + receiver + ' ' + payment.toFixed(2))

        this.settle()
    }

    sortKvPair(pair1,pair2){
        if(pair1[1] === pair2[1]){
            return 0
        } else {
            return pair1[1] > pair2[1] ? -1 : 1
        }
    }

    parseAmt(amtStr) {
        return parseFloat(amtStr.substring(amtStr.indexOf(config.symbol) + 1))
    }

} 