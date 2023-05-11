// @ts-nocheck

import { expect } from 'chai'
import mongoose, { Model } from 'mongoose'
import sinon from 'sinon'
import { User } from '../../src/models/user.model'
import { GetUser } from '../../src/controllers/user.controllers'
import * as userServices from '../../src/services/user.service'
import { connectToDatabase } from '../../src/connections/mongodb'

const testDbUri: string = process.env.TEST_DB_URI!

describe('User service test suite', function () {
  let UserModel: Model<Document & typeof User> = mongoose.model('User')
  const userEmail: string = 'testuser@gmail.com'
  let userId: string
  const googleId: string = 'a'.repeat(28)
  let confirmationCode

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

    sinon.restore()
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
})
