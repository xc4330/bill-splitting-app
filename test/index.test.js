import fs from 'fs'
import sinon from 'sinon'
import { InputHandler } from '../index.js'

async function createTestFiles(){
    fs.writeFile("./inputs/testName.txt", "test", function(err) {
        if(err) {
            return console.log(err)
        }
    })
    fs.writeFile("./inputs/testExpense.txt", "test $5", function(err) {
        if(err) {
            return console.log(err)
        }
    })
}
 
describe('index.js', () => {
    beforeAll( async (cb) => {
        await createTestFiles()
        cb()
    })

    describe('loadFile', () => {
        test('should return string from a text file', async () => {
            expect.assertions(1) // number of async functions to be called
            const data = await InputHandler.loadFile('testName.txt')
            expect(data).toEqual('test')
        })
        test('should throw \'File name cannot be empty\' if file name is empty', async () => {
            expect.assertions(1)
            try {
                await InputHandler.loadFile('')
            } catch (error) {
                expect(error.message).toEqual('File name cannot be empty')
            }
        })
        test('should throw no such file error if file does not exist in the directory', async () => {
            expect.assertions(1)
            try {
                await InputHandler.loadFile('a')
            } catch (error) {
                expect(error.message).toMatch(/no such file/)
            }
        })
    })

    describe('processAnswers', () => {
        test('should read 2 files using loadFile and call parseNames and parseTransactions with data in the files', async () => {
            let spy = sinon.spy(InputHandler,'loadFile')
            let answers = {name: 'testName.txt', expense: 'testExpense.txt'}
            await InputHandler.processAnswers(answers)
            expect(spy.callCount).toBe(2)
        })
    })
})