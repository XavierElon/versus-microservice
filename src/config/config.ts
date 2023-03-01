import dotenv from 'dotenv'

dotenv.config()

interface Config {
  PORT: string
  HOST: string
  DB_URI: string
  DB_NAME: string
  QUERY_PARAM: string
  Gmail_SMTP: string
  Gmail_ACCOUNT: string
  Gmail_PASSWORD: string
  Gmail_PORT: number
}

const config: Config = {
  PORT: process.env.PORT || '',
  HOST: process.env.HOST || '',
  DB_URI: process.env.MONGO_ATLAS_URI || '',
  DB_NAME: process.env.DB_USERS_COLLECTION_USERS || '',
  QUERY_PARAM: process.env.QUERY_PARAMETERS || '',
  Gmail_SMTP: process.env.GMAIL_SMTP || '',
  Gmail_ACCOUNT: process.env.GMAIL_ACCOUNT || '',
  Gmail_PASSWORD: process.env.GMAIL_PASSWORD || '',
  Gmail_PORT: parseInt(process.env.GMAIL_PORT || '465', 10)
}

export default config
