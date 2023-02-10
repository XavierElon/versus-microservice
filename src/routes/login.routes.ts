import express, { Request, Response, Router } from 'express'
import { verifyUser } from '../services/user.service'
export const loginRouter: Router = express.Router()

/*Verify user credentials against the database and login*/
loginRouter.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body

  const isValid = await verifyUser(username, password)

  if (isValid) {
    res.status(200).json({ message: 'Login successful' })
  } else {
    res.status(401).json({ message: 'Incorrect username or password' })
  }
})
