import { sign, verify } from 'jsonwebtoken'
import dotenv from 'dotenv'
import * as jwtWrapper from '../middleware/jwtWrapper'

dotenv.config()

export const createLocalToken = (user) => {
  console.log(user)
  if (!user || Object.keys(user).length === 0) {
    return null
  }
  const accessToken = sign({ email: user.local.email, id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '24h'
  })
  return accessToken
}

export const createGoogleAuthToken = (user) => {
  if (!user || Object.keys(user).length === 0) {
    return null
  }
  const accessToken = sign({ email: user.firebaseGoogle.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' })
  return accessToken
}

export const validateToken = (req, res, next) => {
  const accessToken = req.cookies['user-token']
  if (!accessToken) return res.status(400).json({ error: 'User not authenticated' })
  try {
    const validToken = jwtWrapper.verify(accessToken, process.env.JWT_SECRET)
    console.log(validToken)

    if (validToken) {
      req.user = validToken
      req.authenticated = true
      return next()
    }
  } catch (err) {
    console.log('Error in validateToken: ' + err)
    return res.status(400).json({ error: err })
  }
}
