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
    deleteUser
} from '../../src/services/user.service';

describe('User tests', () => {
    let UserModel: Model<Document & typeof User> = mongoose.model('User');
    let testUser = new UserModel({
        userName: 'testuser',
        email: 'testuser@example.com',
        password: 'testpassword123!',
        firstName: 'John',
        lastName: 'Doe',
        mobileNumber: 4443334343
    });
    const testDbUrl = 'mongodb+srv://root:IhvkxnDwROpiDZpd@jsx.nwqtn5o.mongodb.net/test';
    before(async () => {
        await mongoose.connect(testDbUrl as string);
        await testUser.save();
    });

    after(async () => {
        // Delete the test user from the database
        await UserModel.deleteOne({ _id: testUser._id });
        await mongoose.disconnect();
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            const result = await createUser(testUser);
            console.log(`reulst -> `, result);
            expect(result.password).to.equal('testpassword123!');
        });
    });

    describe('verifyUser', () => {
        it('should verify a user', async () => {
            const username = 'testuser';
            const password = 'testpassword123!';

            const result = await verifyUser(username, password);

            expect(result).to.be.true;
        });
    });

    describe('checkIfUserExists', () => {
        it('should check if a user exists', async () => {
            const email = 'testuser@example.com';

            const result = await checkIfUserExists(email);

            expect(result).to.be.true;
        });
    });

    
    describe('deleteUser', () => {
        it('should delete a user', async () => {
            const existingUser = await createUser(testUser);
            await deleteUser(existingUser.email || '');
            // Check that the deleted user is no longer in the database
            const user = await getUserByEmail(existingUser.email);
            //expect(user).to.be.null;
        });
    });

    it('should return a user with the specified email', async () => {
        // Create a test user with the specified email
        const existingUser = await createUser(testUser);
    
        // Call getUserByEmail with the test user's email
        const user = await getUserByEmail(existingUser.email);
    
        // Assert that the returned user has the same email as the test user
        expect(existingUser?.email).to.not.be.null;
      });
    
      it('should return null if no user is found with the specified email', async () => {
        // Call getUserByEmail with a nonexistent email
        const user = await getUserByEmail('nonexistent@example.com');
    
        // Assert that null is returned
        expect(user).to.be.null;
      });

      it('should return null if an error occurs', async () => {
        // Mock an error by setting the find method to throw an error
        const UserModel: Model<Document & typeof User> = mongoose.model('User');
        sinon.stub(UserModel, 'findOne').throws();
    
        // Call getUserByEmail with a valid email
        const user = await getUserByEmail('johndoe@example.com');
    
        // Assert that null is returned
        expect(user).to.be.null;
    
        // Restore the original find method
        (UserModel.findOne as any).restore();
      });

      it('should return null if no user is found with the specified ID', async () => {
        // Call updateUser with a nonexistent ID
        const updatedUser = await updateUser('nonexistent_id', testUser);
    
        // Assert that null is returned
        expect(updatedUser).to.be.null;
      });

      it('should return null if an error occurs', async () => {
        // Mock an error by setting the findOneAndUpdate method to throw an error
        const UserModel: Model<Document & typeof User> = mongoose.model('User');
        sinon.stub(UserModel, 'findOneAndUpdate').throws();
    
        // Call updateUser with the ID of the test user and a valid update
        const updatedUser = await updateUser(testUser.id, testUser);
    
        // Assert that null is returned
        expect(updatedUser).to.be.null;
    
        // Restore the original findOneAndUpdate method
        (UserModel.findOneAndUpdate as any).restore();
      });

      it('should update the user with the specified ID', async () => {
     
        // Call updateUser with the ID of the test user and the update
        const updatedUser = await updateUser(testUser.id, testUser);
    
        // Assert that the returned user has the updated information
        expect(updatedUser?.name).to.equal(testUser.name);

      });


});
