// @ts-nocheck

/*
THIS CLASS COVERS THE USER SERVICE FILE
*/

import { expect } from 'chai';
import mongoose, { Model } from 'mongoose';
import sinon from 'sinon';
import { User } from '../../src/models/user.model'
import {
    createUser, verifyUser, checkIfUserExists,  getUserByEmail,
    deleteUserByEmail,
    deleteUserById,
    getAllUsers,
    getUserById,
    getLocalUser,
    getGoogleUser,
    updateUserById,
    confirmUser,
    deleteUnconfirmedUsers
} from '../../src/services/user.service';
import { connectToDatabase } from '../../src/connections/mongodb';

const testDbUri: string = process.env.TEST_DB_URI!

describe('User service test suite', function() {
    let UserModel: Model<Document & typeof User> = mongoose.model('User');
    let testUser = new UserModel({
      local: {
        email: 'testuser@gmail.com',
        password: 'Testpassword123!',
        firstName: 'John',
        lastName: 'Doe'
      },
      provider: "local"
    });

    let testUser2 = new UserModel({
      local: {
        email: 'testuser2@gmail.com',
        password: 'Testpassword123!',
        firstName: 'Elon',
        lastName: 'Musk'
      },
      provider: "local"
    });
    const dateString = '2023-05-08T00:00:00.000Z';
    const date = new Date(dateString);

    let testUser3 = new UserModel({
      local: {
        email: 'testuser3@gmail.com',
        password: 'Testpassword123!',
        firstName: 'Elon',
        lastName: 'Musk',
        confirmationTokenExpirationTime: date
      },
      provider: "local"
    });
    const userEmail: string = 'testuser@gmail.com'
    let userId: string
    let confirmationCode


    this.timeout(5000);

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
          console.log('USERS DELETED');
          await mongoose.disconnect()
      } catch (error) {
          console.log('Error in after hook: ' + error)
      }
    })

        it('should create 2 new users and expect first name to equal John adn email to equal testuser2@gmail.com', async () => {
            const result = await createUser(testUser);
            console.log(result);
            confirmationCode = result.local.confirmationCode
            expect(result.local.firstName).to.equal('John')
            const result2 = await createUser(testUser2);
            console.log(result2);
            expect(result2.local.email).to.equal('testuser2@gmail.com')
        });

        it('should return all newsletter users (2)', async () => {
          const result = await getAllUsers()
          console.log(result)
          expect(result.length).to.equal(2)
        });

        it('should return a single user by email', async () => {
          const res = await getUserByEmail(userEmail)
          console.log(res)
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
          const res = await updateUserById(userId, {'local.lastName': 'Musk'})
          console.log(res.local.lastName)
          expect(res.local.lastName).to.equal('Musk')
        })

        it('should update a user by id first name to Achilles', async () => {
          const res = await updateUserById(userId, {'local.firstName': 'Achilles'})
          console.log(res.local.firstName)
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
        await createUser(testUser3);
        await deleteUnconfirmedUsers()
        const allUsers = await getAllUsers()
        expect(allUsers.length).to.equal(0)
    })

      

});

// describe('user service stub errors test suite', () => {
      
//   it('should return a user with the specified email', async () => {
//     // Create a test user with the specified email
//     const existingUser = await createUser(testUser);

//     // Call getUserByEmail with the test user's email
//     const user = await getUserByEmail(existingUser.email);

//     // Assert that the returned user has the same email as the test user
//     expect(existingUser?.email).to.not.be.null;
//   });

//   it('should return null if no user is found with the specified email', async () => {
//     // Call getUserByEmail with a nonexistent email
//     const user = await getUserByEmail('nonexistent@example.com');

//     // Assert that null is returned
//     expect(user).to.be.null;
//   });

//   it('should return null if an error occurs', async () => {
//     // Mock an error by setting the find method to throw an error
//     const UserModel: Model<Document & typeof User> = mongoose.model('User');
//     sinon.stub(UserModel, 'findOne').throws();

//     // Call getUserByEmail with a valid email
//     const user = await getUserByEmail('johndoe@example.com');

//     // Assert that null is returned
//     expect(user).to.be.null;

//     // Restore the original find method
//     (UserModel.findOne as any).restore();
//   });

//   it('should return null if no user is found with the specified ID', async () => {
//     // Call updateUser with a nonexistent ID
//     const updatedUser = await updateUser('nonexistent_id', testUser);

//     // Assert that null is returned
//     expect(updatedUser).to.be.null;
//   });

//   it('should return null if an error occurs', async () => {
//     // Mock an error by setting the findOneAndUpdate method to throw an error
//     const UserModel: Model<Document & typeof User> = mongoose.model('User');
//     sinon.stub(UserModel, 'findOneAndUpdate').throws();

//     // Call updateUser with the ID of the test user and a valid update
//     const updatedUser = await updateUser(testUser.id, testUser);

//     // Assert that null is returned
//     expect(updatedUser).to.be.null;

//     // Restore the original findOneAndUpdate method
//     (UserModel.findOneAndUpdate as any).restore();
//   });

//   it('should update the user with the specified ID', async () => {
 
//     // Call updateUser with the ID of the test user and the update
//     const updatedUser = await updateUser(testUser.id, testUser);

//     // Assert that the returned user has the updated information
//     expect(updatedUser?.name).to.equal(testUser.name);

//   });

// })

