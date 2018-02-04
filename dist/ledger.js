'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = require('../config.json');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ledger = function () {
    function Ledger(names) {
        _classCallCheck(this, Ledger);

        this.amountMap = new Map(); // init account records
        this.creditMap = new Map(); // init credit records
        this.debitMap = new Map(); // init debit records
    }

    _createClass(Ledger, [{
        key: 'parseNames',
        value: function parseNames(names) {
            var _this = this;

            names.split('\n').forEach(function (name) {
                name = name.trim().replace(/\s+/g, ' '); // remove extra spaces
                if (name.length > 0) {
                    _this.amountMap.set(name, 0);
                } else throw Error('Invalid name format. Please make sure records are in correct format.');
            });
        }
    }, {
        key: 'parseTransactions',
        value: function parseTransactions(transactions) {
            var _this2 = this;

            var total = 0;
            transactions.split('\n').forEach(function (record) {
                record = record.trim().replace(/\s+/g, ' '); // remove extra spaces
                if (record.length >= 2) {
                    // transaction record should at least have 2 words: name and amount
                    var words = record.split(' ');
                    var name = words[_config2.default.nameIndex];
                    var amt = _this2.extractAmt(record);
                    if (_this2.amountMap.has(name)) {
                        var balance = _this2.amountMap.get(name);
                        _this2.amountMap.set(name, balance + amt);
                        total += amt;
                    } else throw Error('Unknown name found in transaction records. Please make sure all names are added in the name file.');
                } else throw Error('Invalid transaction record format. Please make sure records are in correct format.');
            });

            var avg = total / this.amountMap.size;
            this.amountMap.forEach(function (amt, name) {
                if (amt > avg) {
                    _this2.creditMap.set(name, amt - avg);
                } else if (amt < avg) {
                    _this2.debitMap.set(name, avg - amt);
                }
            });
        }
    }, {
        key: 'settle',
        value: function settle() {
            // return if there is no credit/debit record to settle
            if (this.creditMap.size === 0 || this.debitMap.size === 0) {
                return;
            }

            // sort debit and credit record based on amount from large to small
            var creditMapArray = Array.from(this.creditMap).sort(this.sortKvPair);
            var debitMapArray = Array.from(this.debitMap).sort(this.sortKvPair);
            this.creditMap = new Map(creditMapArray);
            this.debitMap = new Map(debitMapArray);

            var payment = 0;
            var payer = debitMapArray[0][0];
            var receiver = creditMapArray[0][0];
            var remainder = debitMapArray[0][1] - creditMapArray[0][1];
            // compare largest credit and debit record
            if (remainder > 0) {
                payment = creditMapArray[0][1];
                // remove credit record
                this.creditMap.delete(receiver);
                // udpate debit record
                this.debitMap.set(debitMapArray[0][0], remainder);
            } else if (remainder < 0) {
                payment = debitMapArray[0][1];
                // remove debit record
                this.debitMap.delete(payer);
                // update credit record
                this.creditMap.set(creditMapArray[0][0], -remainder);
            } else {
                payment = debitMapArray[0][1];
                // remove both
                this.debitMap.delete(payer);
                this.creditMap.delete(creditMapArray[0][0]);
            }

            console.log(payer + ' pays ' + receiver + ' ' + this.amtToStr(payment));

            this.settle(this.creditMap, this.debitMap);
        }
    }, {
        key: 'sortKvPair',
        value: function sortKvPair(pair1, pair2) {
            if (pair1[1] === pair2[1]) {
                return 0;
            } else {
                return pair1[1] > pair2[1] ? -1 : 1;
            }
        }
    }, {
        key: 'extractAmt',
        value: function extractAmt(record) {
            var words = record.split(' ');
            // find word that contains transaction amount
            if (record.indexOf(_config2.default.currency) === -1) {
                throw Error('Cannot find transacion amount in the record. Please make sure records are in correct format.');
            }
            var index = -1;
            for (var i = 0; i < words.length; i++) {
                if (words[i].indexOf(_config2.default.currency) !== -1) {
                    index = i; // find first occurence of transaction amount
                    break;
                }
            }
            return this.strToAmt(words[index]);
        }
    }, {
        key: 'strToAmt',
        value: function strToAmt(amtStr) {
            var amt = parseFloat(amtStr.substring(amtStr.indexOf(_config2.default.currency) + 1));
            if (isNaN(amt)) throw Error('Invalid transaction amount. Please make sure the amount is a valid number');
            return amt;
        }
    }, {
        key: 'amtToStr',
        value: function amtToStr(amt) {
            return _config2.default.currency + amt.toFixed(_config2.default.precision);
        }
    }]);

    return Ledger;
}();

exports.default = Ledger;