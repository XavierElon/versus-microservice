import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import { connectToDatabase } from './src/connections/mongodb'
const signupRouter = require('./src/routes/signup.routes')

dotenv.config()

const app: Express = express()
const port: string = process.env.PORT || '1017'

console.log(port)
console.log(signupRouter)

// Body parsing Middleware
app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use('/signup', signupRouter)

app.get('/', async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).send({ message: 'Typescript node server running!' })
})

try{
    app.listen(port, (): void => {
        console.log(`Connected successfully to port ${port}`)
    })
} catch (error: any) {
    console.error(`Error occurred: ${error.message}`)
}

// try {
//     connectToDatabase()
// } catch (error: any) {
//     console.error(`Error occurred connecting to database: ${error.message}`)
// }