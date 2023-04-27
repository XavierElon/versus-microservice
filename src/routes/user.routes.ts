import express, { Router } from 'express'
import { validateToken } from '../utils/jwt'
import { ChangePassword, CreateUser, DeleteUserByEmail, GoogleAuthLoginAndSignup, LoginUser, ResetPassword, SendOTPEmail, UpdateUserById, ValidateAccountCreation } from '../controllers/user.controllers'

export const userRouter: Router = express.Router()
export const googleAuthRouter: Router = express.Router()

// Create a User
userRouter.post('/signup', CreateUser)

/*Verify user credentials against the database and login*/
userRouter.post('/login', LoginUser)

// Google Firebase Auth Login and Signup
userRouter.post('/auth/firebase/google', GoogleAuthLoginAndSignup)

// // Log out the user and clear local storage and cookies
userRouter.post('/logout', (req, res) => {
  res.clearCookie(('access-token'))
  res.status(200).send({ message: 'Logged out successfully' })
})

// Test route for token/cookie
userRouter.get('/profile', validateToken, (req, res) => {
  res.json('profile')
})

userRouter.get('/profile/:id', (req, res) => {
  console.log(req.body)
  console.log(req.params.id)
})

// Update a user by ID
userRouter.put('/update/:id', validateToken, UpdateUserById)

// Delete user by email endpoint
userRouter.delete('/delete/:email', validateToken, DeleteUserByEmail)

//Confirm the user has created an account
userRouter.get('/validate-account-creation/:userID', ValidateAccountCreation)

// Update user's password
userRouter.put('/changepassword', validateToken, ChangePassword)

// Reset user's password
userRouter.put('/resetpassword', ResetPassword)

// Send OTP Email for password recovery
userRouter.post('/send_recovery_email', SendOTPEmail)

