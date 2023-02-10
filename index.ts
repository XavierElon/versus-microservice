import cors from 'cors'
import dotenv from 'dotenv'
import express, { Express, Request, Response } from 'express'
import { connectToDatabase } from './src/connections/mongodb'
import { loginRouter } from './src/routes/login.routes'
import { signupRouter } from './src/routes/signup.routes'

dotenv.config()

const app: Express = express()
const port: string = process.env.PORT || '1017'
const host: string = process.env.HOST || 'http://localhost:'
const dbUri: string = process.env.ATLAS_URI  || 'mongodb+srv://test:toor@cluster0.ojgllcz.mongodb.net/?retryWrites=true&w=majority'

// Body parsing Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(signupRouter)
app.use(loginRouter)


app.get('/', async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).send({ message: 'Typescript node server running!' })
})

try{
    app.listen(port, (): void => {
        /* eslint-disable no-console */
        console.log(`Connected successfully to ${host}${port}`)
    })
} catch (error: any) {
    console.error(`Error occurred: ${error.message}`)
    /* eslint-enable no-console */
}

connectToDatabase(dbUri)