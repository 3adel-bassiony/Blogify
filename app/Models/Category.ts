import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Post from './Post'

export default class Category extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public slug: string

    @column()
    public title: string

    @column()
    public description: string

    @column()
    public thumbnail: string | null

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @hasMany(() => Post)
    public posts: HasMany<typeof Post>
}
