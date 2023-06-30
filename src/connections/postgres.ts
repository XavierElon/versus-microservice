import { Sequelize } from 'sequelize-typescript'
import { config } from 'dotenv'

config()

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: process.env.POSTGRES_DB_PASSWORD,
  database: 'my_database'
})

export const connectToPostgresDatabase = () => {
  console.log(typeof process.env.POSTGRES_DB_PASSWORD)
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established with Postgres successfully.')
    })
    .catch((error) => {
      console.error('Unable to connect to the database: ' + error)
    })
}
