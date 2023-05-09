import cors from 'cors'
import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import Stripe from 'stripe'
import cookieParser from 'cookie-parser'
import { connectToDatabase } from './src/connections/mongodb'
import { userRouter } from './src/routes/user.routes'

dotenv.config()

const STRIPE_KEY: string = process.env.STRIPE_SECRET_KEY || ''

const stripe =  new Stripe(STRIPE_KEY, {
    apiVersion: '2022-11-15'
})

const app: Express = express()

const PORT = process.env.PORT
const DB_NAME: string = process.env.DB_NAME
const DB_URI: string = process.env.MONGO_ATLAS_URI
const URI_QUERY_PARAM: string = process.env.QUERY_PARAMETERS
const HOST: string = process.env.HOST
const FRONT_END_PORT: string = process.env.FRONT_END_PORT
const FRONT_END_URL: string = HOST + FRONT_END_PORT

// Body parsing Middleware
app.use(express.json({ limit: '25mb' }))
app.use(express.urlencoded({ extended: true, limit: '25mb' }))
console.log(FRONT_END_URL)
app.use(cors({
    origin: FRONT_END_URL,
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
    let lineItems: any[] = []
    items.forEach((item: any) => {
        lineItems.push(
            {
                price: item.id,
                quantity: item.quantity
            }
        )
    })
    console.log(lineItems)

    const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url: `${HOST}${FRONT_END_PORT}/success`,
        cancel_url: `${HOST}${FRONT_END_PORT}/cancel`
    })

    res.status(200).send(JSON.stringify({ url: session.url }))
})

try{
    app.listen(PORT, (): void => {
        /* eslint-disable no-console */
        console.log(`Successfully connected to ${HOST}${PORT}`)
    })
} catch (error: any) {
    console.error(`Error occurred: ${error.message}`)
    /* eslint-enable no-console */
}

connectToDatabase(DB_URI + DB_NAME + URI_QUERY_PARAM)
