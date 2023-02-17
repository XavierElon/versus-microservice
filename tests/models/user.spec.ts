import * as mocha from 'mocha';
import * as chai from 'chai';
import { userSchema } from '../../src/models/user.model'
import { ErrorMessage } from '../../src/structures/types'
import * as mongoose from 'mongoose'

const error = new ErrorMessage();
const User = mongoose.model('User', userSchema)
const expect = chai.expect;



describe('User Schema Test Cases', () => {
    it('validates required fields', () => {
        const testUser = new User({});
        const validationResult = testUser.validateSync();
        if (validationResult !== null) {
            expect(validationResult.errors).to.have.property('firstName');
            expect(validationResult.errors).to.have.property('lastName');
            expect(validationResult.errors).to.have.property('email');
            expect(validationResult.errors).to.have.property('mobileNumber');
            expect(validationResult.errors).to.have.property('userName');
            expect(validationResult.errors).to.have.property('password');
        }
    });
    it('validates email with a valid email', () => {
        const testUser = new User({ email: 'example@domain.com' });
        const validationResult = testUser.validateSync();
        if (validationResult !== null) {
            expect(validationResult).to.not.have.property('email');
        }
    });
    it('validates email with an invalid email', () => {
        const testUser = new User({ email: 'example-domain.com' });
        const validationResult = testUser.validateSync();
        if (validationResult !== null) {
            expect(validationResult.errors).to.have.property('email');
            expect(validationResult.errors.email.message).to.equal(error.email);
        }
    });
    it('validates firstName with a valid name', () => {
        const testUser = new User({ firstName: 'John' });
        const validationResult = testUser.validateSync();
        if (validationResult !== null) {
            expect(validationResult).to.not.have.property('firstName');
        }
    });

    it('validates firstName with an invalid name', () => {
        const testUser = new User({ firstName: '1234' });
        const validationResult = testUser.validateSync();
        if (validationResult !== null) {
            expect(validationResult.errors).to.have.property('firstName');
            expect(validationResult.errors.firstName.message).to.equal(error.firstName);
        }
    });
    it('validates lastName with a valid name', () => {
        const testUser = new User({ lastName: 'Doe' });
        const validationResult = testUser.validateSync();
        if (validationResult !== null) {
            expect(validationResult).to.not.have.property('lastName');
        }
    });
    it('validates lastName with an invalid name', () => {
        const testUser = new User({ lastName: '1234' });
        const validationResult = testUser.validateSync();
        if (validationResult !== null) {
            expect(validationResult.errors).to.have.property('lastName');
            expect(validationResult.errors.lastName.message).to.equal(error.lastName);
        }
    });
    it('validates username with a valid name', () => {
        const testUser = new User({ userName: 'johndoe123' });
        const validationResult = testUser.validateSync();
        if (validationResult !== null) {
            expect(validationResult).to.not.have.property('userName');
        }
    });

    it('validates username with an invalid name', () => {
        const testUser = new User({ userName: 'john doe 123' });
        const validationResult = testUser.validateSync();
        if (validationResult !== null) {
            expect(validationResult.errors).to.have.property('userName');
            expect(validationResult.errors.userName.message).to.equal(error.userName);
        }
    });

    it('validates password with a valid password', () => {
        const testUser = new User({ password: 'Johndoe123!' });
        const validationResult = testUser.validateSync();
        if (validationResult !== null) {
            expect(validationResult).to.not.have.property('password');
        }
    });

    it('validates password with an invalid password', () => {
        const testUser = new User({ password: 'johndoe' });
        const validationResult = testUser.validateSync();
        if (validationResult !== null) {
            expect(validationResult.errors).to.have.property('password');
            expect(validationResult.errors.password.message).to.equal(error.password);
        }
    });

    it('validates mobile number with a valid number', () => {
        const testUser = new User({ mobileNumber: '1234567890' });
        const validationResult = testUser.validateSync();
        if (validationResult !== null) {
            expect(validationResult).to.not.have.property('mobileNumber');
        }
    });

    it('validates mobile number with an invalid number', () => {
        const testUser = new User({ mobileNumber: '123456789' });
        const validationResult = testUser.validateSync();
        if (validationResult !== null) {
            expect(validationResult.errors).to.have.property('mobileNumber');
            expect(validationResult.errors.mobileNumber.message).to.equal(error.mobileNumber);
        }
    });

});

