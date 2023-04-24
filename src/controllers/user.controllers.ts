import { Request, Response } from 'express'
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
import { createGoogleAuthToken, createLocalToken } from '../utils/jwt'

export const CreateUser = async (req: Request, res: Response) => {
  const userData = req.body
  const userExists = await checkIfUserExists(userData.email)
  if (userExists) {
    res.status(400).json({ message: 'User already exists' })
  } else {
    createUser(userData)
      .then((result) => {
        console.log('User created successfully: ', result)
        res.status(201).json({ message: 'User created', data: userData })
      })
      .catch((error) => {
        console.log('Error creating user: ', error)
        res.status(500).json({ message: 'Error creating user', error })
      })
  }
}

export const LoginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if(!user) {
    console.log('User does not exist')
    res.status(401).json({ message: 'Incorrect username or password, please make sure you have confirmed your email' })
  }

  const hashedPassword = user?.local.password
  bcrypt.compare(password, hashedPassword).then((match) => {
    if (!match) {
      res.status(400).json({ error: 'Wrong username or password'})
    } else {
      const accessToken = createLocalToken(user)
      res.cookie('access-token', accessToken, {
        maxAge: 60 * 60 * 24 * 1000,
        httpOnly: true
      })
      res.status(200).json({ message: 'Login successful' })
    }
  })
}

export const UpdateUserById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const update = req.body
        // Find the user by ID and update its properties
        const updatedUser = updateUser(id, update)
        if (!updatedUser) {
          return res.status(404).send({ error: 'User not found' })
        } else {
          return res.status(200).send({ updatedUser, message: 'User updated' })
        }
      } catch (error) {
        console.error(`Error updating user: ${error}`)
        return res.status(500).send({ error: 'Server error' })
      }
}

export const DeleteUserByEmail = async (req: Request, res: Response) => {
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
}

export const ValidateAccountCreation = async (req: Request, res: Response) => {
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
}

export const ChangePassword = async (req: Request, res: Response) => {
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
}

export const GoogleAuthLoginAndSignup = async (req: Request, res: Response) => {
    console.log(req.body)
  try {
    const { accessToken, displayName, email, firebaseUid, photoURL, refreshToken } = req.body.firebaseGoogle
    
    if (!firebaseUid) {
      return res.status(400).json({ message: 'Missing firebaseUid' })
    }

    let user = await User.findOne({ firebaseGoogle: {
      firebaseUid }})

    if (!user) {
      user = new User({
        local: {
          active: true,
        },
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
}