import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import { MailOptions, CustomTransporter } from '../structures/types'
import { User } from '../models/user.model'

dotenv.config()

const GMAIL_SMTP = process.env.GMAIL_SMTP
const GMAIL_ACCOUNT = process.env.GMAIL_ACCOUNT
const GMAIL_APP_PASSWORD: string = process.env.GMAIL_APP_PASSWORD
const GMAIL_PORT: number = parseInt(process.env.GMAIL_PORT)

/*
SEND GMAIL CONFIRMATION
*/
export const sendConfirmationGmail = async (endUserEmail: string, confirmationLink: string): Promise<void> => {
  try {
    const GmailTransporter = new CustomTransporter(GMAIL_SMTP, GMAIL_PORT, true, GMAIL_ACCOUNT, GMAIL_APP_PASSWORD)

    const mailOptions = new MailOptions(GMAIL_ACCOUNT, endUserEmail, confirmationLink)

    await GmailTransporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Failed to send confirmation email: ', error)
    throw new Error(error)
  }
}

/*
CREATE CONFIRMATION LINK
*/
export const createConfirmationLink = (userData: typeof User, baseUrl: string): string => {
  const user = new User(userData)
  const confirmationPath = `/validate-account-creation/${user.id}?confirmed=true&token=${user.local.confirmationCode}`
  const confirmationUrl = new URL(confirmationPath, baseUrl)
  return confirmationUrl.toString()
}

/*
Send OTP Email for password recovery
*/
export const sendOTPEmail = (OTP, recipientEmail) => {
  console.log(OTP)
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_ACCOUNT,
        pass: GMAIL_APP_PASSWORD
      }
    })

    const mail_configs = {
      from: process.env.GMAIL_ACCOUNT,
      to: recipientEmail,
      subject: 'Recover Password',
      html: `<!DOCTYPE html>
          <html lang="en" >
          <head>
            <meta charset="UTF-8">
            <title>XSJ OTP Email</title>
            
          </head>
          <body>
          <!-- partial:index.partial.html -->
          <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
              <div style="border-bottom:1px solid #eee">
                <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">XSJ</a>
              </div>
              <p style="font-size:1.1em">Hi,</p>
              <p>Thank you for choosing XSJ. Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 2 minutes</p>
              <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
              <p style="font-size:0.9em;">Regards,<br />Koding 101</p>
              <hr style="border:none;border-top:1px solid #eee" />
              <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                <p>XSJ Inc</p>
              </div>
            </div>
          </div>
          <!-- partial -->
            
          </body>
          </html>`
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
