import express, { Request, Response, Router } from 'express'
import { checkIfUserExists, createUser } from '../services/user.service'
export const signupRouter: Router = express.Router()

// Create a User
signupRouter.post('/signup', async (req: Request, res: Response) => {
  const userData = req.body
  const userExists = await checkIfUserExists(userData.userName)
  if (userExists) {
    res.status(400).json({ message: 'User already exists' })
  } else {
    createUser(userData)
    res.status(201).json({ message: 'User created', data: userData })
  }
})

signupRouter.get(
  '/signup',
  async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).send({ message: 'Signup page' })
  }
)
