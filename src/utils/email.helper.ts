import { MailOptions, CustomTransporter } from '../structures/types'
import { User } from '../models/user.model'

const Gmail_SMTP: string = process.env.GMAIL_SMTP || 'smtp.gmail.com'
const Gmail_ACCOUNT: string = process.env.GMAIL_ACCOUNT || 'devgrusolutions@gmail.com'
const Gmail_PASSWORD: string = process.env.GMAIL_PASSWORD || 'lbbhthmaohhjegqd'
const Gmail_PORT: number = parseInt(process.env.GMAIL_PORT || '465', 10)
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
