import fs from 'fs'
import sinon from 'sinon'
import App from '../app.js'
import Ledger from '../ledger.js'

async function createTestFiles(){
    fs.writeFile("./inputs/testName.txt", "test1\ntest2", function(err) {
        if(err) {
            return console.log(err)
        }
    })
    fs.writeFile("./inputs/testExpense.txt", "test1 paid $5", function(err) {
        if(err) {
            return console.log(err)
        }
    })
}

async function deleteTestFiles(){
    fs.unlink("./inputs/testName.txt", function(err) {
        if(err) {
            return console.log(err)
        }
    })
    fs.unlink("./inputs/testExpense.txt", function(err) {
        if(err) {
            return console.log(err)
        }
    })
}
 
describe('app', () => {
    let app = new App()
    beforeAll( async () => {
        await createTestFiles()
    })

    afterAll( async () => {
        await deleteTestFiles()
    } )

    describe('constructor', () => {
        test('should construct App object that contains 1 ledger', () => {
            let ledger = new Ledger()
            expect(app.ledger).toEqual(ledger)
        })
    })

    describe('loadFile', () => {
        test('should return string from a text file', async () => {
            expect.assertions(1) // number of async functions to be called
            const data = await app.loadFile('testName.txt')
            expect(data).toEqual('test1\ntest2')
        })
        test('should throw \'File name cannot be empty\' if file name is empty', async () => {
            expect.assertions(1)
            try {
                await app.loadFile('')
            } catch (error) {
                expect(error.message).toEqual('File name cannot be empty')
            }
        })
        test('should throw no such file error if file does not exist in the directory', async () => {
            expect.assertions(1)
            try {
                await app.loadFile('a')
            } catch (error) {
                expect(error.message).toMatch(/no such file/)
            }
        })
    })

    describe('processAnswers', () => {
        test('should read 2 files using loadFile and call parseNames and parseTransactions with data in the files', async () => {
            let spy = sinon.spy(app,'loadFile')
            let answers = {name: 'testName.txt', expense: 'testExpense.txt'}
            await app.processAnswers(answers)
            expect(spy.callCount).toBe(2)
            app.loadFile.restore()
        })
        test('should restart app if error occurs while processing answers', async () => {
            let spy = sinon.spy(app,'start')
            let answers = {name: '', expense: ''}
            await app.processAnswers(answers)
            expect(spy.callCount).toBe(1)
            app.start.restore()
        })
    })
})