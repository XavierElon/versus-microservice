// @ts-nocheck

import { expect } from 'chai'
import mongoose, { Model } from 'mongoose'
import sinon from 'sinon'
import { User } from '../../src/models/user.model'
import {
  createUser,
  verifyUser,
  checkIfUserExists,
  getUserByEmail,
  deleteUserByEmail,
  deleteUserById,
  getAllUsers,
  getUserById,
  getLocalUser,
  getGoogleUser,
  updateUserById,
  confirmUser,
  deleteUnconfirmedUsers
} from '../../src/services/user.service'
import { connectToDatabase } from '../../src/connections/mongodb'

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
    provider: 'local'
  })

  const testUser2 = new UserModel({
    local: {
      email: 'testuser2@gmail.com',
      password: 'Testpassword123!',
      firstName: 'Elon',
      lastName: 'Musk'
    },
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

  // it('should return a google user', async () => {
  //   const res = await getGoogleUser(userId)
  //   expect(res._id.toString()).to.equal(userId.toString())
  // })

  it('should verify a local user exists and return true', async () => {
    const res = await checkIfUserExists(userEmail)
    expect(res).to.equal(true)
  })

  // it('should verify a google user exists and return true', async () => {
  //   const res = await checkIfUserExists(userEmail)
  //   expect(res).to.equal(true)
  // })

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
})
