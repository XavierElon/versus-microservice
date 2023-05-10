import { expect } from 'chai'
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
  })

  it('should try to create a google access token with an empty body and return null', () => {
    const accessToken = createLocalToken({})
    expect(accessToken).to.be.null
  })
})
