import cors from 'cors'
import config from './src/config/config'
import express, { Express, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser'
import { connectToDatabase } from './src/connections/mongodb'
import { userRouter } from './src/routes/user.routes'
import { User } from './src/models/user.model'
import { createToken, validateToken } from './src/utils/jwt'

const app: Express = express()

const port = config.PORT;
const dbName = config.DB_NAME;
const dbUri = config.DB_URI;
const UriQueryParam = config.QUERY_PARAM;
const host = config.HOST;


console.log(dbUri + dbName + UriQueryParam)
console.log(' ')
console.log(process.env.JWT_SECRET)

// Body parsing Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(cookieParser())
app.use(userRouter)

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

connectToDatabase(dbUri + dbName + UriQueryParam)
