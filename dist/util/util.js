'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _ledger = require('../model/ledger');

var _ledger2 = _interopRequireDefault(_ledger);

var _config = require('../config.json');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Util = function () {
    function Util() {
        _classCallCheck(this, Util);
    }

    _createClass(Util, null, [{
        key: 'loadFile',
        value: function loadFile(filename, type) {
            return new Promise(function (resolve, reject) {
                _fs2.default.readFile(_config2.default.filePath + filename, 'utf8', function (err, lines) {
                    if (err) reject(err);
                    console.log('OK: ' + filename);
                    resolve(lines);
                });
            });
        }
    }, {
        key: 'parseName',
        value: function parseName(lines) {
            // init Ledger
            // console.log(new Ledger(lines))
            // return new Ledger(lines)
        }
    }, {
        key: 'parseTransaction',
        value: function parseTransaction(accMap, transactionLines) {
            var _this = this;

            var transactions = transactionLines.split('\n');
            transactions.forEach(function (record) {
                var words = record.split(' ');
                var name = words[_config2.default.nameIndex];
                var amt = _this.parseAmt(words[_config2.default.amountIndex]);
                console.log(name, amt);
                var balance = accMap.get(name);
                accMap.set(name, balance + amt);
            });
        }
    }, {
        key: 'parseAmt',
        value: function parseAmt(amtStr) {
            return parseFloat(amtStr.substring(amtStr.indexOf(_config2.default.symbol) + 1));
        }
    }]);

    return Util;
}();

exports.default = Util;