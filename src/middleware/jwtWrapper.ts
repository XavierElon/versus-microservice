import jwt from 'jsonwebtoken'

export const verify = (token, secret) => {
  return jwt.verify(token, secret)
}
