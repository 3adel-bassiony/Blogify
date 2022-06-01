import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
    protected tableName = 'users'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table.string('name', 255).notNullable()
            table.string('username', 255).notNullable()
            table.string('email', 255).notNullable()
            table.string('phone', 255).nullable()
            table.string('password', 180).notNullable()
            table.string('remember_me_token').nullable()
            table.string('avatar', 180).nullable()
            table.boolean('is_verified').nullable()
            table.timestamp('created_at', { useTz: true }).notNullable()
            table.timestamp('updated_at', { useTz: true }).notNullable()
            table.dateTime('deleted_at').defaultTo(null)
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
