import { Request, Response } from 'express'
import Stripe from 'stripe'
import { Item } from '../models/item.model'
import { addItem, getAllItems, getItem } from '../services/item.service'

const FRONT_END_URL: string = process.env.FRONT_END_URL

const STRIPE_KEY: string = process.env.STRIPE_SECRET_KEY || ''

const stripe = new Stripe(STRIPE_KEY, {
  apiVersion: '2022-11-15'
})

export const Checkout = async (req: Request, res: Response): Promise<any> => {
  console.log(req.body)
  const items = req.body.items
  let lineItems: any[] = []
  items.forEach((item: any) => {
    lineItems.push({
      price: item.id,
      quantity: item.quantity
    })
  })
  console.log(lineItems)

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: 'payment',
    success_url: `${FRONT_END_URL}/store/success`,
    cancel_url: `${FRONT_END_URL}/store/cancel`
  })

  res.status(200).send(JSON.stringify({ url: session.url }))
}

export const GetAllItems = async (req: Request, res: Response): Promise<void> => {
  console.log('here')
  getAllItems()
    .then((items) => {
      console.log(items)
      res.status(200).json({ message: 'Items retrieved', data: items })
    })
    .catch((error) => {
      console.error(error)
      res.status(500).json({ error: 'Error retrieving iteems: ' + error })
    })
}

export const GetItem = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id)
  getItem(id)
    .then((item) => {
      if (item) {
        res.status(200).json({ message: 'Item retrieved', data: item })
      } else {
        res.status(404).json({ message: 'Item not found' })
      }
    })
    .catch((error) => {
      console.error(error)
      res.status(500).json({ error: 'Error retrieving item: ' + error })
    })
}

export const AddItem = async (req: Request, res: Response): Promise<void> => {
  console.log(req.body)
  const { userID, name, description, price, image_url } = req.body
  addItem(userID, name, description, price, image_url)
    .then((result) => {
      console.log(result)
      res.status(201).json({ message: 'Item added successfully', data: result })
    })
    .catch((error) => {
      console.error('Error adding item: ' + error)
      return res.status(500).json({ error: 'Error creating new item' })
    })
}
