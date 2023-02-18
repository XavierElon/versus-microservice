/*
import chai from 'chai'
import chaiHttp from 'chai-http'
import express, { Request, Response } from 'express'
import { signupRouter } from '../../src/routes/signup.routes'

chai.use(chaiHttp)

const expect = chai.expect
const app = express()
app.use('/signup', signupRouter)

describe('GET /signup', () => {
  it('should return 200 status code and message', (done) => {
    chai.request(app)
      .get('/signup')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res.body.message).to.equal('Signup page')
        done()
      })
  })
})
*/
