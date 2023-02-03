import express, { Express, Request, Response, Router } from 'express'
import { createUser } from '../services/user.service'
// const app: Express = express()
let router: Router = express.Router()

//Create a User
router.post('/signup', (req: Request, res: Response) => {
    const userData = req.body
    createUser(userData);
    res.json({
      message: 'User created successfully',
      data: userData
    })
})

router.get('/signup', async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).send({ message: 'Signup page' })
})

module.exports = router