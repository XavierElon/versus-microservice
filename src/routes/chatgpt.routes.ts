import express, { Router } from 'express'
import { validateToken } from '../utils/jwt'
import { CreateChatGPTConversation } from '../controllers/chatGPT.controllers'

export const chatGPTRouter: Router = express.Router()

chatGPTRouter.post('/chatgpt', CreateChatGPTConversation)

// chatGPTRouter.post('/chatGPT/:id/chat/:id', ChatGPTConverstation)
