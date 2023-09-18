import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import fs from 'fs'
import { User } from '../models/user.model'
import { createUser, checkIfUserExists, updateUserById, deleteUserByEmail, confirmUser, checkIfGoogleFirebaseUserExists, getLocalUser, getGoogleUser, deleteUserById, createGoogleAuthUser, getAllUsers } from '../services/user.service'
import { createToken, setUserTokenCookie } from '../utils/jwt'
import { sendOTPEmail } from '../utils/email.helper'
import MobileDetect from 'mobile-detect'

export const GetUser = async (req: Request, res: Response) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  const id = req.params.id
  let user

  if (id.length == 28) {
    user = await getGoogleUser(req.params.id)
  } else {
    user = await getLocalUser(req.params.id)
  }

  let accessToken: string
  if (user) {
    accessToken = req.cookies['user-token']
    res.status(200).json({ user: user, authToken: accessToken })
  } else {
    console.log('No user found')
    res.status(400).json({ error: 'No user found' })
  }
}

export const GetAllUsers = async (req: Request, res: Response) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  const users: any = await getAllUsers()

  const simplifiedUsers = users.map((user: typeof User) => {
    let uid
    if ((user as any).provider === 'firebaseGoogle') {
      uid = (user as any).firebaseGoogle.firebaseUid
    } else {
      uid = (user as any)._id.toString()
    }
    // let userId = (user as any)._id.toString()
    let username
    let profilePicture
    let provider = (user as any).provider

    if (user as any) {
      username = `${(user as any).username}`
      profilePicture = (user as any).profilePicture || ''
    } else {
      throw new Error('No provider found')
    }

    return {
      id: uid,
      username: username,
      profilePicture: profilePicture,
      provider: provider
    }
  })
  if (simplifiedUsers.length === 0) {
    return res.status(400).json({ message: 'No users found' })
  } else {
    return res.status(200).json({ users: simplifiedUsers, message: 'Users found' })
  }
}

// Gets display name and profile Pic url for messages
export const GetUserMessageInfo = async (req: Request, res: Response) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  const id = req.params.id
  let user
  let localUser: boolean = false
  if (id.length == 28) {
    user = await getGoogleUser(req.params.id)
  } else {
    user = await getLocalUser(req.params.id)
    localUser = true
  }

  let imageUrl: string
  let username: string = user.username
  let uid: string

  if (localUser && user.local.profilePicture.url) {
    imageUrl = user.local.profilePicture.url
    uid = req.params.id
  } else if (!localUser && user.firebaseGoogle.photoURL) {
    imageUrl = user.firebaseGoogle.photoURL
    uid = user.firebaseUid
  }

  if (imageUrl) {
    return res.status(200).json({ photoURL: imageUrl, username: username, uid: uid })
  } else {
    return res.status(201).json({ message: 'User does not have profile picture' })
  }
}

export const CreateUser = async (req: Request, res: Response) => {
  const userData = req.body
  console.log(userData)
  const localEmail: string = userData?.local?.email || ''
  let userExists: any = await checkIfUserExists(localEmail)
  let googleFirebaseUserExists: any = await checkIfGoogleFirebaseUserExists(localEmail)

  if (userExists) {
    return res.status(400).json({ error: 'Local user with that email already exists' })
  } else if (googleFirebaseUserExists) {
    return res.status(400).json({ error: 'Google auth user already exists with that email' })
  } else {
    createUser(userData)
      .then((result) => {
        const accessToken = createToken(userData.local.email, userData._id)
        // const accessToken = createLocalToken(userData)
        setUserTokenCookie(res, accessToken)

        res.status(201).json({ message: 'User created', accessToken, user: result })
      })
      .catch((error) => {
        console.log('Error creating user: ', error)
        return res.status(500).json({ message: 'Error creating new user' })
      })
  }
}

export const LoginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body
  const user = await User.findOne({ 'local.email': email })

  if (!user) {
    console.log('Email does not exist')
    return res.status(401).json({ error: 'Email does not exist.' })
  }

  const hashedPassword = user?.local.password
  bcrypt.compare(password, hashedPassword).then((match) => {
    if (!match) {
      res.status(400).json({ error: 'Wrong username or password.' })
      return
    } else {
      const accessToken = createToken(user.local.email, user._id.toString())
      setUserTokenCookie(res, accessToken)

      res.status(200).json({ message: 'Login successful', accessToken, user })
    }
  })
}

export const LogoutUser = async (req: Request, res: Response) => {
  res.clearCookie('user-token')
  res.status(200).send({ message: 'Logged out successfully' })
}

export const GoogleAuthLoginAndSignup = async (req: Request, res: Response) => {
  try {
    console.log('google log in')
    const { email, firebaseUid } = req.body.firebaseGoogle
    const md = new MobileDetect(req.headers['user-agent'])
    console.log(md)
    let isMobile: boolean = false
    if (md.mobile()) {
      isMobile = true
    }
    console.log(isMobile)

    if (!firebaseUid) {
      return res.status(400).json({ message: 'Missing firebaseUid' })
    }

    let user = await User.findOne({ 'firebaseGoogle.email': email })

    // Create new Google auth user
    if (!user || user === null) {
      user = await createGoogleAuthUser(req.body.firebaseGoogle)
    }
    const newAccessToken = createToken(user.firebaseGoogle.email, user._id.toString())
    setUserTokenCookie(res, newAccessToken)
    return res.status(200).json({
      newAccessToken,
      user: {
        _id: user.id,
        firebaseUid: user.firebaseGoogle.firebaseUid,
        email,
        provider: user.provider
      },
      message: 'Google user logged in'
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const UpdateUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const update = req.body

    // Find the user by ID and update its properties
    const updatedUser = await updateUserById(id, update)
    return res.status(200).send({ updatedUser, message: 'User updated' })
  } catch (error) {
    console.error(`Error updating user: ${error}`)
    return res.status(500).send({ error: 'Server error' })
  }
}

export const UploadProfilePictureById = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id)
  const data = fs.readFileSync(req.file.path)
  const contentType = req.file.mimetype
  const base64String = Buffer.from(data).toString('base64')
  const url = `data:${contentType};base64,${base64String}`

  user.profilePicture = url

  await user.save()

  fs.unlinkSync(req.file.path)

  res.status(200).send({ message: 'Profile picture uploaded successfully.' })
}

export const DeleteUserByEmail = async (req: Request, res: Response) => {
  const email = req.params.email
  try {
    const deletedUser = await deleteUserByEmail(email)
    if (!deletedUser || Object.keys(deletedUser).length === 0) {
      return res.status(404).send(`User with email ${email} not found`)
    }
    return res.send(`Deleted user: ${deletedUser}`)
  } catch (err) {
    console.error(`Error deleting user with email ${email}:`, err)
    return res.status(500).send('Error deleting user by email')
  }
}

export const DeleteUserById = async (req: Request, res: Response) => {
  const id = req.params.id
  try {
    const deletedUser = await deleteUserById(id)
    return res.send(`Deleted user: ${deletedUser}`)
  } catch (err) {
    console.error(`Error deleting user with id ${id}:`, err)
    return res.status(500).send('Error deleting user by id')
  }
}

export const ValidateAccountCreation = async (req: Request, res: Response) => {
  try {
    const { confirmed, token } = req.query
    if (confirmed === 'true' && typeof token === 'string') {
      await confirmUser(token)
      res.status(200).json({ message: 'Your account has been successfully created and confirmed.' })
    } else {
      res.status(201).json({ message: 'Your account has been created. Please check your email to confirm your account.' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error occurred while validating your account creation.' })
  }
}

export const ChangePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword, email } = req.body

  const user = await User.findOne({ 'local.email': email })

  bcrypt.compare(oldPassword, user.local.password).then(async (match) => {
    if (!match) res.json({ error: 'Wrong Password Entered!' })

    bcrypt.hash(newPassword, 10).then(async (hash) => {
      user.local.password = hash
      await user.save()
      res.status(200).send({ message: 'Password successfully reset' })
    })
  })
}

export const ResetPassword = async (req: Request, res: Response) => {
  const { password, recipientEmail } = req.body

  const user = await User.findOne({ 'local.email': recipientEmail })
  bcrypt.hash(password, 10).then(async (hash) => {
    user.local.password = hash
    await user.save()
    res.status(200).send({ message: 'Pasword successfully reset' })
  })
}

export const SendOTPEmail = async (req: Request, res: Response) => {
  const { OTP, recipientEmail } = req.body
  sendOTPEmail(OTP, recipientEmail)
    .then((response: any) => {
      res.status(200)
      res.send({ message: 'Email successfully sent.' })
    })
    .catch((error) => {
      res.status(500).send(error.message)
    })
}
