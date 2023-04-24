import express, { Express, Request, Response, Router } from 'express'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser'
import { User } from '../models/user.model'
import {
  createUser,
  checkIfUserExists,
  updateUser,
  verifyUser,
  deleteUser,
  confirmUser
} from '../services/user.service'
import { createToken, validateToken } from '../utils/jwt'
import { CreateUser, LoginUser, UpdateUserById } from '../controllers/user.controllers'

export const userRouter: Router = express.Router()

// Create a User
userRouter.post('/signup', CreateUser)

/*Verify user credentials against the database and login*/
userRouter.post('/login', LoginUser)

// Test route for token/cookie
userRouter.get('/profile', validateToken, (req, res) => {
  res.json('profile')
})

// Update a user by ID
userRouter.put('/update/:id', validateToken, UpdateUserById)

// Delete user by email endpoint
userRouter.delete('/delete/:email', validateToken, async (req, res) => {
  const email = req.params.email
  try {
    const deletedUser = await deleteUser(email)
    if (!deletedUser) {
      return res.status(404).send(`User with email ${email} not found`)
    }
    return res.send(`Deleted user: ${deletedUser}`)
  } catch (err) {
    console.error(`Error deleting user with email ${email}:`, err)
    return res.status(500).send('Error deleting user')
  }
})

//Confirm the user has created an account
userRouter.get('/validate-account-creation/:userID', async (req: Request, res: Response) => {
  try {
    const { confirmed, token } = req.query
    if (confirmed === 'true' && typeof token === 'string') {
      res.send('Your account has been successfully created and confirmed.')
      await confirmUser(token)
    } else {
      res.send('Your account has been created. Please check your email to confirm your account.')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('An error occurred while validating your account creation.')
  }
})

// Update user's password
userRouter.put('/changepassword', validateToken, async (req: Request, res: Response) => {
  const { oldPassword, newPassword, email } = req.body
  console.log(req)

  // const user = await User.findOne({ where: { username: req.user.username }})
  const user = await User.findOne({ where: { email: email }})

  bcrypt.compare(oldPassword, user.local.password).then(async (match) => {
    if (!match) res.json({ error: 'Wrong Password Entered!' })

    bcrypt.hash(newPassword, 10).then((hash) => {
      User.update({password: hash}, {where: { email: email }})
      res.json('success')
    })
  })
})