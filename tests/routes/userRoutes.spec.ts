import { expect } from 'chai';
import request from 'supertest';
import express, { Express } from 'express';
import { userRouter } from '../../src/routes/user.routes';
import mongoose, { Model } from 'mongoose';
import sinon from 'sinon';
import { User } from '../../src/models/user.model'
import { connectToDatabase } from '../../src/connections/mongodb';

const app: Express = express();
app.use(express.json());
app.use('/', userRouter);
const testDbUri: string = process.env.TEST_DB_URI!

describe('User Controller', function() {

    let UserModel: Model<Document & typeof User> = mongoose.model('User');
    const userData = new UserModel({
        userName: 'testuser',
        email: 'testuser@example.com',
        password: 'testpassword12334343!',
        firstName: 'John',
        lastName: 'Doe',
        mobileNumber: 4443334343
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
          await User.deleteMany({})
          console.log('USERS DELETED');
          await mongoose.disconnect()
      } catch (error) {
          console.log('Error in after hook: ' + error)
      }
  })

    describe('user routes test suite', () => {
        

    });
});
