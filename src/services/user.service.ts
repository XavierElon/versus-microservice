import mongoose from 'mongoose'

import { userSchema } from '../models/user.model'

const User = mongoose.model('User', userSchema)

export const createUser = async (userData: typeof userSchema) => {
  const user = new User({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    mobileNumber: userData.mobileNumber,
    password: userData.password,
    userName: userData.userName
  })

  await user
    .save()
    .then((result: any) => {
      /* eslint-disable no-console */
      console.info('Result:', result)
    })
    .catch((error: any) => {
      console.error('Error creating user: ', error)
      /* eslint-enable no-console */
    })
}

export const verifyUser = async (
  username: string,
  password: string
): Promise<boolean> => {
  const user = await User.findOne({ username, password })
  return user !== null
}

export const checkIfUserExists = async (username: string): Promise<boolean> => {
  const user = await User.findOne({ username })
  return user !== null
}
