import { expect } from 'chai'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import request from 'supertest'
import express, { Express } from 'express'
import { userRouter } from '../../src/routes/user.routes'
import mongoose from 'mongoose'
import path from 'path'
import supertest from 'supertest'
import sinon from 'sinon'
import chai from 'chai'
import chaiHttp from 'chai-http'
import { User } from '../../src/models/user.model'
import { connectToDatabase } from '../../src/connections/mongodb'
import { getGoogleUser } from '../../src/services/user.service'

const FRONT_END_URL: string = process.env.FRONT_END_URL!
chai.use(chaiHttp)
const app: Express = express()
app.use(express.json())
app.use(
  cors({
    origin: FRONT_END_URL,
    credentials: true
  })
)
app.use(cookieParser())
app.use('/', userRouter)
const testDbUri: string = process.env.TEST_DB_URI!

describe('User Routes test suite', function () {
  const agent = supertest.agent(app) // Create an agent instance
  this.timeout(5000)
  let userId: string
  let confirmationCode
  const badid: string = 'a'.repeat(28)
  let email: string = 'testuser2@example.com'
  const imageFilePath = path.join(__dirname, 'uploads', '1682955817554.jpg')

  before(async () => {
    try {
      await connectToDatabase(testDbUri as string)
    } catch (error) {
      console.log('Error in before hook: ' + error)
    }
  })

  after(async () => {
    // Empty database
    try {
      await User.deleteMany({})
      console.log('USERS DELETED')
      await mongoose.disconnect()
    } catch (error) {
      console.log('Error in after hook: ' + error)
    }
  })

  it('should add 2 users and return 201 status code for both', async () => {
    const res = await request(app)
      .post('/signup')
      .send({
        local: {
          email: 'testuser@example.com',
          password: 'testpassword12334343!',
          firstName: 'John',
          lastName: 'Doe'
        },
        provider: 'local'
      })
    expect(res.status).to.equal(201)
    const res2 = await request(app)
      .post('/signup')
      .send({
        local: {
          email: 'testuser2@example.com',
          password: 'testpassword12334343!',
          firstName: 'Elon',
          lastName: 'Musk'
        },
        provider: 'local'
      })
    userId = res.body.user._id
    confirmationCode = res.body.user.local.confirmationCode
    expect(res2.status).to.equal(201)
  })

  it('should not add duplicate local user and return 400 status code for both', async () => {
    const res = await request(app)
      .post('/signup')
      .send({
        local: {
          email: 'testuser@example.com',
          password: 'testpassword12334343!',
          firstName: 'John',
          lastName: 'Doe'
        },
        provider: 'local'
      })

    expect(res.status).to.equal(400)
  })

  it('should not add user due to forced stub error and return 500 status code', async () => {
    const saveStub = sinon.stub(User.prototype, 'save')
    saveStub.throws(new Error('forced error'))

    const res = await request(app)
      .post('/signup')
      .send({
        local: {
          email: 'testuser4@example.com',
          password: 'testpassword12334343!',
          firstName: 'John',
          lastName: 'Doe'
        },
        provider: 'local'
      })

    expect(res.status).to.equal(500)
    expect(res.body.message).to.equal('Error creating new user')

    saveStub.restore()
  })

  it('should validate account creation and return 201 status code', async () => {
    const res = await request(app).get(`/validate-account-creation/${userId}`)

    expect(res.status).to.equal(201)
    expect(res.body.message).to.equal('Your account has been created. Please check your email to confirm your account.')
  })

  it('should validate account creation and return 200 status code', async () => {
    const res = await request(app).get(`/validate-account-creation/${userId}?confirmed=true&token=${confirmationCode}`)

    expect(res.status).to.equal(200)
    expect(res.body.message).to.equal('Your account has been successfully created and confirmed.')
  })

  it('should validate account creation and return 500 status code', async () => {
    const res = await request(app).get(`/validate-account-creation/badid?confirmed=true&token=sometoken`)

    expect(res.status).to.equal(500)
    expect(res.body.message).to.equal('An error occurred while validating your account creation.')
  })

  it('should add a google user and return 200 status code', async () => {
    const id = 'a'.repeat(28)
    const res = await request(app)
      .post('/auth/firebase/google')
      .send({
        firebaseGoogle: {
          accessToken: '',
          displayName: 'Elon Musk',
          email: 'elonmusk@gmail.com',
          firebaseUid: id,
          photoUrl: '',
          refreshToken: ''
        }
      })

    expect(res.status).to.equal(200)

    expect(res.headers['set-cookie']).to.be.an('array')
    const cookie = res.headers['set-cookie'][0].split(';')[0]
    expect(cookie.startsWith('user-token=')).to.be.true
  })

  it('should login a google user and return 200 status code', async () => {
    const id = 'a'.repeat(28)
    const res = await request(app)
      .post('/auth/firebase/google')
      .send({
        firebaseGoogle: {
          accessToken: '',
          displayName: 'Elon Musk',
          email: 'elonmusk@gmail.com',
          firebaseUid: id,
          photoUrl: '',
          refreshToken: ''
        }
      })

    expect(res.status).to.equal(200)
    expect(res.body.message).to.equal('Google user logged in')
  })

  it('should not login a google user due to missing firebaseUid and return 400 status code', async () => {
    const res = await request(app)
      .post('/auth/firebase/google')
      .send({
        firebaseGoogle: {
          accessToken: '',
          displayName: 'Elon Musk',
          email: 'elonmusk@gmail.com',
          photoUrl: '',
          refreshToken: ''
        }
      })

    expect(res.status).to.equal(400)
    expect(res.body.message).to.equal('Missing firebaseUid')
  })

  it('should get google user and return a user', async () => {
    const id = 'a'.repeat(28)
    const response = await getGoogleUser(id)
    expect(response.firebaseGoogle.firebaseUid).to.equal(id)
  })

  it('should not add duplicate google user and return 400 status code for both', async () => {
    const res = await request(app)
      .post('/signup')
      .send({
        local: {
          email: 'elonmusk@gmail.com',
          password: 'testpassword12334343!',
          firstName: 'John',
          lastName: 'Doe'
        },
        provider: 'local'
      })
    expect(res.status).to.equal(400)
  })

  it('should login a user within 200 status code', async () => {
    const res = await request(app).post('/login').send({
      email: 'testuser@example.com',
      password: 'testpassword12334343!'
    })
    expect(res.status).to.equal(200)
  })

  it('should not login a user due to bad email within 401 status code', async () => {
    const res = await request(app).post('/login').send({
      email: 'testuse3r@example.com',
      password: 'testpassword12334343!'
    })
    expect(res.status).to.equal(401)
  })

  it('should not login a user due to bad password within 400 status code', async () => {
    const res = await request(app).post('/login').send({
      email: 'testuser@example.com',
      password: 'tespassword12334343!'
    })
    expect(res.status).to.equal(400)
  })

  it('should login a user within 200 status code', async () => {
    const res = await request(app).post('/login').send({
      email: 'testuser@example.com',
      password: 'testpassword12334343!'
    })
    expect(res.status).to.equal(200)
  })

  it('should login a user within 200 status code and set the access token cookie', async () => {
    const res = await agent.post('/login').send({
      email: 'testuser@example.com',
      password: 'testpassword12334343!'
    })
    expect(res.status).to.equal(200)

    // Make sure the cookie is set
    expect(res.headers['set-cookie']).to.be.an('array')
    const cookie = res.headers['set-cookie'][0].split(';')[0]
    expect(cookie.startsWith('user-token=')).to.be.true

    const profileRes = await agent // Use agent instead of request
      .get(`/profile/${userId}`)
      .withCredentials(true)

    expect(profileRes.status).to.equal(200)
    expect(profileRes.body.user.local.email).to.equal('testuser@example.com')
  })

  it('should logout a user with 200 status code', async () => {
    const res = await agent.post('/login').send({
      email: 'testuser@example.com',
      password: 'testpassword12334343!'
    })
    expect(res.status).to.equal(200)

    expect(res.headers['set-cookie']).to.be.an('array')
    const cookie = res.headers['set-cookie'][0].split(';')[0]
    expect(cookie.startsWith('user-token=')).to.be.true

    const logoutRes = await agent.post('/logout')

    expect(logoutRes.status).to.equal(200)

    // Check if the 'set-cookie' header is present and if it contains the expired 'user-token' cookie
    expect(logoutRes.headers['set-cookie']).to.be.an('array')
    const logoutCookie = logoutRes.headers['set-cookie'][0].split(';')[0]
    expect(logoutCookie).to.equal('user-token=')
  })

  it('should update a users first name to Achilles with 200 status code', async () => {
    const res = await agent.post('/login').send({
      email: 'testuser@example.com',
      password: 'testpassword12334343!'
    })
    expect(res.status).to.equal(200)

    expect(res.headers['set-cookie']).to.be.an('array')
    const cookie = res.headers['set-cookie'][0].split(';')[0]
    expect(cookie.startsWith('user-token=')).to.be.true

    const updateRes = await agent.put(`/update/${userId}`).send({
      'local.firstName': 'Achilles'
    })

    expect(updateRes.status).to.equal(200)
    expect(updateRes.body.updatedUser.local.firstName).to.equal('Achilles')
  })

  it('should not update because user id does not exist with 500 status code', async () => {
    const res = await agent.post('/login').send({
      email: 'testuser@example.com',
      password: 'testpassword12334343!'
    })
    expect(res.status).to.equal(200)

    expect(res.headers['set-cookie']).to.be.an('array')
    const cookie = res.headers['set-cookie'][0].split(';')[0]
    expect(cookie.startsWith('user-token=')).to.be.true

    const updateRes = await agent.put(`/update/${badid}`).send({
      'local.firstName': 'Achilles'
    })

    expect(updateRes.status).to.equal(500)
  })

  it('should upload a profile picture with status code 200', async () => {
    const res = await agent.post('/login').send({
      email: 'testuser@example.com',
      password: 'testpassword12334343!'
    })
    expect(res.status).to.equal(200)

    expect(res.headers['set-cookie']).to.be.an('array')
    const cookie = res.headers['set-cookie'][0].split(';')[0]
    expect(cookie.startsWith('user-token=')).to.be.true

    const uploadRes = await agent.post(`/upload-profile-picture/${userId}`).attach('image', imageFilePath)

    expect(uploadRes.status).to.equal(200)
    expect(uploadRes.body.message).to.equal('Profile picture uploaded successfully.')
  })

  it('should change users passcode with status code 200', async () => {
    const res = await agent.post('/login').send({
      email: 'testuser@example.com',
      password: 'testpassword12334343!'
    })
    expect(res.status).to.equal(200)

    expect(res.headers['set-cookie']).to.be.an('array')
    const cookie = res.headers['set-cookie'][0].split(';')[0]
    expect(cookie.startsWith('user-token=')).to.be.true

    const changePassRes = await agent.put('/changePassword').send({
      email: 'testuser@example.com',
      oldPassword: 'testpassword12334343!',
      newPassword: 'Heyachilles123!'
    })

    expect(changePassRes.status).to.equal(200)
    expect(changePassRes.body.message).to.equal('Password successfully reset')
  })

  it('should reset users password via email OTP with status code 200', async () => {
    const res = await agent.post('/login').send({
      email: 'testuser@example.com',
      password: 'Heyachilles123!'
    })
    expect(res.status).to.equal(200)

    expect(res.headers['set-cookie']).to.be.an('array')
    const cookie = res.headers['set-cookie'][0].split(';')[0]
    expect(cookie.startsWith('user-token=')).to.be.true

    const resetPassRes = await agent.put('/resetpassword').send({
      recipientEmail: 'testuser@example.com',
      password: 'Heyachilles123!'
    })

    expect(resetPassRes.status).to.equal(200)
  })

  it('should not delete a user by email with status code 404', async () => {
    const res = await agent.post('/login').send({
      email: 'testuser@example.com',
      password: 'Heyachilles123!'
    })
    expect(res.status).to.equal(200)

    expect(res.headers['set-cookie']).to.be.an('array')
    const cookie = res.headers['set-cookie'][0].split(';')[0]
    expect(cookie.startsWith('user-token=')).to.be.true

    const deleteRes = await agent.delete(`/deletebyemail/bademail`)

    expect(deleteRes.status).to.equal(404)
  })

  it('should delete a user by id with status code 200', async () => {
    const res = await agent.post('/login').send({
      email: 'testuser@example.com',
      password: 'Heyachilles123!'
    })
    expect(res.status).to.equal(200)

    expect(res.headers['set-cookie']).to.be.an('array')
    const cookie = res.headers['set-cookie'][0].split(';')[0]
    expect(cookie.startsWith('user-token=')).to.be.true

    const deleteRes = await agent.delete(`/delete/${userId}`)

    expect(deleteRes.status).to.equal(200)
  })

  it('should delete a user by email with status code 200', async () => {
    const res = await agent.post('/login').send({
      email: 'testuser2@example.com',
      password: 'testpassword12334343!'
    })
    expect(res.status).to.equal(200)

    expect(res.headers['set-cookie']).to.be.an('array')
    const cookie = res.headers['set-cookie'][0].split(';')[0]
    expect(cookie.startsWith('user-token=')).to.be.true

    const deleteRes = await agent.delete(`/deletebyemail/${email}`)

    expect(deleteRes.status).to.equal(200)
  })
})
