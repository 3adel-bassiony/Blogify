import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class ApiToken extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public userId: number

    @column()
    public name: string

    @column()
    public type: string

    @column()
    public token: string

    @column.dateTime()
    public expiresAt: DateTime

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @belongsTo(() => User)
    public category: BelongsTo<typeof User>
}
