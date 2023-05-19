// @ts-nocheck

import { expect } from 'chai'
import mongoose, { Model } from 'mongoose'
import sinon from 'sinon'
import jest, { spyOn } from 'jest'
import { User } from '../../src/models/user.model'
import { createUser, checkIfUserExists, getUserByEmail, deleteUserByEmail, deleteUserById, getAllUsers, getUserById, getGoogleUser, getLocalUser, updateUserById, confirmUser, deleteUnconfirmedUsers } from '../../src/services/user.service'
import { connectToDatabase } from '../../src/connections/mongodb'
import dotenv from 'dotenv'

dotenv.config()

const testDbUri: string = process.env.TEST_DB_URI!

describe('User service test suite', function () {
  const UserModel: Model<Document & typeof User> = mongoose.model('User')
  const dateString = '2023-05-08T00:00:00.000Z'
  const date = new Date(dateString)
  const testUser = new UserModel({
    local: {
      email: 'testuser@gmail.com',
      password: 'Testpassword123!',
      firstName: 'John',
      lastName: 'Doe'
    },
    username: 'elonmusk',
    provider: 'local'
  })

  const testUser2 = new UserModel({
    local: {
      email: 'testuser2@gmail.com',
      password: 'Testpassword123!',
      firstName: 'Elon',
      lastName: 'Musk'
    },
    username: 'xxxtentacion',
    provider: 'local'
  })
  const testUser3 = new UserModel({
    local: {
      email: 'testuser3@gmail.com',
      password: 'Testpassword123!',
      firstName: 'Elon',
      lastName: 'Musk',
      confirmationTokenExpirationTime: date
    },
    username: 'xavierelon',
    provider: 'local'
  })

  const userEmail: string = 'testuser@gmail.com'
  let userId: string
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

  afterEach(() => {
    sinon.restore()
  })

  it('should create 2 new users and expect first name to equal John adn email to equal testuser2@gmail.com', async () => {
    const result = await createUser(testUser)
    confirmationCode = result.local.confirmationCode
    expect(result.local.firstName).to.equal('John')
    const result2 = await createUser(testUser2)
    expect(result2.local.email).to.equal('testuser2@gmail.com')
  })

  it('should return all newsletter users (2)', async () => {
    const result = await getAllUsers()
    expect(result.length).to.equal(2)
  })

  it('should return a single user by email', async () => {
    const res = await getUserByEmail(userEmail)
    userId = res._id
    expect(res.local.email).to.equal(userEmail)
  })

  it('should return a single user by id', async () => {
    const res = await getUserById(userId)
    expect(res._id.toString()).to.equal(userId.toString())
  })

  it('should return a local user', async () => {
    const res = await getLocalUser(userId)
    expect(res._id.toString()).to.equal(userId.toString())
  })

  it('should verify a local user exists and return true', async () => {
    const res = await checkIfUserExists(userEmail)
    expect(res).to.equal(true)
  })

  it('should update a user by id last name to Musk', async () => {
    const res = await updateUserById(userId, { 'local.lastName': 'Musk' })
    expect(res.local.lastName).to.equal('Musk')
  })

  it('should update a user by id first name to Achilles', async () => {
    const res = await updateUserById(userId, { 'local.firstName': 'Achilles' })
    expect(res.local.firstName).to.equal('Achilles')
  })

  it('should confirm user with confirmation code', async () => {
    const res = await confirmUser(confirmationCode)
    expect(res.local.confirmationCode).to.equal(confirmationCode)
  })

  it('should delete a user by email', async () => {
    await deleteUserByEmail(userEmail)
    const result = await getAllUsers()
    expect(result.length).to.equal(1)
    userId = result[0]._id
    expect(result[0].email).to.not.equal(userEmail)
  })

  it('should delete a user by id', async () => {
    await deleteUserById(userId)
    const result = await getAllUsers()
    expect(result.length).to.equal(0)
  })

  it('should delete unconfirmed users', async () => {
    await createUser(testUser3)
    await deleteUnconfirmedUsers()
    const allUsers = await getAllUsers()
    expect(allUsers.length).to.equal(0)
  })

  // it('should handle errors when saving user', async function () {
  //   // Arrange
  //   const mockUserData = {
  //     local: {
  //       password: 'password123',
  //       email: 'test@test.com'
  //     }
  //   }

  //   // Set up the stub to force an error when User.save is called
  //   const saveStub = sinon.stub(User.prototype, 'save')
  //   saveStub.throws(new Error('forced error'))

  //   // Act & Assert
  //   try {
  //     await createUser(mockUserData)
  //   } catch (err) {
  //     expect(err).to.exist
  //     expect(err.message).to.equal('Error creating new user')
  //   }
  // })

  it('should catch error in getAllUsers and throw an error', async () => {
    const error = new Error('Test error')
    const findStub = sinon.stub(User, 'find').throws(error)
    const consoleErrorStub = sinon.stub(console, 'error')

    try {
      await getAllUsers()
      // If the function doesn't throw an error, fail the test
      expect.fail('No error thrown')
    } catch (err) {
      expect(findStub.calledOnce).to.be.true
      expect(consoleErrorStub.calledOnce).to.be.true
      expect(err.message).to.equal('No users found')
    }
  })

  it('should catch error in getUserByEmail and throw an error', async () => {
    const error = new Error('Test error')
    const findOneStub = sinon.stub(User, 'findOne').throws(error)
    const consoleErrorStub = sinon.stub(console, 'error')

    try {
      await getUserByEmail()
      // If the function doesn't throw an error, fail the test
      expect.fail('No error thrown')
    } catch (err) {
      expect(findOneStub.calledOnce).to.be.true
      expect(consoleErrorStub.calledOnce).to.be.true
      expect(err.message).to.equal('No user found with that email')
    }
  })

  it('should catch error in getUserByID and throw an error', async () => {
    const error = new Error('Test error')
    const findByIdStub = sinon.stub(User, 'findById').throws(error)
    const consoleErrorStub = sinon.stub(console, 'error')

    try {
      await getUserById()
      // If the function doesn't throw an error, fail the test
      expect.fail('No error thrown')
    } catch (err) {
      expect(findByIdStub.calledOnce).to.be.true
      expect(consoleErrorStub.calledOnce).to.be.true
      expect(err.message).to.equal('No user found with that id')
    }
  })

  it('should catch error in getLocalUser and throw an error', async () => {
    const error = new Error('Test error')
    const findOneStub = sinon.stub(User, 'findOne').throws(error)
    const consoleErrorStub = sinon.stub(console, 'error')

    try {
      await getLocalUser()
      // If the function doesn't throw an error, fail the test
      expect.fail('No error thrown')
    } catch (err) {
      expect(findOneStub.calledOnce).to.be.true
      expect(consoleErrorStub.calledOnce).to.be.true
      expect(err.message).to.equal('No local user found with that id')
    }
  })

  it('should catch error in getGoogleUser and throw an error', async () => {
    const error = new Error('Test error')
    const findOneStub = sinon.stub(User, 'findOne').throws(error)
    const consoleErrorStub = sinon.stub(console, 'error')

    try {
      await getGoogleUser('google-user-id')
      // If the function doesn't throw an error, fail the test
      expect.fail('No error thrown')
    } catch (err) {
      expect(findOneStub.calledOnce).to.be.true
      expect(consoleErrorStub.calledOnce).to.be.true
      expect(err.message).to.equal('No google auth user found with that id')
    }
  })

  // it('should handle errors in updateUserbyId', async () => {
  //   const errorMessage = 'Database error'

  //   // Stub User.findOneAndUpdate to throw an error
  //   const findOneAndUpdateStub = sinon.stub(User, 'findOneAndUpdate')
  //   findOneAndUpdateStub.throws(errorMessage)
  //   const consoleErrorStub = sinon.stub(console, 'error')

  //   // Call the function with test data
  //   const result = await updateUserById('testId', { name: 'New Name' })

  //   expect(result).to.be.null
  //   expect(consoleErrorStub.calledOnce).to.be.true
  //   expect(consoleErrorStub.firstCall.args[0]).to.contain(`Error updating user: ${errorMessage}`)
  // })

  // it('should catch error in deleteUserById and return null', async () => {
  //   const error = new Error('Test error')
  //   const findOneAndDeleteStub = sinon.stub(User, 'findOneAndDelete').throws(error)
  //   const consoleErrorStub = sinon.stub(console, 'error')

  //   const result = await deleteUserById('user-id')

  //   expect(findOneAndDeleteStub.calledOnceWith({ _id: 'user-id' })).to.be.true
  //   expect(consoleErrorStub.calledOnceWith(error)).to.be.true
  //   expect(result).to.be.null
  // })

  // it('should catch error in deleteUserByEmail and return null', async () => {
  //   const error = new Error('Test error')
  //   const findOneAndDeleteStub = sinon.stub(User, 'findOneAndDelete').throws(error)
  //   const consoleErrorStub = sinon.stub(console, 'error')

  //   const result = await deleteUserByEmail('email')

  //   expect(findOneAndDeleteStub.calledOnceWith({ 'local.email': 'email' })).to.be.true
  //   expect(consoleErrorStub.calledOnceWith(error)).to.be.true
  //   expect(result).to.be.null
  // })
})
