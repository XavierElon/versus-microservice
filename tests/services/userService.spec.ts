// @ts-nocheck

/*
THIS CLASS COVERS THE USER SERVICE FILE
*/

import { expect } from 'chai';
import mongoose, { Model } from 'mongoose';
import sinon from 'sinon';
import { User } from '../../src/models/user.model'
import {
    createUser, verifyUser, checkIfUserExists, updateUser, getUserByEmail,
    deleteUser,
    getAllUsers,
    getUserById,
    getLocalUser,
    getGoogleUser
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
    const userEmail: string = 'testuser@gmail.com'
    let userId: string
    const userPassword: string =  'Testpassword123!'

    let updatedTesttUser = new UserModel({
      local: {
        firstName: 'Achilles',
      
      }
    });


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
          // await User.deleteMany({})
          console.log('USERS DELETED');
          await mongoose.disconnect()
      } catch (error) {
          console.log('Error in after hook: ' + error)
      }
    })

        // it('should create 2 new users and expect first name to equal John adn email to equal testuser2@gmail.com', async () => {
        //     const result = await createUser(testUser);
        //     console.log(result);
        //     expect(result.local.firstName).to.equal('John')
        //     const result2 = await createUser(testUser2);
        //     console.log(result2);
        //     expect(result2.local.email).to.equal('testuser2@gmail.com')
        // });

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

        it('should update a user first name to Achilles', async () => {
          const res = await updateUser(userId, {'local.firstName': 'Achilles'})
          console.log(res.local.firstName)
          expect(res.local.firstName).to.equal("Achilles")
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

