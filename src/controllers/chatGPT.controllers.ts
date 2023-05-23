import { Request, Response } from 'express'
import { openai } from '../..'

export const ChatGPT = async (req: Request, res: Response): Promise<any> => {
  console.log(req.body)
  const message: string = req.body.message

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: message }
      ]
    })
    const aiMessage = response.data.choices[0].message.content
    console.log(aiMessage)
    res.status(200).json({ message: aiMessage })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred with ChatGPT API' })
  }
}
