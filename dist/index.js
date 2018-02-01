'use strict';

var _inquirer = require('inquirer');

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _util = require('./util/util.js');

var _util2 = _interopRequireDefault(_util);

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
    _async2.default.seq(function (callback) {
        _util2.default.loadFile(answers.name, 'name', function (data) {
            _util2.default.parseName(data);
            callback();
        });
    }, function (callback) {
        _util2.default.loadFile(answers.expense, 'expense', function (data) {
            _util2.default.parseTransaction(data);
            callback();
        });
    })(function (err) {
        if (err) {
            console.log(err);
        }
    });
});