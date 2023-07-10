import mongoose, { ConnectOptions } from 'mongoose'

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
  } catch (error: any) {
    throw new Error(`Mongodb connection failed: ${error}`)
  }

  const db = mongoose.connection

  console.log(`Successfully connected to database: ${db.name}`)
}
