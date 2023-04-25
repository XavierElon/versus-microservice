import express, { Request, Response, Router } from 'express'
import { User } from '../models/user.model'
import { createGoogleAuthToken, validateToken } from '../utils/jwt'
import { ChangePassword, CreateUser, DeleteUserByEmail, GoogleAuthLoginAndSignup, LoginUser, ResetPassword, UpdateUserById, ValidateAccountCreation } from '../controllers/user.controllers'

export const userRouter: Router = express.Router()
export const googleAuthRouter: Router = express.Router()

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
userRouter.delete('/delete/:email', validateToken, DeleteUserByEmail)

//Confirm the user has created an account
userRouter.get('/validate-account-creation/:userID', ValidateAccountCreation)

// Update user's password
userRouter.put('/changepassword', validateToken, ChangePassword)

// Reset user's password
userRouter.put('/resetpassword', ResetPassword)

userRouter.post('/auth/firebase/google', GoogleAuthLoginAndSignup)