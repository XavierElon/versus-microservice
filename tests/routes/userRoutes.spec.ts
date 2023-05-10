import { expect } from 'chai'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import request from 'supertest'
import express, { Express } from 'express'
import { userRouter } from '../../src/routes/user.routes'
import mongoose, { Model } from 'mongoose'
import sinon from 'sinon'
import path from 'path'
import supertest from 'supertest'
import chai from 'chai'
import chaiHttp from 'chai-http'
import { User } from '../../src/models/user.model'
import { connectToDatabase } from '../../src/connections/mongodb'

const FRONT_END_URL: string = process.env.FRONT_END_URL
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

describe('User Controller', function () {
  const agent = supertest.agent(app) // Create an agent instance
  this.timeout(5000)
  let userId: string
  const imageFilePath = path.join(__dirname, 'uploads', '1682955817554.jpg')
  console.log(imageFilePath)

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
  it('should add 2 newsletter users and return 201 status code for both', async () => {
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
    console.log(userId)
    expect(res2.status).to.equal(201)
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

    // Make sure the cookie is set
    expect(res.headers['set-cookie']).to.be.an('array')
    const cookie = res.headers['set-cookie'][0].split(';')[0]
    expect(cookie.startsWith('user-token=')).to.be.true

    const logoutRes = await agent // Use agent instead of request
      .post('/logout')

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

    // Make sure the cookie is set
    expect(res.headers['set-cookie']).to.be.an('array')
    const cookie = res.headers['set-cookie'][0].split(';')[0]
    expect(cookie.startsWith('user-token=')).to.be.true

    const updateRes = await agent.put(`/update/${userId}`).send({
      'local.firstName': 'Achilles'
    })

    expect(updateRes.status).to.equal(200)
    expect(updateRes.body.updatedUser.local.firstName).to.equal('Achilles')
  })

  it('should upload a profile picture with status code 200', async () => {
    const res = await agent.post('/login').send({
      email: 'testuser@example.com',
      password: 'testpassword12334343!'
    })
    expect(res.status).to.equal(200)

    // Make sure the cookie is set
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

    // Make sure the cookie is set
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

    // Make sure the cookie is set
    expect(res.headers['set-cookie']).to.be.an('array')
    const cookie = res.headers['set-cookie'][0].split(';')[0]
    expect(cookie.startsWith('user-token=')).to.be.true

    const resetPassRes = await agent.put('/resetpassword').send({
      recipientEmail: 'testuser@example.com',
      password: 'Heyachilles123!'
    })

    console.log(resetPassRes)
    expect(resetPassRes.status).to.equal(200)
  })

  it('should delete a user by id with status code 200', async () => {
    const res = await agent.post('/login').send({
      email: 'testuser@example.com',
      password: 'Heyachilles123!'
    })
    expect(res.status).to.equal(200)

    // Make sure the cookie is set
    expect(res.headers['set-cookie']).to.be.an('array')
    const cookie = res.headers['set-cookie'][0].split(';')[0]
    expect(cookie.startsWith('user-token=')).to.be.true

    const deleteRes = await agent.delete(`/delete/${userId}`)

    expect(deleteRes.status).to.equal(200)
  })
})
