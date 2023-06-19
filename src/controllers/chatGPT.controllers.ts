import { Request, Response } from 'express'
import { openai } from '../..'

let conversation = [{ role: 'system', content: 'You are a helpful assistant' }]

export const CreateChatGPTConversation = async (req: Request, res: Response): Promise<any> => {
  const message: string = req.body.message

  try {
    conversation.push({ role: 'user', content: message })
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: conversation
    })
    const aiMessage = response.data.choices[0].message.content
    console.log(aiMessage)
    res.status(200).json({ message: aiMessage, conversation: conversation })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred with ChatGPT API' })
  }
}
