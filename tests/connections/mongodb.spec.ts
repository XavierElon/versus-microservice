import { connectToDatabase } from "../../src/connections/mongodb"
import { assert } from 'chai'
import dotenv from 'dotenv'

dotenv.config()

describe('Mongo Db Tests', () => {
    it('Should connect to database', () => {
        // console.log(process.env.ATLAS_URI)
        connectToDatabase(process.env.ATLAS_URI!)
    })

    it('Shouldnt connect ot database', () => {
        connectToDatabase('fail')
    })
})