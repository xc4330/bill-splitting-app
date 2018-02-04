'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadFile = loadFile;

var _inquirer = require('inquirer');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _ledger = require('./ledger.js');

var _ledger2 = _interopRequireDefault(_ledger);

var _config = require('./config.json');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var questions = [{
    type: 'input',
    name: 'name',
    message: 'Enter name list file name:'
}, {
    type: 'input',
    name: 'expense',
    message: 'Enter expense transactions file name:'
}];

start();

function start() {
    (0, _inquirer.prompt)(questions).then(function (answers) {
        processAnswers(answers);
    });
}

async function processAnswers(answers) {
    try {
        var names = await loadFile(answers.name);
        var transactions = await loadFile(answers.expense);
        var ledger = new _ledger2.default();
        ledger.parseNames(names);
        ledger.parseTransactions(transactions);
        ledger.settle();
    } catch (err) {
        console.log(err.message);
        start();
    }
}

function loadFile(filename) {
    return new Promise(function (resolve, reject) {
        if (filename === '') {
            reject(Error('File name cannot be empty'));
        }
        _fs2.default.readFile(_config2.default.filePath + filename, 'utf8', function (err, lines) {
            if (err) reject(err);
            resolve(lines);
        });
    });
}