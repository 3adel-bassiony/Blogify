import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'categories'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.string('slug')
            table.string('title')
            table.text('description')
            table.string('thumbnail')
            table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
            table.timestamp('created_at', { useTz: true })
            table.timestamp('updated_at', { useTz: true })
            table.timestamp('deleted_at').defaultTo(null)
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
