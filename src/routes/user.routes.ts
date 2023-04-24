import express, { Request, Response, Router } from 'express'
import { User } from '../models/user.model'
import { createGoogleAuthToken, validateToken } from '../utils/jwt'
import { ChangePassword, CreateUser, DeleteUserByEmail, LoginUser, UpdateUserById, ValidateAccountCreation } from '../controllers/user.controllers'

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

userRouter.post('/auth/firebase/google', async (req: Request, res: Response) => {
  // res.status(200).json({ message: 'hello' })
  try {
    const { accessToken, displayName, email, firebaseUid, photoURL, refreshToken } = req.body
    
    if (!firebaseUid) {
      return res.status(400).json({ message: 'Missing firebaseUid' })
    }

    let user = await User.findOne({ firebaseUid })

    if (!user) {
      user = new User({
        firebaseGoogle: {
          firebaseUid: firebaseUid,
          accessToken: accessToken, 
          email: email,
          displayName: displayName,
          photoURL: photoURL,
          refreshToken: refreshToken
        },
        provider: 'firebaseGoogle'
      })
      await user.save()
    }

    const token = createGoogleAuthToken(firebaseUid)

    res.json({
      token,
      user: {
        _id: user.id,
        firebaseUid: user.firebaseGoogle.firebaseUid,
        email,
        provider: user.provider
      }
    })
  
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})