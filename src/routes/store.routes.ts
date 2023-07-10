import express, { Router } from 'express'
import { validateToken } from '../utils/jwt'
import { AddItem, Checkout, DeleteItem, GetAllItems, GetItem, UpdateItem } from '../controllers/store.controllers'

export const storeRouter: Router = express.Router()

storeRouter.post('/checkout', validateToken, Checkout)

storeRouter.get('/items', GetAllItems)

storeRouter.get('/items/:id', GetItem)

storeRouter.post('/addItem', AddItem)

storeRouter.put('/items/:id', UpdateItem)

storeRouter.delete('/items/:id', DeleteItem)
