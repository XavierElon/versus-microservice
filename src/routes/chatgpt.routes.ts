import express, { Router } from 'express'
import { validateToken } from '../utils/jwt'
import { Checkout } from '../controllers/store.controllers'

export const chatGPTRouter: Router = express.Router()

chatGPTRouter.post('/chatgpt', validateToken, ChatGPT)
