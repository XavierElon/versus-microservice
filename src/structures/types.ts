import nodemailer from 'nodemailer'

export class ErrorMessage {
  password: string
  mobileNumber: string
  email: string
  // userName: string
  firstName: string
  lastName: string
  constructor() {
    this.password =
      'Local password must contain at least 8 characters, at least one letter, at least one number, and at least one special character (@$!%*#?&)'
    this.mobileNumber = 'Invalid phone number'
    this.email = 'Invalid email'
    // this.userName =
    //   'Username must contain only letters and numbers, and must be between 3 - 20 characters'
    this.firstName = 'Firstname must contain only letters, and must be between 2 - 30 characters'
    this.lastName = 'Lastname must contain only letters, and must be between 2 - 30 characters'
  }
}

export class CustomTransporter {
  private transporter: nodemailer.Transporter

  constructor(host: string, port: number, secure: boolean, user: string, pass: string) {
    this.transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: secure,
      auth: {
        user: user,
        pass: pass
      }
    })
  }

  async sendMail(mailOptions: nodemailer.SendMailOptions): Promise<nodemailer.SentMessageInfo> {
    return await this.transporter.sendMail(mailOptions)
  }
}

export class MailOptions {
  from: string
  to: string
  subject: string
  html: string
  confirmationLink: string

  constructor(from: string, to: string, confirmationLink: string) {
    this.from = from
    this.to = to
    this.subject = 'Confirm your account'
    this.html = `Thank you for creating an account. Please click the following link to confirm your email address ${to}: <a href="${(this.confirmationLink =
      confirmationLink)}" target="_blank" rel="noopener noreferrer">
    ${this.confirmationLink}
  </a>`
  }
}
