import express, { Request, Response, NextFunction } from 'express';
import { expect } from 'chai';
import sinon from 'sinon';
import supertest from 'supertest';

import { loginRouter } from '../../src/routes/login.routes'
import * as userService from '../../src/services/user.service';

describe('POST /login', () => {
  let app: express.Application;
  let verifyUserStub: sinon.SinonStub;

  before(() => {
    // Create a new Express app and use the loginRouter
    app = express();
    app.use(express.json());
    app.use(loginRouter);

    // Stub the verifyUser function
    verifyUserStub = sinon.stub(userService, 'verifyUser');
  });

  after(() => {
    // Restore the verifyUser function
    verifyUserStub.restore();
  });

  it('should return 200 with success message when login is successful', async () => {
    // Stub the verifyUser function to return true
    verifyUserStub.resolves(true);

    // Make a POST request to /login with valid credentials
    const response = await supertest(app)
      .post('/login')
      .send({ username: 'testuser', password: 'testpassword' });

    // Assert that the response status is 200 and the message is 'Login successful'
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({ message: 'Login successful' });
  });

  it('should return 401 with error message when login fails', async () => {
    // Stub the verifyUser function to return false
    verifyUserStub.resolves(false);

    // Make a POST request to /login with invalid credentials
    const response = await supertest(app)
      .post('/login')
      .send({ username: 'testuser', password: 'wrongpassword' });

    // Assert that the response status is 401 and the message is 'Incorrect username or password'
    expect(response.status).to.equal(401);
    expect(response.body).to.deep.equal({ message: 'Incorrect username or password' });
  });
});
