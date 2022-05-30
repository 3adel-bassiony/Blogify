import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Category from './Category'
import Post from './Post'

export default class User extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public name: string

    @column()
    public username: string

    @column()
    public email: string

    @column()
    public phone: string

    @column({ serializeAs: null })
    public password: string

    @column()
    public rememberMeToken?: string

    @column()
    public isVerified: boolean

    @column()
    public avatar: string

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @hasMany(() => Category)
    public categories: HasMany<typeof Category>

    @hasMany(() => Post)
    public posts: HasMany<typeof Post>

    @beforeSave()
    public static async hashPassword(user: User) {
        if (user.$dirty.password) {
            user.password = await Hash.make(user.password)
        }
    }
}
