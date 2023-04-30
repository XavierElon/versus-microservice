import express, { Request, Router } from 'express'
import fs from 'fs'
import path from 'path'
import { validateToken } from '../utils/jwt'
import { ChangePassword, CreateUser, DeleteUserByEmail, GetUser, GoogleAuthLoginAndSignup, LoginUser, LogoutUser, ResetPassword, SendOTPEmail, UpdateUserById, ValidateAccountCreation } from '../controllers/user.controllers'
import { User } from '../models/user.model'
// import { uploadMiddleWare } from '../middleware/storage'
export const userRouter: Router = express.Router()
export const googleAuthRouter: Router = express.Router()
import multer from 'multer'

const storage = multer.diskStorage({
    
    destination: (req, file, cb) => {
        console.log('dest')
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

// const uploadMiddleWare = (req, res, next) => {

//     console.log('here')
//     upload.single('image')(req, res, err => {
//         console.log('here')
//         if (err) {
//             return res.status(400).json({ error: 'Failed to upload file '})
//         }
//         next()
//     })
// }

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
userRouter.post('/upload-profile-picture', upload.single('image'), async (req: Request<any>, res) => {
    // console.log(req.body)
    console.log(req.file)
    const user = await User.findById(req.body.id)
    console.log(user)

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    user.local.profilePicture = { 
        data: req.body.file.buffer,
        contentType: req.body.file.mimetype
    }
    // console.log(user.local.profilePicture)
    await user.save()

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

