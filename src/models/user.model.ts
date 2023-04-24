import * as mongoose from 'mongoose'
import { ErrorMessage } from '../structures/types'
import {
  validatePassword,
  validateEmail,
  validatePhone,
  validateUsername,
  validateName
} from '../utils/verification.helper'
import { v4 as uuidv4 } from 'uuid'

const error = new ErrorMessage()

const userSchema = new mongoose.Schema({
  local:  {
    firstName: {
      type: String,
      validate: {
        validator: validateName,
        message: error.firstName
      }
    },
    lastName: {
      type: String,
      unique: true,
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
    mobileNumber: {
      type: Number,
      unique: true,
      validate: {
        validator: validatePhone,
        message: error.mobileNumber
      }
    },
    userName: {
      type: String,
      unique: true,
      validate: {
        validator: validateUsername,
        message: error.userName
      }
    },
    password: {
      type: String,
      validate: {
        validator: validatePassword,
        message: error.password
      }
    },
    confirmationCode: {
      type: String,
      default: uuidv4()
    },
    confirmationTokenExpirationTime: {
      type: Date || null
    },
  },
  firebaseGoogle: {
    firebaseUid: String,
    accessToken: String,
    email: String,
    displayName: String,
    photoURL: String,
  },
  provider: {
    type: String,
    enum: ['local', 'firebaseGoogle'], required: true
  },
  active: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
})

export const User = mongoose.model('User', userSchema)
