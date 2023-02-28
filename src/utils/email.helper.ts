import { MailOptions, CustomTransporter } from '../structures/types'
import { User } from '../models/user.model'
import config from '../../config'

const Gmail_SMTP = config.Gmail_SMTP
const Gmail_ACCOUNT = config.Gmail_ACCOUNT
const Gmail_PASSWORD = config.Gmail_PASSWORD
const Gmail_PORT = config.Gmail_PORT

/*
SEND GMAIL CONFIRMATION
*/
export const sendConfirmationGmail = async (
  endUserEmail: string,
  confirmationLink: string
): Promise<void> => {
  const GmailTransporter = new CustomTransporter(
    Gmail_SMTP,
    Gmail_PORT,
    true,
    Gmail_ACCOUNT,
    Gmail_PASSWORD
  )

  const mailOptions = new MailOptions(Gmail_ACCOUNT, endUserEmail, confirmationLink)

  await GmailTransporter.sendMail(mailOptions)
}

/*
CREATE CONFIRMATION LINK
*/
export const createConfirmationLink = async (
  userData: typeof User,
  baseUrl: string
): Promise<string> => {
  const user = new User(userData)
  const confirmationPath = `/validate-account-creation/${user.id}?confirmed=true&token=${user.confirmationCode}`
  const confirmationUrl = new URL(confirmationPath, baseUrl)
  return confirmationUrl.toString()
}
