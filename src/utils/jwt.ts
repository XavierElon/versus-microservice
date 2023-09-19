import { sign } from 'jsonwebtoken'
import { Request, Response } from 'express'
import * as jwtWrapper from '../middleware/jwtWrapper'
import MobileDetect from 'mobile-detect'

export const createToken = (email: string, id: string) => {
  if (!email || !id) {
    throw new Error('Token not created because email or id is empty')
  }

  const accessToken = sign({ email: email, id: id }, process.env.JWT_SECRET, { expiresIn: '24h' })
  return accessToken
}

export const setUserTokenCookie = (res: Response, accessToken: string) => {
  console.log(accessToken)
  if (process.env.NODE_ENV === 'dev') {
    res.cookie('user-token', accessToken, {
      maxAge: 60 * 60 * 24 * 1000
    })
  } else {
    res.cookie('user-token', accessToken, {
      maxAge: 60 * 60 * 24 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    })
  }
}

export const isMobileUser = (req: Request): boolean => {
  const md = new MobileDetect(req.headers['user-agent'])
  let isMobile: boolean = false
  if (md.mobile()) {
    isMobile = true
  }
  return isMobile
}

export const validateToken = (req, res, next) => {
  const isMobile: boolean = isMobileUser(req)
  const accessToken = req.cookies['user-token']

  if (isMobile) {
    req.authenticated = true
    req.user = accessToken
    return next()
  }

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
    console.error('Error in validateToken: ' + err)
    return res.status(400).json({ error: err })
  }
}
