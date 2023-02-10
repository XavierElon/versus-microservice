import { Db, MongoClient } from 'mongodb'
import * as dotenv from 'dotenv'

export const connectToDatabase = async () => {
  dotenv.config()
  /* eslint-disable no-console */
  const client: MongoClient = new MongoClient(process.env.ATLAS_URI!)
  try {
    await client.connect()
  } catch (error: any) {
    throw new Error(`Mongodb connection failed: ${error}`)
  }

  const db: Db = client.db(process.env.DB_NAME)

  /* eslint-disable no-console */
  console.log(`Successfully connect to database: ${db.databaseName}`)
  /* eslint-enable no-console */
}
