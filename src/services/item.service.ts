import { Item } from '../models/item.model'

export const getAllItems = async (): Promise<Item[]> => {
  try {
    const items = await Item.findAll()
    console.log(items)
    return items
  } catch (error) {
    console.error('Error retrieving items: ' + error)
    throw error
  }
}

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
