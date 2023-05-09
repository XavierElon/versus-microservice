import { sign, verify } from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const createLocalToken = (user) => {
  console.log(user)
  const accessToken = sign({ email: user.local.email, id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '24h'
  })
  return accessToken
}

export const createGoogleAuthToken = (user) => {
  const accessToken = sign(
    { email: user.firebaseGoogle.email, id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  )
  return accessToken
}

export const validateToken = (req, res, next) => {
  const accessToken = req.cookies['user-token']
  console.log(req.cookies)
  // const accessToken = req.body.accessToken
  console.log(accessToken)
  if (!accessToken) return res.status(400).json({ error: 'User not authenticated' })
  try {
    const validToken = verify(accessToken, process.env.JWT_SECRET)
    req.use = validToken
    if (validToken) {
      req.authenticated = true
      return next()
    }
  } catch (err) {
    console.log('Error in validateToken: ' + err)
    return res.status(400).json({ error: err })
  }
}
