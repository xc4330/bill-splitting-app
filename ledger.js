import config from '../config.json'

let instance = null

export default class Ledger{  
    constructor(names) {
        if(!instance){
            instance = this
        }
        this.amountMap = new Map() // init account records
        this.creditMap = new Map() // init credit records
        this.debitMap = new Map() // init debit records
        return instance
    }

    parseNames(names){
        names.split('\n').forEach( name => {
            name = name.trim().replace(/\s+/g, ' ') // remove extra spaces
            if(name.length > 0){
                this.amountMap.set(name,0)
            } else throw Error('Invalid name format. Please make sure records are in correct format.')
        })
    }

    parseTransactions(transactions){
        let total = 0
        transactions.split('\n').forEach(record => {
            record = record.trim().replace(/\s+/g, ' ') // remove extra spaces
            if(record.length >= 2){ // transaction record should at least have 2 words: name and amount
                let words = record.split(' ')
                let name = words[config.nameIndex]
                let amt = this.strToAmt(words[config.amountIndex])
                if(this.amountMap.has(name)){
                    let balance = this.amountMap.get(name)
                    this.amountMap.set(name, balance + amt)
                    total += amt
                } else throw Error('Unknown name found in transaction records. Please make sure all names are added in the name file.')
            } else throw Error('Invalid transaction record format. Please make sure records are in correct format.')
        })
    
        let avg = total/this.amountMap.size
        this.amountMap.forEach( (amt, name) => {
            if(amt > avg){
                this.creditMap.set(name, amt-avg)
            } else if(amt < avg){
                this.debitMap.set(name, avg-amt)
            }
        })

    }

    settle(){
        // return if there is no credit/debit record to settle
        if(this.creditMap.size === 0 || this.debitMap.size === 0){
            return
        }
        
        // sort debit and credit record based on amount from large to small
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
            this.creditMap.set(creditMapArray[0][0],-remainder)
        }
        
        console.log(payer + ' pays ' + receiver + ' ' + this.amtToStr(payment))

        this.settle()
    }

    sortKvPair(pair1,pair2){
        if(pair1[1] === pair2[1]){
            return 0
        } else {
            return pair1[1] > pair2[1] ? -1 : 1
        }
    }

    strToAmt(amtStr) {
        if (amtStr === undefined) throw Error('Cannot process transaction amount. Please make sure records are in correct format.')
        let amt = parseFloat(
            amtStr.substring(amtStr.indexOf(config.currency) + 1)
        )
        if(isNaN(amt)) throw Error('Cannot process transaction amount. Please make sure records are in correct format.')
        return amt
    }

    amtToStr(amt) {
        return config.currency + amt.toFixed(config.precision)
    }
} 