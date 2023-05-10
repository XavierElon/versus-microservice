import * as mongoose from 'mongoose'
import { ErrorMessage } from '../structures/types'
import {
  validatePassword,
  validateEmail,
  validatePhone,
  // validateUsername,
  validateName
} from '../utils/verification.helper'
import { v4 as uuidv4 } from 'uuid'

const error = new ErrorMessage()

const userSchema = new mongoose.Schema({
  local: {
    firstName: {
      type: String,
      validate: {
        validator: validateName,
        message: error.firstName
      }
    },
    lastName: {
      type: String,
      validate: {
        validator: validateName,
        message: error.lastName
      }
    },
    email: {
      type: String,
      validate: {
        validator: validateEmail,
        message: error.email
      }
    },
    // mobileNumber: {
    //   type: Number,
    //   unique: true,
    //   required: false,
    // },
    password: {
      type: String
    },
    profilePicture: {
      name: String,
      data: Buffer,
      contentType: String
    },
    confirmationCode: {
      type: String,
      default: uuidv4()
    },
    confirmationTokenExpirationTime: {
      type: Date, default: Date.now
    },
    active: { type: Boolean, default: false }
  },
  firebaseGoogle: {
    accessToken: String,
    displayName: String,
    email: String,
    firebaseUid: String,
    photoURL: String,
    refreshToken: String
  },
  provider: {
    type: String,
    enum: ['local', 'firebaseGoogle'],
    required: true
  },
  date: { type: Date, default: Date.now }
})

export const User = mongoose.model('User', userSchema)
