import { Item } from '../models/item.model'

export const addItem = async (name: string, description: string = '', price: number, image_url: string = ''): Promise<Item> => {
  try {
    console.log('trying to add item')
    const item = await Item.create({
      name: name,
      description: description,
      price: price,
      image_url: image_url
    })
    console.log(item)
    return item
  } catch (error) {
    console.error('Error creating item: ' + error)
    throw error
  }
}
