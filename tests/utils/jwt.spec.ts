import { expect } from 'chai'
import sinon from 'sinon'
import chai from 'chai'
import jest from 'jest'
import * as jwtWrapper from '../../src/middleware/jwtWrapper'
import proxyquire from 'proxyquire'
import { createLocalToken, createGoogleAuthToken, validateToken } from '../../src/utils/jwt'

describe('JWT utils suite', function () {
  const localUser: any = {
    local: {
      email: 'xavier@gmail.com',
      id: '645c0a02529eefc721d3e308'
    }
  }

  const googleUser: any = {
    firebaseGoogle: {
      email: 'xavier@gmail.com',
      firebaseUid: '9nerH93NsQVn763sNbb5ReaBBtf2'
    }
  }

  afterEach(() => {
    sinon.restore()
  })

  it('should return a local access token', () => {
    const accessToken = createLocalToken(localUser)
    expect(accessToken.length).to.equal(164)
  })

  it('should try to create a local access token with an empty body and return null', () => {
    const accessToken = createLocalToken({})
    expect(accessToken).to.be.null
  })

  it('should return a google auth token', () => {
    const accessToken = createGoogleAuthToken(googleUser)
    expect(accessToken.length).to.equal(164)
  })

  it('should try to create a google access token with an empty body and return null', () => {
    const accessToken = createGoogleAuthToken({})
    expect(accessToken).to.be.null
  })

  it('should pass the request to the next middleware when the token is valid', async () => {
    const validToken = { id: 1, email: 'test@example.com' }

    const mockRequest = {
      cookies: {
        'user-token': 'testToken'
      },
      authenticated: false,
      user: ''
    }

    const mockResponse = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis()
    }

    const mockNext = sinon.stub()

    sinon.stub(jwtWrapper, 'verify').returns(validToken)

    await validateToken(mockRequest, mockResponse, mockNext)

    expect(mockNext.calledOnce).to.be.true
    expect(mockRequest.user).to.deep.equal(validToken)
    expect(mockRequest.authenticated).to.be.true
  })

  it('should respond with an error when the token is invalid', async () => {
    const mockRequest = {
      cookies: {
        'user-token': 'testToken'
      },
      authenticated: false,
      user: ''
    }

    const mockResponse = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis()
    }

    const mockNext = sinon.stub()

    sinon.stub(jwtWrapper, 'verify').throws(new Error('Invalid token'))

    await validateToken(mockRequest, mockResponse, mockNext)

    expect(mockResponse.status.calledOnceWith(400)).to.be.true
    expect(mockNext.called).to.be.false
  })

  it('should respond with an error when the user-token cookie is not present', async () => {
    const mockRequest = {
      cookies: {},
      authenticated: false,
      user: ''
    }

    const mockResponse = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis()
    }

    const mockNext = sinon.stub()

    await validateToken(mockRequest, mockResponse, mockNext)

    expect(mockResponse.status.calledOnceWith(400)).to.be.true
    expect(mockResponse.json.calledOnceWith({ error: 'User not authenticated' })).to.be.true
    expect(mockNext.called).to.be.false
  })

  it('should handle the case where the token is invalid', async () => {
    const invalidToken = null

    const mockRequest = {
      cookies: {
        'user-token': 'testToken'
      },
      authenticated: false,
      user: ''
    }

    const mockResponse = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis()
    }

    const mockNext = sinon.stub()

    sinon.stub(jwtWrapper, 'verify').returns(invalidToken)

    await validateToken(mockRequest, mockResponse, mockNext)

    expect(mockNext.called).to.be.false
    expect(mockResponse.status.calledWith(400)).to.be.true
    expect(mockResponse.json.calledWith({ error: 'Invalid token' })).to.be.true
  })
})
