import { expect } from 'chai'
import sinon from 'sinon'
import chai from 'chai'
import * as jwt from 'jsonwebtoken'
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

    sinon.stub(jwt, 'verify').returns(validToken)

    const { validateToken } = proxyquire('../middleware', { jsonwebtoken: jwt })

    await validateToken(mockRequest, mockResponse, mockNext)

    expect(mockNext.calledOnce).to.be.true
    expect(mockRequest.user).to.deep.equal(validToken)
    expect(mockRequest.authenticated).to.be.true

    jwt.verify.restore()
  })
})
