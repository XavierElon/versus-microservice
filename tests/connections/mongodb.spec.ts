import { expect } from 'chai'
import mongoose from 'mongoose'
import sinon from 'sinon'
import dotenv from 'dotenv'
import { connectToDatabase } from '../../src/connections/mongodb'

dotenv.config()

describe('Connect to database error', function() {
    this.timeout(5000)

    afterEach(() => {
        sinon.restore() // This will restore all stubs and spies after each test
    });
    
    it('should throw an error if mongoose.connect fails', async () => {
        const error = new Error('Connection failed')
        sinon.stub(mongoose, 'connect').rejects(error)
       
        try {
            await connectToDatabase('bad-uri')
        } catch (error: any) {
            console.log(error)
            expect(error.message).to.equal(`Mongodb connection failed: Error: Connection failed`)
        }
        });
})