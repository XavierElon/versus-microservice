// @ts-nocheck
import { User } from '../models/user.model'
import mongoose, { Model } from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import { sendConfirmationGmail, createConfirmationLink } from '../utils/email.helper'

dotenv.config()

// GET All users
export const getAllUsers = async (): Promise<any | null> => {
  try {
    const all = await User.find()
    return all
  } catch (error) {
    console.error(`Error retrieving all newsletter users: ${error}`)
    throw new Error('No users found')
  }
}

export const getUserByEmail = async (email: string): Promise<typeof User | null> => {
  try {
    const user = await User.findOne({ 'local.email': email })
    return user || null
  } catch (error) {
    console.error(`Error while getting user by email: ${error}`)
    throw new Error('No user found with that email')
  }
}

export const getUserById = async (id: string): Promise<typeof User | null> => {
  try {
    const user = await User.findById(id)
    return user || null
  } catch (error) {
    console.error(`Error while getting User by id: ${error}`)
    throw new Error('No user found with that id')
  }
}

/*
GET LOCAL USER
This function gets a local user using the mongo id
*/
export const getLocalUser = async (id: any) => {
  try {
    const user = await User.findOne({ _id: id })
    return user || null
  } catch (error) {
    console.error(`Error while getting User by id: ${error}`)
    throw new Error('No local user found with that id')
  }
}

/*
GET GOOGLE USER
This function gets a Google auth user using the firebase id
*/
export const getGoogleUser = async (id: any) => {
  try {
    const user = await User.findOne({ 'firebaseGoogle.firebaseUid': id })
    return user || null
  } catch (error) {
    console.error(`Error while getting User by id: ${error}`)
    throw new Error('No google auth user found with that id')
  }
}

/*
CREATE USER
This function creates a new user using the userSchema and saves it to the database
*/
export const createUser = async (userData: typeof User): Promise<any> => {
  const { password } = userData.local

  const hash = await bcrypt.hash(password, 10)
  userData.local.password = hash

  let user = new User(userData)

  const baseUrl = process.env.HOST + process.env.PORT

  try {
    user.confirmationTokenExpirationTime = new Date(Date.now())
    const savedUser = await user.save()

    // const confirmationLink = await createConfirmationLink(userData, baseUrl)
    // await sendConfirmationGmail(user.local.email, confirmationLink)
    console.log(`Sent email to user ${user.email}`)
    return savedUser
  } catch (error) {
    console.log(`Error creating user or sending confirmation email to user ${user.email}`, error)
    if (user._id) {
      await User.deleteOne({ _id: user._id }) // Rollback by deleting the saved user if it was because the email
    }
    throw new Error('Error creating new user')
  }
}

export const createGoogleAuthUser = async (userData: any): Promise<any> => {
  const { accessToken, displayName, email, firebaseUid, photoURL, refreshToken } = userData
  let user = new User({
    local: {
      active: true
    },
    firebaseGoogle: {
      firebaseUid: firebaseUid,
      accessToken: accessToken,
      email: email,
      displayName: displayName,
      photoURL: photoURL,
      refreshToken: refreshToken
    },
    provider: 'firebaseGoogle'
  })
  user = await user.save()
  return user
}

/*
CHECK IF USER EXISTS 
check the username against the database for duplicates before proceeding with creation of new user
*/
export const checkIfUserExists = async (email: string) => {
  const existingUser = await User.findOne({ 'local.email': email })
  if (existingUser) {
    return true
  }
  return false
}

export const checkIfGoogleFirebaseUserExists = async (email: string) => {
  const existingGoogleUser = await User.findOne({ 'firebaseGoogle.email': email })
  if (existingGoogleUser) {
    return true
  }
  return false
}

export const updateUserById = async (id: string, update: Partial<>): Promise<typeof any | null> => {
  try {
    const updatedUser = await User.findOneAndUpdate({ _id: id }, { ...update, date: Date.now() }, { new: true })
    return updatedUser
  } catch (error) {
    console.error(`Error updating user: ${error}`)
    throw new Error('Error updating user by id')
  }
}

export const deleteUserByEmail = async (email: string): Promise<typeof any | null> => {
  try {
    const deletedUser = await User.findOneAndDelete({ 'local.email': email })
    return deletedUser
  } catch (err) {
    throw new Error('Error deletig user by email in services')
  }
}

export const deleteUserById = async (id: string): Promise<typeof any | null> => {
  try {
    const deletedUser = await User.findOneAndDelete({ _id: id })
    return deletedUser
  } catch (err) {
    throw new Error('Error deletig user by Id in services')
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
    'local.active': false,
    'local.confirmationTokenExpirationTime': { $lt: twentyFourHoursAgo }
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
  const user = await User.findOne({ 'local.confirmationCode': confirmationCode }).exec()
  if (!user || Object.keys(user).length === 0) {
    console.log('No user found')
    throw new Error('No user found')
  }
  user.local.active = true
  user.local.confirmationTokenExpirationTime = undefined
  await user.save()
  return user
}
