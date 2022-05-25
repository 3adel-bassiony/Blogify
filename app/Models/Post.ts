import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Category from './Category'

export default class Post extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public categoryId: number

    @column()
    public slug: string

    @column()
    public title: string

    @column()
    public content: string

    @column()
    public thumbnail: string | null

    @column()
    public seoDescription: string

    @column()
    public seoKeywords: string

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @belongsTo(() => Category)
    public category: BelongsTo<typeof Category>
}
