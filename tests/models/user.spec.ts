

/*
UNCCOMMENT TO SEE ERROR, TYRING TO COVER THE CREATE USER FUNCTION FROM THE USER.SERVICE.TS FILE


import { expect } from 'chai'
import { User } from '../../src/models/user.model'
import { createUser } from '../../src/services/user.service'

describe('createUser()', () => {
  it('should create a new user and save it to the database', async () => {
    
    const userData = new User({
        userName: 'JDoe',
        email: 'john.doe@example.com',
        password: 'password123!',
        firstName: 'John',
        lastName: 'Doe',
        mobileNumber: 4443334343
      });

    const createdUser = await createUser(userData)

    expect(createdUser).to.be.an('object')
    expect(createdUser).to.have.property('firstName', 'John')
    expect(createdUser).to.have.property('lastName', 'Doe')
    expect(createdUser).to.have.property('email', 'johndoe@example.com')
    expect(createdUser).to.have.property('mobileNumber', 1234567890)
    expect(createdUser).to.have.property('userName', 'johndoe')
  })
})
*/