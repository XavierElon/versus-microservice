import cors from 'cors'
import config from './src/config/config'
import express, { Express, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import nodemailer from 'nodemailer'
import { connectToDatabase } from './src/connections/mongodb'
import { userRouter } from './src/routes/user.routes'

dotenv.config()

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
app.use(cors())
app.use(cookieParser())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    next()
})
app.use(userRouter)

const sendEmail = ({ recipient_email, OTP }) => {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_ACCOUNT,
                pass: process.env.GMAIL_PASSWORD
            }
        })

        const mail_configs = {
            from: process.env.GMAIL_ACCOUNT,
            to: recipient_email,
            subject: 'Recover Password',
            html: `<!DOCTYPE html>
            <html lang="en" >
            <head>
              <meta charset="UTF-8">
              <title>CodePen - OTP Email Template</title>
              
            </head>
            <body>
            <!-- partial:index.partial.html -->
            <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
              <div style="margin:50px auto;width:70%;padding:20px 0">
                <div style="border-bottom:1px solid #eee">
                  <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Koding 101</a>
                </div>
                <p style="font-size:1.1em">Hi,</p>
                <p>Thank you for choosing Koding 101. Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes</p>
                <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
                <p style="font-size:0.9em;">Regards,<br />Koding 101</p>
                <hr style="border:none;border-top:1px solid #eee" />
                <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                  <p>Koding 101 Inc</p>
                  <p>1600 Amphitheatre Parkway</p>
                  <p>California</p>
                </div>
              </div>
            </div>
            <!-- partial -->
              
            </body>
            </html>`,
        }
        transporter.sendMail(mail_configs, (error, info) => {
            if (error) {
                console.log(error)
                return reject({ message: 'An error has occurred' })
            }
            return resolve({ message: 'Email sent successfully' })
        })
    })
}

app.get('/', async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).send({ message: 'Typescript node server running!' })
})

app.post('/send_recovery_email', (req: Request, res: Response) => {
    sendEmail(req.body).then((response: any) => res.send(response.message))
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
