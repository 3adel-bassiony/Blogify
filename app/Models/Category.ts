import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Post from './Post'
import User from './User'

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

    @column()
    public userId: number

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @belongsTo(() => User)
    public user: BelongsTo<typeof User>

    @hasMany(() => Post)
    public posts: HasMany<typeof Post>
}
