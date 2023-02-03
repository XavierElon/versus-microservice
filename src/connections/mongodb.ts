import mongoDB, { Db, MongoClient } from 'mongodb'
import * as dotenv from 'dotenv'

export const connectToDatabase = async () => {
    dotenv.config()
    console.log(process.env.ATLAS_URI)
    const client: MongoClient = new MongoClient(process.env.ATLAS_URI!)
    await client.connect()

    const db: Db = client.db(process.env.DB_NAME)
    console.log(process.env.DB_NAME)

    console.log(`Successfully connect to database: ${db.databaseName}`)
}