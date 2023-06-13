import cors from 'cors'
import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import { Configuration, OpenAIApi } from 'openai'
import cookieParser from 'cookie-parser'
import { connectToDatabase } from './src/connections/mongodb'
import { chatGPTRouter, storeRouter, userRouter } from './src/routes'

dotenv.config()

const app: Express = express()

const PORT = process.env.PORT
const DB_NAME: string = process.env.DB_NAME
const DB_URI: string = process.env.MONGO_ATLAS_URI
const URI_QUERY_PARAM: string = process.env.QUERY_PARAMETERS
const FRONT_END_URL: string = process.env.FRONT_END_URL

// Body parsing Middleware
// Allows images to be upoloaded
app.use(express.json({ limit: '25mb' }))
app.use(express.urlencoded({ extended: true, limit: '25mb' }))
app.use(
  cors({
    origin: FRONT_END_URL,
    credentials: true
  })
)

// Cookie parsing middleware
app.use(cookieParser())

//Router middleware
app.use(chatGPTRouter)
app.use(storeRouter)
app.use(userRouter)

// Test route
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

// Connect to OpenAPI ChatGPT-3.5Turbo
export let openai
const fetchEngines = async () => {
  const configuration = new Configuration({
    organization: 'org-5BC7ZnXiuRLcD8SLa4uZXQ4p',
    apiKey: process.env.OPEN_AI_API_KEY
  })

  openai = new OpenAIApi(configuration)
  const response = await openai.listEngines()
  await openai.listModels()

  if (response.status === 200) {
    console.log('Successfully connected to Open AI API')
  } else {
    console.log('Error connecting to Open AI API')
  }
}

// This is needed for when you aren't on a Wifi with secure settings or on a VPN
// @ts-ignore
// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
fetchEngines()
