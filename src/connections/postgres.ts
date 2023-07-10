import { Sequelize } from 'sequelize-typescript'
import { config } from 'dotenv'
import { Item } from '../models/item.model'

config()

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: process.env.POSTGRES_DB_PASSWORD,
  database: 'my_database'
})

sequelize.addModels([Item])

sequelize
  .sync()
  .then(() => console.log('Tables created successfully'))
  .catch((err) => console.error('Error creating tables: ' + err))

export const connectToPostgresDatabase = () => {
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established with Postgres successfully.')
    })
    .catch((error) => {
      console.error('Unable to connect to the database: ' + error)
    })
}
