import express, { Router } from 'express'
import { validateToken } from '../utils/jwt'
import { ChatGPT } from '../controllers/chatGPT.controllers'

export const chatGPTRouter: Router = express.Router()

chatGPTRouter.post('/chatgpt', ChatGPT)

// chatGPTRouter.post('/chatGPT/:id/chat/:id', ChatGPTConverstation)
