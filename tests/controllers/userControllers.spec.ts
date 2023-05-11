// @ts-nocheck

import chai, { expect } from 'chai'
import mongoose, { Model } from 'mongoose'
import sinon from 'sinon'
import { mockReq, mockRes } from 'sinon-express-mock'
import nodemailer from 'nodemailer'
import { User } from '../../src/models/user.model'
import { DeleteUserByEmail, DeleteUserById, GetUser, SendOTPEmail } from '../../src/controllers/user.controllers'
import * as userServices from '../../src/services/user.service'
import { connectToDatabase } from '../../src/connections/mongodb'
import sinonChai from 'sinon-chai'

chai.use(sinonChai)

const testDbUri: string = process.env.TEST_DB_URI!

describe('User service test suite', function () {
  const googleId: string = 'a'.repeat(28)

  this.timeout(5000)

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

  afterEach(() => {
    sinon.restore()
  })

  it('should call getGoogleUser when id length is 28', async () => {
    const id = 'a'.repeat(28) // Create a string of length 28
    const mockRequest = { params: { id }, cookies: { 'access-token': 'testToken' } }
    const mockResponse = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
      setHeader: sinon.stub().returnsThis()
    }

    sinon.stub(userServices, 'getGoogleUser').resolves({})
    sinon.stub(userServices, 'getLocalUser').resolves({})

    await GetUser(mockRequest, mockResponse)

    expect(userServices.getGoogleUser.calledWith(id)).to.be.true
    expect(userServices.getLocalUser.called).to.be.false
  })

  it('should respond with error when no user is found', async () => {
    const id = 'a'.repeat(28) // Create a string of length 28
    const mockRequest = { params: { id }, cookies: { 'access-token': 'testToken' } }
    const mockResponse = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
      setHeader: sinon.stub().returnsThis()
    }

    // Stub the getGoogleUser and getLocalUser functions to return null
    sinon.stub(userServices, 'getGoogleUser').resolves(null)

    await GetUser(mockRequest, mockResponse)

    // Check that status was called with 400
    expect(mockResponse.status.calledWith(400)).to.be.true

    // Check that json was called with the correct error message
    expect(mockResponse.json.calledWith({ error: 'No user found' })).to.be.true
  })

  it('should handle errors in DeleteUserByEmail', async () => {
    const errorMessage = 'Database error'

    // Stub deleteUserById to throw an error
    const deleteUserStub = sinon.stub(User, 'findOneAndDelete')
    deleteUserStub.throws(new Error(errorMessage))

    // Mock request and response objects
    const req = mockReq({
      params: {
        id: 'testId'
      }
    })
    const res = mockRes()

    // Call the function with test data
    await DeleteUserByEmail(req, res)

    // Assert that correct status was set and correct message was sent
    expect(res.status).to.have.been.calledWith(500)
    expect(res.send).to.have.been.calledWith('Error deleting user by email')
  })

  it('should handle errors in DeleteUserById', async () => {
    const errorMessage = 'Database error'

    // Stub deleteUserById to throw an error
    const deleteUserStub = sinon.stub(User, 'findOneAndDelete')
    deleteUserStub.throws(new Error(errorMessage))

    // Mock request and response objects
    const req = mockReq({
      params: {
        id: 'testId'
      }
    })
    const res = mockRes()

    // Call the function with test data
    await DeleteUserById(req, res)

    // Assert that correct status was set and correct message was sent
    expect(res.status).to.have.been.calledWith(500)
    expect(res.send).to.have.been.calledWith('Error deleting user by id')
  })

  it('should respond with success when email is sent', async () => {
    const req = mockReq({
      body: {
        OTP: '123456',
        recipientEmail: 'test@example.com'
      }
    })

    const res = mockRes()

    const sendMailStub = sinon.stub().yields(null, 'Email sent successfully')
    sinon.stub(nodemailer, 'createTransport').returns({ sendMail: sendMailStub })

    await SendOTPEmail(req, res).catch((error) => {
      console.error('Error in SendOTPEmail:', error)
    })

    expect(res.status).to.have.been.calledWith(200)
    expect(res.send).to.have.been.calledWith({ message: 'Email successfully sent.' })
  })
})
