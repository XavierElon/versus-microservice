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
  firstName: {
    type: String,
    required: true,
    validate: {
      validator: validateName,
      message: error.firstName
    }
  },
  lastName: {
    type: String,
    required: true,
    validate: {
      validator: validateName,
      message: error.lastName
    }
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: validateEmail,
      message: error.email
    }
  },
  mobileNumber: {
    type: Number,
    required: true,
    validate: {
      validator: validatePhone,
      message: error.mobileNumber
    }
  },
  userName: {
    type: String,
    required: true,
    validate: {
      validator: validateUsername,
      message: error.userName
    }
  },
  password: {
    type: String,
    required: true,
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
  active: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
})

export const User = mongoose.model('User', userSchema)
