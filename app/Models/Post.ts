import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Category from './Category'
import User from './User'

export default class Post extends BaseModel {
    @column({ isPrimary: true })
    public id: number

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

    @column()
    public categoryId: number

    @column()
    public userId: number

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @belongsTo(() => Category)
    public category: BelongsTo<typeof Category>

    @belongsTo(() => User)
    public user: BelongsTo<typeof User>
}
