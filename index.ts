import cors from 'cors'
import config from './config'
import express, { Express, Request, Response } from 'express'
import { connectToDatabase } from './src/connections/mongodb'
import { loginRouter, signupRouter, updateRouter, deleteRouter, validationRouter } from './src/routes/user.routes'

const app: Express = express()

const port = config.PORT;
const dbName = config.DB_NAME;
const dbUri = config.DB_URI;
const UriQueryParam = config.QUERY_PARAM;
const host = config.HOST;


console.log(dbUri + dbName + UriQueryParam)

// Body parsing Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(signupRouter)
app.use(loginRouter)
app.use(updateRouter)
app.use(deleteRouter)
app.use(validationRouter)


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
