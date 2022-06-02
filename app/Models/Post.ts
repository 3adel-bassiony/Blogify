import { DateTime } from 'luxon'
import {
    BaseModel,
    column,
    belongsTo,
    BelongsTo,
    hasMany,
    HasMany,
    beforeFind,
    beforeFetch,
    ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import Category from './Category'
import User from './User'
import Comment from './Comment'

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

    @column.dateTime({ autoCreate: true })
    public publishedAt: DateTime

    @column.dateTime({ serializeAs: null })
    public deletedAt: DateTime

    @belongsTo(() => Category)
    public category: BelongsTo<typeof Category>

    @belongsTo(() => User)
    public user: BelongsTo<typeof User>

    @hasMany(() => Comment)
    public comments: HasMany<typeof Comment>

    @beforeFind()
    @beforeFetch()
    public static softDeletesFind = (query: ModelQueryBuilderContract<typeof BaseModel>) => {
        query.whereNull('deleted_at').andWhere('published_at', '<=', DateTime.local().toSQL())
    }
}
