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
        var accountMap = new Map();
        nameArray.forEach(function (name) {
            accountMap.set(name, 0.0);
        });
        this.accountMap = accountMap;
        return instance;
    }

    _createClass(Ledger, [{
        key: 'parseTransaction',
        value: function parseTransaction(transactions) {
            var _this = this;

            var array = transactions.split('\n');
            array.forEach(function (record) {
                var words = record.split(' ');
                var name = words[_config2.default.nameIndex];
                var amt = _this.parseAmt(words[_config2.default.amountIndex]);
                console.log(name, amt);
                var balance = _this.accountMap.get(name);
                _this.accountMap.set(name, balance + amt);
            });
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