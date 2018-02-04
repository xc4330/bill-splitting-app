import { loadFile } from '../index.js'
 
describe('index.js', () => {
    describe('loadFile', () => {
        test('should return string from a text file', () => {
            loadFile('test.txt')
        })
    })
})