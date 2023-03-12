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

let config: Config = {
  PORT: '1017' || '',
  HOST: 'xsj-users-microservice-ALB-2043036145.us-west-2.elb.amazonaws.com' || '',
  DB_URI: 'mongodb+srv://root:IhvkxnDwROpiDZpd@jsx.nwqtn5o.mongodb.net' || '',
  DB_NAME: '/users' || '',
  QUERY_PARAM: '?retryWrites=true&w=majority' || '',
  Gmail_SMTP: 'smtp.gmail.com' || '',
  Gmail_ACCOUNT: 'devgrusolutions@gmail.com' || '',
  Gmail_PASSWORD: 'lbbhthmaohhjegqd' || '',
  Gmail_PORT: parseInt('465' || '465', 10)
}

export default config
