import { AutoIncrement, Column, Model, PrimaryKey, Table } from 'sequelize-typescript'

@Table
export class Item extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number

  @Column({ allowNull: false })
  name: string

  @Column
  description: string

  @Column
  price: number

  @Column
  image_url: string
}
