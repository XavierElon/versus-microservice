import { Sequelize } from 'sequelize-typescript'

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'toor',
  database: 'my_database'
})

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
