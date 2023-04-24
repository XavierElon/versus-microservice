import { sign, verify } from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const createLocalToken = (user) => {
    const accessToken = sign({ email: user.email, id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
    return accessToken
}

export const createGoogleAuthToken = (firebaseUid) => {
    const accessToken = sign({ firebaseUid: firebaseUid }, process.env.JWT_SECRET, { expiresIn: '24h'})
    return accessToken
}

export const validateToken = (req, res, next) => {
    console.log(req.cookies)
    const accessToken = req.cookies['access-token']

    if (!accessToken) return res.status(400).json({ error: 'User not authenticated' })

    try {
        const validToken = verify(accessToken, process.env.JWT_SECRET)
        req.use = validToken
        if (validToken) {
            req.authenticated = true
            return next()
        }
    } catch (err) {
        return res.status(400).json({ error: err })
    }
}