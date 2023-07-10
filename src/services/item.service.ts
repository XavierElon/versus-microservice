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

export const getItem = async (id: number): Promise<Item | null> => {
  try {
    const item = await Item.findByPk(id)
    return item
  } catch (error) {
    console.error('Error retrieving item: ' + error)
    throw error
  }
}

export const addItem = async (userID: string, name: string, description: string = '', price: number, image_url: string = ''): Promise<Item> => {
  try {
    const item = await Item.create({
      userID: userID,
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

export const deleteItem = async (id: number): Promise<void> => {
  try {
    const item = await Item.findByPk(id)

    if (item) {
      await item.destroy()
      console.log(`Item with id ${id} deleted.`)
    } else {
      console.log('No item found to delete.')
    }
  } catch (error) {
    console.error('Error deleting item:', error)
    throw error
  }
}
