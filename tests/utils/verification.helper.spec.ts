import { expect } from 'chai'
import { validateEmail, validateName, validatePhone, validatePassword } from '../../src/utils/verification.helper'

describe('Verification helper utils suite', function () {
  const validPhone: string = '8134047327'
  const invalidPhone: string = '1293491242135'
  const validPassword: string = 'Password123!'
  const invalidPassword: string = '1293491242135f'
  const validEmail: string = 'xavier@gmail.com'
  const invalidEmail: string = 'Xavier@gmail'
  const validName: string = 'XXX'
  const invalidName: string = 'X123'

  it('should validate phone number and return true', () => {
    const res = validatePhone(validPhone)
    expect(res).to.be.true
  })

  it('should validate phone and return false', () => {
    const res = validatePhone(invalidPhone)
    expect(res).to.be.false
  })

  it('should validate a password and return true', () => {
    const res = validatePassword(validPassword)
    expect(res).to.be.true
  })

  it('should validate a password and return false', () => {
    const res = validatePhone(invalidPassword)
    expect(res).to.be.false
  })

  it('should validate an email and return true', () => {
    const res = validateEmail(validEmail)
    expect(res).to.be.true
  })

  it('should validate an email and return false', () => {
    const res = validateEmail(invalidEmail)
    expect(res).to.be.false
  })

  it('should validate a name and return true', () => {
    const res = validateName(validName)
    expect(res).to.be.true
  })

  it('should validate a name and return false', () => {
    const res = validateName(invalidName)
    expect(res).to.be.false
  })
})
