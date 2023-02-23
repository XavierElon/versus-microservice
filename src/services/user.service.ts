import { User } from '../models/user.model'
import mongoose, { Model } from 'mongoose'
import { sendConfirmationGmail, createConfirmationLink } from '../utils/email.helper'

const port: string = process.env.PORT || '1017'
const host: string = process.env.HOST || 'http://localhost:'

/*
CREATE USER
This function creates a new user using the userSchema and saves it to the database
*/
export const createUser = async (userData: typeof User): Promise<any> => {
  const user = new User(userData)
  const baseUrl = host + port
  try {
    user.confirmationTokenExpirationTime = new Date(Date.now())
    const savedUser = await user.save()
    console.log('Result:', savedUser)
    const confirmationLink = await createConfirmationLink(userData, baseUrl)
    await sendConfirmationGmail(user.email, confirmationLink)
    console.log(`Sent email to user ${user.email}`)
    return savedUser
  } catch (error) {
    console.log(`Error creating user or sending confirmation email to user ${user.email}`, error)
    if (user._id) {
      await User.deleteOne({ _id: user._id }) // Rollback by deleting the saved user if it was because the email
    }
    throw error
  }
}

/*
VERIFY USER
check the username and password against the database to approve login
*/
export const verifyUser = async (username: string, password: string) => {
  const existingUser = await User.findOne({ username, password })
  if (existingUser) {
    return true
  }
  return false
}

/*
CHECK IF USER EXISTS 
check the username against the database for duplicates before proceeding with creation of new user
*/
export const checkIfUserExists = async (email: string) => {
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return true
  }
  return false
}

/*
UPDATE USER INFORMATION
*/
export const updateUser = async (
  id: string,
  update: Partial<typeof User>
): Promise<typeof User | null> => {
  const UserModel: Model<Document & typeof User> = mongoose.model('User')
  try {
    const updatedUser = await UserModel.findOneAndUpdate({ _id: id }, update, { new: true })
    return updatedUser
  } catch (error) {
    console.error(`Error updating user: ${error}`)
    return null
  }
}

/*
DELETE USER
*/
export const deleteUser = async (email: string): Promise<typeof User | null> => {
  const UserModel: Model<Document & typeof User> = mongoose.model('User')
  try {
    const deletedUser = await UserModel.findOneAndDelete({ email })
    return deletedUser
  } catch (err) {
    console.error(err)
    return null
  }
}

export const getUserByEmail = async (email: string): Promise<typeof User | null> => {
  const UserModel: Model<Document & typeof User> = mongoose.model('User')
  try {
    const user = await UserModel.findOne({ email })
    return user || null
  } catch (error) {
    console.error(`Error while getting user by email: ${error}`)
    return null
  }
}

/* Define a function to delete unconfirmed users after 24 hours*/
export const deleteUnconfirmedUsers = async (): Promise<void> => {
  const currentTime = new Date()

  // Calculate the timestamp for 24 hours ago
  const twentyFourHoursAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000)

  // Find all users that are unconfirmed and have a confirmation token expiration time
  // earlier than 24 hours ago
  const unconfirmedUsers = await User.find({
    active: false,
    confirmationTokenExpirationTime: { $lt: twentyFourHoursAgo }
  }).exec()

  // Delete each unconfirmed user from the database
  await Promise.all(
    unconfirmedUsers.map(async (user) => {
      await user.remove()
    })
  )
}

/*  Find the user with the provided confirmation code */
export const confirmUser = async (confirmationCode: string) => {
  const user = await User.findOne({ confirmationCode: confirmationCode }).exec()
  if (!user) {
    return null
  }
  user.active = true
  user.confirmationTokenExpirationTime = undefined
  await user.save()
  return user
}
