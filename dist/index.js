'use strict';

var _inquirer = require('inquirer');

var questions = [{
    type: 'input',
    name: 'name',
    message: 'Enter name list file name:'
}, {
    type: 'input',
    name: 'transactions',
    message: 'Enter expense transactions file name:'
}]; //const { prompt } = require('inquirer');


(0, _inquirer.prompt)(questions).then(function (answers) {
    console.log(answers);
});

var loadFile = function loadFile(fileName, type) {
    console.log();
};

module.exports.loadFile = loadFile;