import { DateTime } from 'luxon'
import {
    BaseModel,
    column,
    belongsTo,
    BelongsTo,
    beforeFind,
    beforeFetch,
    ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import Post from './Post'
import User from './User'

export default class Bookmark extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public userId: number

    @column()
    public postId: number

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @column.dateTime({ serializeAs: null })
    public deletedAt: DateTime

    @belongsTo(() => User)
    public user: BelongsTo<typeof User>

    @belongsTo(() => Post)
    public post: BelongsTo<typeof Post>

    @beforeFind()
    @beforeFetch()
    public static withoutSoftDeletes = (query: ModelQueryBuilderContract<typeof Bookmark>) => {
        query.whereNull('deleted_at')
    }
}
