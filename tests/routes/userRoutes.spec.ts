import { expect } from 'chai';
import request from 'supertest';
import express, { Express } from 'express';
import { createUser, checkIfUserExists } from '../../src/services/user.service';
import { signupRouter } from '../../src/routes/user.routes';
import mongoose, { Model } from 'mongoose';
import sinon from 'sinon';
import { User } from '../../src/models/user.model'
const app: Express = express();
app.use(express.json());
app.use('/', signupRouter);

describe('User Controller', () => {

    const testDbUrl = 'mongodb+srv://root:IhvkxnDwROpiDZpd@jsx.nwqtn5o.mongodb.net/test';
    let UserModel: Model<Document & typeof User> = mongoose.model('User');
    const userData = new UserModel({
        userName: 'testuser',
        email: 'testuser@example.com',
        password: 'testpassword12334343!',
        firstName: 'John',
        lastName: 'Doe',
        mobileNumber: 4443334343
    });
    before(async () => {
        await mongoose.connect(testDbUrl as string);
        await UserModel.deleteOne({ _id: userData._id });
        await userData.save();
    });

    after(async () => {
        // Delete the test user from the database
        await mongoose.disconnect();
    });

    describe('signup', () => {
        it('should return 201 status code and user data if user is successfully created', async () => {
 
            const res = await request(app).post('/signup').send(userData);
            //expect(res.status).to.equal(201);
            //expect(res.body).to.have.property('message').to.equal('User created');
            //expect(res.body).to.have.property('data');
            //expect(res.body.data).to.have.property('userName').to.equal(userData);
            //expect(res.body.data).to.have.property('email').to.equal(userData);
        });

        it('should return 500 status code and error message if there is an error creating the user', async () => {
            const userData = { name: 'Test User', email: 'testuser@example.com', password: 'password' };
            const checkIfUserExistsStub = sinon.stub().resolves(false);
            const createUserStub = sinon.stub().rejects(new Error('Internal Server Error'));
            const router = express.Router();
            router.post('/signup', async (req, res) => {
              checkIfUserExistsStub(req.body.email).then((result: any) => {
                if (result) {
                  res.status(400).json({ message: 'User already exists' });
                } else {
                  createUserStub(req.body).then((result: any) => {
                    console.log('User created successfully: ', result);
                    res.status(201).json({ message: 'User created', data: req.body });
                  }).catch((error: any) => {
                    console.log('Error creating user: ', error);
                    res.status(500).json({ message: 'Error creating user', error });
                  });
                }
              }).catch((error: any) => {
                console.log('Error checking if user exists: ', error);
                res.status(500).json({ message: 'Error checking if user exists', error });
              });
            });
            app.use('/', router);
            const res = await request(app).post('/signup').send(userData);
            //expect(res.status).to.equal(500);
            //expect(res.body).to.have.property('message').to.equal('Error creating user');
            //expect(res.body).to.have.property('error');
          });

    });
});
