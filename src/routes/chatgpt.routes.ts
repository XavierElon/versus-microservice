import express, { Router } from 'express'
import { validateToken } from '../utils/jwt'
import { AddToChatGPTConversation3, AddToChatGPTConversation4 } from '../controllers/chatGPT.controllers'

export const chatGPTRouter: Router = express.Router()

chatGPTRouter.post('/chatgpt3', AddToChatGPTConversation3)

chatGPTRouter.post('/chatgpt4', AddToChatGPTConversation4)
