import cors from 'cors'
import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import { Configuration, OpenAIApi } from 'openai'
import cookieParser from 'cookie-parser'
import { connectToDatabase } from './src/connections/mongodb'
import { userRouter } from './src/routes/user.routes'
import { storeRouter } from './src/routes/store.routes'

dotenv.config()

const app: Express = express()

const PORT = process.env.PORT
const DB_NAME: string = process.env.DB_NAME
const DB_URI: string = process.env.MONGO_ATLAS_URI
const URI_QUERY_PARAM: string = process.env.QUERY_PARAMETERS
const FRONT_END_URL: string = process.env.FRONT_END_URL

// Body parsing Middleware
app.use(express.json({ limit: '25mb' }))
app.use(express.urlencoded({ extended: true, limit: '25mb' }))
app.use(
  cors({
    origin: FRONT_END_URL,
    credentials: true
  })
)
app.use(cookieParser())

//Router middleware
app.use(userRouter)
app.use(storeRouter)

app.get('/', async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).send({ message: 'Typescript node server running!' })
})

try {
  app.listen(PORT, (): void => {
    /* eslint-disable no-console */
    console.log(`Successfully connected to ${FRONT_END_URL}`)
  })
} catch (error: any) {
  console.error(`Error occurred: ${error.message}`)
  /* eslint-enable no-console */
}

connectToDatabase(DB_URI + DB_NAME + URI_QUERY_PARAM)

const fetchEngines = async () => {
  const configuration = new Configuration({
    organization: 'org-5BC7ZnXiuRLcD8SLa4uZXQ4p',
    apiKey: process.env.OPEN_AI_API_KEY
  })

  const openai = new OpenAIApi(configuration)
  const response = await openai.listEngines()
  const res = await openai.listModels()
  console.log(res.data)

  // console.log(response)
  if (response.status === 200) {
    console.log('Successfully connected to Open AI API')
  } else {
    console.log('Error connecting to Open AI API')
  }
}
// @ts-ignore
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
fetchEngines()
