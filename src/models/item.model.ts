import { Column, Model, Table } from 'sequelize-typescript'

@Table
export class Item extends Model {
  @Column
  name: string

  @Column
  description: string

  @Column
  price: number

  @Column
  image_url: string
}
