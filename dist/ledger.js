'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = require('../config.json');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var instance = null;

var Ledger = function () {
    function Ledger(names) {
        _classCallCheck(this, Ledger);

        if (!instance) {
            instance = this;
        }
        var nameArray = names.split('\n');
        var amountMap = new Map();
        nameArray.forEach(function (name) {
            amountMap.set(name, 0);
        });
        this.amountMap = amountMap;
        this.creditMap = new Map(); // init empty credit records
        this.debitMap = new Map(); // init empty debit records
        return instance;
    }

    _createClass(Ledger, [{
        key: 'parseTransaction',
        value: function parseTransaction(transactions) {
            var _this = this;

            var total = 0;
            transactions.split('\n').forEach(function (record) {
                var words = record.split(' ');
                var name = words[_config2.default.nameIndex];
                var amt = _this.parseAmt(words[_config2.default.amountIndex]);
                var balance = _this.amountMap.get(name);
                _this.amountMap.set(name, balance + amt);
                total += amt;
            });

            var avg = total / this.amountMap.size;
            this.amountMap.forEach(function (amt, name) {
                if (amt > avg) {
                    _this.creditMap.set(name, amt - avg);
                } else if (amt < avg) {
                    _this.debitMap.set(name, avg - amt);
                }
            });
            this.settle();
        }
    }, {
        key: 'settle',
        value: function settle() {
            // return if there is no credit/debit record to settle
            if (this.creditMap.size === 0 || this.debitMap.size === 0) {
                return;
            }

            var creditMapArray = Array.from(this.creditMap).sort(this.sortKvPair);
            var debitMapArray = Array.from(this.debitMap).sort(this.sortKvPair);
            this.creditMap = new Map(creditMapArray);
            this.debitMap = new Map(debitMapArray);

            var payment = 0;
            var payer = debitMapArray[0][0];
            var receiver = creditMapArray[0][0];
            var remainder = debitMapArray[0][1] - creditMapArray[0][1];
            // compare largest credit and debit record
            if (remainder >= 0) {
                payment = creditMapArray[0][1];
                // remove credit record
                this.creditMap.delete(receiver);
                // udpate debit record
                this.debitMap.set(debitMapArray[0][0], remainder);
            } else {
                payment = debitMapArray[0][1];
                // remove debit record
                this.debitMap.delete(payer);
                // update credit record
                this.creditMap.set(creditMapArray[0][0], remainder);
            }

            console.log(payer + ' pays ' + receiver + ' ' + payment.toFixed(2));

            this.settle();
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
        key: 'parseAmt',
        value: function parseAmt(amtStr) {
            return parseFloat(amtStr.substring(amtStr.indexOf(_config2.default.symbol) + 1));
        }
    }]);

    return Ledger;
}();

exports.default = Ledger;