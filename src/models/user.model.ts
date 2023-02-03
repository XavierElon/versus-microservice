const mongoose = require('mongoose')

export const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    date: { type: Date, default: Date.now },
    mobileNumber: Number,
    password: Number
  })