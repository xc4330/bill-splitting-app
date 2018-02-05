import Ledger from '../ledger.js'

describe('ledger.js', () => {

    let testLedger = new Ledger()
    afterEach(() => {
        // reset mappings in ledger
        testLedger.amountMap = new Map()
        testLedger.creditMap = new Map()
        testLedger.debitMap = new Map()
    })

    describe('constructor', () => {
        test('should construct Ledger object that contains 3 mappings', () => {
            let ledger = new Ledger()
            expect(ledger.amountMap).toEqual(new Map())
            expect(ledger.creditMap).toEqual(new Map())
            expect(ledger.debitMap).toEqual(new Map())
        })
    })

    describe('parseNames', () => {
        test('should create mappings from name to amount', () => {
            let testNames = 'a\n b\n c  '
            let expected = new Map([
                ['a', 0],
                ['b', 0],
                ['c', 0]
            ])
            testLedger.parseNames(testNames)
            expect(testLedger.amountMap).toEqual(expected);
        })
        test('should throw \'Invalid name format\' if there is empty row', () => {
            let testNames = 'a\nb\n'
            expect(() => {
                testLedger.parseNames(testNames)
            }).toThrow(/Invalid name format/)
        })
    })

    describe('strToAmt', () => {
        test('should parse a transaction amount string to a float number', () => {
            expect(testLedger.strToAmt('$5')).toBeCloseTo(5.0)
        })

        test('should throw \'Invalid transaction amount\' if the string cannot be parsed to a float number', () => {
            expect(() => { 
                testLedger.strToAmt('$a')
            }).toThrow(/Invalid transaction amount/)
        })
    })

    describe('amtToStr', () => {
        test('should parse a float number to a string with given precision and currency symbol', () => {
            expect(testLedger.amtToStr(5.0)).toEqual('$5.00')
        })
    })

    describe('extractAmt', () => {
        test('should return a float number from a transaction record', () => {
            expect(testLedger.extractAmt('a paid $5')).toBeCloseTo(5.0)
        })

        test('should throw \'Cannot find transacion amount\' if cannot find transaction amount in the record', () => {
            expect(() => {
                testLedger.extractAmt('a paid')
            }).toThrow(/Cannot find transacion amount/)
        })
    })

    describe('parseTransactions', () => {
        test('should update amount mappings and create credit/debit mappings from name to amount', () => {
            let testNames = 'a\nb\nc'
            testLedger.parseNames(testNames)
            let testTransactions = 'a $10\nb $2\nc $6'
            testLedger.parseTransactions(testTransactions)

            expect(testLedger.amountMap.get('a')).toBeCloseTo(10)
            expect(testLedger.amountMap.get('b')).toBeCloseTo(2)
            expect(testLedger.amountMap.get('c')).toBeCloseTo(6)

            expect(testLedger.creditMap.get('a')).toBeCloseTo(4)

            expect(testLedger.debitMap.get('b')).toBeCloseTo(4)
        })
        test('should throw \'Unknown name\' if transactions contains name that is not in name list', () => {
            let testNames = 'a\nb\nc'
            testLedger.parseNames(testNames)
            let testTransactions = 'd $10'
            expect(() => {
                testLedger.parseTransactions(testTransactions)
            }).toThrow(/Unknown name/)
        })
        test('should throw \'Invalid transaction\' if transaction record is too short', () => {
            let testNames = 'a\nb\nc'
            testLedger.parseNames(testNames)
            let testTransactions = '\n'
            expect(() => {
                testLedger.parseTransactions(testTransactions)
            }).toThrow(/Invalid transaction/)
        })
    })

    describe('sortKvPair', () => {
        test('should sort 2 key-value pair, the pair with larger value will have smaller index', () => {
            let pair1 = ['a',1]
            let pair2 = ['b',0]
            let pair3 = ['c',0]
            let testArray = [pair2,pair1]
            let expected = [pair1,pair2]
            testArray = testArray.sort(testLedger.sortKvPair)
            expect(testArray).toEqual(expected)

            testArray = [pair1,pair2]
            expected = [pair1,pair2]
            testArray = testArray.sort(testLedger.sortKvPair)
            expect(testArray).toEqual(expected)

            testArray = [pair2,pair3]
            expected = [pair2,pair3]
            testArray = testArray.sort(testLedger.sortKvPair)
            expect(testArray).toEqual(expected)
        })
    })

    describe('settle', () => {
        test('should settle the difference between the debit and credit mappings', () => {
            testLedger.creditMap = new Map([['a',5]])
            testLedger.debitMap = new Map([['b',2],['c',3]])
            testLedger.settle()
            expect(testLedger.creditMap).toEqual(new Map())
            expect(testLedger.debitMap).toEqual(new Map())

            testLedger.creditMap = new Map([['b',2],['c',3]])
            testLedger.debitMap = new Map([['a',5]])
            testLedger.settle()
            expect(testLedger.creditMap).toEqual(new Map())
            expect(testLedger.debitMap).toEqual(new Map())
        })
    })

})