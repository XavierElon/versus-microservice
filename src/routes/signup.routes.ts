import express, { Request, Response, Router } from 'express'
import { createUser, checkIfUserExists } from '../services/user.service'
export const signupRouter: Router = express.Router()

// GET
signupRouter.get('/signup', async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).send({ message: 'Signup page' })
})

// Create a User
signupRouter.post('/signup', async (req: Request, res: Response) => {
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
})

