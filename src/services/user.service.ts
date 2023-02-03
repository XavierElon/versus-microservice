const mongoose = require('mongoose')

import { userSchema } from '../models/user.model'

const User = mongoose.model('User', userSchema) 

export const createUser = async (userData: typeof userSchema) => {
  const user = new User({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    mobileNumber: userData.mobileNumber,
    password: userData.password
  })
  await user.save()
    .then((result: any) => {
      console.log('Result:', result)
    })
    .catch((error: any) => {
      console.log('Error creating user: ', error)
    })
}