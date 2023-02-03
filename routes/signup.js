const express = require('express')
const app = express()
const router = express.Router()
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  date: { type: Date, default: Date.now },
  mobileNumber: Number,
  password: Number
})

const User = mongoose.model('User', userSchema) 

async function createUser(userData) {
  const user = new User({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    mobileNumber: userData.mobileNumber,
    password: userData.password
  })
  await course
    .save()
    .then((result) => {
      console.log('Result', result)
    })
    .catch((error) => {
      console.log('Error', error)
    })
}

//Create a User
app.post('/sign-up', (req, res) => {
  const userData = req.body
  //createUser(userData);
  res.json({
    message: 'User created successfully',
    data: userData
  })
})

module.exports = router

