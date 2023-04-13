import { sign, verify } from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()


export const createToken = (user) => {
    const accessToken = sign({ username: user.username, id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    return accessToken
}

export const validateToken = (req, res, next) => {
    const accessToken = req.cookies['access-token']

    if (!accessToken) return res.status(400).json({ error: 'User not authenticated' })

    try {
        const validToken = verify(accessToken, process.env.JWT_SECRET)
        if (validToken) {
            req.authenticated = true
            return next
        }
    } catch (err) {
        return res.status(400).json({ error: err })
    }
}