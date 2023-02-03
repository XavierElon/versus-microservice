import express, { Express, Request, Response, Router } from 'express'
import { createUser } from '../services/user.service'
const app: Express = express()
// const router: Router = express.Router()

//Create a User
app.post('/sign-up', (req: Request, res: Response) => {
    const userData = req.body
    createUser(userData);
    res.json({
      message: 'User created successfully',
      data: userData
    })
})