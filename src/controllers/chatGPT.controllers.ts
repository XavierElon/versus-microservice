import { Request, Response } from 'express'
import { openai } from '../..'

export const AddToChatGPTConversation = async (req: Request, res: Response): Promise<any> => {
  const message: string = req.body.message
  const conversationId: string = req.body.conversationID
  const messages: any = req.body.messages

  let role
  let conversation = []
  if (messages.legnth === 0) {
    console.log('messages empty')
    messages.push({ role: 'system', content: 'You are a helpful assistant' })
  } else {
    console.log('messages not empty')
    for (let i = 0; i < messages.length; i++) {
      console.log(messages[i])
      if (messages[i].senderID !== 'chatGGPT-3.5') {
        role = 'user'
      } else {
        role = 'assistant'
      }
      let newMessageObject = {
        role: role,
        content: messages[i].text
      }
      conversation.push(newMessageObject)
    }
  }

  try {
    conversation.push({ role: 'user', content: message })

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: conversation
    })
    console.log(response)
    const aiMessage = response.data.choices[0].message.content
    console.log(aiMessage)
    conversation.push({ role: 'assistant', content: aiMessage })
    res.status(200).json({ message: aiMessage, conversation: conversation })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred with ChatGPT API' })
  }
}
