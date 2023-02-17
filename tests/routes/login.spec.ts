import * as mocha from 'mocha';
import * as chai from 'chai';
import { loginRouter } from '../../src/routes/login.routes'
import request from 'supertest';
import * as userServiceModule from '../../src/services/user.service';
import * as sinon from 'sinon';

const expect = chai.expect;

describe('Login Route Test Cases', () => {
let userServiceStub: sinon.SinonStub;

beforeEach(() => {
    userServiceStub = sinon.stub(userServiceModule, 'verifyUser');
});

afterEach(() => {
    userServiceStub.restore();
});

it('returns 200 with a message "Login successful" if login is successful', async () => {
    userServiceStub.returns(true);

    const response = await request(loginRouter)
        .post('/login')
        .send({ username: 'test', password: 'password' });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.equal('Login successful');
}).timeout(5000);  // set a timeout of 5 seconds

it('returns 401 with a message "Incorrect username or password" if login is not successful', async () => {
    userServiceStub.returns(false);

    const response = await request(loginRouter)
        .post('/login')
        .send({ username: 'test', password: 'incorrect_password' });

    expect(response.status).to.equal(401);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.equal('Incorrect username or password');
}).timeout(5000);  // set a timeout of 5 seconds



});