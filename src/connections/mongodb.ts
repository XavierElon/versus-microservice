import { Db, MongoClient } from 'mongodb'

export const connectToDatabase = async (dbUri: string) => {
  /* eslint-disable no-console */
  const client: MongoClient = new MongoClient(dbUri)
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