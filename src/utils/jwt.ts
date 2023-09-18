import { sign } from 'jsonwebtoken'
import { Response } from 'express'
import * as jwtWrapper from '../middleware/jwtWrapper'

// export const createLocalToken = (user) => {
//   if (!user || Object.keys(user).length === 0) {
//     return null
//   }
//   const accessToken = sign({ email: user.local.email, id: user._id }, process.env.JWT_SECRET, {
//     expiresIn: '24h'
//   })
//   return accessToken
// }

// export const createGoogleAuthToken = (user) => {
//   if (!user || Object.keys(user).length === 0) {
//     return null
//   }
//   const accessToken = sign({ email: user.firebaseGoogle.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' })
//   return accessToken
// }

export const createToken = (email: string, id: string) => {
  if (!email || !id) {
    throw new Error('Token not created because email or id is empty')
  }

  const accessToken = sign({ email: email, id: id }, process.env.JWT_SECRET, { expiresIn: '24h' })
  console.log(accessToken)
  console.log(email)
  console.log(id)
  return accessToken
}

export const setUserTokenCookie = (res: Response, accessToken: string) => {
  console.log(accessToken)
  if (process.env.NODE_ENV === 'dev') {
    console.log('here')
    res.cookie('user-token', accessToken, {
      maxAge: 60 * 60 * 24 * 1000
    })
  } else {
    console.log('$$$$$$$$$$$$')
    res.cookie('user-token', accessToken, {
      maxAge: 60 * 60 * 24 * 1000,
      httpOnly: true,
      secure: true
      // sameSite: 'none'
    })
  }
  console.log('set user token')
}

export const validateToken = (req, res, next) => {
  console.log('validate token')
  console.log(req.cookies)
  const accessToken = req.cookies['user-token']
  console.log(accessToken)
  if (!accessToken) return res.status(400).json({ error: 'User not authenticated' })

  try {
    const validToken = jwtWrapper.verify(accessToken, process.env.JWT_SECRET)

    if (validToken) {
      req.user = validToken
      req.authenticated = true
      return next()
    } else {
      return res.status(400).json({ error: 'Invalid token' })
    }
  } catch (err) {
    console.log('Error in validateToken: ' + err)
    return res.status(400).json({ error: err })
  }
}
