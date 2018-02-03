'use strict';

var _inquirer = require('inquirer');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _ledger = require('./model/ledger.js');

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

(0, _inquirer.prompt)(questions).then(function (answers) {
    console.log(answers);
    processAnswers(answers);
});

async function processAnswers(answers) {
    var names = '';
    var transactions = '';

    try {
        names = await loadFile(answers.name, 'name');
    } catch (err) {
        console.log('read name file failed');
        console.log(err);
    }

    try {
        transactions = await loadFile(answers.expense, 'expense');
    } catch (err) {
        console.log('read expense file failed');
        console.log(err);
    }

    var ledger = new _ledger2.default(names);
    ledger.parseTransaction(transactions);
    console.log(ledger.accountMap);
}

function loadFile(filename, type) {
    return new Promise(function (resolve, reject) {
        _fs2.default.readFile(_config2.default.filePath + filename, 'utf8', function (err, lines) {
            if (err) reject(err);
            console.log('OK: ' + filename);
            resolve(lines);
        });
    });
}