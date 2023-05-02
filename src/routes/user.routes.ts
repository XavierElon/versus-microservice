import express, { Request, Router } from 'express'
import fs from 'fs'
import path from 'path'
import { validateToken } from '../utils/jwt'
import { ChangePassword, CreateUser, DeleteUserByEmail, GetUser, GoogleAuthLoginAndSignup, LoginUser, LogoutUser, ResetPassword, SendOTPEmail, UpdateUserById, ValidateAccountCreation } from '../controllers/user.controllers'
import { User } from '../models/user.model'
import { upload } from '../middleware/storage'
export const userRouter: Router = express.Router()
export const googleAuthRouter: Router = express.Router()


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

// Get user local user profile picture
userRouter.get('/profile-picture/:id', async (req, res) => {
})

// Update local  user profile pic by ID 
userRouter.post('/upload-profile-picture/:id', upload.single('image'), async (req: Request<any>, res) => {
    console.log(req.file)
    const user = await User.findById(req.params.id)

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    const data = fs.readFileSync(req.file.path);
    const contentType = req.file.mimetype;
    
    user.local.profilePicture = { 
        data: data,
        contentType: contentType
    }
    await user.save()

    fs.unlinkSync(req.file.path)

    res.status(200).send({ message: 'Profile picture uploaded successfully.'})

})

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

