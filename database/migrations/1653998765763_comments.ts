import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'comments'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.text('content', 'longtext')
            table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
            table.integer('post_id').unsigned().references('posts.id').onDelete('CASCADE')
            table.timestamp('created_at', { useTz: true })
            table.timestamp('updated_at', { useTz: true })
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
