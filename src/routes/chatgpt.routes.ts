import express, { Router } from 'express'
import { validateToken } from '../utils/jwt'
import { AddToChatGPTConversation } from '../controllers/chatGPT.controllers'

export const chatGPTRouter: Router = express.Router()

chatGPTRouter.post('/chatgpt', AddToChatGPTConversation)

// chatGPTRouter.post('/chatGPT/:id/chat/:id', ChatGPTConverstation)
