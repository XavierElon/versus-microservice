import express, { Router } from 'express'
import { validateToken } from '../utils/jwt'
import { Checkout } from '../controllers/store.controllers'
import { AddItem, GetAllItems, GetItem } from '../controllers/store.controllers'

export const storeRouter: Router = express.Router()

storeRouter.post('/checkout', validateToken, Checkout)

storeRouter.get('/items', GetAllItems)

storeRouter.get('/items/:id', GetItem)

storeRouter.post('/addItem', AddItem)
