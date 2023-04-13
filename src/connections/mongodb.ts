import mongoose, { ConnectOptions } from 'mongoose'
import { User } from '../models/user.model'

export const connectToDatabase = async (dbUri: string) => {
  console.log(dbUri)
  const options: ConnectOptions = {
    connectTimeoutMS: 30000,
    socketTimeoutMS: 30000,
    keepAlive: true,
    keepAliveInitialDelay: 30000
  }
  try {
    mongoose.set('strictQuery', false)
    await mongoose.connect(dbUri, options)

    User.collection.createIndex({ username: 1 }, { unique: true })
  } catch (error: any) {
    throw new Error(`Mongodb connection failed: ${error}`)
  }

  const db = mongoose.connection

  console.log(`Successfully connected to database: ${db.name}`)
}
