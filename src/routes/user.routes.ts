import express, { Request, Router } from 'express'
import { validateToken } from '../utils/jwt'
import {
  ChangePassword,
  CreateUser,
  DeleteUserByEmail,
  DeleteUserById,
  GetUser,
  GoogleAuthLoginAndSignup,
  LoginUser,
  LogoutUser,
  ResetPassword,
  SendOTPEmail,
  UpdateUserById,
  UploadProfilePictureById,
  ValidateAccountCreation
} from '../controllers/user.controllers'
import { upload } from '../middleware/storage'

export const userRouter: Router = express.Router()

// Get Single User's data by id
userRouter.get('/profile/:id', validateToken, GetUser)

// Create a User
userRouter.post('/signup', CreateUser)

/*Verify user credentials against the database and login*/
userRouter.post('/login', LoginUser)

// // Log out the user and clear local storage and cookies
userRouter.post('/logout', LogoutUser)

// Google Firebase Auth Login and Signup
userRouter.post('/auth/firebase/google', GoogleAuthLoginAndSignup)

// Update a user by ID
userRouter.put('/update/:id', validateToken, UpdateUserById)

// Update local  user profile pic by ID
userRouter.post('/upload-profile-picture/:id', validateToken, upload.single('image'), UploadProfilePictureById)

// Delete user by id endpoint
userRouter.delete('/delete/:id', validateToken, DeleteUserById)

//Confirm the user has created an account
userRouter.get('/validate-account-creation/:userID', ValidateAccountCreation)

// Update user's password
userRouter.put('/changepassword', validateToken, ChangePassword)

// Reset user's password
userRouter.put('/resetpassword', ResetPassword)

// Send OTP Email for password recovery
userRouter.post('/send_recovery_email', SendOTPEmail)
