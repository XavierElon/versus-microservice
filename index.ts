import cors from 'cors'
import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import Stripe from 'stripe'
import cookieParser from 'cookie-parser'
import { connectToDatabase } from './src/connections/mongodb'
import { userRouter } from './src/routes/user.routes'

dotenv.config()

const STRIPE_KEY: string = process.env.STRIPE_SECRET_KEY || ''
console.log(STRIPE_KEY)

const stripe =  new Stripe(STRIPE_KEY, {
    apiVersion: '2022-11-15'
})

const app: Express = express()

const port = process.env.PORT
const dbName: string = process.env.DB_NAME
const dbUri: string = process.env.MONGO_ATLAS_URI
const UriQueryParam: string = process.env.QUERY_PARAMETERS
const host: string = process.env.HOST

// console.log(dbUri + dbName + UriQueryParam)

// Body parsing Middleware
app.use(express.json({ limit: '25mb' }))
app.use(express.urlencoded({ extended: true, limit: '25mb' }))
app.use(cors({
    origin: 'http://localhost:4269',
    credentials: true
}))
app.use(cookieParser())
app.use(userRouter)


app.get('/', async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).send({ message: 'Typescript node server running!' })
})

app.post('/checkout', async (req: Request, res: Response): Promise<any> => {
    console.log(req.body)
    const items = req.body.items
    console.log(items)
    let lineItems: any[] = []
    items.forEach((item: any) => {
        
    })
})

try{
    app.listen(port, (): void => {
        /* eslint-disable no-console */
        console.log(`Successfully connected to ${host}/${port}`)
    })
} catch (error: any) {
    console.error(`Error occurred: ${error.message}`)
    /* eslint-enable no-console */
}

connectToDatabase(dbUri + dbName + UriQueryParam)
