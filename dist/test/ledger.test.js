'use strict';

var _ledger = require('../ledger.js');

var _ledger2 = _interopRequireDefault(_ledger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('ledger.js', function () {

    var testLedger = new _ledger2.default();
    afterEach(function () {
        // reset mappings in ledger
        testLedger.amountMap = new Map();
        testLedger.creditMap = new Map();
        testLedger.debitMap = new Map();
    });

    describe('parseNames', function () {
        test('should create mappings from name to amount', function () {
            var testNames = 'a\n b\n c  ';
            var expected = new Map([['a', 0], ['b', 0], ['c', 0]]);
            testLedger.parseNames(testNames);
            expect(testLedger.amountMap).toEqual(expected);
        });
        test('should throw \'Invalid name format\' if there is empty row', function () {
            var testNames = 'a\nb\n';
            expect(function () {
                testLedger.parseNames(testNames);
            }).toThrow(/Invalid name format/);
        });
    });

    describe('strToAmt', function () {
        test('should parse a transaction amount string to a float number', function () {
            expect(testLedger.strToAmt('$5')).toBeCloseTo(5.0);
        });

        test('should throw \'Invalid transaction amount\' if the string cannot be parsed to a float number', function () {
            expect(function () {
                testLedger.strToAmt('$a');
            }).toThrow(/Invalid transaction amount/);
        });
    });

    describe('amtToStr', function () {
        test('should parse a float number to a string with given precision and currency symbol', function () {
            expect(testLedger.amtToStr(5.0)).toEqual('$5.00');
        });
    });

    describe('extractAmt', function () {
        test('should return a float number from a transaction record', function () {
            expect(testLedger.extractAmt('a paid $5')).toBeCloseTo(5.0);
        });

        test('should throw \'Cannot find transacion amount\' if cannot find transaction amount in the record', function () {
            expect(function () {
                testLedger.extractAmt('a paid');
            }).toThrow(/Cannot find transacion amount/);
        });
    });

    describe('parseTransactions', function () {
        test('should update amount mappings and create credit/debit mappings from name to amount', function () {
            var testNames = 'a\nb\nc';
            testLedger.parseNames(testNames);
            var testTransactions = 'a $10\nb $2\nc $6';
            testLedger.parseTransactions(testTransactions);

            expect(testLedger.amountMap.get('a')).toBeCloseTo(10);
            expect(testLedger.amountMap.get('b')).toBeCloseTo(2);
            expect(testLedger.amountMap.get('c')).toBeCloseTo(6);

            expect(testLedger.creditMap.get('a')).toBeCloseTo(4);

            expect(testLedger.debitMap.get('b')).toBeCloseTo(4);
        });
        test('should throw \'Unknown name\' if transactions contains name that is not in name list', function () {
            var testNames = 'a\nb\nc';
            testLedger.parseNames(testNames);
            var testTransactions = 'd $10';
            expect(function () {
                testLedger.parseTransactions(testTransactions);
            }).toThrow(/Unknown name/);
        });
        test('should throw \'Invalid transaction\' if transaction record is too short', function () {
            var testNames = 'a\nb\nc';
            testLedger.parseNames(testNames);
            var testTransactions = '\n';
            expect(function () {
                testLedger.parseTransactions(testTransactions);
            }).toThrow(/Invalid transaction/);
        });
    });

    describe('sortKvPair', function () {
        test('should sort 2 key-value pair, the pair with larger value will have smaller index', function () {
            var pair1 = ['a', 1];
            var pair2 = ['b', 0];
            var pair3 = ['c', 0];
            var testArray = [pair2, pair1];
            var expected = [pair1, pair2];
            testArray = testArray.sort(testLedger.sortKvPair);
            expect(testArray).toEqual(expected);

            testArray = [pair1, pair2];
            expected = [pair1, pair2];
            testArray = testArray.sort(testLedger.sortKvPair);
            expect(testArray).toEqual(expected);

            testArray = [pair2, pair3];
            expected = [pair2, pair3];
            testArray = testArray.sort(testLedger.sortKvPair);
            expect(testArray).toEqual(expected);
        });
    });

    describe('settle', function () {
        test('should settle the difference between the debit and credit mappings', function () {
            testLedger.creditMap = new Map([['a', 5]]);
            testLedger.debitMap = new Map([['b', 2], ['c', 3]]);
            testLedger.settle();
            expect(testLedger.creditMap).toEqual(new Map());
            expect(testLedger.debitMap).toEqual(new Map());

            testLedger.creditMap = new Map([['b', 2], ['c', 3]]);
            testLedger.debitMap = new Map([['a', 5]]);
            testLedger.settle();
            expect(testLedger.creditMap).toEqual(new Map());
            expect(testLedger.debitMap).toEqual(new Map());
        });
    });
});